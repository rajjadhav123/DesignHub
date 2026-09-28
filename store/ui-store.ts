import { create } from "zustand";

type UiState = {
  commandOpen: boolean;
  commandQuery: string;
  shortcutsOpen: boolean;
  /** Set by the command palette; Brand Projects opens its "New project" dialog and clears it. */
  newProjectRequested: boolean;
  openCommand: (query?: string) => void;
  setCommandOpen: (open: boolean) => void;
  setCommandQuery: (query: string) => void;
  setShortcutsOpen: (open: boolean) => void;
  requestNewProject: () => void;
  clearNewProjectRequest: () => void;
};

export const useUiStore = create<UiState>()((set) => ({
  commandOpen: false,
  commandQuery: "",
  shortcutsOpen: false,
  newProjectRequested: false,
  openCommand: (query = "") => set({ commandOpen: true, commandQuery: query }),
  setCommandOpen: (open) => set(open ? { commandOpen: true } : { commandOpen: false, commandQuery: "" }),
  setCommandQuery: (query) => set({ commandQuery: query }),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),
  requestNewProject: () => set({ newProjectRequested: true }),
  clearNewProjectRequest: () => set({ newProjectRequested: false }),
}));
