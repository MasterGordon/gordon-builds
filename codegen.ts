import { CodegenConfig } from "@graphql-codegen/cli";
import { configDotenv } from "dotenv";
import path from "path/posix";

const env = configDotenv({
  path: path.resolve(__dirname, ".env.local"),
});

const config: CodegenConfig = {
  schema: [
    {
      "https://api.stratz.com/graphql": {
        headers: {
          Authorization: `Bearer ${
            env.parsed?.STRAZT_API_KEY || process.env.STRAZT_API_KEY
          }`,
        },
      },
    },
  ],
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
