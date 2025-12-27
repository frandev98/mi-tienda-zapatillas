'use client';

import { useCartStore } from '../lib/store';

export default function Cart() {
  // Traemos todo lo necesario del store
  const { items, removeItem, isCartOpen, toggleCart, clearCart } = useCartStore();

  // Calculamos el total
  const total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // Si está cerrado, no renderizamos nada (o podríamos usar CSS para ocultarlo)
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro (Overlay) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={toggleCart} // Click afuera cierra el carrito
      ></div>

      {/* Cajón lateral */}
      <div className="relative w-full max-w-md bg-neutral-900 h-full shadow-2xl p-6 flex flex-col border-l border-neutral-800">
        
        <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
          <h2 className="text-2xl font-bold text-white">TU PEDIDO</h2>
          <button onClick={toggleCart} className="text-gray-400 hover:text-white">
            ✕ CERRAR
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Tu carrito está vacío.</p>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.talla}`} className="flex gap-4 bg-neutral-800 p-3 rounded-lg border border-neutral-700">
                <img src={item.imagen_url} alt={item.nombre} className="w-20 h-20 object-cover rounded bg-neutral-900" />
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">{item.nombre}</h3>
                  <p className="text-gray-400 text-xs">Talla: EU {item.talla}</p>
                  <p className="text-yellow-400 font-mono mt-1">${item.precio}</p>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button 
                    onClick={() => removeItem(item.id, item.talla)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                  <span className="bg-neutral-700 text-white text-xs px-2 py-1 rounded">
                    x{item.cantidad}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con Total y Botón Pagar */}
        {items.length > 0 && (
          <div className="mt-6 border-t border-neutral-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Total a Pagar:</span>
              <span className="text-2xl font-bold text-yellow-400">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => alert("¡Aquí integraríamos Stripe o MercadoPago!")}
              className="w-full bg-yellow-400 text-black font-bold py-4 rounded hover:bg-yellow-300 transition-colors uppercase tracking-wide"
            >
              Finalizar Compra
            </button>
            <button onClick={clearCart} className="w-full text-center text-xs text-gray-500 mt-4 hover:text-white">
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}