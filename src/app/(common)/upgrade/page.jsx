"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdClose, MdVerifiedUser } from 'react-icons/md';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpgrade = async () => {
    if (!session) {
      router.push('/sign-in?redirect=/upgrade');
      return;
    }

    if (session.user?.isPremium) {
      alert('You are already a premium member! 🎉');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session.');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 md:px-12 relative overflow-hidden bg-background">
      {/* Premium Ambient Glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[60%] right-[10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}
      ></div>
      
      {/* Header */}
      <div className="relative z-10 text-center mb-16 pt-10">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-4 block"
        >
          Elevate Your Legacy
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-text-heading mb-6 max-w-3xl mx-auto leading-tight"
        >
          Investment in Wisdom
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-sans text-base sm:text-lg text-text-body max-w-xl mx-auto opacity-90 leading-relaxed"
        >
          Join a sanctuary of thinkers and creators. One payment to unlock a lifetime of curated digital life lessons and premium tools.
        </motion.p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-2 sm:px-4 relative z-10 items-stretch">
        
        {/* Standard Plan */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-bg-card/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/5 flex flex-col transition-all duration-300 hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] group relative"
        >
          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-text-body/60 mb-2 block">ENTRY EXPERIENCE</span>
            <h2 className="font-serif text-2xl font-bold text-text-heading mb-3 group-hover:text-primary transition-colors">Standard</h2>
            <p className="font-sans text-sm text-text-body/80 leading-relaxed">For casual readers seeking core concepts and inspiration.</p>
          </div>
          
          <div className="flex items-baseline gap-1.5 mb-8 pb-8 border-b border-white/5">
            <span className="font-sans text-4xl sm:text-5xl font-black text-text-heading">৳0</span>
            <span className="text-text-body/70 font-mono text-xs uppercase tracking-wider">/ 12 months access</span>
          </div>

          <div className="space-y-4 mb-10 flex-grow">
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-success text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface">5 Lessons per month</span>
            </div>
            <div className="flex items-center gap-3 opacity-55">
              <MdClose className="text-danger text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface">No Premium lesson creation</span>
            </div>
            <div className="flex items-center gap-3 opacity-55">
              <MdClose className="text-danger text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface">Ad-supported experience</span>
            </div>
            <div className="flex items-center gap-3 opacity-55">
              <MdClose className="text-danger text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface">Standard listing priority</span>
            </div>
            <div className="flex items-center gap-3 opacity-55">
              <MdClose className="text-danger text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface">Basic text-only view</span>
            </div>
            <div className="flex items-center gap-3 opacity-55">
              <MdClose className="text-danger text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface">No community credentials</span>
            </div>
          </div>

          <button 
            disabled={session?.user?.isPremium}
            className="w-full py-4 border border-white/10 rounded-xl font-sans text-sm font-bold text-on-surface hover:bg-white/5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {session?.user?.isPremium ? 'Standard Plan' : 'Current Plan'}
          </button>
        </motion.div>

        {/* Premium Plan */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#1e1c25]/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 border-2 border-primary/30 relative flex flex-col transition-all duration-300 hover:border-primary/50 shadow-[0_15px_50px_rgba(255,198,107,0.08)] group overflow-hidden"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="absolute top-4 right-4 bg-primary text-background font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full font-extrabold shadow-md whitespace-nowrap">
            Best Value
          </div>

          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-primary mb-2 block">FULL ETERNAL ACCESS</span>
            <h2 className="font-serif text-2xl font-bold text-text-heading mb-3 text-primary">Premium Sanctuary</h2>
            <p className="font-sans text-sm text-text-body/95 leading-relaxed">Full editorial independence, 12 months access, and complete tooling.</p>
          </div>

          <div className="flex items-baseline gap-1.5 mb-8 pb-8 border-b border-white/5">
            <span className="font-sans text-4xl sm:text-5xl font-black text-text-heading text-primary">৳1500</span>
            <span className="text-text-body/70 font-mono text-xs uppercase tracking-wider">/ 12 Month</span>
          </div>

          <div className="space-y-4 mb-10 flex-grow">
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-primary text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface font-semibold">Unlimited Lesson creation</span>
            </div>
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-primary text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface font-semibold">Premium visual block tools</span>
            </div>
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-primary text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface font-semibold">100% Ad-free experience</span>
            </div>
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-primary text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface font-semibold">Priority Discovery algorithm placement</span>
            </div>
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-primary text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface font-semibold">All Premium editorial archive access</span>
            </div>
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-primary text-[20px] shrink-0" />
              <span className="font-sans text-sm text-on-surface font-semibold">Golden 'Elder' community badge</span>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleUpgrade}
              disabled={loading || (session?.user?.isPremium)}
              className="w-full bg-primary text-background hover:bg-primary/95 hover:shadow-[0_0_25px_rgba(255,198,107,0.25)] py-4 rounded-xl font-serif text-base font-extrabold transition-all duration-200 active:scale-[0.98] mb-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (session?.user?.isPremium ? 'Current Plan' : 'Upgrade to Premium')}
            </button>
            {error && <p className="text-danger text-xs text-center mb-3">{error}</p>}
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-text-body/50">One-time billing. No recurring fees.</p>
          </div>
        </motion.div>
      </div>

      {/* Comparative Table */}
      <section className="mt-32 max-w-4xl mx-auto px-4 relative z-10">
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-text-heading mb-12">Comparative Analysis</h3>
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-bg-card/20 backdrop-blur-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="py-5 px-6 text-left font-mono text-[11px] uppercase tracking-wider text-text-body/70">Capabilities</th>
                <th className="py-5 px-6 text-center font-mono text-[11px] uppercase tracking-wider text-text-body/70">Standard</th>
                <th className="py-5 px-6 text-center font-mono text-[11px] uppercase tracking-wider text-primary">Premium</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-6 px-6 text-on-surface font-medium">Monthly Lesson Creation Limit</td>
                <td className="py-6 px-6 text-center text-text-body/80">5 Lessons</td>
                <td className="py-6 px-6 text-center text-primary font-bold">Unlimited</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-6 px-6 text-on-surface font-medium">Premium Lesson Designer Tools</td>
                <td className="py-6 px-6 text-center flex justify-center"><MdClose className="text-danger/60 text-lg" /></td>
                <td className="py-6 px-6 text-center"><MdCheckCircle className="text-success text-lg mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-6 px-6 text-on-surface font-medium">Ad-Free Reading Experience</td>
                <td className="py-6 px-6 text-center flex justify-center"><MdClose className="text-danger/60 text-lg" /></td>
                <td className="py-6 px-6 text-center"><MdCheckCircle className="text-success text-lg mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-6 px-6 text-on-surface font-medium">Priority Content Listing</td>
                <td className="py-6 px-6 text-center flex justify-center"><MdClose className="text-danger/60 text-lg" /></td>
                <td className="py-6 px-6 text-center"><MdCheckCircle className="text-success text-lg mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-6 px-6 text-on-surface font-medium">Full Library Access</td>
                <td className="py-6 px-6 text-center text-text-body/80">Partial</td>
                <td className="py-6 px-6 text-center text-primary font-bold">Full Archive</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors group">
                <td className="py-6 px-6 text-on-surface font-medium">Special Community Badge</td>
                <td className="py-6 px-6 text-center flex justify-center"><MdClose className="text-danger/60 text-lg" /></td>
                <td className="py-6 px-6 text-center"><MdVerifiedUser className="text-success text-lg mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-32 pb-20 max-w-4xl mx-auto px-4 relative z-10">
        <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-center text-text-heading mb-12">Frequently Asked Questions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-bg-card/30 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
            <h5 className="font-bold font-serif text-lg text-on-surface mb-3">Is it really a one-time payment?</h5>
            <p className="text-text-body/80 text-sm leading-relaxed">Yes. Digital Life Lessons operates on a stewardship model. You pay once to help maintain the server/sanctuary and you get permanent lifetime access to all core and future updates.</p>
          </div>
          <div className="p-6 rounded-2xl bg-bg-card/30 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
            <h5 className="font-bold font-serif text-lg text-on-surface mb-3">Can I upgrade later?</h5>
            <p className="text-text-body/80 text-sm leading-relaxed">Of course. You can start with a free account to browse the community and learn. Whenever you are ready to construct your own masterclasses, you can unlock full premium power.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
