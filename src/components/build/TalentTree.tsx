import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";

interface Props {
  talents: [string, string];
  talentNames: string[];
}

interface TreeRowProps {
  left?: string;
  right?: string;
  level: number;
  hightlightLeft?: boolean;
  hightlightRight?: boolean;
}

const TreeRow: React.FC<TreeRowProps> = (props) => {
  const { left, right, level, hightlightLeft, hightlightRight } = props;
  return (
    <>
      <Flex
        padding="2"
        backgroundColor={hightlightLeft ? "yellow.600" : undefined}
        color={hightlightLeft ? "white" : "gray.400"}
        textShadow="1px 1px black"
        borderRadius="sm"
        justifyContent="center"
      >
        {left}
      </Flex>
      <Center
        borderRadius="100%"
        border="2px solid"
        borderColor="gray.500"
        boxSize="2.5em"
        color="yellow.400"
        fontWeight="semibold"
      >
        {level}
      </Center>
      <Flex
        padding="2"
        backgroundColor={hightlightRight ? "yellow.600" : undefined}
        color={hightlightRight ? "white" : "gray.400"}
        textShadow="1px 1px black"
        borderRadius="sm"
        justifyContent="center"
      >
        {right}
      </Flex>
    </>
  );
};

const TalentTree: React.FC<Props> = (props) => {
  const { talents } = props;
  const [_, ...talentNames] = props.talentNames;
  const leftTalents = talentNames
    .map((talent, index) => (index % 2 === 1 ? talent : undefined))
    .filter(Boolean)
    .reverse();
  const rightTalents = talentNames
    .map((talent, index) => (index % 2 === 0 ? talent : undefined))
    .filter(Boolean)
    .reverse();
  const selectedLeft = [...talents[0]].reverse().map((talent) => talent == "X");
  const selectedRight = [...talents[1]]
    .reverse()
    .map((talent) => talent == "X");

  return (
    <VStack backgroundColor="gray.800" padding="4" borderRadius="md">
      <Heading size="md" textAlign="center">
        Talent Tree
      </Heading>
      <Grid gap="2" templateColumns="1fr 2.5em 1fr">
        {[25, 20, 15, 10].map((level, index) => (
          <TreeRow
            key={level}
            left={leftTalents[index]}
            right={rightTalents[index]}
            level={level}
            hightlightLeft={selectedLeft[index]}
            hightlightRight={selectedRight[index]}
          />
        ))}
      </Grid>
    </VStack>
  );
};

export default TalentTree;
