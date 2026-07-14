import React, { useState } from "react";
import { Course } from "../types";
import { Clock, Calendar, User, ArrowRight, Star, ExternalLink, Bookmark, Check, Share2, Copy, Sparkles } from "lucide-react";

interface CourseCardProps {
  course: Course;
  formDetails: { formId: string; formUrl: string } | null;
  onExplore: (course: Course) => void;
  user: any;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  formDetails,
  onExplore,
  user,
  isEnrolled = false
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const logistics = (() => {
    switch (course.id) {
      case "pre-diploma-deeniyat":
        return { format: "Group or 1-on-1", fee: "Rs. 499/mo (Group) / Rs. 699/mo (Private)" };
      case "tajweed-1on1":
        return { format: "Private 1-on-1", fee: "Rs. 800/month" };
      case "juniors-deeniyat-mastercourse":
        return { format: "Group or Private", fee: "Rs. 600/mo (Group) / Rs. 1,000/mo (Private)" };
      case "noorani-qaida-women":
        return { format: "Sisters Group", fee: "Rs. 499/month" };
      case "seerah-prophet":
        return { format: "Sisters Group", fee: "Rs. 499/month" };
      case "noorani-qaida-kids":
        return { format: "Group or Private", fee: "Rs. 600/mo (Group) / Rs. 1,000/mo (Private)" };
      case "tarbiyah-tazkiyah":
        return { format: "Weekly Live Sessions", fee: "Free Access" };
      case "arabic-calligraphy":
        return { format: "Daily Live Class (starts Aug 1)", fee: "Free Access" };
      default:
        return { format: "Flexible Online", fee: "Contact Admissions" };
    }
  })();

  return (
    <div className={`bg-[#FBF8F1] dark:bg-[#2D1217]/50 border ${course.isFree ? 'border-emerald-600/30 dark:border-emerald-500/30' : 'border-[#DDD5C3] dark:border-[#4A2027]'} rounded-[32px] p-8 flex flex-col justify-between hover:border-[#B98072]/50 dark:hover:border-[#E0A395]/50 transition-all duration-300 relative group text-left`} id={`course-card-${course.id}`}>
      
      {/* Badge Indicator Accent */}
      <div className="absolute top-0 left-8 -translate-y-1/2 flex gap-2 z-10">
        {course.flagship && (
          <div className="bg-[#B98072] text-white border border-[#8A5A4D] rounded-full px-3.5 py-0.5 flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold shadow-xs">
            <Star className="w-2.5 h-2.5 fill-white text-white" />
            <span>Flagship</span>
          </div>
        )}
        {course.isNew && (
          <div className="bg-[#B0863A] text-white border border-[#87652A] rounded-full px-3.5 py-0.5 flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold shadow-xs">
            <span>New</span>
          </div>
        )}
        {course.isFree && (
          <div className="bg-emerald-700 text-white border border-emerald-800 rounded-full px-3.5 py-0.5 flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold shadow-xs">
            <span>Free Access</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        
        {/* Category & Duration Row */}
        <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest text-[#8CA394] dark:text-[#E0A395]">
          <span>
            {course.category === "women" ? "Women Academy" : "Kids Hub"}
          </span>
          <span className="flex items-center gap-1 text-gray-400 font-normal">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl font-bold text-[#22301F] dark:text-[#FFE5EC] leading-tight group-hover:text-[#B98072] transition-colors duration-300">
          {course.title}
        </h3>

        {/* Short Description */}
        <p className="font-sans text-[#5B5648] dark:text-[#FCD5CE] text-xs sm:text-sm leading-relaxed font-light line-clamp-2">
          {course.description}
        </p>

        {/* At-a-glance Info Panel */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[#DDD5C3]/40 dark:border-[#4A2027]/40 text-xs">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-gray-400">Format</span>
            <span className="font-bold text-[#22301F] dark:text-[#FFE5EC]">{logistics.format}</span>
          </div>
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-gray-400">Fee Structure</span>
            <span className="font-bold text-[#22301F] dark:text-[#FFE5EC]">{logistics.fee}</span>
          </div>
        </div>

      </div>

      {/* Single, prominent Action Button */}
      <div className="mt-6">
        <button
          id={`btn-explore-card-${course.id}`}
          onClick={() => onExplore(course)}
          className="w-full bg-[#B98072] hover:bg-[#8A5A4D] text-white py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-102 shadow-xs"
        >
          <span>View Course Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
