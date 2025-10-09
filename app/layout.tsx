import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turbine Manager",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout(props: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased">{props.children}</body>
    </html>
  );
}
