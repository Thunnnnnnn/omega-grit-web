import { create } from "zustand";

interface MenuState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const useMenuStore = create<MenuState>()((set) => ({
  collapsed: true,
  setCollapsed: (collapsed: boolean) => set({ collapsed }),
}));

export default useMenuStore;
