'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';

// 예시 데이터
const dummyTasks = [
  { id: '1', product: '상품1', price: '9,900원', name: '김이름', done: true, canceled: false },
  { id: '2', product: '상품2', price: '12,000원', name: '박이름', done: false, canceled: true },
  { id: '3', product: '상품3', price: '15,000원', name: '최이름', done: true, canceled: false },
];

export default function PaymentDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const task = dummyTasks.find((t) => t.id === id);

  const handleClickReceipt = () => {
    router.push(`/paymentHistory/${id}/receipt`);
  };

  if (!task) {
    return <p>존재하지 않는 결제입니다.</p>;
  }

  const getStatusText = () => {
    if (task.canceled) return '결제 취소';
    if (task.done) return '완료';
    return '미완료';
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__content}>
        <label>상품</label>
        <input type="text" value={task.product} readOnly />
      </div>

      <div className={styles.container__content}>
        <label>가격</label>
        <input type="text" value={task.price} readOnly />
      </div>

      <div className={styles.container__content}>
        <label>구매자</label>
        <input type="text" value={task.name} readOnly />
      </div>

      <div className={styles.container__content}>
        <label>상태</label>
        <input type="text" value={getStatusText()} readOnly />
      </div>

      <button onClick={handleClickReceipt}>
        영수증 조회
      </button>
    </div>
  );
}
