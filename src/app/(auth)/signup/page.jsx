"use client";
import { useState } from "react";
import styles from "./page.module.scss";
import Image from 'next/image';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [tel, setTel] = useState("");
  const [businessNum, setBusinessNum] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 여기에 백엔드로 전송하는 로직 추가
      const signupData = {
        username,
        tel,
        businessNum,
        password,
      };

      console.log("회원가입 데이터:", signupData);
      alert("회원가입이 완료되었습니다!");
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        <Image src="/logo.png" alt="페이즘" width={152} height={86} />
      </h2>
      <form className={styles.container__form} onSubmit={handleSubmit}>
        <div className={styles.container__form__content}>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="tel">전화번호</label>
          <input
            type="tel"
            id="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            required
          />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="businessNum">사업자등록번호</label>
          <input
            type="text"
            id="businessNum"
            value={businessNum}
            onChange={(e) => setBusinessNum(e.target.value)}
            required
          />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">회원가입</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
