export const uploadImage = async (file) => {
  // Step 1: Ask backend for signed upload credentials
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "avatars" }), // You can change folder if needed
  });

  if (!signRes.ok) {
    throw new Error("Failed to get Cloudinary signature");
  }

  const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

  // Step 2: Upload to Cloudinary using signature
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const cloudinaryRes = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!cloudinaryRes.ok) {
    const error = await cloudinaryRes.text();
    throw new Error("Cloudinary upload failed: " + error);
  }

  const result = await cloudinaryRes.json();
  return result.secure_url; // This is the image URL to save in DB
};
