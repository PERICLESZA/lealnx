import "./globals.css";
import { Metadata } from "next";
import { ClientLayout } from "./client-layout"; // novo arquivo


export const metadata: Metadata = {
  title: ".:Luna Travel:.",
  description: "Aprendendo Next Js do Zero com Sujeito Programador.",
  openGraph: {
    title: "Aprendendo Next Js do Zero com Sujeito Programador.",
    description: "Aprendendo Next Js do Zero com Sujeito Programador.",
    images: ["https://sujeitoprogramador.com/steve.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
