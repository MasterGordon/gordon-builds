const png = (icon: string) =>
  "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/" +
  icon +
  ".png";

const item = (icon: string) =>
  "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/" +
  icon +
  ".png";

const svg = (icon: string) =>
  "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/" +
  icon +
  ".svg";

const icons = {
  strength: png("hero_strength"),
  agility: png("hero_agility"),
  intelligence: png("hero_intelligence"),
  universal: png("hero_universal"),
  melee: svg("melee"),
  ranged: svg("ranged"),
  aghanims_shard: item("aghanims_shard"),
  aghanims_scepter: item("ultimate_scepter"),
  talens: svg("talents"),
} as const;

export default icons;
