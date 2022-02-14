import { Build } from "./Build";

export const dipsWeaver: Build = {
  name: "Dips Weaver",
  slug: "dips-weaver",
  description: `
# Gameplay
The Dips Weaver is a versatile build that can be used to play any type of game.

# Skills
The most important skill of the Dips Weaver is the **Dips** skill. This skill is used to create a Dips, which is a special type of skill that can be used to create a Dips.
Use Shukuchi to get safe lasthits and deal some damage on enemy heroes.
You should never use this spell for invisibility and just think of it as a mobiliy/farming spell.
If the enemy buys wards just laugh at them.
`,
  version: "7.30e",
  heroKey: "npc_dota_hero_weaver",
  skills: [
    "   X        XX X  ",
    "X X X X           ",
    " X     XX X       ",
    "",
    "",
    "     X     X     X",
  ],
  talents: ["   X", "XXX"],
  items: {
    "Starting Items": [
      { key: "item_tango" },
      { key: "item_slippers" },
      { key: "item_slippers" },
      { key: "item_flask" },
      { key: "item_branches" },
      { key: "item_branches" },
    ],
    "Basic Items (in order)": [
      { key: "item_wraith_band" },
      { key: "item_wraith_band" },
      { key: "item_boots" },
      { key: "item_magic_wand" },
      { key: "item_boots_of_elves" },
      { key: "item_power_treads" },
    ],
    "Dips (in order)": [
      { key: "item_desolator" },
      { key: "item_greater_crit" },
      { key: "item_greater_crit" },
    ],
    "Oh Shit": [
      { key: "item_lifesteal" },
      { key: "item_black_king_bar" },
      { key: "item_monkey_king_bar" },
      { key: "item_satanic" },
      { key: "item_mjollnir" },
    ],
  },
};
