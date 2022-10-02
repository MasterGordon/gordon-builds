import { dotaFetch } from "./dota-fetch";
import { z } from "zod";
import { translator } from "./dota-translations";
import { getNotes } from "./abilities";

const itemSchema = z
  .object({
    key: z.string(),
    ID: z.string(),
    AbilityBehavior: z.string().optional(),
    AbilityCastRange: z.string().optional(),
    AbilityOvershootCastRange: z.string().optional(),
    AbilityCastPoint: z.string().optional(),
    AbilityCooldown: z.string().optional(),
    AbilitySharedCooldown: z.string().optional(),
    ItemCost: z.string().optional(),
    ItemShopTags: z.string().optional(),
    ItemQuality: z.string().optional(),
    ItemAliases: z.string().optional(),
    ItemDeclarations: z.string().optional(),
    ShouldBeSuggested: z.string().optional(),
    AbilitySpecial: z.array(z.any()).optional(),
    AbilityUnitTargetTeam: z.string().optional(),
    FightRecapLevel: z.string().optional(),
    SpellDispellableType: z.string().optional(),
    ItemDisplayCharges: z.string().optional(),
    ItemStackable: z.string().optional(),
    ItemPermanent: z.string().optional(),
    ItemDisassembleRule: z.string().optional(),
    ItemRecipe: z.string().optional(),
    ItemResult: z.string().optional(),
    ItemRequirements: z.array(z.string()).nullable().optional(),
    Model: z.string().optional(),
    ItemPurchasable: z.string().optional(),
    ItemSellable: z.string().optional(),
    AbilityValues: z.record(z.string(), z.string()).optional(),
    ItemIsNeutralDrop: z.string().optional(),
    AbilityManaCost: z.string().optional(),
    AbilityUnitTargetType: z.string().optional(),
    ItemAlertable: z.string().optional(),
    ItemRequiresCharges: z.string().optional(),
    ActiveDescriptionLine: z.string().optional(),
    ShouldBeInitiallySuggested: z.string().optional(),
    UIPickupSound: z.string().optional(),
    UIDropSound: z.string().optional(),
    WorldDropSound: z.string().optional(),
    IsObsolete: z.string().optional(),
    MaxUpgradeLevel: z.string().optional(),
    ItemBaseLevel: z.string().optional(),
    UpgradesItems: z.string().optional(),
    UpgradeRecipe: z.string().optional(),
    AllowedInBackpack: z.string().optional(),
    AbilityUnitDamageType: z.string().optional(),
    ItemDroppable: z.string().optional(),
    Effect: z.string().optional(),
    ItemKillable: z.string().optional(),
    ItemContributesToNetWorthWhenDropped: z.string().optional(),
    IsTempestDoubleClonable: z.string().optional(),
    ItemShareability: z.string().optional(),
    ItemStockTime: z.string().optional(),
    ItemStockInitial: z.string().optional(),
    ItemStockMax: z.string().optional(),
    ItemInitialStockTime: z.string().optional(),
    ItemInitialStockTimeTurbo: z.string().optional(),
    SpellImmunityType: z.string().optional(),
    AbilityChannelTime: z.string().optional(),
    AbilityUnitTargetFlags: z.string().optional(),
    ItemInitialCharges: z.string().optional(),
    AbilitySound: z.string().optional(),
    AbilityCastAnimation: z.string().optional(),
    DisplayOverheadAlertOnReceived: z.string().optional(),
    AbilityName: z.string().optional(),
    AssociatedConsumable: z.string().optional(),
    EventID: z.string().optional(),
    PlayerSpecificCooldown: z.string().optional(),
    PingOverrideText: z.string().optional(),
    precache: z.any().optional(),
    ItemCastOnPickup: z.string().optional(),
    ItemHideCharges: z.string().optional(),
    ItemSupport: z.string().optional(),
    AbilityDuration: z.string().optional(),
    ItemLevelByGameTime: z.string().optional(),
    BonusDelayedStockCount: z.string().optional(),
    SecretShop: z.string().optional(),
    ItemStackableMax: z.string().optional(),
    ModelAlternate: z.string().optional(),
    ItemInitiallySellable: z.string().optional(),
  })
  .strict();

export type ItemRaw = z.infer<typeof itemSchema>;

export const getRawItems = async (): Promise<ItemRaw[]> => {
  const response = await dotaFetch("items");
  const itemsRaw = Object.entries(response.DOTAAbilities)
    .map(([key, value]: [string, any]) => ({
      key,
      ...value,
    }))
    .slice(1);
  return z.array(itemSchema).parse(itemsRaw);
};

const tooltipKindMapping = {
  name: "",
  lore: "_Lore",
  description: "_Description",
};

const parseIfNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

const resolvePlaceholders = (text: string, abilityRaw: ItemRaw) => {
  const { AbilitySpecial, AbilityValues } = abilityRaw;
  const placeholders = text.replaceAll("%%%", "%").match(/%[^%]+%/g);
  const values = {
    ...AbilityValues,
    ...AbilitySpecial?.reduce((acc, v: any) => ({ ...acc, ...v }), {}),
  };
  if (!placeholders) return text;
  placeholders.forEach((placeholder) => {
    const placeholderName = placeholder.slice(1, -1);
    const placeholderValue = parseIfNumber(
      values?.[placeholderName] < 0
        ? -values?.[placeholderName]
        : values?.[placeholderName]
    );

    if (placeholderValue) {
      text = text.replace(placeholder, `<b>${placeholderValue}</b>`);
    }
  });
  return text.replaceAll("%%", "%").replaceAll("<br>", "\n");
};

export const getTooltip = (
  item: string,
  kind: keyof typeof tooltipKindMapping | string,
  abilityRaw: ItemRaw
) => {
  const translation = translator.translate(
    `DOTA_Tooltip_${kind == "name" ? "A" : "a"}bility_${item}${
      (tooltipKindMapping as any)[kind] ?? kind
    }`
  );
  if (!translation) return;
  return resolvePlaceholders(translation, abilityRaw);
};

export const getDescription = (item: ItemRaw) => {
  const descriptionRaw = getTooltip(item.key, "description", item);
  if (!descriptionRaw) return;
  const description: any = [];
  descriptionRaw.split("<h1>").forEach((section) => {
    const [header, ...text] = section.split("</h1>");
    const [kind] = header.split(":");
    description.push({
      kind: kind.toLowerCase().trim(),
      header: header.trim(),
      text: text.join("").trim(),
    });
  });
  return description;
};

export const getItems = async () => {
  const itemsRaw = await getRawItems();
  await translator.prewarm();
  return itemsRaw.map((item) => ({
    key: item.key,
    id: item.ID,
    name: getTooltip(item.key, "name", item),
    description: getDescription(item),
    lore: getTooltip(item.key, "lore", item),
    notes: getNotes(item.key, item),
    cost: item.ItemCost,
    cooldown: item.AbilityCooldown,
    isNeutralDrop: item.ItemIsNeutralDrop == "1",
  }));
};
