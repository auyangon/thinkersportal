// src/checkEmailInSheet.ts
const SHEET_API = import.meta.env.VITE_API_BASE;

export async function checkEmailAllowed(email: string) {
  try {
    const res = await fetch(`${SHEET_API}?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Failed to fetch allowlist API");
    const data = await res.json();

    return data.allowed ? data : null;
  } catch (err) {
    console.error("Error checking email:", err);
    return null;
  }
}