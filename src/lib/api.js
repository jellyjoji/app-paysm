export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.8:8080/api";

// JWT 토큰이 필요한 GET 요청
export async function fetchWithToken(endpoint) {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("API 호출 실패");
  return await res.json();
}

// 로그인 요청
export async function login(userId, password) {
  const res = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, password }),
  });

  return await res.json();
}
