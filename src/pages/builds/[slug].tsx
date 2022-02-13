import { NextPage, NextPageContext } from "next";
import fs from "fs-extra";
import Layout from "../../components/Layout";

interface Props {
  name: string;
}

const Build: NextPage<Props> = (props) => {
  return <Layout>{props.name}</Layout>;
};

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;
  try {
    const buildData = await fs.readJson(
      `${process.cwd()}/assets/builds/${slug}/build.json`
    );
    const description = await fs.readFile(
      `${process.cwd()}/assets/builds/${slug}/description.md`,
      "utf8"
    );
    return {
      props: { ...buildData, description },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default Build;
