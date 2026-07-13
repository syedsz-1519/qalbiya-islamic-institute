import React, { useState } from "react";
import { Course } from "../types";
import { User } from "firebase/auth";
import { ArrowLeft, Clock, Calendar, User as UserIcon, BookOpen, CheckCircle, ShieldAlert, FileCheck, Sparkles } from "lucide-react";

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
