"use client";
import { useState } from "react";
import styles from "./page.module.scss";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from "@/lib/api";
import { Eye, EyeClosed } from 'lucide-react';
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    userId: '',
    userPass: '',
    userName: '',
    userPhone: '',
    businessNumber: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateUserId = (userId) => {
    const userIdRegex = /^[a-z][a-z0-9]*$/;
    if (!userIdRegex.test(userId)) {
      setUserIdError('아이디는 영문 소문자 혹은 영문 소문자와 숫자만 사용할 수 있습니다.');
      return false;
    }
    setUserIdError('');
    return true;
  };

  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    if (!hasLetter || !hasNumber || !hasSpecial) {
      setPasswordError('비밀번호는 영문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해야 합니다.');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userId') {
      validateUserId(value);
    }
    if (name === 'userPass') {
      validatePassword(value);
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUserId(form.userId)) {
      return;
    }

    if (!validatePassword(form.userPass)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.message || "회원가입 실패");
        return;
      }

      const resData = await res.json();
      setMessage(resData.message || "회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (err) {
      console.error("에러 발생:", err);
      setMessage("서버 오류로 회원가입에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        <Image src="/logo.png" alt="페이즘" width={152} height={86} />
      </h2>
      <form className={styles.container__form} onSubmit={handleSubmit}>
        <div className={styles.container__form__content}>
          <label htmlFor="userId">아이디</label>
          <input type="text" name="userId" id="userId" value={form.userId} onChange={handleChange} placeholder="ab12" />
          {userIdError && <p className='error'>{userIdError}</p>}
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="userName">이름</label>
          <input type="text" name="userName" id="userName" value={form.userName} onChange={handleChange} placeholder="홍길동" />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="userPhone">전화번호</label>
          <input type="tel" name="userPhone" id="userPhone" value={form.userPhone} onChange={handleChange} placeholder="010-1234-5678"
          />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="businessNumber">사업자등록번호</label>
          <input type="text" name="businessNumber" id="businessNumber" value={form.businessNumber} onChange={handleChange} placeholder="123-45-67890" />
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="userPass">비밀번호</label>

          <input
            type={showPassword ? "text" : "password"}
            name="userPass"
            id="userPass"
            value={form.userPass}
            onChange={handleChange}
            placeholder="abc12#"
          />
          <button
            className={styles.container__form__content__eye}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
          {passwordError && <p className='error'>{passwordError}</p>}
        </div>
        <button className='cta' type="submit">회원가입</button>
        {message && (
          <p style={{ color: message.includes("완료") ? "green" : "red" }}>
            {message}
          </p>
        )}
      </form>

      <Link href="/login">
        <div>
          이미 계정이 있나요? <strong>로그인</strong>
        </div>
      </Link>

    </div>
  );
}