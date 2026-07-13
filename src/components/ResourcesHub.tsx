import React, { useState, useEffect } from "react";
import { FreeCourses } from "./FreeCourses";
import { LearnResources } from "./LearnResources";
import { BookOpen, Sparkles } from "lucide-react";

export function ResourcesHub() {
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "tools">((() => {
    try {
      const hash = window.location.hash;
      if (hash.includes("sub=tools")) return "tools";
    } catch (e) {
      console.warn(e);
    }
    return "audit";
  }));

  // Sync state to URL and update canonical link/meta dynamically
  useEffect(() => {
    try {
      const hash = window.location.hash || "";
      const [path, search] = hash.split("?");
      const params = new URLSearchParams(search || "");
      params.set("sub", activeSubTab);
      
      const targetHash = `${path}?${params.toString()}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }

      // Update head canonical link
      const canonicalLink = document.getElementById("seo-canonical-link");
      if (canonicalLink) {
        canonicalLink.setAttribute("href", `https://qalbiya-islamic-institute.vercel.app/${path}?${params.toString()}`);
      }

      // Update head meta description
      const metaDesc = document.getElementById("seo-meta-description");
      if (metaDesc) {
        const desc = activeSubTab === "audit"
          ? "Access free audited academic Deeniyat course textbooks, Tazkiyah lectures, and classical Arabic calligraphy worksheets."
          : "Utilize interactive Quranic Arabic vocabulary flashcards, live recitation feedback tools, and reference text search engines.";
        metaDesc.setAttribute("content", desc);
      }
    } catch (e) {
      console.warn("SEO tag sync failed", e);
    }
  }, [activeSubTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in text-left" id="resources-hub-page">
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <span className="text-[10px] uppercase font-bold font-mono tracking-[0.25em] text-[#8CA394]">
          Knowledge & Study Sanctuary
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
          Student Resources & Audits
        </h2>
        <p className="text-[#5B5648] text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed text-center">
          Unlock your true spiritual and intellectual potential. Access complementary self-paced study tracks, test your Deeniyat foundations with interactive quizzes, or refine your recitation with tajweed audio guides.
        </p>
        <div className="w-12 h-[1.5px] bg-[#B98072] mx-auto mt-4" />
      </div>

      {/* Main Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-[#F4EFE6] border border-[#DDD5C3] p-1.5 rounded-full flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("audit")}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === "audit"
                ? "bg-[#22301F] text-white shadow-sm"
                : "text-[#5B5648] hover:text-[#22301F]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Free Audited Curricula</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("tools")}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === "tools"
                ? "bg-[#22301F] text-white shadow-sm"
                : "text-[#5B5648] hover:text-[#22301F]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Tools</span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-[#DDD5C3]/40">
        {activeSubTab === "audit" ? (
          <FreeCourses showHeader={false} />
        ) : (
          <LearnResources showHeader={false} />
        )}
      </div>
    </div>
  );
}
