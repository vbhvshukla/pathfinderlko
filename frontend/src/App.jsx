import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthLoader from './components/AuthLoader'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Auth from './pages/Auth'
import Appointment from './pages/Appointment'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminImages from './pages/admin/AdminImages'
import AdminMagazines from './pages/admin/AdminMagazines'
import AdminContacts from './pages/admin/AdminContacts'
import AdminServices from './pages/admin/AdminServices'
import AdminEvents from './pages/admin/AdminEvents'
import AdminUsers from './pages/admin/AdminUsers'
import EventDetails from './pages/EventDetails'
import ProtectedRoute from './components/ProtectedRoute'
import WhatsAppButton from './components/WhatsAppButton'
import NotFound from './pages/NotFound'
import AppointmentSuccess from './pages/AppointmentSuccess'
import MyAppointments from './pages/MyAppointments'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Quiz from './pages/Quiz'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AuthLoader>
        <main className="flex-1">
          <ErrorBoundary>
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
          </ErrorBoundary>
        </main>
      </AuthLoader>
      <Footer />
      <Toaster />
      <WhatsAppButton />
    </div>
  )
}

export default App
