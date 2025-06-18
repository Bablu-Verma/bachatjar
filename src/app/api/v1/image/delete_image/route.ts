import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { authenticateAndValidateUser } from "@/lib/authenticate";

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
    const { filenames } = await req.json(); // expects: { filenames: ['img1.jpg', 'img2.png'] }

    if (!Array.isArray(filenames) || filenames.length === 0) {
      return NextResponse.json(
        { success: false, message: "No filenames provided" },
        { status: 400 }
      );
    }

     const imageDir = "/var/www/bachatjar/img";

    //  const publicDir = path.join(process.cwd(), "public");

    const deleted: string[] = [];
    const failed: string[] = [];

    for (const filename of filenames) {
      const filePath = path.join(imageDir, filename);
      try {
        await fs.unlink(filePath);
        deleted.push(filename);
      } catch (error) {
        console.warn(`Failed to delete ${filename}:`, error);
        failed.push(filename);
      }
    }

    return NextResponse.json(
      {
        success: true,
        deleted,
        failed,
        message: `Deleted ${deleted.length} files, failed to delete ${failed.length}`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete images.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
