import { chakra, Link, VStack } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <VStack marginTop="8" marginBottom="2" position="relative" color="white">
      <p>
        Made with{" "}
        <span role="img" aria-label="heart">
          ❤️
        </span>{" "}
        by <Link href="https://github.com/MasterGordon">MasterGordon</Link>
      </p>
      <chakra.p textAlign="center">
        Dota 2 is a registered trademark of Valve Corporation. All game images
        and names are property of Valve Corporation. This app is not affiliated
        with Valve Corporation.
      </chakra.p>
    </VStack>
  );
};

export default Footer;
