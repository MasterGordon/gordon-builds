import { getData } from "../../provider/dota";
import builds from "../../builds";
import { NextPageContext } from "next";

const RandomBuild = () => <></>;

export async function getServerSideProps(context: NextPageContext) {
  const heroes = await getData("heroes");
  const buildsList = builds.map((build) => ({
    name: build.name,
    heroKey: build.heroKey,
    version: build.version,
    slug: build.slug,
    shortDescription: build.shortDescription,
    heroName: heroes.find((hero) => hero.key === build.heroKey).name,
  }));
  const build = buildsList[Math.floor(Math.random() * buildsList.length)];

  return {
    redirect: {
      destination: "/builds/" + build.slug,
      permanent: false,
    },
  };
}

export default RandomBuild;
