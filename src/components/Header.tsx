import React from "react";
import { User } from "firebase/auth";
import { LogOut, BookOpen, Compass, ClipboardList, ShieldAlert, Sparkles, Loader2 } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User | null;
  userRole: "admin" | "student";
  handleLogin: () => void;
  handleLogout: () => void;
  isLoggingIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  user,
  userRole,
  handleLogin,
  handleLogout,
  isLoggingIn,
}) => {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "women", label: "Women Cources" },
    { id: "kids", label: "Kids Cources" },
    { id: "faqs", label: "Course FAQs" },
    { id: "about", label: "About" },
    { id: "portal", label: "My Portal" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCF1F3]/95 backdrop-blur-md border-b border-[#DDD5C3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Editorial Brand */}
          <div 
            onClick={() => setCurrentTab("home")}
            className="flex flex-col cursor-pointer group"
          >
            <h1 className="font-serif text-2xl tracking-[0.18em] font-bold text-[#22301F] group-hover:text-[#33453A] transition-colors uppercase">
              Qalbiya
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8CA394] group-hover:text-[#B0863A] transition-colors -mt-0.5">
              Islamic Institute
            </p>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative py-2 text-xs uppercase tracking-widest font-semibold transition-colors duration-300 ${
                    isActive 
                      ? "text-[#22301F]" 
                      : "text-[#5B5648] hover:text-[#22301F]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B98072]" />
                  )}
                </button>
              );
            })}

            {/* Display Organizers' Desk optionally if user is logged in and is an admin */}
            {user && userRole === "admin" && (
              <button
                onClick={() => setCurrentTab("analytics")}
                className={`flex items-center gap-1.5 py-2 text-xs uppercase tracking-widest font-bold transition-colors duration-300 ${
                  currentTab === "analytics"
                    ? "text-[#8A5A4D]"
                    : "text-[#8A5A4D]/80 hover:text-[#8A5A4D]"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Organizers' Desk</span>
                <span className="px-1.5 py-0.5 bg-[#F1E2DC] text-[#8A5A4D] border border-[#DDD5C3]/40 rounded text-[8px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              </button>
            )}
          </nav>

          {/* User Sign-In Action Block */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-bold text-[#22301F] leading-tight">
                    {user.displayName}
                  </span>
                  <span className="text-[10px] font-mono text-[#8CA394] capitalize">
                    {userRole} Member
                  </span>
                </div>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border border-[#DDD5C3] shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#EDE3CE] flex items-center justify-center font-serif text-sm text-[#22301F] border border-[#DDD5C3]">
                    {user.displayName?.[0] || "U"}
                  </div>
                )}
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#5B5648] hover:text-[#22301F] hover:bg-[#EDE3CE]/40 rounded-full transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isLoggingIn ? (
              <button disabled className="flex items-center gap-2 px-4 py-2 border border-[#DDD5C3] rounded-full text-xs font-medium text-[#5B5648] bg-[#FCF1F3]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8CA394]" />
                <span>Signing in...</span>
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                className="gsi-material-button group cursor-pointer"
                style={{
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  appearance: "none",
                  backgroundColor: "#FBF8F1",
                  borderColor: "#DDD5C3",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderRadius: "20px",
                  boxSizing: "border-box",
                  color: "#2B2A25",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "36px",
                  padding: "0 16px",
                  position: "relative",
                  width: "auto",
                  transition: "background-color .218s, border-color .218s, box-shadow .218s"
                }}
              >
                <div className="gsi-material-button-icon flex items-center justify-center mr-2">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block", width: "16px", height: "16px" }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-sans text-xs font-semibold tracking-wide">
                  Sign in with Google
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
