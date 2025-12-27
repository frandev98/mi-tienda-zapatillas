'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: number;
  talla: string;
}

export default function WaitlistModal({ isOpen, onClose, productName, productId, talla }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Guardamos en Supabase
    const { error } = await supabase.from('lista_espera').insert({
      zapatilla_id: productId,
      nombre_producto: productName,
      talla: talla,
      email: email,
      telefono: phone || null, // Si está vacío, mandamos null
    });

    setIsLoading(false);

    if (error) {
      alert('Hubo un error al unirte. Inténtalo de nuevo.');
      console.error(error);
    } else {
      setSuccess(true);
      // Cerramos automáticamente después de 2 segundos
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setEmail('');
        setPhone('');
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl w-full max-w-md relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white">¡Listo!</h3>
            <p className="text-gray-400 mt-2">Te avisaremos apenas llegue la talla {talla}.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-1">¡No te quedes sin ellas!</h2>
            <p className="text-gray-400 text-sm mb-6">
              La talla <span className="text-yellow-400 font-bold">EU {talla}</span> de <span className="font-semibold">{productName}</span> está agotada. Déjanos tus datos y te avisaremos cuando vuelva.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase">Correo Electrónico (Obligatorio)</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="ejemplo@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase">Celular (Opcional)</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="Ejm: 987 654 321"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black font-bold py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'AVÍSAME CUANDO HAYA STOCK'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}