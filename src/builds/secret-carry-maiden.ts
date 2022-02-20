import { Build } from "./Build";

export const secretCarryMaiden: Build = {
  name: "Secret Carry Maiden",
  complexity: 1,
  trollLevel: 1,
  slug: "secret-carry-maiden",
  shortDescription:
    "A build that pretends to be a support, but is actually a carry that wins every teamfight.",
  description: `
# Gameplay
The Secret Carry Maiden is a build that pretends to be a support, but is actually a carry that wins every teamfight.

After you completed your Basic Items you are ready to start ganking. You should place smart wards to spot your enemies. And use smokes to gank lanes. With **Blink Dagger** and **Frostbite** you can get easy kill on the mid lane. If you really wanna carry you can get a point in to **Crystal Nova** to "secure" kills an accelerate you items.

When you completed you bkb you are ready to fuck. Just blink, pop your bkb and cast **Freezing Field** and the teamfight is won.
`,
  skills: [
    "          X XX X  ",
    "X X X X           ",
    " X X   XX         ",
    "",
    "",
    "     X     X     X",
  ],
  talents: ["  X ", "XX X"],
  items: {
    "Starting Items": [
      { key: "item_tango" },
      { key: "item_clarity" },
      { key: "item_branches" },
      { key: "item_branches" },
      { key: "item_wind_lace" },
      { key: "item_ward_observer" },
      { key: "item_ward_sentry" },
    ],
    "Basic Items": [
      { key: "item_magic_wand" },
      { key: "item_tranquil_boots" },
      {
        key: "item_bracer",
        description: "Buy this item only if you die alot in lane.",
      },
      { key: "item_blink" },
    ],
    "Enabling Freezing Field": [{ key: "item_black_king_bar" }],
    "Extension Items": [
      {
        key: "item_ultimate_scepter",
      },
      { key: "item_aghanims_shard" },
      { key: "item_aether_lens" },
      { key: "item_aeon_disk" },
      { key: "item_octarine_core" },
    ],
    "Ganking Power": [
      { key: "item_ward_sentry" },
      { key: "item_ward_observer" },
      { key: "item_dust" },
      { key: "item_smoke_of_deceit" },
    ],
  },
  heroKey: "npc_dota_hero_crystal_maiden",
  version: "7.30e",
};
