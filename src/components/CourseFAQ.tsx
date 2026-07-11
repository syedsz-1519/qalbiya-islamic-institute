import React, { useState, useEffect } from "react";
import { getFAQs } from "../lib/firebase";
import { HelpCircle, ChevronDown, Search, Filter, BookOpen, Award, Sparkles, MessageCircle } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  courseId?: string;
  createdAt?: string;
}

interface CourseFAQProps {
  userRole?: "admin" | "student";
  onGoToAnalytics?: () => void;
}

export function CourseFAQ({ userRole, onGoToAnalytics }: CourseFAQProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQsData = async () => {
      try {
        const data = await getFAQs();
        setFaqs(data);
      } catch (err) {
        console.error("Error loading FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQsData();
  }, []);

  // Filter categories
  const categories = ["All", ...Array.from(new Set(faqs.map(f => f.category || "General")))];

  // Filter FAQs based on category and search query
  const filteredFaqs = faqs.filter(f => {
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12" id="course-faq-section">
      {/* Decorative Top Separator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-[1px] bg-[#DDD5C3] flex-grow"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#B98072]"></div>
        <div className="h-[1px] bg-[#DDD5C3] flex-grow"></div>
      </div>

      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8CA394]/10 border border-[#8CA394]/20 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#22301F] font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-[#8CA394]" />
          <span>Support Desk</span>
        </div>
        <h3 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">
          Frequently Answered Inquiries
        </h3>
        <p className="text-[#5B5648] font-light text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
          Unveil answers regarding our certification credentials, semester timelines, textbook selections, and kid-friendly virtual systems.
        </p>
      </div>

      {/* Control Panel: Search & Categories */}
      <div className="bg-[#F4EFE6]/70 border border-[#DDD5C3] rounded-3xl p-5 mb-8 space-y-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5648]/50" />
          <input
            id="faq-search-input"
            type="text"
            placeholder="Type key terms... (e.g. 'Ijazah', 'schedule', 'kids', 'age')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#DDD5C3] rounded-2xl pl-11 pr-4 py-3 text-xs md:text-sm text-[#22301F] placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394] focus:ring-1 focus:ring-[#8CA394] transition-all"
          />
        </div>

        {/* Categories Carousel / Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <div className="text-[#5B5648]/80 font-mono text-[10px] uppercase tracking-wider font-bold mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Topic:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-serif tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                activeCategory === cat
                  ? "bg-[#22301F] text-white border-[#22301F] shadow-sm font-bold"
                  : "bg-white text-[#5B5648] border-[#DDD5C3] hover:bg-[#EAE4D5] hover:text-[#22301F]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#8CA394] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-[#5B5648]/60 uppercase tracking-widest">
              Fetching FAQs from Desk...
            </p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white/80 border border-dashed border-[#DDD5C3] rounded-2xl p-10 text-center space-y-2">
            <p className="text-[#5B5648] text-sm font-light">No FAQs match your search parameters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="text-xs font-mono text-[#8A5A4D] hover:underline font-bold"
            >
              Clear filters and view all
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
                  isExpanded 
                    ? "border-[#8CA394] shadow-md ring-1 ring-[#8CA394]/20" 
                    : "border-[#DDD5C3] hover:border-[#8CA394]/60 hover:shadow-sm"
                }`}
                id={`faq-item-${faq.id}`}
              >
                {/* Header/Question Trigger */}
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                      {faq.category}
                    </span>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#22301F] tracking-tight leading-snug">
                      {faq.question}
                    </h4>
                  </div>
                  <div className={`p-1.5 rounded-full bg-gray-50 border border-gray-100 text-[#22301F] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-96 opacity-100 border-t border-[#DDD5C3]/40" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="p-5 sm:p-6 bg-[#FAF9F6]/50 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed space-y-2">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Admin Action Shortcut */}
      {userRole === "admin" && onGoToAnalytics && (
        <div className="mt-10 bg-[#22301F] rounded-3xl p-5 border border-[#8CA394]/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h5 className="font-serif font-bold text-sm text-[#FCF1F3]/90 flex items-center gap-1.5 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Registrar's FAQ Control Desk</span>
            </h5>
            <p className="text-[11px] text-[#FCF1F3]/70 font-light">
              You are logged in as an Administrator. You can add new questions, modify categories, or delete items.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToAnalytics}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-[#22301F] rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap transition-transform active:scale-95 shadow-sm shrink-0"
          >
            Manage FAQs Desk →
          </button>
        </div>
      )}

      {/* Direct Contact Suggestion Card */}
      <div className="mt-12 bg-white border border-[#DDD5C3] p-6 rounded-3xl text-center space-y-3 shadow-sm max-w-2xl mx-auto">
        <h4 className="font-serif font-bold text-sm text-[#22301F]">Still have unanswered concerns?</h4>
        <p className="text-xs text-[#5B5648] font-light leading-relaxed">
          Our advisors are standing by. We respond to WhatsApp messages and admissions forms within a few hours.
        </p>
        <div className="flex items-center justify-center gap-2.5 pt-1.5">
          <a
            href="https://wa.me/918145363290?text=Salam!%20I%20have%20an%20admissions%20question%20not%20covered%20in%20the%20FAQs."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm font-mono"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
