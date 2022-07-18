import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Img,
  VStack,
} from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { LatestBuildsProps } from "../../components/LatestBuilds";
import { getSSG } from "../../server/ssg";
import { trpc } from "../../utils/trpc";

const Builds: NextPage<LatestBuildsProps> = () => {
  const { data: builds } = trpc.useQuery(["build.list"], {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: test } = trpc.useQuery(["auth-test"]);
  const { data } = useSession();
  // console.log(data);
  return (
    <>
      <Head>
        <title>Latest Builds - Gordon Builds</title>
        <meta name="description" content="Latest builds from Gordon Builds" />
      </Head>
      <Box
        marginY="4"
        marginX="auto"
        maxWidth="1300px"
        padding="4"
        borderRadius="md"
        backgroundColor="gray.700"
      >
        <Heading size="lg" fontWeight="semibold" color="white" marginBottom="4">
          Latest builds {test}
        </Heading>
        <Button onClick={() => signIn()}>Login {data?.user?.name}</Button>
        <Flex alignItems="baseline">
          <Grid
            width="100%"
            gridTemplateColumns={{ md: "1fr 1fr", xl: "1fr 1fr 1fr" }}
            gap="4"
          >
            {(builds || []).map((build) => (
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
                      height="3em"
                      width={(16 / 9) * 3 + "em"}
                      display="inline-block"
                      alt={build.heroKey}
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

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = await getSSG(context);
  await ssg.fetchQuery("build.list");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default Builds;
