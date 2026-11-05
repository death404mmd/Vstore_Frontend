import "vazirmatn/Vazirmatn-font-face.css";
import "./globals.css";

export const metadata = {
  title: "[نام برند] | سایتی که می‌فروشد",
  description: "طراحی و ساخت سایت فروشگاهی، شرکتی و پنل مدیریت",
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
