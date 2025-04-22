export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.8:8080";

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

export async function login(userId, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });

    if (res.ok) {
      return await res.json(); // 성공 시 { token: ... }
    } else {
      let errorMsg = "로그인 실패";

      if (res.status === 400) errorMsg = "잘못된 요청입니다.";
      else if (res.status === 401) errorMsg = "인증되지 않은 사용자입니다.";
      else if (res.status === 403)
        errorMsg = "아이디 또는 비밀번호가 일치하지 않습니다.";
      else if (res.status === 500)
        errorMsg = "서버 오류입니다. 잠시 후 다시 시도해주세요.";

      return { error: errorMsg };
    }
  } catch (err) {
    return { error: "네트워크 오류가 발생했습니다." };
  }
}
