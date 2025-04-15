"use client"
import { useState } from "react";
import fetchData from "@/lib/api";  // 위에서 작성한 로그인 요청 함수
import Image from 'next/image';
import styles from "./page.module.scss";

export default function Login() {
  const [username, setUsername] = useState("");  // 사용자 이름 상태
  const [password, setPassword] = useState("");  // 비밀번호 상태
  const [error, setError] = useState("");  // 에러 메시지 상태

  const handleSubmit = async (event) => {
    event.preventDefault();  // 폼 제출 시 페이지 새로고침 방지

    try {
      // 로그인 API 호출
      const data = await fetchData(username, password);
      console.log("로그인 성공:", data);
      // 로그인 성공 후 처리 (예: 리다이렉트)
    } catch (error) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");  // 오류 처리
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        <Image src="/logo.png" alt="페이즘"
          width={152}
          height={86} />
      </h2>
      <form className={styles.container__form} onSubmit={handleSubmit}>
        <div className={styles.container__form__content}>
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // 입력값을 상태로 저장
            required
          />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // 입력값을 상태로 저장
            required
          />
        </div>

        <div className={styles.container__form__content}>
          <label>
            <input type="checkbox" id="rememberMe" name="rememberMe" />
            로그인 기억하기
          </label>
        </div>

        <button type="submit">로그인</button>
        {error && <p style={{ color: "red" }}>{error}</p>}  {/* 에러 메시지 출력 */}
      </form>
    </div>
  );
}
