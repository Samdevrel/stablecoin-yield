import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stablecoin Yield Aggregator | @samdevrel",
  description: "Compare stablecoin yields across 12 DeFi protocols. Find the best APY for USDC, DAI, and more.",
  keywords: ["stablecoin", "yield", "APY", "DeFi", "lending", "USDC", "DAI", "Aave", "Compound"],
  authors: [{ name: "Sam", url: "https://x.com/samdevrel" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
