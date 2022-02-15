import { Heading, HStack, Img, VStack } from "@chakra-ui/react";

interface Props {
  heroKey: string;
  name: string;
  version: string;
  heroName: string;
}

const BuildHeader: React.FC<Props> = (props) => {
  const { heroKey, heroName, name, version } = props;

  return (
    <HStack spacing="1">
      <Img
        src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroKey.replace(
          "npc_dota_hero_",
          ""
        )}.png`}
        display="inline-block"
        alt={heroKey}
        height="5em"
        mr={4}
      />
      <VStack alignItems="start" spacing="1">
        <Heading as="h1" display="inline-flex">
          {name}
        </Heading>
        <Heading as="h2" display="inline-flex" size="sm">
          {heroName} {version}
        </Heading>
      </VStack>
    </HStack>
  );
};

export default BuildHeader;
