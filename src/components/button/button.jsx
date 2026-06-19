import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-outline border-primary/30 text-primary hover:bg-primary hover:text-background",
    outline: "btn-outline border-white/20 text-on-surface hover:bg-white/5",
    text: "btn-ghost",
  }[variant] || "btn-primary";

  return (
    <button className={`btn ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
