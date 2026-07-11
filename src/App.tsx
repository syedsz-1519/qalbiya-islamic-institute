import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { 
  initAuth, 
  googleSignIn, 
  googleLogout, 
  getUserRole, 
  db, 
  enrollInCourse,
  getUserProfile,
  toggleBookmarkInDb,
  updateCourseProgressInDb,
  updateUserProfileInDb,
  saveTriggeredEmail,
  enforceAdminAccess,
  submitContactForm,
  logWhatsAppInquiry
} from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Course } from "./types";
import { COURSES } from "./data/courses";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CourseCard } from "./components/CourseCard";
import { CourseDetailsModal } from "./components/CourseDetailsModal";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { StudentPortal } from "./components/StudentPortal";
import { CourseFAQ } from "./components/CourseFAQ";
import { AuthModal } from "./components/AuthModal";
import { BookOpen, MapPin, Mail, Phone, Heart, Globe, Award, HelpCircle, Instagram, MessageCircle, Sparkles, ShieldAlert, PhoneCall, MessageSquare, ChevronUp } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
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

  // 1. Listen to Firebase Auth on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      async (loggedInUser, token) => {
        setUser(loggedInUser);
        (window as any).__googleAccessToken = token;
        
        // Fetch role
        const role = await getUserRole(loggedInUser.uid);
        setUserRole(role);

        // Fetch user enrollments and bookmarks from profile
        const profile = await getUserProfile(loggedInUser.uid);
        if (profile) {
          if (profile.enrollments) {
            const courseIds = profile.enrollments.map((e: any) => e.courseId);
            setUserEnrollments(courseIds);
          } else {
            setUserEnrollments([]);
          }
          setUserBookmarks(profile.bookmarks || []);
          setUserProgress(profile.progress || {});
          setProfileDetails({
            bio: profile.bio || "",
            studyBackground: profile.studyBackground || "",
            ageGroup: profile.ageGroup || "",
            goals: profile.goals || ""
          });
        }
        setLoading(false);
      },
      () => {
        setUser(null);
        setUserRole("student");
        (window as any).__googleAccessToken = null;
        setUserEnrollments([]);
        setUserBookmarks([]);
        setUserProgress({});
        setProfileDetails({
          bio: "",
          studyBackground: "",
          ageGroup: "",
          goals: ""
        });
        setLoading(false);
      }
    );

    // Fetch initial course forms from Firestore
    fetchCourseForms();

    return () => unsubscribe();
  }, []);

  // 2. Enforce strict isolation for Admin tab and redirect unauthorized students to Student Portal
  useEffect(() => {
    if (currentTab === "analytics") {
      enforceAdminAccess(user ? user.uid : null, (targetTab) => {
        setCurrentTab(targetTab);
      });
    }
  }, [currentTab, user, userRole]);

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
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = async (loggedInUser: User, role: "admin" | "student", profile: any) => {
    setUser(loggedInUser);
    setUserRole(role);
    (window as any).__googleAccessToken = (loggedInUser as any).accessToken || "email-auth";

    if (profile) {
      if (profile.enrollments) {
        setUserEnrollments(profile.enrollments.map((e: any) => e.courseId));
      } else {
        setUserEnrollments([]);
      }
      setUserBookmarks(profile.bookmarks || []);
      setUserProgress(profile.progress || {});
      setProfileDetails({
        bio: profile.bio || "",
        studyBackground: profile.studyBackground || "",
        ageGroup: profile.ageGroup || "",
        goals: profile.goals || ""
      });
    } else {
      setUserEnrollments([]);
      setUserBookmarks([]);
      setUserProgress({});
      setProfileDetails({
        bio: "",
        studyBackground: "",
        ageGroup: "",
        goals: ""
      });
    }

    // Keep them on current view or dashboard
    if (role === "admin") {
      setCurrentTab("analytics");
    } else {
      setCurrentTab("portal");
    }
  };

  const handleBookmarkToggle = async (courseId: string) => {
    if (!user) {
      handleLogin();
      return;
    }
    const isBookmarkedNow = userBookmarks.includes(courseId);
    try {
      const updated = await toggleBookmarkInDb(user.uid, courseId, !isBookmarkedNow);
      setUserBookmarks(updated);
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  const handleLogout = async () => {
    try {
      await googleLogout();
      setUser(null);
      setUserRole("student");
      (window as any).__googleAccessToken = null;
      setUserEnrollments([]);
      setUserBookmarks([]);
      setUserProgress({});
      setProfileDetails({
        bio: "",
        studyBackground: "",
        ageGroup: "",
        goals: ""
      });
      setCurrentTab("home");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleEnrollSuccess = async (courseId: string) => {
    if (!user) return;
    try {
      await enrollInCourse(user.uid, courseId);
      setUserEnrollments(prev => {
        if (!prev.includes(courseId)) {
          return [...prev, courseId];
        }
        return prev;
      });

      // Find course details
      const course = COURSES.find(c => c.id === courseId);
      if (course) {
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
              // Save generated welcome email to triggered_emails collection in Firestore
              await saveTriggeredEmail({
                studentUid: user.uid,
                studentName: user.displayName || "Respected Student",
                studentEmail: user.email || "",
                courseId: course.id,
                courseTitle: course.title,
                subject: result.subject,
                emailBody: result.emailBody
              });
              
              // Trigger visual notification toast
              setNotification({
                show: true,
                title: "Cloud Function Triggered",
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
    } catch (err) {
      console.error("Failed to persist enrollment", err);
    }
  };

  const handleUpdateProgress = async (courseId: string, completedIndices: number[]) => {
    if (!user) return;
    try {
      const updatedProgress = await updateCourseProgressInDb(user.uid, courseId, completedIndices);
      setUserProgress(updatedProgress);
    } catch (err) {
      console.error("Failed to update progress in db", err);
    }
  };

  const handleUpdateProfile = async (details: { displayName: string; bio: string; studyBackground: string; ageGroup: string; goals: string }) => {
    if (!user) return;
    try {
      await updateUserProfileInDb(user.uid, details);
      setProfileDetails({
        bio: details.bio,
        studyBackground: details.studyBackground,
        ageGroup: details.ageGroup,
        goals: details.goals
      });
    } catch (err) {
      console.error("Failed to update profile details", err);
    }
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
      const text = encodeURIComponent(`Assalamu alaikum! I am ${waName}. I am interested in Qalbiya Islamic Institute's programs. ${waMessage ? `Inquiry: ${waMessage}` : ""}`);
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

  // Filter courses by tab
  const womenCourses = COURSES.filter(c => c.category === "women");
  const kidsCourses = COURSES.filter(c => c.category === "kids");

  return (
    <div className="min-h-screen bg-[#FFDFE4] text-[#22301F] flex flex-col justify-between relative overflow-hidden">
      
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
        user={user}
        userRole={userRole}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentTab === "home" && (
          <div className="space-y-12">
            <Hero onChoosePath={(path) => setCurrentTab(path)} />

            {/* Featured Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                  {COURSES.filter(c => c.flagship).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      formDetails={activeFormDetails[course.id] || null}
                      onExplore={(c) => setSelectedCourse(c)}
                      user={user}
                      isBookmarked={userBookmarks.includes(course.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                      isEnrolled={userEnrollments.includes(course.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Admissions Inquiry & WhatsApp Desk Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#DDD5C3]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Direct WhatsApp Connection & Office Details */}
                <div className="lg:col-span-5 space-y-8 text-left">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold block">
                      Direct Support Channels
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">
                      Connect with our Advisors
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
                      Have specific questions about our curricula, age criteria, or textbook requirements? Submit an inquiry form or immediately connect with our admissions desk on WhatsApp.
                    </p>
                  </div>

                  {/* Quick WhatsApp Log Form */}
                  <div className="bg-[#25D366]/5 border border-[#25D366]/30 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#20ba59] flex items-center justify-center">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#22301F]">WhatsApp Live Inquiry</h4>
                        <p className="text-[10px] text-[#5B5648] font-light">Fast-track response from our registrars</p>
                      </div>
                    </div>

                    <form onSubmit={handleWhatsAppQuickLog} className="space-y-3">
                      <div>
                        <input
                          id="wa-input-name"
                          type="text"
                          required
                          value={waName}
                          onChange={(e) => setWaName(e.target.value)}
                          placeholder="Your Name *"
                          className="w-full bg-[#FBF8F1] border border-[#DDD5C3]/80 rounded-xl px-3.5 py-2 text-xs font-sans placeholder-[#5B5648]/40 focus:outline-none focus:border-[#25D366]/60 transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          id="wa-input-phone"
                          type="tel"
                          value={waPhone}
                          onChange={(e) => setWaPhone(e.target.value)}
                          placeholder="WhatsApp Phone (Optional)"
                          className="w-full bg-[#FBF8F1] border border-[#DDD5C3]/80 rounded-xl px-3.5 py-2 text-xs font-sans placeholder-[#5B5648]/40 focus:outline-none focus:border-[#25D366]/60 transition-colors"
                        />
                      </div>
                      <div>
                        <textarea
                          id="wa-input-message"
                          value={waMessage}
                          onChange={(e) => setWaMessage(e.target.value)}
                          placeholder="What would you like to ask? (Optional)"
                          rows={2}
                          className="w-full bg-[#FBF8F1] border border-[#DDD5C3]/80 rounded-xl px-3.5 py-2 text-xs font-sans placeholder-[#5B5648]/40 focus:outline-none focus:border-[#25D366]/60 transition-colors resize-none"
                        />
                      </div>
                      <button
                        id="btn-submit-wa-inquiry"
                        type="submit"
                        disabled={isLoggingWA}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white disabled:bg-[#DDD5C3] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all hover:scale-[1.01] shadow-sm"
                      >
                        {isLoggingWA ? (
                          <span>Logging Inquiry...</span>
                        ) : (
                          <>
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Start WhatsApp Chat</span>
                          </>
                        )}
                      </button>
                    </form>

                    {waSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-3 text-center text-[11px] text-emerald-800 font-medium">
                        ✓ Inquiry logged! Redirecting to WhatsApp...
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Admissions Inquiry Email Form */}
                <div className="lg:col-span-7 bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6 text-left">
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
                        Assalamu alaikum! Thank you for reaching out to Qalbiya Islamic Institute. Your inquiry has been routed to our staff messaging dashboard, and an advisor will contact you soon.
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
                          <option value="Women's Intake">Women's Cohort Hub</option>
                          <option value="Kids' Intake">Kids' Studies Hub</option>
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
                          placeholder="Assalamu alaikum, I would like to inquire about..."
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
            </div>
          </div>
        )}

        {currentTab === "women" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            
            {/* Header Block */}
            <div className="border-b border-[#DDD5C3] pb-8 space-y-3 text-center md:text-left">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5A4D] font-bold">
                Women Cources Hub
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F]">
                Traditional Sciences. Modern Structures.
              </h2>
              <p className="text-[#5B5648] text-sm md:text-base font-light max-w-2xl leading-relaxed">
                Empowering adult Muslim women with robust, systematic knowledge. Study Fiqh, Aqeedah, 
                Seerah, and Tajweed with specialized, certified female instructors in a structured cohort format.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {womenCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  formDetails={activeFormDetails[course.id] || null}
                  onExplore={(c) => setSelectedCourse(c)}
                  user={user}
                  isBookmarked={userBookmarks.includes(course.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                  isEnrolled={userEnrollments.includes(course.id)}
                />
              ))}
            </div>
          </div>
        )}

        {currentTab === "kids" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            
            {/* Header Block */}
            <div className="border-b border-[#DDD5C3] pb-8 space-y-3 text-center md:text-left">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold">
                Kids Cources Hub
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F]">
                Instilling Love. Building Identity.
              </h2>
              <p className="text-[#5B5648] text-sm md:text-base font-light max-w-2xl leading-relaxed">
                Nurturing young souls using modern, visual, and highly encouraging pedagogies. 
                Our short, engaging classes ensure children look forward to learning the beauty of faith.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {kidsCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  formDetails={activeFormDetails[course.id] || null}
                  onExplore={(c) => setSelectedCourse(c)}
                  user={user}
                  isBookmarked={userBookmarks.includes(course.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                  isEnrolled={userEnrollments.includes(course.id)}
                />
              ))}
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
                About Qalbiya Islamic Institute
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
                mentors. We founded Qalbiya Islamic Institute to solve this problem.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 my-6 border-y border-[#DDD5C3]">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-[#22301F]">Semesters & Cohorts</h4>
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

        {currentTab === "portal" && (
          <StudentPortal
            user={user}
            userRole={userRole}
            handleLogin={handleLogin}
            courses={COURSES}
            userEnrollments={userEnrollments}
            userBookmarks={userBookmarks}
            userProgress={userProgress}
            profileDetails={profileDetails}
            onToggleBookmark={handleBookmarkToggle}
            onUpdateProgress={handleUpdateProgress}
            onUpdateProfile={handleUpdateProfile}
            onExploreCourse={(course) => setSelectedCourse(course)}
          />
        )}

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
      </main>

      {/* Footer */}
      <footer className="bg-[#22301F] text-[#FCF1F3]/85 py-16 border-t border-[#DDD5C3] relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] stitched-line opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Logo Brand column */}
          <div className="space-y-4">
            <h4 className="font-serif text-xl tracking-[0.2em] font-bold text-white uppercase">
              Qalbiya
            </h4>
            <p className="font-sans text-xs text-[#FCF1F3]/70 font-light leading-relaxed max-w-xs">
              A premium, traditional cohort learning institute for modern families. Restoring true 
              intellectual focus and faith foundations.
            </p>
          </div>

          {/* Quick links Column */}
          <div className="space-y-4 font-sans text-xs">
            <h5 className="font-serif font-bold uppercase tracking-wider text-[#B0863A]">Admissions</h5>
            <div className="flex flex-col space-y-2">
              <button onClick={() => setCurrentTab("women")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Women Cources Hub</button>
              <button onClick={() => setCurrentTab("kids")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Kids Cources Hub</button>
              <button onClick={() => setCurrentTab("about")} className="text-left hover:text-[#B0863A] transition-colors cursor-pointer">Founders & Vision</button>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4 font-sans text-xs">
            <h5 className="font-serif font-bold uppercase tracking-wider text-[#B0863A]">Admissions Office</h5>
            <div className="space-y-2 font-light text-[#FCF1F3]/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8CA394]" />
                <span>Virtual Cohorts Worldwide</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#8CA394]" />
                <span>qalbiyaislamicinstitute@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#8CA394]" />
                <span>+1 (800) 555-DEEN</span>
              </p>
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#FAF9F6]/10 flex flex-col sm:flex-row justify-between text-[11px] font-mono text-[#FCF1F3]/60 gap-4">
          <p>© {new Date().getFullYear()} Qalbiya Islamic Institute. All Rights Reserved.</p>
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Floating Vertical Contact & Social Bubble Row on Right Side */}
      {/* Desktop view: persistent list */}
      <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 flex-col gap-4.5 z-40" id="social-bubble-dock-desktop">
        {/* Email Bubble */}
        <a 
          href="mailto:qalbiyaislamicinstitute@gmail.com?subject=Qalbiya%20Admissions%20Inquiry"
          className="w-12 h-12 bg-[#22301F] hover:bg-[#33453A] text-[#FCF1F3] rounded-full flex items-center justify-center shadow-xl border border-[#DDD5C3]/40 transition-all duration-300 hover:scale-110 hover:-translate-x-1 group relative cursor-pointer"
          id="bubble-email-desktop"
          title="Email Admissions Office"
        >
          <Mail className="w-5 h-5" />
          <span className="absolute right-14 bg-[#22301F] text-[#FCF1F3] text-[10px] uppercase tracking-wider font-mono font-medium px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-md border border-[#DDD5C3]/30">
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
            Qalbiya Instagram
          </span>
        </a>

        {/* WhatsApp Bubble */}
        <a 
          href="https://wa.me/918145363290?text=Salam!%20I%20am%20interested%20in%20Qalbiya%20Islamic%20Institute%20admissions."
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
              href="https://wa.me/918145363290?text=Salam!%20I%20am%20interested%20in%20Qalbiya%20Islamic%20Institute%20admissions."
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
              href="mailto:qalbiyaislamicinstitute@gmail.com?subject=Qalbiya%20Admissions%20Inquiry"
              className="w-10 h-10 bg-[#22301F] text-[#FCF1F3] rounded-full flex items-center justify-center shadow-xl border border-[#DDD5C3]/40 cursor-pointer"
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
