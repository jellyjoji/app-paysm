"use client"
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { fetchWithToken } from "@/lib/api";
import styles from "./page.module.scss";
import Modal from "@/components/Modal";

export default function UserDetail() {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const { id } = useParams(); // userId
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleBlock = () => {
    // 차단 로직 처리
    console.log("차단 완료");
    setShowBlockModal(false);
  };

  // 백엔드 관리자 GET /api/user/{userId} 개발 예정
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const users = await fetchWithToken('/user'); // 모든 사용자 목록
        const selectedUser = users.find((u) => u.userId === id); // 해당 id만 필터링
        if (!selectedUser) throw new Error("해당 유저를 찾을 수 없습니다.");
        setUser(selectedUser);
      } catch (err) {
        setError("사용자 정보를 불러오지 못했습니다.");
        console.error(err);
      }
    };
    fetchDetail();
  }, [id]);


  if (error) return <p>{error}</p>;
  if (!user) return <p>불러오는 중...</p>;


  return (
    <div className={styles.container}>
      <div className={styles.container__content}>
        <label htmlFor="name">이름</label>
        <input type="text" id="name" value={user.userName} readOnly />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="id">ID</label>
        <input type="text" id="id" value={user.userId} readOnly />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="mid">Merchant ID</label>
        <input type="text" id="mid" readOnly />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="businessnum">사업자 등록번호</label>
        <input type="text" id="businessnum" value={user.businessNumber} readOnly />
      </div>

      <div className={styles.container__content}>
        <label htmlFor="status">상태</label>
        <input type="text" id="status" value={user.ban} readOnly />
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