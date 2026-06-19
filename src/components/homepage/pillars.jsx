import React from 'react';
import { MdAutoAwesome, MdPsychology, MdDiversity1, MdWorkspacePremium } from 'react-icons/md';

export default function Pillars() {
  return (
    <section className="py-24 bg-surface-container-lowest">
      <div className="px-4 md:px-12 w-full">
        <div className="text-center mb-20">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading mb-4">The Pillars of Digital Sanctuary</h2>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full border border-secondary flex items-center justify-center mx-auto mb-6">
              <MdAutoAwesome className="text-secondary text-3xl" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-white mb-3">Authentic Wisdom</h4>
            <p className="text-text-body text-sm font-sans">Real stories from people who have navigated the complexities of life firsthand.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mx-auto mb-6">
              <MdPsychology className="text-primary text-3xl" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-white mb-3">Reflective Growth</h4>
            <p className="text-text-body text-sm font-sans">A space designed to encourage deep thought rather than mindless scrolling.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full border border-tertiary flex items-center justify-center mx-auto mb-6">
              <MdDiversity1 className="text-tertiary text-3xl" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-white mb-3">Supportive Community</h4>
            <p className="text-text-body text-sm font-sans">Connect with others through shared experiences and mutual understanding.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full border border-success flex items-center justify-center mx-auto mb-6">
              <MdWorkspacePremium className="text-success text-3xl" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-white mb-3">Curated Quality</h4>
            <p className="text-text-body text-sm font-sans">High-signal content curated to ensure every lesson provides true value.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
