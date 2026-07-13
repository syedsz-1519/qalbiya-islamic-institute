import React from "react";
import { ShieldCheck, Scale, FileText, Landmark, Clock, ArrowLeft } from "lucide-react";

interface LegalPageProps {
  policyType: "refund" | "terms" | "privacy";
  onBackToHome: () => void;
  onTabChange?: (tab: string) => void;
}

export function LegalPages({ policyType, onBackToHome, onTabChange }: LegalPageProps) {
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
            <h1 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">Refund Policy</h1>
            <p className="text-xs text-gray-400 font-mono">Last updated: July 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
            <p>
              At Qalbiya Islamic Institute, we ask every student to review course details — syllabus, duration, format, and fees — carefully before enrolling.
            </p>
            <p className="font-medium text-[#22301F]">
              All course fees, once paid, are non-refundable. This applies to monthly payments as well as full course payments, regardless of the reason for discontinuation.
            </p>
            <p>
              We encourage students (or parents, for children's courses) to reach out to us with any questions before enrolling, so you can make an informed decision. Our team is always happy to help you choose the right course.
            </p>
            <p className="pt-4 border-t border-[#DDD5C3]/30">
              For any questions regarding this policy, please contact us via <a href="https://wa.me/918145363290" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8A5A4D] hover:underline">WhatsApp</a> or <a href="https://instagram.com/qalbiya_institute" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8A5A4D] hover:underline">Instagram</a>.
            </p>
          </div>
        </div>
      )}

      {policyType === "terms" && (
        <div className="space-y-8 bg-[#FAF9F6] border border-[#DDD5C3] p-8 sm:p-12 rounded-[32px]">
          <div className="space-y-3 border-b border-[#DDD5C3]/40 pb-6">
            <div className="w-12 h-12 bg-[#B98072]/15 text-[#8A5A4D] border border-[#B98072]/20 rounded-full flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">Terms & Conditions</h1>
            <p className="text-xs text-gray-400 font-mono">Last updated: July 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
            <p className="font-medium text-[#22301F]">
              By enrolling in any course at Qalbiya Islamic Institute, you agree to the following terms:
            </p>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">1. Enrollment</h3>
              <p>
                Enrollment is confirmed only after payment is received. Course access, class links, and scheduling will be shared after confirmation.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">2. Fees & Payment</h3>
              <p>
                Course fees must be paid according to the schedule listed on each course page (monthly or full course). Late or missed payments may result in a pause in class access until payment is completed.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">3. Attendance & Scheduling</h3>
              <p>
                For 1-on-1 classes, timing is arranged directly with the student based on mutual availability. For group classes, students are expected to follow the scheduled class timing. Missed content in individual (1-on-1) classes will be covered in the next session; group class policies may vary by course.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">4. Conduct</h3>
              <p>
                Students are expected to attend classes with respect, sincerity, and a willingness to learn. Qalbiya Islamic Institute reserves the right to discontinue access for any student whose conduct is disrespectful or disruptive to teachers or fellow students.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">5. Course Content & Materials</h3>
              <p>
                All course materials, notes, and recordings (where applicable) are for the personal use of the enrolled student only. Sharing, reselling, or redistributing course content without permission is not allowed.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">6. Certificates</h3>
              <p>
                Certificates are issued only upon successful completion of course requirements, including any required exams or tests as outlined on the course page.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">7. Changes to Courses</h3>
              <p>
                Qalbiya Islamic Institute reserves the right to make reasonable changes to class schedules, teachers, or course structure when necessary, with advance notice to enrolled students wherever possible.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">8. Refunds</h3>
              <p>
                Please refer to our{" "}
                <button
                  type="button"
                  onClick={() => onTabChange?.("refund-policy")}
                  className="font-semibold text-[#8A5A4D] hover:underline cursor-pointer focus:outline-none"
                >
                  Refund Policy
                </button>{" "}
                — all payments are non-refundable.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">9. Governing Law</h3>
              <p>
                These terms are governed by the laws of India.
              </p>
            </section>

            <p className="pt-4 border-t border-[#DDD5C3]/30">
              For any questions about these terms, please contact us via <a href="https://wa.me/918145363290" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8A5A4D] hover:underline">WhatsApp</a> or <a href="https://instagram.com/qalbiya_institute" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8A5A4D] hover:underline">Instagram</a>.
            </p>
          </div>
        </div>
      )}

      {policyType === "privacy" && (
        <div className="space-y-8 bg-[#FAF9F6] border border-[#DDD5C3] p-8 sm:p-12 rounded-[32px]">
          <div className="space-y-3 border-b border-[#DDD5C3]/40 pb-6">
            <div className="w-12 h-12 bg-[#B98072]/15 text-[#8A5A4D] border border-[#B98072]/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#22301F] tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-gray-400 font-mono">Last updated: July 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#5B5648] font-light leading-relaxed">
            <p className="font-medium text-[#22301F]">
              Qalbiya Islamic Institute respects your privacy. This page explains what information we collect and how it's used.
            </p>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Name and contact details</strong> (WhatsApp number, email, or Instagram handle) provided during enrollment.
                </li>
                <li>
                  <strong>Payment information</strong>, processed securely through our payment method(s) — Qalbiya Islamic Institute does not store your card or banking details directly.
                </li>
                <li>
                  <strong>Messages and communication</strong> shared with us via WhatsApp or Instagram for support and class coordination.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">How We Use Your Information</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To confirm enrollment and provide class access.</li>
                <li>To communicate class schedules, updates, and support.</li>
                <li>To share homework, notes, and progress updates (for children's courses, with parents).</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">Information Sharing</h3>
              <p>
                We do not sell, rent, or share your personal information with third parties, except where required to process payments or where legally required.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif font-bold text-[#22301F] text-base">Testimonials</h3>
              <p>
                With permission, student feedback (such as messages or shared testimonials) may be featured on our website or social media to help other students learn about our courses. If you do not wish your feedback to be used publicly, please let us know.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-[#DDD5C3]/30">
              <h3 className="font-serif font-bold text-[#22301F] text-base">Contact</h3>
              <p>
                For any questions about this policy or your personal data, please contact us via <a href="https://wa.me/918145363290" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8A5A4D] hover:underline">WhatsApp</a> or <a href="https://instagram.com/qalbiya_institute" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8A5A4D] hover:underline">Instagram</a>.
              </p>
            </section>
          </div>
        </div>
      )}

    </div>
  );
}
