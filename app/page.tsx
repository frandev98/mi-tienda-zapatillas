import { supabase } from '../lib/supabase';
import TrustSection from '../components/TrustSection';
import DropCountdown from '../components/DropCountdown';
import ProductCatalog from '../components/ProductCatalog'; // <--- Importamos el nuevo cerebro

export const dynamic = 'force-dynamic';

export default async function Home() {

  // 1. CARGA INICIAL: Pedimos TODO a la base de datos una sola vez
  const { data: zapatillas, count } = await supabase
    .from('zapatillas')
    .select('*', { count: 'exact' })
    .order('id', { ascending: true })
    .limit(12); // Límite inicial para optimizar carga (Tip de Auditoría)

  // Si fallara la carga o estuviera vacío, evitamos errores pasando un array vacío
  const listaZapatillas = zapatillas || [];

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-20">

      {/* SECCIÓN HERO */}
      <div className="flex flex-col items-center justify-center pt-20 pb-10 bg-black border-b border-neutral-800 px-4">
        <h1 className="text-5xl md:text-8xl font-black text-yellow-400 tracking-tighter text-center uppercase">
          Drop <span className="text-white">Exclusivo</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400 text-center max-w-lg">
          Stock limitado. El que pestañea, pierde.
        </p>

        <DropCountdown />
      </div>

      {/* 2. AQUÍ INYECTAMOS EL CATALOGO INTERACTIVO */}
      {/* Le pasamos la lista y él se encarga de filtrar sin recargar la página */}
      <ProductCatalog zapatillas={listaZapatillas} totalItems={count || 0} />

      <TrustSection />

    </main>
  );
}