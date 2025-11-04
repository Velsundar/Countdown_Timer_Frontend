export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004/api";

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "API request failed");
  }

  return res.json();
};
