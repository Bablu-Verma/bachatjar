import { Readable } from "stream";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export const upload_image = async (file: File, folder_name: string) => {
  try {
   
    const buffer = await file.arrayBuffer();

    const readable = new Readable();
    readable._read = () => {}; 
    readable.push(Buffer.from(buffer));
    readable.push(null); 
  
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder_name },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) return reject(error);
          if (result) return resolve(result);
          reject(new Error("Unknown error occurred during upload."));
        }
      );

      readable.pipe(uploadStream);
    });

    return {
      url: result.secure_url,
      message: "Upload image Successfully",
      success: true,
    };
  } catch (error) {
    return {
      message: (error as Error).message || "Upload failed",
      success: false,
      url: null,
    };
  }
};
