import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - CashBlitz",
  description:
    "CashBlitz Privacy Policy. Learn how we collect, use, and protect your personal information in compliance with PIPEDA and Canadian privacy law.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="bg-surface/95 backdrop-blur-lg border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <span className="text-lg font-extrabold tracking-tight">
              <span className="gradient-text">CASH</span>
              <span className="text-foreground">BLITZ</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted mb-10">
          Last updated: February 1, 2026
        </p>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              1. Introduction
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                CashBlitz (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
                is committed to protecting the privacy and personal information
                of our users. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use the
                CashBlitz platform, website, and services.
              </p>
              <p>
                We operate in compliance with Canada&apos;s{" "}
                <strong className="text-foreground">
                  Personal Information Protection and Electronic Documents Act
                  (PIPEDA)
                </strong>{" "}
                and applicable provincial privacy legislation. By using
                CashBlitz, you consent to the practices described in this
                policy.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              2. Information We Collect
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">
                  Account Information:
                </strong>{" "}
                When you create an account, we collect your name, email address,
                and password (stored in hashed form). If you sign up via a
                referral link, we also record the referral relationship.
              </p>
              <p>
                <strong className="text-foreground">
                  Profile &amp; Activity Data:
                </strong>{" "}
                We collect information about your activity on the platform
                including offers started and completed, daily spins, login
                streaks, earnings, cashout requests, transaction history, and
                achievement progress.
              </p>
              <p>
                <strong className="text-foreground">Payment Information:</strong>{" "}
                When you request a cashout, we collect the payment details
                necessary to process your withdrawal (e.g., PayPal email,
                Bitcoin wallet address, or gift card delivery email). We do not
                store credit card numbers.
              </p>
              <p>
                <strong className="text-foreground">
                  Device &amp; Usage Data:
                </strong>{" "}
                We automatically collect technical information such as your IP
                address, browser type, operating system, device identifiers,
                referring URLs, pages visited, and timestamps. This data is used
                for analytics, fraud prevention, and improving our services.
              </p>
            </div>
          </section>

          {/* Data Usage */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              3. How We Use Your Information
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Create, maintain, and secure your account</li>
                <li>Process offer completions, rewards, and cashout requests</li>
                <li>Track your earnings, balance, XP, streaks, and achievements</li>
                <li>Prevent fraud, abuse, and violations of our Terms of Service</li>
                <li>Send you important account notifications (e.g., payout confirmations, security alerts)</li>
                <li>Improve and personalize the CashBlitz platform and user experience</li>
                <li>Comply with legal obligations under Canadian law</li>
                <li>Generate anonymized, aggregated analytics to improve our services</li>
              </ul>
              <p>
                Under PIPEDA, we limit the collection and use of personal
                information to purposes that a reasonable person would consider
                appropriate in the circumstances.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              4. How We Share Your Information
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">We do not sell your personal information.</strong>{" "}
                We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong className="text-foreground">Offer Partners:</strong>{" "}
                  When you start an offer, we share a unique tracking identifier
                  with the offer provider to verify your completion. We do not
                  share your email or personal details with offer partners.
                </li>
                <li>
                  <strong className="text-foreground">Payment Processors:</strong>{" "}
                  We share necessary payment details with third-party processors
                  (e.g., PayPal, cryptocurrency exchanges) to process your cashout.
                </li>
                <li>
                  <strong className="text-foreground">Service Providers:</strong>{" "}
                  We use trusted third-party services for hosting, analytics,
                  and email delivery. These providers are contractually bound to
                  protect your data.
                </li>
                <li>
                  <strong className="text-foreground">Legal Requirements:</strong>{" "}
                  We may disclose information if required by Canadian law, court
                  order, or government regulation, or to protect the rights,
                  safety, and property of CashBlitz and its users.
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              5. Data Security
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                We implement industry-standard technical and organizational
                measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Passwords are hashed using bcrypt and never stored in plain text</li>
                <li>All data is transmitted over HTTPS/TLS encryption</li>
                <li>JWT-based authentication with secure session management</li>
                <li>Database access is restricted and monitored</li>
                <li>Regular security reviews and updates</li>
              </ul>
              <p>
                While we take all reasonable precautions, no method of
                transmission over the Internet or electronic storage is 100%
                secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              6. Cookies &amp; Tracking Technologies
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>CashBlitz uses the following types of cookies:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong className="text-foreground">Essential Cookies:</strong>{" "}
                  Required for authentication, session management, and core
                  functionality. These cannot be disabled.
                </li>
                <li>
                  <strong className="text-foreground">Analytics Cookies:</strong>{" "}
                  Help us understand how users interact with the platform so we
                  can improve the experience. These are anonymized.
                </li>
                <li>
                  <strong className="text-foreground">Offer Tracking Cookies:</strong>{" "}
                  Used by offer partners to verify completions and attribute
                  rewards to your account.
                </li>
              </ul>
              <p>
                You can manage cookie preferences through your browser settings.
                Disabling essential cookies may prevent you from using CashBlitz.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              7. Your Rights Under PIPEDA
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                Under PIPEDA and applicable Canadian privacy laws, you have the
                right to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong className="text-foreground">Access:</strong> Request a
                  copy of the personal information we hold about you.
                </li>
                <li>
                  <strong className="text-foreground">Correction:</strong>{" "}
                  Request correction of inaccurate or incomplete personal
                  information.
                </li>
                <li>
                  <strong className="text-foreground">Withdrawal of Consent:</strong>{" "}
                  Withdraw your consent for the collection, use, or disclosure
                  of your personal information, subject to legal or contractual
                  restrictions.
                </li>
                <li>
                  <strong className="text-foreground">Deletion:</strong> Request
                  deletion of your account and personal data.
                </li>
                <li>
                  <strong className="text-foreground">Complaint:</strong> File a
                  complaint with the Office of the Privacy Commissioner of
                  Canada if you believe your privacy rights have been violated.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the
                information provided below. We will respond to your request
                within 30 days, as required by PIPEDA.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              8. Data Retention
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                We retain your personal information for as long as your account
                is active or as needed to provide you with our services. If you
                close your account, we will delete or anonymize your personal
                information within 90 days, except where we are required to
                retain it for legal, regulatory, or fraud prevention purposes.
              </p>
              <p>
                Transaction records may be retained for up to 7 years to comply
                with Canadian tax and financial reporting requirements.
              </p>
            </div>
          </section>

          {/* Children */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              9. Children&apos;s Privacy
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                CashBlitz is not intended for use by individuals under the age
                of 18. We do not knowingly collect personal information from
                minors. If we become aware that we have collected personal
                information from a person under 18, we will take steps to delete
                that information promptly.
              </p>
            </div>
          </section>

          {/* Changes */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              10. Changes to This Policy
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or applicable law. We will notify you
                of material changes by posting a notice on the platform or
                sending an email to the address associated with your account.
                Your continued use of CashBlitz after the effective date of any
                changes constitutes your acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              11. Contact Us
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                If you have any questions about this Privacy Policy, wish to
                exercise your privacy rights, or have a privacy-related
                complaint, please contact our Privacy Officer:
              </p>
              <div className="bg-surface-light rounded-xl p-4 border border-border space-y-1">
                <p>
                  <strong className="text-foreground">CashBlitz Privacy Officer</strong>
                </p>
                <p>Email: privacy@cashblitz.com</p>
                <p>Address: Toronto, Ontario, Canada</p>
              </div>
              <p>
                You may also contact the{" "}
                <strong className="text-foreground">
                  Office of the Privacy Commissioner of Canada
                </strong>{" "}
                at{" "}
                <span className="text-foreground">www.priv.gc.ca</span> if you
                are not satisfied with our response to your privacy inquiry.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
