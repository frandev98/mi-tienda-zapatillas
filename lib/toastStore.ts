import { create } from 'zustand';

interface ToastState {
    isVisible: boolean;
    message: string;
    subMessage?: string;
    showToast: (message: string, subMessage?: string) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    isVisible: false,
    message: '',
    subMessage: '',
    showToast: (message, subMessage) => {
        set({ isVisible: true, message, subMessage });
        setTimeout(() => {
            set({ isVisible: false });
        }, 2500); // Duración requerida: 2.5s
    },
    hideToast: () => set({ isVisible: false }),
}));
