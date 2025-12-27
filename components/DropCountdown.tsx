'use client';

import { useState, useEffect } from 'react';

export default function DropCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // FUNCIÓN MAESTRA: Calcula cuándo es el próximo DROP 📅
    // Aquí configuramos: Próximo DOMINGO a las 20:00 (8 PM)
    const getNextDropDate = () => {
      const now = new Date();
      const nextDrop = new Date();

      // 0 = Domingo, 1 = Lunes, ... 4 = Jueves, etc.
      // Si quieres que sea los Jueves, cambia el 0 por 4.
      const dayOfWeek = 0; 

      // Ajustamos al próximo día deseado
      nextDrop.setDate(now.getDate() + (dayOfWeek + 7 - now.getDay()) % 7);
      
      // Ajustamos la hora (20:00:00)
      nextDrop.setHours(20, 0, 0, 0);

      // Si hoy ya es Domingo y pasaron las 8 PM, calculamos para el de la próxima semana
      if (nextDrop <= now) {
        nextDrop.setDate(nextDrop.getDate() + 7);
      }

      return nextDrop;
    };

    const targetDate = getNextDropDate();

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        // Si llegó la hora, podríamos mostrar "¡YA DISPONIBLE!"
        // Por ahora lo dejamos en 0 para que reinicie en el siguiente ciclo
        return; 
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-neutral-900 border-y border-neutral-800 py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        
        {/* Texto de Hype */}
        <div className="text-center md:text-right">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
            Próxima Carga de Stock
          </p>
          <h3 className="text-white text-xl md:text-2xl font-black italic">
            NO TE QUEDES FUERA <span className="text-yellow-400">⚡</span>
          </h3>
        </div>

        {/* El Reloj */}
        <div className="flex gap-4">
          <TimeBox value={timeLeft.days} label="DÍAS" />
          <TimeBox value={timeLeft.hours} label="HRS" />
          <TimeBox value={timeLeft.minutes} label="MIN" />
          <TimeBox value={timeLeft.seconds} label="SEG" isYellow />
        </div>

      </div>
    </div>
  );
}

// Componente auxiliar para los cuadraditos de tiempo
function TimeBox({ value, label, isYellow = false }: { value: number, label: string, isYellow?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`
        w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg border 
        font-mono text-2xl md:text-3xl font-bold shadow-lg backdrop-blur-sm
        ${isYellow 
          ? 'bg-yellow-400 text-black border-yellow-400' 
          : 'bg-neutral-800 text-white border-neutral-700'
        }
      `}>
        {value < 10 ? `0${value}` : value}
      </div>
      <span className="text-[10px] font-bold text-gray-500 mt-2 tracking-wider">
        {label}
      </span>
    </div>
  );
}