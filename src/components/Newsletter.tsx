import React, { useState } from "react";
import { Mail, Sparkles, CheckCircle } from "lucide-react";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    // Simulate API registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail("");
    }, 1200);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#DDD5C3] dark:border-[#243524] animate-fade-in">
      <div className="relative bg-gradient-to-tr from-[#FAF4F2] to-[#FBDBD3]/30 dark:from-[#111610] dark:to-[#1E2D1D]/20 border border-[#DDD5C3] dark:border-[#243524] rounded-[36px] p-8 md:p-12 overflow-hidden shadow-sm text-center">
        {/* Soft radial glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 motif-glow opacity-30 rounded-full pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B98072]/10 dark:bg-[#B98072]/20 text-[#8A5A4D] dark:text-[#E0A395] text-[10px] uppercase font-mono tracking-widest font-bold rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Newsletter</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F] dark:text-[#FAF4F2] tracking-tight">
            Subscribe to our Spiritual Reflections
          </h3>
          
          <p className="text-xs sm:text-sm text-[#5B5648] dark:text-[#ABB9AB] font-light leading-relaxed max-w-md mx-auto">
            Receive monthly letters from Ms. Mustara, program announcements, and curated insights on nurturing Deen in your home.
          </p>

          {isSuccess ? (
            <div className="bg-[#8CA394]/15 border border-[#8CA394]/40 rounded-2xl p-6 text-center space-y-2 py-8 max-w-md mx-auto animate-fade-in">
              <CheckCircle className="w-8 h-8 text-[#8CA394] mx-auto animate-bounce" />
              <h4 className="font-serif font-bold text-[#22301F] dark:text-[#FAF4F2] text-sm">Subscription Confirmed!</h4>
              <p className="text-xs text-[#5B5648] dark:text-[#ABB9AB] font-light leading-relaxed">
                Assalamu alaikum! Thank you for subscribing. You have been added to our reflections registry.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CA394] dark:text-[#7E9C7E]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white dark:bg-[#121812] border border-[#DDD5C3] dark:border-[#243524] rounded-full pl-11 pr-4 py-3 text-xs placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394] text-[#22301F] dark:text-[#FAF4F2]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#22301F] dark:bg-[#FAF4F2] hover:bg-[#33453A] dark:hover:bg-[#EDE3CE] text-white dark:text-[#0B0E0A] py-3 px-6 rounded-full text-xs font-mono font-bold uppercase tracking-widest transition-all hover:scale-[1.02] shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
