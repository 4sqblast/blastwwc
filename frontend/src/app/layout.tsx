import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fresh Oil | 4SQ Blast 2026",
  description:
    "Join the Fresh Oil Word & Worship Conference in Lagos, 19–22 November 2026.",
  generator: "4sqblast",
  icons: {
    icon: [
      {
        url: "/blast-logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/blast-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/blast-logo.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === "production"}
      </body>
    </html>
  );
}
