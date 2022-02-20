import { Box, Flex, Heading, HStack, Img, VStack } from "@chakra-ui/react";
import Link from "next/link";

export interface LatestBuildsProps {
  builds: {
    name: string;
    heroKey: string;
    version: string;
    slug: string;
    heroName: string;
    shortDescription: string;
  }[];
}

const LatestBuilds: React.FC<LatestBuildsProps> = ({ builds }) => {
  return (
    <Flex alignItems="baseline">
      <VStack
        spacing={4}
        padding="4"
        borderRadius="md"
        backgroundColor="gray.700"
        width="100%"
        alignItems="start"
      >
        <Heading size="lg" fontWeight="semibold" color="white" marginBottom="4">
          Latest builds
        </Heading>
        {builds.map((build) => (
          <Link key={build.slug} href={`/builds/${build.slug}`} passHref>
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
        ))}
      </VStack>
    </Flex>
  );
};

export default LatestBuilds;
