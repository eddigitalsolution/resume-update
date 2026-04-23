import { PrintShell } from "@/components/portfolio/PrintShell";

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrintShell>
      {children}
    </PrintShell>
  );
}
