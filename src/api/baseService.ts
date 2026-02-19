const API_BASE = import.meta.env.VITE_API_BASE;

// ===============================
// GENERIC GET (for Google Script)
// ===============================
export async function apiGet<T>(
  action: string,
  params?: Record<string, string>
): Promise<T> {
  if (!API_BASE) {
    throw new Error('DEMO_MODE');
  }

  const query = new URLSearchParams({
    action,
    ...(params || {}),
  });

  const res = await fetch(`${API_BASE}?${query.toString()}`);

  if (!res.ok) {
    throw new Error(`GET failed: ${action}`);
  }

  return res.json();
}

// ===============================
// GENERIC POST (for Google Script)
// ===============================
export async function apiPost<T>(
  action: string,
  body: Record<string, unknown>
): Promise<T> {
  if (!API_BASE) {
    throw new Error('DEMO_MODE');
  }

  const res = await fetch(`${API_BASE}?action=${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST failed: ${action}`);
  }

  return res.json();
}