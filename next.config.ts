import type { NextConfig } from "next";
// import './src/crawler/crawlerCron'

console.log('Server is starting... Running my code');

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com",'images-eu.ssl-images-amazon.com', 'res.cloudinary.com','cdn-icons-png.flaticon.com'], 
  },
};

export default nextConfig;
