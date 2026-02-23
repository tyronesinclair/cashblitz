import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - CashBlitz",
  description:
    "CashBlitz Terms of Service. Read the terms and conditions governing your use of the CashBlitz Canadian rewards platform.",
};

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-muted mb-10">
          Last updated: February 1, 2026
        </p>

        <div className="space-y-8">
          {/* Agreement */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              1. Agreement to Terms
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                By accessing or using the CashBlitz platform
                (&quot;Service&quot;), you agree to be bound by these Terms of
                Service (&quot;Terms&quot;). If you do not agree to these Terms,
                you must not use the Service.
              </p>
              <p>
                CashBlitz is operated from Canada and these Terms are governed
                by Canadian law. The Service is primarily designed for and
                offered to Canadian residents.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              2. Eligibility
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>To use CashBlitz, you must:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Be at least 18 years of age</li>
                <li>Be a resident of Canada (all provinces and territories are eligible)</li>
                <li>Have a valid email address</li>
                <li>Not have been previously banned or suspended from the platform</li>
                <li>Be able to legally enter into a binding agreement under Canadian law</li>
              </ul>
              <p>
                CashBlitz reserves the right to restrict access to users
                outside of Canada or in jurisdictions where rewards platforms
                are not permitted by local law.
              </p>
            </div>
          </section>

          {/* Account Rules */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              3. Account Rules
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">One Account Per Person:</strong>{" "}
                Each individual may only create and maintain one CashBlitz
                account. Creating multiple accounts is strictly prohibited and
                will result in immediate termination of all accounts and
                forfeiture of any earned balance.
              </p>
              <p>
                <strong className="text-foreground">Account Security:</strong>{" "}
                You are responsible for maintaining the confidentiality of your
                login credentials and for all activity that occurs under your
                account. You must notify us immediately if you suspect
                unauthorized access.
              </p>
              <p>
                <strong className="text-foreground">Accurate Information:</strong>{" "}
                You must provide accurate, current, and complete information
                when registering. Providing false or misleading information is
                grounds for account termination.
              </p>
              <p>
                <strong className="text-foreground">Account Transfers:</strong>{" "}
                Accounts are non-transferable. You may not sell, trade, gift, or
                otherwise transfer your account to another person.
              </p>
            </div>
          </section>

          {/* Earning & Rewards */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              4. Earning &amp; Rewards
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">How Earning Works:</strong>{" "}
                Users earn Canadian dollar (CAD) rewards by completing offers
                (games, surveys, tasks), spinning the daily wheel, claiming
                daily login bonuses, and participating in the referral program.
                All reward amounts are displayed in CAD.
              </p>
              <p>
                <strong className="text-foreground">Offer Completion:</strong>{" "}
                Rewards are credited to your account balance upon verified
                completion of offer requirements. Each offer has specific
                milestones and conditions that must be met. Offer availability,
                reward amounts, and terms may change at any time without notice.
              </p>
              <p>
                <strong className="text-foreground">Daily Spin &amp; Bonuses:</strong>{" "}
                The daily spin wheel and login bonus provide free rewards.
                Prizes are determined server-side. One free spin is available per
                calendar day (UTC). Daily login bonuses follow a 7-day
                escalating cycle that resets if a day is missed.
              </p>
              <p>
                <strong className="text-foreground">Referral Program:</strong>{" "}
                You may earn referral bonuses when users you refer complete
                their first offer. Referral abuse (e.g., self-referral, fake
                accounts) will result in forfeiture of all referral earnings and
                possible account termination.
              </p>
              <p>
                <strong className="text-foreground">Reward Adjustments:</strong>{" "}
                CashBlitz reserves the right to adjust, revoke, or reclaim
                rewards that were earned through fraud, error, exploit, or
                violation of these Terms.
              </p>
            </div>
          </section>

          {/* Cashout Rules */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              5. Cashout &amp; Withdrawal Rules
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">Minimum Withdrawal:</strong>{" "}
                Each payout method has a minimum withdrawal amount (typically
                C$5 to C$10). You must meet the minimum threshold before
                requesting a cashout.
              </p>
              <p>
                <strong className="text-foreground">Available Methods:</strong>{" "}
                CashBlitz offers multiple cashout options including Interac
                e-Transfer, PayPal, Visa gift cards, Amazon.ca gift cards,
                Bitcoin, Apple gift cards, and Steam gift cards. Method
                availability may vary and is subject to change.
              </p>
              <p>
                <strong className="text-foreground">Processing Time:</strong>{" "}
                Cashout requests are reviewed and processed by our team. Most
                payouts are completed within 24 hours, though some may take up
                to 72 hours depending on verification requirements.
              </p>
              <p>
                <strong className="text-foreground">Fees:</strong>{" "}
                CashBlitz does not currently charge withdrawal fees. However, we
                reserve the right to introduce fees in the future with
                reasonable advance notice.
              </p>
              <p>
                <strong className="text-foreground">Verification:</strong>{" "}
                We may require identity verification before processing large
                withdrawals or if suspicious activity is detected on your
                account.
              </p>
              <p>
                <strong className="text-foreground">Tax Responsibility:</strong>{" "}
                You are solely responsible for reporting and paying any
                applicable Canadian federal or provincial taxes on your
                earnings. CashBlitz does not provide tax advice.
              </p>
            </div>
          </section>

          {/* Prohibited Conduct */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              6. Prohibited Conduct
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Create multiple accounts or use another person&apos;s account</li>
                <li>Use bots, scripts, automation tools, or emulators to complete offers</li>
                <li>Exploit bugs, glitches, or vulnerabilities in the platform</li>
                <li>Provide false, misleading, or fraudulent information</li>
                <li>Abuse the referral program through self-referral or fake accounts</li>
                <li>Use VPNs, proxies, or other tools to falsify your location</li>
                <li>Engage in any form of fraud, manipulation, or deceptive behavior</li>
                <li>Reverse-engineer, decompile, or attempt to extract the source code of the platform</li>
                <li>Harass, threaten, or abuse other users or CashBlitz staff</li>
                <li>Violate any applicable Canadian or provincial law</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              7. Termination &amp; Suspension
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">By CashBlitz:</strong>{" "}
                We may suspend or terminate your account at any time, with or
                without cause, if we reasonably believe you have violated these
                Terms, engaged in fraudulent activity, or pose a risk to the
                platform or other users. In cases of termination for cause, any
                remaining balance may be forfeited.
              </p>
              <p>
                <strong className="text-foreground">By You:</strong>{" "}
                You may close your account at any time by contacting support.
                Any pending balance above the minimum withdrawal threshold may
                be cashed out before account closure. Balances below the minimum
                threshold are forfeited upon account closure.
              </p>
              <p>
                <strong className="text-foreground">Effect of Termination:</strong>{" "}
                Upon termination, your right to use the Service ceases
                immediately. Provisions of these Terms that by their nature
                should survive termination (including limitation of liability,
                governing law, and dispute resolution) will continue to apply.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              8. Limitation of Liability
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY CANADIAN LAW, CASHBLITZ AND
                ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE
                SERVICE.
              </p>
              <p>
                CashBlitz&apos;s total aggregate liability for any claims
                arising under these Terms shall not exceed the total amount of
                rewards you have actually withdrawn from the platform in the 12
                months preceding the claim.
              </p>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind, whether express
                or implied, including but not limited to implied warranties of
                merchantability, fitness for a particular purpose, and
                non-infringement.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              9. Governing Law &amp; Dispute Resolution
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the Province of Ontario and the federal laws of
                Canada applicable therein, without regard to conflict of law
                principles.
              </p>
              <p>
                Any disputes arising under or in connection with these Terms
                shall be subject to the exclusive jurisdiction of the courts
                located in Toronto, Ontario, Canada.
              </p>
              <p>
                Before initiating any formal legal proceedings, you agree to
                first attempt to resolve any dispute with CashBlitz through
                good-faith negotiation by contacting us at
                support@cashblitz.com. We will make reasonable efforts to
                resolve your concern within 30 days.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              10. Intellectual Property
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                The CashBlitz name, logo, branding, website design, and all
                associated content are the property of CashBlitz and are
                protected by Canadian intellectual property laws. You may not
                reproduce, distribute, or create derivative works from our
                content without our express written permission.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              11. Changes to These Terms
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                CashBlitz reserves the right to modify these Terms at any time.
                We will provide notice of material changes by posting an updated
                version on the platform and, where practical, notifying you via
                email. Your continued use of the Service after the effective
                date of any changes constitutes your acceptance of the revised
                Terms.
              </p>
              <p>
                If you do not agree with the revised Terms, you must stop using
                the Service and close your account.
              </p>
            </div>
          </section>

          {/* Severability */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              12. Severability
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                If any provision of these Terms is found to be unenforceable or
                invalid by a court of competent jurisdiction, that provision
                shall be limited or eliminated to the minimum extent necessary
                so that these Terms shall otherwise remain in full force and
                effect.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">
              13. Contact
            </h2>
            <div className="text-sm text-muted leading-relaxed space-y-3">
              <p>
                If you have questions about these Terms of Service, please
                contact us:
              </p>
              <div className="bg-surface-light rounded-xl p-4 border border-border space-y-1">
                <p>
                  <strong className="text-foreground">CashBlitz Support</strong>
                </p>
                <p>Email: support@cashblitz.com</p>
                <p>Address: Toronto, Ontario, Canada</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
