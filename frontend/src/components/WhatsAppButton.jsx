import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 group flex flex-col items-end">
      {/* Tooltip speech bubble */}
      <div className="mb-2 bg-card border text-card-foreground text-xs font-medium px-3 py-1.5 rounded-xl shadow-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        Join our WhatsApp Channel!
      </div>
      
      <a
        href="https://whatsapp.com/channel/0029VaxLRJYBA1esZXXYWs2b"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our WhatsApp Channel"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping opacity-75 group-hover/btn:animate-none"></span>
        
        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 relative z-10" fill="currentColor" />
      </a>
    </div>
  )
}
