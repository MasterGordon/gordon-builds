/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";
import { formatArray } from "../utils/formatArray";
import { Ability } from "./AbilityData";
import { Hero } from "./HeroData";
import { Item } from "./ItemData";

const baseURL =
  process.env.BASE_URL ||
  "https://raw.githubusercontent.com/dotabuff/d2vpkr/master";

type DataType = "heroes" | "items" | "abilities";

const cache: Partial<Record<DataType, any>> = {};
const cacheTime: Partial<Record<DataType, number>> = {};

type Sources = Record<
  DataType,
  {
    dataURL: string;
    i18nURL1?: string;
    i18nURL2?: string;
    serializer: (data: any, i18n: any) => any;
  }
>;
const sources: Sources = {
  abilities: {
    dataURL: `${baseURL}/dota/scripts/npc/npc_abilities.json`,
    i18nURL1: `${baseURL}/dota/resource/localization/abilities_english.json`,
    serializer: (data: any, i18n: any) => new AbilitiesSerializer(data, i18n),
  },
  heroes: {
    dataURL: `${baseURL}/dota/scripts/npc/npc_heroes.json`,
    serializer: (data: any) => new HeroesSerializer(data),
  },
  items: {
    dataURL: `${baseURL}/dota/scripts/npc/items.json`,
    i18nURL1: `${baseURL}/dota/resource/localization/dota_english.json`,
    i18nURL2: `${baseURL}/dota/resource/localization/abilities_english.json`,
    serializer: (data: any, i18n: any) => new ItemsSerializer(data, i18n),
  },
};

type GetDataReturn = {
  abilities: Ability[];
  items: Item[];
  heroes: Hero[];
};

export async function getData<T extends "abilities" | "items" | "heroes">(
  type: T
): Promise<GetDataReturn[T]> {
  // Return if cache is not older than 30 minutes
  if (
    cache[type] &&
    cacheTime[type] > Date.now() - 30 * 60 * 1000 &&
    process.env.NODE_ENV != "production"
  ) {
    return cache[type];
  }
  const source = sources[type];
  const promises = [source.dataURL, source.i18nURL1, source.i18nURL2]
    .filter((u) => typeof u === "string")
    .map((url) => axios.get(url as string));
  const responses = await Promise.all(promises);
  const data = responses[0].data;
  const i18n = responses[1] && responses[1].data;
  if (responses[2]) {
    Object.assign(i18n.lang.Tokens, responses[2].data.lang.Tokens);
  }
  const body = source.serializer(data, i18n).serialize();
  cache[type] = body;
  cacheTime[type] = Date.now();
  return body;
}

const fixStringsCase = (obj: Record<string, string>) => {
  const strings = Object.assign({}, obj);

  Object.keys(obj).forEach((key) => {
    if (key.includes("DOTA_Tooltip_Ability_")) {
      strings[key.replace("DOTA_Tooltip_Ability_", "DOTA_Tooltip_ability_")] =
        obj[key];
    }
  });

  return strings;
};

const stripExtraWhitespace = (str: string) => {
  return str && str.replace(/\s{2,}/g, " ").trim();
};

const stripHTMLTags = (str: string) => {
  return str.replace(/<[^>]*>/g, "");
};

const toObject = (obj: unknown[]) => {
  return !Array.isArray(obj) ? Object.values(obj) : obj;
};

const toNumericSet = (str: string) => {
  return str
    .split(" ")
    .map(Number)
    .filter((v, i, arr) => arr.indexOf(v) === i);
};

const formatDescription = (description: string) => {
  return description
    .split(/(?:\\n|<br>)/)
    .map(stripHTMLTags)
    .map(stripExtraWhitespace);
};

const replaceAttributes = (description: string, attributes: any[]) => {
  if (!attributes) return description;

  return description.replace(/%([^% ]*)%/g, (_, name) => {
    if (name === "") {
      return "%";
    }

    const attr = attributes.find((a) => name in a);

    if (attr) {
      return formatArray(attr[name]);
    } else {
      return name;
    }
  });
};

const formatCustomAttributes = (
  attributes: any[],
  strings: Record<string, string>,
  ability_key: string
) => {
  return attributes
    .map((attr) => {
      const key = Object.keys(attr).find(
        (key) => `DOTA_Tooltip_ability_${ability_key}_${key}` in strings
      );

      if (!key) {
        return;
      }

      let header = strings[`DOTA_Tooltip_ability_${ability_key}_${key}`];
      let prefix, suffix;

      if (header.startsWith("%")) {
        header = header.substring(1);
        suffix = "%";
      }

      if (header.startsWith("+$")) {
        header = strings[`dota_ability_variable_${header.substring(2)}`];
        prefix = "+";
      }

      return {
        key: key,
        value: attr[key],
        scepter: key.endsWith("_scepter"),
        header: stripHTMLTags(header).replace(/\\n/g, ""),
        prefix: prefix,
        suffix: suffix,
      };
    })
    .filter((attr) => attr);
};

class AbilitiesSerializer {
  private data: any;
  private strings: any;

  constructor(data: any, i18n: any) {
    this.data = data;
    this.strings = fixStringsCase(i18n.lang.Tokens);
  }

  serialize() {
    return this.keys
      .map((key) => {
        const raw = this.abilities[key];
        const ability: any = {
          id: Number(raw.ID),
          key: key,
          name: stripExtraWhitespace(this.getString(key)),
          type: this.abilityTypes[raw.AbilityType],
        };

        if (ability.type === "talent") {
          if (!raw.AbilitySpecial || raw.AbilitySpecial.length === 0) {
            return ability;
          }
          return {
            ...ability,
            name: ability.name?.replace(
              "{s:value}",
              raw.AbilitySpecial[0].value
            ),
          };
        }

        const description = this.getString(key, "Description");
        const attributes = raw.AbilitySpecial && toObject(raw.AbilitySpecial);

        ability.description =
          description && this.getDescription(description, attributes);
        ability.notes = this.getNotes(key, attributes);
        ability.lore = this.getString(key, "Lore");
        // @ts-ignore
        ability.team_target = this.teamTargets[raw.AbilityUnitTargetTeam];
        ability.unit_targets =
          raw.AbilityUnitTargetType &&
          this.getUnitTargets(raw.AbilityUnitTargetType);
        // @ts-ignore
        ability.damage_type = this.damageTypes[raw.AbilityUnitDamageType];
        ability.kind = this.getType(raw.AbilityBehavior);
        ability.spell_dispellable_type =
          // @ts-ignore
          this.spellDispellableTypes[raw.SpellDispellableType];
        ability.pierces_spell_immunity =
          // @ts-ignore
          this.spellImmunityTypes[raw.SpellImmunityType];
        ability.cast_range =
          raw.AbilityCastRange && toNumericSet(raw.AbilityCastRange);
        ability.cast_point =
          raw.AbilityCastPoint && toNumericSet(raw.AbilityCastPoint);
        ability.channel_time =
          raw.AbilityChannelTime && toNumericSet(raw.AbilityChannelTime);
        ability.duration =
          raw.AbilityDuration && toNumericSet(raw.AbilityDuration);
        ability.damage = raw.AbilityDamage && toNumericSet(raw.AbilityDamage);
        ability.cooldown =
          raw.AbilityCooldown && toNumericSet(raw.AbilityCooldown);
        ability.mana_cost =
          raw.AbilityManaCost && toNumericSet(raw.AbilityManaCost);
        ability.has_scepter_upgrade = raw.HasScepterUpgrade === "1";
        ability.is_granted_by_scepter = raw.IsGrantedByScepter === "1";
        ability.custom_attributes =
          attributes && formatCustomAttributes(attributes, this.strings, key);

        return ability;
      })
      .sort((a, b) => a.id - b.id);
  }

  get keys() {
    return Object.keys(this.abilities).filter(
      (id) => !this.ignoredKeys.includes(id)
    );
  }

  get abilities() {
    return this.data.DOTAAbilities;
  }

  get ignoredKeys() {
    return [
      "Version",
      "ability_base",
      "ability_deward",
      "attribute_bonus",
      "default_attack",
      "dota_base_ability",
    ];
  }

  getString(key: string, suffix = "") {
    return this.strings[`DOTA_Tooltip_ability_${key}${suffix && `_${suffix}`}`];
  }

  getDescription(description: string, attributes: any[]) {
    return formatDescription(replaceAttributes(description, attributes));
  }

  getType(type: string) {
    if (!type) return undefined;
    if (type.includes("DOTA_ABILITY_BEHAVIOR_CHANNELLED")) return "Channeled";
    if (type.includes("DOTA_ABILITY_BEHAVIOR_AUTOCAST")) return "Auto-Cast";
    if (type.includes("DOTA_ABILITY_BEHAVIOR_TOGGLE")) return "Toggle";
    if (type.includes("DOTA_ABILITY_BEHAVIOR_PASSIVE")) return "Passive";
    if (type.includes("DOTA_ABILITY_BEHAVIOR_UNIT_TARGET"))
      return "Unit Target";
    if (type.includes("DOTA_ABILITY_BEHAVIOR_NO_TARGET")) return "No Target";
    if (type.includes("DOTA_ABILITY_BEHAVIOR_POINT")) return "Point Target";
  }

  getNotes(key: string, attributes: any) {
    const notes = [];

    for (let i = 0; this.getString(key, `Note${i}`); i++) {
      notes.push(
        replaceAttributes(this.getString(key, `Note${i}`), attributes)
      );
    }

    return notes;
  }

  getUnitTargets(targets: string) {
    return (
      targets
        .split(" | ")
        // @ts-ignore
        .map((t) => this.unitTargets[t])
        .filter((t) => t)
    );
  }

  get abilityTypes(): Record<string, string> {
    return new Proxy(
      {
        DOTA_ABILITY_TYPE_ATTRIBUTES: "talent",
        DOTA_ABILITY_TYPE_ULTIMATE: "ultimate",
      },
      {
        get: (dict, k) => dict[k as keyof typeof dict] || "basic",
      }
    );
  }

  get teamTargets() {
    return {
      DOTA_UNIT_TARGET_TEAM_BOTH: "both",
      DOTA_UNIT_TARGET_TEAM_ENEMY: "enemy",
      DOTA_UNIT_TARGET_TEAM_FRIENDLY: "ally",
      "DOTA_UNIT_TARGET_TEAM_ENEMY | DOTA_UNIT_TARGET_TEAM_FRIENDLY": "both",
      "DOTA_UNIT_TARGET_TEAM_FRIENDLY | DOTA_UNIT_TARGET_TEAM_ENEMY": "both",
    };
  }

  get unitTargets() {
    return {
      DOTA_UNIT_TARGET_BASIC: "creep",
      DOTA_UNIT_TARGET_BUILDING: "building",
      DOTA_UNIT_TARGET_CREEP: "creep",
      DOTA_UNIT_TARGET_HERO: "hero",
    };
  }

  get damageTypes() {
    return {
      DAMAGE_TYPE_MAGICAL: "magical",
      DAMAGE_TYPE_PHYSICAL: "physical",
      DAMAGE_TYPE_PURE: "pure",
    };
  }

  get spellDispellableTypes() {
    return {
      SPELL_DISPELLABLE_NO: "Cannot be dispelled",
      SPELL_DISPELLABLE_YES: "Yes",
      SPELL_DISPELLABLE_YES_STRONG: "Strong Dispels Only",
    };
  }

  get spellImmunityTypes() {
    return {
      SPELL_IMMUNITY_ALLIES_NO: false,
      SPELL_IMMUNITY_ALLIES_YES: true,
      SPELL_IMMUNITY_ENEMIES_YES: true,
      SPELL_IMMUNITY_ENEMIES_NO: false,
    };
  }
}

class HeroesSerializer {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  serialize() {
    return this.keys
      .map((key) => {
        const raw = Object.assign({}, this.baseHero, this.heroes[key]);

        return {
          id: Number(raw.HeroID),
          key: key,
          name: raw.workshop_guide_name,
          roles: (raw.Role as string).split(",").map((r) => r.toLowerCase()),
          complexity: Number(raw.Complexity),
          // @ts-ignore
          primary_attribute: this.primaryAttributes[raw.AttributePrimary],
          base_str: Number(raw.AttributeBaseStrength),
          base_agi: Number(raw.AttributeBaseAgility),
          base_int: Number(raw.AttributeBaseIntelligence),
          str_gain: Number(raw.AttributeStrengthGain),
          agi_gain: Number(raw.AttributeAgilityGain),
          int_gain: Number(raw.AttributeIntelligenceGain),
          base_health: Number(raw.StatusHealth),
          base_mana: Number(raw.StatusMana),
          base_health_regen: Number(raw.StatusHealthRegen),
          base_mana_regen: Number(raw.StatusManaRegen),
          // @ts-ignore
          attack_type: this.attackTypes[raw.AttackCapabilities],
          attack_range: Number(raw.AttackRange),
          attack_rate: Number(raw.AttackRate),
          base_attack_min: Number(raw.AttackDamageMin),
          base_attack_max: Number(raw.AttackDamageMax),
          base_armor: Number(raw.ArmorPhysical),
          base_magical_resistance: Number(raw.MagicalResistance),
          movement_speed: Number(raw.MovementSpeed),
          movement_turn_rate: Number(raw.MovementTurnRate),
          abilities: this.getAbilities(raw),
          talents: this.getTalents(raw),
        };
      })
      .sort((a, b) => a.id - b.id);
  }

  get keys() {
    return Object.keys(this.heroes).filter(
      (key) => !this.ignoredKeys.includes(key)
    );
  }

  get heroes() {
    return this.data.DOTAHeroes;
  }

  get ignoredKeys() {
    return ["Version", "npc_dota_hero_base", "npc_dota_hero_target_dummy"];
  }

  get baseHero() {
    return this.heroes.npc_dota_hero_base;
  }

  get primaryAttributes() {
    return {
      DOTA_ATTRIBUTE_STRENGTH: "str",
      DOTA_ATTRIBUTE_AGILITY: "agi",
      DOTA_ATTRIBUTE_INTELLECT: "int",
    };
  }

  get attackTypes() {
    return {
      DOTA_UNIT_CAP_MELEE_ATTACK: "melee",
      DOTA_UNIT_CAP_RANGED_ATTACK: "ranged",
    };
  }

  getAbilities(raw: any) {
    return Object.keys(raw)
      .filter((k) => k.match(/Ability([1-9]$)/))
      .map((k) => raw[k])
      .filter((a) => a);
  }

  getTalents(raw: any) {
    return Object.keys(raw)
      .filter((k) => k.match(/Ability([1-9]\d+$)/))
      .map((k) => raw[k])
      .filter((a) => a);
  }
}

class ItemsSerializer {
  private data: any;
  private strings: any;

  constructor(data: any, i18n: any) {
    this.data = data;
    this.strings = fixStringsCase(i18n.lang.Tokens);
  }

  serialize() {
    const items = this.keys
      .map((key) => {
        const raw = this.items[key];

        const description = this.getString(key, "Description");
        const attributes = raw.AbilitySpecial && toObject(raw.AbilitySpecial);

        return {
          id: Number(raw.ID),
          key: key,
          name: stripExtraWhitespace(this.getName(key, raw.ItemBaseLevel)),
          description:
            description && this.getDescription(description, attributes),
          notes: this.getNotes(key, attributes),
          lore: this.getString(key, "Lore"),
          recipe: key.startsWith("item_recipe"),
          cost: raw.ItemCost && parseInt(raw.ItemCost, 10),
          home_shop: raw.SideShop !== "1",
          side_shop: raw.SideShop === "1",
          secret_shop: raw.SecretShop === "1",
          cooldown: raw.AbilityCooldown && Number(raw.AbilityCooldown),
          mana_cost: raw.AbilityManaCost && Number(raw.AbilityManaCost),
          custom_attributes:
            attributes && formatCustomAttributes(attributes, this.strings, key),
          requirements: this.getRequirements(key),
          upgrades: undefined as any[] | undefined,
        };
      })
      .sort((a, b) => a.id - b.id);

    items.forEach((item) => {
      item.upgrades = this.getUpgrades(items, item);
    });

    return items;
  }

  get keys() {
    return Object.keys(this.items).filter(
      (key) => !this.ignoredKeys.includes(key)
    );
  }

  get items() {
    return this.data.DOTAAbilities;
  }

  get ignoredKeys() {
    return Object.keys(this.items)
      .filter((key) => {
        return (
          key.startsWith("item_recipe") && this.items[key].ItemCost === "0"
        );
      })
      .concat("Version");
  }

  getName(key: string, level: string) {
    const name = this.getString(key);

    return level ? `${name} (level ${level})` : name;
  }

  getString(key: string, suffix = "") {
    return this.strings[`DOTA_Tooltip_ability_${key}${suffix && `_${suffix}`}`];
  }

  getDescription(description: string, attributes: any[]) {
    return replaceAttributes(description, attributes)
      .split(/\\n/)
      .map(this.formatAttribute);
  }

  formatAttribute(attribute: string) {
    if (
      !attribute.includes("<h1>") ||
      !attribute.includes("</h1>") ||
      !attribute.includes(":")
    ) {
      return {
        type: "hint",
        body: formatDescription(attribute),
      };
    } else {
      const regExp = /<h1>\s*(.*)\s*:\s*(.*)\s*<\/h1>\s*([\s\S]*)/gi;
      // @ts-ignore
      const [_, type, header, body] = regExp.exec(attribute);

      return {
        type: type.toLowerCase(),
        header: header,
        body: formatDescription(body),
      };
    }
  }

  getNotes(key: string, attributes: any[]) {
    const notes = [];

    for (let i = 0; this.getString(key, `Note${i}`); i++) {
      notes.push(
        replaceAttributes(this.getString(key, `Note${i}`), attributes)
      );
    }

    return notes;
  }

  getRequirements(key: string) {
    let k = key;

    if (!k.startsWith("item_recipe")) {
      k = k.replace("item_", "item_recipe_");
    }

    const item = this.items[k];

    if (!item || !item.ItemRequirements || !item.ItemRequirements.length) {
      return [];
    }

    const requirements = item.ItemRequirements[0].split(";");

    if (!k.startsWith("item_recipe") && item.ItemCost !== "0") {
      requirements.push(k);
    }

    return requirements;
  }

  getUpgrades(items: any[], item: any) {
    const upgrades: any[] = [];

    items
      .filter((i) => !i.recipe)
      .forEach((i) => {
        if (i.requirements.includes(item.key)) {
          upgrades.push(i.key);
        }
      });

    return upgrades;
  }
}
