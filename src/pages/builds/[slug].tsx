import { NextPage, NextPageContext } from "next";
import fs from "fs-extra";

interface Props {
  name: string;
}

const Build: NextPage<Props> = (props) => {
  return <div>{props.name}</div>;
};

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;
  const buildData = await fs.readJson(
    `${process.cwd()}/assets/builds/${slug}/build.json`
  );

  return {
    props: buildData,
  };
}

export default Build;
