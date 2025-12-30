import Link from "next/link";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen text-sm md:text-base bg-[#ffffff] text-[#171717] selection:bg-[#B8994B] selection:text-white">
      {/* Hero Section */}
      <header className="bg-[#FBF9F3] border-b border-[#08341D]/10 py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[#08341D] text-4xl md:text-5xl font-serif font-medium mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#333333] italic">Last Updated: 01-Jan-2026</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Quick Navigation - Desktop Only */}
        <aside className="hidden lg:block lg:col-span-1">
          <nav className="sticky top-8 space-y-3 border-l-2 border-[#FBF9F3]">
            <a
              href="#collection"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Data Collection
            </a>
            <a
              href="#processing"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Processing & Retention
            </a>
            <a
              href="#disclosure"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Disclosures
            </a>

            <a
              href="#security"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Security
            </a>
            <a
              href="#dataTransfer"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Internal Data Transfer
            </a>

            <a
              href="#rights"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Your Rights
            </a>
            <a
              href="#personalInfo"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Sensitive Personal Information
            </a>
            <a
              href="#trackingTech"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Tracking Technologies.
            </a>
            <a
              href="#externalLinks"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              External Links
            </a>
            <a
              href="#mobileAccess"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Mobile Access
            </a>
            <a
              href="#marketingEmails"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Marketing Emails
            </a>

            <a
              href="#textMessaging"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Text Messaging
            </a>
            <a
              href="#automatedSupport"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Automated Support
            </a>
            <a
              href="#policyUpdates"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Policy Updates
            </a>
            <a
              href="#contact"
              className="block pl-4 hover:text-[#B8994B] transition-colors"
            >
              Contact Us
            </a>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 prose prose-slate max-w-none">
          <section className="mb-0">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              1. Your Privacy is Important to Us
            </h2>
            <p className="mb-4 leading-relaxed">
              At MIORISH, we deeply value the trust you place in us. Protecting
              your personal information is a core part of how we operate as a
              premium, founder-led brand.
            </p>
            <p className="mb-4 leading-relaxed">
              This Privacy Statement explains how we collect, use, store,
              process, and protect your personal information when you visit or
              interact with{" "}
              <Link href="https://www.miorish.com" className="text-accent">
                www.miorish.com
              </Link>{" "}
              our products, and our services . MIORISH is committed to complying
              with applicable Indian laws, including the Information Technology
              Act, 2000 and related data protection rules, and to adopting
              responsible data practices in line with global standards.
            </p>
          </section>

          <hr className="border-[#FBF9F3] mb-12" />

          <section id="collection" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              2. Personal Information We Collect
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#FBF9F3] p-6 rounded-sm border-l-4 border-[#B8994B]">
                <h3 className="text-[#08341D] font-bold mb-3">
                  Information You Provide
                </h3>
                <ul className="space-y-2 text-sm text-[#333333]">
                  <li>Full name</li>
                  <li>Email address & Phone number</li>
                  <li>Company/Organisation & Designation</li>
                  <li>Designation or role</li>
                  <li>Billing and delivery address</li>
                  <li>
                    Enquiry details (B2B, hospitality, corporate gifting, bulk
                    orders)
                  </li>
                </ul>
              </div>

              <div className="bg-[#FBF9F3] p-6 rounded-sm border-l-4 border-[#08341D]">
                <h3 className="text-[#08341D] font-bold mb-3">
                  Information Collected Automatically
                </h3>
                <ul className="space-y-2 text-sm text-[#333333]">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Pages visited and interaction data</li>
                  <li>Interaction data & Cookies</li>
                </ul>
              </div>
            </div>
          </section>
          <section id="processing" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-6">
              3. Why We Process Your Personal Information, Legal Bases for
              Processing and Retention
            </h2>

            {/* Purposes of Processing */}
            <div className="mb-8">
              <h3 className="text-[#08341D] font-bold mb-3 uppercase text- md tracking-widest">
                Purposes of Processing
              </h3>
              <p className="mb-4 text-[#333333]">
                MIORISH processes personal information for the following
                purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#333333]">
                <li>Responding to enquiries and communications </li>
                <li>Processing orders and B2B requests </li>
                <li>Managing customer and business relationships </li>
                <li>Providing order updates and service notifications </li>
                <li>Internal record-keeping and accounting </li>
                <li>Improving website functionality and user experience </li>
                <li>Compliance with legal and regulatory obligations </li>
              </ul>
            </div>

            {/* Legal Basis */}
            <div className="mb-8">
              <h3 className="text-[#08341D] font-bold mb-3 uppercase text-md tracking-widest">
                Legal Basis
              </h3>
              <p className="mb-4 text-[#333333]">
                We process personal data based on:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#333333]">
                <li>User consent </li>
                <li>Performance of contractual obligations </li>
                <li>Compliance with legal requirements </li>
                <li>Legitimate business interests </li>
              </ul>
            </div>

            {/* Data Retention */}
            <div className="bg-[#FBF9F3] p-6 rounded-sm border-l-4 border-[#B8994B]">
              <h3 className="text-[#08341D] font-bold mb-3 uppercase text-xs tracking-widest">
                Data Retention
              </h3>
              <p className="text-[#333333] leading-relaxed mb-4">
                Personal data is retained only for as long as necessary to
                fulfil the stated purposes or as required under applicable law.
              </p>
              <p className="text-[#333333] leading-relaxed font-medium">
                Once no longer required, data is securely deleted or anonymised.
              </p>
            </div>
          </section>

          <section id="disclosure" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              4. Disclosure of Information
            </h2>
            <p className="mb-4 font-semibold text-[#08341D]">
              MIORISH does not sell, rent, or trade personal information.
            </p>
            <p>Disclosures are made under confidentiality obligations to:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#333333]">
              <li>Internal authorised personnel</li>
              <li>
                Trusted service providers (IT, hosting, logistics, payment
                support)
              </li>
              <li>Professional advisors (legal, accounting, compliance)</li>
              <li>
                Government or regulatory authorities when legally required
              </li>
            </ul>
          </section>

          <section
            id="security"
            className="mb-12 bg-[#08341D] text-white p-8 rounded-sm"
          >
            <h2 className="text-[#B8994B] text-2xl font-serif mb-4">
              Security & Tracking
            </h2>
            <p className="mb-4">
              MIORISH implements reasonable technical and organisational
              security measures to protect personal information against
              unauthorised access, loss, misuse, or disclosure.
            </p>
            <p>
              While we strive to protect all data, no digital platform is
              completely secure, and users acknowledge this inherent risk.
            </p>
          </section>

          <section
            id="dataTransfer"
            className="mb-12 rounded-sm text-[#333333]"
          >
            <h2 className="text-primary text-2xl font-serif mb-4">
              5. International Data Transfers
            </h2>
            <p className="mb-4 ">
              MIORISH primarily operates in India. However, certain service
              providers (such as cloud hosting or analytics platforms) may
              process data on servers located outside India.
            </p>
            <p>
              Where international data transfers occur, MIORISH ensures that
              reasonable safeguards are in place to protect personal information
              in accordance with applicable laws and best practices.
            </p>
          </section>

          <section id="rights" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              6. Your Rights Regarding Access to and Control Over Personal
              Information
            </h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#333333]">
              <li>Request access to your personal information</li>
              <li>Request correction or updating of inaccurate data</li>
              <li>Withdraw consent for processing</li>
              <li>
                Request deletion of personal data (subject to legal obligations)
              </li>
            </ul>
            <p className="mt-4">
              Requests may be sent to{" "}
              <span className="font-bold">support@miorish.com</span>, and we
              will respond within a reasonable timeframe.
            </p>
          </section>

          <section id="personalInfo" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              7. Sensitive Personal Information
            </h2>
            <p className="mb-4">
              MIORISH does not intentionally collect sensitive personal
              information such as:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#333333]">
              <li>Financial passwords</li>
              <li>Biometric data</li>
              <li>Health information</li>
              <li>Government identification numbers</li>
            </ul>
            <p className="mt-4">
              If such information is inadvertently received, it will be handled
              securely and deleted where legally permissible.
            </p>
          </section>

          <section id="trackingTech" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              8. Personal Information Submitted by Children
            </h2>
            <p className="mb-4">
              MIORISH does not knowingly collect personal information from
              individuals under the age of 18. If we become aware that such
              information has been collected, it will be deleted promptly
            </p>
          </section>

          <section id="trackingTech" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              9. Cookies, Web Beacons and Other Tracking Technologies
            </h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#333333]">
              <li>Improve website performance</li>
              <li>Understand user behaviour</li>
              <li>Enhance browsing experience</li>
            </ul>
            <p className="mt-4">
              Users may control or disable cookies through their browser
              settings; however, certain website features may not function
              optimally.
            </p>
          </section>

          <section id="externalLinks" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              10. Links to Third-Party Sites
            </h2>
            <p className="mb-4">
              Our website may contain links to third-party websites. MIORISH is
              not responsible for the privacy practices, content, or security of
              such external sites. Users are encouraged to review their privacy
              policies separately.
            </p>
          </section>

          <section id="mobileAccess" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              11. Using Mobile and Other Devices
            </h2>
            <p className="mb-4">
              When accessing our website via mobile or other devices, certain
              technical data (such as device type or IP address) may be
              collected to ensure proper functionality and security. Users may
              manage privacy settings directly through their device or browser.
            </p>
          </section>

          <section id="marketingEmails" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              12. Email Marketing Communications
            </h2>
            <p className="mb-4">
              MIORISH may send promotional or informational emails only where
              permitted by law or where consent has been provided. Users may
              unsubscribe from marketing emails at any time using the link
              provided in the email or by contacting{" "}
              <span className="font-bold">support@miorish.com</span>.
              Transactional or service-related emails will continue as
              necessary.
            </p>
          </section>

          <section id="textMessaging" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              13. Text Messaging
            </h2>
            <p className="mb-4">
              Where applicable, MIORISH may send SMS or WhatsApp messages
              related to order updates, service notifications, or confirmations.
              Marketing messages will be sent only with user consent. Users may
              opt out at any time.
            </p>
          </section>

          <section id="automatedSupport" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              14. Chatbots and Artificial Intelligence
            </h2>
            <p className="mb-4">
              MIORISH may use automated tools, including chatbots, to assist
              with customer enquiries and support. Information shared during
              such interactions may be recorded to improve service quality and
              response accuracy.
            </p>
          </section>

          <section id="policyUpdates" className="mb-12">
            <h2 className="text-[#08341D] text-2xl font-serif mb-4">
              15. Changes to Our Privacy Statement
            </h2>
            <p className="mb-4">
              MIORISH reserves the right to modify this Privacy Statement at any
              time. Any changes will be effective upon publication on the
              website. Users are encouraged to review this page periodically.
            </p>
          </section>

          <section
            id="contact"
            className="mb-12 p-8 bg-[#FBF9F3] border border-[#B8994B]/20"
          >
            <h2 className="text-[#08341D] text-2xl font-serif mb-6 text-center">
              Contact Us
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-[#333333] mb-2 uppercase text-xs tracking-widest">
                  General Enquiries
                </h3>
                <p className="text-[#08341D]">contact@miorish.com</p>
              </div>
              <div>
                <h3 className="font-bold text-[#333333] mb-2 uppercase text-xs tracking-widest">
                  Support & Privacy
                </h3>
                <p className="text-[#08341D]">support@miorish.com</p>
              </div>

              <div>
                <h3 className="font-bold text-[#333333] mb-2 uppercase text-xs tracking-widest">
                  Used only for automated system notifications such as order
                  updates. Replies to this address are not monitored.
                </h3>
                <p className="text-[#08341D]">noreply@miorish.com</p>
              </div>
            </div>
            <p className="mt-8 text-xs text-center text-[#333333]">
              MIORISH reserves the right to modify this Privacy Statement at any
              time.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
