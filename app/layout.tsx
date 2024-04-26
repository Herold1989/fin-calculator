import type { Metadata } from "next";
import "./globals.css";
import { PrimeReactProvider } from 'primereact/api';


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link
          id="theme-link"
          rel="stylesheet"
          href="./themes.css"
        />
      </head>
      <body>
        <PrimeReactProvider>
          <main>{children}</main>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
