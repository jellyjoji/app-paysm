"use client";

import "./globals.scss";
import Header from "@/components/Header"
import CTAButton from "@/components/CtaButton";

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          {children}
        </main>
        <CTAButton />
      </body>
    </html>
  );
}
