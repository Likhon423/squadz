import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Squadz",
  description: "Best LFG app in the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={montserrat.className}>
          <div className="w-full">
            <Navbar />
          </div>
          <div className="px-4 md:px-8 lg:px-16 xl:px-32">{children}</div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
