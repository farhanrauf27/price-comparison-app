// src/app/layout.tsx
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body 
        className="bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen" 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}