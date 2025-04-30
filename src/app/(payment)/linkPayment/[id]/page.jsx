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
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 내보내는 새창 주소 생성
  const payLink = useMemo(() => {
    // 결제 요청시 열리는 창 여기서 조정
    // return `${API_BASE_URL}/payment/paymentLink?productId=${id}`;
    return `/linkPayment/${id}/confirmPayment`;
  }, [id]);

  // 결제 링크를 새로운 창에서 열기
  // const openPaymentPage = () => {
  //   router.push(payLink);
  // };

  const openPaymentPage = () => {
    // const paymentWindow = window.open(payLink, '_blank', 'width=480,height=720');
    router.push(payLink);

    window.addEventListener('message', function (event) {
      const data = event.data;
      console.log("Received data:", data);

      const receiveData = Array.isArray(data) ? data[1] : data;

      if (receiveData?.encData) {
        console.log("encData 수신 확인:", receiveData.encData);
        paymentRequest(receiveData);
      }
    }, { once: true }); // 한 번만 수신
  };

  const paymentRequest = async (data) => {
    try {
      const formData = new URLSearchParams();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const response = await fetch('https://api.skyclassism.com/payment.do', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      const result = await response.json();
      console.log("결제 응답:", result);

      if (result.resultCd === "0000") {
        await registerPayment(data);
        alert("결제 성공");
      } else {
        alert(`결제 실패: ${result.resultMsg}`);
      }
    } catch (err) {
      console.error("결제 요청 중 오류:", err);
    }
  };

  const registerPayment = async (data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/successInfoAdd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("결제 등록 실패");
    } catch (err) {
      console.error("등록 실패:", err);
    }
  };


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
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProduct();
  }, [id, token]);


  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // 최신 브라우저, HTTPS 환경
        await navigator.clipboard.writeText(payLink);
      } else {
        // fallback 방식
        const textArea = document.createElement("textarea");
        textArea.value = payLink;
        textArea.style.position = "fixed";  // iOS에서도 스크롤 방지
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (!successful) throw new Error("execCommand failed");
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("복사 실패:", err);
      alert("복사에 실패했습니다. 브라우저 보안 설정을 확인해주세요.");
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
          <button className='cta' onClick={openPaymentPage}>결제 요청</button>

        </div>
      </div>
    </div>
  );
}