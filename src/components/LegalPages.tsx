import React from "react";
import { ShieldCheck, Scale, FileText, Landmark, Clock, ArrowLeft } from "lucide-react";

interface LegalPageProps {
  policyType: "refund" | "terms" | "privacy";
  onBackToHome: () => void;
}

export function LegalPages({ policyType, onBackToHome }: LegalPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12 animate-fade-in text-left font-sans" id="legal-policies-page">
      
      {/* Back to Home action button */}
      <button
        type="button"
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5B5648] hover:text-[#B98072] font-bold cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {policyType === "refund" && (
        <div className="space-y-8 bg-[#FAF9F6] border border-[#DDD5C3] p-8 sm:p-12 rounded-[32px]">
          <div className="space-y-3 border-b border-[#DDD5C3]/40 pb-6">
            <div className="w-12 h-12 bg-[#B98072]/15 text-[#8A5A4D] border border-[#B98072]/20 rounded-full flex items-center justify-center">
              <Landmark className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">Tuition & Refund Policy</h1>
            <p className="text-xs text-gray-400 font-mono">Last updated: June 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">1. Sincerity of Commitment</h3>
              <p>
                At Qalbiya Islamic Institute, class cohorts are highly structured and seat availability is strictly restricted to ensure qualified student-to-teacher ratios. When you enroll, you are securing a position that could have been allocated to another eager student of knowledge. We ask students to consider their commitment with sincere intent.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">2. Refund Timeline Parameters</h3>
              <p>
                Tuition payments for semester-based flagship programs are refundable according to the following strict timeline constraints:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Full Refund (100%):</strong> Requested 14 days or more prior to the scheduled first live lecture of the semester.</li>
                <li><strong>Partial Refund (50%):</strong> Requested within the first week (7 days) after the semester classes commence.</li>
                <li><strong>No Refunds (0%):</strong> Any refund requests logged after 7 days of the active semester start date are not eligible for processing, as seats cannot be reallocated or filled mid-semester.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">3. 1-on-1 Mentorship Sessions</h3>
              <p>
                For our highly custom Tajweed 1:1 Mentorship tracks, hours are scheduled directly with designated instructors. Cancellations or rescheduling requests must be submitted at least 24 hours in advance. No-shows or cancellations within 24 hours are non-refundable and will be counted as completed toward your monthly subscription cycle.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">4. Processing Charges</h3>
              <p>
                A standard processing administrative surcharge of 5% applies to all processed refund transactions to cover card clearing gateways and registration ledger adjustments. All approved refunds are processed and returned to the source payment channel within 7 to 10 bank clearing days.
              </p>
            </section>
          </div>
        </div>
      )}

      {policyType === "terms" && (
        <div className="space-y-8 bg-[#FAF9F6] border border-[#DDD5C3] p-8 sm:p-12 rounded-[32px]">
          <div className="space-y-3 border-b border-[#DDD5C3]/40 pb-6">
            <div className="w-12 h-12 bg-[#B98072]/15 text-[#8A5A4D] border border-[#B98072]/20 rounded-full flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">Terms & Conditions of Service</h1>
            <p className="text-xs text-gray-400 font-mono">Last updated: June 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">1. Agreement to Terms</h3>
              <p>
                By accessing our online learning portal, registering for physical/virtual cohorts, or consuming any Deeniyat curriculum content published by Qalbiya Islamic Institute, you agree to comply with and be bound by these institutional Terms of Service.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">2. Code of Conduct & Ethics (Adab)</h3>
              <p>
                Traditional learning requires exceptional ethics (Adab) and respect toward our instructors, administrative staff, and fellow students. Qalbiya reserves the absolute right to suspend or permanently expel any student from active cohorts, forum channels, or portals who engages in:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Defamatory, aggressive, or disrespectful language in classroom chats or discussion boards.</li>
                <li>Disruptive behavior that repeatedly interferes with the lecture sequence or student study environment.</li>
                <li>Sharing of personal login keys, textbook materials, or recorded lectures with unregistered third-party users.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">3. Intellectual Property Safeguards</h3>
              <p>
                All slide decks, textbook summaries, custom audio recitation guides, question dossiers, and recorded visual lectures are the exclusive intellectual property of Qalbiya Islamic Institute. Students are granted a personal, non-exclusive, non-transferable license to study the resources for private personal enrichment. Downloading, duplicating, reuploading to public streaming sites, or commercializing these curricula is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">4. Virtual Attendance Standards</h3>
              <p>
                Flagship intakes feature live Zoom or Google Meet classes. While we publish recordings for makeup sessions, students are strongly advised to maintain a minimum 80% live attendance rate to remain eligible for graduation certificates, semester-end assessments, and teacher evaluations.
              </p>
            </section>
          </div>
        </div>
      )}

      {policyType === "privacy" && (
        <div className="space-y-8 bg-[#FAF9F6] border border-[#DDD5C3] p-8 sm:p-12 rounded-[32px]">
          <div className="space-y-3 border-b border-[#DDD5C3]/40 pb-6">
            <div className="w-12 h-12 bg-[#B98072]/15 text-[#8A5A4D] border border-[#B98072]/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">Institutional Privacy Policy</h1>
            <p className="text-xs text-gray-400 font-mono">Last updated: June 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">1. Information We Collect</h3>
              <p>
                To provide a secure student portal and structured tracking, we collect the following limited data points:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Identity Parameters:</strong> Name, Email, Google photo reference (for portal custom headers), and WhatsApp contact phone (if submitted).</li>
                <li><strong>Dossier Credentials:</strong> Homework progress indicators, course bookmark lists, and student study bio/study background inputs.</li>
                <li><strong>Admissions Inquiries:</strong> Statements of financial background for scholarship applicants, and direct admissions contact form details.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">2. Guarding Women & Kids Privacy</h3>
              <p>
                Our cohort learning tracks focus on Muslim women and children. We implement exceptionally strict security filters to maintain absolute privacy:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>All student profile bios, photos, and progress states are restricted via Firestore security parameters, accessible ONLY to the individual owner or authenticated administrators.</li>
                <li>No student contact details, emails, or phone numbers are ever displayed in public listings, catalogs, or search pages.</li>
                <li>Live children's classrooms are moderated at all times by a minimum of two background-checked coordinators.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">3. Zero Data Commercialization</h3>
              <p>
                We do not sell, trade, rent, or lease our student email databases, WhatsApp phones, or registry logs to advertising agencies, corporate publishers, or analytics brokers. Your coordinates remain a complete institutional trust.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">4. Right to Deletion (GDPR/CCPA compliant)</h3>
              <p>
                You hold the absolute right to request the complete deletion of your student account, profile documents, enrollment history, and contact submissions. To request deletion, please contact our registrar desk at qalbiyaislamicinstitute@gmail.com. All records will be expunged from primary active databases within 72 hours.
              </p>
            </section>
          </div>
        </div>
      )}

    </div>
  );
}
