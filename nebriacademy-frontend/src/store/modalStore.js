import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  title: "",
  message: "",
  resolve: null,
  
  showConfirm: (message, title = "Confirmación") => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        title,
        message,
        resolve,
      });
    });
  },

  confirm: () => {
    const { resolve } = useModalStore.getState();
    if (resolve) resolve(true);
    set({ isOpen: false, resolve: null });
  },

  cancel: () => {
    const { resolve } = useModalStore.getState();
    if (resolve) resolve(false);
    set({ isOpen: false, resolve: null });
  },
}));

export default useModalStore;
