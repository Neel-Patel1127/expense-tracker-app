export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed._id || !parsed.email) return null;

    return parsed;
  } catch {
    return null;
  }
}
