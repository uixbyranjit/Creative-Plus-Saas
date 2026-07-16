import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "Creative Plus Agency Portal",
  description: "Creative Plus Digital Marketing Agency CRM & client portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

