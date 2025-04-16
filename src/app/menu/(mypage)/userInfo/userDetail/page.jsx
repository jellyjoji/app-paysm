"use client"
import { useState } from "react";
import styles from "./page.module.scss";
import Modal from "@/components/Modal";

export default function UserDetail() {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const handleBlock = () => {
    // 차단 로직 처리
    console.log("차단 완료");
    setShowBlockModal(false);
  };

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

      <div className={styles.container__button}>
        <button onClick={() => setShowBlockModal(true)} className={styles.blockButton}>
          차단하기
        </button>
      </div>

      {showBlockModal && (
        <Modal
          title="결제 차단"
          message="계정 차단시 사용자가 결제를 할 수 없습니다. 정말로 차단하시겠습니까?"
          confirmText="네, 차단"
          cancelText="아니오"
          onConfirm={handleBlock}
          onCancel={() => setShowBlockModal(false)}
        />
      )}
    </div>
  )
}