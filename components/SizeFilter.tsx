'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const TALLAS = ['38', '39', '40', '41', '42', '43', '44', '45'];

export default function SizeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tallaActiva = searchParams.get('talla');

  const handleFilter = (talla: string | null) => {
    // Si la talla ya estaba activa o es null, limpiamos el filtro
    if (talla === tallaActiva || talla === null) {
      // { scroll: false } evita que la página salte hacia arriba 🛑
      router.push('/', { scroll: false }); 
    } else {
      // Aquí también aplicamos scroll: false
      router.push(`/?talla=${talla}`, { scroll: false });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mb-12">
      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">
        Filtra por tu talla y evita decepciones
      </h3>
      
      <div className="flex flex-wrap justify-center gap-2">
        {/* Botón "Ver Todos" */}
        <button
          onClick={() => handleFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all border
            ${!tallaActiva 
              ? 'bg-white text-black border-white' 
              : 'bg-transparent text-gray-500 border-neutral-800 hover:border-neutral-600'
            }`}
        >
          TODAS
        </button>

        {/* Botones de Tallas */}
        {TALLAS.map((talla) => (
          <button
            key={talla}
            onClick={() => handleFilter(talla)}
            className={`w-10 h-10 rounded-full text-sm font-bold transition-all border flex items-center justify-center
              ${tallaActiva === talla 
                ? 'bg-yellow-400 text-black border-yellow-400 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.4)]' 
                : 'bg-transparent text-gray-300 border-neutral-700 hover:border-white'
              }`}
          >
            {talla}
          </button>
        ))}
      </div>
    </div>
  );
}