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
        
        {/* Elegant Opening Hadith (Above the Fold) */}
        <div className="max-w-xl mx-auto bg-[#FBF8F1]/80 dark:bg-[#111610]/80 backdrop-blur-sm border border-[#DDD5C3]/40 dark:border-[#243524]/45 rounded-2xl p-4 md:p-5 space-y-2.5 shadow-sm hover:border-[#B98072]/30 transition-all duration-300">
          <div className="flex justify-center items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-[#B98072] font-bold">
            <BookOpen className="w-3.5 h-3.5 text-[#B98072]" />
            <span>Prophetic Legacy</span>
          </div>
          <p className="font-arabic text-2xl text-[#22301F]/95 dark:text-[#FAF4F2]/95 tracking-wide text-center leading-normal" dir="rtl">
            خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
          </p>
          <p className="font-serif italic text-[#5B5648] dark:text-[#ABB9AB] text-xs leading-relaxed max-w-md mx-auto">
            "The best among you are those who learn the Qur'an and teach it."
          </p>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#8A5A4D] dark:text-[#E0A395]">
            — Sahih al-Bukhari
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#B98072]/10 dark:bg-[#B98072]/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[#8A5A4D] dark:text-[#E0A395] border border-[#B98072]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#B98072] fill-[#F1E7D3] animate-pulse" />
          <span>A Sanctuary for Spiritual Learning</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#22301F] dark:text-[#FFE5EC] tracking-tight font-bold leading-[1.25] max-w-3xl mx-auto">
          Come back to who you were before the world got loud.
        </h2>

        <p className="font-sans text-[#5B5648] dark:text-[#FCD5CE] text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
          Qalbiya Institute is where hearts are nurtured, not just minds informed. Programs for women rebuilding their connection with Allah, and for children growing up rooted in faith.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onChoosePath("courses/women")}
            className="bg-[#B98072] text-[#FAF4F2] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#8A5A4D] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            For Her
          </button>
          <button
            onClick={() => onChoosePath("courses/kids")}
            className="bg-[#8CA394] text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#33453A] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            For Your Child
          </button>
        </div>
      </div>

    </section>
  );
};
