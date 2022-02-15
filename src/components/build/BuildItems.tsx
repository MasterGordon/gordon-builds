import { Heading, HStack, Img, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { Build } from "../../builds/Build";

interface Props {
  items: Build["items"];
}

const BuildItems: React.FC<Props> = (props) => {
  const { items } = props;

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
              <WrapItem
                as={Img}
                src={`http://cdn.dota2.com/apps/dota2/images/items/${item.key.replace(
                  "item_",
                  ""
                )}_lg.png`}
                alt={item.key}
                key={index}
                height={["2em", "2.5em", "3em"]}
              />
            ))}
          </Wrap>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default BuildItems;
