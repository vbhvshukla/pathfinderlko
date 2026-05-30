import React, { useEffect } from 'react'

export default function SEO({ title, description, keywords, ogImage, canonicalUrl }) {
  useEffect(() => {
    // 1. Set title
    const fullTitle = title ? `${title} | Pathfinder NGO Lucknow` : 'Pathfinder NGO | Mental Health & Career Counseling Lucknow'
    document.title = fullTitle

    // 2. Set description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description || 'Pathfinder is a Lucknow-based NGO providing psychological counseling, stress relief camps, and expert career guidance workshops for youth.')

    // 3. Set keywords
    let metaKey = document.querySelector('meta[name="keywords"]')
    if (!metaKey) {
      metaKey = document.createElement('meta')
      metaKey.setAttribute('name', 'keywords')
      document.head.appendChild(metaKey)
    }
    metaKey.setAttribute('content', keywords || 'mental health lucknow, career counseling lucknow, NGO lucknow, student anxiety help, career path guidance')

    // 4. Set Open Graph (OG) Meta tags
    const ogData = {
      'og:title': title || 'Pathfinder NGO Lucknow',
      'og:description': description || 'Professional counseling and career guidance workshops for students.',
      'og:type': 'website',
      'og:image': ogImage || '/og-image.jpg',
      'og:url': canonicalUrl || window.location.href,
    }

    Object.entries(ogData).forEach(([property, value]) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`)
      if (!ogMeta) {
        ogMeta = document.createElement('meta')
        ogMeta.setAttribute('property', property)
        document.head.appendChild(ogMeta)
      }
      ogMeta.setAttribute('content', value)
    })

    // 5. Set Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonicalUrl || window.location.href)

  }, [title, description, keywords, ogImage, canonicalUrl])

  return null
}
