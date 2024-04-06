import { Flex } from "@chakra-ui/react";

const BuildPreview: React.FC = () => {
  return (
    <Flex
      height="250px"
      width="400px"
      borderRadius="6px"
      boxShadow="0px 0px 20px 1px black"
      background="linear-gradient(0deg, #252424 0%,  #333 100%)"
    ></Flex>
  );
};

export default BuildPreview;
