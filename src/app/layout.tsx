import type { Metadata } from "next";
import Provider from "./provider";

// styles
import "./globals.css";

export const metadata: Metadata = {
  title: "OCR Scanner",
  description: "OCR Scanner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
