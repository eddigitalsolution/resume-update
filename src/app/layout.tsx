import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { createClient } from "@/lib/supabase-server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("resume")
    .select("homepage_config")
    .limit(1)
    .maybeSingle();

  const config = profile?.homepage_config || {};
  const siteTitle = config.seo_title || "Professional Duality Portfolio | Strategic Growth & Engineering";
  const siteDesc = config.seo_description || "Bridging the gap between Strategic Growth and Technical Engineering. High-precision software development and business impact metrics.";
  const siteName = config.site_name || "Professional Duality";

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`
    },
    description: siteDesc,
    metadataBase: new URL('http://localhost:3000'), // Change to actual URL in production
    icons: {
      icon: [
        { url: '/favicon-new.png?v=2', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/favicon-new.png?v=2', sizes: '180x180', type: 'image/png' },
      ],
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'http://localhost:3000',
      title: siteTitle,
      description: siteDesc,
      siteName: siteName,
      images: '/favicon.png'
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDesc,
      images: '/favicon.png'
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("resume")
    .select("homepage_config")
    .limit(1)
    .maybeSingle();

  const siteName = profile?.homepage_config?.site_name || "Portfolio";
  const logoInitial = siteName.charAt(0).toUpperCase();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} dark h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-black text-gray-100">
        <Navbar siteName={siteName} logoInitial={logoInitial} />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-white/5 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {siteName}. Resume Update</p>
        </footer>
      </body>
    </html>
  );
}
