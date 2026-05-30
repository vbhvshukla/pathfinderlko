import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/lib/api'
import { Facebook, Twitter, Linkedin, MessageSquare, ArrowUp, Calendar, Clock, User, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import Loader from '@/components/ui/loader'
import SEO from '@/components/SEO'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState([])

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
        
        // Fetch related posts
        try {
          const category = p.categories?.[0] || ''
          const queryUrl = category ? `/posts?category=${category}&limit=4` : '/posts?limit=4'
          const relatedRes = await apiFetch(queryUrl)
          const allRelated = relatedRes.posts || relatedRes || []
          if (mounted) {
            setRelatedPosts(allRelated.filter(item => item.slug !== p.slug && item._id !== p._id).slice(0, 3))
          }
        } catch (err) {
          console.warn('Failed to load related posts', err)
        }
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

  // Track scroll progress and scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100)
      }
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 bg-muted rounded mb-4 w-1/3 animate-pulse" />
        <div className="h-64 sm:h-96 bg-muted rounded mb-6 animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 bg-muted w-full rounded animate-pulse" />
          <div className="h-4 bg-muted w-full rounded animate-pulse" />
          <div className="h-4 bg-muted w-3/4 rounded animate-pulse" />
        </div>
      </main>
    )
  }

  if (notFound || !post) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Post Not Found</h2>
        <p className="text-muted-foreground">We couldn't find the article you are looking for.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </main>
    )
  }

  const shareUrl = window.location.href
  const shareTitle = post.title

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`,
  }

  // Fallback author information
  const authorInfo = {
    name: post.author || 'Dr. P.K. Dwivedi',
    role: post.author ? 'Contributor' : 'Founder & Chief Counselor',
    bio: 'Experienced psychological counselor and career mentor specializing in cognitive behavioral approaches, academic anxiety relief, and youth empowerment in Lucknow.',
  }

  return (
    <main className="relative max-w-4xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
      <SEO
        title={post.title}
        description={post.excerpt || (post.content && String(post.content).replace(/<[^>]+>/g, ' ').substring(0, 150)) || ''}
        keywords={post.tags?.join(', ')}
        ogImage={post.featuredImage || post.cover}
      />
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-primary to-emerald-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="space-y-6">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Articles
        </Link>

        {/* Featured Image */}
        {post.featuredImage || post.cover ? (
          <div className="relative w-full h-72 sm:h-96 md:h-[450px] overflow-hidden rounded-2xl shadow-md">
            <img src={post.featuredImage || post.cover} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ) : null}

        {/* Header Metadata */}
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.categories?.map((cat) => (
              <Badge key={cat} variant="secondary" className="capitalize">
                {cat}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-b pb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.createdAt || post.date || post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {computeReadTime(post)} min read
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              By {authorInfo.name}
            </span>
          </div>
        </header>

        {/* Post Content */}
        <article className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed text-justify space-y-6">
          {Array.isArray(post.content)
            ? post.content.map((p, i) => <p key={i} className="text-base sm:text-lg">{p}</p>)
            : (post.content || '').includes('<')
            ? <div dangerouslySetInnerHTML={{ __html: post.content }} className="space-y-4 text-base sm:text-lg" />
            : (post.content || '').split('\n\n').map((p, i) => <p key={i} className="text-base sm:text-lg">{p}</p>)}
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Social Share section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-2xl bg-muted/20">
          <span className="text-sm font-semibold text-muted-foreground">Did you find this helpful? Share article:</span>
          <div className="flex gap-2">
            <Button asChild size="icon" variant="outline" className="w-9 h-9 rounded-full bg-card hover:text-[#1877F2]">
              <a href={shareLinks.facebook} target="_blank" rel="noreferrer" title="Share on Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </Button>
            <Button asChild size="icon" variant="outline" className="w-9 h-9 rounded-full bg-card hover:text-[#1DA1F2]">
              <a href={shareLinks.twitter} target="_blank" rel="noreferrer" title="Share on X">
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
            <Button asChild size="icon" variant="outline" className="w-9 h-9 rounded-full bg-card hover:text-[#0A66C2]">
              <a href={shareLinks.linkedin} target="_blank" rel="noreferrer" title="Share on LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button asChild size="icon" variant="outline" className="w-9 h-9 rounded-full bg-card hover:text-[#25D366]">
              <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" title="Share on WhatsApp">
                <MessageSquare className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Author Bio Section */}
        <Card className="border-primary/10 bg-card">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
              {authorInfo.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="space-y-2">
              <div>
                <h4 className="font-bold text-base text-foreground">{authorInfo.name}</h4>
                <p className="text-xs text-muted-foreground font-semibold">{authorInfo.role}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {authorInfo.bio}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-xl font-bold">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related._id}
                  to={`/blog/${related.slug || related._id}`}
                  className="group flex flex-col gap-2 hover:opacity-90 transition-all"
                >
                  <div className="h-32 bg-muted rounded-xl overflow-hidden">
                    {related.featuredImage || related.cover ? (
                      <img
                        src={related.featuredImage || related.cover}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No Preview
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {related.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <Button
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 rounded-full w-10 h-10 shadow-lg animate-in fade-in duration-300 bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
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
