import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";
import { TestParametersProvider } from "./TestParametersContext";

const themeInitScript = `(function(){try{var m=localStorage.getItem('math-practice:themeMode');var d=m==='dark'||(m!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Math Practice for Kids",
  description: "Learn arithmetic operations in a fun way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${fredoka.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <TestParametersProvider>
              {children}
            </TestParametersProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
