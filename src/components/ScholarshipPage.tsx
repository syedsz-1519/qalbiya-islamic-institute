import React, { useState } from "react";
import { submitContactForm } from "../lib/firebase";
import { Award, ShieldCheck, HeartHandshake, Check, FileText, Send, Sparkles, HelpCircle, MessageCircle } from "lucide-react";

const BENEFITS = [
  "100% tuition-coverage including textbook sets and software licenses",
  "Assigned personal 1-on-1 female Tajweed mentor",
  "Comprehensive access to recordings, slide decks, and courses",
  "Graduation diplomas and official recommendation references",
  "Opportunities for paid teaching assistant slots in future semesters"
];

const ELIGIBILITY = [
  "Sincere commitment to attending all live course classes weekly",
  "Financial barriers that prevent paying full course tuition rates",
  "Dedication to using the acquired knowledge to serve their immediate families & communities",
  "Ages 16+ for Women's courses, or parent/guardian sponsorship for Kids' courses"
];

export function ScholarshipPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Pre-Diploma in Deeniyat");
  const [financialBackground, setFinancialBackground] = useState("");
  const [dedicationPledge, setDedicationPledge] = useState("");
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeChecked) {
      setErrorMsg("Please accept the Study Dedication Pledge to proceed.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const fullMessage = `
[SCHOLARSHIP APPLICATION DETAILS]
Course of Interest: ${selectedCourse}

Financial Background Statement:
${financialBackground}

Study Dedication Statement:
${dedicationPledge}
      `.trim();

      await submitContactForm({
        name: fullName,
        email,
        phone,
        topic: "Scholarship Application",
        message: fullMessage,
        channel: "email"
      });

      setSuccess(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setFinancialBackground("");
      setDedicationPledge("");
      setPledgeChecked(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in text-left" id="scholarship-admissions-page">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <span className="text-[10px] uppercase font-bold font-mono tracking-[0.25em] text-[#8CA394]">
          Prophetic Legacy Fund
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22301F] tracking-tight">
          Sponsorship & Scholarship Support
        </h2>
        <p className="text-[#5B5648] text-sm max-w-xl mx-auto font-light leading-relaxed">
          Ensuring pristine Deeniyat knowledge remains accessible to every sincere heart, regardless of local financial or geographic constraints.
        </p>
        <div className="w-12 h-[1.5px] bg-[#B98072] mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Column: 3-Step Explainer (7 cols) */}
        <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="bg-[#FAF9F6] dark:bg-[#2D1217]/35 border border-[#DDD5C3] dark:border-[#4A2027] rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#B98072]/15 text-[#8A5A4D] flex items-center justify-center border border-[#B98072]/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#22301F] dark:text-[#FFE5EC]">The Prophetic Legacy Sponsorship</h3>
                  <p className="text-xs text-[#5B5648] dark:text-[#FCD5CE] font-light">Sincere Deen education must be accessible to all</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5B5648] dark:text-[#FCD5CE] font-light leading-relaxed">
                Knowledge is a trust (Amanah) that must never be barred behind pricing walls. Our scholarship scheme provides full tuition coverage for students who exhibit high dedication and genuine financial constraints. Supported by contributions from community sponsors, we grant up to 40 fully covered seats per semester.
              </p>
            </div>

            {/* 3-Step Explainer */}
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#22301F] dark:text-[#FFE5EC] border-b border-[#DDD5C3]/30 pb-3">
                How It Works — The 3-Step Process
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Step 1 */}
                <div className="bg-[#FAF9F6] dark:bg-[#2D1217]/35 border border-[#DDD5C3] dark:border-[#4A2027] p-6 rounded-2xl flex gap-4.5 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#B98072]/15 text-[#B98072] flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#22301F] dark:text-[#FFE5EC]">Submit Application</h4>
                    <p className="text-xs text-[#5B5648] dark:text-[#FCD5CE] font-light leading-relaxed">
                      Sincere candidates declare their financial background, select their course of choice, and write their study dedication pledge.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#FAF9F6] dark:bg-[#2D1217]/35 border border-[#DDD5C3] dark:border-[#4A2027] p-6 rounded-2xl flex gap-4.5 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#B98072]/15 text-[#B98072] flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#22301F] dark:text-[#FFE5EC]">Verification & Interview</h4>
                    <p className="text-xs text-[#5B5648] dark:text-[#FCD5CE] font-light leading-relaxed">
                      Applications are hand-reviewed bi-weekly by Ms. Mustara. Selected candidates will be invited for a brief virtual check-in on WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#FAF9F6] dark:bg-[#2D1217]/35 border border-[#DDD5C3] dark:border-[#4A2027] p-6 rounded-2xl flex gap-4.5 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#B98072]/15 text-[#B98072] flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#22301F] dark:text-[#FFE5EC]">Allocation</h4>
                    <p className="text-xs text-[#5B5648] dark:text-[#FCD5CE] font-light leading-relaxed">
                      Granted students receive full dashboard credentials, textbook shipments, and get allocated a dedicated Tajweed mentor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scholarship Application Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#DDD5C3] rounded-[32px] p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A5A4D] font-bold block">
              Application Portal
            </span>
            <h3 className="font-serif text-xl font-bold text-[#22301F]">
              Submit Sponsorship Case
            </h3>
            <p className="text-xs text-[#5B5648] font-light">
              Fill in your case details. Sincerity and accurate background declarations are required for allocations.
            </p>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 py-10">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                ✓
              </div>
              <h4 className="font-serif font-bold text-[#22301F]">Application Logged</h4>
              <p className="text-xs text-[#5B5648] leading-relaxed">
                Assalamu Alaikum! Your scholarship application has been logged. To fast-track review or ask questions, send a WhatsApp message to our team:
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/918145363290?text=Assalamu%27alaikum!%20I%20have%20submitted%20my%20Scholarship%20Application%20on%20the%20website."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Outreach admissions on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Amina Siddiqui"
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#8CA394]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amina@example.com"
                    className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#8CA394]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 81453 63290"
                    className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#8CA394]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                  Course of Interest
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#8CA394]"
                >
                  <option value="Pre-Diploma in Deeniyat">Pre-Diploma in Deeniyat (Women)</option>
                  <option value="Tajweed 1:1 Mentorship">Tajweed 1:1 Mentorship (Women)</option>
                  <option value="Noorani Qaida for Women">Noorani Qaida for Women</option>
                  <option value="Seerah of the Prophet ﷺ">Seerah of the Prophet ﷺ (Women)</option>
                  <option value="Juniors Deeniyat Mastercourse">Juniors Deeniyat Mastercourse (Kids)</option>
                  <option value="Noorani Qaida for Kids">Noorani Qaida for Kids</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                  Financial Background Declaration *
                </label>
                <textarea
                  required
                  rows={3}
                  value={financialBackground}
                  onChange={(e) => setFinancialBackground(e.target.value)}
                  placeholder="Please describe why a full tuition sponsorship is required to assist your educational goals..."
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#8CA394] resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#5B5648]/80 block mb-1 font-bold">
                  Study Dedication Statement *
                </label>
                <textarea
                  required
                  rows={2}
                  value={dedicationPledge}
                  onChange={(e) => setDedicationPledge(e.target.value)}
                  placeholder="I commit to studying with diligence, attending scheduled classes, and completing my homework assignments..."
                  className="w-full bg-white border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#8CA394] resize-none"
                />
              </div>

              <div className="pt-1.5">
                <label className="flex items-start gap-2.5 text-[11px] text-gray-500 font-light cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pledgeChecked}
                    onChange={(e) => setPledgeChecked(e.target.checked)}
                    className="accent-[#B98072] mt-0.5 shrink-0"
                  />
                  <span>
                    I confirm that the parameters listed above are completely truthful and represent a sincere dedication to Deeniyat studies.
                  </span>
                </label>
              </div>

              {errorMsg && (
                <p className="text-[11px] text-red-500 font-medium font-sans">
                  ⚠️ {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#22301F] hover:bg-[#33453A] text-white disabled:bg-[#DDD5C3] font-mono text-xs uppercase tracking-wider font-bold py-3 rounded-full cursor-pointer transition-all active:scale-95 shadow-sm inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Saving application...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Scholarship Case</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
