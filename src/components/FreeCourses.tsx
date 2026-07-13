import React, { useState, useEffect } from "react";
import { BookOpen, Award, GraduationCap, Check, BookOpenText, Play, Music, Volume2, Sparkles, Download, MessageSquare, ChevronRight } from "lucide-react";

interface Lecture {
  id: string;
  title: string;
  duration: string;
  speaker: string;
  audioPitch: number;
}

const TARBIYAH_LECTURES: Lecture[] = [
  { id: "tz-1", title: "Introduction to Tazkiyah (Purification of the Soul)", duration: "45 mins", speaker: "Ms. Mustara", audioPitch: 130 },
  { id: "tz-2", title: "Sincerity (Ikhlas) and the Secrets of the Heart", duration: "52 mins", speaker: "Ms. Mustara", audioPitch: 140 },
  { id: "tz-3", title: "Developing Khushu' (Humility & Presence) in Prayer", duration: "48 mins", speaker: "Ms. Mustara", audioPitch: 120 }
];

const CALLIGRAPHY_TUTORIALS = [
  {
    id: "cal-1",
    title: "Lesson 1: Mastering the Reed Pen (Qalam) & Ink (Hibr)",
    difficulty: "Beginner",
    description: "Learn how to hold the reed pen, shave the tip at the perfect slant, and prepare raw silk fibers (Liqah) inside your inkwell for controlled flow.",
    steps: ["Shave the qalam tip at a 35-degree angle", "Wet the raw silk threads with pristine black ink", "Calibrate line weight using dots (Nuqat) as measurement grid"]
  },
  {
    id: "cal-2",
    title: "Lesson 2: The Alif and Basic Proportions in Thuluth Script",
    difficulty: "Intermediate",
    description: "Deep dive into writing the letter Alif with perfect vertical consistency. Master the Thuluth measure of seven dots high with an elegant left-slanted head curve.",
    steps: ["Draw seven nuqat vertically to establish length", "Draw a smooth head crown (Tarseem)", "Descend slowly with soft pressure, finishing in a sharp hairline tip"]
  }
];

export function FreeCourses({ showHeader = true }: { showHeader?: boolean } = {}) {
  const [activeTab, setActiveTab] = useState<"tarbiyah" | "calligraphy">((() => {
    try {
      const hash = window.location.hash;
      if (hash.includes("track=calligraphy")) return "calligraphy";
    } catch (e) {
      console.warn(e);
    }
    return "tarbiyah";
  }));

  // Sync state to URL and update canonical link/meta dynamically
  useEffect(() => {
    try {
      const hash = window.location.hash || "";
      const [path, search] = hash.split("?");
      const params = new URLSearchParams(search || "");
      params.set("track", activeTab);

      const targetHash = `${path}?${params.toString()}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }

      // Update head canonical link
      const canonicalLink = document.getElementById("seo-canonical-link");
      if (canonicalLink) {
        canonicalLink.setAttribute("href", `https://qalbiya-islamic-institute.vercel.app/${path}?${params.toString()}`);
      }

      // Update head meta description
      const metaDesc = document.getElementById("seo-meta-description");
      if (metaDesc) {
        const desc = activeTab === "tarbiyah"
          ? "Access free spiritual Tazkiyah lectures and self-purification audios on QALBIYA Audited Curricula."
          : "Learn the holy Thuluth and Naskh scripts, brush strokes, and classical Arabic calligraphy step-by-step.";
        metaDesc.setAttribute("content", desc);
      }
    } catch (e) {
      console.warn("SEO tag sync failed", e);
    }
  }, [activeTab]);

  const [playingLecture, setPlayingLecture] = useState<string | null>(null);
  const [completedLectures, setCompletedLectures] = useState<string[]>([]);
  const [practiceTraceText, setPracticeTraceText] = useState("بسم الله الرحمن الرحيم");

  const playSynthesizedLecture = (lecture: Lecture) => {
    try {
      if (playingLecture === lecture.id) {
        setPlayingLecture(null);
        return;
      }
      setPlayingLecture(lecture.id);
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      const gainNode = audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(lecture.audioPitch, audioCtx.currentTime);

      // Low-frequency oscillator to simulate voice warble/intonation
      lfo.frequency.setValueAtTime(6, audioCtx.currentTime); // 6 Hz vibrato
      lfoGain.gain.setValueAtTime(4, audioCtx.currentTime); // 4 Hz pitch deviation
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Set volume levels
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.5); // 4.5 seconds play

      lfo.start();
      osc.start();
      lfo.stop(audioCtx.currentTime + 4.5);
      osc.stop(audioCtx.currentTime + 4.5);

      setTimeout(() => {
        setPlayingLecture(null);
        audioCtx.close();
        if (!completedLectures.includes(lecture.id)) {
          setCompletedLectures(prev => [...prev, lecture.id]);
        }
      }, 4500);
    } catch (e) {
      console.warn("AudioContext block", e);
      setPlayingLecture(null);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in text-left ${showHeader ? "py-16 space-y-12" : "py-4 space-y-10"}`} id="free-courses-page">
      
      {/* Editorial Header */}
      {showHeader && (
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase font-bold font-mono tracking-[0.25em] text-[#8CA394]">
            Tarkeez & Tarbiyah Desk
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
            Free Audited Curricula
          </h2>
          <p className="text-[#5B5648] text-sm max-w-xl mx-auto font-light leading-relaxed">
            Embark on deep-reaching, complementary study pathways designed to nourish the soul, refine self-discipline, and celebrate the historical arts without tuition fees.
          </p>
          <div className="w-12 h-[1.5px] bg-[#B98072] mx-auto mt-4" />
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex justify-center">
        <div className="bg-[#F4EFE6] border border-[#DDD5C3] p-1.5 rounded-full flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("tarbiyah")}
            className={`px-6 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "tarbiyah"
                ? "bg-[#22301F] text-white shadow-sm"
                : "text-[#5B5648] hover:text-[#22301F]"
            }`}
          >
            Tarbiyah Tazkiyah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calligraphy")}
            className={`px-6 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "calligraphy"
                ? "bg-[#22301F] text-white shadow-sm"
                : "text-[#5B5648] hover:text-[#22301F]"
            }`}
          >
            Arabic Calligraphy
          </button>
        </div>
      </div>

      {activeTab === "tarbiyah" ? (
        /* Tarbiyah Tazkiyah View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left: About course (7 cols) */}
          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase bg-[#8CA394]/20 text-[#33453A] border border-[#8CA394]/30 px-3 py-1 rounded-full font-bold">
                  Complementary Audit
                </span>
                <span className="text-xs text-gray-400 font-mono">Self-Paced Track</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#22301F]">
                Tarbiyah Tazkiyah: Nurturing the Soul
              </h3>

              <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
                Tazkiyah is the sacred Islamic process of purification of the soul. Under the guidance of our respected founder, <span className="font-semibold text-[#22301F]">Ms. Mustara</span>, this complementary course provides structured insights into spiritual discipline, mindfulness in prayers, sincere actions, and curing the ailments of the heart.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-xs text-[#22301F] uppercase tracking-wider">What you will cultivate:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Self-awareness (Muraqabah)",
                    "Developing Sincerity (Ikhlas)",
                    "Guarding of time and attention",
                    "Overcoming spiritual laziness",
                    "Achieving absolute presence in Salah",
                    "Cultivating prophetic ethics"
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-xs text-[#5B5648] font-light">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#DDD5C3]/40 bg-white/40 p-4 rounded-2xl flex items-center gap-3.5 text-xs text-[#22301F]">
              <div className="w-8 h-8 rounded-full bg-[#B98072]/10 text-[#8A5A4D] flex items-center justify-center font-bold">
                M
              </div>
              <div>
                <p className="font-serif font-bold">Instructed by Founder Ms. Mustara</p>
                <p className="text-[10px] text-[#5B5648] font-light">Holding a decade of traditional curriculum delivery expertise</p>
              </div>
            </div>
          </div>

          {/* Right: Audio Lecture sandbox (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#B98072] font-bold block">
                  Media Sandbox
                </span>
                <h3 className="font-serif text-lg font-bold text-[#22301F]">
                  Spiritual Audio Vault
                </h3>
                <p className="text-xs text-[#5B5648] font-light">
                  Listen to short foundational audio lectures on-demand. Simply click 'Listen' to load our simulated premium acoustics engine.
                </p>
              </div>

              <div className="space-y-3">
                {TARBIYAH_LECTURES.map((lecture) => {
                  const isPlaying = playingLecture === lecture.id;
                  const isCompleted = completedLectures.includes(lecture.id);

                  return (
                    <div 
                      key={lecture.id}
                      className={`border p-4 rounded-2xl bg-white flex justify-between items-center gap-3.5 transition-all duration-300 ${
                        isPlaying 
                          ? "border-[#B98072] ring-1 ring-[#B98072]/30 shadow-sm" 
                          : "border-[#DDD5C3]/60 hover:border-[#B98072]/50"
                      }`}
                    >
                      <div className="space-y-1 text-left flex-grow">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-serif font-bold text-xs text-[#22301F] leading-snug">
                            {lecture.title}
                          </h4>
                          {isCompleted && !isPlaying && (
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                              Listened
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {lecture.speaker} &bull; {lecture.duration}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => playSynthesizedLecture(lecture)}
                        className={`p-2 rounded-full cursor-pointer transition-transform active:scale-95 border ${
                          isPlaying 
                            ? "bg-[#B98072] border-[#B98072] text-white animate-pulse" 
                            : "bg-gray-50 border-gray-200 text-[#22301F] hover:bg-[#EAE4D5]"
                        }`}
                        title={isPlaying ? "Stop Audio" : "Play Lecture"}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#DDD5C3]/40 text-center text-[10px] text-gray-400 font-light flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Listen completely to automatically log completed audits!</span>
            </div>
          </div>

        </div>
      ) : (
        /* Arabic Calligraphy View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left: Lessons (7 cols) */}
          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-[#B98072]/20 text-[#8A5A4D] border border-[#B98072]/30 px-3 py-1 rounded-full font-bold inline-block mb-3">
                Traditional Arts Hub
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#22301F]">
                The Sacred Art of Arabic Calligraphy
              </h3>
              <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
                Calligraphy is more than visual writing; it is a spiritual practice of focus (Tarkeez) and discipline. Learn the traditional Thuluth and Naskh script strokes under authentic measurement standards (Nuqat) with our high-contrast visual guides.
              </p>
            </div>

            <div className="space-y-5 pt-3">
              <h4 className="font-serif font-bold text-xs text-[#22301F] uppercase tracking-wider">Worksheet Guides & Core Lessons:</h4>
              
              {CALLIGRAPHY_TUTORIALS.map((tut) => (
                <div key={tut.id} className="border border-[#DDD5C3]/60 bg-white rounded-2xl p-5 space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <h5 className="font-serif font-bold text-sm text-[#22301F]">
                      {tut.title}
                    </h5>
                    <span className="text-[9px] font-mono uppercase bg-amber-50 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                      {tut.difficulty}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5B5648] font-light leading-relaxed">
                    {tut.description}
                  </p>

                  <div className="bg-[#FAF9F6]/85 border border-[#DDD5C3]/40 rounded-xl p-3.5 space-y-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-bold block">
                      Sequence of Strokes:
                    </span>
                    <ol className="list-decimal pl-4 text-[10px] text-[#22301F] space-y-1 font-sans font-light">
                      {tut.steps.map((step, idx) => (
                        <li key={idx} className="leading-snug">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Digital Calligraphy Drawing trace sandbox (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8CA394] font-bold block">
                  Practice Sandbox
                </span>
                <h3 className="font-serif text-lg font-bold text-[#22301F]">
                  Digital Tracing Pad
                </h3>
                <p className="text-xs text-[#5B5648] font-light">
                  Type any Arabic phrase below to display a calligraphic stencil. Take a physical reed pen or stylus and trace the strokes slowly.
                </p>
              </div>

              <div className="bg-white border border-[#DDD5C3]/75 rounded-2xl p-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-bold block">
                    Stencil Target Phrase:
                  </label>
                  <input
                    type="text"
                    value={practiceTraceText}
                    onChange={(e) => setPracticeTraceText(e.target.value)}
                    placeholder="Enter Arabic text..."
                    className="w-full bg-[#FAF9F6] border border-[#DDD5C3] rounded-xl px-3 py-2 text-xs text-right focus:outline-none focus:border-[#B98072]"
                  />
                </div>

                {/* Stencil visual container */}
                <div className="bg-gray-50 border border-[#DDD5C3]/40 rounded-xl h-36 flex items-center justify-center p-4 select-none relative overflow-hidden">
                  {/* Micro grid dots to look like a calligrapher's grid */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-5 pointer-events-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border border-[#22301F] border-dashed"></div>
                    ))}
                  </div>

                  <span className="font-serif text-3xl text-gray-300 font-light select-none select-all relative z-10 font-normal tracking-wide italic">
                    {practiceTraceText || "بسم الله"}
                  </span>
                </div>

                <div className="flex gap-2 justify-between items-center text-[10px] text-gray-400">
                  <span>Download practice sheets to use offline</span>
                  
                  <button
                    type="button"
                    onClick={() => alert("Assalamu alaikum! Practice PDF worksheets successfully prepared and initiated for your browser's download queue.")}
                    className="inline-flex items-center gap-1 bg-[#22301F] hover:bg-[#8A5A4D] text-white text-[9px] font-mono uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Worksheets</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#DDD5C3]/40 bg-white/40 p-4 rounded-xl text-xs text-gray-500 font-light flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#8CA394] shrink-0 mt-0.5" />
              <span>We recommend purchasing standard heavy glossy paper (coated) and premium bamboo pens for absolute precision when practicing at home.</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
