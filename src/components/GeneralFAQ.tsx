import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface GeneralFAQProps {
  onTabChange?: (tab: string) => void;
  onBackToHome: () => void;
}

export function GeneralFAQ({ onTabChange, onBackToHome }: GeneralFAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const faqItems: FAQItem[] = [
    {
      question: "Is attendance tracked?",
      answer: "Yes — attendance is tracked for all our courses."
    },
    {
      question: "Do I get a recording if I miss a live class?",
      answer: "This varies by course — some courses offer recordings and some don't. This will be clearly communicated to you at the time of enrollment."
    },
    {
      question: "Is there a trial or demo class before I enroll?",
      answer: (
        <span>
          Yes — trial classes are available for select courses, including Tajweed 1:1 Classes and the Juniors Deeniyat Mastercourse. Message us to ask about a trial for the course you're interested in.
        </span>
      )
    },
    {
      question: "Is QALBIYA Islamic Institute authentic / who teaches the courses?",
      answer: (
        <span>
          All our courses are taught by qualified, dedicated teachers rooted in authentic Qur'an and Sunnah teaching. You can read more about our founder and approach on our{" "}
          <button
            onClick={() => onTabChange?.("about")}
            className="text-[#8A5A4D] font-bold hover:underline cursor-pointer"
          >
            About
          </button>{" "}
          page.
        </span>
      )
    },
    {
      question: "How do I enroll in a course?",
      answer: (
        <span>
          Browse our{" "}
          <button
            onClick={() => onTabChange?.("women")}
            className="text-[#8A5A4D] font-bold hover:underline cursor-pointer"
          >
            Women's Courses
          </button>{" "}
          or{" "}
          <button
            onClick={() => onTabChange?.("kids")}
            className="text-[#8A5A4D] font-bold hover:underline cursor-pointer"
          >
            Kids' Courses
          </button>{" "}
          pages, choose the course that fits, and message us on WhatsApp or Instagram to complete enrollment.
        </span>
      )
    },
    {
      question: "How do I pay?",
      answer: "Payment details are shared directly with you once you reach out to enroll. We currently accept bank transfer, JazzCash, EasyPaisa, and other direct payment methods which will be confirmed at the time of your registration."
    },
    {
      question: "Can I get a refund if I change my mind?",
      answer: (
        <span>
          All course fees are non-refundable. Please see our{" "}
          <button
            onClick={() => onTabChange?.("refund-policy")}
            className="text-[#8A5A4D] font-bold hover:underline cursor-pointer"
          >
            Refund Policy
          </button>{" "}
          for details, and feel free to ask us any questions before enrolling.
        </span>
      )
    },
    {
      question: "Are classes live or pre-recorded?",
      answer: "All classes are conducted live online via Google Meet — not pre-recorded."
    },
    {
      question: "Do you offer classes for beginners?",
      answer: "Yes — several of our courses, including Noorani Qaida (Women's & Kids') and Pre-Diploma in Deeniyat, are designed specifically for beginners with no prior knowledge required."
    },
    {
      question: "What if I have to miss a class?",
      answer: "This depends on the course format. For 1-on-1 classes, missed content is simply covered in the next session. For group classes, please check the specific course page or contact us for guidance."
    },
    {
      question: "Do you offer free courses or sessions?",
      answer: (
        <span>
          Yes — check our{" "}
          <button
            onClick={() => onTabChange?.("free-courses")}
            className="text-[#8A5A4D] font-bold hover:underline cursor-pointer"
          >
            Free Courses
          </button>{" "}
          page for our current free offerings, including weekly Tarbiyah & Tazkiyah sessions.
        </span>
      )
    },
    {
      question: "Do you offer scholarships?",
      answer: (
        <span>
          Yes — we offer scholarships for students who genuinely cannot afford our courses. Visit our{" "}
          <button
            onClick={() => onTabChange?.("scholarship")}
            className="text-[#8A5A4D] font-bold hover:underline cursor-pointer"
          >
            Scholarship
          </button>{" "}
          page to apply.
        </span>
      )
    },
    {
      question: "Do you offer courses for children younger than 6 or older than 12?",
      answer: "Our current children's courses are designed for ages 6–12. Please contact us directly if you have a child outside this range — we're happy to discuss options."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12 animate-fade-in text-left font-sans" id="general-faq-page">
      
      {/* Breadcrumb path */}
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5B5648] font-bold" id="faq-breadcrumb">
        <button onClick={onBackToHome} className="hover:text-[#B98072] cursor-pointer transition-colors">
          Homepage
        </button>
        <ChevronRight className="w-3 h-3 text-[#8CA394]" />
        <span className="text-[#8A5A4D]">General FAQ</span>
      </div>

      {/* Aesthetic Header */}
      <div className="space-y-4 max-w-xl">
        <div className="w-12 h-12 bg-[#B98072]/15 text-[#8A5A4D] border border-[#B98072]/20 rounded-full flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xs text-gray-400 font-mono">Everything you need to know about our institute and courses</p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4" id="general-faq-accordion-container">
        {faqItems.map((faq, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
                isExpanded
                  ? "border-[#B98072] shadow-md ring-1 ring-[#B98072]/20"
                  : "border-[#DDD5C3] hover:border-[#B98072]/60 hover:shadow-sm"
              }`}
              id={`faq-item-idx-${idx}`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
              >
                <h4 className="font-serif text-sm sm:text-base font-bold text-[#22301F] tracking-tight leading-snug">
                  {faq.question}
                </h4>
                <div className={`p-1.5 rounded-full bg-[#FAF4F2] border border-[#DDD5C3]/40 text-[#22301F] transition-transform duration-300 shrink-0 ${isExpanded ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-4 h-4 text-[#8A5A4D]" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 bg-[#FAF4F2]/30 border-t border-[#DDD5C3]/40 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Direct WhatsApp Contact Card */}
      <div className="bg-[#FAF4F2] border border-[#DDD5C3] rounded-3xl p-6 sm:p-8 text-center space-y-4 max-w-2xl mx-auto" id="general-faq-contact-card">
        <h4 className="font-serif font-bold text-lg text-[#22301F]">Still have unanswered concerns?</h4>
        <p className="text-xs sm:text-sm text-[#5B5648] font-light max-w-md mx-auto leading-relaxed">
          Connect directly with our admissions office on WhatsApp. We aim to respond within 24 hours.
        </p>
        <div className="flex justify-center pt-2">
          <a
            href="https://wa.me/918145363290?text=Assalamu%27alaikum!%20I%20have%20an%20admissions%20question%20not%20covered%20in%20the%20FAQs."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Admissions</span>
          </a>
        </div>
      </div>

    </div>
  );
}
