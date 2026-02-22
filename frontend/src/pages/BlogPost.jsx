import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setNotFound(false)
      try {
        const res = await apiFetch(`/posts/${slug}`)
        if (!mounted) return
        const p = res.post || res
        setPost(p)
      } catch (err) {
        if (err.status === 404) {
          setNotFound(true)
        } else {
          console.error('Failed to load post', err)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [slug])

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 bg-muted rounded mb-4 w-1/3" />
        <div className="h-64 bg-muted rounded mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-muted w-full rounded" />
          <div className="h-4 bg-muted w-full rounded" />
          <div className="h-4 bg-muted w-3/4 rounded" />
        </div>
      </main>
    )
  }

  if (notFound || !post) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="mb-6">We couldn't find the post you're looking for.</p>
        <Link to="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          {post.featuredImage ? (
            <div className="relative w-full h-72 sm:h-96 overflow-hidden rounded-lg shadow">
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ) : post.cover ? (
            <div className="relative w-full h-72 sm:h-96 overflow-hidden rounded-lg shadow">
              <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ) : null}

          <header className="pt-2">
            <h1 className="text-4xl font-extrabold leading-tight mb-2">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{new Date(post.date || post.publishedAt || post.createdAt).toLocaleDateString()}</span>
              <span className="mx-1">•</span>
              <span>{computeReadTime(post)} min read</span>
              {post.author && (
                <>
                  <span className="mx-1">•</span>
                  <span>By {post.author}</span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="text-xs bg-muted px-2 py-1 rounded">#{t}</span>
                ))}
              </div>
            )}
          </header>
        </div>

        <article className="prose max-w-none" style={{ textAlign: 'justify' }}>
          {Array.isArray(post.content)
            ? post.content.map((p, i) => <p key={i}>{p}</p>)
            : (post.content || '').includes('<')
            ? <div dangerouslySetInnerHTML={{ __html: post.content }} />
            : (post.content || '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </article>

        <div className="flex items-center justify-between mt-8">
          <Link to="/blog">
            <Button variant="ghost">← Back to Blog</Button>
          </Link>
          <div className="flex items-center gap-2">
            <a className="text-sm text-muted hover:text-primary" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer">Share</a>
          </div>
        </div>
      </div>
    </main>
  )
}

function computeReadTime(post) {
  const text = Array.isArray(post.content) ? post.content.join('\n\n') : (post.content || post.excerpt || '')
  const stripped = String(text).replace(/<[^>]+>/g, ' ')
  const words = stripped.trim().split(/\s+/).filter(Boolean).length
  const wpm = 200
  const mins = Math.max(1, Math.round(words / wpm))
  return mins
}
