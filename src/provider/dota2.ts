import axios from "axios";
import { translator } from "./dota-translations";
import isNumber from "is-number";
import { z } from "zod";
import { getAbilities } from "./abilities";

const baseURL =
  process.env.BASE_URL ||
  "https://raw.githubusercontent.com/dotabuff/d2vpkr/master";

const urls = {
  heroes: `${baseURL}/dota/scripts/npc/npc_heroes.json`,
  abilities: `${baseURL}/dota/scripts/npc/npc_abilities.json`,
  items: `${baseURL}/dota/scripts/npc/items.json`,
};

const fetch = async (url: keyof typeof urls) => {
  const response = await axios.get(urls[url]);
  return response.data;
};

const parseNumber = (value: string | undefined) => {
  if (value && isNumber(value)) {
    return parseInt(value);
  }
  return undefined;
};

const getHeroes = async () => {
  const response = await fetch("heroes");
  await translator.prewarm();
  const heroBaseRaw = response.DOTAHeroes.npc_dota_hero_base as Record<
    string,
    string
  >;
  const heroDataRaw = Object.keys(response.DOTAHeroes)
    .map<Record<string, string>>((key) => ({
      key,
      ...response.DOTAHeroes[key],
    }))
    .filter((hero) => hero.key !== "npc_dota_hero_base");

  const heroData = heroDataRaw.map((hero) => {
    const statsRaw = {
      armor: hero.ArmorPhysical ?? heroBaseRaw.ArmorPhysical,
      attackType: hero.AttackCapabilities,
      attackDamageMin: hero.AttackDamageMin,
      attackDamageMax: hero.AttackDamageMax,
      attackRange: hero.AttackRange,
      attackRate: hero.AttackRate,
      primaryAttribute: hero.AttributePrimary,
      baseStrength: hero.AttributeBaseStrength,
      baseAgility: hero.AttributeBaseAgility,
      baseIntelligence: hero.AttributeBaseIntelligence,
      strengthGain: hero.AttributeStrengthGain,
      agilityGain: hero.AttributeAgilityGain,
      intelligenceGain: hero.AttributeIntelligenceGain,
      healthRegen: hero.StatusHealthRegen ?? heroBaseRaw.StatusHealthRegen,
      manaRegen: hero.StatusManaRegen ?? heroBaseRaw.StatusManaRegen,
      baseHealth: hero.StatusHealth ?? heroBaseRaw.StatusHealth,
      baseMana: hero.StatusMana ?? heroBaseRaw.StatusMana,
      moveSpeed: hero.MovementSpeed ?? heroBaseRaw.MovementSpeed,
      turnRate: hero.MovementTurnRate ?? heroBaseRaw.MovementTurnRate,
      magicResistance: hero.MagicalResistance ?? heroBaseRaw.MagicalResistance,
    };
    const stats = Object.fromEntries(
      Object.entries(statsRaw).map(([key, value]) => {
        if (key === "attackType" || key === "primaryAttribute") {
          return [key, value];
        }
        return [key, parseNumber(value)];
      })
    );

    return {
      abilities: {
        ability1: hero.Ability1,
        ability2: hero.Ability2,
        ability3: hero.Ability3,
        ability4: hero.Ability4,
        ability5: hero.Ability5,
        ability6: hero.Ability6,
        ability7: hero.Ability7,
        ability8: hero.Ability8,
        ability9: hero.Ability9,
      },
      talents: {
        talent1: hero.Ability10,
        talent2: hero.Ability11,
        talent3: hero.Ability12,
        talent4: hero.Ability13,
        talent5: hero.Ability14,
        talent6: hero.Ability15,
        talent7: hero.Ability16,
        talent8: hero.Ability17,
      },
      enabled: hero.Enabled === "1",
      key: hero.key,
      name: translator.translate(hero.key),
      role: hero.Role,
      nameAlias: hero.NameAliases,
      heroOrderId: parseNumber(hero.HeroOrderID),
      heroId: parseNumber(hero.HeroID),
      stats,
    };
  });

  return heroData;
};

const numberOrNumberArray = z.array(z.number()).or(z.number()).optional();

const abilitySchema = z
  .object({
    ID: z.string(),
    AbilityType: z.string().optional(),
    AbilitySpecial: z
      .array(
        z.object({
          attribute_bonus_all: numberOrNumberArray,
          movement_speed: numberOrNumberArray,
          attack_speed: numberOrNumberArray,
          bonus_armor: numberOrNumberArray,
          value: numberOrNumberArray,
        })
      )
      .or(z.object({}))
      .optional(),
    AbilityBehavior: z.string().optional(),
    MaxLevel: z.string().optional(),
    AbilityUnitTargetTeam: z.string().optional(),
    AbilityCastAnimation: z.string().optional(),
    AbilityCastRange: z.string().optional(),
    AbilityUnitDamageType: z.string().optional(),
    AbilitySound: z.string().optional(),
    AbilityValues: z
      .record(
        z.string(),
        z.string().or(z.record(z.string(), z.string())).or(z.null())
      )
      .optional(),
    SpellImmunityType: z.string().optional(),
    AbilityCastPoint: z.string().optional(),
    AbilityManaCost: z.string().optional(),
    AbilityCooldown: z.string().optional(),
    AbilityCharges: z.string().optional(),
    AbilityChargeRestoreTime: z.string().optional(),
    HasScepterUpgrade: z.string().optional(),
    SpellDispellableType: z.string().optional(),
    FightRecapLevel: z.string().optional(),
    AbilityCastGestureSlot: z.string().optional(),
    HasShardUpgrade: z.string().optional(),
    AbilityUnitTargetType: z.string().optional(),
    AbilityDraftUltScepterAbility: z.string().optional(),
    AbilityModifierSupportValue: z.string().optional(),
    IsGrantedByScepter: z.string().optional(),
    AbilityDamage: z.string().optional(),
    AbilityUnitTargetFlags: z.string().optional(),
    AbilityDuration: z.string().optional(),
    AbilityChannelTime: z.string().optional(),
    AbilityModifierSupportBonus: z.string().optional(),
    IsGrantedByShard: z.string().optional(),
    AbilityDraftScepterAbility: z.string().optional(),
    AbilityDraftUltShardAbility: z.string().optional(),
    LinkedAbility: z.string().optional(),
    OnLearnbar: z.string().optional(),
    OnCastbar: z.string().optional(),
    AbilityDraftPreAbility: z.string().optional(),
    AbilityChannelAnimation: z.string().optional(),
    IsShardUpgrade: z.string().optional(),
    AbilityCastRangeBuffer: z.string().optional(),
    AbilityDraftShardAbility: z.string().optional(),
    LinkedShardAbility: z.string().optional(),
    RequiredLevel: z.string().optional(),
    LevelsBetweenUpgrades: z.string().optional(),
    HotKeyOverride: z.string().optional(),
    DisplayAdditionalHeroes: z.string().optional(),
    AbilityTextureName: z.string().optional(),
    AbilityUnitTargetFlag: z.string().optional(),
    IsCastableWhileHidden: z.string().optional(),
    precache: z.any().optional(),
    AnimationPlaybackRate: z.string().optional(),
    AbilityDraftUltScepterPreAbility: z.string().optional(),
    ad_linked_abilities: z.string().optional(),
    BaseClass: z.string().optional(),
    Modelscale: z.string().optional(),
    AbilitySharedCooldown: z.string().optional(),
    AnimationIgnoresModelScale: z.string().optional(),
    SpecialBonusIntrinsicModifier: z.string().optional(),
    AssociatedConsumable: z.string().optional(),
    UnlockMinEffectIndex: z.string().optional(),
    UnlockMaxEffectIndex: z.string().optional(),
    EventID: z.string().optional(),
    base_class: z.string().optional(),
  })
  .strict();

type RawAbility = z.infer<typeof abilitySchema> & { key: string };

export const getRawAbilities = async () => {
  const response = await fetch("abilities");
  const abilitiesRaw = response.DOTAAbilities;
  const abilityBase = abilitySchema.strip().parse(abilitiesRaw.ability_base);

  const abilitiesData = Object.entries(abilitiesRaw)
    .map(([key, value]) => {
      if (
        key === "ability_base" ||
        key === "Version" ||
        key === "dota_base_ability"
      )
        return;
      Object.entries(value as any).forEach(([key, v]) => {
        if (key === "AbilityValues" && Array.isArray(v)) {
          (value as any)[key] = undefined;
        }
      });
      const ability = abilitySchema.parse(value);
      Object.keys(ability).forEach((key) => {
        if (key.startsWith("Item")) {
          delete (ability as any)[key];
        }
      });
      return { key, ...abilityBase, ...ability };
    })
    .filter((x) => typeof x !== "undefined") as RawAbility[];
  return abilitiesData;
};

const main = async () => {
  const heroes = await getHeroes();
  const weaver = heroes.find((hero) => hero.key === "npc_dota_hero_weaver");
  const abilities = await getAbilities();
  console.log(weaver);
  if (weaver)
    Object.entries(weaver?.abilities).forEach(([key, value]) => {
      console.log(key, value);
      const ability = abilities.find((ability) => ability.key === value);
      console.log(ability);
    });
};
main();
