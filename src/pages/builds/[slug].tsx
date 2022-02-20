import { NextPage, NextPageContext } from "next";
import Layout from "../../components/Layout";
import builds from "../../builds";
import { getData } from "../../provider/dota";
import { Build } from "../../builds/Build";
import {
  Box,
  Center,
  Heading,
  HStack,
  Img,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import BuildDescription from "../../components/build/BuildDescription";
import BuildItems from "../../components/build/BuildItems";
import BuildHeader from "../../components/build/BuildHeader";
import Head from "next/head";
import AbilityDescription from "../../components/build/AbilityDescription";

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
      </Head>
      <VStack alignItems="start">
        <BuildHeader
          heroKey={props.heroKey}
          version={props.version}
          name={props.name}
          heroName={props.heroData.name}
        />
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
            {props.heroData.abilities.map((ability: string, index: number) => {
              return ability != "generic_hidden" ? (
                <HStack key={ability}>
                  <Tooltip
                    padding="0"
                    backgroundColor="rgba(0, 0, 0, 1)"
                    borderRadius="md"
                    maxWidth="370px"
                    key={index}
                    label={
                      <AbilityDescription ability={props.abilities[ability]} />
                    }
                    boxShadow="2px 2px 8px 8px rgba(0,0,0,0.75)"
                    hasArrow
                    placement="right"
                  >
                    <Img
                      width={["10", "16"]}
                      alt={ability}
                      src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`}
                    />
                  </Tooltip>
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
        <BuildDescription mdx={props.mdx} />
      </VStack>
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;
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
      Object.keys(build.items).reduce<boolean>((acc, category) => {
        return (
          acc ||
          !!build.items[category].find(
            (buildItem) => item.key === buildItem.key
          )
        );
      }, false)
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
}

export default Build;
