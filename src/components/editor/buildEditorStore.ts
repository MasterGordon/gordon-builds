import { Build, BuildItem, BuildItemCategory } from "@prisma/client";
import { kebabCase } from "case-anything";
import create, { StoreApi } from "zustand";
import { devtools } from "zustand/middleware";
import createContext from "zustand/context";

interface BuildItemCategoryState extends BuildItemCategory {
  items: BuildItem[];
}

interface EditorError {
  message: string;
  type: "error" | "warning";
  field: string;
}

export interface BuildEditorState {
  build: Omit<Build, "id">;
  itemCategories: Set<BuildItemCategoryState>;
  errors: EditorError[];
}

export const emptyBuildEditorState: BuildEditorState = {
  build: {
    name: "",
    version: "",
    heroKey: "npc_dota_hero_wisp",
    slug: "",
    shortDescription: "",
    description: "",
    trollLevel: 1,
    complexity: 1,
    talents: ["", ""],
    skills: ["X   X", " X", "  X", " ", " ", " "],
  },
  itemCategories: new Set(),
  errors: [],
};

export interface EditorStore extends BuildEditorState {
  setName: (name: string) => void;
  setSlug: (slug: string) => void;
  setHeroKey: (heroKey: string) => void;
  setVersion: (version: string) => void;
}

export const createBuildEditorStoreWithInitialState =
  (initialState: BuildEditorState) => () =>
    create<EditorStore>()(
      devtools((set) => ({
        ...initialState,
        setName: (name: string) => {
          const slug = kebabCase(name);
          set((state) => {
            return { ...state, build: { ...state.build, name, slug } };
          });
        },
        setSlug: (slug: string) => {
          set((state) => {
            return { ...state, build: { ...state.build, slug } };
          });
        },
        setHeroKey: (heroKey: string) => {
          set((state) => {
            return { ...state, build: { ...state.build, heroKey } };
          });
        },
        setVersion: (version: string) => {
          set((state) => {
            return { ...state, build: { ...state.build, version } };
          });
        },
      }))
    );

const { Provider, useStore } = createContext<StoreApi<EditorStore>>();

export { useStore as useBuildEditorStore, Provider as BuildEditorProvider };
