import { translator } from "./dota-translations";
import { getRawAbilities } from "./dota2";

const tooltipKindMapping = {
  name: "",
  lore: "_Lore",
  description: "_Description",
  shardDescription: "_shard_description",
};

const getTooltip = (
  ability: string,
  kind: keyof typeof tooltipKindMapping | string
) => {
  return translator.translate(
    "DOTA_Tooltip_ability_" +
      ability +
      ((tooltipKindMapping as any)[kind] ?? kind)
  );
};

const getNotes = (ability: string) => {
  const notes = [];
  let i = 0;
  while (true) {
    const note = getTooltip(ability, "_Note" + i++);
    if (note) {
      notes.push(note);
    } else {
      break;
    }
  }
  return notes;
};

export const getAbilities = async () => {
  const rawAbilities = await getRawAbilities();
  await translator.prewarm();
  const abilities = rawAbilities.map((ability) => {
    return {
      key: ability.key,
      id: ability.ID,
      name: getTooltip(ability.key, "name"),
      description: getTooltip(ability.key, "description"),
      lore: getTooltip(ability.key, "lore"),
      notes: getNotes(ability.key),
    };
  });

  return abilities;
};
