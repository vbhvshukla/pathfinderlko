import React from 'react'

export default function Gallery({ images = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Gallery</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-lg bg-muted h-48 sm:h-56 md:h-64"
          >
            <img
              src={src}
              alt={`gallery-${i}`}
              loading="lazy"
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end">
              <div className="p-3 text-sm text-white">
                {/* optional caption area */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
