import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sismode - Revisión de Diseños",
  description: "Portal de recepción y revisión de archivos de diseño para clientes de Sismode.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="header">
          <div className="container" style={{ padding: '0 1rem' }}>
            <div className="logo">Sis<span>mode</span></div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Portal de Recepción de Arte
            </div>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
