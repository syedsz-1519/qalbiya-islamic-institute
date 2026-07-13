import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  course: string;
  rating: number;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Faiza Rahman",
    role: "Diploma Student",
    course: "Pre-Diploma in Deeniyat",
    rating: 5,
    text: "Qalbiya has truly changed how I connect with my faith. Before this, I learned parts of Islam in scattered places. This course connected everything in a beautiful, structured way. Ms. Mustara's explanation of Aqaid is so clear and heart-softening."
  },
  {
    id: 2,
    name: "Yasmin Alavi",
    role: "Mother of 2 children",
    course: "Juniors Deeniyat & Noorani Qaida",
    rating: 5,
    text: "It was so difficult to get my boys to read Noorani Qaida until we enrolled them here. The phonetic games and encouraging reward system make them look forward to every class. Ustadha Aisha is exceptionally patient and warm!"
  },
  {
    id: 3,
    name: "Zainab Ansari",
    role: "Working Professional",
    course: "Tajweed 1:1 Mentorship",
    rating: 5,
    text: "As a busy doctor, the flexible 1:1 scheduling was a lifesaver. Ustadha Sarah corrects my makharij instantly, and I feel so much more confident reciting Quran during my prayers. A top-tier, premium experience for sisters."
  },
  {
    id: 4,
    name: "Amina Farooqui",
    role: "Seerah Student",
    course: "Seerah of the Prophet ﷺ",
    rating: 5,
    text: "Dr. Zainab's Seerah course doesn't just teach historical facts; it teaches you how to live the Sunnah. The lessons on how the Prophet ﷺ handled personal grief and trials have brought so much peace and resilience into my life."
  }
];

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#DDD5C3] dark:border-[#243524] animate-fade-in">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] dark:text-[#7E9C7E] font-bold block">
          Student Voices
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#22301F] dark:text-[#FAF4F2] tracking-tight">
          Nourishing Souls, Changing Lives
        </h2>
        <p className="text-xs sm:text-sm text-[#5B5648] dark:text-[#ABB9AB] font-light leading-relaxed">
          Hear from the sisters and mothers who have walked this beautiful spiritual path with us.
        </p>
        <div className="w-8 h-[1px] bg-[#B98072] mx-auto mt-2" />
      </div>

      <div className="relative bg-[#FBF8F1] dark:bg-[#111610] border border-[#DDD5C3] dark:border-[#243524] rounded-[32px] p-8 sm:p-12 shadow-sm text-left overflow-hidden min-h-[260px] flex flex-col justify-between">
        {/* Large Decorative Quote Watermark */}
        <div className="absolute right-6 top-6 text-[#DFBA73]/10 dark:text-[#DFBA73]/5 select-none pointer-events-none">
          <Quote className="w-24 h-24 stroke-[1]" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Star Rating */}
          <div className="flex gap-1 text-[#B0863A] dark:text-[#DFBA73]">
            {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          {/* Testimonial Text */}
          <p className="font-serif italic text-base sm:text-lg text-[#22301F] dark:text-[#ECE5D8] leading-relaxed font-light">
            "{TESTIMONIALS[activeIndex].text}"
          </p>

          {/* Author Metadata */}
          <div className="flex justify-between items-end border-t border-[#DDD5C3]/40 dark:border-[#243524]/40 pt-6">
            <div>
              <h4 className="font-serif text-base font-bold text-[#22301F] dark:text-[#FAF4F2]">
                {TESTIMONIALS[activeIndex].name}
              </h4>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394] dark:text-[#7E9C7E] font-bold">
                {TESTIMONIALS[activeIndex].role} &bull; <span className="text-[#8A5A4D] dark:text-[#E0A395]">{TESTIMONIALS[activeIndex].course}</span>
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full border border-[#DDD5C3] dark:border-[#243524] hover:bg-[#FAF4F2] dark:hover:bg-[#2E402D]/40 text-[#22301F] dark:text-[#FAF4F2] cursor-pointer transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full border border-[#DDD5C3] dark:border-[#243524] hover:bg-[#FAF4F2] dark:hover:bg-[#2E402D]/40 text-[#22301F] dark:text-[#FAF4F2] cursor-pointer transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 mt-5">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              index === activeIndex ? "bg-[#B98072] w-5" : "bg-[#DDD5C3] dark:bg-[#243524]"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
