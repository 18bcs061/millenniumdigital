import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getCategories } from "@/lib/catalog";
import { Providers } from "@/app/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "MillenniumDigital — Electronics Components Marketplace",
  description: "A colorful, dynamic B2C/B2B marketplace for sensors, semiconductors, embedded solutions, connectors, power, and optoelectronics.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const categories = getCategories();

  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-brand-surface">
        <Providers>
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
