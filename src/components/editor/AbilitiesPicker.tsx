import {
  Button,
  Center,
  HStack,
  IconButton,
  Img,
  VStack,
  keyframes,
} from "@chakra-ui/react";
import { trpc } from "../../utils/trpc";
import BuildAbility from "../build/BuildAbility";
import {
  AbilitySkillState,
  EditorSkillable,
  useBuildEditorStore,
} from "./buildEditorStore";
import { PropsWithChildren } from "react";
import icons from "../static/icons";
import { MdAdd } from "react-icons/md";
import { Behavior } from "../../provider/dota";
import Tooltip from "../Tooltip";

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
    DEFAULT: index == 0 ? <AbilitySquare yellow /> : undefined,
  };
  return mapping[state];
};

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.3);
  }
`;

const AbilitiesPicker: React.FC = () => {
  const { heroKey, skills } = useBuildEditorStore((store) => store.build);
  const getAbilitySkillState = useBuildEditorStore(
    (store) => store.getAbilitySkillState
  );
  const canBeSkilled = useBuildEditorStore((store) => store.canBeSkilled);
  const skillAbility = useBuildEditorStore((store) => store.skillAbility);
  const undo = useBuildEditorStore((store) => store.undoAbility);
  const reset = useBuildEditorStore((store) => store.resetAbilities);
  const { data: heroData } = trpc.dota.getHero.useQuery(
    { name: heroKey },
    { enabled: !!heroKey }
  );
  if (!heroData) return null;
  const editorSkills: EditorSkillable[] = [
    ...heroData.abilities,
    "talents",
    "stats",
  ];

  return (
    <VStack alignItems="start">
      <HStack>
        <Button onClick={reset}>Reset</Button>
        <Button onClick={undo}>Undo</Button>
      </HStack>
      {editorSkills.map((abilityItem, index) => {
        const ability =
          typeof abilityItem == "string" ? abilityItem : abilityItem?.ability;
        if (
          typeof ability == "object" &&
          ability.stat.behavior & Behavior.HIDDEN &&
          !(ability.stat.isGrantedByScepter || ability.stat.isGrantedByShard)
        ) {
          return null;
        }
        if (!ability) return null;

        return (
          <HStack key={typeof ability === "string" ? ability : ability.name}>
            {typeof ability === "string" ? (
              ability === "talents" ? (
                <TalentIcon />
              ) : (
                <StatsIcon />
              )
            ) : (
              <BuildAbility
                key={index}
                ability={ability.name}
                abilityData={ability!}
              />
            )}

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
                          animation={`${glowAnimation} 2s infinite`}
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

const TalentIcon: React.FC = () => {
  return (
    <Tooltip header={"Talent"} placement="right">
      <Img src={icons.talents} width={[10, 16]} />
    </Tooltip>
  );
};

const StatsIcon: React.FC = () => {
  return (
    <Tooltip header="Stats" placement="right">
      <Img src={icons.universal} width={[10, 16]} />
    </Tooltip>
  );
};

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
