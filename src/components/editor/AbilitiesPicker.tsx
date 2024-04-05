import { Center, HStack, IconButton, Img, VStack } from "@chakra-ui/react";
import { trpc } from "../../utils/trpc";
import BuildAbility from "../build/BuildAbility";
import { AbilitySkillState, useBuildEditorStore } from "./buildEditorStore";
import { PropsWithChildren } from "react";
import icons from "../static/icons";
import { MdAdd } from "react-icons/md";

const getIcon = ({
  state,
  index,
}: {
  state: AbilitySkillState;
  index: number;
}) => {
  const mapping: Record<AbilitySkillState, React.ReactNode> = {
    YES: <AbilitySquare yellow>{index + 1}</AbilitySquare>,
    NO: <AbilitySquare />,
    SCEPTER:
      index == 0 ? (
        <Img
          src={icons.aghanims_scepter}
          height={["2em", "2em", "2em", "2.5em"]}
        />
      ) : undefined,
    SHARD:
      index == 0 ? (
        <Img
          src={icons.aghanims_shard}
          height={["2em", "2em", "2em", "2.5em"]}
        />
      ) : undefined,
    DEFAULT: <AbilitySquare />,
  };
  return mapping[state];
};

const AbilitiesPicker: React.FC = () => {
  const { heroKey, skills } = useBuildEditorStore((store) => store.build);
  const getAbilitySkillState = useBuildEditorStore(
    (store) => store.getAbilitySkillState
  );
  const canBeSkilled = useBuildEditorStore((store) => store.canBeSkilled);
  const skillAbility = useBuildEditorStore((store) => store.skillAbility);
  const { data: heroData } = trpc.dota.getHero.useQuery(
    { name: heroKey },
    { enabled: !!heroKey }
  );
  if (!heroData) return null;

  return (
    <VStack alignItems="start">
      {heroData.abilities?.map((abilityItem, index) => {
        const ability = abilityItem?.ability;
        if (ability?.name === "generic_hidden") return null;
        if (index > 5) return null;
        if (!ability) return null;
        console.log(ability);

        return (
          <HStack key={ability.name}>
            <BuildAbility
              key={index}
              ability={ability.name}
              abilityData={ability!}
            />

            <HStack>
              {[...skills, "skill"].map(
                (abilityName: string, index: number) => {
                  const state = getAbilitySkillState(abilityItem, index);
                  if (abilityName === "skill")
                    if (canBeSkilled(abilityItem, index))
                      return (
                        <IconButton
                          key={index}
                          aria-label="Add Skill"
                          icon={<MdAdd />}
                          onClick={() => {
                            skillAbility(abilityItem, index);
                          }}
                        />
                      );
                    else if (state == "NO") return null;

                  return getIcon({ state, index });
                }
              )}
            </HStack>
          </HStack>
        );
      })}
    </VStack>
  );
};

interface AbilitySquareProps extends PropsWithChildren {
  yellow?: boolean;
}

const AbilitySquare: React.FC<AbilitySquareProps> = ({ yellow, children }) => {
  return (
    <Center
      userSelect="none"
      bg={yellow ? "yellow.600" : "gray.800"}
      p={1}
      boxSize={["2em", "2em", "2em", "2.5em"]}
      textAlign="center"
      fontSize="sm"
      fontWeight="bold"
      color="black"
    >
      {children}
    </Center>
  );
};

export default AbilitiesPicker;
