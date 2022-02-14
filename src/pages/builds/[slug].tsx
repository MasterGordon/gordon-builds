import { NextPage, NextPageContext } from "next";
import Layout from "../../components/Layout";
import builds from "../../builds";
import { getData } from "../../provider/dota";
import { Build } from "../../builds/Build";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Img,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

interface Props extends Build {
  mdx: MDXRemoteSerializeResult;
  heroData: any;
  abilities: any;
}

const components = {
  h1: (props: any) => <Heading {...props} as="h2" size="md" />,
};

const Build: NextPage<Props> = (props) => {
  console.log(props);
  return (
    <Layout>
      <VStack alignItems="start">
        <HStack spacing="1">
          <Img
            src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${props.heroKey.replace(
              "npc_dota_hero_",
              ""
            )}.png`}
            display="inline-block"
            alt={props.heroKey}
            height="5em"
            mr={4}
          />
          <VStack alignItems="start" spacing="1">
            <Heading as="h1" display="inline-flex">
              {props.name}
            </Heading>
            <Heading as="h2" display="inline-flex" size="sm">
              {props.heroData.name} {props.version}
            </Heading>
          </VStack>
        </HStack>
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
                    label={
                      <Box>
                        <Heading as="h3" size="sm">
                          {props.abilities[ability].name}
                        </Heading>
                        {props.abilities[ability].description.map(
                          (description: string, index: number) => (
                            <Box key={index}>{description}</Box>
                          )
                        )}
                      </Box>
                    }
                    hasArrow
                    placement="right"
                  >
                    <Img
                      width={["10", "20"]}
                      alt={ability}
                      src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`}
                    />
                  </Tooltip>
                  <HStack>
                    {props.skills[index]
                      .split("")
                      .map((letter: string, index: number) => {
                        return (
                          <Box
                            userSelect="none"
                            key={index}
                            bg={letter == "X" ? "yellow.600" : "gray.800"}
                            p={1}
                            boxSize={["2em", "2em", "2em", "2.5em"]}
                            textAlign="center"
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.800"
                          >
                            {letter == "X" ? index + 1 : " "}
                          </Box>
                        );
                      })}
                  </HStack>
                </HStack>
              ) : undefined;
            })}
          </VStack>
        </Box>
        <MDXRemote {...props.mdx} components={components} />
      </VStack>
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;
  const build = builds.find((b) => b.slug === slug);

  if (!build) return { notFound: true };
  const heroData = (await getData("heroes")).find(
    (hero) => hero.key === build.heroKey
  );
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
  const mdx = await serialize(build.description);

  return {
    props: { ...build, mdx, heroData, abilities },
  };
}

export default Build;
