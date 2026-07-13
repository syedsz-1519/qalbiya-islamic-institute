import React from "react";
import { ArrowRight, Sparkles, Award, Heart, BookOpen } from "lucide-react";

interface HeroProps {
  onChoosePath: (path: "women" | "kids" | "scholarship") => void;
}

export const Hero: React.FC<HeroProps> = ({ onChoosePath }) => {
  return (
    <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Decorative Side Path stitched line */}
      <div className="absolute left-8 top-0 bottom-0 w-[2px] stitched-line opacity-40 z-0 hidden lg:block" />

      {/* Background Motif Glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] motif-glow opacity-60 rounded-full -z-10" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] motif-glow opacity-40 rounded-full -z-10" />

      {/* Floating particles inside Hero */}
      <div className="absolute bottom-0 left-[15%] w-2 h-2 rounded-full bg-[#B98072]/20 dark:bg-[#E0A395]/10 pointer-events-none blur-xs animate-rise-particle-1" />
      <div className="absolute bottom-0 left-[45%] w-3 h-3 rounded-full bg-[#E0A395]/30 dark:bg-[#DFBA73]/15 pointer-events-none blur-xs animate-rise-particle-2" />
      <div className="absolute bottom-0 left-[75%] w-1.5 h-1.5 rounded-full bg-[#B98072]/40 dark:bg-[#E0A395]/20 pointer-events-none blur-xs animate-rise-particle-3" />

      {/* Main Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#B98072]/10 dark:bg-[#B98072]/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[#8A5A4D] dark:text-[#E0A395] border border-[#B98072]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#B98072] fill-[#F1E7D3] animate-pulse" />
          <span>A Sanctuary for Spiritual Learning</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#22301F] dark:text-[#FAF4F2] tracking-tight font-bold leading-[1.15]">
          Come back to who you <br />
          <span className="italic font-normal text-[#8CA394] dark:text-[#7E9C7E]">were</span> before the world <br />
          got loud.
        </h2>

        <p className="font-sans text-[#5B5648] dark:text-[#ABB9AB] text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
          Qalbiya Islamic Institute is a premium, highly structured educational sanctuary. We offer curated 
          Deeniyat curricula designed to enrich the intellect, refine articulation, and nourish the souls 
          of modern Muslim women and young hearts.
        </p>
      </div>

      {/* Scripture Reference Quote */}
      <div className="mt-12 border-double border-4 border-[#DFBA73]/40 dark:border-[#DFBA73]/20 bg-[#FAF4F2]/50 dark:bg-[#0B0E0A]/40 rounded-3xl p-8 text-center max-w-4xl mx-auto relative z-10 shadow-sm backdrop-blur-xs">
        <p className="font-arabic text-3xl md:text-4xl text-[#22301F]/90 dark:text-[#ECE5D8] mb-3 tracking-wide text-center" dir="rtl">
          قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ ۗ
        </p>
        <p className="font-serif italic text-[#22301F] dark:text-[#ECE5D8] text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          "Say: Are those who know equal to those who do not know?"
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5B5648] dark:text-[#ABB9AB] mt-2.5 flex items-center justify-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#B0863A] dark:text-[#DFBA73]" />
          <span>The Holy Qur'an, Surah Az-Zumar (39:9)</span>
        </p>
      </div>

    </section>
  );
};
