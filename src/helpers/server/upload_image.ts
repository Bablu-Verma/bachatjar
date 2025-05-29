import fs from 'fs';
import path from 'path';


const path_name = "/var/www/bachatjar/img";

export const upload_image = async (file: File, folder_path: string) => {
  try {
    
    

    // Ensure the folder exists
    if (!folder_path) {
       return {
      message: 'folder_path required',
      success: false,
      url: null,
    };
    }
  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

   const filenameWithExt = file.name
    // Generate unique file name
    const timestamp = Date.now();
   
    const fileName = `image_${timestamp}_${folder_path}_${filenameWithExt}`;
    const filePath = path.join(path_name, fileName);

    // Save buffer to file
    await fs.promises.writeFile(filePath, buffer);

        return {
          url: `https://img.bachatjar.com/${fileName}`,
          message: 'Upload image successfully',
          success: true,
        };
  } catch (error) {
    return {
      message: (error as Error).message || 'Upload failed',
      success: false,
      url: null,
    };
  }
};
