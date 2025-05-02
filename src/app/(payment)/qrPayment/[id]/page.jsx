"use client";

import styles from "./page.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import QRCode from 'qrcode';  // qrcode 라이브러리 추가

export default function QrPaymentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [qrcode, setQrcode] = useState(null);  // QR 코드 상태 추가
  const [token, setToken] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const payLink = useMemo(() => {
    return `${API_BASE_URL}/payment/paymentLink?productId=${id}`;
    // return `/linkPayment/${id}/confirmPayment`;
  }, [id]);

  useEffect(() => {
    if (!id || !token) {
      console.log("id나 token이 아직 준비 안 됐음");
      return;
    }

    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await fetch(`${API_BASE_URL}/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("상품 정보를 가져오지 못했습니다.");

        const data = await res.json();
        setProduct(data);

        // QR 코드 생성
        QRCode.toDataURL(payLink, { width: 256 }, (err, url) => {
          if (err) {
            console.error("QR 코드 생성 실패:", err);
          } else {
            setQrcode(url);  // 생성된 QR 코드 URL을 상태에 저장
          }
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProduct();
  }, [id, token, payLink]);  // payLink 추가하여 payLink이 변경될 때마다 QR 코드도 갱신되도록 설정

  const handleDelete = async () => {
    if (!id) {
      alert('상품 ID가 없습니다.');
      return;
    }

    const confirmDelete = confirm('정말로 이 상품을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      const res = await fetch(`${API_BASE_URL}/api/product/delete/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('삭제 실패');

      alert('상품이 삭제되었습니다.');
      router.push('/qrPayment'); // QR 결제 목록 페이지로 이동
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('상품 삭제 중 오류 발생');
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>로딩 중...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.container__form}>
        <div className={styles.container__form__content}>
          <label htmlFor="goodsNm">상품명</label>
          <input type="text" id="goodsNm" value={product?.goodsNm} readOnly />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="unitPrice">상품 금액</label>
          <input
            type="text"
            id="unitPrice"
            value={product?.unitPrice ? Number(product.unitPrice).toLocaleString() : ''}
            readOnly
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="goodsQty">수량</label>
          <input
            type="number"
            id="goodsQty"
            defaultValue="1"
            min="1"
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="goodsAmt">결제금액</label>
          <input
            type="text"
            id="goodsAmt"
            value={product?.unitPrice ? Number(product.unitPrice).toLocaleString() : ''}
            readOnly
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="qrcode">QR 코드</label>
          <div id="qrcode" className={styles.container__form__content__qrcode}>
            {qrcode ? (
              <img src={qrcode} alt="QR Code" />
            ) : (
              <p>QR 코드 생성 중...</p>
            )}
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className='cta delete'
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>

        </div>
      </div>
    </div>
  );
}
