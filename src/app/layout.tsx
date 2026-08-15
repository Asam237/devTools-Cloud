import { AuthProvider } from "@/components/auth-provider";
import { DonateNudge } from "@/components/donate-nudge";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";
import { HistorySync } from "@/components/history-sync";
import { SignupBanner } from "@/components/signup-banner";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_TITLE = "DevTools Cloud — One toolbox for every developer";
const DEFAULT_DESCRIPTION =
  "Free, fast, client-side developer tools: JSON formatting, JWT decoding, regex testing, UUID generation, SQL formatting, and more. Your data never leaves your browser.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("devtools-cloud:theme");
    var theme = stored === "light" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <AuthProvider>
          <SignupBanner />
          <SiteHeader />
          <HistorySync />
          <div className="flex flex-1 flex-col">{children}</div>
          <footer className="border-t border-border">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-xs text-foreground-subtle sm:flex-row sm:justify-between sm:px-6">
              <p>© {new Date().getFullYear()} DevTools Cloud</p>
              <p>All tools run locally in your browser</p>
            </div>
          </footer>
          <FeedbackWidget />
          <DonateNudge />
        </AuthProvider>
      </body>
    </html>
  );
}
