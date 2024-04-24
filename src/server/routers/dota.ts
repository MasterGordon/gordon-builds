import { z } from "zod";
import { procedure, router } from "../trpc";
import { gameVersions, heroes, talents } from "../../provider/dota";
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

const heroOverviewSlimSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayName: z.string(),
  shortName: z.string(),
  aliases: z.array(z.string()),
  stats: z.object({
    enabled: z.boolean(),
  }),
});

const abilitySchema = z.object({
  slot: z.number(),
  gameVersionId: z.number(),
  abilityId: z.number(),
  ability: z.object({
    id: z.number(),
    name: z.string(),
    uri: z.string().nullable(),
    language: z.object({
      displayName: z.string(),
      description: z.array(z.string()),
      attributes: z.array(z.string()),
      aghanimDescription: z.string().nullable(),
      shardDescription: z.string().nullable(),
      lore: z.string().nullable(),
      notes: z.array(z.string()),
    }),
    stat: z.object({
      abilityId: z.number(),
      type: z.number(),
      behavior: z.number(),
      unitTargetType: z.number(),
      unitTargetTeam: z.number(),
      unitTargetFlags: z.number(),
      unitDamageType: z.number(),
      spellImmunity: z.number(),
      modifierSupportValue: z.number(),
      modifierSupportBonus: z.number(),
      isOnCastbar: z.boolean(),
      isOnLearnbar: z.boolean(),
      fightRecapLevel: z.number(),
      isGrantedByScepter: z.boolean(),
      hasScepterUpgrade: z.boolean(),
      maxLevel: z.number().nullable(),
      levelsBetweenUpgrades: z.number(),
      requiredLevel: z.number(),
      hotKeyOverride: z.string().nullable(),
      displayAdditionalHeroes: z.boolean(),
      castRange: z.array(z.number()).nullable(),
      channelTime: z.array(z.number()).nullable(),
      cooldown: z.array(z.number()).nullable(),
      damage: z.array(z.number()).nullable(),
      manaCost: z.array(z.number()).nullable(),
      isUltimate: z.boolean(),
      duration: z.string(),
      charges: z.string(),
      chargeRestoreTime: z.string(),
      hasShardUpgrade: z.boolean(),
      isGrantedByShard: z.boolean(),
      dispellable: z.enum(["YES", "NO", "NONE"]),
    }),
    attributes: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
          linkedSpecialBonusAbilityId: z.number().nullable(),
          requiresScepter: z.boolean(),
        })
      )
      .nullable(),
    isTalent: z.boolean(),
  }),
});

export type Ability = z.infer<typeof abilitySchema>;

const heroSchema = heroOverviewSchema.merge(
  z.object({
    abilities: z.array(abilitySchema),
    talents: z.array(
      z.object({
        abilityId: z.number(),
        slot: z.number(),
      })
    ),
  })
);

const gameVersionsSchema = z.array(
  z.object({
    name: z.string(),
    asOfDateTime: z.number(),
    id: z.number(),
  })
);

const talentSchema = z.object({
  id: z.number(),
  language: z.object({
    displayName: z.string(),
    description: z.array(z.string()),
  }),
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
      const heroRaw =
        "id" in input
          ? heroes.find((hero) => hero?.id === input.id)
          : heroes.find((hero) => hero?.name === input.name);
      return heroSchema.parse(heroRaw);
    }),
  getHeroes: procedure
    .input(
      z
        .object({
          slim: z.boolean().optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      if (input?.slim) {
        return heroes
          .filter((hero): hero is HeroType => !!hero)
          .map((hero) => heroOverviewSlimSchema.strip().parse(hero));
      }
      return heroes
        .filter((hero): hero is HeroType => !!hero)
        .map((hero) => heroOverviewSchema.strip().parse(hero));
    }),
  getVersions: procedure.query(() => {
    return gameVersionsSchema.parse(gameVersions);
  }),
  getTalents: procedure
    .input(
      z.object({
        ids: z.array(z.number()),
      })
    )
    .query(({ input }) => {
      return talents
        .map((talent) => {
          return talentSchema.parse(talent);
        })
        .filter((talent) => input.ids.includes(talent.id));
    }),
});
