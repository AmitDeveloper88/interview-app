import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview Questions & Answers",
  description: "Practice technical interview questions by topic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-zinc-900`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('app-theme') === 'dark' || (!('app-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        {children}
        <ScrollToTop />
        <footer className="mt-auto py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            &copy; {new Date().getFullYear()} Interview Q&A.
          </p>
        </footer>
      </body>
    </html>
  );
}