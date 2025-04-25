"use client";

import styles from "./page.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useRouter 추가
import { API_BASE_URL } from "@/lib/api";
import { Copy } from 'lucide-react';

export default function LinkPaymentDetail() {
  const { id } = useParams();
  const router = useRouter(); // router 사용
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // 내보내는 새창 주소 생성
  const payLink = useMemo(() => {
    // return `${API_BASE_URL}/payment/paymentLink?productId=${id}`;
    return `/linkPayment/${id}/confirmPayment`;
  }, [id]);
  // 근데 이 주소가 아니라 내 주소로 연결시켜서 열어야하잖아? data fetch 만 해오기 

  console.log("payLink:" + payLink);

  // 결제 링크를 새로운 창에서 열기
  const openPaymentPage = () => {
    router.push(payLink);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    const fetchProductInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("res:" + res);
        if (!res.ok) throw new Error("상품 정보를 가져오지 못했습니다.");

        const data = await res.json();
        console.log("data:" + data);

        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProductInfo();
  }, [id]);




  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(payLink);
      } else {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.value = payLink;
        input.select();
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("복사 실패:", err);
      alert("복사에 실패했습니다.");
    }
  };

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

        <div className={styles.container__form__content}>
          <div className={styles.container__form__content__copy}>
            <label htmlFor="payLink">결제 링크</label>
            <button onClick={handleCopy}>
              {/* 툴팁 처리 */}
              {copied && (
                <p>복사됨!</p>
              )}
              <Copy />
            </button>

          </div>
          <textarea type="text" id="payLink" value={payLink} readOnly />
          <button onClick={openPaymentPage}>결제 요쳥 열기</button>

        </div>
      </div>
    </div>
  );
}