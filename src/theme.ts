import { extendTheme, Theme } from "@chakra-ui/react";

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
