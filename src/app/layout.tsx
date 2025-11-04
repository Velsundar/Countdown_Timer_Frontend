import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";


const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sundaravel & Ranjitha - Our Journey Begins",
  description: "A wedding countdown and celebration app for Sundaravel & Ranjitha 💍",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream text-charcoal`}>
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
