import { z } from "zod";
import { procedure, router } from "../trpc";
import { heroes } from "../../provider/dota";
import { HeroType } from "../../__generated__/graphql";

const heroOverviewSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayName: z.string(),
  shortName: z.string(),
  aliases: z.array(z.string()),
  language: z.object({
    displayName: z.string(),
    lore: z.string(),
    hype: z.string(),
  }),
  stats: z.object({
    enabled: z.boolean(),
    primaryAttribute: z.string(),
    attackType: z.string(),
    complexity: z.number(),
  }),
  roles: z.array(
    z.object({
      roleId: z.string(),
      level: z.number(),
    })
  ),
});

export const dota = router({
  getHero: procedure
    .input(
      z
        .object({
          id: z.number(),
        })
        .or(
          z.object({
            name: z.string(),
          })
        )
    )
    .query(({ input }) => {
      if ("id" in input) {
        return heroes.find((hero) => hero?.id === input.id);
      } else {
        return heroes.find((hero) => hero?.name === input.name);
      }
    }),
  getHeroes: procedure.query(() => {
    return heroes
      .filter((hero): hero is HeroType => !!hero)
      .map((hero) => heroOverviewSchema.parse(hero));
  }),
});
