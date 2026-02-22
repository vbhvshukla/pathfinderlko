import React, { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import AdminBlogForm from '@/components/AdminBlogForm'
import AdminBlogEditor from '@/components/AdminBlogEditor'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'

const samplePosts = [
  { id: 'navigate-career-choices', title: 'How to Navigate Career Choices', date: '2026-02-10' },
  { id: 'workshops-change-mindsets', title: 'Workshops That Change Mindsets', date: '2026-01-20' },
]

export default function AdminBlogs() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/posts')
        setPosts(data.posts || data || samplePosts)
      } catch (e) {
        setPosts(samplePosts)
      }
    }
    load()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <AdminBlogForm onCreated={(post) => setPosts(p => [post, ...p])} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((p) => (
          <div key={p._id || p.id || p.slug} className="p-4 border rounded">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5"/>{p.title}</div>
                <div className="text-sm text-muted">{p.date || p.publishedAt}</div>
              </div>
              <div className="flex gap-2">
                <AdminBlogEditor post={p} onUpdated={(updated) => setPosts(prev => prev.map(x => x._id === updated._id || x.slug === updated.slug ? (updated || x) : x))}>
                  <Button size="sm" variant="outline">Edit</Button>
                </AdminBlogEditor>
                <Button size="sm" variant="ghost" onClick={async () => {
                  if (!confirm('Delete this post?')) return
                  try {
                    await apiFetch(`/posts/${p.slug}`, { method: 'DELETE' })
                    setPosts(prev => prev.filter(x => x._id !== p._id && x.slug !== p.slug))
                    toast && toast.success && toast.success('Deleted')
                  } catch (err) {
                    console.error(err)
                    toast && toast.error && toast.error('Delete failed')
                  }
                }}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
