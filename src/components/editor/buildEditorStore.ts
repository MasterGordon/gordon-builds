import { Build, BuildItem, BuildItemCategory } from "@prisma/client";
import { kebabCase } from "case-anything";
import create, { StoreApi } from "zustand";
import createContext from "zustand/context";
import { createConfig } from "../../pages/_app";
import { trpc } from "../../utils/trpc";

interface BuildItemCategoryState extends BuildItemCategory {
  items: BuildItem[];
}

interface EditorError {
  message: string;
  type: "error" | "warning";
  field: string;
}

export interface BuildEditorState {
  build: Build;
  itemCategories: Set<BuildItemCategoryState>;
  errors: EditorError[];
}

const trpcClient = trpc.createClient(createConfig());

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
    skills: ["", "", "", "", "", ""],
  },
  itemCategories: new Set(),
  errors: [],
};

export interface EditorStore extends BuildEditorState {
  setName: (name: string) => void;
  setSlug: (slug: string) => void;
  setHeroKey: (heroKey: string) => void;
}

export const createBuildEditorStoreWithInitialState =
  (initialState: BuildEditorState) => () =>
    create<EditorStore>((set) => ({
      ...initialState,
      loadBuild: async (slug: string) => {
        const { items, ...build } = await trpcClient.query(
          "build.getPlainBuild",
          {
            slug,
          }
        );
        set((state) => ({ ...state, build, itemCategories: new Set(items) }));
      },
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
    }));

const { Provider, useStore } = createContext<StoreApi<EditorStore>>();

export { useStore as useBuildEditorStore, Provider as BuildEditorProvider };
