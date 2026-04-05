import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"], // Кирилл дэмжлэгийг заавал нэмнэ
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"], // Шаардлагатай зузаанууд
});

export const metadata: Metadata = {
  title: "Намайг дэмжих",
  description:
    "Миний бүтээлийг дэмжих хамгийн хялбар арга. QPay-ээр төлбөр төлж талархал илгээгээрэй.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
