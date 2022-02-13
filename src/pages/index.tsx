import { Box, Center, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Background from "../images/midlane-background.png";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <Box height="100vh">
      <Center height="100%">
        <Box
          as={Center}
          width="100%"
          flexDirection="column"
          background="rgba(0,0,0,0.5)"
          paddingY="2"
          zIndex="1"
          color="gray.50"
        >
          <Heading as="h1" size="3xl">
            Gordon Builds
          </Heading>
          <Text marginTop="1" fontSize="xl">
            Best builds only no dogshit
          </Text>
          <Text marginTop="1" fontSize="xl">
            Coming soon!
          </Text>
        </Box>
        <Image
          draggable={false}
          placeholder="blur"
          src={Background}
          layout="fill"
          objectFit="cover"
          alt=""
        />
      </Center>
    </Box>
  );
};

export default Home;
