import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { QuickView } from "@/components/ui/QuickView";
import { Interactions } from "@/components/layout/Interactions";
import { Toast } from "@/components/ui/Toast";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "NOVA STRIDE — Take it apart. Put it back.",
  description: "Interactive 3D sneaker experience. Explore every layer, customise every detail.",
};
export const viewport: Viewport = { themeColor: "#070908", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <StoreProvider>
          <SmoothScroll />
          <Interactions />
          <Header />
          {children}
          <Footer />
          <CartDrawer />
          <QuickView />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
