import {
  Heading,
  HStack,
  Img,
  Tooltip,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Build } from "../../builds/Build";
import { Item } from "../../provider/ItemData";
import ItemDescription from "./ItemDescription";

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
            {items[category].map((item, index) => (
              <Tooltip
                padding="0"
                backgroundColor="rgba(0, 0, 0, 1)"
                borderRadius="md"
                key={index}
                label={<ItemDescription item={itemData[item.key]} />}
                boxShadow="2px 2px 10px 12px rgba(0,0,0,0.75)"
                isOpen={index === 0 || undefined}
              >
                <WrapItem
                  as={Img}
                  src={`http://cdn.dota2.com/apps/dota2/images/items/${item.key.replace(
                    "item_",
                    ""
                  )}_lg.png`}
                  alt={item.key}
                  height={["2em", "2.5em", "3em"]}
                />
              </Tooltip>
            ))}
          </Wrap>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default BuildItems;
