import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { Navigation } from "@/components/navigation/Navigation";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: {
    template: "%s — Guild Shop",
    default: "Guild Shop — A Guild of Visionary Designers",
  },
  description:
    "Guild Shop is a curated digital marketplace for independent fashion designers and jewellery artists. Not a store — a guild.",
  keywords: ["luxury fashion", "independent designers", "jewellery", "curated marketplace", "avant-garde"],
  openGraph: {
    title: "Guild Shop — A Guild of Visionary Designers",
    description: "Where fashion becomes art.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navigation />
          <main>{children}</main>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
