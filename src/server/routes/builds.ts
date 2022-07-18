import { getData } from "../../provider/dota";
import { createRouter } from "../createRouter";
import builds from "../../builds";
import { z } from "zod";
import { serialize } from "next-mdx-remote/serialize";

export const buildsRouter = createRouter()
  .query("list", {
    async resolve({ ctx }) {
      const heroes = await getData("heroes");
      const buildsList = (
        await ctx.prisma.build.findMany({
          select: {
            name: true,
            version: true,
            heroKey: true,
            slug: true,
            shortDescription: true,
          },
        })
      ).map((build) => ({
        ...build,
        heroName: heroes.find((hero) => hero.id === build.heroKey)?.name,
      }));
      return buildsList;
    },
  })
  .query("slugs", {
    async resolve() {
      const buildsList = builds.map((build) => build.slug);
      return buildsList;
    },
  })
  .query("getBySlug", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      const { slug } = input;
      const build = builds.find((b) => b.slug === slug);

      if (!build) throw new Error("Build not found");
      const heroes = await getData("heroes");
      const heroData = heroes.find((hero) => hero.key === build.heroKey);
      const abilities = (await getData("abilities"))
        .filter(
          (ability) =>
            heroData?.abilities?.includes(ability.key) ||
            heroData?.talents?.includes(ability.key)
        )
        .map((ability) => {
          return JSON.parse(JSON.stringify(ability));
        })
        .reduce((acc, ability) => {
          acc[ability.key] = ability;
          return acc;
        }, {});
      if (!heroData) throw new Error("Hero not found");
      const itemData = (await getData("items"))
        .filter((item) =>
          Object.values(build.items)
            .flat()
            .some((buildItem) => buildItem.key === item.key)
        )
        .map((item) => {
          return JSON.parse(JSON.stringify(item));
        })
        .reduce((acc, item) => {
          acc[item.key] = item;
          return acc;
        }, {});
      const mdx = await serialize(build.description);
      return { mdx, ...build, heroData, abilities, itemData };
    },
  })
  .query("getPlainBuild", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx: { prisma } }) {
      const { slug } = input;
      const build = await prisma.build.findFirst({
        where: { slug },
        include: {
          items: {
            include: { items: true },
          },
        },
      });
      if (!build) throw new Error("Build not found");
      return build;
    },
  });
