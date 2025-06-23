import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com",'lh3.googleusercontent.com','images-eu.ssl-images-amazon.com', 'res.cloudinary.com','cdn-icons-png.flaticon.com', 'dev.bachatjar.com','assets.ajio.com', 'img.bachatjar.com',"localhost", 'm.media-amazon.com'], 
  },
  async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "GET,POST" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
};

export default nextConfig;
