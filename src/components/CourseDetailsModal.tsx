import React from "react";
import { Course } from "../types";
import { X, Check, ArrowUpRight, Clipboard, Calendar, Clock, BookOpen, Share2, Copy } from "lucide-react";

/**
 * Generates a themed QR Code image URL for a specific course page.
 * Uses the secure, reliable qrserver API with Qalbiya brand colors.
 */
export function generateCourseQRCodeUrl(courseId: string): string {
  const courseUrl = `https://qalbiya-islamic-institute.vercel.app/?course=${courseId}`;
  // Deep forest green: #22301F (color=22301f), Cream: #FAF4F2 (bgcolor=faf4f2)
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=22301f&bgcolor=faf4f2&qzone=2&data=${encodeURIComponent(courseUrl)}`;
}

interface CourseDetailsModalProps {
  course: Course;
  formDetails: { formId: string; formUrl: string } | null;
  onClose: () => void;
  user: any;
  handleLogin: () => void;
  onEnrollSuccess: (courseId: string, acceptedTermsAt: string) => void;
  isEnrolled: boolean;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  formDetails,
  onClose,
  user,
  handleLogin,
  onEnrollSuccess,
  isEnrolled
}) => {
  const [showTerms, setShowTerms] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [pendingActionType, setPendingActionType] = React.useState<"direct" | "form" | null>(null);
  const [shareStatus, setShareStatus] = React.useState<string | null>(null);

  // Combine all detailed syllabus description for read-aloud TTS
  const fullSyllabusTTS = `Course: ${course.title}. ${course.longDescription} What you will learn: ${course.outline.join(". ")}. Key features of the course include: ${course.benefits.join(". ")}`;

  const triggerEnrollmentFlow = (type: "direct" | "form") => {
    setPendingActionType(type);
    setShowTerms(true);
  };

  const handleConfirmEnrollment = () => {
    if (!termsAccepted) return;
    const nowStr = new Date().toISOString();
    setShowTerms(false);
    
    const studentName = user?.displayName || user?.email?.split('@')[0] || "Sincere Student";
    const studentEmail = user?.email || "";
    
    const waMessage = `Assalamu'alaikum wa rehmatullahi wa barakatuhu, Ms. Mustara.

I would like to enroll in the following course at QALBIYA Islamic Institute:
📚 *Course:* ${course.title}
⏳ *Duration:* ${course.duration}${course.schedule ? `\n🗓️ *Schedule:* ${course.schedule}` : ''}

*My Details:*
• *Name:* ${studentName}
• *Email:* ${studentEmail}

Please guide me with the next steps for cohort registration and onboarding. JazakAllahu Khairan!`;

    const waUrl = `https://wa.me/918145363290?text=${encodeURIComponent(waMessage)}`;
    
    if (pendingActionType === "direct") {
      window.open(waUrl, "_blank");
    } else if (pendingActionType === "form" && formDetails) {
      window.open(formDetails.formUrl, "_blank");
    }
    
    onEnrollSuccess(course.id, nowStr);
    setPendingActionType(null);
    setTermsAccepted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2A25]/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF4F2] border border-[#DDD5C3] rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 hover:bg-[#EDE3CE] rounded-full transition-colors text-[#5B5648] hover:text-[#2B2A25] cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="p-8 sm:p-10 space-y-8">
          
          {/* Header Block */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border ${
                course.category === "women" 
                  ? "text-[#8A5A4D] bg-[#F1E2DC] border-[#DDD5C3]" 
                  : "text-[#87652A] bg-[#F1E7D3] border-[#DDD5C3]"
              }`}>
                {course.category === "women" ? "Women Cources" : "Kids Cources"}
              </span>
              {course.isNew && (
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border text-white bg-[#B98072] border-[#8A5A4D] flex items-center gap-1" id={`modal-new-badge-${course.id}`}>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span>New Release</span>
                </span>
              )}
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#22301F] leading-tight">
              {course.title}
            </h2>
            <p className="font-mono text-xs text-[#5B5648] flex flex-wrap gap-4 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#8CA394]" />
                Duration: {course.duration}
              </span>
              {course.schedule && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8CA394]" />
                  Schedule: {course.schedule}
                </span>
              )}
            </p>
          </div>



          {/* Description */}
          <div className="space-y-3 font-sans text-[#5B5648] leading-relaxed font-light text-sm sm:text-base">
            <h4 className="font-serif font-bold text-[#22301F] text-lg">Course Overview</h4>
            <p>{course.longDescription}</p>
          </div>

          {/* Outline & Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#DDD5C3]/40">
            
            {/* Curriculum Outline */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-[#22301F] text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8CA394]" />
                <span>Weekly Curriculum</span>
              </h4>
              <ul className="space-y-2.5">
                {course.outline.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-[#5B5648] leading-relaxed">
                    <span className={`font-mono font-bold ${course.category === 'women' ? 'text-[#8A5A4D]' : 'text-[#87652A]'}`}>
                      {idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Program Benefits */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-[#22301F] text-base flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8CA394]" />
                <span>Student Privileges</span>
              </h4>
              <ul className="space-y-2.5">
                {course.benefits.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-[#5B5648] leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-[#8CA394] rounded-full mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Action Footer - Registration Intake */}
          <div className="pt-6 border-t border-[#DDD5C3]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FBF8F1] p-6 rounded-2xl">
            <div className="space-y-1">
              <h5 className="font-serif font-bold text-[#22301F] text-sm">Enrollment Intake & Forms</h5>
              <p className="text-xs text-[#5B5648]/80 font-light">
                {formDetails 
                  ? "Enrollment is processed securely through an integrated Google Registration Form."
                  : "Syllabus details have been compiled. Registration is currently scheduled to open soon."}
              </p>
            </div>

            {isEnrolled ? (
              <div className="bg-[#8CA394]/15 text-[#22301F] border border-[#8CA394]/30 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold shrink-0">
                <Check className="w-4 h-4 text-[#8CA394]" />
                <span>Enrolled & Progress Active</span>
              </div>
            ) : (
              <div className="flex gap-2 shrink-0">
                {formDetails && (
                  <button
                    onClick={() => triggerEnrollmentFlow("form")}
                    className="px-4 py-2.5 bg-[#FAF9F6] border border-[#DDD5C3] hover:bg-[#EDE3CE]/30 text-[#2B2A25] rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Google Form</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#8CA394]" />
                  </button>
                )}
                <button
                  onClick={() => triggerEnrollmentFlow("direct")}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all btn-shadow hover:scale-[1.02] active:scale-95 text-white cursor-pointer ${
                    course.category === "women"
                      ? "bg-[#B98072] hover:bg-[#8A5A4D]"
                      : "bg-[#B0863A] hover:bg-[#87652A]"
                  }`}
                >
                  <span>Enroll Directly</span>
                </button>
              </div>
            )}
          </div>

          {/* Share & Invite Center */}
          <div className="border-t border-[#DDD5C3]/30 pt-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1 text-left">
                <h5 className="font-serif font-bold text-[#22301F] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#B98072]" />
                  <span>Spread the Word</span>
                </h5>
                <p className="text-[11px] text-[#5B5648] font-light max-w-md">
                  Encourage sisters, family, and friends to study with you. Shared learning builds community and beautiful memory logs.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto relative">
                <button
                  onClick={() => {
                    const shareText = `Assalamu Alaikum! 🌸 I wanted to share this beautiful course "${course.title}" from QALBIYA Islamic Institute with you. Let's study together! Here is the program overview: ${course.description} \n\nCheck details and enroll here: https://qalbiya-islamic-institute.vercel.app/?course=${course.id}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
                    setShareStatus("Shared via WhatsApp!");
                    setTimeout(() => setShareStatus(null), 3000);
                  }}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FAF4F2] hover:bg-[#EDE3CE]/40 border border-[#DDD5C3] text-xs font-bold text-[#22301F] rounded-full transition-all cursor-pointer"
                  title="Forward on WhatsApp"
                >
                  <span className="w-2 h-2 bg-[#25D366] rounded-full" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    const shareText = `Assalamu Alaikum! 🌸 Check out "${course.title}" at QALBIYA Islamic Institute! Follow us to learn more. Course duration: ${course.duration}. Instructor: ${course.instructor}.`;
                    navigator.clipboard.writeText(shareText);
                    setShareStatus("Instagram text copied!");
                    setTimeout(() => setShareStatus(null), 3000);
                  }}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FAF4F2] hover:bg-[#EDE3CE]/40 border border-[#DDD5C3] text-xs font-bold text-[#22301F] rounded-full transition-all cursor-pointer"
                  title="Instagram Caption Template"
                >
                  <span className="w-2 h-2 bg-[#E1306C] rounded-full" />
                  <span>Instagram</span>
                </button>

                <button
                  onClick={() => {
                    const link = `https://qalbiya-islamic-institute.vercel.app/?course=${course.id}`;
                    navigator.clipboard.writeText(link);
                    setShareStatus("Course link copied!");
                    setTimeout(() => setShareStatus(null), 3000);
                  }}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FAF4F2] hover:bg-[#EDE3CE]/40 border border-[#DDD5C3] text-xs font-bold text-[#22301F] rounded-full transition-all cursor-pointer"
                  title="Copy Invite Link"
                >
                  <Copy className="w-3.5 h-3.5 text-[#8CA394]" />
                  <span>Copy Link</span>
                </button>

                {shareStatus && (
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-[#22301F] text-white text-[10px] rounded-lg shadow-md z-30 font-semibold animate-bounce">
                    {shareStatus}
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Scan Block */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#EDE3CE]/20 rounded-2xl border border-[#DDD5C3]/40">
              <div className="bg-[#FAF4F2] p-2.5 rounded-xl border border-[#DDD5C3]/60 shadow-sm shrink-0">
                <img
                  src={generateCourseQRCodeUrl(course.id)}
                  alt={`QR Code for ${course.title}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  referrerPolicy="no-referrer"
                  id={`course-qr-${course.id}`}
                />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h6 className="font-serif font-bold text-[#22301F] text-xs uppercase tracking-wider">
                  Scan to Share Course
                </h6>
                <p className="text-[11px] text-[#5B5648] font-light max-w-md leading-relaxed">
                  Hold up your mobile camera to instantly scan the QR code and view this course outline, or right-click to save and print this QR code for sisters circles.
                </p>
                <div className="pt-1">
                  <a
                    href={generateCourseQRCodeUrl(course.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#B98072] hover:text-[#8A5A4D] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Open High-Res Printable QR</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Terms & Conditions Overlay Modal */}
        {showTerms && (
          <div className="absolute inset-0 z-50 bg-[#FAF4F2] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between animate-fade-in" id="terms-conditions-container">
            <div className="space-y-5 overflow-y-auto max-h-[75%] pr-2">
              <div className="border-b border-[#DDD5C3] pb-4">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#22301F]" id="terms-title">
                  QALBIYA Islamic Institute Enrollment Agreement
                </h3>
                <p className="text-xs text-[#5B5648] font-light mt-1">
                  Please review and accept our academic conduct agreements before completing registration in this course.
                </p>
              </div>

              <div className="space-y-3.5 font-sans text-xs text-[#5B5648] leading-relaxed font-light">
                <div className="bg-[#FBF8F1] border border-[#DDD5C3]/60 p-4 rounded-xl space-y-1.5">
                  <h4 className="font-serif font-bold text-[#22301F] text-xs">1. Academic Integrity & Scholar Respect</h4>
                  <p>
                    QALBIYA Islamic Institute is built upon traditional sacred study principles. Students commit to treating our qualified certified female scholars, instructors, and student peers with utmost respect and standard ethics in all class environments.
                  </p>
                </div>

                <div className="bg-[#FBF8F1] border border-[#DDD5C3]/60 p-4 rounded-xl space-y-1.5">
                  <h4 className="font-serif font-bold text-[#22301F] text-xs">2. Attendance Commitment & Recitation Review</h4>
                  <p>
                    Students strive to attend live weekly Zoom cohorts consistently. In the event of occasional absences, students commit to reviewing study guides, syllabi recordings, and completing homework milestones timely.
                  </p>
                </div>

                <div className="bg-[#FBF8F1] border border-[#DDD5C3]/60 p-4 rounded-xl space-y-1.5">
                  <h4 className="font-serif font-bold text-[#22301F] text-xs">3. Material Security & Intellectual Respect</h4>
                  <p>
                    All visual cohort slides, homework worksheets, private recitations, and proprietary syllabi outlines are carefully curated. Sharing, copying, or distributing QALBIYA Islamic Institute assets without official authorization is strictly forbidden.
                  </p>
                </div>

                <div className="bg-[#FBF8F1] border border-[#DDD5C3]/60 p-4 rounded-xl space-y-1.5">
                  <h4 className="font-serif font-bold text-[#22301F] text-xs">4. Communications Consent</h4>
                  <p>
                    By accepting, you consent to QALBIYA Islamic Institute synchronizing your student enrollment history. This triggers automatic admissions notifications and welcome packets to be emailed securely to you.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#DDD5C3]/50 pt-4 space-y-3.5 bg-[#FAF4F2]">
              <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-[#FBF8F1] border border-[#DDD5C3]/50 shadow-sm">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#8CA394] bg-[#FAF4F2] border-[#DDD5C3] rounded focus:ring-0 cursor-pointer"
                  id="checkbox-accept-terms"
                />
                <span className="text-[11px] text-[#22301F] font-semibold leading-relaxed">
                  I solemnly agree to accept and abide by QALBIYA Islamic Institute's Academic Conduct, Admissions Rules, and Integrity guidelines.
                </span>
              </label>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowTerms(false);
                    setPendingActionType(null);
                  }}
                  className="px-5 py-2 hover:bg-[#EDE3CE]/40 border border-[#DDD5C3] text-[#5B5648] rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                  id="btn-decline-terms"
                >
                  Decline
                </button>
                <button
                  onClick={handleConfirmEnrollment}
                  disabled={!termsAccepted}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all btn-shadow flex items-center gap-1.5 cursor-pointer ${
                    termsAccepted 
                      ? "bg-[#22301F] hover:bg-[#33453A]" 
                      : "bg-[#DDD5C3] text-[#5B5648]/40 cursor-not-allowed"
                  }`}
                  id="btn-agree-terms"
                >
                  <Check className="w-4 h-4" />
                  <span>Join Course</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
