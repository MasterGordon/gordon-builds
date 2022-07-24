import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Img,
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

function fuzzyMatch(pattern: string, str: string) {
  str = str.toLowerCase();
  pattern = pattern.toLowerCase();
  pattern = ".*" + pattern.split("").join(".*") + ".*";
  const re = new RegExp(pattern);
  return re.test(str);
}

const HeroPicker: React.FC = () => {
  const { data: heroes } = trpc.useQuery(["dota.heroes"]);
  const heroKey = useBuildEditorStore((store) => store.build.heroKey);
  const setHeroKey = useBuildEditorStore((store) => store.setHeroKey);
  const hero = useMemo(
    () => heroes?.find((h) => h.key === heroKey),
    [heroes, heroKey]
  );
  const [heroInput, setHeroInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Popover initialFocusRef={ref}>
      <PopoverTrigger>
        <Button as={HStack} height="auto" variant="ghost" padding="0">
          <Img
            src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroKey.replace(
              "npc_dota_hero_",
              ""
            )}.png`}
            alt={heroKey}
            height="4em"
            width={(16 / 9) * 4 + "em"}
            mr={4}
          />
          {hero?.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent background="gray.900">
        <PopoverArrow background="var(--chakra-colors-gray-900) !important" />
        <PopoverCloseButton />
        <PopoverHeader>Hero Picker</PopoverHeader>
        <PopoverBody>
          <FormControl marginBottom="4">
            <FormLabel>Hero</FormLabel>
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
              ?.filter((h) => fuzzyMatch(heroInput, h.name))
              .map((h) => (
                <Button
                  key={h.key}
                  onClick={() => {
                    setHeroInput(h.name);
                    setHeroKey(h.key);
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
                  <Img
                    src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${h.key.replace(
                      "npc_dota_hero_",
                      ""
                    )}.png`}
                    alt={h.key}
                    height="3em"
                    width={(16 / 9) * 3 + "em"}
                    mr={4}
                  />
                  {h.name}
                </Button>
              ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default HeroPicker;
