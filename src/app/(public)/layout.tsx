import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase-server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("resume")
    .select("homepage_config")
    .limit(1)
    .maybeSingle();

  const siteName = profile?.homepage_config?.site_name || "Portfolio";
  const logoInitial = siteName.charAt(0).toUpperCase();

  return (
    <>
      <Navbar siteName={siteName} logoInitial={logoInitial} />
      <main className="flex-1 pt-24 lg:pt-32">
        {children}
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </footer>
    </>
  );
}
