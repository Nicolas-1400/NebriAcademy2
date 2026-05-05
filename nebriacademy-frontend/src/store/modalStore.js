import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  title: "",
  message: "",
  withInput: false,
  inputValue: "",
  resolve: null,
  
  showConfirm: (message, title = "Confirmación", options = {}) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        title,
        message,
        withInput: options.withInput || false,
        inputValue: "",
        resolve,
      });
    });
  },

  setInputValue: (val) => set({ inputValue: val }),

  confirm: () => {
    const { resolve, inputValue } = useModalStore.getState();
    if (resolve) resolve(inputValue || true);
    set({ isOpen: false, resolve: null, withInput: false, inputValue: "" });
  },

  cancel: () => {
    const { resolve } = useModalStore.getState();
    if (resolve) resolve(false);
    set({ isOpen: false, resolve: null, withInput: false, inputValue: "" });
  },
}));

export default useModalStore;

