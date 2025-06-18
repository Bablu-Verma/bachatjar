import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { authenticateAndValidateUser } from "@/lib/authenticate";
// import path from "path";


export async function POST(req: NextRequest) {
  const { authenticated, message } = await authenticateAndValidateUser(req);

  if (!authenticated) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: message || "User is not authenticated",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {


     const imageDir = "/var/www/bachatjar/img";
    const files = await fs.readdir(imageDir);

    //  const publicDir = path.join(process.cwd(), "public");
    // const files = await fs.readdir(imageDir);
    // const localBaseUrl = "http://localhost:3000"; 
    

    const images = files.map((filename) => ({
      filename,
      // url: `${localBaseUrl}/${filename}`
      url: `${process.env.IMAGE_URL}/${filename}`
    }));

    return NextResponse.json(
      {
        success: true,
        images,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Image fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch images",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
