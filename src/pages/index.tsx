import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  LinkOverlay,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Background from "../images/midlane-background.png";
import Image from "next/legacy/image";
import Head from "next/head";
import { MdKeyboardArrowRight } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";
import { RefObject, useRef } from "react";

const Home: NextPage = () => {
  const scrollRef = useRef<HTMLButtonElement>(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Head>
        <title>Most Fun Dota 2 Builds - Gordon Builds</title>
        <meta
          name="description"
          content="Most fun Dota 2 builds with focus on fun, but also on winning!"
        />
      </Head>

      <Grid templateColumns="1fr 1fr" gap="0">
        <Flex
          as={GridItem}
          colSpan={{ base: 2, md: 1 }}
          bgGradient="linear-gradient(0deg, bgBlue 0%,  bgGreen 80%)"
          boxShadow=" 4px -20px 16px -2px black"
          alignItems="center"
          zIndex="10"
          height="100vh"
          position="relative"
        >
          <VStack
            color="white"
            height="100%"
            margin={{ base: "60% 16px 0 16px", md: "50% 64px 0 40px" }}
            gap="32px"
          >
            <Heading
              as="h1"
              variant="main"
              alignSelf="baseline"
              padding="0 16px 24px 0"
              fontSize={{ base: "2.5em", sm: "3em", lg: "3.5em" }}
              whiteSpace="nowrap"
              fontWeight="bold"
              borderBottom="2px solid white"
            >
              Ancient Camp
            </Heading>
            <Text fontSize={{ base: "1.2em", sm: "1.4em", lg: "1.5em" }}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            </Text>
            <HStack gap="24px" flexWrap="wrap" alignSelf="start">
              <Button
                variant="cta"
                size={{ base: "md", md: "lg" }}
                rightIcon={<Icon as={MdKeyboardArrowRight} boxSize="28px" />}
              >
                Browse all Builds
              </Button>
              <Button
                variant="outline"
                size={{ base: "md", md: "lg" }}
                rightIcon={<Icon as={MdKeyboardArrowRight} boxSize="28px" />}
              >
                Create Build
              </Button>
            </HStack>
          </VStack>
          {isMobile && (
            <PopularBuildsButton scrollTargetRef={scrollRef} buttonSize="md" />
          )}
        </Flex>
        {!isMobile && (
          <Flex height="100%" alignItems="center" position="relative">
            <Box
              width="100%"
              height="100%"
              bgGradient="linear-gradient(0deg, bgBlue 5%,  transparent 30%)"
              zIndex="20"
            />
            <Image
              draggable={false}
              placeholder="blur"
              src={Background}
              layout="fill"
              objectFit="cover"
              alt="background-image"
            />
            <PopularBuildsButton scrollTargetRef={scrollRef} buttonSize="xl" />
          </Flex>
        )}
        <Flex
          ref={scrollRef}
          as={GridItem}
          colSpan={2}
          backgroundColor="rgb(0 10 39)"
          height="100vh"
          padding="48px"
        >
          {/* <Grid templateColumns="repeat(4, 1fr)" gap="32px" width="100%">
            <BuildPreview />
            <BuildPreview />
            <BuildPreview />
            <BuildPreview />
          </Grid> */}
        </Flex>
      </Grid>
    </>
  );
};

const PopularBuildsButton: React.FC<{
  buttonSize: "md" | "xl";
  scrollTargetRef: RefObject<HTMLButtonElement>;
}> = ({ buttonSize, scrollTargetRef }) => {
  return (
    <Flex
      position="absolute"
      right="0"
      left="0"
      top="0"
      bottom="0"
      alignItems="end"
      justifyContent="center"
      marginBottom="60px"
      zIndex="20"
    >
      <VStack
        gap="8px"
        _hover={{
          svg: { top: "10px" },
          a: { backgroundColor: "#045a69", color: "#fff" },
        }}
        onClick={() =>
          scrollTargetRef?.current
            ? scrollTargetRef.current.scrollIntoView({ behavior: "smooth" })
            : undefined
        }
      >
        <Button as={LinkOverlay} variant="invert" size={buttonSize}>
          View Popular Builds
        </Button>
        <Icon
          as={SlArrowDown}
          boxSize="50px"
          fill="white"
          position="relative"
          top="0"
          transition="top ease 0.5s"
        />
      </VStack>
    </Flex>
  );
};

// @ts-expect-error - Property 'isHeaderSolid' does not exist on type 'typeof Home'.
Home.isHeaderSolid = false;

export default Home;
