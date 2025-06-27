import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import sharp from "sharp";
import type { NextRequest } from "next/server";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import limiter from "@/lib/rateLimiter";
import { RateLimiterRes } from "rate-limiter-flexible";

export const config = {
  api: {
    bodyParser: false,
  },
};

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {


    const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";




  try {

     await limiter.consume(ip);

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

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "No image uploaded." },
        { status: 400 }
      );
    }

    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported image format. Allowed: jpeg, png, webp, gif.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 🧠 Use sharp to resize and compress
    const resizedBuffer = await sharp(buffer)
      .resize({
        width: 1920,
        height: 1080,
        fit: "inside",
      })
      .webp({ quality: 70 })  
      .toBuffer();

    const timestamp = Date.now();
    const originalName = path.parse(file.name).name.replace(/[^\w.-]/g, "_");
    const filename = `${timestamp}_${originalName}.jpg`;

    const targetDir = "/var/www/bachatjar/img";
    await mkdir(targetDir, { recursive: true });

    const filepath = path.join(targetDir, filename);
    await writeFile(filepath, resizedBuffer);

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      url: `${process.env.IMAGE_URL}/${filename}`,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);


      if ((error as RateLimiterRes).msBeforeNext !== undefined) {
                const retryAfter = Math.ceil((error as RateLimiterRes).msBeforeNext / 1000);
                return new NextResponse(
                  JSON.stringify({
                    success: false,
                    message: `Too many requests. Try again in ${retryAfter} seconds.`,
                  }),
                  {
                    status: 429,
                    headers: {
                      "Content-Type": "application/json",
                      "Retry-After": retryAfter.toString(),
                    },
                  }
                );
              }
    

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload image.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
