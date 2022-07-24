import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Layout from "../../../components/Layout";
import { Build } from "../../../builds/Build";
import { getSSG } from "../../../server/ssg";
import { z } from "zod";
import BuildEditor from "../../../components/editor/BuildEditor";

interface Props {
  slug: string;
}

const Build: NextPage<Props> = ({ slug }) => {
  return (
    <Layout>
      <BuildEditor />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params) {
    return {
      notFound: true,
    };
  }
  const { slug } = z
    .object({
      slug: z.string(),
    })
    .parse(context.params);
  const ssg = await getSSG(context);
  await ssg.fetchQuery("build.getPlainBuild", { slug });
  await ssg.fetchQuery("dota.versions");
  await ssg.fetchQuery("dota.heroes");

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  };
};

export default Build;
