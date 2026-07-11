import React from "react";
import { ArrowRight, Sparkles, Award } from "lucide-react";

interface HeroProps {
  onChoosePath: (path: "women" | "kids") => void;
}

export const Hero: React.FC<HeroProps> = ({ onChoosePath }) => {
  const visionText = 
    "Welcome to Qalbiya Islamic Institute. In a world of infinite noise and constant demands, we invite you to come back to your true self. To come back to who you were before the world got loud. Our highly structured Deeniyat programs for women and children are designed not just to transmit knowledge, but to polish the heart, cultivate mindfulness, and establish a meaningful, lifelong connection with your Creator. Choose your path below and embark on a systematic, deeply rewarding spiritual journey.";

  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Decorative Side Path stitched line */}
      <div className="absolute left-8 top-0 bottom-0 w-[2px] stitched-line opacity-40 z-0 hidden lg:block" />

      {/* Background Motif Glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] motif-glow opacity-60 rounded-full -z-10" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] motif-glow opacity-40 rounded-full -z-10" />

      {/* Main Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-8 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22301F]/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[#8CA394] border border-[#DDD5C3]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#B0863A] fill-[#F1E7D3] animate-pulse" />
          <span>A Sanctuary for Spiritual Learning</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#22301F] tracking-tight font-bold leading-[1.15]">
          Come back to who you <br />
          <span className="italic font-normal text-[#8CA394]">were</span> before the world <br />
          got loud.
        </h2>

        <p className="font-sans text-[#5B5648] text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
          Qalbiya Islamic Institute is a premium, highly structured educational sanctuary. We offer curated 
          Deeniyat curricula designed to enrich the intellect, refine articulation, and nourish the souls 
          of modern Muslim women and young hearts.
        </p>


      </div>

      {/* Choose Your Path (Dual Modules) */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto relative z-10">
        
        {/* Women's Path */}
        <div className="bg-[#F1E2DC] border border-[#DDD5C3] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 relative group overflow-hidden h-[320px]">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#8A5A4D" strokeWidth="2">
              <circle cx="40" cy="40" r="30"/>
              <circle cx="40" cy="40" r="15"/>
            </svg>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A5A4D]">
                For You &middot; Adult Academy
              </span>
              <span className="text-xs font-mono text-[#5B5648]/60">Semester-Based</span>
            </div>
            
            <h3 className="font-serif text-2xl font-semibold text-[#22301F] leading-tight max-w-[280px]">
              Rebuild your relationship with Allah.
            </h3>
            
            <p className="font-sans text-[#5B5648] text-xs md:text-sm leading-relaxed font-light">
              Reclaim spiritual alignment through academic study of Creed (Aqeedah), 
              Practical Jurisprudence (Fiqh), history (Seerah), and custom 1-on-1 Tajweed.
            </p>
          </div>

          <button 
            onClick={() => onChoosePath("women")}
            className="w-fit bg-[#B98072] hover:bg-[#8A5A4D] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest btn-shadow flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
          >
            <span>Explore Women Cources</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Kids' Path */}
        <div className="bg-[#F1E7D3] border border-[#DDD5C3] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 relative group overflow-hidden h-[320px]">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#87652A" strokeWidth="2">
              <path d="M40 10L48 35H75L53 50L62 75L40 60L18 75L27 50L5 35H32L40 10Z"/>
            </svg>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#87652A]">
                For Your Child &middot; Juniors Education
              </span>
              <span className="text-xs font-mono text-[#5B5648]/60">Interactive & Playful</span>
            </div>
            
            <h3 className="font-serif text-2xl font-semibold text-[#22301F] leading-tight max-w-[280px]">
              Raise a child who loves their deen.
            </h3>
            
            <p className="font-sans text-[#5B5648] text-xs md:text-sm leading-relaxed font-light">
              Nurture a cheerful, strong Muslim identity in young hearts through visual slides, gamified quizzes, 
              prophetic history narratives, and phonetic-based Quranic foundations.
            </p>
          </div>

          <button 
            onClick={() => onChoosePath("kids")}
            className="w-fit bg-[#B0863A] hover:bg-[#87652A] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest btn-shadow flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
          >
            <span>Explore Kids Cources</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* Social Proof Strip / Reflection Quotes */}
      <div className="mt-24 border-y border-[#DDD5C3] py-10 text-center max-w-4xl mx-auto relative z-10">
        <p className="font-serif italic text-[#22301F] text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
          "Say: Are those who know equal to those who do not know?"
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5B5648] mt-3 flex items-center justify-center gap-2">
          <Award className="w-3.5 h-3.5 text-[#B0863A]" />
          <span>The Holy Qur'an, Surah Az-Zumar (39:9) &bull; Trusted by 1,200+ students globally</span>
        </p>
      </div>

    </section>
  );
};
