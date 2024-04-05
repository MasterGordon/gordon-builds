import { getTestRouter } from "./__test__/getTestRouter";

describe("dota TRPC router", () => {
  it("should return hero by id", async () => {
    const router = getTestRouter();
    const hero = await router.dota.getHero({ id: 91 });
    expect(hero).toBeDefined();
  });

  it("should return hero by name", async () => {
    const router = getTestRouter();
    const hero = await router.dota.getHero({ name: "npc_dota_hero_wisp" });
    expect(hero).toBeDefined();
  });

  it("should return all heroes", async () => {
    const router = getTestRouter();
    const heroes = await router.dota.getHeroes();
    expect(heroes).toBeDefined();
  });

  it("should all heroes work", async () => {
    const router = getTestRouter();
    const heroes = await router.dota.getHeroes();
    for (const hero of heroes) {
      const heroById = await router.dota.getHero({ id: hero.id });
      expect(heroById).toBeDefined();
      const heroByName = await router.dota.getHero({ name: hero.name });
      expect(heroByName).toBeDefined();
    }
  });
});
