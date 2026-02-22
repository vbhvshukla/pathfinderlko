const Magazine = require('../models/magazine.model')
const { configureCloudinary } = require('../config/cloudinary.config')
const fs = require('fs')
const { pipeline } = require('stream')
const { Readable } = require('stream')

//accept crow
async function createMagazine(req, res) {
  try {
    // accepts multipart with PDF and cover files. Otherwise expects downloadUrl (PDF) — cover is required
    const cloudinary = configureCloudinary()
    const { title, downloadUrl, featured, publishedAt } = req.body

    if (!title) return res.status(400).json({ message: 'Missing title' })

    // determine downloadUrl: if PDF file uploaded, upload to cloud and use resulting URL
    let resolvedDownloadUrl = downloadUrl
    const pdfFile = req.files && req.files.file && req.files.file[0]
    const coverFile = req.files && req.files.cover && req.files.cover[0]

    if (!coverFile) return res.status(400).json({ message: 'Missing cover image (upload a cover image)' })

    if (pdfFile) {
      const filePath = pdfFile.path
      let uploadPath = filePath

      // ensure the upload path exists; if compressed file is missing, fall back to original
      if (!fs.existsSync(uploadPath)) uploadPath = filePath

      // helper: upload a file via stream to Cloudinary and return result
      const uploadStream = (path, options) => {
        return new Promise((resolve, reject) => {
          if (!fs.existsSync(path)) return reject(new Error('ENOENT'))
          const read = fs.createReadStream(path)
          read.on('error', err => reject(err))
          const stream = cloudinary.uploader.upload_stream(options, (err, res) => {
            if (err) return reject(err)
            resolve(res)
          })
          read.pipe(stream)
        })
      }

      let result
      try {
        result = await uploadStream(uploadPath, { folder: process.env.CLOUDINARY_FOLDER || 'magazines', resource_type: 'auto' })
        console.log("Result of upload1-->", result);
      } catch (uploadErr) {
        const msg = uploadErr && (uploadErr.message || uploadErr.name || '')
        if (uploadErr && uploadErr.code === 'ENOENT') {
          // compressed file missing — try original
          result = await uploadStream(filePath, { folder: process.env.CLOUDINARY_FOLDER || 'magazines', resource_type: 'auto' })
          console.log("Result of uplaod2-->", result);
        } else if ((uploadErr && uploadErr.http_code === 400) || /Maximum is/i.test(msg)) {
          // try upload_large from existing path or original
          const pathForLarge = fs.existsSync(uploadPath) ? uploadPath : filePath
          result = await cloudinary.uploader.upload_large(pathForLarge, { folder: process.env.CLOUDINARY_FOLDER || 'magazines', resource_type: 'auto' })
        } else {
          throw uploadErr
        }
      }
      // cleanup temporary files
      try { fs.unlinkSync(filePath) } catch (e) {}
      if (uploadPath !== filePath) {
        try { fs.unlinkSync(uploadPath) } catch (e) {}
      }
      resolvedDownloadUrl = result.secure_url
    }

    // determine imageUrl: if cover file uploaded, upload to cloud and use resulting URL
    let resolvedImageUrl = undefined
    if (coverFile) {
      const coverPath = coverFile.path
      // same fallback for cover image if needed
      let r
      try {
        r = await cloudinary.uploader.upload(coverPath, { folder: process.env.CLOUDINARY_FOLDER || 'magazines/covers', resource_type: 'image' })
      } catch (uploadErr) {
        const msg = uploadErr && (uploadErr.message || uploadErr.name || '')
        if ((uploadErr && uploadErr.http_code === 400) || /Maximum is/i.test(msg)) {
          try {
            r = await cloudinary.uploader.upload_large(coverPath, { folder: process.env.CLOUDINARY_FOLDER || 'magazines/covers', resource_type: 'image' })
          } catch (largeErr) {
            throw largeErr
          }
        } else {
          throw uploadErr
        }
      }
      fs.unlink(coverPath, err => { if (err) console.warn('Failed to remove temp file', coverPath, err.message || err) })
      resolvedImageUrl = r.secure_url
    }

    if (!resolvedDownloadUrl) return res.status(400).json({ message: 'Missing pdf (upload a file) or provide downloadUrl' })

    const mag = await Magazine.create({
      title,
      imageUrl: resolvedImageUrl || undefined,
      downloadUrl: resolvedDownloadUrl,
      featured: featured === 'true' || featured === true,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    })

    const populated = await Magazine.findById(mag._id)
    return res.status(201).json({ magazine: populated })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: err && err.message ? err.message : 'Server error' })
  }
}

async function listMagazines(req, res) {
  try {
    const mags = await Magazine.find().sort({ publishedAt: -1 })
    return res.json({ magazines: mags })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: err && err.message ? err.message : 'Server error' })
  }
}

async function downloadMagazine(req, res) {
  try {
    const id = req.params.id
    console.log('Download request for magazine ID', id)
    const mag = await Magazine.findById(id)
    console.log(mag);
    if (!mag || !mag.downloadUrl) return res.status(404).json({ message: 'Not found' })

    const cloudinary = configureCloudinary()

    // If the stored downloadUrl is a Cloudinary raw URL, convert it to a
    // canonical Cloudinary URL using the public_id so we can control
    // resource_type/format via `cloudinary.url()`.
    let url = mag.downloadUrl
    try {
      const parsed = new URL(url)
      if (parsed.hostname && parsed.hostname.includes('res.cloudinary.com')) {
        const parts = parsed.pathname.split('/').filter(Boolean) // ['<cloud>','raw','upload','v123','folder','file.pdf']
        const uploadIdx = parts.indexOf('upload')
        if (uploadIdx !== -1) {
          let after = parts.slice(uploadIdx + 1)
          if (after.length && /^v\d+$/.test(after[0])) after = after.slice(1) // remove version
          const publicIdWithExt = after.join('/')
          const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '')
          if (publicId) {
            url = cloudinary.url(publicId, { resource_type: 'auto', format: 'pdf' })
          }
        }
      }
    } catch (e) {
      // ignore URL parsing errors and fall back to the original URL
    }
    // fetch remote PDF and stream to client with inline headers
    // Forward range requests from the client to the remote URL so that
    // partial content responses (206) are preserved for seeking/streaming.
    const fetchOptions = {}
    if (req.headers.range) fetchOptions.headers = { Range: req.headers.range }

    let fetchRes = await fetch(url, fetchOptions)
    // If upstream returned 304 Not Modified (conditional request), retry
    // without conditional headers to obtain the body for proxying.
    if (fetchRes.status === 304) {
      console.warn('Upstream returned 304; refetching without conditional headers')
      fetchRes = await fetch(url)
    }
    console.log(fetchRes);
    if (!fetchRes.ok && fetchRes.status !== 206) return res.status(502).json({ message: 'Failed to fetch remote file' })

    const contentType = fetchRes.headers.get('content-type') || 'application/pdf'
    const contentLength = fetchRes.headers.get('content-length')
    const contentRange = fetchRes.headers.get('content-range')
    const acceptRanges = fetchRes.headers.get('accept-ranges')
    const filename = `${(mag.title || 'magazine').replace(/[^a-z0-9\.\-\_ ]/gi, '_')}.pdf`

    // mirror status (200 or 206) and relevant headers to the client
    res.status(fetchRes.status)
    res.setHeader('Content-Type', contentType)
    if (contentLength) res.setHeader('Content-Length', contentLength)
    if (contentRange) res.setHeader('Content-Range', contentRange)
    if (acceptRanges) res.setHeader('Accept-Ranges', acceptRanges)
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`)

    // stream web ReadableStream to Node stream
    
    const body = fetchRes.body
    if (!body) return res.status(502).json({ message: 'No body from remote' })
    pipeline(Readable.fromWeb(body), res, (err) => {
      if (err) console.error('Stream pipeline failed', err)
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: err && err.message ? err.message : 'Server error' })
  }
}

async function deleteMagazine(req, res) {
  try {
    const id = req.params.id
    const mag = await Magazine.findById(id)
    if (!mag) return res.status(404).json({ message: 'Not found' })

    const cloudinary = configureCloudinary()

    const tryDeleteCloudinary = async (url, resourceType) => {
      if (!url) return
      try {
        const parsed = new URL(url)
        if (parsed.hostname && parsed.hostname.includes('res.cloudinary.com')) {
          const parts = parsed.pathname.split('/').filter(Boolean)
          const uploadIdx = parts.indexOf('upload')
          if (uploadIdx !== -1) {
            let after = parts.slice(uploadIdx + 1)
            if (after.length && /^v\d+$/.test(after[0])) after = after.slice(1)
            const publicIdWithExt = after.join('/')
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '')
            if (publicId) {
              await cloudinary.uploader.destroy(publicId, { resource_type: resourceType || 'auto' })
            }
          }
        }
      } catch (e) {
        console.warn('Failed to delete cloudinary resource', url, e && (e.message || e))
      }
    }

    // attempt to remove remote assets (pdf/raw and cover image) but do not fail if deletion fails
    await tryDeleteCloudinary(mag.downloadUrl, 'raw')
    await tryDeleteCloudinary(mag.imageUrl, 'image')

    await Magazine.findByIdAndDelete(id)
    return res.json({ message: 'Magazine deleted' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: err && err.message ? err.message : 'Server error' })
  }
}

module.exports = { createMagazine, listMagazines , downloadMagazine ,deleteMagazine}

