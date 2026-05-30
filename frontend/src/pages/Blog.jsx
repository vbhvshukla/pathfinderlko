import React, { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'career', label: 'Career Guidance' },
  { id: 'relationship', label: 'Relationships' },
  { id: 'addiction', label: 'Addictions' },
]

const SAMPLE_POSTS = [
  {
    _id: 'sample-1',
    slug: 'managing-exam-stress-students',
    title: 'Managing Exam Stress: A Guide for Students',
    excerpt: 'Exam season can be overwhelming. Learn how to manage stress, structure study sessions, and build mental resilience.',
    content: 'Long study hours can lead to academic burnout. Here are practical mindfulness exercises...',
    categories: ['mental-health'],
    publishedAt: new Date().toLocaleDateString(),
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
  },
  {
    _id: 'sample-2',
    slug: 'finding-right-career-path-2026',
    title: 'Finding the Right Career Path in 2026',
    excerpt: 'Discover your strengths, analyze job market trends, and make informed choices for your career progression.',
    content: 'Career alignment is about matching your innate skills with industry needs...',
    categories: ['career'],
    publishedAt: new Date().toLocaleDateString(),
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60',
  },
]

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 6

  async function load() {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })
      if (category) queryParams.append('category', category)
      if (search) queryParams.append('q', search)

      const data = await apiFetch(`/posts?${queryParams.toString()}`)
      
      if (data && data.posts) {
        setPosts(data.posts)
        setTotal(data.total || data.posts.length)
      } else {
        setPosts(SAMPLE_POSTS)
        setTotal(SAMPLE_POSTS.length)
      }
    } catch (e) {
      console.error('Failed to load posts, using samples', e)
      setPosts(SAMPLE_POSTS.filter(p => !category || p.categories.includes(category)))
      setTotal(SAMPLE_POSTS.length)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [category, page])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    load()
  }

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          Pathfinder Insights & Blog
        </h1>
        <p className="text-muted-foreground">
          Articles, tips, and professional resources on mental health, career growth, and emotional well-being.
        </p>
      </div>

      {/* Search and Category Filter section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs flex gap-2">
          <div className="relative flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="pl-9 pr-4"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          </div>
          <Button type="submit" size="sm">Search</Button>
        </form>

        <div className="flex flex-wrap gap-1.5 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id)
                setPage(1)
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                category === cat.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden space-y-4">
              <div className="h-48 bg-muted animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-2xl bg-card">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground text-lg">No Articles Found</p>
              <p className="text-muted-foreground text-sm">We couldn't find any articles matching that criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.slug || post._id} className="h-full overflow-hidden hover:border-primary/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-48 overflow-hidden bg-muted relative">
                      {post.featuredImage || post.cover ? (
                        <img
                          src={post.featuredImage || post.cover}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-semibold">
                          No Preview Image
                        </div>
                      )}
                      {post.categories && post.categories[0] && (
                        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm border hover:bg-background">
                          {post.categories[0]}
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="px-6 pt-4 pb-2 h-[105px] flex flex-col justify-between">
                      <CardTitle className="line-clamp-2 text-lg hover:text-primary transition-colors leading-snug font-bold">
                        <Link to={`/blog/${post.slug || post._id}`}>{post.title}</Link>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : post.publishedAt || 'Recently published'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pt-2 pb-4 h-[80px] overflow-hidden">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt || (post.content && post.content.replace(/<[^>]+>/g, ' ').substring(0, 120) + '...')}
                      </p>
                    </CardContent>
                  </div>

                  <CardFooter className="px-6 pt-3 pb-3 border-t bg-muted/10 flex items-center justify-between text-xs mt-auto">
                    <Button asChild size="sm" variant="ghost" className="hover:text-primary">
                      <Link to={`/blog/${post.slug || post._id}`}>Read Article</Link>
                    </Button>
                    <span className="text-muted-foreground">{computeReadTime(post)} min read</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="gap-1.5"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  )
}

function computeReadTime(post) {
  const text = (post.content || post.excerpt || '')
  const stripped = String(text).replace(/<[^>]+>/g, ' ')
  const words = stripped.trim().split(/\s+/).filter(Boolean).length
  const wpm = 200
  const mins = Math.max(1, Math.round(words / wpm))
  return mins
}
