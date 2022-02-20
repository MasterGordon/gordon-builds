import { Heading, HStack, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { Build } from "../../builds/Build";
import { Item } from "../../provider/ItemData";
import BuildItem from "./BuildItem";

interface Props {
  items: Build["items"];
  itemData: { [key: string]: Item };
}

const BuildItems: React.FC<Props> = (props) => {
  const { items, itemData } = props;

  return (
    <Wrap>
      {Object.keys(items).map((category) => (
        <WrapItem
          as={VStack}
          alignItems="start"
          key={category}
          padding="2"
          borderRadius="md"
          backgroundColor="gray.800"
        >
          <Heading as="h3" size="md">
            {category}
          </Heading>
          <Wrap as={HStack} spacing="2">
            {items[category].map((item, index) => {
              return (
                <BuildItem
                  key={item.key + index}
                  item={item}
                  itemData={itemData}
                />
              );
            })}
          </Wrap>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default BuildItems;
