"use client";
import { useState } from "react";
import styles from "./page.module.scss";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from "@/lib/api";
import { Eye, EyeClosed } from 'lucide-react';

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    userId: '',
    userPass: '',
    userName: '',
    userPhone: '',
    businessNumber: '',
  });

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      // 자동 로그인 제거됨
      // router.push("/login"); // 원할 경우 로그인 페이지로 이동
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
        </div>
        <div className={styles.container__form__content}>
          <label htmlFor="userName">이름</label>
          <input type="text" name="userName" id="userName" value={form.userName} onChange={handleChange} placeholder="홍길동" />
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

        </div>
        <button className='cta' type="submit">회원가입</button>
        {message && (
          <p style={{ color: message.includes("완료") ? "green" : "red" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}