import axios from "axios";

const baseURL =
  process.env.BASE_URL ||
  "https://raw.githubusercontent.com/dotabuff/d2vpkr/master";

const urls = {
  heroes: `${baseURL}/dota/scripts/npc/npc_heroes.json`,
  abilities: `${baseURL}/dota/scripts/npc/npc_abilities.json`,
  items: `${baseURL}/dota/scripts/npc/items.json`,
};

export const dotaFetch = async (url: keyof typeof urls) => {
  const response = await axios.get(urls[url]);
  return response.data;
};
