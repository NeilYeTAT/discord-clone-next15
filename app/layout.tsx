import "~/styles/tailwind.css";
import { Open_Sans } from "next/font/google";

const OpenSansFont = Open_Sans({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={OpenSansFont.className}>
      <body>{children}</body>
    </html>
  );
}
