import { inter, playfair, spaceMono } from '../fonts/fonts';
import "./globals.css";

export const metadata = {
  title: "Digital Life Lessons | Preserve Your Wisdom",
  description: "A digital sanctuary for capturing the profound lessons of a life well-lived.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${playfair.variable} ${spaceMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head />
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-on-surface font-sans text-base overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
