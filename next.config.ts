import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com",'lh3.googleusercontent.com','images-eu.ssl-images-amazon.com', 'res.cloudinary.com','cdn-icons-png.flaticon.com', 'dev.bachatjar.com','assets.ajio.com', 'img.bachatjar.com',"localhost", 'm.media-amazon.com'], 
  }
};

export default nextConfig;
