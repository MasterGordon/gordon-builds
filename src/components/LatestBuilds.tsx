import { Box } from "@chakra-ui/react";

const LatestBuilds: React.FC = ({ children }) => {
  return (
    <Box padding="4" borderRadius="md" backgroundColor="gray.700">
      {children}
    </Box>
  );
};

export default LatestBuilds;
