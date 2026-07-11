import React, { useState, useEffect, useRef } from "react";
import { Course } from "../types";
import { 
  setCourseForm, 
  getCourseForm, 
  auth, 
  getTestimonials, 
  updateTestimonialStatus,
  getContactSubmissions,
  getWhatsAppInquiries,
  updateSubmissionStatus,
  db,
  getFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  getAllUsers,
  getAllEnrollments
} from "../lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  ClipboardList, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  PlusCircle, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  Calendar,
  ChevronRight,
  User,
  PieChart as ChartIcon,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  MessageCircle,
  Inbox,
  Filter,
  Search,
  Clock,
  CheckCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  BookOpen,
  Download,
  Mail,
  Phone
} from "lucide-react";

interface AnalyticsDashboardProps {
  courses: Course[];
  activeFormDetails: Record<string, { formId: string; formUrl: string } | null>;
  onFormCreated: (courseId: string, formId: string, formUrl: string) => void;
  user: any;
}

interface StructuredResponse {
  responseId: string;
  submittedAt: string;
  answers: {
    questionId: string;
    question: string;
    answer: string;
  }[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  courses,
  activeFormDetails,
  onFormCreated,
  user
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [responses, setResponses] = useState<StructuredResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"forms" | "testimonials" | "messages" | "faqs" | "enrollments">("forms");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);

  // Enrollment Ledger States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [collectionEnrollments, setCollectionEnrollments] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [enrollmentSearch, setEnrollmentSearch] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<any | null>(null);
  const [enrollmentSortField, setEnrollmentSortField] = useState<"name" | "date">("date");
  const [enrollmentSortOrder, setEnrollmentSortOrder] = useState<"asc" | "desc">("desc");

  // FAQ Desk States
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [faqForm, setFaqForm] = useState({
    id: "",
    question: "",
    answer: "",
    category: "General",
    order: 1
  });
  const [faqError, setFaqError] = useState<string | null>(null);
  const [faqSuccess, setFaqSuccess] = useState<string | null>(null);

  // Messaging Desk States
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [whatsappInquiries, setWhatsappInquiries] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [messageStatusFilter, setMessageStatusFilter] = useState<"all" | "pending" | "resolved" | "initiated">("all");
  const [messageChannelFilter, setMessageChannelFilter] = useState<"all" | "email" | "whatsapp">("all");
  const [messageSortField, setMessageSortField] = useState<"date" | "name" | "status" | "channel" | "topic">("date");
  const [messageSortOrder, setMessageSortOrder] = useState<"asc" | "desc">("desc");

  // Staff Notification Center States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; body: string; type: "contact" | "whatsapp" } | null>(null);

  const isInitialContactsLoad = useRef(true);
  const isInitialWhatsappsLoad = useRef(true);

  // Flatten student list into enrollments
  const enrollmentRecords = React.useMemo(() => {
    const recordsMap = new Map<string, any>();

    // 1. Process items from dedicated 'enrollments' collection
    collectionEnrollments.forEach((e: any) => {
      const userProfile = usersList.find((u: any) => u.uid === e.studentUid);
      const course = courses.find((c: any) => c.id === e.courseId);
      const key = `${e.studentUid}-${e.courseId}`;
      recordsMap.set(key, {
        uid: e.studentUid,
        displayName: e.studentName || userProfile?.displayName || "Unknown Student",
        email: e.studentEmail || userProfile?.email || "",
        photoURL: userProfile?.photoURL || null,
        bio: userProfile?.bio || "",
        studyBackground: userProfile?.studyBackground || "",
        ageGroup: userProfile?.ageGroup || "",
        goals: userProfile?.goals || "",
        courseId: e.courseId,
        courseTitle: course ? course.title : (e.courseTitle || e.courseId),
        enrolledAt: e.enrolledAt,
        status: e.status || "enrolled",
        formResponseId: e.formResponseId || "",
        acceptedTermsAt: e.acceptedTermsAt || ""
      });
    });

    // 2. Fall back to users' nested enrollments for any historical items
    usersList.forEach((u: any) => {
      if (u.enrollments && Array.isArray(u.enrollments)) {
        u.enrollments.forEach((e: any) => {
          const key = `${u.uid}-${e.courseId}`;
          if (!recordsMap.has(key)) {
            const course = courses.find((c: any) => c.id === e.courseId);
            recordsMap.set(key, {
              uid: u.uid,
              displayName: u.displayName || "Unknown Student",
              email: u.email || "",
              photoURL: u.photoURL || null,
              bio: u.bio || "",
              studyBackground: u.studyBackground || "",
              ageGroup: u.ageGroup || "",
              goals: u.goals || "",
              courseId: e.courseId,
              courseTitle: course ? course.title : e.courseId,
              enrolledAt: e.enrolledAt,
              status: e.status || "enrolled",
              formResponseId: e.formResponseId || "",
              acceptedTermsAt: e.acceptedTermsAt || ""
            });
          }
        });
      }
    });

    return Array.from(recordsMap.values());
  }, [collectionEnrollments, usersList, courses]);

  // Stats derived from all enrollment records
  const uniqueStudentsCount = React.useMemo(() => {
    const uids = new Set(enrollmentRecords.map(r => r.uid));
    return uids.size;
  }, [enrollmentRecords]);

  const courseCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    courses.forEach(c => {
      counts[c.id] = 0;
    });
    enrollmentRecords.forEach(r => {
      counts[r.courseId] = (counts[r.courseId] || 0) + 1;
    });
    return counts;
  }, [enrollmentRecords, courses]);

  const sortedCourseStats = React.useMemo(() => {
    return courses
      .map(c => ({
        id: c.id,
        title: c.title,
        count: courseCounts[c.id] || 0,
        category: c.category
      }))
      .sort((a, b) => b.count - a.count);
  }, [courses, courseCounts]);

  // Registration daily trends data for Recharts area graph
  const registrationTrends = React.useMemo(() => {
    const countsByDate: Record<string, number> = {};
    enrollmentRecords.forEach(r => {
      if (r.enrolledAt) {
        // Date format: YYYY-MM-DD
        const dateStr = r.enrolledAt.split("T")[0];
        countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
      }
    });

    const sortedDates = Object.keys(countsByDate).sort();

    if (sortedDates.length === 0) {
      // Create empty placeholder trends of the last 7 days so it displays beautifully
      const dummyTrends = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        dummyTrends.push({ date: dateLabel, count: 0 });
      }
      return dummyTrends;
    }

    // Map sorted dates to trend objects
    return sortedDates.map(dateStr => {
      const [year, month, day] = dateStr.split("-");
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        date: formattedDate,
        count: countsByDate[dateStr]
      };
    });
  }, [enrollmentRecords]);

  // Filtered and sorted enrollment records for table view
  const filteredEnrollments = React.useMemo(() => {
    let list = enrollmentRecords.filter((record) => {
      // Course filter
      if (selectedCourseFilter !== "all" && record.courseId !== selectedCourseFilter) {
        return false;
      }
      // Search filter (name or email)
      if (enrollmentSearch.trim() !== "") {
        const searchLower = enrollmentSearch.toLowerCase();
        const nameMatch = record.displayName.toLowerCase().includes(searchLower);
        const emailMatch = record.email.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch;
      }
      return true;
    });

    // Sort list
    list.sort((a, b) => {
      if (enrollmentSortField === "name") {
        const compare = a.displayName.localeCompare(b.displayName);
        return enrollmentSortOrder === "asc" ? compare : -compare;
      } else {
        const dateA = new Date(a.enrolledAt || 0).getTime();
        const dateB = new Date(b.enrolledAt || 0).getTime();
        return enrollmentSortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    return list;
  }, [enrollmentRecords, selectedCourseFilter, enrollmentSearch, enrollmentSortField, enrollmentSortOrder]);

  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const handleExportCSV = () => {
    try {
      const headers = ["Student Name", "Email Address", "Course Title", "Enrollment Date", "Status"];
      const rows = filteredEnrollments.map(e => [
        e.displayName,
        e.email,
        e.courseTitle,
        e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "N/A",
        e.status
      ]);
      const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      
      navigator.clipboard.writeText(csvContent);
      setCopyStatus("CSV data copied to clipboard!");
      setTimeout(() => setCopyStatus(null), 3000);
    } catch (err) {
      console.error("Export copy failed", err);
      setCopyStatus("Failed to copy CSV.");
    }
  };

  const fetchAllTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error("Failed to load testimonials", err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const fetchAllMessages = async () => {
    setLoadingMessages(true);
    try {
      const [contacts, whatsapps] = await Promise.all([
        getContactSubmissions(),
        getWhatsAppInquiries()
      ]);
      setContactSubmissions(contacts);
      setWhatsappInquiries(whatsapps);
    } catch (err) {
      console.error("Failed to fetch messaging dashboard data", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchAllFaqs = async () => {
    setLoadingFaqs(true);
    try {
      const data = await getFAQs();
      setFaqs(data);
    } catch (err) {
      console.error("Failed to fetch FAQs", err);
    } finally {
      setLoadingFaqs(false);
    }
  };

  const fetchEnrollments = async () => {
    setLoadingEnrollments(true);
    try {
      const [users, enrolls] = await Promise.all([
        getAllUsers(),
        getAllEnrollments()
      ]);
      setUsersList(users);
      setCollectionEnrollments(enrolls);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setFaqError(null);
    setFaqSuccess(null);
    if (!faqForm.question || !faqForm.answer) {
      setFaqError("Question and answer are required.");
      return;
    }
    try {
      if (faqForm.id) {
        // Edit mode
        await updateFAQ(faqForm.id, {
          question: faqForm.question,
          answer: faqForm.answer,
          category: faqForm.category,
          order: Number(faqForm.order) || 1
        });
        setFaqSuccess("FAQ item updated successfully!");
      } else {
        // Create mode
        await addFAQ({
          question: faqForm.question,
          answer: faqForm.answer,
          category: faqForm.category,
          order: Number(faqForm.order) || (faqs.length + 1)
        });
        setFaqSuccess("New FAQ item created successfully!");
      }
      // Reset form
      setFaqForm({
        id: "",
        question: "",
        answer: "",
        category: "General",
        order: faqs.length + 2
      });
      // Refresh list
      await fetchAllFaqs();
    } catch (err) {
      console.error("Failed to save FAQ", err);
      setFaqError("Failed to save FAQ. Please check permissions or try again.");
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this FAQ item?")) return;
    setFaqError(null);
    setFaqSuccess(null);
    try {
      await deleteFAQ(id);
      setFaqSuccess("FAQ item deleted successfully!");
      await fetchAllFaqs();
    } catch (err) {
      console.error("Failed to delete FAQ", err);
      setFaqError("Failed to delete FAQ. Please check permissions.");
    }
  };

  // 1. Play beautiful notification chime synthesized via Web Audio API
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // First high chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.25);
      
      // Second octave chime
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gain2.gain.setValueAtTime(0.12, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.35);
      }, 100);
    } catch (err) {
      console.warn("Audio chime play blocked by browser policy:", err);
    }
  };

  // 2. Register alert, update unread status, trigger notification chime
  const handleNewStaffAlert = (alertData: {
    id: string;
    type: "contact" | "whatsapp";
    name: string;
    message: string;
    topic: string;
    submittedAt: string;
  }) => {
    if (soundEnabled) {
      playChime();
    }

    setNotifications((prev) => {
      // Avoid duplicate notifications
      if (prev.some(n => n.id === alertData.id)) return prev;
      return [
        {
          id: alertData.id,
          type: alertData.type,
          name: alertData.name,
          message: alertData.message,
          topic: alertData.topic,
          submittedAt: alertData.submittedAt,
          unread: true
        },
        ...prev
      ];
    });

    setActiveToast({
      id: `${alertData.type}-${alertData.id}-${Date.now()}`,
      title: alertData.type === "whatsapp" ? "New WhatsApp Inquiry" : "New Contact Form Submission",
      body: `From ${alertData.name}: "${alertData.message.substring(0, 65)}${alertData.message.length > 65 ? "..." : ""}"`,
      type: alertData.type
    });
  };

  // 3. Setup real-time listener for both collections
  useEffect(() => {
    // A. Contact submissions listener
    const contactsQuery = query(collection(db, "contact_submissions"));
    const unsubscribeContacts = onSnapshot(contactsQuery, (snapshot) => {
      const list: any[] = [];
      let newArrivals: any[] = [];

      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      // Sort chronological
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setContactSubmissions(list);

      if (isInitialContactsLoad.current) {
        isInitialContactsLoad.current = false;
        // Seed historical unread items as read notifications initially
        const pendingHistorical = list
          .filter(c => c.status === "pending")
          .slice(0, 5)
          .map(c => ({
            id: c.id,
            type: "contact",
            name: c.name,
            message: c.message,
            topic: c.topic || "General Admissions",
            submittedAt: c.submittedAt,
            unread: false
          }));
        setNotifications((prev) => [...prev, ...pendingHistorical]);
      } else {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            newArrivals.push({ id: change.doc.id, ...change.doc.data() });
          }
        });
      }

      newArrivals.forEach((item) => {
        handleNewStaffAlert({
          id: item.id,
          type: "contact",
          name: item.name,
          message: item.message,
          topic: item.topic || "Contact Request",
          submittedAt: item.submittedAt
        });
      });
    }, (err) => {
      console.error("Real-time contacts snapshot stream error:", err);
    });

    // B. WhatsApp inquiries listener
    const whatsappsQuery = query(collection(db, "whatsapp_inquiries"));
    const unsubscribeWhatsapps = onSnapshot(whatsappsQuery, (snapshot) => {
      const list: any[] = [];
      let newArrivals: any[] = [];

      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setWhatsappInquiries(list);

      if (isInitialWhatsappsLoad.current) {
        isInitialWhatsappsLoad.current = false;
        const initiatedHistorical = list
          .filter(w => w.status === "initiated")
          .slice(0, 5)
          .map(w => ({
            id: w.id,
            type: "whatsapp",
            name: w.name || "Anonymous Guest",
            message: w.message || "Initiated WhatsApp Chat",
            topic: w.courseTitle || "Direct WhatsApp Connection",
            submittedAt: w.submittedAt,
            unread: false
          }));
        setNotifications((prev) => [...prev, ...initiatedHistorical]);
      } else {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            newArrivals.push({ id: change.doc.id, ...change.doc.data() });
          }
        });
      }

      newArrivals.forEach((item) => {
        handleNewStaffAlert({
          id: item.id,
          type: "whatsapp",
          name: item.name || "Anonymous Guest",
          message: item.message || "Initiated WhatsApp Chat",
          topic: item.courseTitle || "Direct WhatsApp Connection",
          submittedAt: item.submittedAt
        });
      });
    }, (err) => {
      console.error("Real-time WhatsApp snapshot stream error:", err);
    });

    return () => {
      unsubscribeContacts();
      unsubscribeWhatsapps();
    };
  }, []);

  // 4. Auto-dismissing active toast notification
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 7500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  useEffect(() => {
    if (activeTab === "testimonials") {
      fetchAllTestimonials();
    } else if (activeTab === "messages") {
      fetchAllMessages();
    } else if (activeTab === "faqs") {
      fetchAllFaqs();
    } else if (activeTab === "enrollments") {
      fetchEnrollments();
    }
  }, [activeTab]);

  const handleUpdateStatus = async (
    type: "contact" | "whatsapp",
    id: string,
    newStatus: string
  ) => {
    try {
      await updateSubmissionStatus(
        type === "contact" ? "contact_submissions" : "whatsapp_inquiries",
        id,
        newStatus
      );
      await fetchAllMessages();
    } catch (err) {
      console.error("Failed to update status on admissions desk", err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateTestimonialStatus(id, "approved");
      await fetchAllTestimonials();
    } catch (err) {
      console.error("Failed to approve testimonial", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateTestimonialStatus(id, "rejected");
      await fetchAllTestimonials();
    } catch (err) {
      console.error("Failed to reject testimonial", err);
    }
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const formDetails = selectedCourseId ? activeFormDetails[selectedCourseId] : null;

  // Retrieve user's actual Google OAuth token from the Firebase credential
  useEffect(() => {
    // If the user signed in, we can fetch the token from memory or ask them to sign in again
    // In our app context, the parent passed down user and we can access the cached token
    const token = (window as any).__googleAccessToken;
    if (token) {
      setAccessToken(token);
    } else {
      setError("Organizers must have Google OAuth permissions. Try signing out and signing in again to authorize Forms scope.");
    }
  }, [user]);

  // Fetch responses if form is initialized
  useEffect(() => {
    if (formDetails?.formId && accessToken) {
      fetchResponses(formDetails.formId);
    } else {
      setResponses([]);
    }
  }, [selectedCourseId, formDetails, accessToken]);

  const handleInitializeForm = async () => {
    if (!selectedCourse) return;
    setIsInitializing(true);
    setError(null);

    try {
      const token = (window as any).__googleAccessToken;
      if (!token) {
        throw new Error("No Google access token found. Please sign in with Google to grant permission.");
      }

      const response = await fetch("/api/forms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          courseTitle: selectedCourse.title
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to initialize Google Form");
      }

      const data = await response.json();
      const { formId, formUrl } = data;

      // Persist mapping to Firestore
      await setCourseForm(selectedCourse.id, formId, formUrl);

      // Notify parent
      onFormCreated(selectedCourse.id, formId, formUrl);

      // Trigger responses fetch
      fetchResponses(formId);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during form initialization");
    } finally {
      setIsInitializing(false);
    }
  };

  const fetchResponses = async (formId: string) => {
    const token = (window as any).__googleAccessToken;
    if (!token) return;

    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch(`/api/forms/${formId}/responses`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to load registration answers from Google Form");
      }

      const data = await response.json();
      setResponses(data.responses || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching answers");
    } finally {
      setIsSyncing(false);
    }
  };

  const getStudentAnswer = (resp: StructuredResponse, keyword: string): string => {
    const matched = resp.answers.find(a => a.question.toLowerCase().includes(keyword.toLowerCase()));
    return matched ? matched.answer : "N/A";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Editorial Title with Staff Notification Center */}
      <div className="border-b border-[#DDD5C3] pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-[#5B5648] font-mono text-[10px] uppercase tracking-widest">
            <ClipboardList className="w-4 h-4 text-[#8A5A4D]" />
            <span>Administration Console</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">
            Organizers' Registration & Intake Desk
          </h2>
          <p className="text-[#5B5648] text-xs md:text-sm font-light leading-relaxed">
            Initialize and manage Google Forms for admissions, sync registrations, and inspect student 
            backgrounds and study motivations directly.
          </p>
        </div>

        {/* Staff Notification Center Widget */}
        <div className="relative shrink-0 flex items-center gap-3 bg-[#F4EFE6]/70 border border-[#DDD5C3]/70 p-3 rounded-2xl shadow-sm self-start md:self-auto">
          {/* Sound Toggle */}
          <button
            id="btn-toggle-notification-sound"
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-[#5B5648] hover:text-[#22301F] hover:bg-[#EAE4D5] transition-all cursor-pointer relative"
            title={soundEnabled ? "Mute notification sound" : "Unmute notification sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-700" />}
          </button>

          {/* Bell Toggle */}
          <button
            id="btn-toggle-notification-bell"
            type="button"
            onClick={() => setIsBellOpen(!isBellOpen)}
            className={`p-2.5 rounded-xl transition-all cursor-pointer relative flex items-center justify-center ${
              isBellOpen 
                ? "bg-[#22301F] text-white" 
                : "text-[#22301F] hover:bg-[#EAE4D5] bg-white border border-[#DDD5C3]"
            }`}
          >
            {notifications.some(n => n.unread) ? (
              <BellRing className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
            ) : (
              <Bell className="w-4.5 h-4.5" />
            )}
            
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center shadow-md">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>

          {/* Bell Dropdown */}
          {isBellOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#FBFBFB] border border-[#DDD5C3] shadow-xl rounded-3xl p-5 z-40 text-left space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#DDD5C3]/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#22301F]" />
                  <span className="font-serif font-bold text-sm text-[#22301F]">Staff Notification Center</span>
                </div>
                {notifications.some(n => n.unread) && (
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                    className="text-[9px] font-mono text-[#8A5A4D] hover:underline cursor-pointer font-bold"
                  >
                    Clear Badges
                  </button>
                )}
              </div>

              {/* List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#5B5648]/60 font-light italic">
                    No recent inquiries received in this session.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                        n.unread 
                          ? "bg-amber-50/50 border-amber-200" 
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-[#22301F]">
                          {n.type === "whatsapp" ? (
                            <span className="h-2 w-2 rounded-full bg-[#25D366]" title="WhatsApp" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-[#8CA394]" title="Contact Form" />
                          )}
                          <span>{n.name}</span>
                        </div>
                        <span className="text-[9px] text-[#5B5648]/60 font-mono">
                          {new Date(n.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-[#5B5648] line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 max-w-[120px] truncate">
                          {n.topic}
                        </span>
                        <div className="flex items-center gap-2">
                          {n.unread && (
                            <button
                              type="button"
                              onClick={() => {
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                              }}
                              className="text-[9px] text-gray-500 hover:text-gray-800 cursor-pointer font-medium"
                            >
                              Dismiss
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("messages");
                              setMessageSearch(n.name);
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                              setIsBellOpen(false);
                            }}
                            className="bg-[#22301F] text-white px-2 py-0.5 rounded font-bold text-[9px] hover:bg-[#33453A] cursor-pointer"
                          >
                            View & Respond
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center pt-2 border-t border-[#DDD5C3]/30">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("messages");
                    setIsBellOpen(false);
                  }}
                  className="text-[10px] font-mono text-[#22301F] font-bold hover:underline cursor-pointer"
                >
                  Go to Communications Desk →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Access Token Alert Banner if missing */}
      {!accessToken && (
        <div className="bg-[#F1E7D3] border border-[#DDD5C3] rounded-2xl p-5 flex gap-4 items-start text-[#87652A] text-xs md:text-sm">
          <AlertCircle className="w-5 h-5 text-[#87652A] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif font-bold">Permissions Required</h4>
            <p className="font-light leading-relaxed">
              Your session doesn't contain a cached Google access token. To make live requests to the Google Forms API, please log out and sign in with Google, ensuring you authorize the forms permission checklist in the pop-up window.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tab Toggle Navigation */}
      <div className="flex flex-wrap border-b border-[#DDD5C3] gap-x-6 gap-y-2 text-xs uppercase font-bold tracking-widest pb-px">
        <button
          id="btn-tab-forms-desk"
          onClick={() => setActiveTab("forms")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "forms" 
              ? "border-[#22301F] text-[#22301F]" 
              : "border-transparent text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          Google Forms Intake Sync
        </button>
        <button
          id="btn-tab-testimonials-desk"
          onClick={() => setActiveTab("testimonials")}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "testimonials" 
              ? "border-[#22301F] text-[#22301F]" 
              : "border-transparent text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          <span>Student Testimonials Desk</span>
          <span className="font-mono text-[9px] bg-[#B98072]/15 text-[#8A5A4D] px-1.5 py-0.5 rounded-full font-bold">
            {testimonials.filter(t => t.status === "pending").length} Pending
          </span>
        </button>
        <button
          id="btn-tab-registrar-communications"
          onClick={() => setActiveTab("messages")}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "messages" 
              ? "border-[#22301F] text-[#22301F]" 
              : "border-transparent text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          <span>Registrar Communications</span>
          <span className="font-mono text-[9px] bg-[#8CA394]/15 text-[#33453A] px-1.5 py-0.5 rounded-full font-bold">
            {contactSubmissions.filter(c => c.status === "pending").length + whatsappInquiries.filter(w => w.status === "initiated").length} Active
          </span>
        </button>
        <button
          id="btn-tab-faqs-manager"
          onClick={() => setActiveTab("faqs")}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "faqs" 
              ? "border-[#22301F] text-[#22301F]" 
              : "border-transparent text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          <span>Support FAQs Manager</span>
          <span className="font-mono text-[9px] bg-[#22301F]/10 text-[#22301F] px-1.5 py-0.5 rounded-full font-bold">
            {faqs.length || ""} Items
          </span>
        </button>
        <button
          id="btn-tab-enrollment-ledger"
          onClick={() => setActiveTab("enrollments")}
          className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "enrollments" 
              ? "border-[#22301F] text-[#22301F]" 
              : "border-transparent text-[#5B5648]/60 hover:text-[#22301F]"
          }`}
        >
          <span>Enrollment Ledger</span>
          <span className="font-mono text-[9px] bg-emerald-150 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
            {enrollmentRecords.length} Enrolled
          </span>
        </button>
      </div>

      {activeTab === "forms" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Course Selector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-serif font-bold text-[#22301F] text-base">Select Program</h3>
          <div className="space-y-2">
            {courses.map((course) => {
              const isSelected = course.id === selectedCourseId;
              const hasForm = !!activeFormDetails[course.id];

              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? "bg-[#22301F] border-[#22301F] text-white shadow-md"
                      : "bg-[#FBF8F1] border-[#DDD5C3] text-[#5B5648] hover:border-[#8CA394]"
                  }`}
                >
                  <div className="space-y-1 pr-4 truncate">
                    <p className={`text-xs uppercase font-bold tracking-wider opacity-60 ${isSelected ? 'text-white' : 'text-[#8CA394]'}`}>
                      {course.category === "women" ? "Women" : "Kids"}
                    </p>
                    <h4 className="font-serif font-bold text-sm leading-tight truncate">
                      {course.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {hasForm ? (
                      <span className="w-2 h-2 bg-[#8CA394] rounded-full animate-pulse" title="Form Active" />
                    ) : (
                      <span className="w-2 h-2 bg-[#DDD5C3] rounded-full" title="Form Inactive" />
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      isSelected ? "text-[#B0863A]" : "text-[#5B5648]"
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Form Bindings & Registrations */}
        <div className="lg:col-span-8 space-y-8">
          {selectedCourse && (
            <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-8">
              
              {/* Selected Course Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#DDD5C3]/40 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A5A4D] font-bold">
                    Selected Course
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#22301F]">
                    {selectedCourse.title}
                  </h3>
                </div>
                
                {formDetails && (
                  <button
                    onClick={() => fetchResponses(formDetails.formId)}
                    disabled={isSyncing || !accessToken}
                    className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#DDD5C3] hover:border-[#8CA394] text-[#5B5648] hover:text-[#22301F] text-xs font-bold rounded-full bg-[#FBF8F1] cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#8CA394] ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Syncing..." : "Sync Responses"}</span>
                  </button>
                )}
              </div>

              {/* Form Binding Controls */}
              {!formDetails ? (
                /* No Form: Initializer Card */
                <div className="border border-dashed border-[#DDD5C3] rounded-2xl p-8 text-center space-y-6 bg-[#FCF1F3]/50">
                  <div className="w-12 h-12 bg-[#FCF1F3] border border-[#DDD5C3] rounded-full flex items-center justify-center mx-auto text-[#5B5648]">
                    <PlusCircle className="w-6 h-6 text-[#8CA394]" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h4 className="font-serif font-bold text-[#22301F] text-base">
                      Initialize Google Registration Form
                    </h4>
                    <p className="font-sans text-xs text-[#5B5648] font-light leading-relaxed">
                      No Google Intake Form is binded to this course yet. Instantly generate a customized Google Form with standard intake questions directly in your Google Drive.
                    </p>
                  </div>
                  <button
                    onClick={handleInitializeForm}
                    disabled={isInitializing || !accessToken}
                    className="inline-flex items-center gap-2 bg-[#B98072] hover:bg-[#8A5A4D] disabled:bg-[#DDD5C3]/50 text-white disabled:text-[#5B5648]/40 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest btn-shadow cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    {isInitializing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Initializing Form on Google...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#F1E7D3]" />
                        <span>Create & Bind Google Form</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Form Initialized: Summary Stats & Analytics */
                <div className="space-y-8">
                  
                  {/* Google Form Link Block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FCF1F3] border border-[#DDD5C3] p-4 rounded-xl text-xs font-mono text-[#5B5648]">
                    <div className="space-y-1 pr-4 border-b sm:border-b-0 sm:border-r border-[#DDD5C3] pb-2.5 sm:pb-0">
                      <span className="text-[10px] text-[#8CA394] uppercase tracking-widest font-bold block">
                        Google Form ID
                      </span>
                      <span className="text-[#22301F] select-all block truncate font-semibold">
                        {formDetails.formId}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#8CA394] uppercase tracking-widest font-bold block">
                        Public Form Link
                      </span>
                      <a
                        href={formDetails.formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8A5A4D] hover:text-[#8A5A4D]/80 font-bold hover:underline flex items-center gap-1 leading-normal"
                      >
                        <span>View Active Form</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Summary Metric Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#FCF1F3] border border-[#DDD5C3]/70 p-5 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#F1E7D3] text-[#87652A] border border-[#DDD5C3] rounded-xl flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-mono uppercase text-[#5B5648]/60">Total Applicants</p>
                        <p className="text-2xl font-serif font-bold text-[#22301F]">{responses.length}</p>
                      </div>
                    </div>

                    <div className="bg-[#FCF1F3] border border-[#DDD5C3]/70 p-5 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#8CA394]/15 text-[#33453A] border border-[#8CA394]/30 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-[#8CA394]" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-mono uppercase text-[#5B5648]/60">Intake Status</p>
                        <p className="text-sm font-bold text-[#33453A]">Active & Syncing</p>
                      </div>
                    </div>

                    <div className="bg-[#FCF1F3] border border-[#DDD5C3]/70 p-5 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#F1E2DC] text-[#8A5A4D] border border-[#DDD5C3] rounded-xl flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-mono uppercase text-[#5B5648]/60">Enrollment Method</p>
                        <p className="text-xs font-bold text-[#8A5A4D]">Direct Google API</p>
                      </div>
                    </div>
                  </div>

                  {/* Applicants Responses Database List */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-[#22301F] text-base flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#8CA394]" />
                      <span>Registration Log ({responses.length})</span>
                    </h4>

                    {responses.length === 0 ? (
                      <div className="border border-[#DDD5C3] rounded-2xl p-8 text-center text-[#5B5648]/60 space-y-2 bg-[#FCF1F3]/50">
                        <HelpCircle className="w-8 h-8 text-[#DDD5C3] mx-auto" />
                        <p className="text-xs font-light">No responses submitted to the Google Form yet.</p>
                        <p className="text-[10px] font-mono">Click "Sync Responses" above once students fill it out.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {responses.map((resp, idx) => (
                          <div 
                            key={resp.responseId} 
                            className="bg-[#FCF1F3] border border-[#DDD5C3]/60 rounded-2xl p-5 space-y-4 text-xs"
                          >
                            <div className="flex justify-between items-center border-b border-[#DDD5C3]/40 pb-2">
                              <div className="flex items-center gap-2 text-[#22301F] font-bold">
                                <User className="w-3.5 h-3.5 text-[#8CA394]" />
                                <span>{getStudentAnswer(resp, "Name") || `Applicant ${idx + 1}`}</span>
                              </div>
                              <span className="text-[10px] text-[#5B5648] font-mono">
                                {new Date(resp.submittedAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-[#5B5648] leading-relaxed font-light">
                              <div>
                                <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394] block mb-0.5 font-bold">
                                  Age / Group
                                </span>
                                <span className="text-[#22301F] font-semibold">
                                  {getStudentAnswer(resp, "Age")}
                                </span>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394] block mb-0.5 font-bold">
                                  Motivation / Hopes
                                </span>
                                <p className="text-[#33453A] italic">
                                  "{getStudentAnswer(resp, "What are you hoping") || getStudentAnswer(resp, "achieve")}"
                                </p>
                              </div>
                            </div>

                            {/* Previous studies row if filled */}
                            {getStudentAnswer(resp, "studies") !== "N/A" && (
                              <div className="bg-[#FBF8F1] border border-[#DDD5C3]/40 p-2.5 rounded-lg text-[11px]">
                                <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA394] block mb-0.5 font-bold">
                                  Previous Background
                                </span>
                                <p className="text-[#5B5648] font-light leading-relaxed">
                                  {getStudentAnswer(resp, "studies")}
                                </p>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Error banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-xs font-mono">
                  <p className="font-bold">Error:</p>
                  <p className="font-light">{error}</p>
                </div>
              )}

            </div>
          )}
        </div>
        
      </div>
      )}

      {activeTab === "testimonials" && (
        <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-10 space-y-8 animate-fade-in">
          <div className="border-b border-[#DDD5C3]/40 pb-5 space-y-1 text-left">
            <h3 className="font-serif text-xl font-bold text-[#22301F]">
              Student Testimonials Desk
            </h3>
            <p className="text-xs text-[#5B5648] font-light">
              Review and moderate submitted student feedback and rating testimonials before publication.
            </p>
          </div>

          {loadingTestimonials ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-[#22301F]/20 border-t-[#22301F] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#5B5648]/60 font-mono">Retrieving review database...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="border border-[#DDD5C3] border-dashed rounded-2xl p-12 text-center text-[#5B5648]/60 space-y-3 bg-[#FCF1F3]/50">
              <MessageSquare className="w-10 h-10 text-[#DDD5C3] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#22301F]">No Testimonials Yet</h4>
              <p className="text-xs font-light max-w-sm mx-auto">
                Once students complete their course syllabus on their student portals, they can submit reflections and star ratings.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filter summaries */}
              <div className="flex gap-4 text-xs font-mono">
                <span className="font-bold text-[#22301F]">
                  Total Submissions: {testimonials.length}
                </span>
                <span className="text-amber-700 font-bold">
                  ● Pending: {testimonials.filter(t => t.status === "pending").length}
                </span>
                <span className="text-emerald-700 font-bold">
                  ● Approved: {testimonials.filter(t => t.status === "approved").length}
                </span>
              </div>

              {/* List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {testimonials.map((t) => (
                  <div 
                    key={t.id} 
                    className={`border rounded-2xl p-5 space-y-4 transition-all ${
                      t.status === "pending" 
                        ? "bg-amber-50/40 border-amber-200/60" 
                        : t.status === "approved" 
                        ? "bg-emerald-50/20 border-emerald-100" 
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#DDD5C3]/30 pb-2">
                      <div className="space-y-0.5 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-[#22301F] text-sm">{t.studentName}</span>
                          <span className="text-[10px] text-[#5B5648]/60 font-mono">({t.studentEmail})</span>
                        </div>
                        <span className="text-[10px] bg-[#DDD5C3]/40 text-[#22301F] font-semibold px-2 py-0.5 rounded-full inline-block">
                          Course: {t.courseTitle}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-xs">
                              {star <= t.rating ? "⭐" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full font-mono ${
                          t.status === "pending" 
                            ? "bg-amber-100 text-amber-800" 
                            : t.status === "approved" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#33453A] italic font-serif leading-relaxed px-3 bg-white/40 py-2.5 rounded-lg border border-[#DDD5C3]/20 text-left">
                      "{t.content}"
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-[#5B5648]/70 font-mono">
                      <span>Submitted on {new Date(t.submittedAt).toLocaleString()}</span>
                      
                      {t.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            id={`btn-reject-review-${t.id}`}
                            onClick={() => handleReject(t.id)}
                            className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-200 py-1 px-3 rounded-full transition-all cursor-pointer shadow-sm text-[9px]"
                          >
                            <X className="w-2.5 h-2.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            id={`btn-approve-review-${t.id}`}
                            onClick={() => handleApprove(t.id)}
                            className="inline-flex items-center gap-1 bg-[#22301F] hover:bg-[#33453A] text-white font-bold border border-[#22301F] py-1 px-3 rounded-full transition-all cursor-pointer shadow-sm text-[9px]"
                          >
                            <Check className="w-2.5 h-2.5" />
                            <span>Approve</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "messages" && (
        <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-10 space-y-8 animate-fade-in text-left">
          
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#DDD5C3]/40 pb-5">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#22301F]">
                Registrar Communications Desk
              </h3>
              <p className="text-xs text-[#5B5648] font-light">
                Consolidated inbox and tracking panel for 'Contact' submissions and registered WhatsApp inquiries.
              </p>
            </div>
            
            <button
              onClick={fetchAllMessages}
              disabled={loadingMessages}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#DDD5C3] hover:border-[#8CA394] text-[#5B5648] hover:text-[#22301F] text-xs font-bold rounded-full bg-[#FBF8F1] cursor-pointer transition-all hover:scale-[1.02]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#8CA394] ${loadingMessages ? "animate-spin" : ""}`} />
              <span>{loadingMessages ? "Refreshing..." : "Refresh Messages"}</span>
            </button>
          </div>

          {loadingMessages ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-[#22301F]/20 border-t-[#22301F] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#5B5648]/60 font-mono">Loading inbox logs...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Aggregated Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-[#DDD5C3]/60 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-[#5B5648]/60 font-semibold block">Total Inquiries</span>
                  <span className="text-2xl font-serif font-bold text-[#22301F]">
                    {contactSubmissions.length + whatsappInquiries.length}
                  </span>
                </div>
                <div className="bg-white border border-[#DDD5C3]/60 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-[#8A5A4D] font-bold block">● Pending Contact Forms</span>
                  <span className="text-2xl font-serif font-bold text-[#8A5A4D]">
                    {contactSubmissions.filter(c => c.status === "pending").length}
                  </span>
                </div>
                <div className="bg-white border border-[#DDD5C3]/60 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-amber-700 font-bold block">● Active WhatsApp Chats</span>
                  <span className="text-2xl font-serif font-bold text-amber-700">
                    {whatsappInquiries.filter(w => w.status === "initiated").length}
                  </span>
                </div>
                <div className="bg-white border border-[#DDD5C3]/60 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">● Resolved Cases</span>
                  <span className="text-2xl font-serif font-bold text-emerald-700">
                    {contactSubmissions.filter(c => c.status === "resolved").length + whatsappInquiries.filter(w => w.status === "resolved").length}
                  </span>
                </div>
              </div>

              {/* Advanced Search & Filtering Controls */}
              <div className="flex flex-col md:flex-row gap-4 bg-[#FCF1F3]/40 border border-[#DDD5C3]/60 p-4 rounded-2xl text-xs">
                
                {/* Search input */}
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5648]/50" />
                  <input
                    id="search-messages"
                    type="text"
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    placeholder="Search by name, email, topic, phone, message content..."
                    className="w-full bg-white border border-[#DDD5C3] rounded-xl pl-9 pr-4 py-2.5 text-xs placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394]"
                  />
                </div>

                {/* Channel select filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#8CA394]" />
                  <select
                    id="filter-message-channel"
                    value={messageChannelFilter}
                    onChange={(e: any) => setMessageChannelFilter(e.target.value)}
                    className="bg-white border border-[#DDD5C3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#8CA394]"
                  >
                    <option value="all">All Channels</option>
                    <option value="email">Contact Form (Email preferred)</option>
                    <option value="whatsapp">WhatsApp (Direct Link log)</option>
                  </select>
                </div>

                {/* Status select filter */}
                <div className="flex items-center gap-2">
                  <select
                    id="filter-message-status"
                    value={messageStatusFilter}
                    onChange={(e: any) => setMessageStatusFilter(e.target.value)}
                    className="bg-white border border-[#DDD5C3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#8CA394]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Active / Pending Response</option>
                    <option value="resolved">Resolved Cases Only</option>
                  </select>
                </div>

              </div>

              {/* Interactive Sort Headers Bar */}
              <div className="bg-[#22301F]/5 border border-[#DDD5C3]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5B5648] gap-4">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8CA394] block">
                    Interactive Sort Controls
                  </span>
                  <p className="text-[11px] text-[#5B5648] font-light">
                    Click any attribute to toggle ascending or descending sorting order.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "date", label: "Date" },
                    { id: "name", label: "Applicant Name" },
                    { id: "status", label: "Status" },
                    { id: "channel", label: "Channel" },
                    { id: "topic", label: "Topic of Interest" },
                  ].map((field) => {
                    const isActive = messageSortField === field.id;
                    return (
                      <button
                        key={field.id}
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            setMessageSortOrder(messageSortOrder === "asc" ? "desc" : "asc");
                          } else {
                            setMessageSortField(field.id as any);
                            setMessageSortOrder("desc");
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer text-[11px] font-sans ${
                          isActive
                            ? "bg-[#22301F] text-white border-[#22301F] font-bold shadow-sm"
                            : "bg-white text-[#5B5648] border-[#DDD5C3] hover:border-[#8CA394]"
                        }`}
                      >
                        <span>{field.label}</span>
                        {isActive ? (
                          messageSortOrder === "asc" ? (
                            <ArrowUp className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-white" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-[#8CA394]/70" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Messaging List */}
              {(() => {
                // Map the collections to a unified interface
                const contacts = contactSubmissions.map(c => ({
                  id: c.id,
                  type: "contact",
                  name: c.name,
                  email: c.email,
                  phone: c.phone || "Not specified",
                  topic: c.topic || "General Inquiry",
                  message: c.message,
                  channel: c.channel,
                  submittedAt: c.submittedAt,
                  status: c.status || "pending"
                }));

                const whatsapps = whatsappInquiries.map(w => ({
                  id: w.id,
                  type: "whatsapp",
                  name: w.name,
                  email: "N/A",
                  phone: w.phone || "Not specified",
                  topic: w.courseTitle || "Direct WhatsApp Connection",
                  message: w.message,
                  channel: "whatsapp",
                  submittedAt: w.submittedAt,
                  status: w.status || "initiated"
                }));

                // Combine list
                let consolidated = [...contacts, ...whatsapps];

                // Apply search
                if (messageSearch.trim()) {
                  const query = messageSearch.toLowerCase();
                  consolidated = consolidated.filter(m => 
                    m.name.toLowerCase().includes(query) ||
                    m.email.toLowerCase().includes(query) ||
                    m.phone.toLowerCase().includes(query) ||
                    m.topic.toLowerCase().includes(query) ||
                    m.message.toLowerCase().includes(query)
                  );
                }

                // Apply channel filter
                if (messageChannelFilter !== "all") {
                  consolidated = consolidated.filter(m => {
                    if (messageChannelFilter === "email") return m.type === "contact";
                    if (messageChannelFilter === "whatsapp") return m.type === "whatsapp";
                    return true;
                  });
                }

                // Apply status filter
                if (messageStatusFilter !== "all") {
                  consolidated = consolidated.filter(m => {
                    if (messageStatusFilter === "pending") return m.status === "pending" || m.status === "initiated";
                    if (messageStatusFilter === "resolved") return m.status === "resolved";
                    return true;
                  });
                }

                // Sort dynamically
                consolidated.sort((a, b) => {
                  let valA: any = "";
                  let valB: any = "";

                  if (messageSortField === "date") {
                    valA = new Date(a.submittedAt).getTime();
                    valB = new Date(b.submittedAt).getTime();
                  } else if (messageSortField === "name") {
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                  } else if (messageSortField === "status") {
                    valA = a.status.toLowerCase();
                    valB = b.status.toLowerCase();
                  } else if (messageSortField === "channel") {
                    valA = a.channel.toLowerCase();
                    valB = b.channel.toLowerCase();
                  } else if (messageSortField === "topic") {
                    valA = a.topic.toLowerCase();
                    valB = b.topic.toLowerCase();
                  }

                  if (valA < valB) return messageSortOrder === "asc" ? -1 : 1;
                  if (valA > valB) return messageSortOrder === "asc" ? 1 : -1;
                  return 0;
                });

                if (consolidated.length === 0) {
                  return (
                    <div className="border border-[#DDD5C3] border-dashed rounded-2xl p-12 text-center text-[#5B5648]/60 space-y-3 bg-white/50">
                      <Inbox className="w-10 h-10 text-[#DDD5C3] mx-auto" />
                      <h4 className="font-serif font-bold text-sm text-[#22301F]">No Messages Match Filters</h4>
                      <p className="text-xs font-light max-w-sm mx-auto">
                        We couldn't find any Contact form or WhatsApp inquiries that match your search text or selected filter categories.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2">
                    {consolidated.map((msg) => {
                      const isPending = msg.status === "pending" || msg.status === "initiated";
                      const isWhatsAppType = msg.type === "whatsapp";

                      return (
                        <div
                          key={msg.id}
                          className={`border rounded-2xl p-5 space-y-4 transition-all ${
                            isPending
                              ? isWhatsAppType 
                                ? "bg-emerald-50/10 border-emerald-200/50"
                                : "bg-amber-50/20 border-amber-200/40"
                              : "bg-gray-50 border-gray-200/60 opacity-70"
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#DDD5C3]/30 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-bold text-[#22301F] text-sm sm:text-base">
                                  {msg.name}
                                </span>
                                
                                {/* Channel badge */}
                                {isWhatsAppType ? (
                                  <span className="inline-flex items-center gap-1 bg-[#25D366]/10 text-[#20ba59] px-2 py-0.5 rounded-full font-mono text-[9px] font-bold">
                                    <MessageCircle className="w-2.5 h-2.5" />
                                    <span>WhatsApp</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-[#8CA394]/10 text-[#33453A] px-2 py-0.5 rounded-full font-mono text-[9px] font-bold">
                                    <Inbox className="w-2.5 h-2.5" />
                                    <span>Contact Form</span>
                                  </span>
                                )}

                                {/* Status badge */}
                                <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                                  isPending
                                    ? isWhatsAppType 
                                      ? "bg-emerald-100 text-emerald-800" 
                                      : "bg-amber-100 text-amber-800"
                                    : "bg-gray-200 text-gray-700"
                                }`}>
                                  {msg.status}
                                </span>
                              </div>

                              {/* Message topic / category */}
                              <div className="text-[10px] text-[#5B5648] font-mono uppercase tracking-wider">
                                Topic: <span className="text-[#22301F] font-bold">{msg.topic}</span>
                              </div>
                            </div>

                            {/* Submitted date */}
                            <div className="text-[10px] text-[#5B5648]/60 font-mono text-left sm:text-right shrink-0">
                              <span className="block font-medium">Submitted On</span>
                              <span>{new Date(msg.submittedAt).toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Contact Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/55 p-3 rounded-xl border border-[#DDD5C3]/20 text-xs">
                            <div>
                              <span className="text-[9px] font-mono text-[#8CA394] uppercase font-bold block mb-0.5">Email</span>
                              <span className="text-[#22301F] font-semibold select-all">
                                {msg.email}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-[#8CA394] uppercase font-bold block mb-0.5">Phone Number</span>
                              <span className="text-[#22301F] font-semibold select-all">
                                {msg.phone}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-[#8CA394] uppercase font-bold block mb-0.5">Reply Choice</span>
                              <span className="text-[#22301F] font-semibold capitalize">
                                {msg.channel} Outreach
                              </span>
                            </div>
                          </div>

                          {/* Message Content */}
                          <div className="bg-white border border-[#DDD5C3]/30 p-4 rounded-xl text-xs text-[#22301F] leading-relaxed">
                            <p className="font-mono text-[9px] uppercase tracking-widest text-[#8CA394] font-bold mb-1.5">
                              Message Text:
                            </p>
                            <p className="font-sans whitespace-pre-wrap font-light">
                              "{msg.message}"
                            </p>
                          </div>

                          {/* Action Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono">
                            <div>
                              {/* Status update toggle button */}
                              {isPending ? (
                                <button
                                  onClick={() => handleUpdateStatus(msg.type as any, msg.id, "resolved")}
                                  className="inline-flex items-center gap-1 bg-[#22301F] hover:bg-[#33453A] text-white font-bold border border-[#22301F] py-1.5 px-4 rounded-full transition-all cursor-pointer shadow-sm text-[9px]"
                                >
                                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                                  <span>Mark as Resolved</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(msg.type as any, msg.id, isWhatsAppType ? "initiated" : "pending")}
                                  className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 text-[#5B5648] font-semibold border border-gray-300 py-1.5 px-4 rounded-full transition-all cursor-pointer shadow-sm text-[9px]"
                                >
                                  <Clock className="w-3 h-3 text-amber-500" />
                                  <span>Re-open Case</span>
                                </button>
                              )}
                            </div>

                            {/* Response outreach helper quicklinks */}
                            <div className="flex items-center gap-2">
                              {/* Mail outreach link */}
                              {msg.email !== "N/A" && (
                                <a
                                  href={`mailto:${msg.email}?subject=Reply%20from%20Qalbiya%20Islamic%20Institute%20re:%20${encodeURIComponent(msg.topic)}&body=Assalamu%20alaikum%20${encodeURIComponent(msg.name)},%0D%0DThank%20you%20for%20reaching%20out...`}
                                  className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-[#8CA394] text-[#5B5648] hover:text-[#22301F] py-1 px-2.5 rounded bg-white transition-colors cursor-pointer text-[9px]"
                                >
                                  <span>Direct Email Response</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}

                              {/* WhatsApp Direct outreach link */}
                              {msg.phone !== "Not specified" && msg.phone !== "N/A" && (
                                <a
                                  href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}?text=Assalamu%20alaikum%20${encodeURIComponent(msg.name)}!%20This%20is%20the%20admissions%20officer%20from%20Qalbiya%20Islamic%20Institute%20responding%20to%20your%20inquiry.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 border border-emerald-300 hover:border-emerald-500 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-1 px-2.5 rounded transition-colors cursor-pointer text-[9px]"
                                >
                                  <span>Direct WhatsApp Reply</span>
                                  <MessageCircle className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                );
              })()}

            </div>
          )}

        </div>
      )}

      {activeTab === "faqs" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
          
          {/* Left Column: List of FAQs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[#DDD5C3] pb-3">
              <div>
                <h3 className="font-serif font-bold text-[#22301F] text-lg">Active Support FAQs</h3>
                <p className="text-xs text-[#5B5648] font-light">Frequently Asked Questions currently active on the main registration portal.</p>
              </div>
              <button
                type="button"
                onClick={fetchAllFaqs}
                disabled={loadingFaqs}
                className="p-1.5 rounded-lg border border-[#DDD5C3] hover:bg-[#EAE4D5] text-[#22301F] cursor-pointer transition-colors"
                title="Refresh FAQs list"
              >
                <RefreshCw className={`w-4 h-4 ${loadingFaqs ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Success and Error messages inside tab */}
            {faqSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
                <span>{faqSuccess}</span>
                <button type="button" onClick={() => setFaqSuccess(null)} className="text-[10px] font-bold hover:underline">Dismiss</button>
              </div>
            )}
            {faqError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center justify-between">
                <span>{faqError}</span>
                <button type="button" onClick={() => setFaqError(null)} className="text-[10px] font-bold hover:underline">Dismiss</button>
              </div>
            )}

            {loadingFaqs ? (
              <div className="py-20 text-center space-y-2">
                <div className="w-8 h-8 border-4 border-[#8CA394] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-[#5B5648]/60 font-mono uppercase tracking-widest">Loading Frequently Asked Questions...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="p-10 border border-dashed border-[#DDD5C3] rounded-2xl text-center text-[#5B5648]/60 text-xs italic">
                No FAQs available. Create your first FAQ item on the right sidebar!
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {faqs.map((f, idx) => (
                  <div key={f.id || idx} className="bg-white border border-[#DDD5C3] rounded-2xl p-5 hover:shadow-sm transition-all space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">
                            {f.category || "General"}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400">
                            Sort index: {f.order || 0}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-[#22301F] text-sm leading-snug">{f.question}</h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setFaqForm({
                              id: f.id,
                              question: f.question,
                              answer: f.answer,
                              category: f.category || "General",
                              order: f.order || 1
                            });
                            // scroll or focus form if on mobile
                            document.getElementById("faq-form-card")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="px-2 py-1 bg-[#F4EFE6] text-[#22301F] text-[10px] rounded hover:bg-[#EAE4D5] cursor-pointer transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFAQ(f.id)}
                          className="px-2 py-1 bg-red-50 text-red-700 text-[10px] rounded hover:bg-red-100 cursor-pointer transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#5B5648] font-light leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-gray-50 italic">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Create/Edit FAQ Form */}
          <div className="lg:col-span-5" id="faq-form-card">
            <div className="bg-[#F4EFE6]/70 border border-[#DDD5C3] rounded-3xl p-6 space-y-6 shadow-sm sticky top-6">
              <div className="border-b border-[#DDD5C3]/60 pb-3">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A5A4D] font-bold">
                  Administrative Desk
                </span>
                <h3 className="font-serif font-bold text-[#22301F] text-base">
                  {faqForm.id ? "Edit FAQ Item" : "Register New FAQ"}
                </h3>
                <p className="text-[11px] text-[#5B5648] font-light leading-relaxed mt-1">
                  {faqForm.id 
                    ? "Modify existing question parameters. Saved changes will be immediately live." 
                    : "Publish a new frequently asked question. New entries seed on the main support desk."}
                </p>
              </div>

              <form onSubmit={handleSaveFAQ} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#5B5648] font-bold block">
                    FAQ Question Text *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Can children do trials?"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-xs placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#5B5648] font-bold block">
                    Detailed Answer *
                  </label>
                  <textarea
                    required
                    placeholder="e.g. Yes! We offer a single 15-minute diagnostic session..."
                    rows={4}
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-xs placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#5B5648] font-bold block">
                      Category Group
                    </label>
                    <select
                      value={faqForm.category}
                      onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                      className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8CA394]"
                    >
                      <option value="General">General</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Instructors">Instructors</option>
                      <option value="Schedule & Format">Schedule & Format</option>
                      <option value="Kids Hub">Kids Hub</option>
                      <option value="Women Cohort">Women Cohort</option>
                      <option value="Graduation">Graduation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#5B5648] font-bold block">
                      Sorting Order Index
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 5"
                      value={faqForm.order}
                      onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) || 1 })}
                      className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8CA394]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-grow bg-[#22301F] hover:bg-[#33453A] text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-full cursor-pointer shadow-md transition-all active:scale-[0.98]"
                  >
                    {faqForm.id ? "Update FAQ Parameters" : "Publish FAQ Card"}
                  </button>
                  {faqForm.id && (
                    <button
                      type="button"
                      onClick={() => setFaqForm({
                        id: "",
                        question: "",
                        answer: "",
                        category: "General",
                        order: faqs.length + 1
                      })}
                      className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs uppercase tracking-wider rounded-full cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

            </div>
          </div>

        </div>
      )}

      {activeTab === "enrollments" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Bento Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FFF1F3] border border-[#DDD5C3]/70 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="p-3.5 bg-[#22301F]/10 text-[#22301F] rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8CA394] font-bold">Unique Students</p>
                <h4 className="text-2xl font-serif font-extrabold text-[#22301F] mt-0.5">{uniqueStudentsCount}</h4>
              </div>
            </div>
            
            <div className="bg-[#FFF1F3] border border-[#DDD5C3]/70 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8CA394] font-bold">Total Enrollments</p>
                <h4 className="text-2xl font-serif font-extrabold text-[#22301F] mt-0.5">{enrollmentRecords.length}</h4>
              </div>
            </div>
            
            <div className="bg-[#FFF1F3] border border-[#DDD5C3]/70 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="p-3.5 bg-amber-100 text-[#87652A] rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8CA394] font-bold">Active Programs</p>
                <h4 className="text-2xl font-serif font-extrabold text-[#22301F] mt-0.5">
                  {sortedCourseStats.filter(c => c.count > 0).length} / {courses.length}
                </h4>
              </div>
            </div>
            
            <div className="bg-[#FFF1F3] border border-[#DDD5C3]/70 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="p-3.5 bg-[#8A5A4D]/10 text-[#8A5A4D] rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8CA394] font-bold">Popular Program</p>
                <h4 className="text-sm font-serif font-bold text-[#22301F] truncate mt-0.5" title={sortedCourseStats[0]?.title || "None yet"}>
                  {sortedCourseStats[0]?.count > 0 ? sortedCourseStats[0].title : "N/A"}
                </h4>
              </div>
            </div>
          </div>

          {/* Registration Trends Chart Section */}
          <div className="bg-white border border-[#DDD5C3] rounded-3xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-serif font-extrabold text-[#22301F] text-base">Registration Trends</h3>
              <p className="text-xs text-[#5B5648] font-light">Daily course enrollment counts showing peak registration periods.</p>
            </div>
            
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={registrationTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22301F" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22301F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDD5C3" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#5B5648', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#5B5648', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FCF1F3', 
                      borderColor: '#DDD5C3', 
                      borderRadius: '12px',
                      fontFamily: 'serif',
                      fontSize: '11px',
                      color: '#22301F'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Enrollments"
                    stroke="#22301F" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Manage Class Sizes per Course */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FFF1F3]/40 border border-[#DDD5C3] rounded-3xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-[#22301F] text-base">Class Size Distribution</h3>
                  <p className="text-xs text-[#5B5648] font-light">Click a course card to filter the ledger view below.</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedCourseFilter("all")}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedCourseFilter === "all"
                        ? "bg-[#22301F] text-white border-[#22301F] shadow-sm"
                        : "bg-white/60 hover:bg-[#EDE3CE]/35 border-[#DDD5C3]/60 text-[#22301F]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${selectedCourseFilter === "all" ? "bg-white/10" : "bg-[#22301F]/5"}`}>
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">All Courses Combined</span>
                    </div>
                    <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-full ${
                      selectedCourseFilter === "all" ? "bg-white/20 text-white" : "bg-[#22301F]/10 text-[#22301F]"
                    }`}>
                      {enrollmentRecords.length}
                    </span>
                  </button>

                  <div className="h-[1px] bg-[#DDD5C3]/60 my-2" />

                  {sortedCourseStats.map(c => {
                    const isSelected = selectedCourseFilter === c.id;
                    const pct = enrollmentRecords.length > 0 ? (c.count / enrollmentRecords.length) * 100 : 0;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCourseFilter(c.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#22301F] text-white border-[#22301F] shadow-md"
                            : "bg-white/60 hover:bg-[#EDE3CE]/35 border-[#DDD5C3]/60 text-[#22301F]"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5">
                            <span className={`text-[8px] font-mono uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded-full ${
                              c.category === "women"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {c.category === "women" ? "Women's Dept" : "Kids' Dept"}
                            </span>
                            <h4 className="text-xs font-serif font-extrabold leading-tight mt-1">{c.title}</h4>
                          </div>
                          <span className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                            isSelected ? "bg-white/15 text-white" : "bg-[#22301F]/10 text-[#22301F]"
                          }`}>
                            {c.count} students
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="w-full bg-[#DDD5C3]/30 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isSelected ? "bg-amber-300" : "bg-[#22301F]"
                              }`}
                              style={{ width: `${Math.max(pct, c.count > 0 ? 5 : 0)}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Enrollment Records List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#DDD5C3] rounded-3xl p-6 shadow-sm space-y-6">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DDD5C3]/50 pb-5">
                  <div>
                    <h3 className="font-serif font-extrabold text-[#22301F] text-lg">Registrar Student Ledger</h3>
                    <p className="text-xs text-[#5B5648] font-light">
                      Showing {filteredEnrollments.length} of {enrollmentRecords.length} enrollments
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={fetchEnrollments}
                      disabled={loadingEnrollments}
                      className="p-2.5 rounded-xl border border-[#DDD5C3] hover:bg-[#EDE3CE]/30 text-[#22301F] cursor-pointer transition-colors"
                      title="Refresh student records"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingEnrollments ? "animate-spin" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      disabled={filteredEnrollments.length === 0}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#22301F] text-white hover:bg-[#33453A] font-sans text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Copy CSV Ledger</span>
                    </button>
                  </div>
                </div>

                {/* CSV status bubble */}
                {copyStatus && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl px-4 py-3 text-xs font-medium animate-fade-in">
                    {copyStatus}
                  </div>
                )}

                {/* Controls & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA394]" />
                    <input
                      type="text"
                      placeholder="Search student name or email..."
                      value={enrollmentSearch}
                      onChange={(e) => setEnrollmentSearch(e.target.value)}
                      className="w-full bg-[#FFF1F3]/25 border border-[#DDD5C3] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#22301F] focus:outline-none focus:border-[#22301F] placeholder:text-[#8CA394]/70 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={enrollmentSortField}
                      onChange={(e) => setEnrollmentSortField(e.target.value as any)}
                      className="w-full bg-[#FFF1F3]/25 border border-[#DDD5C3] rounded-xl px-3 py-2.5 text-xs text-[#22301F] font-bold focus:outline-none focus:border-[#22301F]"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="name">Sort by Name</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={enrollmentSortOrder}
                      onChange={(e) => setEnrollmentSortOrder(e.target.value as any)}
                      className="w-full bg-[#FFF1F3]/25 border border-[#DDD5C3] rounded-xl px-3 py-2.5 text-xs text-[#22301F] font-bold focus:outline-none focus:border-[#22301F]"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>

                {/* Main Table / Mobile Cards */}
                {loadingEnrollments ? (
                  <div className="flex flex-col items-center justify-center py-20 text-[#8CA394] space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p className="text-xs font-mono tracking-wider uppercase font-bold">Synchronizing Student Database...</p>
                  </div>
                ) : filteredEnrollments.length === 0 ? (
                  <div className="text-center py-16 bg-[#FFF1F3]/20 rounded-2xl border border-dashed border-[#DDD5C3]/80 space-y-2">
                    <Users className="w-8 h-8 mx-auto text-[#8CA394]" />
                    <h4 className="font-serif font-bold text-[#22301F] text-sm">No Enrollment Matches Found</h4>
                    <p className="text-xs text-[#5B5648] font-light max-w-md mx-auto px-4">
                      Try resetting your course selection filters or entering a different search query in the field.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#DDD5C3]/60 rounded-2xl bg-white shadow-xs">
                    {/* Desktop View */}
                    <table className="hidden md:table w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FFF1F3]/50 border-b border-[#DDD5C3]/60 text-[10px] font-mono text-[#8CA394] uppercase tracking-wider font-extrabold">
                          <th className="p-4 pl-5">Student</th>
                          <th className="p-4">Program Enrolled</th>
                          <th className="p-4">Enrollment Date</th>
                          <th className="p-4">Intake Status</th>
                          <th className="p-4 pr-5 text-right">Profile</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DDD5C3]/40">
                        {filteredEnrollments.map((record, idx) => {
                          const dateObj = record.enrolledAt ? new Date(record.enrolledAt) : null;
                          const formattedDate = dateObj 
                            ? dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                            : "N/A";
                          
                          return (
                            <tr 
                              key={`${record.uid}-${record.courseId}-${idx}`}
                              className="hover:bg-[#FFF1F3]/10 transition-colors"
                            >
                              <td className="p-4 pl-5">
                                <div className="flex items-center gap-3">
                                  {record.photoURL ? (
                                    <img
                                      src={record.photoURL}
                                      alt={record.displayName}
                                      className="w-8 h-8 rounded-full border border-[#DDD5C3] shrink-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#EDE3CE] flex items-center justify-center font-serif text-xs font-bold text-[#22301F] border border-[#DDD5C3] shrink-0">
                                      {record.displayName?.[0] || "U"}
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-serif font-extrabold text-[#22301F] leading-tight text-xs">{record.displayName}</h4>
                                    <p className="text-[10px] font-mono text-[#8CA394] leading-normal">{record.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="font-serif font-bold text-[#22301F] leading-snug">{record.courseTitle}</div>
                              </td>
                              <td className="p-4 font-mono text-xs font-bold text-[#5B5648] whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-[#8CA394]" />
                                  <span>{formattedDate}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>{record.status}</span>
                                </span>
                              </td>
                              <td className="p-4 pr-5 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudentForModal(record)}
                                  className="inline-flex items-center gap-1 bg-[#22301F] text-white hover:bg-[#33453A] font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                                >
                                  <span>Details</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-[#DDD5C3]/40">
                      {filteredEnrollments.map((record, idx) => {
                        const dateObj = record.enrolledAt ? new Date(record.enrolledAt) : null;
                        const formattedDate = dateObj 
                          ? dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                          : "N/A";
                        
                        return (
                          <div 
                            key={`mob-${record.uid}-${record.courseId}-${idx}`}
                            className="p-4 space-y-3.5 hover:bg-[#FFF1F3]/10"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                {record.photoURL ? (
                                  <img
                                    src={record.photoURL}
                                    alt={record.displayName}
                                    className="w-9 h-9 rounded-full border border-[#DDD5C3] shrink-0"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-[#EDE3CE] flex items-center justify-center font-serif text-sm font-bold text-[#22301F] border border-[#DDD5C3] shrink-0">
                                    {record.displayName?.[0] || "U"}
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-serif font-extrabold text-[#22301F] text-xs leading-tight">{record.displayName}</h4>
                                  <p className="text-[10px] font-mono text-[#8CA394] leading-normal">{record.email}</p>
                                </div>
                              </div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                {record.status}
                              </span>
                            </div>

                            <div className="bg-[#FFF1F3]/20 rounded-xl p-3 border border-[#DDD5C3]/40 space-y-1">
                              <p className="text-[9px] font-mono uppercase tracking-widest text-[#8CA394] font-extrabold">Program Enrolled</p>
                              <h5 className="font-serif font-extrabold text-[#22301F] text-xs leading-snug">{record.courseTitle}</h5>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5 font-mono text-[#5B5648] font-bold">
                                <Calendar className="w-3.5 h-3.5 text-[#8CA394]" />
                                <span>Enrolled: {formattedDate}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedStudentForModal(record)}
                                className="inline-flex items-center gap-1 bg-[#22301F] text-white hover:bg-[#33453A] font-sans text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                              >
                                <span>Details</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
          
        </div>
      )}

      {/* Student Details Intake Profile Modal Backdrop & Card */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#FFDFE4] border border-[#DDD5C3] shadow-2xl rounded-3xl w-full max-w-xl overflow-hidden animate-fade-in flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#DDD5C3]/60 flex justify-between items-center bg-[#FFDFE4]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#22301F]/10 text-[#22301F] rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-extrabold text-[#22301F] uppercase tracking-wider">
                    Student Registrar Card
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider uppercase text-[#8CA394] font-bold">
                    Official Admissions Profile Record
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForModal(null)}
                className="p-2 text-[#22301F] hover:bg-[#EDE3CE]/50 rounded-full transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Student Overview Row */}
              <div className="flex items-center gap-4 bg-white/50 border border-[#DDD5C3]/60 rounded-2xl p-4">
                {selectedStudentForModal.photoURL ? (
                  <img
                    src={selectedStudentForModal.photoURL}
                    alt={selectedStudentForModal.displayName}
                    className="w-16 h-16 rounded-full border border-[#DDD5C3] shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#EDE3CE] flex items-center justify-center font-serif text-2xl font-bold text-[#22301F] border border-[#DDD5C3] shrink-0">
                    {selectedStudentForModal.displayName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <h4 className="font-serif text-lg font-extrabold text-[#22301F] leading-tight">
                    {selectedStudentForModal.displayName}
                  </h4>
                  <p className="text-xs text-[#5B5648] font-bold mt-0.5">{selectedStudentForModal.email}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-extrabold bg-[#22301F]/10 text-[#22301F]">
                      UID: {selectedStudentForModal.uid.slice(0, 8)}...
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active Student
                    </span>
                  </div>
                </div>
              </div>

              {/* Class Intake Status Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFF1F3]/40 border border-[#DDD5C3]/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-[#8CA394] font-extrabold">Program Enrolled</span>
                  <h5 className="font-serif font-extrabold text-[#22301F] text-xs leading-snug">
                    {selectedStudentForModal.courseTitle}
                  </h5>
                </div>

                <div className="bg-[#FFF1F3]/40 border border-[#DDD5C3]/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-[#8CA394] font-extrabold">Admissions Timestamp</span>
                  <h5 className="font-mono text-xs font-extrabold text-[#22301F] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8CA394]" />
                    <span>
                      {selectedStudentForModal.enrolledAt 
                        ? new Date(selectedStudentForModal.enrolledAt).toLocaleString("en-US", { 
                            year: "numeric", 
                            month: "short", 
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "N/A"
                      }
                    </span>
                  </h5>
                </div>
              </div>

              {/* Educational background, age & goals */}
              <div className="space-y-4">
                <h4 className="font-serif text-xs font-extrabold uppercase tracking-wider text-[#22301F] pb-1.5 border-b border-[#DDD5C3]/60">
                  Student Registration Dossier
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 bg-white/40 p-3 rounded-xl border border-[#DDD5C3]/40">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-[#8CA394] font-bold">Age Demographic</p>
                    <p className="text-xs font-semibold text-[#22301F]">
                      {selectedStudentForModal.ageGroup || "Not declared"}
                    </p>
                  </div>
                  
                  <div className="space-y-1 bg-white/40 p-3 rounded-xl border border-[#DDD5C3]/40 sm:col-span-2">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-[#8CA394] font-bold">Educational / Study Background</p>
                    <p className="text-xs font-semibold text-[#22301F] leading-snug">
                      {selectedStudentForModal.studyBackground || "Not declared"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 bg-white/50 p-4 rounded-xl border border-[#DDD5C3]/50">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#8CA394] font-bold">Primary Educational & Spiritual Goals</p>
                  <p className="text-xs font-medium text-[#22301F] leading-relaxed whitespace-pre-line">
                    {selectedStudentForModal.goals || "No target goals specified by the student during registration."}
                  </p>
                </div>

                <div className="space-y-1.5 bg-white/50 p-4 rounded-xl border border-[#DDD5C3]/50">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#8CA394] font-bold">Student Bio / Custom Notes</p>
                  <p className="text-xs font-medium text-[#22301F] leading-relaxed whitespace-pre-line italic">
                    {selectedStudentForModal.bio ? `"${selectedStudentForModal.bio}"` : "No bio or self-description provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-[#DDD5C3]/60 bg-[#FFDFE4]/40 flex flex-wrap gap-2 justify-end">
              <a
                href={`mailto:${selectedStudentForModal.email}?subject=Qalbiya%20Islamic%20Institute%20-%20Update%20regarding%20your%20enrollment%20in%20${encodeURIComponent(selectedStudentForModal.courseTitle)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#DDD5C3] hover:border-[#22301F] text-[#22301F] hover:bg-[#EDE3CE]/30 font-sans text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4 text-[#8CA394]" />
                <span>Email Student</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedStudentForModal(null)}
                className="px-5 py-2.5 bg-[#22301F] hover:bg-[#33453A] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Floating Toast Alert */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#22301F] border border-[#8CA394]/30 shadow-2xl rounded-2xl p-4 w-80 sm:w-96 text-white animate-slide-in-right space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {activeToast.type === "whatsapp" ? (
                <div className="p-1 bg-[#25D366]/20 rounded text-[#25D366]">
                  <MessageCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1 bg-[#8CA394]/20 rounded text-[#8CA394]">
                  <Inbox className="w-4 h-4" />
                </div>
              )}
              <span className="font-serif font-bold text-xs text-[#E9F0EA]">{activeToast.title}</span>
            </div>
            <button 
              type="button"
              onClick={() => setActiveToast(null)}
              className="text-[#8CA394] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-[#D1DACD] font-light leading-relaxed">
            {activeToast.body}
          </p>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              className="text-[10px] font-mono text-[#D1DACD] hover:text-white cursor-pointer px-2 py-1 font-medium"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => {
                // Switch tab
                setActiveTab("messages");
                // Set filter to search for name
                const namePart = activeToast.body.match(/From ([^:]+):/);
                if (namePart && namePart[1]) {
                  setMessageSearch(namePart[1]);
                }
                setActiveToast(null);
              }}
              className="bg-white hover:bg-gray-100 text-[#22301F] font-bold text-[10px] font-mono px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Respond
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
