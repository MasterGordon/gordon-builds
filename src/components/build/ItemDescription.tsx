import {
  Box,
  chakra,
  Flex,
  Heading,
  HStack,
  Img,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { Item } from "../../provider/ItemData";
import Image from "next/image";
import gold from "../../images/gold.png";
import cooldown from "../../images/cooldown.png";

interface Props {
  description?: string;
  item: Item;
}

const ItemDescription: React.FC<Props> = ({ description, item }) => {
  return (
    <Box>
      <HStack
        spacing="1"
        backgroundColor="gray.700"
        padding="2"
        borderTopRadius="sm"
      >
        <Img
          src={`https://cdn.dota2.com/apps/dota2/images/items/${item.key.replace(
            "item_",
            ""
          )}_lg.png`}
          display="inline-block"
          alt={item.name}
          height={["2em", "2.5em", "3em"]}
          boxShadow="dark-lg"
          mr={2}
        />
        <VStack alignItems="start" spacing="1">
          <Heading as="h1" display="inline-flex" size="sm" color="white">
            {item.name}
          </Heading>
          <Heading
            as="h2"
            display="inline-flex"
            size="sm"
            alignItems="center"
            color="yellow.300"
          >
            <chakra.span boxSize="1em" position="relative" marginRight="0.2em">
              <Image src={gold} alt="gold" layout="fill" />
            </chakra.span>
            {item.cost}
          </Heading>
        </VStack>
      </HStack>
      <VStack
        backgroundColor="gray.800"
        alignItems="stretch"
        padding="2"
        borderBottomRadius="sm"
      >
        {item.custom_attributes && (
          <Box>
            {item.custom_attributes.map((attr, index) => (
              <HStack
                key={attr.key + index}
                alignItems="start"
                textShadow="1px 1px black"
                spacing="1"
              >
                {attr.prefix && (
                  <chakra.span fontSize="sm" color="gray.500" marginRight="0.5">
                    {attr.prefix}
                  </chakra.span>
                )}
                <chakra.span fontSize="sm" color="white" fontWeight="black">
                  {attr.value}
                </chakra.span>
                <chakra.span
                  fontSize="sm"
                  color="gray.500"
                  fontWeight="semibold"
                >
                  {attr.header}
                </chakra.span>
              </HStack>
            ))}
          </Box>
        )}
        {item.description &&
          item.description.map((description) =>
            description.type === "passive" ? (
              <Box
                backgroundColor="gray.700"
                textShadow="1px 1px black"
                key={description.header}
                padding="2"
              >
                <Box color="white" fontWeight="bold" key={description.header}>
                  Passive: {description.header}
                </Box>
                <Box color="gray.400">{description.body}</Box>
              </Box>
            ) : description.type == "hint" ? (
              <Box
                backgroundColor="gray.700"
                textShadow="1px 1px black"
                key={description.header}
                padding="2"
                color="gray.400"
              >
                {description.body}
              </Box>
            ) : (
              <Box
                backgroundColor="activeBlue"
                textShadow="1px 1px black"
                key={description.header}
                padding="2"
              >
                <Flex
                  color="white"
                  fontWeight="bold"
                  key={description.header}
                  alignItems="center"
                >
                  Active: {description.header}
                  <Spacer />
                  {typeof item.mana_cost !== "undefined" && (
                    <>
                      <chakra.span
                        boxSize="1.2em"
                        borderRadius="sm"
                        position="relative"
                        marginRight="0.2em"
                        backgroundColor="manacostBlue"
                      />
                      {item.mana_cost}
                    </>
                  )}
                  {typeof item.cooldown !== "undefined" && (
                    <>
                      <chakra.span
                        boxSize="1.2em"
                        position="relative"
                        marginRight="0.2em"
                        marginLeft="1em"
                      >
                        <Image src={cooldown} alt="gold" layout="fill" />
                      </chakra.span>
                      {item.cooldown}
                    </>
                  )}
                </Flex>
                {description.body?.map((body, index) => (
                  <Box color="gray.400" key={index}>
                    {body}
                  </Box>
                ))}
              </Box>
            )
          )}
        {item.notes && item.notes?.length > 0 && (
          <Box backgroundColor="gray.700" padding="2">
            {item.notes.map((note, index) => (
              <Box color="gray.400" fontWeight="semibold" key={note + index}>
                {note}
              </Box>
            ))}
          </Box>
        )}
        {item.lore && (
          <>
            <Box />
            <Box
              backgroundColor="gray.900"
              textShadow="1px 1px black"
              padding="2"
              fontSize="xs"
              fontStyle="italic"
              color="gray.400"
            >
              {item.lore}
            </Box>
          </>
        )}
        {description && (
          <>
            <Box />
            <Box
              backgroundColor="gray.900"
              textShadow="1px 1px black"
              padding="2"
              fontSize="sm"
              fontWeight="semibold"
              color="white"
            >
              {description}
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ItemDescription;
