import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export function Input({ label, type = "text", id, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body uppercase">
          {label}
        </label>
      )}
      <div className="relative">
          <input
            id={id}
            type={currentType}
            className="input input-bordered w-full bg-[#1A1D28] border-white/10 text-on-surface focus:border-primary-container focus:outline-none"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-body/60 hover:text-text-body cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <MdVisibilityOff className="text-[20px]" />
            ) : (
              <MdVisibility className="text-[20px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function Form({ children, onSubmit, ...props }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}
