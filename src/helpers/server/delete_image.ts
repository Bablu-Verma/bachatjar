import cloudinary from "@/lib/cloudinary";

function extractPublicId(url: string): string | null {
  const matches = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
  return matches ? matches[1] : null;
}

export const deleteImage = async (imageUrl: string) => {
  // Extract the public ID from the image URL
  const publicId = extractPublicId(imageUrl);

  if (!publicId) {
    console.error("Invalid image URL provided:", imageUrl);
    return {
      success: false,
      message: "Invalid image URL",
    };
  }

  try {
    // Use Cloudinary's uploader to delete the image
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Image deleted successfully:", result);

    return {
      success: true,
      message: `Image deleted successfully`,
      result,
    };
  } catch (error) {
    console.error("Error deleting image:", error);

    return {
      success: false,
      message: "Error deleting image",
      error,
    };
  }
};
