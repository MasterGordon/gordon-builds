import { extendTheme } from "@chakra-ui/react";

const theme = {
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      img: {
        userSelect: "none",
        userDrag: "none",
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
  },
  semanticTokens: {
    colors: {
      heading: {
        default: "c1",
        _dark: "c7",
      },
    },
  },
};

export default extendTheme(theme);
