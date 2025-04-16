"use client"
import { useState } from "react";
import styles from "./page.module.scss";
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const result = await login(userId, password);

    if (result.token) {
      localStorage.setItem('jwtToken', result.token);
      setMsg('로그인 성공!');
      router.push('/');
    } else {
      setMsg(result.message || '로그인 실패');
    }
  };


  return (
    <div className={styles.container}>
      <h2>
        <Image src="/logo.png" alt="페이즘"
          width={152}
          height={86} />
      </h2>
      <div className={styles.container__form__content}>
        <label htmlFor="id">아이디</label>
        <input
          type="text"
          id="id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}  // 입력값을 상태로 저장
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
      <button onClick={handleLogin}>로그인</button>
      <p style={{ color: 'red' }}>{msg}</p>

    </div>
  );
}