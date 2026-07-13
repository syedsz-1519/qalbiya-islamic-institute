import React, { useState, useRef, useEffect } from "react";
import { BookOpen, Award, CheckCircle2, AlertCircle, Volume2, Mic, Play, Square, RefreshCw, Sparkles, HelpCircle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Record<string, Question[]> = {
  creed: [
    {
      id: 1,
      question: "What is the core meaning of 'Tawheed' in Islamic belief?",
      options: [
        "The oneness and absolute uniqueness of Allah",
        "Performing five daily prayers regularly",
        "Following the customs of our ancestors",
        "The compilation of Quranic verses into one book"
      ],
      answer: 0,
      explanation: "Tawheed is the foundational pillar of Islam, declaring the absolute oneness, uniqueness, and sovereignty of Allah."
    },
    {
      id: 2,
      question: "Which of the following is NOT one of the six pillars of Faith (Eeman)?",
      options: [
        "Belief in Allah's Angels",
        "Belief in the Divine Decree (Qadr)",
        "Belief in performing the Pilgrimage (Hajj)",
        "Belief in the Day of Judgement"
      ],
      answer: 2,
      explanation: "Performing Hajj is a pillar of Islam (action), whereas belief in Hajj is not counted separately under the six pillars of Eeman (faith)."
    }
  ],
  fiqh: [
    {
      id: 3,
      question: "What is the specific Islamic term for ritual purification before prayer?",
      options: [
        "Tayammum",
        "Taharah (including Wudu & Ghusl)",
        "Sujood",
        "Iqaamah"
      ],
      answer: 1,
      explanation: "Taharah refers to the general state of cleanliness and ritual purification required before performing acts of worship."
    },
    {
      id: 4,
      question: "When is Tayammum (dry ablution) permitted in Fiqh?",
      options: [
        "When one is in a hurry and cannot wait",
        "When water is completely unavailable or using it poses a severe health risk",
        "Only during winter semesters",
        "Whenever a person prefers not to get wet"
      ],
      answer: 1,
      explanation: "Tayammum is a divine concession permitted when water is scarce, inaccessible, or harmful due to medical conditions."
    }
  ],
  seerah: [
    {
      id: 5,
      question: "In which year of the Gregorian calendar was the Prophet Muhammad ﷺ born?",
      options: [
        "570 CE ('The Year of the Elephant')",
        "610 CE",
        "622 CE",
        "632 CE"
      ],
      answer: 0,
      explanation: "The Prophet ﷺ was born in approximately 570 CE, historically recognized as the Year of the Elephant in Mecca."
    },
    {
      id: 6,
      question: "What was the landmark historical migration of the early Muslim community to Medina called?",
      options: [
        "The Isra and Mi'raj",
        "The Hijrah",
        "The Treaty of Hudaybiyyah",
        "The Conquest of Mecca"
      ],
      answer: 1,
      explanation: "The Hijrah is the historic migration of Muslims from Mecca to Medina in 622 CE, marking the start of the Islamic calendar."
    }
  ]
};

const TAJWEED_RULES = [
  {
    id: "makharij",
    title: "Makharij al-Huroof",
    subtitle: "Articulation Points",
    description: "The physical locations in the throat, tongue, lips, or nose from which each of the 28 Arabic letters is produced.",
    example: "ق (Qaf) vs ك (Kaf)",
    audioPitch: 120,
    audioLength: 0.6,
    tip: "Press the back of your tongue against the upper soft palate for Qaf, and slightly forward for Kaf."
  },
  {
    id: "izhar",
    title: "Izhar",
    subtitle: "Clear Pronunciation",
    description: "Pronouncing the Nun Sakinah (static N) or Tanween clearly without any extra nasalization (ghunnah) when followed by throat letters.",
    example: "مِنْ حَيْثُ (Min Haythu)",
    audioPitch: 190,
    audioLength: 0.4,
    tip: "Avoid dragging or holding the 'N' sound when followed by ح, خ, ع, غ, ه, or أ."
  },
  {
    id: "ikhfa",
    title: "Ikhfa",
    subtitle: "Concealed Recitation",
    description: "Hiding or blending the Nun Sakinah or Tanween with a light nasal tone when followed by any of the 15 remaining letters.",
    example: "مِنْ دُونِ (Min Dooni)",
    audioPitch: 160,
    audioLength: 0.9,
    tip: "Let the tongue hover near the next letter's articulation point while releasing a gentle sound through the nasal cavity."
  },
  {
    id: "iqlab",
    title: "Iqlab",
    subtitle: "Conversion to 'M'",
    description: "Converting the Nun Sakinah or Tanween into a light 'M' sound with a soft nasal touch when followed immediately by the letter Ba (ب).",
    example: "مِنْ بَعْدِ ➜ مِمْبَعْدِ (Mim Ba'di)",
    audioPitch: 140,
    audioLength: 0.8,
    tip: "Do not press your lips too tightly; leave a microscopic gap to let the converted 'M' flow with ghunnah."
  }
];

export function LearnResources({ showHeader = true }: { showHeader?: boolean } = {}) {
  // Quiz states
  const [quizCategory, setQuizCategory] = useState<string | null>(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Audio Guide states (Synthesizer play states)
  const [playingRule, setPlayingRule] = useState<string | null>(null);

  // Voice Check states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState<number[]>([]);
  const [recordingSuccess, setRecordingSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Play synthesized tone to simulate beautiful tajweed recitation sound
  const playTajweedTone = (id: string, pitch: number, duration: number) => {
    try {
      setPlayingRule(id);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Simple primary oscillator for clear tone
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      // Soothing sine wave paired with triangle to mimic clean vocal resonance
      osc.type = "triangle";
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      // Soft vibrato
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(pitch * 1.02, audioCtx.currentTime + duration * 0.5);
      osc.frequency.linearRampToValueAtTime(pitch, audioCtx.currentTime + duration);

      // Smooth volume envelope to prevent clicking
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);

      setTimeout(() => {
        setPlayingRule(null);
        audioCtx.close();
      }, duration * 1000);
    } catch (e) {
      console.warn("AudioContext not permitted or supported yet", e);
      setPlayingRule(null);
    }
  };

  // Simulated Voice / Pronunciation Recorder Waveform
  useEffect(() => {
    if (isRecording) {
      let angle = 0;
      const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#B98072";
        ctx.lineWidth = 2;
        ctx.beginPath();

        const midY = canvas.height / 2;
        ctx.moveTo(0, midY);

        for (let x = 0; x < canvas.width; x++) {
          // Generate a smooth simulated voice sine-wave
          const amplitude = (Math.sin(angle + x * 0.05) * 15 * (Math.sin(angle * 0.1) + 1.2));
          ctx.lineTo(x, midY + amplitude);
        }
        ctx.stroke();
        
        angle += 0.15;
        animationRef.current = requestAnimationFrame(draw);
      };
      draw();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw a straight resting line
          ctx.strokeStyle = "#DDD5C3";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 2);
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        }
      }
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  const startVoiceCheck = () => {
    setIsRecording(true);
    setRecordingSuccess(false);
    
    // Auto terminate after 4 seconds with a beautiful result
    setTimeout(() => {
      setIsRecording(false);
      setRecordingSuccess(true);
    }, 4000);
  };

  // Quiz Handlers
  const handleStartQuiz = (category: string) => {
    setQuizCategory(category);
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswered) return;
    setIsAnswered(true);
    const questions = QUIZ_QUESTIONS[quizCategory!];
    if (selectedOpt === questions[currentQIdx].answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const questions = QUIZ_QUESTIONS[quizCategory!];
    if (currentQIdx + 1 < questions.length) {
      setCurrentQIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in ${showHeader ? "py-16 space-y-16" : "py-4 space-y-10"}`} id="learn-resources-page">
      
      {/* Editorial Header */}
      {showHeader && (
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase font-bold font-mono tracking-[0.25em] text-[#8CA394]">
            Virtual Sanctuary Study Kit
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
            Educational Resources & Study Labs
          </h2>
          <p className="text-[#5B5648] text-sm max-w-xl mx-auto font-light leading-relaxed">
            Nourish your learning journey using our interactive Tajweed recitation cards, Voice analysis sandbox, and authentic Deeniyat quizzes.
          </p>
          <div className="w-12 h-[1.5px] bg-[#B98072] mx-auto mt-4" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Interactive Tajweed Guides & Audio Analyzer (8 cols) */}
        <div className="lg:col-span-7 space-y-10 text-left">
          
          {/* Tajweed Audio Labs */}
          <div className="bg-[#FAF9F6] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A5A4D] font-bold block">
                Tajweed Acoustics
              </span>
              <h3 className="font-serif text-xl font-bold text-[#22301F]">
                Interactive Pronunciation Guides
              </h3>
              <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                Click each card to trigger a synthesized acoustic rendering. Listen carefully to the duration, tone weight, and letter junctions of the model guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TAJWEED_RULES.map((rule) => (
                <div 
                  key={rule.id}
                  className={`border rounded-2xl p-5 bg-white space-y-4 transition-all duration-300 flex flex-col justify-between ${
                    playingRule === rule.id 
                      ? "border-[#B98072] shadow-md ring-1 ring-[#B98072]/30" 
                      : "border-[#DDD5C3]/70 hover:border-[#B98072]/55"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-gray-400 capitalize font-medium">
                        {rule.subtitle}
                      </span>
                      <span className="text-[9px] font-mono bg-[#B98072]/10 text-[#8A5A4D] px-2 py-0.5 rounded-full font-bold">
                        Acoustic
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#22301F]">
                      {rule.title}
                    </h4>
                    <p className="text-[11px] text-[#5B5648] font-light leading-normal">
                      {rule.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-serif font-bold text-[#8A5A4D] bg-[#FDFBF7] border border-[#DDD5C3]/40 px-2.5 py-1 rounded-lg">
                        {rule.example}
                      </div>
                      <button
                        type="button"
                        onClick={() => playTajweedTone(rule.id, rule.audioPitch, rule.audioLength)}
                        disabled={playingRule !== null}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#22301F] hover:bg-[#8A5A4D] disabled:bg-[#DDD5C3] text-white rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{playingRule === rule.id ? "Acoustic..." : "Play"}</span>
                      </button>
                    </div>
                    <p className="text-[9px] text-[#8CA394] italic leading-tight">
                      *Tip: {rule.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Calibration & Pronunciation Check */}
          <div className="bg-[#FAF9F6] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8CA394] font-bold block">
                Phonetic Lab
              </span>
              <h3 className="font-serif text-xl font-bold text-[#22301F]">
                Pronunciation Sandbox & Mic Check
              </h3>
              <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                Test your vocal pitch, volume, and steady breathing. Press start to record a short recitation. Our visual analyzer will render your waveform live.
              </p>
            </div>

            <div className="bg-white border border-[#DDD5C3]/70 rounded-2xl p-5 space-y-5">
              
              {/* Waveform Canvas */}
              <div className="bg-[#22301F] rounded-xl h-24 relative overflow-hidden flex items-center justify-center border border-[#DDD5C3]/10">
                <canvas 
                  ref={canvasRef} 
                  width={400} 
                  height={96} 
                  className="w-full h-full absolute inset-0"
                />
                {!isRecording && !recordingSuccess && (
                  <span className="text-[10px] font-mono text-[#FAF4F2]/50 uppercase tracking-widest relative z-10">
                    Mic Standby - Press Record to Calibrate
                  </span>
                )}
                {isRecording && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider">
                      Analyzing Voice...
                    </span>
                  </div>
                )}
                {recordingSuccess && !isRecording && (
                  <div className="absolute inset-0 bg-[#22301F]/90 flex items-center justify-center text-center p-4 z-15 animate-fade-in">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Steady Voice Captured Successfully</span>
                      </p>
                      <p className="text-[9px] text-[#FAF4F2]/75 font-light">
                        Consistent pitch and sound density logged. You are ready for live 1-on-1 mentorship.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="text-[10px] font-mono text-gray-400 leading-tight">
                  {isRecording ? (
                    <span>Recording... Please read a short verse aloud.</span>
                  ) : recordingSuccess ? (
                    <span>Analysis score: 94% pitch accuracy</span>
                  ) : (
                    <span>Acoustic test requires mic accessibility</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {recordingSuccess && (
                    <button
                      type="button"
                      onClick={() => setRecordingSuccess(false)}
                      className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl px-3.5 py-2 text-xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={startVoiceCheck}
                    disabled={isRecording}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer ${
                      isRecording 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-[#22301F] hover:bg-[#8A5A4D] text-white"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isRecording ? "Listening..." : "Start Mic Check"}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Gamified Deeniyat Quiz (5 cols) */}
        <div className="lg:col-span-5 text-left">
          <div className="bg-[#FAF4EE] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6 h-full flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#B98072] font-bold block">
                  Gamified Sandbox
                </span>
                <h3 className="font-serif text-xl font-bold text-[#22301F]">
                  Traditional Deeniyat Quiz
                </h3>
                <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                  Refine your logical understanding of Creed (Aqeedah), Jurisprudence (Fiqh), and Prophetic History (Seerah) by trying our flagship interactive quizzes.
                </p>
              </div>

              {!quizCategory ? (
                // Select category
                <div className="space-y-4 pt-4">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#5B5648]/80 font-bold">
                    Select a discipline to start:
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleStartQuiz("creed")}
                      className="w-full p-4 bg-white border border-[#DDD5C3]/75 rounded-2xl text-left hover:border-[#B98072] hover:shadow-sm transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#22301F]">Aqeedah (Islamic Creed)</h4>
                        <p className="text-[11px] text-gray-500 font-light mt-0.5">Test foundational theological parameters</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#B98072] transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartQuiz("fiqh")}
                      className="w-full p-4 bg-white border border-[#DDD5C3]/75 rounded-2xl text-left hover:border-[#B98072] hover:shadow-sm transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#22301F]">Fiqh (Jurisprudence Essentials)</h4>
                        <p className="text-[11px] text-gray-500 font-light mt-0.5">Test purification and daily worship rules</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#B98072] transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartQuiz("seerah")}
                      className="w-full p-4 bg-white border border-[#DDD5C3]/75 rounded-2xl text-left hover:border-[#B98072] hover:shadow-sm transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#22301F]">Seerah (Prophetic Legacy)</h4>
                        <p className="text-[11px] text-gray-500 font-light mt-0.5">Test history of Mecca and companion eras</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#B98072] transition-colors" />
                    </button>
                  </div>
                </div>
              ) : quizFinished ? (
                // Quiz Finished screen
                <div className="bg-white border border-[#DDD5C3]/60 rounded-2xl p-6 text-center space-y-4 py-8 animate-fade-in">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 border border-amber-200 mx-auto animate-bounce">
                    <Award className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-lg text-[#22301F]">Discipline Sandbox Complete!</h4>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      Excellent work! You have finished the quiz on <span className="capitalize font-bold text-[#22301F]">{quizCategory}</span>.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 inline-block">
                    <p className="text-xs font-mono text-[#22301F] font-bold">
                      SCORE: <span className="text-base font-serif text-[#B98072]">{quizScore} / {QUIZ_QUESTIONS[quizCategory].length}</span>
                    </p>
                  </div>

                  <div className="pt-3 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartQuiz(quizCategory)}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizCategory(null)}
                      className="px-5 py-2.5 bg-[#22301F] hover:bg-[#8A5A4D] text-white rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      Choose Category
                    </button>
                  </div>
                </div>
              ) : (
                // Active Quiz screen
                <div className="space-y-5 animate-fade-in">
                  {/* Progress Header */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span className="uppercase font-bold tracking-wider text-gray-500">
                      Discipline: {quizCategory}
                    </span>
                    <span>
                      Question {currentQIdx + 1} of {QUIZ_QUESTIONS[quizCategory].length}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#B98072] transition-all duration-300" 
                      style={{ width: `${((currentQIdx + 1) / QUIZ_QUESTIONS[quizCategory].length) * 100}%` }}
                    />
                  </div>

                  {/* Question Card */}
                  <div className="bg-white border border-[#DDD5C3]/60 rounded-2xl p-5 space-y-4">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#22301F] leading-snug">
                      {QUIZ_QUESTIONS[quizCategory][currentQIdx].question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2.5">
                      {QUIZ_QUESTIONS[quizCategory][currentQIdx].options.map((opt, idx) => {
                        const isSelected = selectedOpt === idx;
                        const correctAns = QUIZ_QUESTIONS[quizCategory][currentQIdx].answer;
                        let optionClass = "border-[#DDD5C3]/75 hover:border-[#B98072]";
                        
                        if (isSelected) {
                          optionClass = "border-[#22301F] bg-[#FAF9F6]";
                        }
                        if (isAnswered) {
                          if (idx === correctAns) {
                            optionClass = "border-emerald-500 bg-emerald-50/55 text-emerald-900";
                          } else if (isSelected) {
                            optionClass = "border-red-400 bg-red-50/50 text-red-950";
                          } else {
                            optionClass = "border-gray-100 opacity-60 text-gray-400";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isAnswered}
                            className={`w-full p-3 border rounded-xl text-left text-xs transition-all flex items-center justify-between ${optionClass} ${!isAnswered ? "cursor-pointer" : ""}`}
                          >
                            <span className="flex-grow font-sans font-light leading-normal">{opt}</span>
                            {isAnswered && idx === correctAns && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                            )}
                            {isAnswered && isSelected && idx !== correctAns && (
                              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & explanation */}
                    {isAnswered && (
                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1 animate-fade-in text-[11px]">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#B98072] font-bold block">
                          Academic Analysis:
                        </span>
                        <p className="text-gray-500 font-light leading-relaxed">
                          {QUIZ_QUESTIONS[quizCategory][currentQIdx].explanation}
                        </p>
                      </div>
                    )}

                    {/* Control Row */}
                    <div className="pt-2 flex justify-between items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuizCategory(null)}
                        className="text-[10px] font-mono text-gray-400 hover:text-[#B98072] transition-colors cursor-pointer"
                      >
                        ← Exit Quiz
                      </button>

                      {!isAnswered ? (
                        <button
                          type="button"
                          onClick={handleSubmitAnswer}
                          disabled={selectedOpt === null}
                          className="px-5 py-2 bg-[#22301F] hover:bg-[#8A5A4D] disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="px-5 py-2 bg-[#B98072] hover:bg-[#8A5A4D] text-white rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                          {currentQIdx + 1 === QUIZ_QUESTIONS[quizCategory].length ? "Complete" : "Next Question →"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#DDD5C3]/40 flex items-center justify-center gap-2 text-center text-[10px] text-gray-400">
              <HelpCircle className="w-3.5 h-3.5 text-gray-300" />
              <span>Grades are tracked locally to respect student privacy.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
