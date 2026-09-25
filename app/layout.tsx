import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "FalaDev — aprenda a falar o que você já sabe fazer", template: "%s · FalaDev" },
  description:
    "Aulas, glossário e perguntas de entrevista sobre teoria de desenvolvimento: Node.js, NestJS, Next.js, Java, Spring e fundamentos.",
};

// Aplica o tema salvo antes da primeira pintura, pra página não piscar no claro.
const scriptTema = `(function(){try{var t=localStorage.getItem("faladev:tema");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Cabecalho />
        {children}
        <Rodape />
      </body>
    </html>
  );
}
