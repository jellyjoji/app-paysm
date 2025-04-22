"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 삭제
    localStorage.removeItem("jwtToken");

    // 로그아웃 후 로그인 페이지로 리다이렉트
    router.push("/login");
  };

  return (
    <button onClick={handleLogout}>
      로그아웃
    </button>
  );
}