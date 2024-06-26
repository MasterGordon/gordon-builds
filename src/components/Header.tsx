import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { MdMenu } from "react-icons/md";
import { useSize } from "@chakra-ui/react-use-size";

const HeadingLink: React.FC<{ href: string; label: string }> = ({
  href,
  label,
}) => {
  return (
    <Text
      as={NextLink}
      href={href}
      fontWeight="bold"
      fontSize="xl"
      paddingY="4px"
      borderY="2px solid"
      borderColor="transparent"
      whiteSpace="nowrap"
      _hover={{
        textDecoration: "none",
        borderColor: "white",
      }}
    >
      {label}
    </Text>
  );
};

const HeaderNavigation: React.FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton
        ref={btnRef}
        display={{ base: "inline-flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="Open navigation menu"
        fontSize="48px"
        color="white"
        border="none"
        icon={<Icon as={MdMenu} />}
      />
      <Flex display={{ base: "none", md: "flex" }}>{children}</Flex>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent background="bgGreen" color="white">
          <DrawerCloseButton />
          <DrawerHeader color="gray.50">Gordon Builds</DrawerHeader>
          <DrawerBody>
            <VStack alignItems="start">{children}</VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Header: React.FC<{ isSolid?: boolean }> = ({ isSolid }) => {
  const { data } = useSession();
  console.log(data);

  const [isOpaque, setIsOpaque] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 0) {
        setIsOpaque(true);
      } else {
        setIsOpaque(false);
      }
    };
    document.addEventListener("scroll", onScroll);

    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const LogInButton = () => (
    <Flex justifyContent="end">
      <Button size="lg" variant="cta">
        Log In
      </Button>
    </Flex>
  );

  const HeaderItems = () => (
    <>
      <HeadingLink href="/" label="Home" />
      <HeadingLink href="/builds" label="Builds" />
      <HeadingLink href="/builds/random" label="Random Build" />
    </>
  );

  return (
    <>
      <Box height={(isSolid ? size?.height : 0) + "px"} />
      <Grid
        ref={ref}
        padding={{ base: "16px", md: "16px 40px" }}
        templateColumns="1fr 1fr"
        zIndex="100"
        position="fixed"
        top="0"
        left="0"
        right="0"
        transition="background 0s ease-in-out"
        background={isOpaque || isSolid ? "bgGreen" : "transparent"}
        boxShadow={isOpaque || isSolid ? "0px 2px 16px -2px black" : "none"}
      >
        <HStack
          as={GridItem}
          colSpan={{ base: 2, md: 1 }}
          paddingRight={{ base: "0px", md: "40px" }}
          color="white"
          zIndex="2"
          gap="32px"
        >
          <Text fontWeight="bold" fontSize="2xl">
            ANCIENT.CAMP
          </Text>
          {isMobile && (
            <>
              <Spacer />
              <HeaderNavigation>
                <HeaderItems />
                <LogInButton />
              </HeaderNavigation>
            </>
          )}
          {!isMobile && <HeaderItems />}
        </HStack>
        {!isMobile && <LogInButton />}
      </Grid>
    </>
  );
};

export default Header;
