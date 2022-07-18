// @ts-check
const { env } = require("./src/server/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    NODE_ENV: env.NODE_ENV,
  },
};

module.exports = nextConfig;
