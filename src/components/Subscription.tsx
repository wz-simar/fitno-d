'use client';

import { useEffect, useState } from 'react';
import {
  createFitnodOrder,
  fetchFitnodConfig,
  openFitnodCheckout,
  type FitnodVerifyResult,
} from '@/lib/fitnodPayment';

const features = [
  'All Workout Programs',
  'All Dance Styles',
  'Future Content & Updates',
  'Community Access',
  'Live Masterclasses',
  'Progress Tracking',
];

type FormState = {
  name: string;
  phone: string;
  email: string;
};

export default function Subscription() {
  const [amount, setAmount] = useState(999);
  const [membershipYears, setMembershipYears] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState<FitnodVerifyResult | null>(null);

  useEffect(() => {
    fetchFitnodConfig()
      .then((cfg) => {
        if (cfg?.amount) setAmount(cfg.amount);
        if (cfg?.membershipYears) setMembershipYears(cfg.membershipYears);
      })
      .catch(() => {
        /* keep interim defaults */
      });
  }, []);

  const monthly = Math.max(1, Math.round(amount / 12));

  const openModal = () => {
    setErrorMsg('');
    setSuccess(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!form.phone.trim() || form.phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = await createFitnodOrder({
        name: form.name.trim(),
        mobileNumber: form.phone,
        email: form.email.trim(),
      });

      const result = await openFitnodCheckout({
        order: orderData.order,
        keyId: orderData.keyId,
        name: form.name.trim(),
        mobileNumber: form.phone,
        email: form.email.trim(),
      });

      setSuccess(result);
    } catch (err: unknown) {
      const e = err as Error & {
        data?: { clientId?: string; loginLink?: string; inviteCode?: string; coachId?: string };
        status?: number;
      };
      if (e.status === 400 && e.data?.clientId) {
        setSuccess({
          clientId: e.data.clientId,
          loginLink: e.data.loginLink || '',
          inviteCode: e.data.inviteCode || e.data.coachId,
          alreadyRegistered: true,
        });
      } else if (e.message === 'Payment cancelled') {
        setErrorMsg('Payment was cancelled. You can try again anytime.');
      } else {
        setErrorMsg(e.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="section-label">Membership</span>
          <h2 className="section-title">One Membership. Unlimited Access.</h2>
          <p className="section-subtitle mx-auto">
            Everything you need for your dance fitness journey, at one simple price.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div
            className="rounded-3xl border-2 p-10 md:p-12"
            style={{
              background: 'var(--color-bg)',
              borderColor: 'var(--color-primary)',
              boxShadow: '0 20px 60px rgba(123,45,255,0.15)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <span
                className="font-outfit font-bold text-sm uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Annual Plan
              </span>
            </div>

            <div className="mb-2">
              <span
                className="text-5xl md:text-6xl font-outfit font-extrabold"
                style={{ color: 'var(--color-text)' }}
              >
                ₹{amount}
              </span>
              <span className="text-lg ml-1" style={{ color: 'var(--color-text-muted)' }}>
                /{membershipYears === 1 ? 'year' : `${membershipYears} years`}
              </span>
            </div>
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
              That&apos;s just ₹{monthly}/month
            </p>

            <div className="w-full h-px mb-8" style={{ background: 'var(--color-border)' }} />

            <ul className="space-y-4 mb-10">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold shrink-0 mt-0.5"
                    style={{
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    ✓
                  </span>
                  <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={openModal}
              className="btn-primary btn-shimmer w-full text-lg py-4 text-center block"
            >
              Join Now — Pay ₹{amount}
            </button>

            <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-muted)' }}>
              Secure payment • Instant Client ID
            </p>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl z-10">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              &times;
            </button>

            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h3 className="font-outfit font-extrabold text-2xl mb-2" style={{ color: 'var(--color-text)' }}>
                  {success.alreadyRegistered ? 'You already have access' : 'Welcome to FitNoD!'}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Your Client ID (use this to log in to the app):
                </p>
                <p className="font-outfit font-extrabold text-3xl tracking-wide mb-2" style={{ color: 'var(--color-primary)' }}>
                  {success.clientId}
                </p>
                {(success.inviteCode || success.coachId) && (
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Invite code:{' '}
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {success.inviteCode || success.coachId}
                    </span>
                  </p>
                )}
                {success.membership?.endDate && (
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                    Membership valid until {success.membership.endDate}
                  </p>
                )}
                {!success.membership?.endDate && <div className="mb-6" />}
                <div className="flex flex-col gap-3">
                  {success.loginLink && (
                    <a
                      href={success.loginLink}
                      className="btn-primary btn-shimmer w-full py-3 text-center"
                    >
                      Open FitNoD App Login
                    </a>
                  )}
                  <a
                    href={success.loginLink || '/app'}
                    className="w-full py-3 text-center rounded-xl border font-semibold"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    Download / Open App
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-outfit font-extrabold text-2xl mb-2" style={{ color: 'var(--color-text)' }}>
                  Join FitNoD
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                  Enter your details, pay ₹{amount}, and get your Client ID instantly.
                </p>

                {errorMsg && (
                  <div className="mb-4 text-xs font-semibold bg-red-50 border border-red-200 text-red-600 py-2.5 px-4 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                        })
                      }
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      placeholder="10-digit phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      placeholder="name@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary btn-shimmer w-full py-3.5 text-base font-bold rounded-xl mt-2"
                  >
                    {isSubmitting ? 'Processing…' : `Pay ₹${amount}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
