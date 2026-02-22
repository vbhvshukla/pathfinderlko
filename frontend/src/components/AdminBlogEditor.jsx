import React, { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog as Dialog,
  AlertDialogTrigger as DialogTrigger,
  AlertDialogContent as DialogContent,
  AlertDialogHeader as DialogHeader,
  AlertDialogTitle as DialogTitle,
  AlertDialogFooter as DialogFooter,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export default function AdminBlogEditor({ post, onUpdated, children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    categories: (post.categories && post.categories.join(',')) || '',
    tags: (post.tags && post.tags.join(',')) || '',
    file: null,
  })

  function update(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      let res
      if (form.file) {
        const fd = new FormData()
        fd.append('featuredImage', form.file)
        fd.append('title', form.title)
        fd.append('content', form.content)
        fd.append('excerpt', form.excerpt)
        fd.append('categories', form.categories)
        fd.append('tags', form.tags)
        res = await apiFetch(`/posts/${post.slug}`, { method: 'PUT', data: fd })
      } else {
        const payload = {
          title: form.title,
          content: form.content,
          excerpt: form.excerpt,
          categories: form.categories ? form.categories.split(',').map(s => s.trim()).filter(Boolean) : [],
          tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        }
        res = await apiFetch(`/posts/${post.slug}`, { method: 'PUT', data: payload })
      }
      toast.success('Post updated')
      setOpen(false)
      if (onUpdated) onUpdated(res.post || res)
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Edit</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="max-h-[65vh] overflow-auto pr-2">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={form.title} onChange={e => update('title', e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Excerpt</label>
            <Input value={form.excerpt} onChange={e => update('excerpt', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea value={form.content} onChange={e => update('content', e.target.value)} rows={10} required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Categories (comma)</label>
              <Input value={form.categories} onChange={e => update('categories', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (comma)</label>
              <Input value={form.tags} onChange={e => update('tags', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Upload New Featured Image (optional)</label>
            <input type="file" accept="image/*" onChange={e => update('file', e.target.files && e.target.files[0])} className="mt-1" />
            {form.file && <div className="text-sm text-muted mt-1">Selected: {form.file.name}</div>}
          </div>

          </div>

          <DialogFooter className="border-t pt-3">
            <Button type="submit" disabled={loading}>{loading ? 'Updating…' : 'Update Post'}</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
