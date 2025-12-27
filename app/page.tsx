export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <h1 className="text-6xl font-bold text-yellow-400">
        ZAPATILLAS EXCLUSIVAS
      </h1>
      <p className="mt-4 text-xl">
        Próximamente: Las mejores marcas a precio de remate.
      </p>
      <button className="mt-8 px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition">
        Ver Catálogo
      </button>
    </main>
  );
}