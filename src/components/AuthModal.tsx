import React, { useState } from "react";
import { User } from "firebase/auth";
import { googleSignIn, emailLogIn, emailSignUp, getUserRole, getUserProfile } from "../lib/firebase";
import { X, Mail, Lock, User as UserIcon, Sparkles, AlertCircle, Info, ShieldCheck } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, role: "admin" | "student", profile: any) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setWarningMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        const role = await getUserRole(result.user.uid);
        const profile = await getUserProfile(result.user.uid);
        onAuthSuccess(result.user, role, profile);
        onClose();
      }
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      if (err.code === "auth/popup-closed-by-user" || err.message?.includes("popup-closed-by-user") || err.message?.includes("popup")) {
        setWarningMessage(
          "The Google sign-in popup was blocked or closed before completion. If popups are restricted in your browser, please feel free to create an account or sign in using the Email & Password form below!"
        );
      } else {
        setError(err.message || "An unexpected error occurred during Google sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !displayName)) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    setWarningMessage(null);
    try {
      let loggedInUser: User;
      if (mode === "signup") {
        loggedInUser = await emailSignUp(email, password, displayName);
      } else {
        loggedInUser = await emailLogIn(email, password);
      }

      const role = await getUserRole(loggedInUser.uid);
      const profile = await getUserProfile(loggedInUser.uid);
      onAuthSuccess(loggedInUser, role, profile);
      onClose();
    } catch (err: any) {
      console.error("Email auth failed:", err);
      let errMsg = err.message || "Authentication failed.";
      if (err.code === "auth/email-already-in-use") {
        errMsg = "This email is already in use. Try signing in instead!";
      } else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errMsg = "Incorrect email or password. Please verify your credentials.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Password must be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="auth-modal-container">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#22301F]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        id="auth-modal-backdrop"
      />

      {/* Modal Card */}
      <div 
        className="relative bg-[#FFDFE4] border border-[#DDD5C3] rounded-[32px] shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6 z-10 overflow-hidden animate-fade-in"
        id="auth-modal-card"
      >
        {/* Top Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#8CA394]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-[#5B5648] transition-colors cursor-pointer"
          id="auth-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8CA394]/10 border border-[#8CA394]/20 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#22301F] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8CA394]" />
            <span>Secure Access</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#22301F]">
            {mode === "login" ? "Student Workspace Login" : "Begin Your Study Path"}
          </h3>
          <p className="text-xs text-[#5B5648] font-light leading-relaxed max-w-sm mx-auto">
            {mode === "login" 
              ? "Access your registered semesters, interactive visual syllabi, and bookmarks instantly."
              : "Register your secure profile to begin bookmarking courses and recording syllabus progress."}
          </p>
        </div>

        {/* Warning Chime/Alert for popup blocking */}
        {warningMessage && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl flex items-start gap-2.5 leading-relaxed" id="auth-modal-warning">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Popup Request Blocked</span>
              <span>{warningMessage}</span>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl flex items-start gap-2.5 leading-relaxed animate-shake" id="auth-modal-error">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Failed to Authenticate</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Google Sign-in Trigger */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-white border border-[#DDD5C3] hover:border-[#8CA394] text-[#2B2A25] font-sans text-xs font-semibold rounded-2xl transition-all duration-300 shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            id="auth-modal-google-btn"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>{loading ? "Authenticating..." : "Continue with Google"}</span>
          </button>

          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] bg-[#DDD5C3]/60 flex-grow" />
            <span className="text-[10px] font-mono text-[#5B5648]/50 uppercase tracking-widest font-bold">Or use email</span>
            <div className="h-[1px] bg-[#DDD5C3]/60 flex-grow" />
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#5B5648] font-bold block">
                Full Student Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5648]/40" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Amina Al-Hassan"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#22301F] placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394] transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#5B5648] font-bold block">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5648]/40" />
              <input
                type="email"
                required
                placeholder="amina@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#DDD5C3] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#22301F] placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#5B5648] font-bold block">
              Secure Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5648]/40" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#DDD5C3] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#22301F] placeholder-[#5B5648]/40 focus:outline-none focus:border-[#8CA394] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22301F] hover:bg-[#33453A] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-full cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50"
            id="auth-modal-submit-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {loading 
                ? "Processing Request..." 
                : mode === "login" 
                  ? "Sign In" 
                  : "Register Workspace Profile"
              }
            </span>
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="text-center pt-2 border-t border-[#DDD5C3]/40 text-xs text-[#5B5648]">
          {mode === "login" ? (
            <p>
              New to Qalbiya?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setWarningMessage(null);
                }}
                className="text-[#8A5A4D] hover:underline font-bold font-serif cursor-pointer ml-1"
              >
                Create a Student Profile →
              </button>
            </p>
          ) : (
            <p>
              Already have a profile?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setWarningMessage(null);
                }}
                className="text-[#8A5A4D] hover:underline font-bold font-serif cursor-pointer ml-1"
              >
                Sign In Instead →
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
