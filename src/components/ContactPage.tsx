import React, { useState } from "react";
import { submitContactForm } from "../lib/firebase";
import { Mail, Phone, MapPin, Clock, ShieldCheck, ArrowUpRight, Send, CheckCircle2 } from "lucide-react";

export function ContactPage() {
  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactTopic, setContactTopic] = useState("General Inquiry");
  const [contactChannel, setContactChannel] = useState<"email" | "whatsapp">("email");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactForm({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        topic: contactTopic,
        channel: contactChannel,
        message: contactMessage
      });
      setSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in text-left" id="contact-admissions-page">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <span className="text-[10px] uppercase font-bold font-mono tracking-[0.25em] text-[#8CA394]">
          Support & Admissions Hub
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
          Admissions Office & Registrar Desk
        </h2>
        <p className="text-[#5B5648] text-sm max-w-xl mx-auto font-light leading-relaxed">
          Submit your educational dossier, request 1-on-1 consultations, or directly contact our registrar on WhatsApp. Our advisors review all inquiries daily.
        </p>
        <div className="w-12 h-[1.5px] bg-[#B98072] mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Office Coordinates & WhatsApp Box (5 cols) */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          
          <div className="space-y-6">
            <div className="bg-[#FBF8F1] border border-[#DDD5C3] rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#22301F] border-b border-[#DDD5C3]/40 pb-2.5">
                Office Coordinates
              </h3>

              <div className="space-y-4 text-xs font-sans text-[#5B5648]">
                <div className="flex gap-3.5 items-start">
                  <MapPin className="w-4 h-4 text-[#8CA394] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-[#22301F]">HQ admissions</h4>
                    <p className="font-light">Virtual Cohorts Worldwide</p>
                    <p className="text-[10px] text-gray-400 font-mono">Kolkata, West Bengal, India</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <Mail className="w-4 h-4 text-[#8CA394] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-[#22301F]">Email Registrar</h4>
                    <a href="mailto:qalbiyaislamicinstitute@gmail.com" className="font-light underline hover:text-[#B98072]">
                      qalbiyaislamicinstitute@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <Phone className="w-4 h-4 text-[#8CA394] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-[#22301F]">Admissions Desk</h4>
                    <p className="font-light">WhatsApp: +91 81453 63290</p>
                    <p className="font-light">Alternative: +1 (800) 555-DEEN</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <Clock className="w-4 h-4 text-[#8CA394] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-[#22301F]">Admissions Hours</h4>
                    <p className="font-light">Monday &ndash; Friday: 9:00 AM &ndash; 6:00 PM (IST)</p>
                    <p className="font-light">Weekends (Emergency): 10:00 AM &ndash; 2:00 PM (IST)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#DDD5C3]/40 bg-[#FAF9F6]/40 p-4 rounded-xl text-[11px] text-gray-400 font-light">
            <span>Our admissions coordinates are hosted securely using high-contrast platforms. All user data, files, and chat logs are bound to standard institutional security parameters.</span>
          </div>

        </div>

        {/* Right: Direct Admissions Dossier Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#FBF8F1] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A5A4D] font-bold block">
              Inquiry Dossier
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#22301F]">
              Submit an Admissions Case
            </h3>
            <p className="text-xs text-[#5B5648] font-light">
              Send our administrative staff a direct email query. Case dossiers are logged securely in our organizers' database and responded to within 12 hours.
            </p>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 py-10">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                ✓
              </div>
              <h4 className="font-serif font-bold text-[#22301F]">Inquiry Submitted Successfully</h4>
              <p className="text-xs text-[#5B5648] leading-relaxed max-w-sm mx-auto">
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
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Amina Siddiqui"
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#8CA394]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="amina@example.com"
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#8CA394]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 81453 63290"
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#8CA394]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                  Topic of Interest
                </label>
                <select
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
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Assalamu alaikum, I would like to inquire about..."
                  rows={4}
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#8CA394] resize-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#22301F] hover:bg-[#33453A] disabled:bg-[#DDD5C3] text-white disabled:text-gray-400 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-bold cursor-pointer transition-all active:scale-95 shadow-sm inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Case to Registrar"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
