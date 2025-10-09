import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default withPayload(nextConfig, {
  configPath: './src/payload.config.ts', // 👈 tell Payload where your config is
  devBundleServerPackages: false,
})
