import { Box, Center, Grid, HStack, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { trpc } from "../../utils/trpc";
import BuildAbility from "../build/BuildAbility";
import { useBuildEditorStore } from "./buildEditorStore";

const AbilitiesPicker: React.FC = () => {
  const { data: heroesData } = trpc.useQuery(["dota.heroes"]);
  const { data: abilitiesData } = trpc.useQuery(["dota.abilities"]);
  const { heroKey, skills } = useBuildEditorStore((store) => store.build);
  const heroData = useMemo(() => {
    if (!heroesData) return undefined;
    return heroesData.find((hero) => hero.key === heroKey);
  }, [heroKey, heroesData]);
  const abilityData = useMemo(() => {
    if (!abilitiesData) return undefined;
    return heroData?.abilities?.map((ability) =>
      abilitiesData.find((a) => a.key === ability)
    );
  }, [abilitiesData, heroData?.abilities]);
  console.log(heroData);
  console.log(abilityData);

  return (
    <VStack alignItems="start">
      {abilityData?.map((ability, index) => {
        if (ability!.key === "generic_hidden") return null;
        if (index > 5) return null;
        console.log(index);
        console.log(skills[index]);
        return (
          <HStack key={ability!.key}>
            <BuildAbility
              key={index}
              ability={ability!.key}
              abilityData={ability!}
            />

            <HStack>
              {skills[index].split("").map((letter: string, index: number) => {
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
        );
      })}
    </VStack>
  );
};

export default AbilitiesPicker;
