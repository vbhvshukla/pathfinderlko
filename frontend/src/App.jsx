import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthLoader from './components/AuthLoader'
import ProtectedRoute from './components/ProtectedRoute'
import WhatsAppButton from './components/WhatsAppButton'
import MobileTabBar from './components/MobileTabBar'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import Loader from './components/ui/loader'
import './App.css'
import { Toaster } from './components/ui/sonner'

// Route-level code splitting: everything except the landing page and 404 loads
// on demand, keeping the initial JS payload small for mobile connections.
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Auth = lazy(() => import('./pages/Auth'))
const Appointment = lazy(() => import('./pages/Appointment'))
const AppointmentSuccess = lazy(() => import('./pages/AppointmentSuccess'))
const MyAppointments = lazy(() => import('./pages/MyAppointments'))
const Events = lazy(() => import('./pages/Events'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Quiz = lazy(() => import('./pages/Quiz'))

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'))
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'))
const AdminImages = lazy(() => import('./pages/admin/AdminImages'))
const AdminMagazines = lazy(() => import('./pages/admin/AdminMagazines'))
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader size={40} className="text-primary animate-spin" />
    </div>
  )
}

// Simple cross-fade between routes, keyed by pathname, so navigation feels
// like an app transition rather than an instant content swap.
function PageTransition({ children }) {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className="animate-in fade-in duration-200">
      {children}
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AuthLoader>
        <main className="flex-1 pb-16 md:pb-0">
          <ErrorBoundary>
            <Suspense fallback={<PageFallback />}>
              <PageTransition>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/appointments" element={<Appointment />} />
                <Route path="/appointments/success" element={<AppointmentSuccess />} />
                <Route path="/my-appointments" element={
                  <ProtectedRoute>
                    <MyAppointments />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="appointments" element={<AdminAppointments />} />
                  <Route path="blogs" element={<AdminBlogs />} />
                  <Route path="images" element={<AdminImages />} />
                  <Route path="magazines" element={<AdminMagazines />} />
                  <Route path="contacts" element={<AdminContacts />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>

                <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </Suspense>
          </ErrorBoundary>
        </main>
      </AuthLoader>
      <Footer />
      <Toaster />
      <WhatsAppButton />
      <MobileTabBar />
    </div>
  )
}

export default App
