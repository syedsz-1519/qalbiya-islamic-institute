import React, { useState, useEffect } from "react";
import { ClipboardList, Menu, X, ChevronRight, MapPin, Mail, Phone, ChevronDown, ChevronUp, Sun, Moon } from "lucide-react";
import { LogoSVG } from "./LogoSVG";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole?: "admin" | "student";
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  userRole = "student",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(currentTab === "women" || currentTab === "kids");

  const [isDark, setIsDark] = useState(() => {
    try {
      return document.documentElement.classList.contains("dark") || localStorage.getItem("qalbiya_theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("qalbiya_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("qalbiya_theme", "light");
    }
  }, [isDark]);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "resources", label: "Resources" },
    { id: "scholarship", label: "Scholarship" },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleEnrollNow = () => {
    setCurrentTab("home");
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById("flagship-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-all duration-300 bg-[#FAF4F2]/95 border-[#DDD5C3] dark:bg-[#0B0E0A]/95 dark:border-[#243524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Editorial Brand */}
          <div 
            onClick={() => handleTabClick("home")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-12 h-12 bg-[#FAF4F2] dark:bg-[#0B0E0A] rounded-full overflow-hidden border border-[#DFBA73]/50 group-hover:border-[#DFBA73] flex items-center justify-center shadow-[0_0_10px_rgba(223,186,115,0.1)] group-hover:shadow-[0_0_15px_rgba(223,186,115,0.3)] transition-all duration-300">
              <LogoSVG 
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" 
                fillColor="#5C061B" 
              />
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-xl tracking-[0.15em] font-bold transition-colors uppercase text-[#22301F] group-hover:text-[#33453A]">
                Qalbiya
              </h1>
              <p className="font-mono text-[8px] uppercase tracking-[0.25em] transition-colors -mt-0.5 text-[#8CA394] group-hover:text-[#B0863A]">
                Islamic Institute
              </p>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2 xl:space-x-5">
            {navItems.slice(0, 2).map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative py-1 px-1 lg:px-1.5 xl:px-2 text-[9px] lg:text-[10px] xl:text-[11px] uppercase tracking-wider xl:tracking-widest font-bold transition-colors duration-300 ${
                    isActive 
                      ? "text-[#22301F] dark:text-[#FAF4F2]" 
                      : "text-[#5B5648] dark:text-[#ABB9AB] hover:text-[#22301F] dark:hover:text-[#FAF4F2]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-[-10px] left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#B98072] to-transparent shadow-[0_0_8px_rgba(185,128,114,0.6)] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Courses Dropdown */}
            <div className="relative group py-1">
              <button
                className={`flex items-center gap-1 py-1 px-1 lg:px-1.5 xl:px-2 text-[9px] lg:text-[10px] xl:text-[11px] uppercase tracking-wider xl:tracking-widest font-bold transition-colors duration-300 cursor-pointer ${
                  currentTab === "women" || currentTab === "kids"
                    ? "text-[#22301F] dark:text-[#FAF4F2]"
                    : "text-[#5B5648] dark:text-[#ABB9AB] hover:text-[#22301F] dark:hover:text-[#FAF4F2]"
                }`}
              >
                <span>Courses</span>
                <ChevronDown className="w-3 h-3 text-[#8CA394] group-hover:rotate-180 transition-transform" />
                {(currentTab === "women" || currentTab === "kids") && (
                  <span className="absolute bottom-[-10px] left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#B98072] to-transparent shadow-[0_0_8px_rgba(185,128,114,0.6)] rounded-full" />
                )}
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-[#0B0E0A] border border-[#DDD5C3] dark:border-[#243524] rounded-2xl shadow-xl py-2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <button
                  onClick={() => handleTabClick("women")}
                  className={`w-full text-left px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                    currentTab === "women"
                      ? "bg-[#FAF8F1] dark:bg-[#111610] text-[#8A5A4D] dark:text-[#E0A395]"
                      : "text-[#22301F] dark:text-[#FAF4F2] hover:bg-[#FAF8F1] dark:hover:bg-[#111610] hover:text-[#8A5A4D] dark:hover:text-[#E0A395]"
                  }`}
                >
                  Women's Courses
                </button>
                <button
                  onClick={() => handleTabClick("kids")}
                  className={`w-full text-left px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                    currentTab === "kids"
                      ? "bg-[#FAF8F1] dark:bg-[#111610] text-[#8A5A4D] dark:text-[#E0A395]"
                      : "text-[#22301F] dark:text-[#FAF4F2] hover:bg-[#FAF8F1] dark:hover:bg-[#111610] hover:text-[#8A5A4D] dark:hover:text-[#E0A395]"
                  }`}
                >
                  Kids' Courses
                </button>
              </div>
            </div>

            {navItems.slice(2).map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative py-1 px-1 lg:px-1.5 xl:px-2 text-[9px] lg:text-[10px] xl:text-[11px] uppercase tracking-wider xl:tracking-widest font-bold transition-colors duration-300 ${
                    isActive 
                      ? "text-[#22301F] dark:text-[#FAF4F2]" 
                      : "text-[#5B5648] dark:text-[#ABB9AB] hover:text-[#22301F] dark:hover:text-[#FAF4F2]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-[-10px] left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#B98072] to-transparent shadow-[0_0_8px_rgba(185,128,114,0.6)] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Display Organizers' Desk optionally if user is an admin */}
            {userRole === "admin" && (
              <button
                onClick={() => handleTabClick("analytics")}
                className={`flex items-center gap-1.5 py-2 text-xs uppercase tracking-widest font-bold transition-colors duration-300 ${
                  currentTab === "analytics"
                    ? "text-[#8A5A4D] dark:text-[#E0A395]"
                    : "text-[#8A5A4D]/80 dark:text-[#E0A395]/80 hover:text-[#8A5A4D] dark:hover:text-[#E0A395]"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Organizers' Desk</span>
                <span className="px-1.5 py-0.5 border rounded text-[8px] font-bold uppercase tracking-wider bg-[#F1E2DC] dark:bg-[#2E402D] text-[#8A5A4D] dark:text-[#ECE5D8] border-[#DDD5C3]/40 dark:border-[#243524]">
                  Admin
                </span>
              </button>
            )}
          </nav>

          {/* Desktop Action block - Prominent "Enroll Now" Button */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full border border-[#DDD5C3]/40 dark:border-[#243524] hover:bg-[#EDE3CE]/30 dark:hover:bg-[#2E402D]/40 text-[#22301F] dark:text-[#FAF4F2] transition-all duration-300 cursor-pointer shadow-sm"
              title={isDark ? "Switch to Day Mode" : "Switch to Evening Study Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#DFBA73] animate-pulse" />
              ) : (
                <Moon className="w-4 h-4 text-[#5B5648] hover:text-[#B98072]" />
              )}
            </button>
            <button
              onClick={handleEnrollNow}
              className="px-5 py-2.5 bg-[#B98072] hover:bg-[#8A5A4D] text-white font-serif text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 shadow-md active:scale-95 cursor-pointer"
            >
              Enroll Now
            </button>
          </div>

          {/* Hamburger Menu Toggle (Mobile) with miniature Enroll CTA */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={handleEnrollNow}
              className="px-3.5 py-1.5 bg-[#B98072] hover:bg-[#8A5A4D] text-white font-serif text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-sm cursor-pointer"
            >
              Enroll
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl transition-all cursor-pointer text-[#22301F] hover:bg-[#EDE3CE]/40"
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
          className="md:hidden fixed inset-0 w-full h-full shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-slide-in-right transition-colors duration-350 bg-[#FAF4F2] dark:bg-[#0B0E0A]"
          id="mobile-nav-drawer"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b flex justify-between items-center transition-colors border-[#DDD5C3]/60 dark:border-[#243524] bg-[#FAF4F2] dark:bg-[#0B0E0A]">
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-full border border-[#DDD5C3]/40 dark:border-[#243524] text-[#22301F] dark:text-[#FAF4F2] hover:bg-[#EDE3CE]/50 dark:hover:bg-[#2E402D]/40 transition-all cursor-pointer shrink-0"
              title={isDark ? "Switch to Day Mode" : "Switch to Evening Study Mode"}
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-[#DFBA73] animate-pulse" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-[#5B5648]" />
              )}
            </button>
            <div className="flex-grow text-center pr-10">
              <h2 className="font-serif text-xl tracking-widest font-bold uppercase text-[#22301F] dark:text-[#FAF4F2]">
                Qalbiya
              </h2>
              <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#8CA394] dark:text-[#7E9C7E]">
                Islamic Institute
              </p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-full transition-all cursor-pointer shrink-0 text-[#22301F] dark:text-[#FAF4F2] hover:bg-[#EDE3CE]/50 dark:hover:bg-[#2E402D]/40"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Main Navigation & CTA */}
          <div className="flex-grow flex flex-col justify-center px-6 py-8 space-y-8 max-w-md mx-auto w-full">
            
            <div className="text-center">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] pb-2 border-b inline-block px-4 font-bold text-[#8CA394] dark:text-[#7E9C7E] border-[#DDD5C3]/30 dark:border-[#243524]">
                Menu Sections
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 w-full">
              {navItems.slice(0, 2).map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-center py-3.5 px-6 rounded-2xl text-center text-sm uppercase tracking-wider font-extrabold transition-all border-2 ${
                      isActive 
                        ? "bg-[#22301F] dark:bg-[#FAF4F2] text-white dark:text-[#0B0E0A] border-[#22301F] dark:border-[#FAF4F2] shadow-md" 
                        : "text-[#22301F] dark:text-[#FAF4F2] hover:bg-[#EDE3CE]/45 dark:hover:bg-[#2E402D]/40 border-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Courses Accordion for Mobile */}
              <div className="w-full border border-dashed border-[#DDD5C3] dark:border-[#243524] rounded-2xl overflow-hidden bg-[#FAF8F1]/40 dark:bg-[#111610]/40">
                <button
                  onClick={() => setIsMobileCoursesOpen(!isMobileCoursesOpen)}
                  className="w-full flex items-center justify-between py-3.5 px-6 text-sm uppercase tracking-wider font-extrabold text-[#22301F] dark:text-[#FAF4F2] cursor-pointer"
                >
                  <span>Courses</span>
                  {isMobileCoursesOpen ? <ChevronUp className="w-4 h-4 text-[#8A5A4D] dark:text-[#E0A395]" /> : <ChevronDown className="w-4 h-4 text-[#8CA394] dark:text-[#7E9C7E]" />}
                </button>
                {isMobileCoursesOpen && (
                  <div className="bg-white dark:bg-[#0B0E0A] border-t border-[#DDD5C3]/40 dark:border-[#243524] p-2 space-y-1">
                    <button
                      onClick={() => handleTabClick("women")}
                      className={`w-full py-2.5 px-4 rounded-xl text-left text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                        currentTab === "women"
                          ? "bg-[#FAF8F1] dark:bg-[#111610] text-[#8A5A4D] dark:text-[#E0A395]"
                          : "text-[#22301F] dark:text-[#FAF4F2] hover:bg-[#FAF8F1]/50 dark:hover:bg-[#111610]/50"
                      }`}
                    >
                      Women's Courses
                    </button>
                    <button
                      onClick={() => handleTabClick("kids")}
                      className={`w-full py-2.5 px-4 rounded-xl text-left text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                        currentTab === "kids"
                          ? "bg-[#FAF8F1] dark:bg-[#111610] text-[#8A5A4D] dark:text-[#E0A395]"
                          : "text-[#22301F] dark:text-[#FAF4F2] hover:bg-[#FAF8F1]/50 dark:hover:bg-[#111610]/50"
                      }`}
                    >
                      Kids' Courses
                    </button>
                  </div>
                )}
              </div>

              {navItems.slice(2).map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-center py-3.5 px-6 rounded-2xl text-center text-sm uppercase tracking-wider font-extrabold transition-all border-2 ${
                      isActive 
                        ? "bg-[#22301F] dark:bg-[#FAF4F2] text-white dark:text-[#0B0E0A] border-[#22301F] dark:border-[#FAF4F2] shadow-md" 
                        : "text-[#22301F] dark:text-[#FAF4F2] hover:bg-[#EDE3CE]/45 dark:hover:bg-[#2E402D]/40 border-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Organizer Desk Link if Admin */}
              {userRole === "admin" && (
                <button
                  onClick={() => handleTabClick("analytics")}
                  className={`w-full flex items-center justify-center py-4 px-6 rounded-2xl text-center text-sm uppercase tracking-wider font-extrabold transition-all border-2 ${
                    currentTab === "analytics"
                      ? "bg-[#8A5A4D] dark:bg-[#E0A395] text-white dark:text-[#0B0E0A] border-[#8A5A4D] dark:border-[#E0A395] shadow-md"
                      : "text-[#8A5A4D] dark:text-[#E0A395] hover:bg-[#8A5A4D]/10 dark:hover:bg-[#2E402D]/20 border-transparent"
                  }`}
                >
                  <ClipboardList className="w-4 h-4 mr-2 shrink-0" />
                  <span>Organizers' Desk (Admin)</span>
                </button>
              )}
            </div>

            {/* Enroll CTA Block in Mobile Drawer */}
            <div className="pt-6 border-t space-y-4 w-full text-center border-[#DDD5C3]/40 dark:border-[#243524]">
              <button
                onClick={handleEnrollNow}
                className="w-full inline-flex justify-center items-center gap-2 py-4 px-6 rounded-2xl text-sm uppercase tracking-wider font-extrabold transition-all bg-[#B98072] text-white hover:bg-[#8A5A4D] shadow-md cursor-pointer"
              >
                <span>Enroll in a Course</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Drawer Footer Links */}
          <div className="p-6 border-t space-y-4 text-xs w-full transition-colors border-[#DDD5C3]/60 dark:border-[#243524] bg-[#FAF4F2]/40 dark:bg-[#0B0E0A]/40">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-center font-bold text-[#8CA394] dark:text-[#7E9C7E]">
              Contact & Support
            </p>
            <div className="flex flex-col items-center space-y-3 font-serif font-semibold text-center text-[#22301F] dark:text-[#FAF4F2]">
              <div className="flex flex-col items-center gap-1">
                <MapPin className="w-4 h-4 text-[#8CA394] dark:text-[#7E9C7E]" />
                <span className="leading-tight text-[11px]">Kolkata, West Bengal, India</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Mail className="w-4 h-4 text-[#8CA394] dark:text-[#7E9C7E]" />
                <a href="mailto:qalbiyaislamicinstitute@gmail.com" className="text-[11px] underline hover:text-[#8A5A4D] dark:hover:text-[#E0A395]">
                  qalbiyaislamicinstitute@gmail.com
                </a>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Phone className="w-4 h-4 text-[#8CA394] dark:text-[#7E9C7E]" />
                <a href="https://wa.me/918145363290" className="text-[11px] hover:text-[#8A5A4D] dark:hover:text-[#E0A395]">
                  +91 81453 63290
                </a>
              </div>
            </div>
            <div className="pt-2 border-t text-center text-[10px] font-mono font-bold border-[#DDD5C3]/30 dark:border-[#243524] text-[#8CA394] dark:text-[#7E9C7E]">
              © 2026 Qalbiya Islamic Institute
            </div>
          </div>

        </div>
      )}
    </header>
  );
};
