'use client';

import { useCartStore } from '../lib/store';
import { useState, useEffect } from 'react';

export default function Header() {
  const { items, toggleCart } = useCartStore();
  const [animate, setAnimate] = useState(false);
  
  // Calculamos cantidad de items y el DINERO total
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // Efecto de "rebote" cuando cambia la cantidad
  useEffect(() => {
    if (totalItems > 0) {
      setAnimate(true);
      // Quitamos la animación después de 300ms
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LOGO */}
        <div className="font-black text-xl text-white tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          MI<span className="text-yellow-400">TIENDA</span>
        </div>

        {/* BOTÓN DEL CARRITO MEJORADO */}
        <button 
          onClick={toggleCart} 
          className={`
            relative flex items-center gap-3 transition-all duration-300
            ${totalItems > 0 ? 'bg-white text-black pl-4 pr-2 py-1.5 rounded-full hover:bg-yellow-400' : 'text-white hover:text-yellow-400'}
            ${animate ? 'scale-110' : 'scale-100'} 
          `}
        >
          {/* Si hay dinero, mostramos el texto "PAGAR" y el MONTO */}
          {totalItems > 0 && (
            <div className="flex flex-col items-end leading-none mr-1">
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                Tu Pedido
              </span>
              <span className="font-bold font-mono text-sm">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          )}

          {/* El Icono */}
          <div className="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

            {/* El circulito rojo con el número (Badge) */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}