import { Box, Center, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Background from "../images/midlane-background.png";
import Image from "next/image";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Most Fun Dota 2 Builds - Gordon Builds</title>
        <meta
          name="description"
          content="Most fun Dota 2 builds with focus on fun, but also on winning!"
        />
      </Head>
      <Box height="calc(100vh - 75px)">
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
              Best builds only, no dogshit!
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
    </>
  );
};

export default Home;
