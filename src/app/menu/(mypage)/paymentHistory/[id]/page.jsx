'use client';
import styles from './page.module.scss';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function PaymentDetail() {
  const params = useParams();
  const paymentId = params.id;

  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    if (!paymentId) {
      alert('잘못된 접근입니다.');
      return;
    }

    const token = localStorage.getItem('jwtToken');

    console.log('결제 내역 토큰:', token);

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    fetch(`${API_BASE_URL}/api/payment/getPaymentDetailByPaymentId/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('상세정보 조회 실패');
        return res.json();
      })

      .then((data) => {
        setPaymentInfo(data);

      })
      .catch((err) => {
        console.error('❌ 오류 발생:', err);
        alert('결제 상세정보 조회 중 오류가 발생했습니다.');
      });
  }, [paymentId]);

  if (!paymentInfo) {
    return <div className={styles.container}>결제 정보를 불러오는 중입니다...</div>;
  }


  const cancelPayment = () => {
    if (!paymentInfo) {
      alert('결제 정보를 먼저 불러와야 합니다.');
      return;
    }
    const { tid, amt } = paymentInfo;
    window.open(`/payment/paymentCancel?tid=${tid}&amt=${amt}`, '_blank');
  };

  const viewReceipt = () => {
    if (!paymentInfo) {
      alert('결제 정보를 먼저 불러와야 합니다.');
      return;
    }
    const { tid } = paymentInfo;
    window.open(`/payment/receipt?tid=${tid}`, '_blank');
  };

  return (
    <div className={styles.container}>
      {paymentInfo ? (
        <>
          <div className={styles.container__content}>
            <label htmlFor="goodsName" >
              상품명
            </label>
            <input
              type="text"
              id="goodsName"
              value={paymentInfo.goodsName || ''}
              readOnly
            />
          </div>

          <div className={styles.container__content}>
            <label htmlFor="paymentId" >
              거래 ID
            </label>
            <input
              type="text"
              id="paymentId"
              value={paymentInfo.paymentId || ''}
              readOnly
            />
          </div>

          <div className={styles.container__content}>
            <label htmlFor="amt" >
              결제 금액
            </label>
            <input
              type="text"
              id="amt"
              value={paymentInfo.amt || ''}
              readOnly
            />
          </div>

          <div className={styles.container__content}>
            <label htmlFor="date" >
              결제 일자
            </label>
            <input
              type="text"
              id="date"
              value={paymentInfo.createdAt || ''}
              readOnly
            />
          </div>

          <div className={styles.container__content}>
            <label htmlFor="status" >
              결제 상태
            </label>
            <input
              type="text"
              id="status"
              value={paymentInfo.resultMsg || ''}
              readOnly
            />
          </div>

          <div className={styles.container__content}>
            <label htmlFor="tid" >
              TID
            </label>
            <input
              type="text"
              id="tid"
              value={paymentInfo.tid || ''}
              readOnly
            />
          </div>

          <div className={styles.container__content}>
            <label htmlFor="cancelYN" >
              취소 여부
            </label>
            <input
              type="text"
              id="cancelYN"
              value={
                paymentInfo.cancelYN === 'Y'
                  ? '결제 취소'
                  : paymentInfo.resultMsg === '정상처리'
                    ? '완료'
                    : '미완료'
              } readOnly
            />
          </div>

          {/* 결제 완료 상태 : 영수증 조회하기 버튼 */}
          {/* 결제 미완료 상태 : 결제 취소하기 버튼 */}

          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={cancelPayment}
          >
            결제취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={viewReceipt}
          >
            영수증보기
          </button>

        </>
      ) : (
        <p>결제 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}