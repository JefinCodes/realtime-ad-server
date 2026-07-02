const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload an image to Cloudinary.
 *
 * @param {File} file
 * @returns {Promise<string>} Secure image URL
 */
export async function uploadImage(file) {
    if (!file) {
        throw new Error("No image selected.");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Failed to upload image.");
    }

    const data = await response.json();

    return data.secure_url;
}
