import { getAbilities } from "./abilities";
import { getHeroes } from "./dota2";

describe("Dota 2", () => {
  it("should find weaver", async () => {
    const heroes = await getHeroes();
    const weaver = heroes.find((hero) => hero.key === "npc_dota_hero_weaver");
    expect(weaver).toBeDefined();
  });

  it("should find weaver abilities", async () => {
    const heroes = await getHeroes();
    const weaver = heroes.find((hero) => hero.key === "npc_dota_hero_weaver");
    const abilities = await getAbilities();
    if (weaver)
      Object.entries(weaver?.abilities).forEach(([key, value]) => {
        const ability = abilities.find((ability) => ability.key === value);
        if (!ability) expect(value + " not found").not.toBeDefined();

        expect(ability).toBeDefined();
      });
  });
});
