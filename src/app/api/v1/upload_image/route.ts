import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

// Use Node.js runtime explicitly
export const config = {
  runtime: "nodejs",
};

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.formData();
    const image_ = requestData.get("image");

    if (!image_ || !(image_ instanceof File)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "A valid image file is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Validate MIME type (you can add more types if needed)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validMimeTypes.includes(image_.type)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Unsupported image format. Allowed: jpeg, png, webp, gif.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }


    const buffer = Buffer.from(await image_.arrayBuffer());

    // Compress and optimize image with sharp
    const optimizedBuffer = await sharp(buffer)
      // Optional: resize image if too large
      //.resize({ width: 1024 })
      // Convert to jpeg and reduce quality to 70%
      .jpeg({ quality: 70 })
      .toBuffer();

    const targetDir = "/var/www/bachatjar/img";
    await mkdir(targetDir, { recursive: true });

    const timestamp = Date.now();
    const originalName = image_.name.replace(/\s+/g, "_");
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(targetDir, filename);

    // Save optimized image
    await writeFile(filepath, optimizedBuffer);

    const imageUrl = `/img/${filename}`;

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Your image was uploaded and optimized successfully.",
        response: {
          url: imageUrl,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to upload image.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
