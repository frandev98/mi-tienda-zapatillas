'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Necesitamos conectar con Supabase aquí también
import ProductCard from './ProductCard';

interface Zapatilla {
  id: number;
  nombre: string;
  precio: number;
  precio_retail?: number;
  imagen_url: string;
  descripcion: string;
  inventario: Record<string, number> | null;
}

interface ProductCatalogProps {
  zapatillas: Zapatilla[]; // Datos iniciales (Server Side)
}

const TALLAS = ['38', '39', '40', '41', '42', '43', '44', '45'];

export default function ProductCatalog({ zapatillas: dataInicial }: ProductCatalogProps) {
  // 1. ESTADO VIVO: Inicializamos con lo que trajo el servidor, pero permitimos cambios
  const [products, setProducts] = useState<Zapatilla[]>(dataInicial);
  const [tallaFiltro, setTallaFiltro] = useState<string | null>(null);

  // 2. EFECTO DE AUTO-ACTUALIZACIÓN (Polling) 🔄
  useEffect(() => {
    const fetchFreshData = async () => {
      // Pedimos los datos frescos a la base de datos
      const { data } = await supabase
        .from('zapatillas')
        .select('*')
        .order('id', { ascending: true });
      
      if (data) {
        setProducts(data);
        // Opcional: Solo para que veas en la consola que funciona
        // console.log("📦 Stock actualizado en segundo plano");
      }
    };

    // Configuramos el intervalo: 120,000 ms = 2 minutos
    // Puedes bajarlo a 60000 (1 min) si el Drop está muy caliente 🔥
    const interval = setInterval(fetchFreshData, 120000); 

    // Limpieza: Si el usuario se va, dejamos de pedir datos
    return () => clearInterval(interval);
  }, []);

  // 3. FILTRADO (Ahora usamos 'products' que es el estado actualizado)
  const zapatillasFiltradas = useMemo(() => {
    if (!tallaFiltro) return products;

    return products.filter((zap) => {
      const inventario = zap.inventario || {};
      return inventario[tallaFiltro] !== undefined;
    });
  }, [products, tallaFiltro]);

  return (
    <div className="container mx-auto px-4 mt-12 mb-40">
      
      {/* Botonera de Filtros */}
      <div className="flex flex-col items-center justify-center gap-4 mb-12">
        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">
          Filtra por tu talla (Instantáneo)
        </h3>
        
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setTallaFiltro(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border
              ${!tallaFiltro 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-gray-500 border-neutral-800 hover:border-neutral-600'
              }`}
          >
            TODAS
          </button>

          {TALLAS.map((talla) => (
            <button
              key={talla}
              onClick={() => setTallaFiltro(talla)}
              className={`w-10 h-10 rounded-full text-sm font-bold transition-all border flex items-center justify-center
                ${tallaFiltro === talla 
                  ? 'bg-yellow-400 text-black border-yellow-400 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.4)]' 
                  : 'bg-transparent text-gray-300 border-neutral-700 hover:border-white'
                }`}
            >
              {talla}
            </button>
          ))}
        </div>
      </div>

      {/* Mensaje de Resultados */}
      {tallaFiltro && (
        <p className="text-center text-gray-400 mb-8 animate-fade-in">
          {zapatillasFiltradas.length > 0 
            ? <>Mostrando modelos disponibles en talla <span className="text-yellow-400 font-bold">EU {tallaFiltro}</span></>
            : <>No encontramos modelos en talla <span className="text-yellow-400 font-bold">EU {tallaFiltro}</span> 😢</>
          }
        </p>
      )}

      {/* Grilla de Productos */}
      {zapatillasFiltradas.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/50 rounded-xl border border-neutral-800 max-w-2xl mx-auto">
          <p className="text-4xl mb-4">👟💨</p>
          <h3 className="text-white text-xl font-bold mb-2">Ups, talla no encontrada.</h3>
          <p className="text-gray-500">
            Parece que ningún modelo viene en talla {tallaFiltro}.<br/>
            Intenta filtrar por otra.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {zapatillasFiltradas.map((zap) => (
            <ProductCard 
              key={zap.id}
              {...zap}
              initialSize={tallaFiltro || undefined} 
            />
          ))}
        </div>
      )}
    </div>
  );
}