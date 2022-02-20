import {
  Box,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import cooldown from "../../images/cooldown.png";
import { Ability } from "../../provider/AbilityData";
import { formatArray } from "../../utils/formatArray";

interface Props {
  ability: Ability;
}

const getAffects = (ability: Ability) => {
  if (!ability.unit_targets) {
    if (ability.team_target == "enemy") return "Enemies";
    else return "Allies";
  } else {
    if (ability.team_target == "both") {
      if (ability.unit_targets.length == 1 && ability.unit_targets[0] == "hero")
        return "Heroes";
      else return "Units";
    }
    const prefix = ability.team_target == "enemy" ? "Enemy" : "Allied";
    if (ability.unit_targets.length == 1 && ability.unit_targets[0] == "hero")
      return `${prefix} Heroes`;
    else if (ability.unit_targets.length == 3)
      return `${prefix} Units and Buildings`;
    else return `${prefix} Units`;
  }
};

const damageType = {
  physical: {
    value: "Physical",
    color: "dmgPhysical",
  },
  magical: {
    value: "Magical",
    color: "dmgMagical",
  },
  pure: {
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
    <HStack spacing={1} color="gray.500" lineHeight="90%">
      <chakra.span wordBreak="keep-all" fontWeight="semibold">
        {label.toUpperCase()}
      </chakra.span>
      <chakra.span color={color}>{value}</chakra.span>
    </HStack>
  );
};

const AbilityDescription: React.FC<Props> = ({ ability }) => {
  return (
    <Box>
      <Heading
        size="md"
        color="white"
        backgroundColor="gray.700"
        padding="3"
        borderTopRadius="sm"
      >
        {ability.name}
      </Heading>
      <VStack
        backgroundColor="gray.800"
        alignItems="stretch"
        padding="3"
        borderBottomRadius="sm"
      >
        <KV label="Ability:" value={ability.kind} />
        {ability.team_target && (
          <KV label="Affects:" value={getAffects(ability)} />
        )}
        {ability.damage_type && (
          <KV label="Damage Type:" {...damageType[ability.damage_type]} />
        )}
        {typeof ability.pierces_spell_immunity !== "undefined" && (
          <KV
            label="Pierces Spell Immunity:"
            value={ability.pierces_spell_immunity ? "Yes" : "No"}
            color={ability.pierces_spell_immunity ? "spellPierces" : undefined}
          />
        )}
        {ability.spell_dispellable_type && (
          <KV
            label="Dispellable:"
            value={ability.spell_dispellable_type}
            color={
              ability.spell_dispellable_type != "Yes"
                ? "disspellRed"
                : undefined
            }
          />
        )}
        <Divider />
        <Flex
          color="gray.300"
          textShadow="1px 1px black"
          fontWeight="semibold"
          marginBottom={2}
        >
          {ability.description}
        </Flex>
        <Box />
        {ability.notes && ability.notes?.length > 0 && (
          <>
            <Box backgroundColor="gray.700" padding="2">
              {ability.notes.map((note, index) => (
                <Box color="gray.400" fontWeight="semibold" key={note + index}>
                  {note}
                </Box>
              ))}
            </Box>
            <Box />
          </>
        )}
        {ability.custom_attributes &&
          ability.custom_attributes.map((attr) => {
            const value = formatArray(attr.value);
            return (
              attr.value && (
                <KV
                  label={attr.header}
                  value={Array.isArray(value) ? value?.join(" / ") : value}
                  color="gray.500"
                  key={attr.key}
                />
              )
            );
          })}
        {(ability.mana_cost || ability.cooldown) && (
          <HStack spacing="3" color="gray.500" alignItems="center">
            {ability.cooldown && (
              <Flex alignItems="center">
                <chakra.span
                  boxSize="1.2em"
                  position="relative"
                  marginRight="0.5em"
                >
                  <Image src={cooldown} alt="gold" layout="fill" />
                </chakra.span>
                {ability.cooldown.join(" / ")}
              </Flex>
            )}
            {ability.mana_cost && (
              <Flex alignItems="center">
                <chakra.span
                  boxSize="1.2em"
                  borderRadius="sm"
                  position="relative"
                  marginRight="0.5em"
                  backgroundColor="manacostBlue"
                />
                {ability.mana_cost.join(" / ")}
              </Flex>
            )}
          </HStack>
        )}
        {ability.lore && (
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
              {ability.lore}
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default AbilityDescription;
