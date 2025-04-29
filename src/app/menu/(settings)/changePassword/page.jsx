"use client"
import styles from "./page.module.scss";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Eye, EyeClosed } from 'lucide-react';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const token = localStorage.getItem("jwtToken");

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) throw new Error("비밀번호 변경 실패");

      const data = await res.json();

      if (data.code === "400") {
        alert(data.message);
      } else if (data.code === "200") {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      alert("비밀번호 변경 중 오류 발생");
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>

      {/* 현재 비밀번호 */}
      <div className={styles.container__content}>
        <label htmlFor="currentPassword">현재 비밀번호</label>
        <div>
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="******"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className={styles.container__content__eye}
            aria-label={showCurrentPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showCurrentPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>
      </div>

      {/* 새 비밀번호 */}
      <div className={styles.container__content}>
        <label htmlFor="newPassword">새 비밀번호</label>
        <div>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="******"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className={styles.container__content__eye}
            aria-label={showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showNewPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>
      </div>

      {/* 새 비밀번호 확인 */}
      <div className={styles.container__content}>
        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
        <div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="******"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.container__content__eye}
            aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showConfirmPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>
      </div>

      <button type="submit">비밀번호 변경</button>
    </form>
  );
}
