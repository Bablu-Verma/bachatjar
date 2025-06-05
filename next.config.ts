import type { NextConfig } from "next";
// import './src/crawler/crawlerCron'


const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com",'lh3.googleusercontent.com','images-eu.ssl-images-amazon.com', 'res.cloudinary.com','cdn-icons-png.flaticon.com', 'dev.bachatjar.com', 'img.bachatjar.com', 'm.media-amazon.com'], 
  },
};

export default nextConfig;
