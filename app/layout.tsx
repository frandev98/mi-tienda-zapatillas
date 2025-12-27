import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header"; // <--- IMPORTANTE
import Cart from "../components/Cart";

export const metadata: Metadata = {
  title: "Tienda de Zapatillas | Drop Exclusivo",
  description: "Stock limitado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-neutral-950">
        
        <Header /> {/* <--- AQUI VA LA BARRA FIJA */}
        
        <Cart />
        
        {children}
        
      </body>
    </html>
  );
}