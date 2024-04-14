import { Build, BuildItem, BuildItemCategory } from "@prisma/client";
import { kebabCase } from "case-anything";
import { PropsWithChildren, createContext, useContext } from "react";
import { StoreApi, useStore, createStore } from "zustand";
import { devtools } from "zustand/middleware";
import type { Ability } from "../../server/routers/dota";
import { count } from "../../utils/count";
import { Behavior } from "../../provider/dota";

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
    heroKey: "",
    slug: "",
    shortDescription: "",
    description: "",
    trollLevel: 1,
    complexity: 1,
    talents: ["", ""],
    skills: [],
  },
  itemCategories: new Set(),
  errors: [],
};

export type AbilitySkillState = "YES" | "NO" | "DEFAULT" | "SHARD" | "SCEPTER";
export type EditorSkillable = Ability | "talents" | "stats";

export interface EditorStore extends BuildEditorState {
  setName: (name: string) => void;
  setSlug: (slug: string) => void;
  setHeroKey: (heroKey: string) => void;
  setVersion: (version: string) => void;
  getAbilitySkillState: (
    ability: EditorSkillable,
    index: number
  ) => AbilitySkillState;
  canBeSkilled: (ability: EditorSkillable, index: number) => boolean;
  skillAbility: (ability: EditorSkillable, index: number) => void;
  undoAbility: () => void;
  resetAbilities: () => void;
}

export const createBuildEditorStoreWithInitialState =
  (initialState: BuildEditorState) => () =>
    createStore<EditorStore>()(
      devtools((set, get) => ({
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
            return { ...state, build: { ...state.build, heroKey, skills: [] } };
          });
        },
        setVersion: (version: string) => {
          set((state) => {
            return { ...state, build: { ...state.build, version } };
          });
        },
        getAbilitySkillState: (
          ability: EditorSkillable,
          index: number
        ): AbilitySkillState => {
          const state = get();
          if (typeof ability == "string") {
            if (state.build.skills[index] === ability) {
              return "YES";
            } else {
              return "NO";
            }
          }
          if (ability.ability.stat.isGrantedByScepter) {
            return "SCEPTER";
          }
          if (ability.ability.stat.isGrantedByShard) {
            return "SHARD";
          }
          if (ability.ability.stat.behavior & Behavior.NOT_LEARNABLE) {
            return "DEFAULT";
          }
          if (state.build.skills[index] === ability.ability.name) {
            return "YES";
          }

          return "NO";
        },
        canBeSkilled: (ability: EditorSkillable, index: number) => {
          const state = get();
          if (ability === "talents" || ability === "stats") {
            const timesSkilled = count(state.build.skills, ability);
            // Stats can be skill from level 6 every 2 levels up to 7 times
            if (ability === "stats") {
              if (timesSkilled >= 7) return false;
              return Math.ceil((index - 6) / 2) >= timesSkilled;
            }
            if (ability === "talents") {
              if (timesSkilled >= 4) return false;
              return Math.floor((index + 1 - 10) / 5) >= timesSkilled;
            }
            // Talents can be skill from level 10 every 5 levels up to 4 times
            return true;
          }
          if (ability.ability.stat.behavior & Behavior.NOT_LEARNABLE) {
            return false;
          }
          if (
            ability.ability.stat.isGrantedByShard ||
            ability.ability.stat.isGrantedByScepter
          ) {
            return false;
          }
          const isUltimate = ability.ability.stat.isUltimate;
          const countOfAbility = count(
            state.build.skills,
            ability.ability.name
          );
          const maxLevel =
            ability.ability.stat.maxLevel || (isUltimate ? 3 : 4);
          if (index == 0 && !isUltimate) return true;
          if (countOfAbility >= maxLevel) {
            return false;
          }
          if (!isUltimate && Math.ceil((index + 1) / 2) <= countOfAbility) {
            return false;
          }
          // Ultimate can be skilled once every 6 levels
          if (isUltimate && countOfAbility >= Math.floor((index + 1) / 6)) {
            return false;
          }
          return true;
        },
        skillAbility: (ability: EditorSkillable, index: number) => {
          set((state) => {
            let skills = state.build.skills;
            const skillName =
              typeof ability == "string" ? ability : ability.ability.name;
            if (index >= state.build.skills.length) {
              skills = [...state.build.skills, skillName];
            } else {
              skills = skills.slice(0, index);
            }

            return { ...state, build: { ...state.build, skills } };
          });
        },
        undoAbility: () => {
          set((state) => {
            const skills = state.build.skills.slice(0, -1);
            return { ...state, build: { ...state.build, skills } };
          });
        },
        resetAbilities: () => {
          set((state) => {
            return { ...state, build: { ...state.build, skills: [] } };
          });
        },
      }))
    );

const StoreContext = createContext<StoreApi<EditorStore> | undefined>(
  undefined
);

export const BuildEditorProvider: React.FC<
  PropsWithChildren<{ store: StoreApi<EditorStore> }>
> = ({ store, children }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useBuildEditorStore = <U,>(
  selector: (state: EditorStore) => U
) => {
  const store = useContext(StoreContext)!;
  const slice = useStore(store, selector);
  return slice;
};
