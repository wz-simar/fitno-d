'use client';

export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-screen py-12 px-6 sm:px-10 lg:px-20 xl:px-32" style={{ background: 'var(--color-accent-bg)' }}>
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6 sm:p-10 lg:p-12 border" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-center mb-10">
          <a href="/" className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            ← Back to FitNoD
          </a>
          <h1 className="font-outfit w-full pb-1 mx-auto text-3xl sm:text-4xl font-bold mt-4 mb-3 border-b-4" style={{ color: 'var(--color-text)', borderColor: 'var(--color-primary)' }}>
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--color-text-muted)' }}>
            Last updated: September 7, 2026
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          <p>
            This Privacy Policy describes how FitNoD (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;)
            collects, uses, and discloses your information when you use our website and services,
            and explains your privacy rights.
          </p>
          <p>
            By using FitNoD, you agree to the collection and use of information in accordance with
            this Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Interpretation and Definitions
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Company</strong> refers to FitNoD — Fitness In The Name Of Dance.</li>
            <li><strong>Service</strong> refers to the FitNoD website and related membership services.</li>
            <li><strong>Personal Data</strong> means any information relating to an identified or identifiable individual.</li>
            <li><strong>Country</strong> refers to India.</li>
          </ul>

          <h2 className="text-xl font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Information We Collect
          </h2>
          <p>We may collect:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Name, email address, and mobile number when you join or request a callback</li>
            <li>Payment-related identifiers from our payment partner (Razorpay)</li>
            <li>Usage data such as device type, browser, and pages visited</li>
          </ul>

          <h2 className="text-xl font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            How We Use Your Data
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To create and manage your FitNoD membership and app login</li>
            <li>To process payments and prevent fraud</li>
            <li>To communicate about programs, support, and updates</li>
            <li>To improve our website and services</li>
          </ul>

          <h2 className="text-xl font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Sharing of Data
          </h2>
          <p>
            We may share data with trusted service providers (payment processors, messaging, and
            hosting partners) solely to operate FitNoD. We do not sell your personal data.
          </p>

          <h2 className="text-xl font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Data Security & Retention
          </h2>
          <p>
            We use reasonable technical and organizational measures to protect your information.
            We retain data only as long as needed for membership, legal, and operational purposes.
          </p>

          <h2 className="text-xl font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Your Rights
          </h2>
          <p>
            You may request access, correction, or deletion of your personal data by contacting us at{' '}
            <a href="mailto:hello@fitnod.com" className="underline" style={{ color: 'var(--color-primary)' }}>hello@fitnod.com</a>.
          </p>

          <h2 className="text-xl font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Changes
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use of FitNoD after
            changes means you accept the updated policy.
          </p>
        </div>
      </div>
    </section>
  );
}
