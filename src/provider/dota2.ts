import { translator } from "./dota-translations";
import isNumber from "is-number";
import { dotaFetch } from "./dota-fetch";

const parseNumber = (value: string | undefined) => {
  if (value && isNumber(value)) {
    return parseInt(value);
  }
  return undefined;
};

export const getHeroes = async () => {
  const response = await dotaFetch("heroes");
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
      name: translator.translate(hero.key + ":n"),
      role: hero.Role,
      nameAlias: hero.NameAliases,
      heroOrderId: parseNumber(hero.HeroOrderID),
      heroId: parseNumber(hero.HeroID),
      stats,
    };
  });

  return heroData;
};

// const main = async () => {
//   const heroes = await getHeroes();
//   const weaver = heroes.find((hero) => hero.key === "npc_dota_hero_weaver");
//   const abilities = await getAbilities();
//   // console.log(weaver);
//   // if (weaver)
//   //   Object.entries(weaver?.abilities).forEach(([key, value]) => {
//   //     console.log(key, value);
//   //     const ability = abilities.find((ability) => ability.key === value);
//   //     console.log(ability);
//   //   });
//   const items = await getItems();
//   console.log(items.find((item) => item.key === "item_desolator"));
// };
// main();
