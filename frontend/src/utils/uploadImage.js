// export const uploadImage = async (file) => {
//   // Step 1: Ask backend for signed upload credentials
//   const signRes = await fetch("/api/cloudinary/sign", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ folder: "avatars" }), // You can change folder if needed
//   });

//   if (!signRes.ok) {
//     throw new Error("Failed to get Cloudinary signature");
//   }

//   const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

//   // Step 2: Upload to Cloudinary using signature
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("api_key", apiKey);
//   formData.append("timestamp", timestamp);
//   formData.append("signature", signature);
//   formData.append("folder", folder);

//   const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

//   const cloudinaryRes = await fetch(uploadUrl, {
//     method: "POST",
//     body: formData,
//   });

//   if (!cloudinaryRes.ok) {
//     const error = await cloudinaryRes.text();
//     throw new Error("Cloudinary upload failed: " + error);
//   }

//   const result = await cloudinaryRes.json();
//   return result.secure_url; // This is the image URL to save in DB
// };



// const API_ROOT =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export const uploadImage = async (file) => {
//   const token = localStorage.getItem("token");
//   const signRes = await fetch("https://feedback-application-api.onrender.com/api/cloudinary/sign", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ folder: "avatars" }),
//   });

//   if (!signRes.ok) throw new Error("Failed to get Cloudinary signature");

//   const { signature, timestamp, apiKey, cloudName, folder } =
//     await signRes.json();

//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("api_key", apiKey);
//   formData.append("timestamp", timestamp);
//   formData.append("signature", signature);
//   formData.append("folder", folder);

//   const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
//   const cloudRes = await fetch(uploadUrl, { method: "POST", body: formData });

//   if (!cloudRes.ok)
//     throw new Error("Cloudinary upload failed: " + (await cloudRes.text()));

//   const result = await cloudRes.json();
//   return result.secure_url;
// };


const API_ROOT =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const uploadImage = async (file) => {
  /* ── 1. Get JWT from localStorage ── */
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not logged in");

  /* ── 2. Ask backend for Cloudinary signature ── */
  const signRes = await fetch(`${API_ROOT}/cloudinary/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,          // ← send the token
    },
    body: JSON.stringify({ folder: "avatars" }),
  });

  if (!signRes.ok) {
    const errTxt = await signRes.text();
    throw new Error("Failed to get Cloudinary signature: " + errTxt);
  }

  const { signature, timestamp, apiKey, cloudName, folder } =
    await signRes.json();

  /* ── 3. Upload file directly to Cloudinary ── */
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
  return result.secure_url; // URL to save in DB
};
