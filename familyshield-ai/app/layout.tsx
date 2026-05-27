import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamilyShield AI — Parental Control Dashboard",
  description:
    "AI-powered parental control planning for Android, iOS, and Windows. Phase 1 MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
