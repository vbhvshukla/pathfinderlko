import React, { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'


export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await apiFetch('/posts')
        if (!mounted) return
        setPosts(data.posts || data || [])
      } catch (e) {
        console.error('Failed to load posts', e)
        if (!mounted) return
        setPosts(samplePosts)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <CardTitle><div className="h-4 bg-muted rounded w-3/4" /></CardTitle>
                <CardDescription className="text-sm"><div className="h-3 bg-muted rounded w-1/3" /></CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-40 overflow-hidden bg-muted" />
                <div className="p-4">
                  <p className="text-sm text-muted"><div className="h-3 bg-muted w-full rounded" /></p>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="h-6 bg-muted w-16 rounded" />
                <div className="h-4 bg-muted w-20 rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full text-center text-muted py-12">No posts available.</div>
        ) : (
          posts.map((post) => (
            <Card key={post.slug || post._id || post.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription className="text-sm">{post.date || post.publishedAt}</CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                <div className="h-40 overflow-hidden bg-muted">
                  {post.cover ? (
                    <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
                  ) : post.featuredImage ? (
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted">{post.excerpt || post.excerptText || ''}</p>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <Link to={`/blog/${post.slug || post._id}`}>
                  <Button size="sm">Read</Button>
                </Link>
                <div className="text-sm text-muted">Read time: {computeReadTime(post)} min</div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}

function computeReadTime(post) {
  const text = (post.content || post.excerpt || post.excerptText || '')
  // strip HTML tags if present
  const stripped = String(text).replace(/<[^>]+>/g, ' ')
  const words = stripped.trim().split(/\s+/).filter(Boolean).length
  const wpm = 200
  const mins = Math.max(1, Math.round(words / wpm))
  return mins
}
