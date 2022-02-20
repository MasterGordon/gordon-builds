import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Img,
  VStack,
} from "@chakra-ui/react";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import builds from "../../builds";
import Header from "../../components/Header";
import { LatestBuildsProps } from "../../components/LatestBuilds";
import { getData } from "../../provider/dota";

const Builds: NextPage<LatestBuildsProps> = (props) => {
  const { builds } = props;
  return (
    <>
      <Head>
        <title>Latest Builds - Gordon Builds</title>
        <meta name="description" content="Latest builds from Gordon Builds" />
      </Head>
      <Header />
      <Box
        marginY="4"
        marginX="auto"
        maxWidth="1300px"
        padding="4"
        borderRadius="md"
        backgroundColor="gray.700"
      >
        <Heading size="lg" fontWeight="semibold" color="white" marginBottom="4">
          Latest builds
        </Heading>
        <Flex alignItems="baseline">
          <Grid
            width="100%"
            gridTemplateColumns={{ md: "1fr 1fr", xl: "1fr 1fr 1fr" }}
            gap="4"
          >
            {builds.map((build) => (
              <VStack
                key={build.slug}
                alignItems="start"
                backgroundColor="gray.800"
                borderRadius="md"
                padding="2"
              >
                <Link href={`/builds/${build.slug}`} passHref>
                  <HStack
                    spacing="1"
                    as="a"
                    _hover={{
                      "& *": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <Img
                      src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${build.heroKey.replace(
                        "npc_dota_hero_",
                        ""
                      )}.png`}
                      display="inline-block"
                      alt={build.heroKey}
                      height="3em"
                      mr={4}
                    />
                    <VStack alignItems="start" spacing="1">
                      <Heading as="h3" display="inline-flex" size="md">
                        {build.name}
                      </Heading>
                      <Heading as="h4" display="inline-flex" size="sm">
                        {build.heroName} {build.version}
                      </Heading>
                    </VStack>
                  </HStack>
                </Link>
                <Box>{build.shortDescription}</Box>
              </VStack>
            ))}
          </Grid>
        </Flex>
      </Box>
    </>
  );
};

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

  return {
    props: {
      builds: buildsList,
    },
  };
}

export default Builds;
