import { Grid } from "@chakra-ui/react";
import Content from "./Content";
import Header from "./Header";
import LatestBuilds from "./LatestBuilds";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <Grid
        margin="auto"
        maxWidth="1300px"
        padding="4"
        gap="4"
        gridTemplateColumns={{ lg: "1fr 300px" }}
      >
        <Content>{children}</Content>
        <LatestBuilds>Navigation</LatestBuilds>
      </Grid>
    </>
  );
};

export default Layout;