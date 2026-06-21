"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Form, Input } from '@/components/form/form';
import Button from '@/components/button/button';
import { authClient } from "@/lib/auth-client";
import { MdMenuBook } from 'react-icons/md';

function SignUpContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("redirect") || "/dashboard";

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      window.location.href = callbackUrl;
    }
  }, [session, callbackUrl]);

  const handleSignUp = async (e) => {
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const photoUrl = formData.get("photo-url");
    const password = formData.get("password");

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl || undefined,
        callbackURL: callbackUrl,
      });
      if (error) {
        setIsError(true);
        setMessage(error.message || "An error occurred during registration.");
      } else {
        setMessage('Account successfully created! Redirecting...');
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setIsError(true);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage('');
    setIsError(false);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl
      });
    } catch (err) {
      setIsError(true);
      setMessage("Google Sign In failed to initiate.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center w-full bg-[#0D0F14]">
      {/* Right: Register Form Canvas */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12 bg-background min-h-screen overflow-y-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-[440px] my-auto py-12"
        >
          <div className="mb-12 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-primary-container">
                <MdMenuBook className="text-xl" />
              </div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-on-surface">Digital Life Lessons</span>
            </Link>
            <h1 className="font-serif text-5xl font-bold md:text-display-lg mb-2">
              Join the Sanctuary
            </h1>
            <p className="text-text-body font-sans text-base">
              Start your collection of digital life lessons.
            </p>
          </div>

          <div className="bg-bg-card p-8 rounded-xl border border-white/5 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient gold glow decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="btn w-full bg-white text-black hover:bg-gray-100 border-none font-medium text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {/* Google icon here */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Sign up with Google
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-white/5"></div>
              <span className="font-mono uppercase tracking-widest text-[10px] text-text-body uppercase tracking-widest">Or with email</span>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 border rounded text-sm text-center ${
                  isError 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}
              >
                {message}
              </motion.div>
            )}

            <Form onSubmit={handleSignUp}>
              <Input 
                label="Full Name" 
                type="text" 
                id="name"
                name="name"
                placeholder="Marcus Aurelius" 
                autoComplete="name"
                required
              />

              <Input 
                label="Email Address" 
                type="email" 
                id="email"
                name="email"
                placeholder="name@example.com" 
                autoComplete="username"
                required
              />

              <Input 
                label="Photo URL" 
                type="url" 
                id="photo-url"
                name="photo-url"
                placeholder="https://example.com/avatar.jpg" 
              />

              <div>
                <label htmlFor="password" className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body uppercase">Password</label>
                <Input 
                  type="password" 
                  id="password"
                  name="password"
                  placeholder="••••••••" 
                  autoComplete="new-password"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-5 relative flex items-center justify-center" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Form>
          </div>

          <p className="mt-8 text-center text-text-body font-sans text-base">
            <span>Already have an account? </span>
            <Link href="/sign-in" className="btn btn-link btn-sm text-primary px-1 hover:underline">
              Sign In
            </Link>
          </p>
          
          <div className="mt-16 flex flex-wrap justify-center gap-6 opacity-40">
            <Link href="#" className="font-mono uppercase tracking-widest text-[10px] hover:text-primary transition-colors">PRIVACY POLICY</Link>
            <Link href="#" className="font-mono uppercase tracking-widest text-[10px] hover:text-primary transition-colors">TERMS OF SERVICE</Link>
            <Link href="#" className="font-mono uppercase tracking-widest text-[10px] hover:text-primary transition-colors">SUPPORT</Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0D0F14]"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
      <SignUpContent />
    </Suspense>
  );
}
