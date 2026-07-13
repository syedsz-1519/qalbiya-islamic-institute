import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search, Filter, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
}

const STATIC_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Who are the instructors at Qalbiya?",
    answer: "Our courses are taught by highly qualified female scholars (Ustadhas) and educators who specialize in Islamic jurisprudence, Quranic sciences, Arabic language, and early childhood spiritual mentorship, ensuring an authentic and deeply nurturing educational atmosphere.",
    category: "Instructors",
    order: 1
  },
  {
    id: "faq-2",
    question: "Are the classes live or pre-recorded?",
    answer: "To offer optimal flexibility alongside high accountability, classes are conducted live through interactive online sessions (e.g., Zoom/Google Meet) and recorded. Students have 24/7 access to recorded playback, lesson slides, and review materials via their Student Portal.",
    category: "Schedule & Format",
    order: 2
  },
  {
    id: "faq-3",
    question: "Can adult women register for the kids' courses on behalf of their children?",
    answer: "Absolutely. Mothers, female guardians, and adult women can register and manage the Kids Hub courses on behalf of their children. This ensures complete supervision of their child’s online progress, assignments, and spiritual development.",
    category: "Admissions",
    order: 3
  },
  {
    id: "faq-4",
    question: "How do I sync my Google Form response with my registration?",
    answer: "Once you submit your official Google Form, our administration matches the response based on your email address. You can log in with the same email in the Student Portal, and your dashboard will immediately synchronize your enrollment status.",
    category: "Admissions",
    order: 4
  },
  {
    id: "faq-5",
    question: "What age groups are supported in the kids' programs?",
    answer: "The Kids Hub programs are thoughtfully designed to support young learners between the ages of 5 and 15. Students are separated into age-appropriate cohorts to ensure the teaching style and interactive curriculum fit their specific learning stage.",
    category: "Kids Hub",
    order: 5
  }
];

interface CourseFAQProps {
  userRole?: "admin" | "student";
  onGoToAnalytics?: () => void;
}

export function CourseFAQ({ userRole, onGoToAnalytics }: CourseFAQProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter categories
  const categories = ["All", "Instructors", "Schedule & Format", "Admissions", "Kids Hub"];

  // Filter FAQs based on category and search query
  const filteredFaqs = STATIC_FAQS.filter(f => {
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Motion animation parameters
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
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
        <h3 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight animate-fade-in">
          Frequently Answered Inquiries
        </h3>
        <p className="text-[#5B5648] font-light text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
          Unveil answers regarding our qualified female instructors, interactive platforms, parental enrolment guides, and kids programs.
        </p>
      </div>

      {/* Control Panel: Search & Categories */}
      <div className="bg-white/80 border border-[#DDD5C3]/80 backdrop-blur-md rounded-3xl p-5 mb-8 space-y-4 shadow-sm relative z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5648]/50" />
          <input
            id="faq-search-input"
            type="text"
            placeholder="Type key terms... (e.g. 'instructors', 'pre-recorded', 'age', 'sync')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF4F2]/50 border border-[#DDD5C3] rounded-2xl pl-11 pr-4 py-3 text-xs md:text-sm text-[#22301F] placeholder-[#5B5648]/40 focus:outline-none focus:border-[#B98072] focus:ring-1 focus:ring-[#B98072] transition-all"
          />
        </div>

        {/* Categories Carousel / Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="text-[#5B5648]/80 font-mono text-[10px] uppercase tracking-wider font-bold mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-[#B98072]" />
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                activeCategory === cat
                  ? "bg-[#22301F] text-white border-[#22301F] shadow-sm font-bold"
                  : "bg-white text-[#5B5648] border-[#DDD5C3] hover:bg-[#FAF4F2] hover:text-[#22301F]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List with Framer Motion Staggered Entrance */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={activeCategory + "_" + searchQuery}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="space-y-4 relative z-10"
        >
          {filteredFaqs.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="bg-white/80 border border-dashed border-[#DDD5C3] rounded-2xl p-10 text-center space-y-2"
            >
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
            </motion.div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  variants={itemVariants}
                  layout="position"
                  className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
                    isExpanded 
                      ? "border-[#B98072] shadow-md ring-1 ring-[#B98072]/20" 
                      : "border-[#DDD5C3] hover:border-[#B98072]/60 hover:shadow-sm"
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
                      <span className="text-[9px] font-mono bg-[#FAF4F2] text-[#8A5A4D] px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold border border-[#DDD5C3]/40">
                        {faq.category}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#22301F] tracking-tight leading-snug">
                        {faq.question}
                      </h4>
                    </div>
                    <div className={`p-1.5 rounded-full bg-[#FAF4F2] border border-[#DDD5C3]/40 text-[#22301F] transition-transform duration-300 shrink-0 ${isExpanded ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-4 h-4 text-[#8A5A4D]" />
                    </div>
                  </button>

                  {/* Answer Content Animated Height Expansion with Framer Motion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, y: -12 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -12 }}
                        transition={{ 
                          height: { duration: 0.35, ease: "easeInOut" },
                          opacity: { duration: 0.25 },
                          y: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 sm:p-6 bg-[#FAF4F2]/30 border-t border-[#DDD5C3]/40 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* Direct Contact Suggestion Card */}
      <div className="mt-12 bg-white/90 backdrop-blur-md border border-[#DDD5C3] p-6 rounded-3xl text-center space-y-3 shadow-sm max-w-2xl mx-auto relative z-10">
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
