import type { Metadata } from "next";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "FitNoD — Dance Your Way To Fitness | India's #1 Dance Fitness Program",
  description:
    "FitNoD is India's leading dance fitness platform. Join fun, energetic dance-based workouts designed for every body and every age. Fat loss, active lifestyle, and community-driven fitness through dance.",
  keywords: [
    "dance fitness",
    "FitNoD",
    "Zumba",
    "Bollywood fitness",
    "online dance workout",
    "dance exercise",
    "fat loss dance",
    "fitness for all ages",
    "Avik Bhattacharya",
  ],
  openGraph: {
    title: "FitNoD — Dance Your Way To Fitness",
    description:
      "Fun, engaging dance-based workouts designed for every body and every age. Join 5000+ members transforming their lives through dance fitness.",
    type: "website",
    locale: "en_IN",
    siteName: "FitNoD",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitNoD — Dance Your Way To Fitness",
    description:
      "Fun, engaging dance-based workouts designed for every body and every age.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-theme="light" suppressHydrationWarning>
      {/* Prevent flash of wrong theme — suppressHydrationWarning: script may set dark before hydrate */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fitnod-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider />
        {children}
        <FloatingCTA />
      </body>
    </html>
  );
}
