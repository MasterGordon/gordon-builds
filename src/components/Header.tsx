import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Spacer,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";
import NextLink from "next/link";
import { useRef } from "react";

interface HeaderLinkProps {
  href: string;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ href, children }) => {
  return (
    <NextLink href={href} passHref>
      <Heading
        padding="6"
        size="md"
        as={Link}
        _hover={{
          backgroundColor: { md: "red.800" },
        }}
      >
        {children}
      </Heading>
    </NextLink>
  );
};

const HeaderNavigation: React.FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton
        ref={btnRef}
        display={{ base: "inline-flex", md: "none" }}
        onClick={onOpen}
        margin="4"
        variant="outline"
        aria-label="Open navigation menu"
        fontSize="2xl"
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
        <DrawerContent>
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

const Header: React.FC = () => {
  return (
    <Flex backgroundColor="red.900" zIndex="50" position="relative">
      <Heading padding="4" as="h1" color="gray.50">
        Gordon Builds
      </Heading>
      <Spacer />
      <HeaderNavigation>
        <HeaderLink href="/">Home</HeaderLink>
        <HeaderLink href="/builds">Builds</HeaderLink>
        <HeaderLink href="/builds/random">Random Build</HeaderLink>
      </HeaderNavigation>
    </Flex>
  );
};

export default Header;
