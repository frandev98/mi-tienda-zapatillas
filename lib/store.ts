import { create } from 'zustand';

// Definimos cómo se ve un producto en el carrito
interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string;
  talla: string;
  cantidad: number;
  maxStock: number; // Para validar en el carrito sin volver a consultar
}

interface CarritoState {
  items: ProductoCarrito[];
  isCartOpen: boolean;

  // Acciones
  addItem: (producto: ProductoCarrito) => void;
  removeItem: (id: number, talla: string) => void;
  incrementItem: (id: number, talla: string) => void;
  decrementItem: (id: number, talla: string) => void;
  toggleCart: () => void;
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

    // 2. Si existe, solo aumentamos la cantidad, validando maxStock
    if (existe) {
      const nuevaCantidad = existe.cantidad + 1;

      if (nuevaCantidad > nuevoProducto.maxStock) {
        return { items: state.items };
      }

      return {
        items: state.items.map((item) =>
          item.id === nuevoProducto.id && item.talla === nuevoProducto.talla
            ? { ...item, cantidad: nuevaCantidad, maxStock: nuevoProducto.maxStock }
            : item
        ),
      };
    }

    // 3. Si no existe, lo agregamos
    return {
      items: [...state.items, { ...nuevoProducto, cantidad: 1 }],
      // isCartOpen: true, // Desactivado por petición del usuario
    };
  }),

  removeItem: (id, talla) => set((state) => ({
    items: state.items.filter((item) => !(item.id === id && item.talla === talla)),
  })),

  incrementItem: (id, talla) => set((state) => ({
    items: state.items.map((item) => {
      if (item.id === id && item.talla === talla) {
        if (item.cantidad < item.maxStock) {
          return { ...item, cantidad: item.cantidad + 1 };
        }
      }
      return item;
    }),
  })),

  decrementItem: (id, talla) => set((state) => ({
    items: state.items.map((item) => {
      if (item.id === id && item.talla === talla) {
        if (item.cantidad > 1) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
      }
      return item;
    }),
  })),

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  clearCart: () => set({ items: [] }),
}));