import React, { useState } from "react";
import { Course } from "../types";
import { User } from "firebase/auth";
import { ArrowLeft, Clock, Calendar, User as UserIcon, BookOpen, CheckCircle, ShieldAlert, FileCheck, Sparkles, RefreshCw, Award, Globe, ChevronDown, ChevronUp, Instagram, MessageCircle, Check, Heart } from "lucide-react";
import { motion } from "motion/react";

interface CourseDetailPageProps {
  course: Course;
  formDetails: { formId: string; formUrl: string } | null;
  onClose: () => void; // Go back
  user: User | null;
  handleLogin: () => void;
  onEnrollSuccess: (courseId: string, acceptedTermsAt: string) => void;
  isEnrolled: boolean;
}

export function CourseDetailPage({
  course,
  formDetails,
  onClose,
  user,
  handleLogin,
  onEnrollSuccess,
  isEnrolled,
}: CourseDetailPageProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Custom states for Pre-Diploma page
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingMode, setPricingMode] = useState<"group" | "personal">("group");

  // Dynamic Key Learnings States
  const [learnings, setLearnings] = useState<string[]>([]);
  const [spiritualOutcome, setSpiritualOutcome] = useState<string>("");
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [isLoadingLearnings, setIsLoadingLearnings] = useState(false);
  const [learningsError, setLearningsError] = useState("");

  const fetchKeyLearnings = async (forceRefresh = false) => {
    const cacheKey = `qalbiya-key-learnings-${course.id}`;
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.learnings && parsed.learnings.length > 0) {
            setLearnings(parsed.learnings);
            setSpiritualOutcome(parsed.spiritualOutcome || "");
            setSources(parsed.sources || []);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached learnings", e);
        }
      }
    }

    setIsLoadingLearnings(true);
    setLearningsError("");
    try {
      const res = await fetch("/api/key-learnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          description: course.description,
          instructor: course.instructor
        })
      });

      if (!res.ok) throw new Error("Failed to load Dynamic Key Learnings");
      const data = await res.json();
      if (data.success) {
        setLearnings(data.learnings);
        setSpiritualOutcome(data.spiritualOutcome);
        setSources(data.sources || []);
        localStorage.setItem(cacheKey, JSON.stringify({
          learnings: data.learnings,
          spiritualOutcome: data.spiritualOutcome,
          sources: data.sources || []
        }));
      } else {
        throw new Error(data.error || "Failed to load summary");
      }
    } catch (err: any) {
      console.error("Error fetching key learnings:", err);
      setLearningsError("Unable to dynamically load semester achievements.");
    } finally {
      setIsLoadingLearnings(false);
    }
  };

  React.useEffect(() => {
    fetchKeyLearnings();
  }, [course.id]);

  const handleEnroll = async () => {
    if (!user) {
      handleLogin();
      return;
    }
    if (!acceptedTerms) {
      setEnrollError("Please review and accept our Enrollment Terms & Conditions checkbox.");
      return;
    }
    
    setEnrollError("");
    setIsSubmittingEnroll(true);
    try {
      const acceptedAt = new Date().toISOString();
      await onEnrollSuccess(course.id, acceptedAt);
      
      const studentName = user?.displayName || user?.email?.split('@')[0] || "Sincere Student";
      const studentEmail = user?.email || "";
      
      const waMessage = `Assalamu'alaikum wa rehmatullahi wa barakatuhu, Ustadha Syed Mustara.

I would like to enroll in the following course at Qalbiya Islamic Institute:
📚 *Course:* ${course.title}
⏳ *Duration:* ${course.duration}
🗓️ *Schedule:* ${course.schedule}

*My Details:*
• *Name:* ${studentName}
• *Email:* ${studentEmail}

Please guide me with the next steps for cohort registration and onboarding. JazakAllahu Khairan!`;

      const waUrl = `https://wa.me/918145363290?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, "_blank");

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setEnrollError("An error occurred during enrollment. Please try again.");
    } finally {
      setIsSubmittingEnroll(false);
    }
  };

  if (course.id === "pre-diploma-deeniyat") {
    const faqs = [
      {
        q: "Do I need any prior knowledge to join?",
        a: "No — this course is designed for beginners and takes you from the basics all the way to a strong, complete foundation."
      },
      {
        q: "What's the difference between the group and personal option?",
        a: "Both cover the same complete syllabus. The personal (1-on-1) option gives you individual attention and a schedule built around you, while the group option follows a set class schedule with other students, at a lower monthly fee."
      },
      {
        q: "Will I need to make my own notes?",
        a: "You'll receive notes for key topics, and you'll also build some of your own along the way — this combination helps the lessons truly settle in, while still giving you a reliable reference to fall back on."
      },
      {
        q: "Are there quizzes or exams?",
        a: "Yes — weekly quizzes throughout the course, a monthly test at the end of every month to track your progress, and a final exam at the end."
      },
      {
        q: "Will I get a certificate?",
        a: "Yes — you'll receive a certificate upon completing the course."
      }
    ];

    const syllabusItems = [
      { title: "Makhraj", desc: "Correct pronunciation points of Arabic letters" },
      { title: "Basic Tajweed", desc: "Essential recitation rules for beautiful reading" },
      { title: "Hifz-e-Hadith", desc: "Memorizing and digesting beautiful prophetic wisdoms" },
      { title: "Daily Duas & Sunnah", desc: "Integrating sacred habits into daily routine" },
      { title: "Aqaid", desc: "Solid, clear foundation of core Islamic beliefs" },
      { title: "Akhlaq", desc: "Purification of the heart and noble character" },
      { title: "Namaz & Masail", desc: "Proper rulings of worship and modern daily cases" },
      { title: "Asma-ul-Husna", desc: "Grasping and living the beautiful names of Allah" }
    ];

    const deliverables = [
      { icon: "📚", title: "Study Notes", desc: "Provided for key topics, plus notes for personal reflection" },
      { icon: "🧠", title: "Weekly Quizzes", desc: "To reinforce your learning and keep track" },
      { icon: "🗓️", title: "Monthly Tests", desc: "At the end of every month to measure progress" },
      { icon: "📝", title: "Final Exam", desc: "At the end of the course to secure understanding" },
      { icon: "💬", title: "WhatsApp Support", desc: "Direct guidance outside of class hours" },
      { icon: "🎓", title: "Completion Certificate", desc: "Issued upon passing the final assessment" }
    ];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in text-left">
        {/* Back Button */}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5B5648] hover:text-[#B98072] font-bold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Hub</span>
        </button>

        {/* SECTION 1 - Hero */}
        <div className="bg-[#FAF8F1] border border-[#DDD5C3] rounded-[36px] overflow-hidden p-6 sm:p-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#DDD5C3_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 border border-red-200/50 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold">
                <span className="animate-pulse">🔥</span> Popular Course
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#22301F] tracking-tight leading-tight">
                Your complete foundation in Deen.
              </h1>

              <p className="text-sm sm:text-base text-[#5B5648] font-light leading-relaxed max-w-2xl">
                A structured, six-month journey covering everything from correcting your recitation to understanding your beliefs — so you don't just follow Islam, you understand it, live it, and feel closer to Allah.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#enroll-section"
                  className="bg-[#22301F] hover:bg-[#33453A] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02]"
                >
                  Enroll Now →
                </a>
                <a
                  href="#syllabus-section"
                  className="bg-white hover:bg-gray-50 text-[#22301F] border border-[#DDD5C3] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02]"
                >
                  Explore Syllabus
                </a>
              </div>
            </div>

            {/* Visual Art Box */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[360px] aspect-square rounded-[32px] bg-gradient-to-tr from-[#EADAC2] to-[#FAF8F1] border border-[#DDD5C3] p-8 flex flex-col justify-between shadow-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#8CA394_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-full blur-2xl" />
                
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A5A4D] font-bold">
                    Qalbiya Academy
                  </span>
                  <BookOpen className="w-5 h-5 text-[#8CA394]" />
                </div>

                <div className="space-y-4 relative z-10 text-center py-6">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute w-28 h-28 bg-[#8CA394]/10 rounded-full blur-xl animate-pulse" />
                    <div className="w-20 h-16 bg-white border border-[#DDD5C3] rounded-lg shadow-sm flex items-center justify-center relative rotate-[-6deg] z-10 translate-x-1">
                      <div className="w-[1px] h-full bg-gray-200 absolute left-1/2 -translate-x-1/2" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-2 left-3 opacity-65" />
                      <div className="w-6 h-[1px] bg-gray-100 absolute top-4 left-2" />
                      <div className="w-6 h-[1px] bg-gray-100 absolute top-6 left-2" />
                      <div className="w-6 h-[1px] bg-gray-100 absolute top-8 left-2" />
                    </div>
                    <div className="w-20 h-16 bg-white border border-[#DDD5C3] rounded-lg shadow-sm flex items-center justify-center absolute rotate-[6deg] z-20 translate-x-7">
                      <div className="w-[1px] h-full bg-gray-200 absolute left-1/2 -translate-x-1/2" />
                      <div className="w-6 h-[1px] bg-gray-100 absolute top-4 left-10" />
                      <div className="w-6 h-[1px] bg-gray-100 absolute top-6 left-10" />
                      <div className="w-6 h-[1px] bg-gray-100 absolute top-8 left-10" />
                      <BookOpen className="w-6 h-6 text-[#8A5A4D] opacity-80" />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="font-serif text-sm font-semibold text-[#22301F] italic">
                      "Al-Ilmu Nurun"
                    </p>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-[#5B5648] opacity-70">
                      Knowledge is Light
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#DDD5C3]/60 pt-3 flex items-center justify-between text-[10px] font-mono text-[#5B5648]">
                  <span>6 Months Course</span>
                  <span>Adult Women Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 - What This Course Covers */}
        <div id="syllabus-section" className="space-y-8 scroll-mt-10">
          <div className="text-center md:text-left max-w-3xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold block">
              Curriculum Map
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
              What This Course Covers
            </h2>
            <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
              This is Qalbiya's most complete beginner-to-strong-foundation course — built for the woman who wants to stop learning her deen in scattered pieces and finally learn it as one connected whole.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {syllabusItems.map((item, idx) => (
              <div key={idx} className="bg-white border border-[#DDD5C3]/50 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#8CA394] transition-all duration-300 shadow-3xs group">
                <div className="flex justify-between items-start">
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F1] border border-[#DDD5C3]/60 text-[#8A5A4D] text-[10px] font-mono font-bold flex items-center justify-center">
                    0{idx + 1}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8CA394] opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#22301F]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 - What You'll Get */}
        <div className="space-y-8 border-t border-[#DDD5C3]/40 pt-16">
          <div className="text-center md:text-left max-w-2xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5A4D] font-bold block">
              Student Deliverables
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
              What You'll Get
            </h2>
            <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
              Every student is provided with the highest standard of supportive assets and review structures to keep their study active.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliverables.map((item, idx) => (
              <div key={idx} className="bg-[#FAF8F1]/40 border border-[#DDD5C3]/40 p-5 rounded-2xl flex gap-4 items-start transition-all hover:bg-[#FAF8F1]/70">
                <div className="text-2xl shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#22301F]">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#5B5648] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 - The Outcome */}
        <div className="bg-[#FAF4F2] border border-[#DDD5C3] rounded-[32px] p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden shadow-xs">
          <div className="absolute -top-10 -left-10 text-[140px] font-serif text-[#8A5A4D]/5 select-none pointer-events-none">
            “
          </div>
          <div className="absolute -bottom-20 -right-10 text-[140px] font-serif text-[#8A5A4D]/5 select-none pointer-events-none">
            ”
          </div>
          
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5A4D] font-bold block relative z-10">
            The Ultimate Spiritual Outcome
          </span>
          
          <p className="font-serif italic text-lg sm:text-2xl text-[#22301F] leading-relaxed max-w-3xl mx-auto relative z-10">
            "This course builds your foundation in Deen — helping you correct your recitation, understand your beliefs, and practice Islam with clarity in daily life. By the end, you won't just follow Islam — you'll understand it, live it, and feel closer to Allah."
          </p>

          <div className="w-12 h-[1px] bg-[#8A5A4D] mx-auto relative z-10" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648] font-bold relative z-10">
            Qalbiya Foundation Standard
          </p>
        </div>

        {/* SECTION 5 - A Note From Your Teacher */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-t border-[#DDD5C3]/40 pt-16">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-full max-w-[240px] aspect-[4/5] rounded-[24px] bg-[#FAF8F1] border border-[#DDD5C3] p-4 flex flex-col justify-end relative overflow-hidden shadow-xs">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Heart className="w-32 h-32 text-[#8A5A4D]" />
              </div>
              <div className="relative z-20 space-y-1 text-center bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-[#DDD5C3]/40">
                <p className="font-serif font-bold text-xs text-[#22301F]">Ustadha Mustara</p>
                <p className="text-[8px] font-mono uppercase tracking-wider text-[#8A5A4D]">Founder & Ustadha</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6 text-left">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold block">
              Message from the Founder
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F] tracking-tight">
              A Note From Your Teacher
            </h3>
            
            <blockquote className="font-serif italic text-base sm:text-lg text-[#5B5648] border-l-2 border-[#8A5A4D] pl-4 leading-relaxed">
              "This course exists for the woman I once was — someone who wanted to actually understand her deen, not just perform it. If that's you, I built this for exactly that reason."
            </blockquote>

            <div>
              <p className="font-serif font-bold text-sm text-[#22301F]">Mustara</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#5B5648]">Founder of Qalbiya Institute</p>
            </div>
          </div>
        </div>

        {/* SECTION 6 & 7 - Course Details & Who It Is For */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-[#DDD5C3]/40 pt-16">
          <div className="lg:col-span-5 space-y-6 text-left flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5A4D] font-bold block">
              Enrollment Suitability
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F] tracking-tight">
              Who This Is For
            </h3>
            <p className="text-sm sm:text-base text-[#5B5648] font-light leading-relaxed">
              For every beginner who's ready to stop learning her deen in fragments — and finally build one solid, lasting foundation.
            </p>
            <div className="p-5 bg-[#FAF8F1] border border-[#DDD5C3]/60 rounded-2xl flex gap-3.5 items-center">
              <Check className="w-5 h-5 text-[#8CA394] shrink-0" />
              <p className="text-xs text-[#22301F] font-medium leading-normal">
                No Arabic reading experience or Islamic studies background required. We guide you from zero.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold block">
              Schedule & Logistics
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F] tracking-tight">
              Course Logistics & Fees
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Group Card */}
              <div className="bg-white border border-[#DDD5C3] rounded-2xl p-6 space-y-4 hover:border-[#8CA394] transition-all relative">
                <div className="absolute top-3 right-3 bg-gray-100 text-[#5B5648] text-[8px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                  Group Class
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-[#8A5A4D] uppercase tracking-wider">Pricing Option</p>
                  <h4 className="font-serif text-lg font-bold text-[#22301F]">Sisters Group</h4>
                </div>
                <div className="border-t border-[#DDD5C3]/40 pt-3 space-y-2 text-xs text-[#5B5648] font-light">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium text-[#22301F]">Sisters Cohort</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform:</span>
                    <span className="font-medium text-[#22301F]">Google Meet</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium text-[#22301F]">6 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Classes:</span>
                    <span className="font-medium text-[#22301F]">Set schedule</span>
                  </div>
                </div>
                <div className="border-t border-[#DDD5C3]/40 pt-3 flex items-baseline justify-between">
                  <span className="text-xs text-[#5B5648]">Monthly Tuition:</span>
                  <div className="text-right">
                    <span className="font-serif text-xl font-bold text-[#22301F]">Rs. 499</span>
                    <span className="text-[10px] text-gray-400">/mo</span>
                  </div>
                </div>
              </div>

              {/* Personal Card */}
              <div className="bg-[#FAF8F1] border-2 border-[#8CA394] rounded-2xl p-6 space-y-4 hover:border-[#33453A] transition-all relative">
                <div className="absolute top-3 right-3 bg-[#8CA394] text-white text-[8px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                  Personal (1-on-1)
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-[#8A5A4D] uppercase tracking-wider">Premium Option</p>
                  <h4 className="font-serif text-lg font-bold text-[#22301F]">Dedicated 1-on-1</h4>
                </div>
                <div className="border-t border-[#DDD5C3]/40 pt-3 space-y-2 text-xs text-[#5B5648] font-light">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium text-[#22301F]">1:1 Dedicated</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform:</span>
                    <span className="font-medium text-[#22301F]">Google Meet</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium text-[#22301F]">6 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Classes:</span>
                    <span className="font-medium text-[#22301F]">Custom flexible</span>
                  </div>
                </div>
                <div className="border-t border-[#DDD5C3]/40 pt-3 flex items-baseline justify-between">
                  <span className="text-xs text-[#5B5648]">Monthly Tuition:</span>
                  <div className="text-right">
                    <span className="font-serif text-xl font-bold text-[#22301F]">Rs. 699</span>
                    <span className="text-[10px] text-gray-400">/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 8 - FAQs (Accordion style) */}
        <div className="space-y-8 border-t border-[#DDD5C3]/40 pt-16">
          <div className="text-center md:text-left max-w-2xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold block">
              Answers Hub
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
              Find instant answers to questions regarding study loads, schedule adjustments, materials, and evaluations.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-white border border-[#DDD5C3]/70 rounded-2xl overflow-hidden transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-serif font-bold text-xs sm:text-sm text-[#22301F] hover:bg-[#FAF8F1]/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8A5A4D] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8CA394] shrink-0" />
                    )}
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[300px] border-t border-[#DDD5C3]/30 p-6 bg-[#FAF8F1]/10" : "max-h-0"}`}
                  >
                    <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 9 - Closing CTA */}
        <div id="enroll-section" className="bg-[#22301F] text-white rounded-[36px] overflow-hidden p-6 sm:p-12 relative shadow-md">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8CA394] font-bold block">
                Begin Your Path
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                Build the foundation your deen deserves — one that stays with you for life.
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                Registered students receive personalized dashboard credentials, comprehensive study kits, and direct mentorship lines. Start with a structured path today.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="https://wa.me/918145363290?text=Assalamu%27alaikum!%20I%20would%20like%20to%20inquire%20about%20the%20Pre-Diploma%20in%20Deeniyat%206-Month%20program."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp Admissions Desk</span>
                </a>
                <a
                  href="https://instagram.com/qalbiya_institute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Instagram className="w-4 h-4 shrink-0" />
                  <span>DM on Instagram</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/95 text-[#22301F] rounded-[28px] p-6 sm:p-8 space-y-6 text-left shadow-lg border border-white/20">
              <div className="space-y-1">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A5A4D] font-bold block">
                  Intake Desk
                </p>
                <h3 className="font-serif text-lg font-bold">
                  Cohort Enrollment Panel
                </h3>
                <p className="text-[11px] text-[#5B5648] font-light leading-relaxed">
                  Join the Pre-Diploma in Deeniyat cohort today. Select your plan and submit your registration securely.
                </p>
              </div>

              {isEnrolled ? (
                <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 text-center space-y-4 py-8 animate-fade-in">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm">Active Enrollment Authenticated</h4>
                    <p className="text-[11px] text-gray-500 font-light max-w-xs mx-auto">
                      Assalamu alaikum! You are actively registered in the Pre-Diploma program. Check your Student Portal dashboard or WhatsApp for updates.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-[#5B5648] font-bold block">
                      Select Cohort Format
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPricingMode("group")}
                        className={`py-2 text-center text-xs font-bold rounded-lg cursor-pointer transition-all ${pricingMode === "group" ? "bg-white text-[#22301F] shadow-2xs" : "text-[#5B5648]/70 hover:text-[#22301F]"}`}
                      >
                        Group (Rs. 499/mo)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingMode("personal")}
                        className={`py-2 text-center text-xs font-bold rounded-lg cursor-pointer transition-all ${pricingMode === "personal" ? "bg-white text-[#22301F] shadow-2xs" : "text-[#5B5648]/70 hover:text-[#22301F]"}`}
                      >
                        Personal (Rs. 699/mo)
                      </button>
                    </div>
                  </div>

                  {formDetails ? (
                    <div className="bg-[#FAF8F1] border border-[#22301F]/15 rounded-2xl p-4 space-y-3.5 text-xs text-[#22301F]">
                      <div className="flex gap-2 items-center text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span>Google Form Dossier Active</span>
                      </div>
                      <p className="text-[#5B5648] font-light leading-relaxed">
                        To finalize your enrollment credentials, please fill out the administrative intake form:
                      </p>
                      <a
                        href={formDetails.formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-[#22301F] hover:bg-[#8A5A4D] text-white font-mono uppercase tracking-wider text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                      >
                        <span>Fill Google Form</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : null}

                  {/* Terms Acceptance checkbox */}
                  <div className="space-y-3 border-t border-[#DDD5C3]/40 pt-4 text-left">
                    <label className="flex items-start gap-2.5 text-[11px] text-gray-500 font-light cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="accent-[#B98072] mt-0.5 shrink-0"
                      />
                      <span>
                        I have reviewed and accept the <span className="font-semibold text-[#22301F]">Qalbiya Adab Conduct Standards</span> and agree to maintain academic integrity and cohort privacy.
                      </span>
                    </label>
                  </div>

                  {enrollError && (
                    <p className="text-[10px] text-red-500 font-mono">
                      ⚠️ {enrollError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={isSubmittingEnroll || !acceptedTerms}
                    className="w-full bg-[#22301F] hover:bg-[#33453A] disabled:bg-[#DDD5C3] text-white disabled:text-[#5B5648]/40 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold cursor-pointer transition-transform active:scale-95 shadow-sm inline-flex items-center justify-center gap-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{isSubmittingEnroll ? "Joining Cohort..." : "Join Course Now"}</span>
                  </button>

                  {!user && (
                    <p className="text-[10px] text-gray-400 text-center font-light mt-2">
                      * Signing in with your Google account is required to log progress.
                    </p>
                  )}
                </div>
              )}

              {showSuccessToast && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-center text-[11px] font-mono animate-fade-in">
                  ✓ Enrollment recorded successfully! Welcome to the cohort.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in text-left" id={`course-detail-page-${course.id}`}>
      
      {/* Back to Hub button */}
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5B5648] hover:text-[#B98072] font-bold cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Hub</span>
      </button>

      {/* Hero Header */}
      <div className={`p-8 sm:p-12 rounded-[32px] border relative overflow-hidden bg-gradient-to-tr ${course.bgGradient || "from-amber-50 to-orange-100/50 text-[#22301F] border-[#DDD5C3]"}`}>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-40 h-40" />
        </div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="flex flex-wrap gap-2.5 items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-white/80 backdrop-blur-xs text-[#22301F] border border-current/10 px-3 py-1 rounded-full font-bold">
              {course.category === "women" ? "Women Academy" : "Juniors Education"}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest bg-[#22301F] text-white px-3 py-1 rounded-full font-bold">
              {course.duration} Program
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-sm sm:text-base opacity-90 font-light leading-relaxed">
            {course.description}
          </p>

          {/* Logistics Metadata Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-current/10 text-xs sm:text-sm">
            <div className="flex gap-2.5 items-center">
              <Clock className="w-5 h-5 opacity-80" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider opacity-60">Duration</p>
                <p className="font-bold">{course.duration}</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <Calendar className="w-5 h-5 opacity-80" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider opacity-60">Weekly Schedule</p>
                <p className="font-bold">{course.schedule}</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <UserIcon className="w-5 h-5 opacity-80" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider opacity-60">Head Instructor</p>
                <p className="font-bold">{course.instructor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Syllabus & Benefits (7 cols) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Detailed Narrative */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#22301F] border-b border-[#DDD5C3]/40 pb-2">
              Academic Program Narrative
            </h3>
            <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
              {course.longDescription}
            </p>
          </div>

          {/* Dynamic AI-Generated Key Learnings */}
          <div className="bg-[#FCF6F2] border border-[#EADAC2] rounded-[24px] p-6 space-y-4 shadow-xs relative overflow-hidden">
            {/* Elegant Background Stitching */}
            <div className="absolute inset-0 border border-[#EADAC2]/30 m-1 rounded-[20px] pointer-events-none border-dashed"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#B0863A]/10 text-[#B0863A] rounded-lg">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-xs sm:text-sm font-bold text-[#22301F] tracking-tight">
                    Dynamic Semester Achievements
                  </h3>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#8A5A4D]">
                    AI-Powered Key Learnings
                  </p>
                </div>
              </div>
              <button
                id="btn-refresh-learnings"
                onClick={() => fetchKeyLearnings(true)}
                disabled={isLoadingLearnings}
                title="Regenerate dynamic achievements"
                className="p-1.5 rounded-lg border border-[#DDD5C3] hover:border-[#8A5A4D] text-[#5B5648] hover:text-[#8A5A4D] bg-white transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLearnings ? "animate-spin text-[#B0863A]" : ""}`} />
              </button>
            </div>

            {isLoadingLearnings ? (
              <div className="space-y-3 py-2">
                <div className="h-4 bg-[#22301F]/5 rounded-lg w-11/12 animate-pulse"></div>
                <div className="h-4 bg-[#22301F]/5 rounded-lg w-full animate-pulse"></div>
                <div className="h-4 bg-[#22301F]/5 rounded-lg w-10/12 animate-pulse"></div>
                <div className="pt-2 border-t border-[#DDD5C3]/30">
                  <div className="h-3 bg-[#22301F]/5 rounded-lg w-3/4 animate-pulse"></div>
                </div>
              </div>
            ) : learningsError ? (
              <div className="py-4 text-center space-y-2 relative z-10">
                <p className="text-xs text-red-600 font-medium">{learningsError}</p>
                <button
                  id="btn-retry-learnings"
                  onClick={() => fetchKeyLearnings(true)}
                  className="px-3 py-1 bg-[#22301F] hover:bg-[#8A5A4D] text-white text-[10px] font-mono uppercase tracking-wider rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Retry Generation
                </button>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                <ul className="space-y-3">
                  {learnings.map((learning, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="flex gap-3 items-start text-xs sm:text-sm text-[#33453A] font-light leading-relaxed"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#B0863A]/10 text-[#B0863A] border border-[#B0863A]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="w-3 h-3" />
                      </div>
                      <span>{learning}</span>
                    </motion.li>
                  ))}
                </ul>

                {spiritualOutcome && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="pt-3 border-t border-[#EADAC2]/60 mt-3 text-center"
                  >
                    <p className="font-serif italic text-xs text-[#8A5A4D] leading-relaxed relative px-4 text-center">
                      <span className="absolute -top-1 left-0 text-lg font-serif text-[#B0863A]/30">“</span>
                      {spiritualOutcome}
                      <span className="absolute -bottom-3 right-0 text-lg font-serif text-[#B0863A]/30">”</span>
                    </p>
                  </motion.div>
                )}

                {sources && sources.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="pt-3 border-t border-[#EADAC2]/60 mt-3 relative z-20"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <Globe className="w-3 h-3 text-[#B0863A]" />
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#8A5A4D] font-bold">
                        Verified Grounded Research References
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] bg-white hover:bg-[#B0863A]/5 text-[#22301F] hover:text-[#B0863A] border border-[#DDD5C3] hover:border-[#B0863A] px-2.5 py-1 rounded-xl transition-all duration-200 shadow-3xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="max-w-[180px] truncate font-medium">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Academic Outline */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#22301F] border-b border-[#DDD5C3]/40 pb-2">
              Course Syllabus Timeline
            </h3>
            
            <div className="space-y-3">
              {course.outline.map((item, idx) => (
                <div key={idx} className="bg-[#FAF9F6] border border-[#DDD5C3]/60 p-4 rounded-2xl flex gap-4 items-start transition-all hover:border-[#B98072]/50">
                  <div className="w-7 h-7 rounded-full bg-[#22301F] text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#22301F]">
                      {item.split("–")[0] || item}
                    </h4>
                    {item.split("–")[1] && (
                      <p className="text-[11px] text-[#5B5648] font-light mt-0.5 leading-relaxed">
                        {item.split("–")[1].trim()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#22301F] border-b border-[#DDD5C3]/40 pb-2">
              Student Benefits & Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-2.5 items-start bg-white border border-[#DDD5C3]/40 p-3.5 rounded-xl text-xs sm:text-sm text-[#5B5648] font-light leading-normal">
                  <CheckCircle className="w-4 h-4 text-[#8CA394] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Enrollment Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-[#FAF9F6] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A5A4D] font-bold block">
                Intake Desk
              </span>
              <h3 className="font-serif text-xl font-bold text-[#22301F]">
                Cohort Enrollment Panel
              </h3>
              <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                Secure your seat in this highly structured cohort. Registered students gain direct portal tracking, progress logs, and syllabus feedback.
              </p>
            </div>

            {isEnrolled ? (
              <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 text-center space-y-4 py-8 animate-fade-in">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-[#22301F]">Active Enrollment Authenticated</h4>
                  <p className="text-[11px] text-gray-500 font-light max-w-xs mx-auto">
                    Assalamu alaikum! You are actively registered in this cohort program. Visit your Student Portal dashboard to complete assessments and view lessons.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                
                {formDetails ? (
                  <div className="bg-white border border-[#22301F]/15 rounded-2xl p-4 space-y-3.5 text-xs text-[#22301F]">
                    <div className="flex gap-2 items-center text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Registration Link Linked</span>
                    </div>
                    <p className="text-[#5B5648] font-light leading-relaxed">
                      Admissions coordinators have bound a registration dossier form to this course intake:
                    </p>
                    <a
                      href={formDetails.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#22301F] hover:bg-[#8A5A4D] text-white font-mono uppercase tracking-wider text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                    >
                      <span>Fill Google Form</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-100/50 border border-dashed border-gray-200 rounded-2xl p-4 text-center">
                    <p className="text-[10px] text-gray-400 font-mono">
                      INTAKE SCHEDULE INITIALIZATION PENDING
                    </p>
                  </div>
                )}

                {/* Terms Acceptance checkbox */}
                <div className="space-y-3 border-t border-[#DDD5C3]/40 pt-4 text-left">
                  <label className="flex items-start gap-2.5 text-[11px] text-gray-500 font-light cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="accent-[#B98072] mt-0.5 shrink-0"
                    />
                    <span>
                      I have reviewed and accept the <span className="font-semibold text-[#22301F]">Qalbiya Adab Conduct Standards</span> and agree to maintain academic integrity and cohort privacy.
                    </span>
                  </label>
                </div>

                {enrollError && (
                  <p className="text-[10px] text-red-500 font-mono">
                    ⚠️ {enrollError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={isSubmittingEnroll || !acceptedTerms}
                  className="w-full bg-[#22301F] hover:bg-[#33453A] disabled:bg-[#DDD5C3] text-white disabled:text-[#5B5648]/40 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold cursor-pointer transition-transform active:scale-95 shadow-sm inline-flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isSubmittingEnroll ? "Joining..." : "Join Course"}</span>
                </button>

                {!user && (
                  <p className="text-[10px] text-gray-400 text-center font-light mt-2">
                    * Signing in with your Google account is required to log progress.
                  </p>
                )}

              </div>
            )}

            {showSuccessToast && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-center text-[11px] font-mono animate-fade-in">
                ✓ Enrollment recorded successfully! Welcome to the cohort.
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

const ArrowUpRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);
