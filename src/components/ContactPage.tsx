import React from "react";
import { MessageCircle, Instagram, Clock } from "lucide-react";

export function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 animate-fade-in text-center space-y-10" id="contact-admissions-page">
      
      {/* Centered Editorial Header */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-bold font-mono tracking-[0.25em] text-[#8CA394] block">
          Support & Admissions Hub
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
          Get in Touch
        </h2>
        <div className="w-12 h-[1.5px] bg-[#B98072] mx-auto mt-4 mb-6" />
        <p className="text-[#5B5648] text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Have a question before enrolling, or need help with an existing course? We're here to help.
        </p>
      </div>

      {/* Action Buttons Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-4">
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/918145363290?text=Assalamu%27alaikum!%20I%27d%20like%20to%20inquire%20about%20Qalbiya%20Islamic%20Institute."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-[#DDD5C3] hover:border-[#25D366] rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-7 h-7 fill-current" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#22301F]">WhatsApp Us</h3>
            <p className="text-xs text-[#5B5648] font-mono">+91 81453 63290</p>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#25D366] font-bold bg-[#25D366]/10 px-3 py-1 rounded-full">
            Direct Chat
          </span>
        </a>

        {/* Instagram Button */}
        <a 
          href="https://instagram.com/qalbiya_institute"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-[#DDD5C3] hover:border-[#E1306C] rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-14 h-14 bg-[#E1306C]/10 text-[#E1306C] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Instagram className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#22301F]">DM on Instagram</h3>
            <p className="text-xs text-[#5B5648] font-mono">@qalbiya_institute</p>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#E1306C] font-bold bg-[#E1306C]/10 px-3 py-1 rounded-full">
            Follow & DM
          </span>
        </a>
      </div>

      {/* Response Time Indicator */}
      <div className="bg-[#FAF8F1] border border-[#DDD5C3]/40 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-center gap-3 text-xs text-[#5B5648] font-light">
        <Clock className="w-4 h-4 text-[#8CA394] shrink-0" />
        <span><strong>Response time:</strong> We aim to respond within 24 hours.</span>
      </div>

    </div>
  );
}
