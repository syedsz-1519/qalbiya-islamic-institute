import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { Course } from "../types";
import { getTriggeredEmails, submitTestimonial } from "../lib/firebase";
import { 
  User as UserIcon, 
  Bookmark, 
  CheckSquare, 
  Award, 
  Sparkles, 
  Save, 
  ExternalLink, 
  BookOpen, 
  Check, 
  RotateCcw, 
  ChevronRight, 
  Mail, 
  Calendar,
  Phone,
  ArrowRight,
  Download,
  X,
  FileText,
  MessageSquare,
  Star
} from "lucide-react";

interface StudentPortalProps {
  user: User | null;
  userRole: "admin" | "student";
  handleLogin: () => void;
  courses: Course[];
  userEnrollments: string[];
  userBookmarks: string[];
  userProgress: Record<string, number[]>;
  profileDetails: {
    bio: string;
    studyBackground: string;
    ageGroup: string;
    goals: string;
  };
  onToggleBookmark: (courseId: string) => Promise<void>;
  onUpdateProgress: (courseId: string, completedIndices: number[]) => Promise<void>;
  onUpdateProfile: (details: { displayName: string; bio: string; studyBackground: string; ageGroup: string; goals: string }) => Promise<void>;
  onExploreCourse: (course: Course) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  user,
  userRole,
  handleLogin,
  courses,
  userEnrollments,
  userBookmarks,
  userProgress,
  profileDetails,
  onToggleBookmark,
  onUpdateProgress,
  onUpdateProfile,
  onExploreCourse
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"progress" | "bookmarks" | "profile" | "emails">("progress");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [studyBackground, setStudyBackground] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [goals, setGoals] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Email simulation states
  const [emails, setEmails] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [selectedViewerEmail, setSelectedViewerEmail] = useState<any | null>(null);

  // Fetch emails when user changes or activeSubTab changes
  useEffect(() => {
    if (user) {
      setLoadingEmails(true);
      getTriggeredEmails(user.uid)
        .then((data) => {
          setEmails(data);
        })
        .catch((err) => {
          console.error("Failed to load emails", err);
        })
        .finally(() => {
          setLoadingEmails(false);
        });
    }
  }, [user, activeSubTab]);

  // For showing printable certificate overlay
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);

  // Testimonial submission states
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [selectedTestimonialCourse, setSelectedTestimonialCourse] = useState<Course | null>(null);
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialContent, setTestimonialContent] = useState("");
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);
  const [testimonialSuccess, setTestimonialSuccess] = useState(false);

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestimonialCourse || !user) return;
    setIsSubmittingTestimonial(true);
    setTestimonialSuccess(false);
    try {
      await submitTestimonial({
        studentUid: user.uid,
        studentName: user.displayName || "Respected Student",
        studentEmail: user.email || "",
        courseId: selectedTestimonialCourse.id,
        courseTitle: selectedTestimonialCourse.title,
        rating: testimonialRating,
        content: testimonialContent
      });
      setTestimonialSuccess(true);
      setTestimonialContent("");
      setTestimonialRating(5);
      // Wait for completion animation before closing
      setTimeout(() => {
        setShowTestimonialModal(false);
        setTestimonialSuccess(false);
        setSelectedTestimonialCourse(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit testimonial", err);
    } finally {
      setIsSubmittingTestimonial(false);
    }
  };

  // Sync state with profileDetails prop
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
    setBio(profileDetails.bio || "");
    setStudyBackground(profileDetails.studyBackground || "");
    setAgeGroup(profileDetails.ageGroup || "");
    setGoals(profileDetails.goals || "");
  }, [profileDetails, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateProfile({
        displayName,
        bio,
        studyBackground,
        ageGroup,
        goals
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTopic = async (courseId: string, topicIdx: number) => {
    const currentCompleted = userProgress[courseId] || [];
    let updated: number[];
    if (currentCompleted.includes(topicIdx)) {
      updated = currentCompleted.filter(i => i !== topicIdx);
    } else {
      updated = [...currentCompleted, topicIdx];
    }
    await onUpdateProgress(courseId, updated);
  };

  // Filter lists
  const enrolledCourses = courses.filter(c => userEnrollments.includes(c.id));
  const bookmarkedCourses = courses.filter(c => userBookmarks.includes(c.id));

  // If user is not authenticated
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-8" id="portal-unauth-container">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22301F]/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[#8CA394] border border-[#DDD5C3]/40">
          <UserIcon className="w-3.5 h-3.5 text-[#B0863A]" />
          <span>Student Sanctuary Portal</span>
        </div>

        <div className="space-y-4 max-w-xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F]" id="portal-unauth-title">
            Your Personal Study Path
          </h2>
          <p className="font-sans text-[#5B5648] text-sm md:text-base font-light leading-relaxed">
            Welcome to the Qalbiya Student Sanctuary. Sign in to your account to manage your profile, 
            track your completion progress on weekly syllabi outlines, and bookmark programs you wish 
            to join in upcoming semesters.
          </p>
        </div>

        <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-8 md:p-12 max-w-lg mx-auto shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#22301F]">Sign In to Your Workspace</h3>
          <p className="text-xs text-[#5B5648] font-light max-w-sm mx-auto">
            We support secure, direct authentication. No tedious password setups are needed. Sign in safely with Google to retrieve your student credentials instantly.
          </p>
          <div className="flex justify-center pt-2">
            <button
              id="btn-google-sign-in-portal"
              onClick={handleLogin}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border border-[#DDD5C3] hover:border-[#8CA394] text-[#2B2A25] font-sans text-xs font-semibold rounded-full transition-all duration-300 shadow-sm cursor-pointer hover:scale-[1.02]"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>Authenticate with Google</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12" id="student-portal-root">
      
      {/* Student Welcome Header Banner */}
      <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Award className="w-48 h-48 text-[#22301F]" />
        </div>

        <div className="flex items-center gap-5 relative z-10">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "Student"}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#8CA394] shadow-md shrink-0"
              id="portal-profile-avatar"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EDE3CE] flex items-center justify-center font-serif text-3xl text-[#22301F] border-2 border-[#8CA394] shrink-0">
              {user.displayName?.[0] || "S"}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#22301F]" id="portal-greeting">
                Salam, {user.displayName || "Student"}
              </h2>
              <span className="px-2.5 py-0.5 bg-[#F1E2DC] text-[#8A5A4D] border border-[#DDD5C3]/40 rounded-full text-[10px] uppercase font-bold tracking-wider">
                {userRole} Member
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#5B5648] font-light max-w-md">
              {bio ? bio : "Welcome to your sacred learning dashboard. Track your deen study targets and manage your credentials below."}
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-[#8CA394]">
              <Mail className="w-3 h-3 text-[#B98072]" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Widget */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#DDD5C3] pt-6 md:pt-0 md:pl-10 shrink-0 relative z-10">
          <div className="text-center md:text-left space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394]">Enrolled</span>
            <p className="font-serif text-2xl font-bold text-[#22301F]">{enrolledCourses.length}</p>
          </div>
          <div className="text-center md:text-left space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394]">Bookmarks</span>
            <p className="font-serif text-2xl font-bold text-[#22301F]">{userBookmarks.length}</p>
          </div>
          <div className="text-center md:text-left space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394]">Pillars Done</span>
            <p className="font-serif text-2xl font-bold text-[#22301F]">
              {Object.values(userProgress).flat().length}
            </p>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-[#DDD5C3]/80 gap-6 sm:gap-10">
        <button
          id="tab-btn-progress"
          onClick={() => setActiveSubTab("progress")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all relative cursor-pointer ${
            activeSubTab === "progress" ? "text-[#22301F]" : "text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4" />
            <span>Syllabus Progress ({enrolledCourses.length})</span>
          </div>
          {activeSubTab === "progress" && (
            <motion.div layoutId="subtab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B98072]" />
          )}
        </button>

        <button
          id="tab-btn-bookmarks"
          onClick={() => setActiveSubTab("bookmarks")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all relative cursor-pointer ${
            activeSubTab === "bookmarks" ? "text-[#22301F]" : "text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4" />
            <span>Bookmarks ({bookmarkedCourses.length})</span>
          </div>
          {activeSubTab === "bookmarks" && (
            <motion.div layoutId="subtab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B98072]" />
          )}
        </button>

        <button
          id="tab-btn-profile"
          onClick={() => setActiveSubTab("profile")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all relative cursor-pointer ${
            activeSubTab === "profile" ? "text-[#22301F]" : "text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-4 h-4" />
            <span>Profile Settings</span>
          </div>
          {activeSubTab === "profile" && (
            <motion.div layoutId="subtab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B98072]" />
          )}
        </button>

        <button
          id="tab-btn-emails"
          onClick={() => setActiveSubTab("emails")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all relative cursor-pointer ${
            activeSubTab === "emails" ? "text-[#22301F]" : "text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            <span>Admissions Inbox ({emails.length})</span>
          </div>
          {activeSubTab === "emails" && (
            <motion.div layoutId="subtab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B98072]" />
          )}
        </button>
      </div>

      {/* Render dynamic subviews */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          
          {/* Progress tab view */}
          {activeSubTab === "progress" && (
            <motion.div
              key="progress-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="portal-progress-view"
            >
              {enrolledCourses.length === 0 ? (
                <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[24px] p-10 text-center space-y-5 max-w-2xl mx-auto">
                  <BookOpen className="w-12 h-12 text-[#8CA394] mx-auto opacity-60" />
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg font-bold text-[#22301F]">No active course enrollments</h4>
                    <p className="text-xs text-[#5B5648] font-light max-w-md mx-auto leading-relaxed">
                      You haven't registered or submitted an intake form for any courses yet. Once you register using an intake form, your dynamic syllabus list will automatically appear here so you can trace your weekly studies.
                    </p>
                  </div>
                  <p className="text-[10px] font-mono text-[#8CA394] uppercase tracking-wider">
                    Browse our flagship courses &bull; enrollment forms are open
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {enrolledCourses.map((course) => {
                    const completedIndices = userProgress[course.id] || [];
                    const percentComplete = Math.round((completedIndices.length / course.outline.length) * 100);
                    const isAllDone = percentComplete === 100;

                    return (
                      <div 
                        key={course.id}
                        id={`progress-card-${course.id}`}
                        className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all space-y-6 relative overflow-hidden"
                      >
                        {isAllDone && (
                          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#B0863A]/10 rounded-full rotate-45 flex items-end justify-center pb-3">
                            <Award className="w-5 h-5 text-[#B0863A]" title="100% Completed!" />
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A5A4D]">
                                {course.category === "women" ? "Women's Academy" : "Kids' Program"}
                              </span>
                              <h4 className="font-serif text-lg sm:text-xl font-bold text-[#22301F]">
                                {course.title}
                              </h4>
                            </div>
                            <button
                              id={`btn-bookmark-toggle-${course.id}`}
                              onClick={() => onToggleBookmark(course.id)}
                              className="p-1.5 hover:bg-[#EDE3CE] rounded-full transition-colors cursor-pointer text-[#8CA394] hover:text-[#B98072]"
                              title={userBookmarks.includes(course.id) ? "Remove Bookmark" : "Add Bookmark"}
                            >
                              <Bookmark className={`w-4 h-4 ${userBookmarks.includes(course.id) ? "fill-[#B98072] text-[#B98072]" : ""}`} />
                            </button>
                          </div>

                          <div className="space-y-1 text-xs text-[#5B5648] font-light">
                            <p>Instructor: <span className="font-semibold text-[#22301F]">{course.instructor}</span></p>
                            <p>Schedule: <span>{course.schedule}</span></p>
                          </div>

                          {/* Dynamic Progress Bar */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono text-[10px] text-[#8CA394]">Syllabus Completion</span>
                              <span className="font-bold text-[#22301F]">{percentComplete}%</span>
                            </div>
                            <div className="w-full bg-[#EDE3CE]/60 h-2 rounded-full overflow-hidden border border-[#DDD5C3]/40">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentComplete}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-full rounded-full ${isAllDone ? "bg-[#B0863A]" : "bg-[#8CA394]"}`}
                              />
                            </div>
                          </div>

                          {/* Certificate Celebration Badge */}
                          {isAllDone && (
                            <div className="bg-[#B0863A]/10 border border-[#B0863A]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                              <div className="flex items-center gap-2.5">
                                <Award className="w-5 h-5 text-[#B0863A] shrink-0" />
                                <div className="text-center sm:text-left">
                                  <p className="text-xs font-bold text-[#22301F]">Syllabus Complete!</p>
                                  <p className="text-[10px] text-[#5B5648] font-light">Your certification has been compiled.</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                <button
                                  id={`btn-view-cert-${course.id}`}
                                  onClick={() => setCertificateCourse(course)}
                                  className="inline-flex items-center gap-1 bg-[#B0863A] hover:bg-[#87652A] text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.03] shrink-0"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>Certificate</span>
                                </button>
                                <button
                                  id={`btn-write-testimonial-${course.id}`}
                                  onClick={() => {
                                    setSelectedTestimonialCourse(course);
                                    setTestimonialRating(5);
                                    setTestimonialContent("");
                                    setShowTestimonialModal(true);
                                  }}
                                  className="inline-flex items-center gap-1 bg-[#22301F] hover:bg-[#33453A] text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.03] shrink-0"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Share Review</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Checklist of Syllabus Topics */}
                          <div className="pt-4 border-t border-[#DDD5C3]/40 space-y-3">
                            <h5 className="font-serif font-bold text-xs text-[#22301F] uppercase tracking-wide">
                              Syllabus Weekly Milestones
                            </h5>
                            <div className="space-y-2">
                              {course.outline.map((topic, topicIdx) => {
                                const isTopicDone = completedIndices.includes(topicIdx);
                                return (
                                  <label
                                    key={topicIdx}
                                    id={`label-topic-${course.id}-${topicIdx}`}
                                    className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isTopicDone 
                                        ? "bg-white border-[#8CA394]/40 text-[#22301F] font-medium shadow-sm" 
                                        : "bg-[#FBF8F1]/40 border-[#DDD5C3]/30 hover:border-[#DDD5C3] text-[#5B5648] font-light"
                                    }`}
                                  >
                                    <input
                                      id={`checkbox-topic-${course.id}-${topicIdx}`}
                                      type="checkbox"
                                      checked={isTopicDone}
                                      onChange={() => handleToggleTopic(course.id, topicIdx)}
                                      className="mt-0.5 w-4 h-4 text-[#8CA394] bg-[#FCF1F3] border-[#DDD5C3] rounded focus:ring-offset-0 focus:ring-0 cursor-pointer"
                                    />
                                    <span>{topic}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                        </div>

                        <div className="pt-4 flex justify-between items-center text-xs">
                          <button
                            id={`btn-explore-syllabus-${course.id}`}
                            onClick={() => onExploreCourse(course)}
                            className="text-[#22301F] hover:text-[#B98072] font-bold hover:underline transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Explore Full Syllabus Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Bookmarks tab view */}
          {activeSubTab === "bookmarks" && (
            <motion.div
              key="bookmarks-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
              id="portal-bookmarks-view"
            >
              {bookmarkedCourses.length === 0 ? (
                <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[24px] p-10 text-center space-y-4 max-w-2xl mx-auto">
                  <Bookmark className="w-10 h-10 text-[#8CA394] mx-auto opacity-50" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-bold text-[#22301F]">No programs bookmarked yet</h4>
                    <p className="text-xs text-[#5B5648] font-light max-w-md mx-auto">
                      Explore our curricula hubs for Muslim women and juniors, and save programs here by clicking the ribbon bookmarks.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedCourses.map((course) => (
                    <div 
                      key={course.id}
                      id={`bookmark-card-${course.id}`}
                      className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[24px] p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group"
                    >
                      <button
                        id={`btn-bookmark-remove-${course.id}`}
                        onClick={() => onToggleBookmark(course.id)}
                        className="absolute top-4 right-4 p-1 bg-white hover:bg-[#FCF1F3] border border-[#DDD5C3] rounded-full transition-colors cursor-pointer text-[#B98072]"
                        title="Remove Bookmark"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-3">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394]">
                          {course.category === "women" ? "Women's Academy" : "Kids' Hub"}
                        </span>
                        <h4 className="font-serif font-bold text-[#22301F] leading-tight group-hover:text-[#B98072] transition-colors">
                          {course.title}
                        </h4>
                        <p className="font-sans text-[#5B5648] text-xs leading-relaxed font-light line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[#DDD5C3]/40 flex items-center justify-between text-xs">
                        <span className="font-mono text-[10px] text-[#5B5648]/80">{course.duration}</span>
                        <button
                          id={`btn-bookmark-explore-${course.id}`}
                          onClick={() => onExploreCourse(course)}
                          className="inline-flex items-center gap-1 font-bold text-[#22301F] hover:text-[#B98072] hover:underline cursor-pointer"
                        >
                          <span>Explore Syllabus</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Profile tab view */}
          {activeSubTab === "profile" && (() => {
            const isBioComplete = bio.trim().length > 0;
            const isGoalsComplete = goals.trim().length > 0;
            const isBackgroundComplete = studyBackground.trim().length > 0;

            let strengthPoints = 0;
            if (isBioComplete) strengthPoints += 1;
            if (isGoalsComplete) strengthPoints += 1;
            if (isBackgroundComplete) strengthPoints += 1;

            const strengthPercentage = Math.round((strengthPoints / 3) * 100);

            return (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                id="portal-profile-view"
              >
                <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-10 max-w-3xl mx-auto shadow-sm">
                  <div className="border-b border-[#DDD5C3] pb-6 mb-8 space-y-1">
                    <h3 className="font-serif text-xl font-bold text-[#22301F]">Academic Student Profile</h3>
                    <p className="text-xs text-[#5B5648] font-light">
                      Update your learning bio and background below to help our female scholars customize the intake suggestions.
                    </p>
                  </div>

                  {/* Profile Strength & Badge Indicator */}
                  <div className="mb-8 p-6 bg-[#FCF1F3]/60 border border-[#DDD5C3]/60 rounded-2xl space-y-4 shadow-inner">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#22301F] flex items-center gap-2">
                          <span>Profile Strength Indicator</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            strengthPercentage === 100 ? "bg-[#B0863A]/20 text-[#87652A]" : "bg-[#8CA394]/20 text-[#33453A]"
                          }`}>
                            {strengthPercentage}% Complete
                          </span>
                        </h4>
                        <p className="text-[11px] text-[#5B5648] font-light max-w-md leading-relaxed">
                          {strengthPercentage === 100 
                            ? "Splendid! Your student profile is 100% complete. Your 'Honored Scholar' badge is active." 
                            : "Provide your Student Bio, Islamic Study Background, and Learning Goals below to unlock your reward badge."}
                        </p>
                      </div>

                      {/* Badge Reward UI */}
                      <div className="flex items-center gap-3 shrink-0 bg-white/40 border border-[#DDD5C3]/50 rounded-xl p-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                          strengthPercentage === 100 
                            ? "bg-[#B0863A] text-white shadow-md scale-110 rotate-12" 
                            : "bg-[#DDD5C3] text-[#5B5648]/40"
                        }`}>
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-[#22301F]">
                            {strengthPercentage === 100 ? "Honored Scholar" : "Badge Locked"}
                          </p>
                          <p className="text-[9px] text-[#5B5648]/70 font-mono">
                            {strengthPercentage === 100 ? "⭐ Verified Badge" : "Complete fields to earn"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-[#EDE3CE]/40 h-2.5 rounded-full overflow-hidden border border-[#DDD5C3]/30">
                        <motion.div 
                          className="bg-[#B98072] h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${strengthPercentage}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono text-[#5B5648]/60">
                        <div className={`flex items-center justify-center gap-1 py-1 rounded-md transition-colors ${isBioComplete ? "bg-green-50 text-[#22301F] font-bold border border-green-200/50" : "bg-gray-100"}`}>
                          <span>{isBioComplete ? "✓" : "○"}</span>
                          <span>Student Bio</span>
                        </div>
                        <div className={`flex items-center justify-center gap-1 py-1 rounded-md transition-colors ${isBackgroundComplete ? "bg-green-50 text-[#22301F] font-bold border border-green-200/50" : "bg-gray-100"}`}>
                          <span>{isBackgroundComplete ? "✓" : "○"}</span>
                          <span>Study Background</span>
                        </div>
                        <div className={`flex items-center justify-center gap-1 py-1 rounded-md transition-colors ${isGoalsComplete ? "bg-green-50 text-[#22301F] font-bold border border-green-200/50" : "bg-gray-100"}`}>
                          <span>{isGoalsComplete ? "✓" : "○"}</span>
                          <span>Learning Goals</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  {/* Two Column details row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label htmlFor="profile-displayName" className="block text-xs uppercase tracking-wider font-bold text-[#22301F]">
                        Display Name / Academic Name
                      </label>
                      <input
                        id="profile-displayName"
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-[#FCF1F3] border border-[#DDD5C3] focus:border-[#8CA394] rounded-xl px-4 py-2.5 text-xs text-[#2B2A25] focus:outline-none"
                        placeholder="e.g. Maryam Farooq"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="profile-ageGroup" className="block text-xs uppercase tracking-wider font-bold text-[#22301F]">
                        Cohort Age Group
                      </label>
                      <select
                        id="profile-ageGroup"
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className="w-full bg-[#FCF1F3] border border-[#DDD5C3] focus:border-[#8CA394] rounded-xl px-4 py-2.5 text-xs text-[#2B2A25] focus:outline-none cursor-pointer"
                      >
                        <option value="">Select Age Group</option>
                        <option value="Kids (5-10)">Kids (5-10)</option>
                        <option value="Juniors (7-12)">Juniors (7-12)</option>
                        <option value="Teens (13-19)">Teens (13-19)</option>
                        <option value="Adults (20+)">Adults (20+)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-bio" className="block text-xs uppercase tracking-wider font-bold text-[#22301F]">
                      Short Student Bio
                    </label>
                    <textarea
                      id="profile-bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-[#FCF1F3] border border-[#DDD5C3] focus:border-[#8CA394] rounded-xl px-4 py-3 text-xs text-[#2B2A25] focus:outline-none"
                      placeholder="Share a brief introduction about yourself..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-studyBackground" className="block text-xs uppercase tracking-wider font-bold text-[#22301F]">
                      Previous Deeniyat / Islamic Study Background
                    </label>
                    <textarea
                      id="profile-studyBackground"
                      rows={3}
                      value={studyBackground}
                      onChange={(e) => setStudyBackground(e.target.value)}
                      className="w-full bg-[#FCF1F3] border border-[#DDD5C3] focus:border-[#8CA394] rounded-xl px-4 py-3 text-xs text-[#2B2A25] focus:outline-none"
                      placeholder="e.g. Completed school Maktab, studied basic tajweed rules, or absolute beginner wishing to rebuild..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-goals" className="block text-xs uppercase tracking-wider font-bold text-[#22301F]">
                      Spiritual & Academic Learning Goals
                    </label>
                    <textarea
                      id="profile-goals"
                      rows={3}
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      className="w-full bg-[#FCF1F3] border border-[#DDD5C3] focus:border-[#8CA394] rounded-xl px-4 py-3 text-xs text-[#2B2A25] focus:outline-none"
                      placeholder="What are you hoping to achieve or master during this semester cohort?"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#DDD5C3]/40 flex items-center justify-between gap-4">
                    {saveSuccess && (
                      <span className="text-[#33453A] font-bold text-xs bg-[#8CA394]/15 border border-[#8CA394]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                        <Check className="w-3.5 h-3.5 text-[#8CA394]" />
                        <span>Profile Saved Successfully!</span>
                      </span>
                    )}
                    <span className="hidden sm:inline text-[11px] text-[#5B5648] font-light italic">
                      All details are stored securely in Firestore.
                    </span>

                    <button
                      id="btn-save-profile-settings"
                      type="submit"
                      disabled={isSaving}
                      className="ml-auto inline-flex items-center gap-2 bg-[#22301F] hover:bg-[#33453A] disabled:bg-[#DDD5C3] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-full transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed hover:scale-[1.02]"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          )})()}

          {/* Emails tab view */}
          {activeSubTab === "emails" && (
            <motion.div
              key="emails-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              id="portal-emails-view"
              className="space-y-6"
            >
              <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-10 max-w-4xl mx-auto shadow-sm">
                <div className="border-b border-[#DDD5C3] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-[#22301F]">Automated Admissions Inbox</h3>
                    <p className="text-xs text-[#5B5648] font-light">
                      Real-time log of automated "Welcome to the Course" emails triggered via our Firebase Cloud Functions emulation.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (user) {
                        setLoadingEmails(true);
                        getTriggeredEmails(user.uid).then(setEmails).finally(() => setLoadingEmails(false));
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[#22301F] hover:text-[#B98072] font-semibold border border-[#DDD5C3] hover:border-[#B98072]/40 rounded-full px-3.5 py-1.5 transition-all bg-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Refresh Inbox</span>
                  </button>
                </div>

                {loadingEmails ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#8CA394]/30 border-t-[#22301F] rounded-full animate-spin" />
                    <span className="text-xs text-[#5B5648] font-mono">Fetching automated emails...</span>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="py-16 text-center space-y-4 max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-full bg-[#8CA394]/10 flex items-center justify-center mx-auto text-[#8CA394]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold text-[#22301F]">Inbox is Empty</h4>
                      <p className="text-xs text-[#5B5648] font-light leading-relaxed">
                        No enrollment emails have been triggered yet. Once you enroll in any of our flagship programs, the simulated Firebase Cloud Function will trigger and deliver your personalized welcome email.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emails.map((email) => (
                      <div 
                        key={email.id} 
                        className="p-5 sm:p-6 bg-[#FCF1F3]/45 hover:bg-[#FCF1F3]/80 border border-[#DDD5C3]/70 hover:border-[#DDD5C3] rounded-2xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
                      >
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] font-mono uppercase bg-[#8CA394]/20 text-[#33453A] px-2.5 py-0.5 rounded-full font-bold">
                              {email.courseTitle}
                            </span>
                            <span className="text-[9px] font-mono text-[#5B5648]/60">
                              {new Date(email.triggeredAt).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-[#22301F]">
                            {email.subject}
                          </h4>
                          <p className="text-xs text-[#5B5648]/80 font-light truncate">
                            Sent to: {email.studentEmail}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedViewerEmail(email)}
                          className="inline-flex items-center gap-1.5 bg-[#22301F] hover:bg-[#33453A] text-white text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-full transition-all cursor-pointer whitespace-nowrap"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Full Email</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Welcome Email Full HTML Reader Modal */}
      <AnimatePresence>
        {selectedViewerEmail && (
          <div className="fixed inset-0 bg-[#22301F]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FCF1F3] border border-[#DDD5C3] rounded-[32px] shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden"
              id="email-viewer-modal"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#DDD5C3]/80 bg-[#FBF8F1] flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono uppercase bg-[#8CA394]/30 text-[#33453A] px-2 py-0.5 rounded font-bold">
                      Firebase Cloud Function Simulation
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      ID: {selectedViewerEmail.id}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#22301F]">
                    {selectedViewerEmail.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[#5B5648] font-light">
                    <p>From: <span className="font-medium text-[#22301F]">admissions@qalbiya.com</span></p>
                    <p>&bull;</p>
                    <p>To: <span className="font-medium text-[#22301F]">{(selectedViewerEmail.studentEmail)}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedViewerEmail(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full border border-[#DDD5C3] text-gray-500 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email Content Frame */}
              <div className="flex-grow bg-white p-4 overflow-hidden relative">
                <iframe
                  title="Welcome Email Content"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                          line-height: 1.6;
                          color: #2b2a25;
                          background-color: #fcf1f3;
                          margin: 0;
                          padding: 16px;
                        }
                        .email-container {
                          max-width: 600px;
                          margin: 0 auto;
                          background: #ffffff;
                          border-radius: 12px;
                          border: 1px solid #ddd5c3;
                          overflow: hidden;
                          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                        }
                        .email-inner {
                          padding: 24px;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="email-container">
                        <div class="email-inner">
                          ${selectedViewerEmail.emailBody}
                        </div>
                      </div>
                    </body>
                    </html>
                  `}
                  className="w-full h-full border-0 rounded-xl"
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#DDD5C3]/60 bg-[#FBF8F1] flex justify-between items-center text-xs text-[#5B5648]/80 shrink-0">
                <span className="font-mono text-[9px] uppercase">Status: DELIVERED</span>
                <span className="font-light">Triggered on {new Date(selectedViewerEmail.triggeredAt).toLocaleString()}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Certification Template Modal */}
      <AnimatePresence>
        {certificateCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2A25]/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FBF8F1] border-8 border-double border-[#B0863A] rounded-[36px] w-full max-w-3xl p-8 sm:p-12 relative shadow-2xl space-y-8 text-center"
              id="academic-completion-certificate-modal"
            >
              
              {/* Close Overlay */}
              <button
                id="btn-close-cert-overlay"
                onClick={() => setCertificateCourse(null)}
                className="absolute top-6 right-6 p-1.5 hover:bg-[#EDE3CE] rounded-full transition-colors text-[#5B5648] hover:text-[#2B2A25] cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Motif */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-[#F1E7D3] border border-[#B0863A] rounded-full flex items-center justify-center relative">
                    <Award className="w-10 h-10 text-[#B0863A]" />
                    <div className="absolute inset-2 border border-dashed border-[#B0863A] rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8CA394] font-bold">
                    Qalbiya Islamic Institute
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F] tracking-wide">
                    Certificate of Completion
                  </h2>
                </div>

                <div className="w-24 h-[1px] bg-[#B0863A] mx-auto" />

                <p className="font-sans font-light text-xs sm:text-sm text-[#5B5648] max-w-lg mx-auto leading-relaxed">
                  This is to academic verify that the dedicated student member
                </p>

                <p className="font-serif italic text-3xl font-bold text-[#B0863A] tracking-wider py-1 select-all">
                  {displayName || user.displayName || "Blessed Student"}
                </p>

                <p className="font-sans font-light text-xs sm:text-sm text-[#5B5648] max-w-lg mx-auto leading-relaxed">
                  has successfully completed the comprehensive, cohort syllabus outline, evaluations, and weekly modules of the flagship deeniyat curriculum for
                </p>

                <p className="font-serif text-xl sm:text-2xl font-bold text-[#22301F] tracking-tight">
                  {certificateCourse.title}
                </p>

                <p className="font-sans font-light text-xs text-[#5B5648] leading-relaxed">
                  Under the stewardship of certified female instructors &middot; <span className="font-medium text-[#22301F]">{certificateCourse.instructor}</span>
                </p>

                {/* Footnotes Stamps column */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#DDD5C3]/60 max-w-xl mx-auto">
                  <div className="text-center space-y-1">
                    <span className="font-serif italic text-sm text-[#22301F] block border-b border-[#DDD5C3] pb-1 font-bold">
                      {certificateCourse.instructor}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394]">Instructor</span>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="font-mono text-xs text-[#22301F] block border-b border-[#DDD5C3] pb-1 font-bold">
                      {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394]">Date of Completion</span>
                  </div>
                </div>

              </div>

              {/* Printable footer button action */}
              <div className="pt-4 flex justify-center gap-4">
                <button
                  id="btn-print-certificate"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 bg-[#22301F] hover:bg-[#33453A] text-white text-xs font-bold uppercase tracking-widest py-2.5 px-5 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Testimonial Submission Modal */}
      <AnimatePresence>
        {showTestimonialModal && selectedTestimonialCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2A25]/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FBF8F1] border-2 border-[#DDD5C3] rounded-[32px] w-full max-w-lg p-6 sm:p-8 relative shadow-2xl space-y-6"
              id="student-testimonial-submission-modal"
            >
              {/* Close Button */}
              <button
                id="btn-close-testimonial-overlay"
                onClick={() => setShowTestimonialModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-[#EDE3CE] rounded-full transition-colors text-[#5B5648] hover:text-[#2B2A25] cursor-pointer"
                title="Close"
                disabled={isSubmittingTestimonial}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#FCF1F3] rounded-full flex items-center justify-center mx-auto text-[#B98072]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#22301F]">
                  Submit Academic Testimonial
                </h3>
                <p className="text-xs text-[#5B5648] font-light max-w-sm mx-auto leading-relaxed">
                  Your review will assist and inspire new students in their sacred journey. Submissions are subject to administrator review.
                </p>
              </div>

              {testimonialSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#8CA394]/15 border border-[#8CA394]/40 rounded-2xl p-6 text-center space-y-3"
                >
                  <div className="w-10 h-10 bg-[#8CA394]/20 text-[#22301F] rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#22301F]">Testimonial Submitted!</h4>
                  <p className="text-xs text-[#5B5648] font-light">
                    JazakAllahu Khairan. Your testimonial has been successfully queued for administrative approval.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleTestimonialSubmit} className="space-y-5">
                  {/* Selected Course Display */}
                  <div className="p-3.5 bg-[#FCF1F3]/80 border border-[#DDD5C3]/40 rounded-xl">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A5A4D] block mb-1">
                      Enrolled Syllabus
                    </span>
                    <span className="font-serif font-bold text-[#22301F] text-xs">
                      {selectedTestimonialCourse.title}
                    </span>
                  </div>

                  {/* Star Rating Interactive Picker */}
                  <div className="space-y-1.5 text-center">
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#22301F]">
                      Your Academic Rating
                    </label>
                    <div className="flex items-center justify-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          id={`btn-rate-star-${star}`}
                          onClick={() => setTestimonialRating(star)}
                          className="p-1 hover:scale-115 transition-transform cursor-pointer"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= testimonialRating 
                                ? "text-[#B0863A] fill-[#B0863A]" 
                                : "text-gray-300 fill-transparent"
                            } transition-colors`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Written content */}
                  <div className="space-y-1.5">
                    <label htmlFor="testimonial-text" className="block text-xs uppercase tracking-wider font-bold text-[#22301F]">
                      Detailed Review / Reflection
                    </label>
                    <textarea
                      id="testimonial-text"
                      rows={4}
                      required
                      value={testimonialContent}
                      onChange={(e) => setTestimonialContent(e.target.value)}
                      className="w-full bg-[#FCF1F3] border border-[#DDD5C3] focus:border-[#8CA394] rounded-xl px-4 py-3 text-xs text-[#2B2A25] focus:outline-none"
                      placeholder="Share your spiritual transformation, study experience with the female scholars, and how this cohort outline impacted you..."
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      id="btn-cancel-testimonial"
                      onClick={() => setShowTestimonialModal(false)}
                      disabled={isSubmittingTestimonial}
                      className="border border-[#DDD5C3] hover:bg-[#EDE3CE]/40 text-[#5B5648] text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-full transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="btn-submit-testimonial-form"
                      disabled={isSubmittingTestimonial || !testimonialContent.trim()}
                      className="inline-flex items-center gap-2 bg-[#22301F] hover:bg-[#33453A] disabled:bg-[#DDD5C3] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 px-5 rounded-full transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed hover:scale-[1.02]"
                    >
                      {isSubmittingTestimonial ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Submit Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
