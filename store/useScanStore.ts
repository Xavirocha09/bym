import { create } from 'zustand';
import { ScanResult } from '@/types';

interface ScanStore {
  uploadedImages: string[];
  contextNote: string;
  currentResult: ScanResult | null;

  addImage: (uri: string) => void;
  removeImage: (index: number) => void;
  setContextNote: (note: string) => void;
  setCurrentResult: (result: ScanResult) => void;
  resetScan: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  uploadedImages: [],
  contextNote: '',
  currentResult: null,

  addImage: (uri) =>
    set((state) => ({ uploadedImages: [...state.uploadedImages, uri] })),

  removeImage: (index) =>
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((_, i) => i !== index),
    })),

  setContextNote: (note) => set({ contextNote: note }),

  setCurrentResult: (result) => set({ currentResult: result }),

  resetScan: () =>
    set({
      uploadedImages: [],
      contextNote: '',
      currentResult: null,
    }),
}));
