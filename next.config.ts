import type { NextConfig } from "next";

const { version } = require('./package.json');

const nextConfig: NextConfig = {
   /* config options here */
    allowedDevOrigins: ['192.168.0.2'],
    env: {
        APP_VERSION: version, // Expose the version as an environment variable
    },
};


export default nextConfig;