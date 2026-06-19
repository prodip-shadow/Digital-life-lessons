"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MdCheckCircle, MdError } from 'react-icons/md';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(async (data) => {
          if (data.success) {
            // Force a refresh of the Better Auth session to sync client state
            try {
              await authClient.getSession({
                query: {
                  disableCookieCache: true
                }
              });
            } catch (sessionErr) {
              console.error('Failed to refresh session on success:', sessionErr);
            }
            setStatus('success');
          } else {
            setStatus('error');
            setErrorMessage(data.error || 'Payment verification failed.');
          }
        })
        .catch(err => {
          console.error('Error verifying payment:', err);
          setStatus('error');
          setErrorMessage('An error occurred during verification.');
        });
    } else {
      setStatus('error');
      setErrorMessage('No session ID found.');
    }
  }, [sessionId]);

  return (
    <div className="max-w-md w-full bg-[#181a20] rounded-2xl border border-white/5 p-8 text-center shadow-2xl space-y-6">
      {status === 'loading' && (
        <>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <span className="loading loading-spinner loading-md"></span>
          </div>
          <h1 className="text-3xl font-serif text-text-heading">Verifying Payment...</h1>
          <p className="text-on-surface-variant font-sans">
            Please wait while we secure your premium membership status.
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success mx-auto">
            <MdCheckCircle className="text-4xl" />
          </div>
          <h1 className="text-3xl font-serif text-text-heading">Payment Successful!</h1>
          <p className="text-on-surface-variant font-sans">
            Your lifetime premium subscription is now active. Thank you for supporting Digital Life Lessons.
          </p>
          <div className="pt-4">
            <Link href="/" className="btn btn-primary w-full">
              Go to Home
            </Link>
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 mx-auto">
            <MdError className="text-4xl" />
          </div>
          <h1 className="text-3xl font-serif text-text-heading">Verification Failed</h1>
          <p className="text-rose-400 font-sans text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
            {errorMessage}
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/upgrade" className="btn btn-outline border-white/10 w-full text-on-surface">
              Back to Upgrade
            </Link>
            <Link href="/" className="btn btn-ghost w-full">
              Go to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-card p-8">
      <Suspense fallback={
        <div className="max-w-md w-full bg-[#181a20] rounded-2xl border border-white/5 p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <span className="loading loading-spinner loading-md"></span>
          </div>
          <h1 className="text-3xl font-serif text-text-heading">Loading...</h1>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
