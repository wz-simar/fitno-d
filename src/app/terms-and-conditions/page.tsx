'use client';

export default function TermsAndConditionsPage() {
  return (
    <section className="min-h-screen py-12 px-6 sm:px-10 lg:px-20 xl:px-32" style={{ background: 'var(--color-accent-bg)' }}>
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6 sm:p-10 lg:p-12 border" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-center mb-10">
          <a href="/" className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            ← Back to FitNoD
          </a>
          <h1 className="font-outfit w-full mx-auto text-3xl sm:text-4xl font-bold mt-4 mb-3 border-b-4" style={{ color: 'var(--color-text)', borderColor: 'var(--color-primary)' }}>
            Terms &amp; Conditions
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--color-text-muted)' }}>
            Please read these Terms carefully before using FitNoD.
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          <h2 className="text-xl font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Welcome to FitNoD
          </h2>
          <p>
            These terms and conditions outline the rules and regulations for the use of FitNoD&apos;s
            website and membership services. By accessing this website, you accept these terms.
            If you do not agree, please do not continue to use FitNoD.
          </p>

          <h3 className="text-lg font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Definitions
          </h3>
          <p>
            &quot;Client&quot;, &quot;You&quot;, and &quot;Your&quot; refer to you, the person using this website.
            &quot;Company&quot;, &quot;We&quot;, &quot;Our&quot;, and &quot;Us&quot; refer to FitNoD — Fitness In The Name Of Dance.
            These terms are governed by the laws of India.
          </p>

          <h3 className="text-lg font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Membership &amp; Payments
          </h3>
          <p>
            Paid membership grants access to FitNoD programs and the companion app as described at
            checkout. Payments are processed securely via Razorpay. Fees are generally
            non-refundable except where required by law or expressly stated by FitNoD.
          </p>

          <h3 className="text-lg font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            License
          </h3>
          <p>
            Unless otherwise stated, FitNoD owns the intellectual property rights for material on
            this website. You may view pages for personal use, subject to restrictions set in these terms.
            You must not republish, sell, or commercially exploit FitNoD content without permission.
          </p>

          <h3 className="text-lg font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            User Conduct
          </h3>
          <p>
            You agree not to misuse the Service, attempt unauthorized access, or share your login
            credentials in a way that violates FitNoD policies.
          </p>

          <h3 className="text-lg font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Disclaimer
          </h3>
          <p>
            Fitness activities involve risk. Consult a physician before starting any program.
            FitNoD content is for general wellness education and is not medical advice.
          </p>

          <h3 className="text-lg font-semibold border-l-4 pl-3" style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}>
            Contact
          </h3>
          <p>
            Questions about these Terms? Email{' '}
            <a href="mailto:hello@fitnod.com" className="underline" style={{ color: 'var(--color-primary)' }}>hello@fitnod.com</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
