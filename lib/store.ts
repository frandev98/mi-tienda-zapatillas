import { create } from 'zustand';

// Definimos cómo se ve un producto en el carrito
interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string;
  talla: string; // ¡Importante! La talla que eligió el cliente
  cantidad: number;
}

interface CarritoState {
  items: ProductoCarrito[];
  isCartOpen: boolean; // Para abrir/cerrar la ventanita del carrito
  
  // Acciones (Funciones para modificar el carrito)
  addItem: (producto: ProductoCarrito) => void;
  removeItem: (id: number, talla: string) => void;
  toggleCart: () => void; // Abrir o cerrar
  clearCart: () => void;
}

export const useCartStore = create<CarritoState>((set) => ({
  items: [],
  isCartOpen: false,

  addItem: (nuevoProducto) => set((state) => {
    // 1. Buscamos si ya existe ese producto con ESA talla exacta
    const existe = state.items.find(
      (item) => item.id === nuevoProducto.id && item.talla === nuevoProducto.talla
    );

    // 2. Si existe, solo aumentamos la cantidad (No agregamos otro renglón)
    if (existe) {
      return {
        items: state.items.map((item) =>
          item.id === nuevoProducto.id && item.talla === nuevoProducto.talla
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ),
        // isCartOpen: true, // Abrimos el carrito automáticamente al comprar
      };
    }

    // 3. Si no existe, lo agregamos al array
    return {
      items: [...state.items, { ...nuevoProducto, cantidad: 1 }],
    //   isCartOpen: true,
    };
  }),

  removeItem: (id, talla) => set((state) => ({
    // Filtramos para quitar el que coincida en ID y Talla
    items: state.items.filter((item) => !(item.id === id && item.talla === talla)),
  })),

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  clearCart: () => set({ items: [] }),
}));