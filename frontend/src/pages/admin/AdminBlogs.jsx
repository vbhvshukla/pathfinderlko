import React, { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs Administration</h1>
          <p className="text-sm text-muted-foreground">Create, edit, and delete articles published on Pathfinder Insights.</p>
        </div>
        <AdminBlogForm onCreated={(post) => setPosts(p => [post, ...p])} />
      </div>

      {posts.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted">No blog posts found.</CardContent></Card>
      ) : (
        <>
          {/* mobile cards */}
          <div className="md:hidden space-y-3">
            {posts.map((p) => (
              <div key={p._id || p.id || p.slug} className="p-4 border rounded-2xl bg-card shadow-sm space-y-2">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground truncate">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {p.date || (p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'Draft')}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground/75 truncate mt-0.5">{p.slug || p._id || p.id}</div>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <AdminBlogEditor post={p} onUpdated={(updated) => setPosts(prev => prev.map(x => x._id === updated._id || x.slug === updated.slug ? (updated || x) : x))}>
                    <Button size="sm" variant="outline" className="h-9 text-xs flex-1">Edit</Button>
                  </AdminBlogEditor>
                  <Button size="sm" variant="outline" className="h-9 text-xs flex-1 text-destructive hover:text-destructive/80" onClick={async () => {
                    if (!confirm('Are you sure you want to delete this blog post?')) return
                    try {
                      await apiFetch(`/posts/${p.slug || p._id}`, { method: 'DELETE' })
                      setPosts(prev => prev.filter(x => x._id !== p._id && x.slug !== p.slug))
                      toast.success('Blog post deleted successfully!')
                    } catch (err) {
                      console.error(err)
                      toast.error('Failed to delete blog post.')
                    }
                  }}>Delete</Button>
                </div>
              </div>
            ))}
          </div>

          {/* desktop table */}
          <Card className="hidden md:block">
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground text-xs uppercase font-semibold">
                    <th className="p-4">Title</th>
                    <th className="p-4">Published Date</th>
                    <th className="p-4">Slug / Reference</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {posts.map((p) => (
                    <tr key={p._id || p.id || p.slug} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-semibold text-foreground max-w-xs truncate">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          {p.title}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {p.date || (p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'Draft')}
                      </td>
                      <td className="p-4 text-xs font-mono text-muted-foreground/75 truncate max-w-[150px]">
                        {p.slug || p._id || p.id}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <AdminBlogEditor post={p} onUpdated={(updated) => setPosts(prev => prev.map(x => x._id === updated._id || x.slug === updated.slug ? (updated || x) : x))}>
                            <Button size="sm" variant="outline" className="h-8 text-xs">Edit</Button>
                          </AdminBlogEditor>
                          <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive hover:text-destructive/80" onClick={async () => {
                            if (!confirm('Are you sure you want to delete this blog post?')) return
                            try {
                              await apiFetch(`/posts/${p.slug || p._id}`, { method: 'DELETE' })
                              setPosts(prev => prev.filter(x => x._id !== p._id && x.slug !== p.slug))
                              toast.success('Blog post deleted successfully!')
                            } catch (err) {
                              console.error(err)
                              toast.error('Failed to delete blog post.')
                            }
                          }}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
