import { GetStaticProps, NextPage } from "next";
import Layout from "../../components/Layout";
import builds from "../../builds";
import { getData } from "../../provider/dota";
import { Build } from "../../builds/Build";
import {
  Box,
  Center,
  Heading,
  HStack,
  VisuallyHidden,
  VStack,
} from "@chakra-ui/react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import BuildDescription from "../../components/build/BuildDescription";
import BuildItems from "../../components/build/BuildItems";
import BuildHeader from "../../components/build/BuildHeader";
import Head from "next/head";
import BuildAbility from "../../components/build/BuildAbility";
import TalentTree from "../../components/build/TalentTree";
import meepo from "../../images/meepo.png";
import troll from "../../images/troll.png";
import Image from "next/image";

interface Props extends Build {
  mdx: MDXRemoteSerializeResult;
  heroData: any;
  abilities: any;
  itemData: any;
  buildsList: any;
}

const Build: NextPage<Props> = (props) => {
  return (
    <Layout builds={props.buildsList}>
      <Head>
        <title>{props.name} - Gordon Builds</title>
        <meta
          name="description"
          content={props.name + " - " + props.shortDescription}
        />
      </Head>
      <VStack alignItems="start">
        <BuildHeader
          heroKey={props.heroKey}
          version={props.version}
          name={props.name}
          heroName={props.heroData.name}
        />
        <HStack>
          <Heading as="h2" size="md">
            Difficulty:{" "}
          </Heading>
          <VisuallyHidden>{props.complexity}</VisuallyHidden>
          {[...new Array(props.complexity)].map((_, index) => (
            <Image key={index} src={meepo} alt="" />
          ))}
        </HStack>
        <HStack>
          <Heading as="h2" size="md">
            Troll Level:{" "}
          </Heading>
          <VisuallyHidden>{props.trollLevel}</VisuallyHidden>
          {[...new Array(props.trollLevel)].map((_, index) => (
            <Image key={index} src={troll} alt="" />
          ))}
        </HStack>
        <Heading as="h2" size="md">
          Item Build
        </Heading>
        <BuildItems items={props.items} itemData={props.itemData} />
        <Heading as="h2" size="md">
          Hero Skills
        </Heading>
        <Box
          overflowX="auto"
          maxWidth="calc(100vw - var(--chakra-space-16))"
          width="100%"
        >
          <VStack alignItems="start">
            {props.heroData.abilities
              .slice(0, 6)
              .map((ability: string, index: number) => {
                return ability != "generic_hidden" ? (
                  <HStack key={ability}>
                    <BuildAbility
                      ability={ability}
                      abilityData={props.abilities[ability]}
                    />
                    <HStack>
                      {props.skills[index]
                        .split("")
                        .map((letter: string, index: number) => {
                          return (
                            <Center
                              userSelect="none"
                              key={index}
                              bg={letter == "X" ? "yellow.600" : "gray.800"}
                              p={1}
                              boxSize={["2em", "2em", "2em", "2.5em"]}
                              textAlign="center"
                              fontSize="sm"
                              fontWeight="bold"
                              color="black"
                            >
                              {letter == "X" ? index + 1 : " "}
                            </Center>
                          );
                        })}
                    </HStack>
                  </HStack>
                ) : undefined;
              })}
          </VStack>
        </Box>
        <Heading as="h2" size="md">
          Talents
        </Heading>
        <TalentTree
          talents={props.talents}
          talentNames={props.heroData.talents.map(
            (talent: string) => props.abilities[talent].name
          )}
        />
        <BuildDescription mdx={props.mdx} />
      </VStack>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) {
    return {
      notFound: true,
    };
  }
  const { slug } = context.params;
  const build = builds.find((b) => b.slug === slug);

  if (!build) return { notFound: true };
  const heroes = await getData("heroes");
  const heroData = heroes.find((hero) => hero.key === build.heroKey);
  const abilities = (await getData("abilities"))
    .filter(
      (ability) =>
        heroData.abilities.includes(ability.key) ||
        heroData.talents.includes(ability.key)
    )
    .map((ability) => {
      return JSON.parse(JSON.stringify(ability));
    })
    .reduce((acc, ability) => {
      acc[ability.key] = ability;
      return acc;
    }, {});
  if (!heroData) return { notFound: true };
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
  const buildsList = builds.map((build) => ({
    name: build.name,
    heroKey: build.heroKey,
    version: build.version,
    slug: build.slug,
    heroName: heroes.find((hero) => hero.key === build.heroKey).name,
  }));

  return {
    props: { ...build, mdx, heroData, abilities, itemData, buildsList },
  };
};
export async function getStaticPaths() {
  return {
    paths: builds.map((build) => ({
      params: { slug: build.slug },
    })),
    fallback: false,
  };
}
export default Build;
