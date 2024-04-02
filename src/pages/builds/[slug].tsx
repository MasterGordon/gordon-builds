import { GetStaticProps, NextPage } from "next";
import Layout from "../../components/Layout";
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
import BuildDescription from "../../components/build/BuildDescription";
import BuildItems from "../../components/build/BuildItems";
import BuildHeader from "../../components/build/BuildHeader";
import Head from "next/head";
import BuildAbility from "../../components/build/BuildAbility";
import TalentTree from "../../components/build/TalentTree";
import meepo from "../../images/meepo.png";
import troll from "../../images/troll.png";
import Image from "next/legacy/image";
import { getSSG } from "../../server/ssg";
import { z } from "zod";
import { trpc } from "../../utils/trpc";

interface Props extends Build {
  mdx: MDXRemoteSerializeResult;
  heroData: any;
  abilities: any;
  itemData: any;
  buildsList: any;
}

const Build: NextPage<Props> = ({ slug }) => {
  const { data: buildList } = trpc.useQuery(["build.list"], {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: build } = trpc.useQuery(["build.getBySlug", { slug }], {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  if (!build) return null;
  return (
    <Layout builds={buildList}>
      <Head>
        <title>{build.name} - Gordon Builds</title>
        <meta
          name="description"
          content={build.name + " - " + build.shortDescription}
        />
      </Head>
      <VStack alignItems="start">
        <BuildHeader
          heroKey={build.heroKey}
          version={build.version}
          name={build.name}
          heroName={build.heroData.name || "???"}
        />
        <HStack>
          <Heading as="h2" size="md">
            Difficulty:{" "}
          </Heading>
          <VisuallyHidden>{build.complexity}</VisuallyHidden>
          {[...new Array(build.complexity)].map((_, index) => (
            <Image key={index} src={meepo} alt="" />
          ))}
        </HStack>
        <HStack>
          <Heading as="h2" size="md">
            Troll Level:{" "}
          </Heading>
          <VisuallyHidden>{build.trollLevel}</VisuallyHidden>
          {[...new Array(build.trollLevel)].map((_, index) => (
            <Image key={index} src={troll} alt="" />
          ))}
        </HStack>
        <Heading as="h2" size="md">
          Item Build
        </Heading>
        <BuildItems items={build.items} itemData={build.itemData} />
        <Heading as="h2" size="md">
          Hero Skills
        </Heading>
        <Box
          overflowX="auto"
          maxWidth="calc(100vw - var(--chakra-space-16))"
          width="100%"
        >
          <VStack alignItems="start">
            {Object.values(build?.heroData.abilities)
              ?.slice(0, 6)
              .map((ability: string, index: number) => {
                return ability != "generic_hidden" ? (
                  <HStack key={ability}>
                    <BuildAbility
                      ability={ability}
                      abilityData={build.abilities[ability]}
                    />
                    <HStack>
                      {build.skills[index]
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
          talents={build.talents}
          talentNames={
            Object.values(build?.heroData.talents)?.map(
              (talent: string) => build.abilities[talent].name
            ) ?? []
          }
        />
        <BuildDescription mdx={build.mdx} />
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
  const { slug } = z
    .object({
      slug: z.string(),
    })
    .parse(context.params);
  const ssg = await getSSG(context);
  await ssg.fetchQuery("build.getBySlug", { slug });
  await ssg.fetchQuery("build.list");

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  };
};

export async function getStaticPaths() {
  const ssg = await getSSG();
  const slugs = await ssg.fetchQuery("build.slugs");
  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
}
export default Build;
