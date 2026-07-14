import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { 
  db, 
  submitContactForm,
  logWhatsAppInquiry
} from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Course } from "./types";
import { COURSES } from "./data/courses";
import { Header } from "./components/Header";
import { LogoSVG } from "./components/LogoSVG";
import { Hero } from "./components/Hero";
import { CourseCard } from "./components/CourseCard";
import { CourseDetailsModal } from "./components/CourseDetailsModal";
import { CourseFAQ } from "./components/CourseFAQ";
import { LearnResources } from "./components/LearnResources";
import { FreeCourses } from "./components/FreeCourses";
// Lazy-loaded subcomponents for high-performance bundle size optimization (PageSpeed)
const AnalyticsDashboard = React.lazy(() => import("./components/AnalyticsDashboard").then(m => ({ default: m.AnalyticsDashboard })));
const ResourcesHub = React.lazy(() => import("./components/ResourcesHub").then(m => ({ default: m.ResourcesHub })));
const ScholarshipPage = React.lazy(() => import("./components/ScholarshipPage").then(m => ({ default: m.ScholarshipPage })));
const ContactPage = React.lazy(() => import("./components/ContactPage").then(m => ({ default: m.ContactPage })));
const LegalPages = React.lazy(() => import("./components/LegalPages").then(m => ({ default: m.LegalPages })));
const GeneralFAQ = React.lazy(() => import("./components/GeneralFAQ").then(m => ({ default: m.GeneralFAQ })));
const CourseDetailPage = React.lazy(() => import("./components/CourseDetailPage").then(m => ({ default: m.CourseDetailPage })));

import { Testimonials } from "./components/Testimonials";
import { Newsletter } from "./components/Newsletter";
import { BookOpen, MapPin, Mail, Phone, Heart, Globe, Award, HelpCircle, Instagram, MessageCircle, Sparkles, ShieldAlert, PhoneCall, MessageSquare, ChevronUp, ChevronRight, Search, ArrowUpDown, SlidersHorizontal, ArrowRight } from "lucide-react";

function parseDurationToWeeks(durationStr: string): number {
  const normalized = durationStr.toLowerCase();
  if (normalized.includes("1 year") || normalized.includes("year")) {
    return 52;
  }
  if (normalized.includes("ongoing") || normalized.includes("monthly")) {
    return 4;
  }
  const matchWeeks = normalized.match(/(\d+)\s*week/);
  if (matchWeeks) {
    return parseInt(matchWeeks[1], 10);
  }
  return 0;
}

function sortCourses(courses: Course[], sortBy: "newest" | "alphabetical" | "duration"): Course[] {
  const list = [...courses];
  if (sortBy === "newest") {
    return list.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      if (a.flagship && !b.flagship) return -1;
      if (!a.flagship && b.flagship) return 1;
      return a.title.localeCompare(b.title);
    });
  } else if (sortBy === "alphabetical") {
    return list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "duration") {
    return list.sort((a, b) => {
      const weeksA = parseDurationToWeeks(a.duration);
      const weeksB = parseDurationToWeeks(b.duration);
      return weeksA - weeksB;
    });
  }
  return list;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Synchronize currentTab with URL hash for search engine deep indexing and back-button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        // Strip leading #/ or #
        const cleanHash = hash.replace(/^#\/?/, "");
        // Extract tab path prior to any query parameters
        const tab = cleanHash.split("?")[0];
        if (tab) {
          setCurrentTab(tab);
        }
      } else {
        setCurrentTab("home");
      }
    };

    handleHashChange(); // Sync initial mount hash
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Update window.location.hash when currentTab changes to support deep linking and prevent duplicate content
  useEffect(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, "");
    const mainHash = rawHash.split("?")[0];
    if (mainHash !== currentTab) {
      window.location.hash = "/" + currentTab;
    }
  }, [currentTab]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("qalbiya_theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      console.warn("Could not load theme setting", e);
    }
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "student">("student");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeFormDetails, setActiveFormDetails] = useState<Record<string, { formId: string; formUrl: string } | null>>({});
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number[]>>({});
  const [profileDetails, setProfileDetails] = useState({
    bio: "",
    studyBackground: "",
    ageGroup: "",
    goals: ""
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ show: boolean; title: string; message: string; type: "success" | "info" }>({
    show: false,
    title: "",
    message: "",
    type: "success"
  });

  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTopic, setContactTopic] = useState("General Inquiry");
  const [contactMessage, setContactMessage] = useState("");
  const [contactChannel, setContactChannel] = useState<"email" | "whatsapp">("email");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // WhatsApp Inquiry States
  const [waName, setWaName] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [isLoggingWA, setIsLoggingWA] = useState(false);
  const [waSuccess, setWaSuccess] = useState(false);

  // Course Sorting and Filtering States
  const [womenSort, setWomenSort] = useState<"newest" | "alphabetical" | "duration">("newest");
  const [kidsSort, setKidsSort] = useState<"newest" | "alphabetical" | "duration">("newest");
  const [womenSearch, setWomenSearch] = useState("");
  const [kidsSearch, setKidsSearch] = useState("");

  // 1. Load local mock student data from localStorage on mount
  useEffect(() => {
    // Fetch initial course forms from Firestore
    fetchCourseForms();

    try {
      const localEnrollments = localStorage.getItem("qalbiya_enrollments");
      if (localEnrollments) {
        setUserEnrollments(JSON.parse(localEnrollments));
      } else {
        setUserEnrollments([]);
      }

      const localBookmarks = localStorage.getItem("qalbiya_bookmarks");
      if (localBookmarks) {
        setUserBookmarks(JSON.parse(localBookmarks));
      } else {
        setUserBookmarks([]);
      }

      const localProgress = localStorage.getItem("qalbiya_progress");
      if (localProgress) {
        setUserProgress(JSON.parse(localProgress));
      } else {
        setUserProgress({});
      }

      const localProfile = localStorage.getItem("qalbiya_profile");
      if (localProfile) {
        const parsed = JSON.parse(localProfile);
        setProfileDetails(parsed);
        if (parsed.displayName) {
          setUser(prev => prev ? { ...prev, displayName: parsed.displayName } : null);
        }
      }
    } catch (err) {
      console.error("Failed to load persistent local student details", err);
    }

    setLoading(false);
  }, []);

  // 2. Enforce strict isolation for Admin tab and redirect unauthorized students to Student Portal
  useEffect(() => {
    if (currentTab === "analytics" && userRole !== "admin") {
      setCurrentTab("portal");
    }
  }, [currentTab, userRole]);

  // Scroll to top on active tab transitions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  // Fetch course-to-form bindings from Firestore
  const fetchCourseForms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "course_forms"));
      const bindings: Record<string, { formId: string; formUrl: string } | null> = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bindings[doc.id] = {
          formId: data.formId,
          formUrl: data.formUrl
        };
      });

      setActiveFormDetails(bindings);
    } catch (err) {
      console.error("Failed to load course forms from Firestore", err);
    }
  };

  const handleLogin = () => {
    // Auth modal is deprecated, but keep a no-op handler for compatibility
  };

  const handleAuthSuccess = async (loggedInUser: User, role: "admin" | "student", profile: any) => {
    // Mock success handler if needed
  };

  const handleBookmarkToggle = async (courseId: string) => {
    const isBookmarkedNow = userBookmarks.includes(courseId);
    let updated: string[];
    if (isBookmarkedNow) {
      updated = userBookmarks.filter(id => id !== courseId);
    } else {
      updated = [...userBookmarks, courseId];
    }
    setUserBookmarks(updated);
    localStorage.setItem("qalbiya_bookmarks", JSON.stringify(updated));
  };

  const handleLogout = async () => {
    // Auth is fully removed, so this is a no-op
  };

  const handleEnrollSuccess = async (courseId: string, acceptedTermsAt: string) => {
    const updatedEnrollments = userEnrollments.includes(courseId)
      ? userEnrollments
      : [...userEnrollments, courseId];
    setUserEnrollments(updatedEnrollments);
    localStorage.setItem("qalbiya_enrollments", JSON.stringify(updatedEnrollments));

    const course = COURSES.find(c => c.id === courseId);
    if (course && user) {
      // Trigger automated "Welcome to the Course" email via custom Cloud Function emulation
      console.log("Triggering Welcome Email Cloud Function emulation...");
      try {
        const response = await fetch("/api/trigger-welcome-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            uid: user.uid,
            courseId: course.id,
            studentName: user.displayName || "Respected Student",
            studentEmail: user.email || "",
            courseTitle: course.title,
            instructor: course.instructor,
            duration: course.duration,
            schedule: course.schedule,
            description: course.description
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Trigger visual notification toast
            setNotification({
              show: true,
              title: "Welcome Email Sent",
              message: `Automated "Welcome to the Course" email successfully generated and sent to ${user.email}!`,
              type: "success"
            });

            // Self-dismiss after 6 seconds
            setTimeout(() => {
              setNotification(prev => ({ ...prev, show: false }));
            }, 6000);
          }
        }
      } catch (emailErr) {
        console.error("Failed to execute automated welcome email trigger", emailErr);
      }
    }
  };

  const handleUpdateProgress = async (courseId: string, completedIndices: number[]) => {
    const updated = {
      ...userProgress,
      [courseId]: completedIndices
    };
    setUserProgress(updated);
    localStorage.setItem("qalbiya_progress", JSON.stringify(updated));
  };

  const handleUpdateProfile = async (details: { displayName: string; bio: string; studyBackground: string; ageGroup: string; goals: string }) => {
    if (user) {
      setUser({
        ...user,
        displayName: details.displayName
      });
    }
    const updatedProfile = {
      bio: details.bio,
      studyBackground: details.studyBackground,
      ageGroup: details.ageGroup,
      goals: details.goals
    };
    setProfileDetails(updatedProfile);
    localStorage.setItem("qalbiya_profile", JSON.stringify({
      displayName: details.displayName,
      ...updatedProfile
    }));
  };

  const handleFormCreated = (courseId: string, formId: string, formUrl: string) => {
    setActiveFormDetails(prev => ({
      ...prev,
      [courseId]: { formId, formUrl }
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      return;
    }
    setIsSubmittingContact(true);

    // Construct the email fields synchronously
    const subject = `Admission Inquiry [${contactTopic}] - ${contactName}`;
    const body = `Assalamu'alaikum wa rehmatullahi wa barakatuhu,

I am interested in QALBIYA Islamic Institute's courses and would like to submit an inquiry.

--- INQUIRY DETAILS ---
• Name: ${contactName}
• Email: ${contactEmail}
• Phone: ${contactPhone || "Not provided"}
• Topic of Interest: ${contactTopic}
• Preferred Reply Channel: ${contactChannel === "email" ? "Email Response" : "WhatsApp Outreach"}

--- MESSAGE / QUESTIONS ---
${contactMessage}

---
Please guide me with the next steps. JazakAllahu Khairan!`;

    // Open user's default email client pre-filled with the inquiry details
    const mailtoUrl = `mailto:qalbiyaislamicinstitute@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");

    try {
      await submitContactForm({
        name: contactName,
        email: contactEmail,
        topic: contactTopic,
        message: contactMessage,
        channel: contactChannel,
        phone: contactPhone || undefined
      });
      setContactSuccess(true);
      // Reset form
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMessage("");
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to submit contact form", err);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleWhatsAppQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waName) return;
    setIsLoggingWA(true);
    try {
      await logWhatsAppInquiry({
        name: waName,
        phone: waPhone || undefined,
        message: waMessage || "Initiated quick WhatsApp chat from website home page"
      });
      setWaSuccess(true);
      
      // Build WhatsApp message and open link
      const text = encodeURIComponent(`Assalamu'alaikum wa rehmatullahi wa barakatuhu. I am ${waName}. I am interested in QALBIYA Islamic Institute's courses. ${waMessage ? `Inquiry: ${waMessage}` : ""}`);
      const waUrl = `https://wa.me/918145363290?text=${text}`;
      
      // Safe redirect inside sandbox
      window.open(waUrl, "_blank");
      
      // Reset fields
      setWaName("");
      setWaPhone("");
      setWaMessage("");
      setTimeout(() => setWaSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to log WhatsApp inquiry", err);
    } finally {
      setIsLoggingWA(false);
    }
  };

  // Filter and sort courses by tab
  const womenCourses = sortCourses(
    COURSES.filter(c => 
      c.category === "women" && (
        !womenSearch ||
        c.title.toLowerCase().includes(womenSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(womenSearch.toLowerCase()) ||
        c.instructor.toLowerCase().includes(womenSearch.toLowerCase())
      )
    ),
    womenSort
  );

  const kidsCourses = sortCourses(
    COURSES.filter(c => 
      c.category === "kids" && (
        !kidsSearch ||
        c.title.toLowerCase().includes(kidsSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(kidsSearch.toLowerCase()) ||
        c.instructor.toLowerCase().includes(kidsSearch.toLowerCase())
      )
    ),
    kidsSort
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFE5EC] to-[#FFD6E0] dark:from-[#0B0E0A] dark:via-[#111610] dark:to-[#0B0E0A] text-[#22301F] dark:text-[#FAF4F2] flex flex-col justify-between relative overflow-hidden transition-colors duration-500">
      
      {/* Premium Animated Pink Background Blobs & Floating Orbs */}
      <div className="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-radial from-[#FFCCD5]/50 via-transparent to-transparent pointer-events-none blur-3xl animate-float-orb-one z-0"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full bg-radial from-[#FFB3C1]/50 via-transparent to-transparent pointer-events-none blur-3xl animate-float-orb-two z-0"></div>
      <div className="absolute top-[40%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-radial from-[#FFE5EC]/45 via-transparent to-transparent pointer-events-none blur-3xl animate-float-orb-one z-0" style={{ animationDelay: '6s' }}></div>

      {/* Elegant Drifting Pink Sparks & Soft Particles */}
      <div className="absolute bottom-0 left-[10%] w-2 h-2 rounded-full bg-[#B98072]/30 pointer-events-none blur-xs animate-rise-particle-1"></div>
      <div className="absolute bottom-0 left-[35%] w-3 h-3 rounded-full bg-[#E0A395]/40 pointer-events-none blur-xs animate-rise-particle-2"></div>
      <div className="absolute bottom-0 left-[65%] w-1.5 h-1.5 rounded-full bg-[#B98072]/50 pointer-events-none blur-xs animate-rise-particle-3"></div>
      <div className="absolute bottom-0 left-[85%] w-2 h-2 rounded-full bg-[#E0A395]/30 pointer-events-none blur-xs animate-rise-particle-1" style={{ animationDelay: "5s" }}></div>
      <div className="absolute bottom-0 left-[50%] w-2.5 h-2.5 rounded-full bg-[#B98072]/40 pointer-events-none blur-xs animate-rise-particle-3" style={{ animationDelay: "10s" }}></div>

      {/* Background Animated Islamic Motifs */}
      <div className="absolute top-24 left-4 w-28 h-28 pointer-events-none opacity-20 hidden xl:block animate-float-rehal" title="Rehal Motif">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#8A5A4D] fill-none stroke-current" strokeWidth="2">
          <path d="M25,65 L75,35 M25,35 L40,44" strokeLinecap="round" />
          <path d="M50,50 L75,65" strokeLinecap="round" />
          <path d="M20,65 L30,65 M70,65 L80,65" strokeLinecap="round" />
          <path d="M15,35 L45,25 L50,30 L55,25 L85,35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25,28 C35,26 45,28 50,30 C55,28 65,26 75,28" strokeLinecap="round" />
          <path d="M25,32 C35,30 45,32 50,34 C55,30 65,30 75,32" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute top-[500px] right-8 w-36 h-36 pointer-events-none opacity-15 hidden xl:block animate-spin-islamic" title="Islamic Star Pattern">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#B98072] fill-none stroke-current" strokeWidth="1.5">
          <circle cx="50" cy="50" r="10" strokeDasharray="2,2" />
          <circle cx="50" cy="50" r="22" />
          <circle cx="50" cy="50" r="45" />
          <path d="M50,5 L63,37 L95,50 L63,63 L50,95 L37,63 L5,50 L37,37 Z" />
          <path d="M18,18 L50,31 L82,18 L69,50 L82,82 L50,69 L18,82 L31,50 Z" />
        </svg>
      </div>

      <div className="absolute bottom-[200px] left-12 w-32 h-32 pointer-events-none opacity-20 hidden lg:block animate-pulse-geometry" title="Islamic Geometric Motif">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#B98072] fill-none stroke-current" strokeWidth="1.5">
          <polygon points="50,15 85,50 50,85 15,50" />
          <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="35" strokeDasharray="3,3" />
        </svg>
      </div>
      
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <React.Suspense fallback={
          <div className="py-24 text-center font-mono text-xs text-[#5B5648] flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="w-10 h-10 border-2 border-[#B98072] border-t-transparent rounded-full animate-spin"></div>
            <span className="tracking-widest uppercase text-[10px] text-[#8A5A4D]">Preparing sacred sanctuary...</span>
          </div>
        }>
          {currentTab === "home" && (
          <div className="space-y-12">
            <Hero onChoosePath={(path) => setCurrentTab(path)} />

            {/* Featured Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in" id="flagship-section">
              <div className="border-t border-[#DDD5C3] pt-12">
                <div className="text-center space-y-3 mb-16">
                  <span className="text-[10px] uppercase font-bold font-mono tracking-[0.25em] text-[#8CA394]">
                    Syllabi Highlights
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-[#22301F]">
                    Our Flagship Intakes
                  </h3>
                  <p className="text-[#5B5648] font-light text-sm max-w-xl mx-auto">
                    Highly structured academic paths crafted to fit the lifestyle of modern Muslim 
                    families and busy women.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                  {COURSES.filter(c => c.flagship || c.isFree).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      formDetails={activeFormDetails[course.id] || null}
                      onExplore={(c) => setCurrentTab("course-" + c.id)}
                      user={user}
                      isEnrolled={userEnrollments.includes(course.id)}
                    />
                  ))}
                </div>

                {/* Sponsorship & Scholarship Promo Card */}
                <div className="mt-12 max-w-5xl mx-auto">
                  <div className="relative bg-[#FAF4F2]/90 border border-[#DDD5C3] rounded-[32px] p-8 md:p-10 overflow-hidden shadow-sm group hover:border-[#8CA394] transition-all duration-300">
                    {/* Watermark Heart Outline */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none group-hover:scale-105 group-hover:opacity-[0.06] transition-transform duration-500">
                      <Heart className="w-64 h-64 text-[#33453A]" strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10 space-y-6 md:max-w-2xl text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAE8E3] text-[#33453A] text-[9px] uppercase font-mono tracking-widest font-bold rounded-full">
                        <Heart className="w-3.5 h-3.5 text-[#33453A]" />
                        <span>Sadaqah Jariyah</span>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F] tracking-tight">
                          Sponsorship & Scholarship
                        </h4>
                        <p className="font-sans text-[#5B5648] text-xs sm:text-sm font-light leading-relaxed">
                          Support deserving students or apply for full tuition waivers. We believe sacred Deen education must be accessible to all.
                        </p>
                      </div>

                      <div>
                        <button
                          onClick={() => setCurrentTab("scholarship")}
                          className="inline-flex items-center gap-2 bg-[#8CA394] hover:bg-[#33453A] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] shadow-sm cursor-pointer"
                        >
                          <span>Apply or Sponsor</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Founder Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#DDD5C3] animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
                
                {/* Left Column: Artistic Portrait Frame with Islamic Arch / Soft Watercolor Pink styling */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-72 h-96 max-w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/60 bg-gradient-to-tr from-[#FCEDE9] to-[#FBDBD3]">
                    
                    {/* Artistic Islamic arch background overlay */}
                    <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800')" }}></div>
                    
                    {/* Elegant Watercolor dome ornament watermark inside the frame */}
                    <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between p-8 text-center z-10">
                      <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                        <LogoSVG 
                          className="w-11 h-11" 
                          fillColor="#FAF4F2" 
                        />
                      </div>
                      
                      <div className="space-y-2 bg-[#22301F]/85 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-white shadow-lg">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#B0863A] font-bold">Principal Scholar</span>
                        <h4 className="font-serif text-lg font-bold">Ms. Mustara</h4>
                        <p className="text-[10px] text-gray-200 font-light font-sans">Holder of Traditional Ijazat & Classical Licenses</p>
                      </div>
                    </div>

                    {/* Pink Watercolor Blotches behind portrait container */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-radial from-[#B98072]/45 to-transparent pointer-events-none blur-2xl z-0"></div>
                  </div>
                </div>

                {/* Right Column: Narrative Biography & Vision statement */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold block">
                      The Heart of the Institute
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
                      About Our "Founder"
                    </h3>
                  </div>

                  <p className="font-sans text-[#5B5648] text-sm md:text-base font-light leading-relaxed">
                    Qalbiya Islamic Institute was founded by <strong>Mustara</strong>, who has spent the past few years teaching Seerah, Tajweed, and Islamic Studies to students at different stages of their journey.
                  </p>

                  <p className="font-sans text-[#5B5648] text-sm md:text-base font-light leading-relaxed">
                    Through this experience, she noticed something missing in how deen was often taught, plenty of knowledge, but little guidance on how to actually live it. That realization became the foundation Qalbiya was built on: a place where learning isn't just about gaining ilm, but about real, lasting change.
                  </p>

                  <div className="bg-[#FAF4F2] border-l-4 border-[#B98072] rounded-r-3xl p-6 italic text-[#22301F] font-serif text-sm relative">
                    <span className="absolute top-2 left-3 text-5xl font-serif text-[#B98072]/20 select-none">“</span>
                    <p className="relative z-10 leading-relaxed font-light pl-4">
                      "My vision for Qalbiya was simple, a place where deen isn't just studied but lived. Where ilm reaches the heart, and shapes how we act. I welcome you to find that here."
                    </p>
                    <div className="mt-3 pl-4 text-right">
                      <span className="text-xs uppercase font-bold tracking-wider font-mono text-[#8A5A4D]">&mdash; MS. MUSTARA</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Testimonials Section */}
            <Testimonials />

            {/* FAQs on Home Page */}
            <div className="max-w-7xl mx-auto border-t border-[#DDD5C3] pt-12">
              <CourseFAQ
                userRole={userRole}
                onGoToAnalytics={() => setCurrentTab("analytics")}
              />
            </div>

            {/* Admissions Inquiry Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#DDD5C3]">
              <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold block">
                  Support Desk
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">
                  Admission Inquiry Form
                </h2>
                <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
                  Have specific questions about our curricula, age criteria, or textbook requirements? Connect with our administration.
                </p>
                <div className="w-8 h-[1px] bg-[#B98072] mx-auto mt-2" />
              </div>

              <div className="max-w-2xl mx-auto bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#8A5A4D] font-bold block">
                    Inquiry Form
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#22301F] tracking-tight">
                    Submit an Admissions Case
                  </h3>
                  <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                    Send our administrative desk a direct message. We review case inquiries daily and respond within 12 hours.
                  </p>
                </div>

                {contactSuccess ? (
                  <div className="bg-[#8CA394]/15 border border-[#8CA394]/40 rounded-2xl p-6 text-center space-y-3 py-10">
                    <div className="w-10 h-10 bg-[#8CA394]/20 text-[#33453A] border border-[#8CA394]/40 rounded-full flex items-center justify-center mx-auto">
                      ✓
                    </div>
                    <h4 className="font-serif font-bold text-[#22301F]">Inquiry Submitted Successfully</h4>
                    <p className="text-xs text-[#5B5648] max-w-sm mx-auto font-light leading-relaxed">
                      Assalamu alaikum! Thank you for reaching out to QALBIYA Islamic Institute. Your inquiry has been routed to our staff messaging dashboard, and an advisor will contact you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                        Full Name *
                      </label>
                      <input
                        id="contact-input-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Amina Siddiqui"
                        className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                        Email Address *
                      </label>
                      <input
                        id="contact-input-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="amina@example.com"
                        className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                        Phone Number
                      </label>
                      <input
                        id="contact-input-phone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 019-2834"
                        className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                        Topic of Interest
                      </label>
                      <select
                        id="contact-input-topic"
                        value={contactTopic}
                        onChange={(e) => setContactTopic(e.target.value)}
                        className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#8CA394]"
                      >
                        <option value="General Inquiry">General Admissions Question</option>
                        <option value="Women's Intake">Women Course Hub</option>
                        <option value="Kids' Intake">Kids Course Hub</option>
                        <option value="Feedback & Support">Platform Feedback or Support</option>
                        <option value="Sponsorship & Partnering">Scholarship Sponsorships</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                        Preferred Reply Channel
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs font-sans text-[#5B5648] cursor-pointer">
                          <input
                            type="radio"
                            name="channel"
                            checked={contactChannel === "email"}
                            onChange={() => setContactChannel("email")}
                            className="accent-[#8CA394]"
                          />
                          <span>Email Response</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-sans text-[#5B5648] cursor-pointer">
                          <input
                            type="radio"
                            name="channel"
                            checked={contactChannel === "whatsapp"}
                            onChange={() => setContactChannel("whatsapp")}
                            className="accent-[#8CA394]"
                          />
                          <span>WhatsApp Outreach</span>
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                        Message / Questions *
                      </label>
                      <textarea
                        id="contact-input-message"
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Assalamu'alaikum wa rehmatullahi wa barakatuhu, I would like to inquire about..."
                        rows={4}
                        className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394] resize-none"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <button
                        id="btn-submit-contact"
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full bg-[#22301F] hover:bg-[#33453A] disabled:bg-[#DDD5C3] text-white disabled:text-[#5B5648]/40 py-3 rounded-full text-xs font-bold uppercase tracking-widest btn-shadow cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        {isSubmittingContact ? "Sending Message..." : "Submit Case to Registrar"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Newsletter Section */}
            <Newsletter />
          </div>
        )}

        {currentTab === "women" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5B5648] font-bold" id="women-hub-breadcrumb">
              <button onClick={() => setCurrentTab("home")} className="hover:text-[#B98072] cursor-pointer transition-colors">Homepage</button>
              <ChevronRight className="w-3 h-3 text-[#8CA394]" />
              <span className="text-[#8A5A4D]">Women's Courses</span>
            </div>

            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4" id="women-hub-hero">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8CA394] font-bold block">
                The Sacred Learning Path
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#22301F] leading-tight tracking-tight">
                Every woman's journey back to Allah looks different. Here's yours.
              </h1>
              <div className="w-12 h-[1.5px] bg-[#B98072] mx-auto my-4" />
              <p className="text-[#5B5648] text-sm sm:text-base font-light leading-relaxed">
                Whether you're correcting your recitation, healing your character, or building your foundation from the ground up — there's a course made for exactly where you are.
              </p>
            </div>

            {/* Search & Sort controls bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAF4F2]/50 border border-[#DDD5C3]/60 rounded-3xl p-4 max-w-5xl mx-auto w-full">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5648]/60" />
                <input
                  type="text"
                  placeholder="Search women's courses (e.g. Tajweed, Seerah)..."
                  value={womenSearch}
                  onChange={(e) => setWomenSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#DDD5C3] rounded-2xl text-xs font-sans placeholder-[#5B5648]/50 focus:outline-none focus:border-[#B98072] focus:ring-1 focus:ring-[#B98072]/30 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <ArrowUpDown className="w-4 h-4 text-[#8CA394]" />
                <select
                  value={womenSort}
                  onChange={(e) => setWomenSort(e.target.value as any)}
                  className="bg-white border border-[#DDD5C3] rounded-2xl px-4 py-2.5 text-xs font-mono text-[#5B5648]/80 focus:outline-none focus:border-[#B98072]"
                >
                  <option value="popular">Sort by Popularity</option>
                  <option value="newest">Sort by Newest</option>
                  <option value="title">Sort by Name</option>
                </select>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto" id="women-courses-grid">
              {womenCourses.length > 0 ? (
                womenCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    formDetails={activeFormDetails[course.id] || null}
                    onExplore={(c) => setCurrentTab("course-" + c.id)}
                    user={user}
                    isEnrolled={userEnrollments.includes(course.id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-[#5B5648]/60 font-mono text-xs">
                  No courses found matching "{womenSearch}"
                </div>
              )}
            </div>

            {/* Closing Section */}
            <div className="bg-[#FAF4F2] border border-[#DDD5C3] rounded-[32px] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6" id="women-hub-closing">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F] max-w-xl mx-auto leading-tight">
                Not sure which one is right for you? Message us — we'll help you find your starting point.
              </h3>
              <p className="text-xs sm:text-sm text-[#5B5648] font-light max-w-md mx-auto">
                Connect directly with our admissions office to ask about schedules, private classes, or textbook distribution.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <a 
                  href="https://wa.me/918145363290?text=Assalamu%27alaikum!%20I%27d%20like%20to%20inquire%20about%20QALBIYA%20Islamic%20Institute%20Women%27s%20Courses."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
                <a 
                  href="https://instagram.com/qalbiya_institute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#22301F] hover:bg-[#33453A] text-[#FAF4F2] border border-[#DDD5C3] px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Instagram className="w-4 h-4" />
                  <span>DM on Instagram</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {currentTab === "kids" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5B5648] font-bold" id="kids-hub-breadcrumb">
              <button onClick={() => setCurrentTab("home")} className="hover:text-[#B98072] cursor-pointer transition-colors">Homepage</button>
              <ChevronRight className="w-3 h-3 text-[#8CA394]" />
              <span className="text-[#8A5A4D]">Kids' Courses</span>
            </div>

            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4" id="kids-hub-hero">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8CA394] font-bold block">
                Nurturing Young Hearts
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#22301F] leading-tight tracking-tight">
                Raise a child who doesn't just know their deen — who loves it.
              </h1>
              <div className="w-12 h-[1.5px] bg-[#B0863A] mx-auto my-4" />
              <p className="text-[#5B5648] text-sm sm:text-base font-light leading-relaxed">
                Age-appropriate, structured, and rooted in authentic teaching — built for children ages 6–12.
              </p>
            </div>

            {/* Search & Sort controls bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAF4F2]/50 border border-[#DDD5C3]/60 rounded-3xl p-4 max-w-5xl mx-auto w-full">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5648]/60" />
                <input
                  type="text"
                  placeholder="Search kids' courses (e.g. Noorani, Deeniyat)..."
                  value={kidsSearch}
                  onChange={(e) => setKidsSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#DDD5C3] rounded-2xl text-xs font-sans placeholder-[#5B5648]/50 focus:outline-none focus:border-[#B0863A] focus:ring-1 focus:ring-[#B0863A]/30 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <ArrowUpDown className="w-4 h-4 text-[#8CA394]" />
                <select
                  value={kidsSort}
                  onChange={(e) => setKidsSort(e.target.value as any)}
                  className="bg-white border border-[#DDD5C3] rounded-2xl px-4 py-2.5 text-xs font-mono text-[#5B5648]/80 focus:outline-none focus:border-[#B0863A]"
                >
                  <option value="popular">Sort by Popularity</option>
                  <option value="newest">Sort by Newest</option>
                  <option value="title">Sort by Name</option>
                </select>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto" id="kids-courses-grid">
              {kidsCourses.length > 0 ? (
                kidsCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    formDetails={activeFormDetails[course.id] || null}
                    onExplore={(c) => setCurrentTab("course-" + c.id)}
                    user={user}
                    isEnrolled={userEnrollments.includes(course.id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-[#5B5648]/60 font-mono text-xs">
                  No courses found matching "{kidsSearch}"
                </div>
              )}
            </div>

            {/* Closing Section */}
            <div className="bg-[#FAF4F2] border border-[#DDD5C3] rounded-[32px] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6" id="kids-hub-closing">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F] max-w-xl mx-auto leading-tight">
                Give your child a foundation that grows with them — in knowledge, in akhlaq, in love for their deen.
              </h3>
              <p className="text-xs sm:text-sm text-[#5B5648] font-light max-w-md mx-auto">
                Connect directly with our staff to arrange private tutoring, trial classes, or to answer syllabus questions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <a 
                  href="https://wa.me/918145363290?text=Assalamu%27alaikum!%20I%27d%20like%20to%20inquire%20about%20QALBIYA%20Islamic%20Institute%20Kids%20Courses."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
                <a 
                  href="https://instagram.com/qalbiya_institute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#22301F] hover:bg-[#33453A] text-[#FAF4F2] border border-[#DDD5C3] px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Instagram className="w-4 h-4" />
                  <span>DM on Instagram</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {currentTab === "about" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-16">
            
            {/* Mission Header */}
            <div className="text-center space-y-4">
              <span className="text-[10px] uppercase font-bold font-mono tracking-[0.25em] text-[#8CA394]">
                The Heritage
              </span>
              <h2 className="font-serif text-4xl font-bold text-[#22301F] leading-tight">
                About QALBIYA Islamic Institute
              </h2>
              <div className="w-12 h-[1.5px] bg-[#B98072] mx-auto mt-4" />
            </div>

            {/* Main Editorial Text Blocks */}
            <div className="font-sans text-[#5B5648] leading-relaxed font-light text-sm sm:text-base space-y-8">
              <p className="font-serif italic text-[#22301F] text-base sm:text-lg">
                "Our mission is simple: to make deep, foundational, and heart-centric Islamic study accessible, beautifully presented, and academically structured for modern families."
              </p>
              
              <p>
                In a fast-paced digital world, finding high-quality spiritual guidance can be 
                overwhelming. High-quality learning requires structure, consistency, and highly qualified 
                mentors. We founded QALBIYA Islamic Institute to solve this problem.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 my-6 border-y border-[#DDD5C3]">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-[#22301F]">Semesters & Courses</h4>
                  <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                    We believe in high-contrast educational standards. Our courses are semester-based, 
                    featuring visual slides, homework assessments, and certificates of completion.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-[#22301F]">Certified Scholarship</h4>
                  <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                    All our female instructors hold certified diplomas (Ijazah) in Tajweed and 
                    Deeniyat, combined with trained backgrounds in child and adult pedagogy.
                  </p>
                </div>
              </div>

              <h4 className="font-serif font-bold text-[#22301F] text-lg">Our Four Pillars</h4>
              <ul className="space-y-4 pt-2">
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-[#F1E7D3] rounded-full flex items-center justify-center font-mono text-[10px] text-[#87652A] font-bold border border-[#DDD5C3] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-[#22301F] text-sm">Aqeedah (Sound Intellect)</h5>
                    <p className="text-xs text-[#5B5648] font-light mt-0.5">Nourishing the mind through crystal-clear theological understanding and sound rational theology.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-[#F1E7D3] rounded-full flex items-center justify-center font-mono text-[10px] text-[#87652A] font-bold border border-[#DDD5C3] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-[#22301F] text-sm">Fiqh (Practical Practice)</h5>
                    <p className="text-xs text-[#5B5648] font-light mt-0.5">Equipping students with exact, step-by-step clarity regarding acts of worship and daily jurisprudence.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-[#F1E7D3] rounded-full flex items-center justify-center font-mono text-[10px] text-[#87652A] font-bold border border-[#DDD5C3] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-[#22301F] text-sm">Tajweed (Articulate Recitation)</h5>
                    <p className="text-xs text-[#5B5648] font-light mt-0.5">Preserving the authentic, beautiful pronunciation of letters in perfect harmony with historical recitations.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-[#F1E7D3] rounded-full flex items-center justify-center font-mono text-[10px] text-[#87652A] font-bold border border-[#DDD5C3] shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-[#22301F] text-sm">Akhlaq (Ethical Polish)</h5>
                    <p className="text-xs text-[#5B5648] font-light mt-0.5">Cultivating prophetic manners, heart-purification (Tazkiyah), and deep mental presence in prayer.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        )}

        {currentTab === "faqs" && (
          <CourseFAQ
            userRole={userRole}
            onGoToAnalytics={() => setCurrentTab("analytics")}
          />
        )}

        {(currentTab === "resources" || currentTab === "learn" || currentTab === "free-courses") && (
          <ResourcesHub />
        )}

        {currentTab === "scholarship" && (
          <ScholarshipPage />
        )}

        {currentTab === "contact" && (
          <ContactPage />
        )}

        {currentTab === "faq" && (
          <GeneralFAQ 
            onTabChange={setCurrentTab}
            onBackToHome={() => setCurrentTab("home")}
          />
        )}

        {(currentTab === "refund-policy" || currentTab === "terms-conditions" || currentTab === "privacy-policy") && (
          <LegalPages 
            policyType={currentTab === "refund-policy" ? "refund" : currentTab === "terms-conditions" ? "terms" : "privacy"}
            onBackToHome={() => setCurrentTab("home")}
            onTabChange={setCurrentTab}
          />
        )}

        {currentTab.startsWith("course-") && (() => {
          const courseId = currentTab.replace("course-", "");
          const course = COURSES.find(c => c.id === courseId);
          if (!course) return <div className="py-20 text-center font-serif text-[#22301F]">Course not found.</div>;
          return (
            <CourseDetailPage
              course={course}
              formDetails={activeFormDetails[course.id] || null}
              onClose={() => {
                if (course.category === "women") {
                  setCurrentTab("women");
                } else {
                  setCurrentTab("kids");
                }
              }}
              user={user}
              handleLogin={handleLogin}
              onEnrollSuccess={handleEnrollSuccess}
              isEnrolled={userEnrollments.includes(course.id)}
            />
          );
        })()}

        {/* Student Portal component has been deprecated and removed */}

        {currentTab === "analytics" && (
          userRole === "admin" ? (
            <AnalyticsDashboard
              courses={COURSES}
              activeFormDetails={activeFormDetails}
              onFormCreated={handleFormCreated}
              user={user}
            />
          ) : (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-200/40 rounded-full text-[10px] uppercase tracking-widest font-bold text-red-700">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Security Access Restricted</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F]">Admin Authorized Access Only</h3>
              <p className="text-xs text-[#5B5648] font-light leading-relaxed max-w-sm mx-auto">
                The Organizers' Desk contains protected student intake history and Google Forms controls. Standard student accounts do not hold authorization credentials.
              </p>
              <button 
                onClick={() => setCurrentTab("portal")}
                className="px-6 py-2.5 bg-[#22301F] text-white hover:bg-[#33453A] text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-md active:scale-95"
              >
                Return to My Student Portal
              </button>
            </div>
          )
        )}
        </React.Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-[#22301F] text-[#FAF4F2]/85 py-16 border-t border-[#DDD5C3] relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] stitched-line opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          {/* Logo Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full overflow-hidden flex items-center justify-center border border-white/20">
                <LogoSVG 
                  className="w-8 h-8" 
                  fillColor="white" 
                />
              </div>
              <h4 className="font-serif text-xl tracking-[0.2em] font-bold text-white uppercase">
                QALBIYA
              </h4>
            </div>
            <p className="font-sans text-xs text-[#FAF4F2]/70 font-light leading-relaxed max-w-xs">
              A premium, traditional learning institute for modern families. Restoring true 
              intellectual focus and faith foundations.
            </p>
            <div className="pt-2 border-t border-[#FAF9F6]/10 text-xs">
              <span className="font-serif font-bold text-[#B0863A]">Founder: </span>
              <span className="font-sans text-white font-medium">MS. MUSTARA</span>
            </div>
          </div>

          {/* Quick links Column */}
          <div className="space-y-4 font-sans text-xs">
            <h5 className="font-serif font-bold uppercase tracking-wider text-[#B0863A]">Admissions</h5>
            <div className="flex flex-col space-y-2">
              <button onClick={() => setCurrentTab("women")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Women Courses Hub</button>
              <button onClick={() => setCurrentTab("kids")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Kids Courses Hub</button>
              <button onClick={() => setCurrentTab("about")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Founders & Vision</button>
              <button onClick={() => setCurrentTab("scholarship")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer text-[#B98072] font-semibold">Scholarships & Fund</button>
            </div>
          </div>

          {/* Legal & Policies Column */}
          <div className="space-y-4 font-sans text-xs">
            <h5 className="font-serif font-bold uppercase tracking-wider text-[#B0863A]">Legal & Policies</h5>
            <div className="flex flex-col space-y-2">
              <button onClick={() => setCurrentTab("refund-policy")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Refund Policy</button>
              <button onClick={() => setCurrentTab("terms-conditions")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Terms & Conditions</button>
              <button onClick={() => setCurrentTab("privacy-policy")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Privacy Policy</button>
              <button onClick={() => setCurrentTab("faq")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">General FAQ</button>
              <button onClick={() => setCurrentTab("contact")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Contact Us</button>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4 font-sans text-xs">
            <h5 className="font-serif font-bold uppercase tracking-wider text-[#B0863A]">Admissions Office</h5>
            <div className="space-y-2 font-light text-[#FAF4F2]/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8CA394]" />
                <span>Virtual Classes Worldwide</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#8CA394]" />
                <span className="break-all">qalbiyaislamicinstitute@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#8CA394]" />
                <span>+91 8145363290</span>
              </p>
              <p className="text-[10px] text-gray-400 font-mono">Alternative: +1 (800) 555-DEEN</p>
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#FAF9F6]/10 flex flex-col sm:flex-row justify-between text-[11px] font-mono text-[#FAF4F2]/60 gap-4">
          <p>© {new Date().getFullYear()} QALBIYA Islamic Institute. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5 hover:text-[#B0863A] transition-colors cursor-help" title="Traditional structured study in a loud world">
            <Heart className="w-3 h-3 text-[#B98072] fill-[#B98072]" />
            <span>Nourishing hearts with pristine knowledge.</span>
          </p>
        </div>
      </footer>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          formDetails={activeFormDetails[selectedCourse.id] || null}
          onClose={() => setSelectedCourse(null)}
          user={user}
          handleLogin={handleLogin}
          onEnrollSuccess={handleEnrollSuccess}
          isEnrolled={userEnrollments.includes(selectedCourse.id)}
        />
      )}

      {/* Floating Vertical Contact & Social Bubble Row on Right Side */}
      {/* Desktop view: persistent list */}
      <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 flex-col gap-4.5 z-40" id="social-bubble-dock-desktop">
        {/* Email Bubble */}
        <a 
          href="mailto:qalbiyaislamicinstitute@gmail.com?subject=QALBIYA%20Islamic%20Institute%20Admissions%20Inquiry"
          className="w-12 h-12 bg-[#22301F] hover:bg-[#33453A] text-[#FAF4F2] rounded-full flex items-center justify-center shadow-xl border border-[#DDD5C3]/40 transition-all duration-300 hover:scale-110 hover:-translate-x-1 group relative cursor-pointer"
          id="bubble-email-desktop"
          title="Email Admissions Office"
        >
          <Mail className="w-5 h-5" />
          <span className="absolute right-14 bg-[#22301F] text-[#FAF4F2] text-[10px] uppercase tracking-wider font-mono font-medium px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-md border border-[#DDD5C3]/30">
            Email Admissions
          </span>
        </a>

        {/* Instagram Bubble */}
        <a 
          href="https://instagram.com/qalbiya_institute" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full flex items-center justify-center shadow-xl border border-white/20 transition-all duration-300 hover:scale-110 hover:-translate-x-1 group relative cursor-pointer"
          id="bubble-instagram-desktop"
          title="Follow Instagram"
        >
          <Instagram className="w-5 h-5" />
          <span className="absolute right-14 bg-[#DD2A7B] text-white text-[10px] uppercase tracking-wider font-mono font-medium px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-md border border-white/10">
            QALBIYA Islamic Institute Instagram
          </span>
        </a>

        {/* WhatsApp Bubble */}
        <a 
          href="https://wa.me/918145363290?text=Salam!%20I%20am%20interested%20in%20QALBIYA%20Islamic%20Institute%20admissions."
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-xl border border-white/20 transition-all duration-300 hover:scale-110 hover:-translate-x-1 group relative cursor-pointer"
          id="bubble-whatsapp-desktop"
          title="WhatsApp Admissions Chat"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="absolute right-14 bg-[#25D366] text-white text-[10px] uppercase tracking-wider font-mono font-medium px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-md border border-white/10">
            WhatsApp Admissions
          </span>
        </a>
      </div>

      {/* Mobile view: Collapsed 'Contact Us' single expandable button */}
      <div className="md:hidden fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5" id="social-bubble-dock-mobile">
        {isMobileContactOpen && (
          <div className="flex flex-col gap-2.5 items-center animate-fade-in mb-1" id="mobile-social-options">
            {/* WhatsApp option */}
            <a 
              href="https://wa.me/918145363290?text=Salam!%20I%20am%20interested%20in%20QALBIYA%20Islamic%20Institute%20admissions."
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl border border-white/20 cursor-pointer"
              title="WhatsApp Admissions Chat"
              onClick={() => setIsMobileContactOpen(false)}
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            {/* Instagram option */}
            <a 
              href="https://instagram.com/qalbiya_institute" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full flex items-center justify-center shadow-xl border border-white/20 cursor-pointer"
              title="Follow Instagram"
              onClick={() => setIsMobileContactOpen(false)}
            >
              <Instagram className="w-5 h-5" />
            </a>

            {/* Email option */}
            <a 
              href="mailto:qalbiyaislamicinstitute@gmail.com?subject=QALBIYA%20Islamic%20Institute%20Admissions%20Inquiry"
              className="w-10 h-10 bg-[#22301F] text-[#FAF4F2] rounded-full flex items-center justify-center shadow-xl border border-[#DDD5C3]/40 cursor-pointer"
              title="Email Admissions Office"
              onClick={() => setIsMobileContactOpen(false)}
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Collapsed main trigger button */}
        <button
          onClick={() => setIsMobileContactOpen(!isMobileContactOpen)}
          className="w-12 h-12 bg-[#22301F] text-white rounded-full flex items-center justify-center shadow-2xl border border-[#DDD5C3]/50 cursor-pointer hover:bg-[#33453A] transition-all duration-300 relative"
          title="Contact Us"
        >
          {isMobileContactOpen ? (
            <ChevronUp className="w-5 h-5 rotate-180 transition-transform duration-300" />
          ) : (
            <PhoneCall className="w-5 h-5 animate-bounce" />
          )}
          {/* Subtle notification indicator dot */}
          {!isMobileContactOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Cloud Function Automated Email Trigger Notification Toast */}
      {notification.show && (
        <div 
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border border-[#DDD5C3] rounded-2xl shadow-2xl p-5 border-l-4 border-l-[#8CA394] animate-in slide-in-from-bottom duration-300"
          id="cloud-function-notification"
        >
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8CA394]/10 flex items-center justify-center text-[#8CA394] shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h5 className="font-serif text-xs font-bold text-[#22301F] uppercase tracking-wider flex items-center gap-1.5">
                <span>{notification.title}</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              </h5>
              <p className="text-[11px] text-[#5B5648] font-light leading-relaxed">
                {notification.message}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[8px] font-mono uppercase bg-[#8CA394]/20 text-[#33453A] px-1.5 py-0.5 rounded font-bold">
                  Status: Sent
                </span>
                <span className="text-[8px] font-mono text-gray-400">
                  via onEnrollmentTrigger()
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
