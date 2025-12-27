import { supabase } from '../lib/supabase';

// 1. Convertimos la función en "async" para poder pedir datos al servidor
export default async function Home() {
  
  // 2. Pedimos las zapatillas a Supabase (SELECT * FROM zapatillas)
  const { data: zapatillas } = await supabase.from('zapatillas').select('*');

  return (
    <main className="min-h-screen bg-neutral-900 text-white pb-20">
      {/* SECCIÓN HERO: El gancho inicial */}
      <div className="flex flex-col items-center justify-center py-20 bg-black border-b border-neutral-800">
        <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 tracking-tighter text-center">
          DROP EXCLUSIVO
        </h1>
        <p className="mt-4 text-xl text-gray-400 max-w-lg text-center px-4">
          Unidades limitadas. Cuando el contador llegue a cero, se acabó.
        </p>
      </div>

      {/* SECCIÓN PRODUCTOS: Aquí ocurre la magia */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 3. "Mapeamos" los datos: Por cada zapatilla, creamos una tarjeta */}
          {zapatillas?.map((zapatilla) => (
            <div key={zapatilla.id} className="group relative bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-yellow-400 transition-all duration-300">
              
              {/* Imagen del producto */}
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={zapatilla.imagen_url} 
                  alt={zapatilla.nombre}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                {/* Etiqueta de Stock (Pura psicología de ventas) */}
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  ¡Solo quedan {zapatilla.stock}!
                </div>
              </div>

              {/* Información */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-white leading-tight">{zapatilla.nombre}</h2>
                  <span className="text-yellow-400 font-mono text-lg">${zapatilla.precio}</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{zapatilla.descripcion}</p>
                
                {/* Tallas disponibles */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {zapatilla.tallas?.map((talla: string) => (
                    <span key={talla} className="text-xs border border-neutral-600 text-neutral-300 px-2 py-1 rounded">
                      EU {talla}
                    </span>
                  ))}
                </div>

                {/* Botón de Acción (CTA) */}
                <button className="w-full bg-white text-black font-bold py-3 rounded hover:bg-yellow-400 hover:text-black transition-colors">
                  COMPRAR AHORA
                </button>
              </div>
            </div>
          ))}
          
        </div>

        {/* Mensaje si no hay nada (Manejo de errores) */}
        {!zapatillas?.length && (
          <p className="text-center text-gray-500 mt-10">No hay drops activos en este momento.</p>
        )}
      </div>
    </main>
  );
}