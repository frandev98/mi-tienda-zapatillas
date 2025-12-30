'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCartStore } from '../lib/store';
import { useToastStore } from '../lib/toastStore';
import WaitlistModal from './WaitlistModal';

interface ProductCardProps {
  id: number;
  nombre: string;
  precio: number;
  precio_retail?: number;
  imagen_url: string;
  descripcion: string;
  inventario: Record<string, number> | null;
  initialSize?: string;
}

export default function ProductCard({ id, nombre, precio, precio_retail, imagen_url, descripcion, inventario, initialSize }: ProductCardProps) {

  const [selectedSize, setSelectedSize] = useState<string | null>(initialSize || null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToastStore();

  useEffect(() => {
    if (initialSize) {
      setSelectedSize(initialSize);
    }
  }, [initialSize]);

  const { tallasDisponibles, stockTotal, stockDeLaTallaSeleccionada } = useMemo(() => {
    if (!inventario) return { tallasDisponibles: [], stockTotal: 0, stockDeLaTallaSeleccionada: 0 };

    const tallas = Object.keys(inventario).sort();
    const total = Object.values(inventario).reduce((a, b) => a + b, 0);
    const stockSeleccionado = selectedSize ? inventario[selectedSize] : 0;

    return {
      tallasDisponibles: tallas,
      stockTotal: total,
      stockDeLaTallaSeleccionada: stockSeleccionado
    };
  }, [inventario, selectedSize]);

  const isGlobalSoldOut = stockTotal === 0;

  // Esta variable es la clave: Es TRUE si está agotado globalmente O si la talla elegida es 0
  const isSelectionSoldOut = isGlobalSoldOut || (selectedSize !== null && stockDeLaTallaSeleccionada === 0);

  const descuento = (precio_retail && precio_retail > precio)
    ? Math.round(((precio_retail - precio) / precio_retail) * 100)
    : 0;

  // 1. ESTANDARIZACIÓN DE TEXTO: Todo es "AGOTADO"
  const getStockLabel = () => {
    if (isGlobalSoldOut) return 'AGOTADO'; // Caso Global

    let stockParaMostrar = 0;

    if (selectedSize) {
      if (stockDeLaTallaSeleccionada === 0) return 'AGOTADO'; // Caso Talla Específica (Antes decía SIN STOCK)
      stockParaMostrar = stockDeLaTallaSeleccionada;
    } else {
      stockParaMostrar = stockTotal;
    }

    return stockParaMostrar === 1
      ? '¡Solo queda 1 par!'
      : `¡Quedan ${stockParaMostrar} pares!`;
  };

  const handleMainAction = () => {
    if (!selectedSize) {
      alert('¡Por favor selecciona una talla primero!');
      return;
    }

    if (isSelectionSoldOut) {
      setIsWaitlistOpen(true);
      return;
    }

    // 1. FEEDBACK AUDITIVO
    const audio = new Audio('/sounds/buy.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log(e));

    // 2. FEEDBACK TÁCTIL (Haptic)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }

    // 3. FEEDBACK EMOCIONAL (Toast)
    showToast(`¡ASEGURADO! 🔥`, `Talla ${selectedSize} reservada.`);

    addItem({
      id,
      nombre,
      precio,
      imagen_url,
      talla: selectedSize,
      cantidad: 1,
      maxStock: stockDeLaTallaSeleccionada,
    });
  };

  return (
    <>
      <div className={`
        group relative bg-neutral-800 rounded-xl overflow-hidden border 
        transition-all duration-300 flex flex-col h-full
        ${isGlobalSoldOut ? 'border-neutral-700' : 'border-neutral-700 hover:border-yellow-400'}
      `}>

        {/* IMAGEN: Ahora reacciona a isSelectionSoldOut */}
        <div className="aspect-square relative overflow-hidden bg-neutral-900">
          <img
            src={imagen_url}
            alt={nombre}
            // 2. ESTANDARIZACIÓN VISUAL: 
            // Si la selección está agotada (global o talla), se pone gris y opaca.
            className={`object-cover w-full h-full transition-transform duration-500 
              ${isSelectionSoldOut ? 'grayscale opacity-60' : 'group-hover:scale-110'}`}
          />

          {/* Badge Descuento (Visible siempre) */}
          {descuento > 0 && (
            <div className={`
              absolute top-3 left-3 text-black text-sm font-extrabold px-3 py-1 rounded shadow-md z-10
              ${isSelectionSoldOut ? 'bg-yellow-400/80' : 'bg-yellow-400'} 
            `}>
              -{descuento}%
            </div>
          )}

          {/* Badge Stock (Usa el texto estandarizado) */}
          <div className={`
            absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all z-10
            ${isSelectionSoldOut ? 'bg-neutral-900 text-white border border-neutral-700' : 'bg-red-600 text-white animate-pulse'}
          `}>
            {getStockLabel()}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-white leading-tight mb-2">{nombre}</h2>

          <div className="flex items-baseline gap-2 mb-3">
            {precio_retail && precio_retail > precio && (
              <span className="text-gray-500 text-sm line-through decoration-gray-500">
                ${precio_retail.toFixed(2)}
              </span>
            )}
            {/* El precio también se "apaga" si está agotado */}
            <span className={`font-mono text-xl font-bold ${isSelectionSoldOut ? 'text-gray-400' : 'text-yellow-400'}`}>
              ${precio.toFixed(2)}
            </span>
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{descripcion}</p>

          <div className="mb-4">
            <span className="text-xs text-gray-500 mb-2 block uppercase tracking-wide">
              {isGlobalSoldOut ? 'Selecciona talla para lista de espera:' : 'Selecciona tu talla:'}
            </span>
            <div className="flex gap-2 flex-wrap">
              {tallasDisponibles.map((talla) => {
                const stockTalla = inventario ? inventario[talla] : 0;
                const isTallaAgotada = stockTalla === 0;

                return (
                  <button
                    key={talla}
                    onClick={() => setSelectedSize(talla)}
                    className={`
                      relative text-sm px-3 py-1 rounded border transition-all
                      ${selectedSize === talla
                        ? (isTallaAgotada
                          ? 'bg-transparent text-white border-white font-bold ring-2 ring-white/50'
                          : 'bg-yellow-400 text-black border-yellow-400 font-bold scale-110')
                        : (isTallaAgotada
                          ? 'bg-neutral-900 text-neutral-500 border-neutral-800 border-dashed hover:border-neutral-500'
                          : 'bg-transparent text-gray-300 border-neutral-600 hover:border-white')
                      }
                    `}
                  >
                    EU {talla}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleMainAction}
            className={`
              w-full font-bold py-3 rounded transition-all duration-200 uppercase tracking-wide
              ${!selectedSize
                ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                : isSelectionSoldOut
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
              }
            `}
          >
            {!selectedSize
              ? 'ELIGE TU TALLA'
              : isSelectionSoldOut
                ? '🔔 AVÍSAME CUANDO LLEGUE'
                : 'AGREGAR AL CARRITO'
            }
          </button>
        </div>
      </div>

      {selectedSize && (
        <WaitlistModal
          isOpen={isWaitlistOpen}
          onClose={() => setIsWaitlistOpen(false)}
          productName={nombre}
          productId={id}
          talla={selectedSize}
        />
      )}
    </>
  );
}