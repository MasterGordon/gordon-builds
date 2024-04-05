import { Grid } from "@chakra-ui/react";
import Content from "./Content";
import LatestBuilds from "./LatestBuilds";
import { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren<{ builds?: any }>> = ({
  builds,
  children,
}) => {
  return (
    <>
      <Grid
        margin="auto"
        maxWidth="1300px"
        padding="4"
        gap="4"
        gridTemplateColumns={builds && { xl: "1fr 350px" }}
      >
        <Content>{children}</Content>
        {builds && <LatestBuilds builds={builds}>Navigation</LatestBuilds>}
      </Grid>
    </>
  );
};

export default Layout;
