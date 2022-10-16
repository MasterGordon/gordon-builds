import { z } from "zod";
import { getHeroes } from "../../provider/dota2";
import { createRouter } from "../createRouter";

export const dota2Router = createRouter().query("hero", {
  input: z.object({
    hero: z.string(),
  }),
  async resolve() {
    const key = "npc_dota_hero_weaver";
    const heroes = await getHeroes();
    const hero = heroes.find((hero) => hero.key === key);
    return hero;
  },
});
