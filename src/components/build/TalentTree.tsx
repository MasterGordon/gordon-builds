import { Center, Flex, Grid, Heading, VStack } from "@chakra-ui/react";
import { glowAnimation } from "../editor/AbilitiesPicker";

interface Props {
  talents: [boolean[], boolean[]];
  talentNames: string[];
  onChange?: (index: number, choise: "left" | "right") => void;
}

interface TreeRowProps {
  left?: string;
  right?: string;
  level: number;
  index: number;
  hightlightLeft?: boolean;
  hightlightRight?: boolean;
  onChange?: (index: number, choise: "left" | "right") => void;
}

const TreeRow: React.FC<TreeRowProps> = (props) => {
  const {
    left,
    right,
    level,
    hightlightLeft,
    hightlightRight,
    index,
    onChange,
  } = props;
  return (
    <>
      <Flex
        padding="2"
        backgroundColor={hightlightLeft ? "yellow.600" : undefined}
        color={hightlightLeft ? "white" : "gray.400"}
        textShadow="1px 1px black"
        borderRadius="sm"
        justifyContent="center"
        as={onChange ? "button" : undefined}
        onClick={() => onChange?.(index, "left")}
        animation={
          !hightlightLeft && !hightlightRight && onChange
            ? `${glowAnimation} 2s infinite`
            : undefined
        }
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
        as={onChange ? "button" : undefined}
        onClick={() => onChange?.(index, "right")}
        animation={
          !hightlightLeft && !hightlightRight && onChange
            ? `${glowAnimation} 2s infinite`
            : undefined
        }
      >
        {right}
      </Flex>
    </>
  );
};

const TalentTree: React.FC<Props> = (props) => {
  const { talents, talentNames, onChange } = props;
  const leftTalents = talentNames
    .map((talent, index) => (index % 2 === 0 ? talent : undefined))
    .filter(Boolean);
  const rightTalents = talentNames
    .map((talent, index) => (index % 2 === 1 ? talent : undefined))
    .filter(Boolean);
  const selectedLeft = [...talents[0]].reverse();
  const selectedRight = [...talents[1]].reverse();

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
            index={3 - index}
            hightlightLeft={selectedLeft[index]}
            hightlightRight={selectedRight[index]}
            onChange={onChange}
          />
        ))}
      </Grid>
    </VStack>
  );
};

export default TalentTree;
