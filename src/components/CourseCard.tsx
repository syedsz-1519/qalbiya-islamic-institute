import React, { useState } from "react";
import { Course } from "../types";
import { Clock, Calendar, User, ArrowRight, Star, ExternalLink, Bookmark, Check, Share2, Copy } from "lucide-react";

interface CourseCardProps {
  course: Course;
  formDetails: { formId: string; formUrl: string } | null;
  onExplore: (course: Course) => void;
  user: any;
  isBookmarked?: boolean;
  onBookmarkToggle?: (courseId: string) => void;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  formDetails,
  onExplore,
  user,
  isBookmarked = false,
  onBookmarkToggle,
  isEnrolled = false
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute text for TTS syllabus readout
  const ttsText = `${course.title}. Instructed by ${course.instructor}. Duration: ${course.duration}. Schedule: ${course.schedule}. Course overview: ${course.description} The primary curriculum outline includes: ${course.outline.slice(0, 3).join(", ")}`;

  return (
    <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[28px] p-6 md:p-8 flex flex-col justify-between hover:border-[#8CA394]/80 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl relative group" id={`course-card-${course.id}`}>
      
      {/* Flagship / Enrolled / New Indicator Accent */}
      <div className="absolute top-0 left-8 -translate-y-1/2 flex gap-2 z-10">
        {course.flagship && (
          <div className="bg-[#B0863A] text-white border border-[#87652A] rounded-full px-3 py-0.5 flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold shadow-sm">
            <Star className="w-2.5 h-2.5 fill-white text-white" />
            <span>Flagship Course</span>
          </div>
        )}
        {course.isNew && (
          <div className="bg-[#B98072] text-white border border-[#8A5A4D] rounded-full px-3 py-0.5 flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold shadow-sm" id={`new-badge-${course.id}`}>
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-0.5" />
            <span>New</span>
          </div>
        )}
        {isEnrolled && (
          <div className="bg-[#8CA394] text-white border border-[#33453A] rounded-full px-3 py-0.5 flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold shadow-sm" id={`enrolled-badge-${course.id}`}>
            <Check className="w-2.5 h-2.5 text-white" />
            <span>Enrolled</span>
          </div>
        )}
      </div>

      {/* Bookmark ribbon action */}
      {onBookmarkToggle && (
        <button
          id={`btn-card-bookmark-${course.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle(course.id);
          }}
          className="absolute top-4 right-4 p-1.5 bg-[#FAF4F2] hover:bg-white border border-[#DDD5C3] rounded-full text-[#8CA394] hover:text-[#B98072] transition-colors cursor-pointer z-10"
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Program"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-[#B98072] text-[#B98072]" : ""}`} />
        </button>
      )}

      <div className="space-y-5">
        
        {/* Category & Duration Row */}
        <div className="flex justify-between items-center text-xs font-mono">
          <span className={`uppercase tracking-widest text-[10px] font-bold ${course.category === 'women' ? 'text-[#8A5A4D]' : 'text-[#87652A]'}`}>
            {course.category === "women" ? "Women Cources" : "Kids Cources"}
          </span>
          <span className="flex items-center gap-1 text-[#5B5648]/80">
            <Clock className="w-3.5 h-3.5 text-[#8CA394]" />
            {course.duration}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-serif text-xl md:text-2xl font-bold text-[#22301F] leading-tight transition-colors duration-300 ${course.category === 'women' ? 'group-hover:text-[#B98072]' : 'group-hover:text-[#B0863A]'}`}>
          {course.title}
        </h3>

        {/* Short Description */}
        <p className="font-sans text-[#5B5648] text-xs md:text-sm leading-relaxed font-light line-clamp-3">
          {course.description}
        </p>

        {/* Highlights / Features list */}
        <div className="space-y-2 pt-2.5 text-xs text-[#5B5648] font-sans border-t border-[#DDD5C3]/40 relative group/tooltip cursor-help" id={`highlights-${course.id}`}>
          {/* Hover Tooltip Container */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-[#22301F] text-[#FAF4F2] text-xs p-3.5 rounded-2xl shadow-2xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 ease-out z-30 font-sans border border-[#B0863A]/40 transform translate-y-1 group-hover/tooltip:translate-y-0 text-left">
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#22301F]" />
            <p className="font-serif font-bold mb-1.5 text-[#EDE3CE] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#B98072] rounded-full animate-pulse" />
              <span>Schedule & Faculty Info</span>
            </p>
            <p className="font-light leading-relaxed text-[#FAF4F2]/95">
              Join <strong className="font-medium text-[#FAF4F2]">{course.instructor}</strong> for interactive study sessions conducted on <span className="font-medium text-[#EDE3CE]">{course.schedule}</span>.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8CA394] font-mono">Session Info</span>
            <span className="text-[9px] font-medium text-[#B98072]/80 bg-[#B98072]/5 px-1.5 py-0.5 rounded border border-[#B98072]/15 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-[#B98072] rounded-full" />
              <span>Hover for Summary</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#8CA394] shrink-0" />
            <span className="truncate">{course.schedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#8CA394] shrink-0" />
            <span className="truncate">Instructed by {course.instructor}</span>
          </div>
        </div>

        {/* Google Form Intake Status Banner */}
        {formDetails ? (
          <div className="bg-[#8CA394]/10 border border-[#8CA394]/30 rounded-xl p-3 flex items-center justify-between text-[11px] text-[#33453A] font-sans">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#8CA394] rounded-full animate-ping" />
              <span className="font-bold">Intake open &bull; Register now</span>
            </span>
            <a 
              href={formDetails.formUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#33453A] hover:text-[#22301F] font-bold hover:underline"
              id={`link-google-form-${course.id}`}
            >
              <span>Google Form</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <div className="bg-[#FAF4F2] border border-[#DDD5C3]/50 rounded-xl p-3 text-[11px] text-[#5B5648]/60 font-sans">
            <span>Intake schedule pending initialization by administrators</span>
          </div>
        )}

      </div>

      {/* Actions row */}
      <div className="mt-8 pt-4 border-t border-[#DDD5C3]/40 flex items-center justify-between relative">
        
        {/* Share Button with popover */}
        <div className="relative">
          <button
            id={`btn-share-${course.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(!showShareMenu);
            }}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#5B5648] hover:text-[#B98072] transition-colors cursor-pointer"
            title="Share Course with Friends/Sisters"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {showShareMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#FAF4F2] border border-[#DDD5C3] rounded-2xl p-2.5 shadow-xl z-20 space-y-1 animate-fade-in text-left">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#8CA394] px-2 py-1 font-bold">
                Forward to Sisters
              </p>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const shareText = `Assalamu Alaikum! 🌸 I wanted to share this beautiful course "${course.title}" from Qalbiya Islamic Institute with you. Let's study together! Here is the program overview: ${course.description} \n\nCheck details and enroll here: https://qalbiya-islamic-institute.vercel.app/?course=${course.id}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 text-xs text-[#22301F] hover:bg-[#8CA394]/10 hover:text-[#B98072] rounded-xl flex items-center gap-2 transition-colors cursor-pointer font-medium"
              >
                <span className="w-2 h-2 bg-[#25D366] rounded-full shrink-0" />
                <span>Share via WhatsApp</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const shareText = `Assalamu Alaikum! 🌸 Check out "${course.title}" at Qalbiya Islamic Institute! Follow us to learn more. Course duration: ${course.duration}. Instructor: ${course.instructor}.`;
                  navigator.clipboard.writeText(shareText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 text-xs text-[#22301F] hover:bg-[#8CA394]/10 hover:text-[#B98072] rounded-xl flex items-center gap-2 transition-colors cursor-pointer font-medium"
              >
                <span className="w-2 h-2 bg-[#E1306C] rounded-full shrink-0" />
                <span>Instagram Text</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const link = `https://qalbiya-islamic-institute.vercel.app/?course=${course.id}`;
                  navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 text-xs text-[#22301F] hover:bg-[#8CA394]/10 hover:text-[#B98072] rounded-xl flex items-center gap-2 transition-colors cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5 text-[#8CA394] shrink-0" />
                <span>Copy Invite Link</span>
              </button>
            </div>
          )}

          {copied && (
            <div className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-[#22301F] text-white text-[10px] rounded-lg shadow-md z-30 font-medium">
              Copied to clipboard!
            </div>
          )}
        </div>
        
        {/* Explore more button */}
        <button
          id={`btn-explore-card-${course.id}`}
          onClick={() => onExplore(course)}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#22301F] hover:text-[#B98072] hover:underline transition-colors cursor-pointer"
        >
          <span>Syllabus & Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
};
