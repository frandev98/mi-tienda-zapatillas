'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../lib/store';
import { useToastStore } from '../lib/toastStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Zapatilla {
    id: number;
    nombre: string;
    precio: number;
    imagen_url: string;
    inventario: Record<string, number> | null;
}

export default function CartUpsell() {
    const [recommendations, setRecommendations] = useState<Zapatilla[]>([]);
    const [rawProducts, setRawProducts] = useState<Zapatilla[]>([]); // Estado intermedio para cachear fetch
    const [loading, setLoading] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Suscripción al Store (Reactivo)
    const { items, addItem } = useCartStore();
    const { showToast } = useToastStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Lógica Trigger Item
    const triggerItem = items[items.length - 1];
    const currentSize = triggerItem?.talla;
    // Memoizamos excludeIds para evitar re-renders innecesarios si el array es nuevo pero igual contenido (aunque items cambia, así que ok)
    const excludeIds = items.map(i => i.id);

    // 1. FETCH DATA (Solo cuando cambia la TALLA)
    useEffect(() => {
        const fetchRawData = async () => {
            if (!currentSize) return;

            setLoading(true);
            const { data } = await supabase
                .from('zapatillas')
                .select('id, nombre, precio, imagen_url, inventario')
                .limit(50);

            if (data) {
                // @ts-ignore
                setRawProducts(data);
            }
            setLoading(false);
        };

        fetchRawData();
    }, [currentSize]);

    // 2. FILTER DATA (Cuando cambia el CART o los DATOS CRUDOS)
    useEffect(() => {
        if (!currentSize || rawProducts.length === 0) return;

        // Normalizamos la talla
        const normalizedSize = currentSize.replace(/^EU\s?/, '');

        // Lógica Smart Stock:
        const filtered = rawProducts
            // @ts-ignore
            .filter((p: Zapatilla) => !excludeIds.includes(p.id))
            // @ts-ignore
            .filter((p: Zapatilla) => {
                if (!p.inventario) return false;
                // Buscamos por la key exacta (ej: "40")
                const stock = p.inventario[normalizedSize] || p.inventario[currentSize];
                return stock && stock > 0;
            })
            .slice(0, 20);

        setRecommendations(filtered);
    }, [rawProducts, items.length, currentSize]); // Se ejecuta al añadir/quitar items SIN refetch

    // SCROLL CHECK LOGIC
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // Breve margen de error (-5px) para asegurar que desaparezca al final
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            // Check initial state after render
            checkScroll();
            // Also check on resize
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            el?.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [recommendations]); // Re-check cuando cargan los items

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -180, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 180, behavior: 'smooth' });
        }
    };

    const handleQuickAdd = (product: Zapatilla) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(15);
        }
        showToast('¡AGREGADO! 🔥', `${product.nombre} (Talla ${currentSize})`);
        const stockAvailable = product.inventario ? product.inventario[currentSize!] : 0;
        addItem({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen_url: product.imagen_url,
            talla: currentSize!,
            cantidad: 1,
            maxStock: stockAvailable,
        });
    };

    if (!triggerItem || !currentSize || (loading && recommendations.length === 0)) return null;

    return (
        <div className="mt-8 pt-6 border-t border-neutral-800 relative">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                🔥 Completa tu Flow (Talla {currentSize})
            </h3>

            {/* Contenedor relativo para el scroll y el indicador */}
            <div className="relative group/carousel">

                {/* Carrusel Horizontal */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 snap-x pr-12 [&::-webkit-scrollbar]:hidden"
                >
                    <AnimatePresence mode="popLayout">
                        {recommendations.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                key={item.id}
                                className="snap-start min-w-[150px] w-40 flex flex-col bg-neutral-800/50 p-3 rounded-xl border border-neutral-800 hover:border-neutral-600 transition-colors group"
                            >
                                {/* Imagen */}
                                <div className="aspect-square w-full bg-neutral-900 rounded-lg overflow-hidden mb-3">
                                    <img
                                        src={item.imagen_url}
                                        alt={item.nombre}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex flex-col flex-1">
                                    <p className="text-white text-xs font-bold leading-tight line-clamp-2 min-h-[2.5em] mb-2" title={item.nombre}>
                                        {item.nombre}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <p className="text-yellow-400 text-sm font-mono font-bold">
                                            ${item.precio}
                                        </p>

                                        <button
                                            onClick={() => handleQuickAdd(item)}
                                            aria-label={`Agregar ${item.nombre}`}
                                            className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-yellow-400 hover:scale-110 transition-all shadow-lg"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* FLECHA IZQUIERDA (Scroll Left) */}
                {canScrollLeft && (
                    <div
                        onClick={scrollLeft}
                        className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-transparent cursor-pointer flex items-center justify-start pl-2 hover:via-black transition-all z-10"
                        role="button"
                        aria-label="Ver anteriores"
                    >
                        <div className="text-white bg-neutral-800/80 rounded-full p-2 backdrop-blur-sm border border-neutral-700 shadow-xl group-hover/carousel:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* FLECHA DERECHA (Scroll Right) */}
                {canScrollRight && (
                    <div
                        onClick={scrollRight}
                        className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-neutral-900 via-neutral-900/90 to-transparent cursor-pointer flex items-center justify-end pr-2 hover:via-black transition-all z-10"
                        role="button"
                        aria-label="Ver más productos"
                    >
                        <div className="text-white bg-neutral-800/80 rounded-full p-2 backdrop-blur-sm border border-neutral-700 shadow-xl group-hover/carousel:scale-110 transition-transform animate-pulse hover:animate-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
