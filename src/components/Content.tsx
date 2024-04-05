import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box padding="4" borderRadius="md" as="main" backgroundColor="gray.700">
      {children}
    </Box>
  );
};

export default Content;
