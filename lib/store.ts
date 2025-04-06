import { create } from 'zustand';

interface NavbarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useNavbarStore = create<NavbarState>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set(() => ({ isOpen })),
})); 