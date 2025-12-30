'use client';

import { useToastStore } from '../lib/toastStore';
import { useEffect, useState } from 'react';

export default function Toast() {
    const { isVisible, message, subMessage, hideToast } = useToastStore();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300); // Esperar animación de salida
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!shouldRender) return null;

    return (
        <div
            className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50 
        flex flex-row items-center gap-3 px-6 py-3 min-w-[320px]
        bg-black border-l-4 border-yellow-400 shadow-2xl rounded-lg
        transition-all duration-300 ease-out transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}
            role="alert"
        >
            {/* Icono de Check Simbólico */}
            <div className="text-yellow-400 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
            </div>

            <div className="flex flex-row items-center gap-2">
                <span className="text-white font-bold text-sm">
                    {message}
                </span>
                {subMessage && (
                    <span className="text-gray-300 font-normal text-sm">
                        {subMessage}
                    </span>
                )}
            </div>
        </div>
    );
}
