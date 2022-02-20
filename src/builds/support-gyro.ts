import { Build } from "./Build";

export const supportGyro: Build = {
  slug: "support-gyro",
  name: "Support Gyro",
  complexity: 2,
  trollLevel: 2,
  shortDescription:
    "Support Gyro is a build that focuses on the support role. It is a good build for those who want to support their team.",
  description: `
# Gameplay
Support Gryo deals alot of magical damage. It is a very simple combo you just need to connect your Rocket, hope the enemy is stupid and runs away from creeps, if you runs away you just drop a **Rocket Barrage** to kill him.
`,
  version: "7.30e",
  heroKey: "npc_dota_hero_gyrocopter",
  skills: [
    " XX X X           ",
    "X      XX X       ",
    "   X        XX X  ",
    "",
    "",
    "     X     X     X",
  ],
  talents: ["X XX", " X  "],
  items: {
    "Starting Items": [
      { key: "item_tango" },
      { key: "item_circlet" },
      { key: "item_branches" },
      { key: "item_branches" },
      { key: "item_mantle" },
      { key: "item_clarity" },
      { key: "item_ward_observer" },
    ],
    "Basic Items": [
      { key: "item_null_talisman" },
      { key: "item_magic_wand" },
      { key: "item_arcane_boots" },
      { key: "item_veil_of_discord" },
      { key: "item_aghanims_shard" },
    ],
    "Extension Items": [
      {
        key: "item_ultimate_scepter",
      },
      { key: "item_aether_lens" },
      { key: "item_aeon_disk" },
      { key: "item_octarine_core" },
      { key: "item_guardian_greaves" },
    ],
    Utility: [
      { key: "item_ward_sentry" },
      { key: "item_ward_observer" },
      { key: "item_dust" },
      { key: "item_smoke_of_deceit" },
    ],
  },
};
