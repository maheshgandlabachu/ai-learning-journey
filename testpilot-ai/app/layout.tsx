import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TestPilot AI — Test Case Generator",
  description:
    "Generate smarter test cases from user stories in seconds. Phase 1 MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
