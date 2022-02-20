import { Box } from "@chakra-ui/react";

interface LatestBuildsProps {
  builds: {
    name: string;
    heroKey: string;
    version: string;
  }[];
}

const LatestBuilds: React.FC<LatestBuildsProps> = ({ children }) => {
  return (
    <Box padding="4" borderRadius="md" backgroundColor="gray.700">
      {children}
    </Box>
  );
};

export default LatestBuilds;
