import { Box } from "@chakra-ui/react";

const Content: React.FC = ({ children }) => {
  return (
    <Box padding="4" borderRadius="md" as="main" backgroundColor="gray.700">
      {children}
    </Box>
  );
};

export default Content;
