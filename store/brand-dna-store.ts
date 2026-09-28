import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";

/** Only the provider and options persist. Images and results stay in memory. */
type BrandDnaState = {
  providerId: string;
  ignoreBackground: boolean;
  setProvider: (providerId: string) => void;
  setIgnoreBackground: (ignoreBackground: boolean) => void;
};

export const useBrandDnaStore = create<BrandDnaState>()(
  persist(
    (set) => ({
      providerId: "local",
      ignoreBackground: true,
      setProvider: (providerId) => set({ providerId }),
      setIgnoreBackground: (ignoreBackground) => set({ ignoreBackground }),
    }),
    { name: "designhub:brand-dna", version: 1, storage: createJSONStorage(() => indexedDbStorage) },
  ),
);
