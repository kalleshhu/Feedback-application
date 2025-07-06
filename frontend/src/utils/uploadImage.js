const API_ROOT =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const uploadImage = async (file) => {

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not logged in");

  const signRes = await fetch(`${API_ROOT}/cloudinary/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,          
    },
    body: JSON.stringify({ folder: "avatars" }),
  });

  if (!signRes.ok) {
    const errTxt = await signRes.text();
    throw new Error("Failed to get Cloudinary signature: " + errTxt);
  }

  const { signature, timestamp, apiKey, cloudName, folder } =
    await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const cloudRes = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!cloudRes.ok) {
    const errTxt = await cloudRes.text();
    throw new Error("Cloudinary upload failed: " + errTxt);
  }

  const result = await cloudRes.json();
  return result.secure_url; 
};
