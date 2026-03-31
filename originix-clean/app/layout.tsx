import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Originix - Where Ideas Become Reality",
  description: "Generate truly original concepts with AI, share with the community, and connect with investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
