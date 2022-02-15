import { Heading } from "@chakra-ui/react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface Props {
  mdx: MDXRemoteSerializeResult;
}

const components = {
  h1: (props: any) => <Heading {...props} as="h2" size="md" />,
};

const BuildDescription: React.FC<Props> = (props) => {
  return <MDXRemote {...props.mdx} components={components} />;
};

export default BuildDescription;
