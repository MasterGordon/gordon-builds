import { pascalCase } from "case-anything";
import { z } from "zod";
import { dotaFetch } from "./dota-fetch";
import { translator } from "./dota-translations";
import { ItemRaw } from "./items";
import { removeHtmlTags } from "./remove-html-tags";

const abilitySchema = z
  .object({
    AbilityType: z.string().optional(),
    AbilitySpecial: z
      .array(z.record(z.string(), z.any()))
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
  const response = await dotaFetch("abilities");
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

const tooltipKindMapping = {
  name: "",
  lore: "_Lore",
  description: "_Description",
  shardDescription: "_shard_description",
};

const hasAbilitySpecial = (
  abilitySpecial: RawAbility["AbilitySpecial"]
): abilitySpecial is Record<string, any>[] => {
  return Array.isArray(abilitySpecial);
};

const getAbilityValue = (abilitySpecial: Record<string, any>, key: string) => {
  let value = abilitySpecial[key];
  if (value && typeof value === "object" && value.value) value = value.value;
  if (Array.isArray(value)) {
    if (new Set(value).size === 1) {
      value = value[0];
    } else {
      value = value.join(" / ");
    }
  }
  if (!value) return;
  const splitted = (value + "").split(" ");
  if (splitted.length > 1) {
    if (new Set(splitted).size === 1) value = splitted[0];
    else if (!splitted.includes("/")) value = splitted.join(" / ");
  }
  return value;
};

const fixAbilitySpecial = (abilitySpecial: RawAbility["AbilitySpecial"]) => {
  if (!hasAbilitySpecial(abilitySpecial)) return {};
  return abilitySpecial.reduce((acc, x) => {
    return {
      ...acc,
      ...x,
    };
  }, {});
};

const getCustomAttributes = async (ability: RawAbility) => {
  const { AbilityValues, AbilitySpecial, key: abilityKey } = ability;
  const translations = translator.getTranslations();
  if (!translations) return;
  const customAttributesRaw = {
    ...AbilityValues,
    ...fixAbilitySpecial(AbilitySpecial),
  };
  const keys = Object.keys(customAttributesRaw).filter(
    (key) => `DOTA_Tooltip_ability_${abilityKey}_${key}` in translations
  );
  return keys.map((key) => {
    let header = translations[`DOTA_Tooltip_ability_${abilityKey}_${key}`];
    let prefix, suffix;

    if (header.startsWith("%")) {
      header = header.substring(1);
      suffix = "%";
    }

    if (header.startsWith("+$")) {
      header = translations[`dota_ability_variable_${header.substring(2)}`];
      prefix = "+";
    }

    return {
      key: key,
      value: getAbilityValue(customAttributesRaw, key),
      scepter: key.endsWith("_scepter"),
      header: header.replace(/\\n/g, ""),
      prefix: prefix,
      suffix: suffix,
    };
  });
};

const resolvePlaceholders = (text: string, abilityRaw: RawAbility) => {
  const { AbilitySpecial } = abilityRaw;
  if (!hasAbilitySpecial(AbilitySpecial)) return text;
  const placeholders = text.replace(/%%%/g, "%").match(/%[^%]+%/g);
  if (!placeholders) return text;
  placeholders.forEach((placeholder) => {
    const placeholderName = placeholder.slice(1, -1);
    const placeholderValue = getAbilityValue(
      fixAbilitySpecial(AbilitySpecial),
      placeholderName
    );
    if (placeholderValue) {
      text = text.replace(placeholder, `<b>${placeholderValue}</b>`);
    }
  });
  return text.replace(/%%/g, "%");
};

export const getTooltip = (
  ability: string,
  kind: keyof typeof tooltipKindMapping | string,
  abilityRaw: RawAbility | ItemRaw
) => {
  const translation = translator.translate(
    "DOTA_Tooltip_ability_" +
      ability +
      ((tooltipKindMapping as any)[kind] ?? kind)
  );
  if (!translation) return;
  return resolvePlaceholders(translation, abilityRaw);
};

export const getItemTooltip = (
  item: string,
  kind: keyof typeof tooltipKindMapping | string,
  abilityRaw: ItemRaw
) => {
  const translation = translator.translate(
    "DOTA_Tooltip_Ability_" + item + ((tooltipKindMapping as any)[kind] ?? kind)
  );
  if (!translation) return;
  return resolvePlaceholders(translation, abilityRaw);
};

export const getNotes = (ability: string, abilityRaw: RawAbility) => {
  const notes = [];
  let i = 0;
  while (true) {
    const note = getTooltip(ability, "_Note" + i++, abilityRaw);
    if (note) {
      notes.push(note);
    } else {
      break;
    }
  }
  return notes;
};

const tryGetAsArray = (ability: RawAbility, key: keyof RawAbility) => {
  const value = ability[key];
  let res: undefined | unknown[] = undefined;
  if (value === undefined) return undefined;
  if (Array.isArray(value)) res = value;
  res = value.split(" ");
  if (res?.length === 1 && res[0] == "0") return undefined;
  return res;
};

const targetTeamToPrefix = {
  DOTA_UNIT_TARGET_TEAM_FRIENDLY: "Allied",
  DOTA_UNIT_TARGET_TEAM_ENEMY: "Enemy",
} as Record<string, string>;

interface Header {
  label: string;
  value: string;
  raw?: string;
}

type Headers = Header[];

const getHeaders = (ability: RawAbility) => {
  const headers: Headers = [];
  if (ability.AbilityBehavior) {
    const abilityTarget = {
      label: translator.translate("DOTA_ToolTip_Ability"),
      value: undefined,
    } as Partial<Header>;
    if (ability.AbilityBehavior.includes("DOTA_ABILITY_BEHAVIOR_POINT")) {
      abilityTarget.value = translator.translate("DOTA_ToolTip_Ability_Point");
    } else if (
      ability.AbilityBehavior.includes("DOTA_ABILITY_BEHAVIOR_UNIT_TARGET")
    ) {
      abilityTarget.value = translator.translate("DOTA_ToolTip_Ability_Target");
    } else if (
      ability.AbilityBehavior.includes("DOTA_ABILITY_BEHAVIOR_NO_TARGET")
    ) {
      abilityTarget.value = translator.translate(
        "DOTA_ToolTip_Ability_NoTarget"
      );
    }
    if (ability.AbilityBehavior.includes("DOTA_ABILITY_BEHAVIOR_AUTOCAST")) {
      abilityTarget.value = translator.translate(
        "DOTA_ToolTip_Ability_AutoCast"
      );
    }
    if (ability.AbilityBehavior.includes("DOTA_ABILITY_BEHAVIOR_PASSIVE")) {
      abilityTarget.value = translator.translate(
        "DOTA_ToolTip_Ability_Passive"
      );
    }
    if (abilityTarget.value) headers.push(abilityTarget as Header);
  }

  if (ability.AbilityUnitTargetTeam) {
    const team = targetTeamToPrefix[ability.AbilityUnitTargetTeam];
    let type: string | undefined;
    if (ability.AbilityUnitTargetType) {
      const targetsRaw = ability.AbilityUnitTargetType.split(" | ");
      const creeps = targetsRaw.includes("DOTA_UNIT_TARGET_BASIC");
      const heroes = targetsRaw.includes("DOTA_UNIT_TARGET_HERO");
      const target = creeps && heroes ? "Units" : creeps ? "Creeps" : "Heroes";
      type = target;
      type += targetsRaw.includes("DOTA_UNIT_TARGET_BUILDING")
        ? "AndBuildings"
        : "";
    }
    const value = translator.translate("DOTA_ToolTip_Targeting_" + team + type);
    if (value)
      headers.push({
        label: translator.translate("DOTA_ToolTip_Targeting") || "Affects",
        value: removeHtmlTags(value),
      });
  }

  if (ability.AbilityUnitDamageType) {
    const damageType = removeHtmlTags(
      translator.translate(
        "DOTA_ToolTip_Damage_" +
          pascalCase(ability.AbilityUnitDamageType.split("_").at(-1) || "")
      )
    );
    if (damageType)
      headers.push({
        label: translator.translate("DOTA_ToolTip_Damage") || "Damage",
        value: damageType,
        raw: ability.AbilityUnitDamageType,
      });
  }

  if (ability.SpellImmunityType) {
    const spellImmunityType = removeHtmlTags(
      translator.translate(
        "DOTA_ToolTip_PiercesSpellImmunity_" +
          pascalCase(ability.SpellImmunityType.split("_").at(-1) || "")
      )
    );
    if (spellImmunityType)
      headers.push({
        label:
          translator.translate("DOTA_ToolTip_PiercesSpellImmunity") ||
          "Pierces Spell Immunity",
        value: spellImmunityType,
        raw: ability.SpellImmunityType,
      });
  }

  if (ability.SpellDispellableType) {
    let value: string | undefined;
    if (ability.SpellDispellableType === "SPELL_DISPELLABLE_YES") {
      value = translator.translate("DOTA_ToolTip_Dispellable_Yes_Soft");
    } else if (
      ability.SpellDispellableType === "SPELL_DISPELLABLE_YES_STRONG"
    ) {
      value = translator.translate("DOTA_ToolTip_Dispellable_Yes_Strong");
    } else if (ability.SpellDispellableType === "SPELL_DISPELLABLE_NO") {
      value = translator.translate("DOTA_ToolTip_Dispellable_No");
    }
    if (value)
      headers.push({
        label:
          translator.translate("DOTA_ToolTip_Dispellable") || "Dispellable",
        value: removeHtmlTags(value),
        raw: ability.SpellDispellableType,
      });
  }

  return headers;
};

export const getAbilities = async () => {
  const rawAbilities = await getRawAbilities();
  await translator.prewarm();
  const abilities = await Promise.all(
    rawAbilities.map(async (ability) => {
      return {
        key: ability.key,
        // id: ability.ID,
        name: getTooltip(ability.key, "name", ability),
        description: getTooltip(ability.key, "description", ability),
        lore: getTooltip(ability.key, "lore", ability),
        notes: getNotes(ability.key, ability),
        cooldown: tryGetAsArray(ability, "AbilityCooldown"),
        manaCost: tryGetAsArray(ability, "AbilityManaCost"),
        customAttributes: await getCustomAttributes(ability),
        header: getHeaders(ability),
      };
    })
  );

  return abilities;
};
