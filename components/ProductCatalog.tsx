'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
  totalItems: number; // Total de items en la base de datos
}

export default function ProductCatalog({ zapatillas: dataInicial, totalItems }: ProductCatalogProps) {
  // 1. ESTADO VIVO: Inicializamos con lo que trajo el servidor
  const [products, setProducts] = useState<Zapatilla[]>(dataInicial);
  const [tallaFiltro, setTallaFiltro] = useState<string | null>(null);

  // 2. EFECTO DE AUTO-ACTUALIZACIÓN (Polling)
  useEffect(() => {
    const fetchFreshData = async () => {
      // Pedimos los datos frescos a la base de datos
      const { data } = await supabase
        .from('zapatillas')
        .select('*')
        .order('id', { ascending: true })
        // Mantenemos el límite sincronizado con lo que tenemos en memoria
        .limit(products.length || 12);

      if (data) {
        // En un caso real, haríamos fusión inteligente, pero aquí reemplazamos
        // asumiendo que el orden es estable.
        // Si queremos ser muy prolijos, deberíamos actualizar solo el inventario de los products existentes.
        setProducts(currentProducts => {
          // Mapeamos para actualizar solo stock si ya existe
          // O reemplazamos todo si la longitud coincide
          // Para simplicidad del Drop: Reemplazo si la longitud es similar
          if (currentProducts.length === data.length) return data;
          return currentProducts; // Si hay discrepancia (paginación en curso), evitamos saltos raros
        });
      }
    };

    const interval = setInterval(fetchFreshData, 120000); // 2 minutos
    return () => clearInterval(interval);
  }, [products.length]);

  // 3. CALCULO DINÁMICO DE TALLAS (Basado en el inventario real de lo cargado)
  const tallasDisponibles = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => {
      if (p.inventario) {
        Object.keys(p.inventario).forEach(t => s.add(t));
      }
    });
    // Ordenamos numéricamente
    return Array.from(s).sort((a, b) => Number(a) - Number(b));
  }, [products]);

  // 4. CARGAR MÁS (Paginación simple)
  const loadMore = async () => {
    const currentLength = products.length;
    const { data } = await supabase
      .from('zapatillas')
      .select('*')
      .order('id', { ascending: true })
      .range(currentLength, currentLength + 11); // Traemos 12 más

    if (data && data.length > 0) {
      setProducts(prev => [...prev, ...data]);
    }
  };

  // 5. FILTRADO
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

        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filtro de tallas">
          <button
            onClick={() => setTallaFiltro(null)}
            aria-label="Ver todas las tallas"
            aria-pressed={!tallaFiltro}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border
              ${!tallaFiltro
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-gray-500 border-neutral-800 hover:border-neutral-600'
              }`}
          >
            TODAS
          </button>

          {tallasDisponibles.map((talla) => (
            <button
              key={talla}
              onClick={() => setTallaFiltro(talla)}
              aria-label={`Filtrar por talla ${talla}`}
              aria-pressed={tallaFiltro === talla}
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
            Parece que ningún modelo viene en talla {tallaFiltro}.<br />
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

      {/* Botón Cargar Más - Solo si hay más items que mostrar */}
      {products.length < totalItems && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMore}
            aria-label="Cargar más modelos de zapatillas"
            className="px-8 py-3 bg-neutral-900 border border-neutral-700 text-white font-bold rounded hover:bg-neutral-800 transition-colors uppercase tracking-widest text-xs"
          >
            Cargar más modelos
          </button>
        </div>
      )}

    </div>
  );
}