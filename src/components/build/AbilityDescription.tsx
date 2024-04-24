import {
  Box,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import Image from "next/legacy/image";
import cooldown from "../../images/cooldown.png";
import { Ability } from "../../server/routers/dota";
import { Behavior, TargetTeam } from "../../provider/dota";
import constants from "../../__generated__/data/constants.json";

interface Props {
  ability: Ability["ability"];
}

const getAffects = (ability: Ability["ability"]) => {
  const team = ability.stat.unitTargetTeam;
  const type = ability.stat.unitTargetType;
  if (!team && !type) return undefined;
  if (team == 4 && type == 128) return undefined;
  let prefix = "";
  if (team == TargetTeam.ENEMY) prefix = !type ? "Enemies" : "Enemy";
  else if (team == TargetTeam.ALLY) prefix = !type ? "Allies" : "Allied";

  if (type == 64 || type == 192) return "Trees";
  if (type == 83) return "Trees and " + prefix + " Units";
  if (type == 4) return team == TargetTeam.ALLY ? "Allies" : "Enemies";
  if (type == 1) return prefix + " Heroes";
  if (type == 19) return prefix + " Units";
  if (type == 23) return prefix + " Units and Buildings";
  return "Units";
};

const damageType = {
  [1]: {
    value: "Physical",
    color: "dmgPhysical",
  },
  [2]: {
    value: "Magical",
    color: "dmgMagical",
  },
  [4]: {
    value: "Pure",
    color: "dmgPure",
  },
};

interface KVProps {
  label: string;
  value: string;
  color?: string;
}

const KV: React.FC<KVProps> = (props) => {
  const { label, value, color } = props;
  return (
    <Box color="gray.500" lineHeight="125%">
      <chakra.span wordBreak="keep-all" fontWeight="semibold" marginRight={1}>
        {label.toUpperCase()}
      </chakra.span>
      <chakra.span color={color}>{value}</chakra.span>
    </Box>
  );
};

if (process.env.NODE_ENV === "development") {
  // @ts-expect-error NOTE: ONLY FOR DEBUG
  global.c = constants;
}

const hasBehavior = (behavior: number, flag: number) =>
  (behavior & flag) === flag;

const kindByBehavior = (behavior: number) => {
  if (hasBehavior(behavior, Behavior.PASSIVE)) return "Passive";
  if (hasBehavior(behavior, Behavior.NO_TARGET)) return "No Target";
  if (hasBehavior(behavior, Behavior.UNIT_TARGET)) return "Unit Target";
  if (hasBehavior(behavior, Behavior.POINT_TARGET)) return "Point Target";
  return undefined;
};

const AbilityDescription: React.FC<Props> = ({ ability }) => {
  const affects = getAffects(ability);
  const kind = kindByBehavior(ability.stat.behavior);

  return (
    <Box>
      <Heading
        size="md"
        color="white"
        backgroundColor="gray.700"
        padding="3"
        borderTopRadius="sm"
      >
        {ability.language.displayName}
      </Heading>
      <VStack
        backgroundColor="gray.800"
        alignItems="stretch"
        padding="3"
        borderBottomRadius="sm"
      >
        <Box>
          {kind && <KV label="Ability:" value={kind} />}
          {affects && <KV label="Affects:" value={affects} />}
          {ability.stat.unitDamageType ? (
            <KV
              label="Damage Type:"
              {...damageType[ability.stat.unitDamageType as 1 | 2 | 4]}
            />
          ) : undefined}
          {ability.stat.spellImmunity ? (
            <KV
              label="Pierces Debuff Immunity:"
              value={ability.stat.spellImmunity % 2 ? "Yes" : "No"}
              color={
                ability.stat.spellImmunity % 2 ? "spellPierces" : undefined
              }
            />
          ) : undefined}
          {ability.stat.dispellable != "NONE" ? (
            <KV
              label="Dispellable:"
              value={ability.stat.dispellable}
              color={
                ability.stat.dispellable != "YES" ? "disspellRed" : undefined
              }
            />
          ) : undefined}
        </Box>
        <Divider />
        <Flex
          color="gray.300"
          textShadow="1px 1px black"
          fontWeight="semibold"
          marginBottom={2}
        >
          {ability.language.description}
        </Flex>
        <Box />
        {ability.language.notes && ability.language.notes?.length > 0 && (
          <>
            <Box backgroundColor="gray.700" padding="2">
              {ability.language.notes.map((note, index) => (
                <Box color="gray.400" fontWeight="semibold" key={note + index}>
                  {note}
                </Box>
              ))}
            </Box>
            <Box />
          </>
        )}
        {ability.language.attributes && (
          <Box>
            {ability.language.attributes.map((attr) => {
              const [name, value] = attr.split(": ");
              return (
                value && (
                  <KV
                    label={name}
                    value={Array.isArray(value) ? value?.join(" / ") : value}
                    color="gray.500"
                    key={name}
                  />
                )
              );
            })}
          </Box>
        )}
        {(ability.stat.manaCost || ability.stat.cooldown) && (
          <HStack spacing="3" color="gray.500" alignItems="center">
            {ability.stat.cooldown && (
              <Flex alignItems="center">
                <chakra.span
                  boxSize="1.2em"
                  position="relative"
                  marginRight="0.5em"
                >
                  <Image src={cooldown} alt="gold" layout="fill" />
                </chakra.span>
                {ability.stat.cooldown.map(Math.round).join(" / ")}
              </Flex>
            )}
            {ability.stat.manaCost && (
              <Flex alignItems="center">
                <chakra.span
                  boxSize="1.2em"
                  borderRadius="sm"
                  position="relative"
                  marginRight="0.5em"
                  backgroundColor="manacostBlue"
                />
                {ability.stat.manaCost.join(" / ")}
              </Flex>
            )}
          </HStack>
        )}
        {ability.language.lore && (
          <>
            <Box />
            <Box
              backgroundColor="gray.900"
              textShadow="1px 1px black"
              padding="2"
              fontSize="xs"
              fontStyle="italic"
              color="gray.400"
              marginTop="8"
            >
              {ability.language.lore}
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default AbilityDescription;
