import React, { useState } from "react";
import { User } from "firebase/auth";
import { LogOut, BookOpen, Compass, ClipboardList, ShieldAlert, Sparkles, Loader2, Menu, X, ChevronRight, User as UserIcon, MapPin, Mail, Phone, Instagram, MessageCircle } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "women", label: "Women Courses" },
    { id: "kids", label: "Kids Courses" },
    { id: "faqs", label: "Course FAQs" },
    { id: "about", label: "About" },
    { id: "portal", label: "My Portal" },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFDFE4]/95 backdrop-blur-md border-b border-[#DDD5C3] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Editorial Brand */}
          <div 
            onClick={() => handleTabClick("home")}
            className="flex flex-col cursor-pointer group"
          >
            <h1 className="font-serif text-2xl tracking-[0.18em] font-bold text-[#22301F] group-hover:text-[#33453A] transition-colors uppercase">
              Qalbiya
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8CA394] group-hover:text-[#B0863A] transition-colors -mt-0.5">
              Islamic Institute
            </p>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
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
                onClick={() => handleTabClick("analytics")}
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

          {/* Desktop Action block */}
          <div className="hidden md:flex items-center gap-4">
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
                  className="p-2 text-[#5B5648] hover:text-[#22301F] hover:bg-[#EDE3CE]/40 rounded-full transition-all cursor-pointer"
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

          {/* Hamburger Menu Toggle (Mobile) */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <div 
                onClick={() => handleTabClick("portal")}
                className="w-8 h-8 rounded-full bg-[#EDE3CE] flex items-center justify-center font-serif text-xs text-[#22301F] border border-[#DDD5C3] cursor-pointer"
              >
                {user.displayName?.[0] || "U"}
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#22301F] hover:bg-[#EDE3CE]/40 rounded-xl transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300"
          id="mobile-drawer-backdrop"
        />
      )}

      {/* Mobile Slide-out Navigation Drawer Container */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 w-full h-full bg-[#FFDFE4] shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-slide-in-right"
          id="mobile-nav-drawer"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#DDD5C3]/60 flex justify-between items-center bg-[#FFDFE4]">
            <div className="flex-grow text-center pl-8">
              <h2 className="font-serif text-xl tracking-widest font-bold text-[#22301F] uppercase">
                Qalbiya
              </h2>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#8CA394] font-bold">
                Islamic Institute
              </p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 text-[#22301F] hover:bg-[#EDE3CE]/50 rounded-full transition-all cursor-pointer shrink-0"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Main Navigation & Portal */}
          <div className="flex-grow flex flex-col justify-center px-6 py-8 space-y-8 max-w-md mx-auto w-full">
            
            <div className="text-center">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] pb-2 border-b border-[#DDD5C3]/30 inline-block px-4 font-bold">
                Menu Sections
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 w-full">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-center py-4 px-6 rounded-2xl text-center text-sm uppercase tracking-wider font-extrabold transition-all border-2 ${
                      isActive 
                        ? "bg-[#22301F] text-white border-[#22301F] shadow-md" 
                        : "text-[#22301F] hover:bg-[#EDE3CE]/45 border-transparent font-bold"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Organizer Desk Link if Admin */}
              {user && userRole === "admin" && (
                <button
                  onClick={() => handleTabClick("analytics")}
                  className={`w-full flex items-center justify-center py-4 px-6 rounded-2xl text-center text-sm uppercase tracking-wider font-extrabold transition-all border-2 ${
                    currentTab === "analytics"
                      ? "bg-[#8A5A4D] text-white border-[#8A5A4D] shadow-md"
                      : "text-[#8A5A4D] hover:bg-[#8A5A4D]/10 border-transparent font-bold"
                  }`}
                >
                  <ClipboardList className="w-4 h-4 mr-2 shrink-0" />
                  <span>Organizers' Desk (Admin)</span>
                </button>
              )}
            </div>

            {/* Account Block */}
            <div className="pt-6 border-t border-[#DDD5C3]/40 space-y-4 w-full text-center">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] font-bold">
                Portal Account Access
              </p>
              
              {user ? (
                <div className="p-5 bg-[#EDE3CE]/30 rounded-3xl border border-[#DDD5C3]/40 space-y-4 shadow-sm flex flex-col items-center">
                  <div className="flex flex-col items-center gap-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full border border-[#DDD5C3] shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#EDE3CE] flex items-center justify-center font-serif text-base text-[#22301F] border border-[#DDD5C3] font-bold">
                        {user.displayName?.[0] || "U"}
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="text-sm font-bold text-[#22301F] leading-tight">
                        {user.displayName}
                      </h4>
                      <p className="text-[10px] font-mono text-[#8CA394] capitalize">
                        {userRole} Member Profile
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => handleTabClick("portal")}
                      className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 bg-[#22301F] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm hover:bg-[#33453A] transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Student Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full inline-flex justify-center items-center py-3 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 bg-[#22301F] hover:bg-[#33453A] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer font-bold"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Sign In or Register</span>
                </button>
              )}
            </div>

          </div>

          {/* Drawer Footer Links */}
          <div className="p-6 border-t border-[#DDD5C3]/60 bg-[#FFDFE4]/40 space-y-4 text-xs w-full">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8CA394] text-center font-bold">
              Contact & Support
            </p>
            <div className="flex flex-col items-center space-y-3 text-[#22301F] font-serif font-semibold text-center">
              <div className="flex flex-col items-center gap-1">
                <MapPin className="w-4 h-4 text-[#8CA394]" />
                <span className="leading-tight text-[11px]">Kolkata, West Bengal, India</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Mail className="w-4 h-4 text-[#8CA394]" />
                <a href="mailto:qalbiyaislamicinstitute@gmail.com" className="text-[11px] underline hover:text-[#8A5A4D]">
                  qalbiyaislamicinstitute@gmail.com
                </a>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Phone className="w-4 h-4 text-[#8CA394]" />
                <a href="https://wa.me/918145363290" className="text-[11px] hover:text-[#8A5A4D]">
                  +91 81453 63290
                </a>
              </div>
            </div>
            <div className="pt-2 border-t border-[#DDD5C3]/30 text-center text-[10px] font-mono text-[#8CA394] font-bold">
              © 2026 Qalbiya Islamic Institute
            </div>
          </div>

        </div>
      )}
    </header>
  );
};
