"use client";

import styles from "./page.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import QRCode from 'qrcode';  // qrcode 라이브러리 추가

export default function QrPaymentDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [qrcode, setQrcode] = useState(null);  // QR 코드 상태 추가
  const [token, setToken] = useState(null);

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

    const fetchProductInfo = async () => {
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

    fetchProductInfo();
  }, [id, token, payLink]);  // payLink 추가하여 payLink이 변경될 때마다 QR 코드도 갱신되도록 설정

  if (error) return <p>{error}</p>;
  if (!product) return <p>로딩 중...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.container__form}>
        <div className={styles.container__form__content}>
          <label htmlFor="goodsNm">상품명</label>
          <input type="text" id="goodsNm" value={product.goodsNm} readOnly />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="unitPrice">상품 가격</label>
          <input
            type="text"
            id="unitPrice"
            value={Number(product.unitPrice).toLocaleString()}
            readOnly
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="payType">결제 방식</label>
          <input type="text" id="payType" value={product.payType} readOnly />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="mid">가맹점 ID</label>
          <input type="text" id="mid" value={product.mid} readOnly />
        </div>

        {/* <div className={styles.container__form__content}>
          <label htmlFor="payLink">결제 링크</label>
          <textarea type="text" id="payLink" value={payLink} readOnly />
        </div> */}

        <div className={styles.container__form__content}>
          <label htmlFor="qrcode">QR 코드</label>
          <div id="qrcode" className={styles.container__form__content__qrcode}>
            {qrcode ? (
              <img src={qrcode} alt="QR Code" />
            ) : (
              <p>QR 코드 생성 중...</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
