import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import { useBuildEditorStore } from "./buildEditorStore";
import HeroIcon from "../HeroIcon";

function fuzzyMatch(pattern: string, str: string) {
  str = str.toLowerCase();
  pattern = pattern.toLowerCase();
  pattern = ".*" + pattern.split("").join(".*") + ".*";
  const re = new RegExp(pattern);
  return re.test(str);
}

const HeroPicker: React.FC = () => {
  const { data: heroes } = trpc.dota.getHeroes.useQuery({ slim: true });
  const heroKey = useBuildEditorStore((store) => store.build.heroKey);
  const setHeroKey = useBuildEditorStore((store) => store.setHeroKey);
  const hero = useMemo(
    () => heroes?.find((h) => h.name === heroKey),
    [heroes, heroKey]
  );
  const [heroInput, setHeroInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Popover initialFocusRef={ref}>
      <PopoverTrigger>
        <Button as={HStack} height="auto" variant="ghost" padding="0">
          <HeroIcon
            heroName={hero?.name}
            alt={hero?.displayName}
            size="lg"
            mr={4}
          />
          {hero?.displayName || "Select Hero"}
        </Button>
      </PopoverTrigger>
      <PopoverContent background="gray.900">
        <PopoverArrow background="var(--chakra-colors-gray-900) !important" />
        <PopoverCloseButton />
        <PopoverHeader>Hero Picker</PopoverHeader>
        <PopoverBody>
          <FormControl marginBottom="4">
            <FormLabel display="none">Hero</FormLabel>
            <InputGroup size="md">
              <Input
                value={heroInput}
                ref={ref}
                onChange={(e) => setHeroInput(e.target.value)}
              />
              <InputRightElement width="4">
                <IconButton
                  display={heroInput.length > 0 ? "inline-block" : "none"}
                  aria-label="Clear Hero Input"
                  tabIndex={-1}
                  onClick={(e) => {
                    setHeroInput("");
                    setHeroKey("");
                    ref.current?.focus();
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  size="sm"
                  variant="ghost"
                  marginRight="6"
                >
                  <Icon as={MdClose} />
                </IconButton>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <VStack
            spacing="4"
            alignItems="start"
            maxHeight="400px"
            overflowY="auto"
          >
            {heroes
              ?.filter((h) => fuzzyMatch(heroInput, h.displayName))
              .map((h) => (
                <Button
                  key={h.name}
                  onClick={() => {
                    setHeroInput(h.displayName);
                    setHeroKey(h.name);
                  }}
                  variant="ghost"
                  height="auto"
                  padding="0"
                  width="100%"
                  justifyContent="start"
                  borderRadius="0"
                  _focus={{
                    background: "var(--chakra-colors-whiteAlpha-300)",
                  }}
                >
                  <HeroIcon
                    heroName={h.name}
                    alt={h.displayName}
                    size="md"
                    mr={4}
                  />
                  {h.displayName}
                </Button>
              ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default HeroPicker;
