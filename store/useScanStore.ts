import { create } from 'zustand';
import { ScanType, ScanResult } from '@/types';

interface ScanStore {
  scanType: ScanType | null;
  uploadedImages: string[];
  contextAnswers: Record<string, boolean | null>;
  currentResult: ScanResult | null;

  setScanType: (type: ScanType) => void;
  addImage: (uri: string) => void;
  removeImage: (index: number) => void;
  setContextAnswer: (questionId: string, answer: boolean | null) => void;
  setCurrentResult: (result: ScanResult) => void;
  resetScan: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  scanType: null,
  uploadedImages: [],
  contextAnswers: {},
  currentResult: null,

  setScanType: (type) => set({ scanType: type }),

  addImage: (uri) =>
    set((state) => ({ uploadedImages: [...state.uploadedImages, uri] })),

  removeImage: (index) =>
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((_, i) => i !== index),
    })),

  setContextAnswer: (questionId, answer) =>
    set((state) => ({
      contextAnswers: { ...state.contextAnswers, [questionId]: answer },
    })),

  setCurrentResult: (result) => set({ currentResult: result }),

  resetScan: () =>
    set({
      scanType: null,
      uploadedImages: [],
      contextAnswers: {},
      currentResult: null,
    }),
}));
