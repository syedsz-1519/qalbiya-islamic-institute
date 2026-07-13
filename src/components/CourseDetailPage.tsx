import React, { useState } from "react";
import { Course } from "../types";
import { User } from "firebase/auth";
import { ArrowLeft, Clock, Calendar, User as UserIcon, BookOpen, CheckCircle, ShieldAlert, FileCheck, Sparkles, RefreshCw, Award, Globe } from "lucide-react";
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
