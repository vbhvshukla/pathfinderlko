import React from 'react'

export default function Footer() {
  return (
    <footer className="backdrop-blur border-t border-border mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3 text-center">
        <div className="md:text-left">
          <h3 className="text-lg font-bold">Pathfinder</h3>
          <p className="text-sm text-muted-foreground mt-2">Under Brigupyari Seva Samiti. Registered under the Society Registration Act, 1860.</p>
          <p className="text-sm text-muted-foreground mt-2">Address: MOD Galaxy City, Near Omaxe City, Bijnaur Road, Lucknow</p>
        </div>

        <div className="md:text-center md:mx-6 md:border-l md:border-r md:border-border md:pl-6 md:pr-6">
          <h4 className="font-semibold">Quick links</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><a href="/services" className="hover:underline">Services</a></li>
            <li><a href="/appointments" className="hover:underline">Book Appointment</a></li>
            <li><a href="/blog" className="hover:underline">Blog</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div className="md:text-right">
          <h4 className="font-semibold">Contact</h4>
          <p className="text-sm text-muted-foreground mt-2">Email: <a href="mailto:info@pathfinderlko.in" className="underline">info@pathfinderlko.in</a></p>
          <p className="text-sm mt-1">Phone: <a href="tel:+918756700557" className="underline">+91 875 670 0557</a></p>
        </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border mt-2 mb-6 pb-4 pt-4">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="mb-2 md:mb-0">© {new Date().getFullYear()} Pathfinder. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/p/Pathfinder-Lucknow-100064046493210/" className="hover:text-primary">Facebook</a>
            <a href="https://www.instagram.com/pathfinder_lko/" className="hover:text-primary">Instagram</a>
            <a href="https://www.linkedin.com/in/dr-sandhya-dwivedi-a073401b1/" className="hover:text-primary">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
