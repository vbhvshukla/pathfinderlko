import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Calendar, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-background px-4 py-16 overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="relative text-center max-w-md w-full space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="text-9xl font-black tracking-widest text-primary/30 select-none">
            404
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Page Not Found
          </h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you are looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link to="/">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto gap-2">
            <Link to="/appointments">
              <Calendar className="w-4 h-4" /> Book Appointment
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t">
          <Link
            to={-1}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Go back to previous page
          </Link>
        </div>
      </div>
    </div>
  )
}
