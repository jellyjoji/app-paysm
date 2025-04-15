"use client"
import styles from "./page.module.scss";

export default function ChangePassword() {
  return (
    <div className={styles.container}>
      <div className={styles.container__content}>
        <label htmlFor="currentPassword">기존 비밀번호</label>
        <input type="password" id="currentPassword" />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="newPassword">새 비밀번호</label>
        <input type="password" id="newPassword" />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
        <input type="password" id="confirmPassword" />
      </div>
    </div>
  )
}