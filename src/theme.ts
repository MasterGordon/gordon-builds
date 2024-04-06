import { ChakraTheme, extendTheme } from "@chakra-ui/react";
import { Kanit } from "next/font/google";

const kanit = Kanit({ subsets: ["latin-ext"], weight: ["500"] });

const config: ChakraTheme["config"] = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = {
  config,
  styles: {
    global: {
      img: {
        userSelect: "none",
        userDrag: "none",
      },
      body: {
        backgroundColor: "bgBlue",
      },
    },
  },
  colors: {
    c1: "#1f2041",
    c2: "#35305a",
    c3: "#4b3f72",
    c4: "#65588b",
    c5: "#7e71a3",
    c6: "#b0a3d4",
    c7: "#d3c6f6",
    activeBlue: "#2e3b5c",
    manacostBlue: "#009dd2",
    dmgPhysical: "#ac2f29",
    dmgMagical: "#5589c1",
    dmgPure: "#d8af54",
    spellPierces: "#71ea73",
    disspellRed: "#b80405",
    bgBlue: "#000A27",
    bgGreen: "#003F49",
    button: "#067f93",
    buttonHover: "#045a69",
  },
  fonts: {
    heading: kanit.style.fontFamily,
  },
  semanticTokens: {
    colors: {
      heading: {
        default: "c1",
        _dark: "c7",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "3px",
      },
      sizes: {
        xl: {
          height: "60px",
          padding: "24px",
          fontSize: "lg",
        },
      },
      variants: {
        cta: {
          color: "white",
          backgroundColor: "button",
          _hover: { backgroundColor: "buttonHover" },
        },
        outline: {
          color: "white",
          backgroundColor: "transparent",
          border: "2px solid",
          borderColor: "button",
          _hover: {
            backgroundColor: "buttonHover",
            borderColor: "buttonHover",
          },
        },
        invert: {
          color: "buttonHover",
          backgroundColor: "gray.50",
          boxShadow: "0px 6px 28px 0px black",
        },
      },
    },
  },
};

export default extendTheme(theme);
