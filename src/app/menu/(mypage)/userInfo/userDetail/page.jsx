"use client"
import styles from "./page.module.scss";

export default function UserDetail() {
  return (
    <div className={styles.container}>
      <div className={styles.container__content}>
        <label htmlFor="name">이름</label>
        <input type="text" id="name" readOnly />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="id">ID</label>
        <input type="text" id="id" readOnly />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="mid">Merchant ID</label>
        <input type="text" id="mid" readOnly />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="businessnum">사업자 등록번호</label>
        <input type="text" id="businessnum" readOnly />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="status">상태</label>
        <input type="text" id="status" readOnly />
      </div>
    </div>
  )
}