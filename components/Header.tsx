'use client';

import { useCartStore } from '../lib/store';
import { useState, useEffect } from 'react';

export default function Header() {
  const { items, toggleCart } = useCartStore();
  const [animate, setAnimate] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  // Calculamos cantidad de items
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  // Efecto 1: Rebote inmediato al cambiar cantidad (Feedback de Acción)
  useEffect(() => {
    if (totalItems > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  // Efecto 2: Recordatorio de Atención (Wiggle cada 30s si hay items)
  useEffect(() => {
    if (totalItems === 0) return;

    const interval = setInterval(() => {
      setWiggle(true);
      // Duración del wiggle (ej. 1 segundo = 3 iteraciones de 0.3s)
      setTimeout(() => setWiggle(false), 1000);
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LOGO */}
        <div className="font-black text-xl text-white tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          MI<span className="text-yellow-400">TIENDA</span>
        </div>

        {/* BOTÓN DEL CARRITO MEJORADO (Responsive CTA + Attention Grabber) */}
        <button
          onClick={toggleCart}
          aria-label={totalItems > 0 ? `Ver carrito con ${totalItems} productos` : "Ver carrito vacío"}
          className={`
            relative flex items-center gap-2 transition-all duration-300 p-2
            text-white hover:text-yellow-400
            ${animate ? 'scale-125' : 'scale-100'}
            ${wiggle ? 'animate-wiggle text-yellow-400 ring-2 ring-yellow-400/50 rounded-full' : ''}
          `}
        >
          {/* TEXTO CTA (Solo Desktop y si hay items) */}
          {totalItems > 0 && (
            <span className="hidden md:block text-sm font-bold tracking-wide animate-fade-in">
              MI BOLSA
            </span>
          )}

          {/* El Icono */}
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

            {/* El circulito rojo con el número (Badge) */}
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm border-2 border-black">
                {totalItems}
              </span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}