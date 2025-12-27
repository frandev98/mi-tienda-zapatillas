export default function TrustSection() {
  return (
    <section className="bg-neutral-900 py-16 border-b border-neutral-800">
      <div className="container mx-auto px-4">
        
        {/* Título y Subtítulo: Más claros y directos */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿POR QUÉ TAN <span className="text-yellow-400">BARATO?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            No hay trucos ni letras chicas. <br className="hidden md:block"/> 
            Simplemente eliminamos los gastos innecesarios para que pagues 
            <span className="text-white font-medium"> solo por la zapatilla, no por la tienda.</span>
          </p>
        </div>

        {/* Los 3 Pilares con lenguaje simplificado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pilar 1 */}
          <div className="bg-neutral-800/50 p-8 rounded-xl border border-neutral-700 hover:border-yellow-400 transition-colors">
            <div className="text-4xl mb-4">🚢</div>
            <h3 className="text-xl font-bold text-white mb-2">Directo a tus manos</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Las zapatillas viajan del puerto a tu casa. Sin pasar por revendedores ni distribuidores que inflan el precio.
              <span className="text-white font-medium block mt-2">
                Menos manos = Menor precio.
              </span>
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="bg-neutral-800/50 p-8 rounded-xl border border-neutral-700 hover:border-yellow-400 transition-colors">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-white mb-2">Sin Tiendas Lujosas</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              No pagamos alquileres caros en centros comerciales ni aire acondicionado. 
              <span className="text-white font-medium block mt-2">
                Todo ese ahorro te lo descontamos a ti.
              </span>
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="bg-neutral-800/50 p-8 rounded-xl border border-neutral-700 hover:border-yellow-400 transition-colors">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-white mb-2">Misma Calidad</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              El producto es 100% idéntico al de la tienda oficial. La caja es la misma. Lo único que cambia es el precio.
              <span className="text-white font-medium block mt-2">
                Compras inteligente, no caro.
              </span>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}