"use client"
import { useEffect, useState } from 'react';
import styles from "./page.module.scss";
import { login } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeClosed } from 'lucide-react';
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("rememberedUserId");
    if (savedId) {
      setUserId(savedId);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    const result = await login(userId, password);

    if (result.token) {
      localStorage.setItem('jwtToken', result.token);

      if (rememberMe) {
        localStorage.setItem('rememberedUserId', userId);
      } else {
        localStorage.removeItem('rememberedUserId');
      }

      setMsg('로그인 성공!');
      router.push('/');
    } else {
      setMsg(result.error || '로그인 실패'); // 상태코드별 메시지가 여기서 출력됨
    }
  };


  return (
    <div className={styles.container}>
      <h2>
        <Image src="/logo.png" alt="페이즘"
          width={152}
          height={86} />
      </h2>

      <form
        className={styles.container__form}
        onSubmit={(e) => {
          e.preventDefault(); // 새로고침 방지
          handleLogin();
        }}>
        <div className={styles.container__form__content}>
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}  // 입력값을 상태로 저장
            placeholder="홍길동"
            required
          />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="password">비밀번호</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // 입력값을 상태로 저장
            placeholder="abc12#"
            required />

          <button
            className={styles.container__form__content__eye}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>

        <div className={styles.container__form__content}>
          <label>
            <input type="checkbox" id="rememberMe" name="rememberMe" checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)} />
            로그인 기억하기
          </label>
        </div>
        <button className='cta' onClick={handleLogin}>로그인</button>
        <p >{msg}</p>
      </form>

      <div className={styles.container__links}>
        <Link href="/signup">
          <div>
            계정이 없으신가요? <strong>회원가입</strong>
          </div>
        </Link>

        <Link href="https://www.paysm.net" target="_blank" rel="noopener noreferrer">
          <div>
            전자결제가 필요하신가요? <strong>PAYsm 바로가기</strong>
          </div>
        </Link>
      </div>
    </div>
  );
}