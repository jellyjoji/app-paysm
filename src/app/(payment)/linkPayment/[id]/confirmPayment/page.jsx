'use client';
import styles from "./page.module.scss";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE_URL } from "@/lib/api";
import Modal from 'react-modal';
import Image from "next/image";

export default function ConfirmPaymentPage() {
  const { id } = useParams();
  const formRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [goodsQty, setGoodsQty] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE_URL}/api/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("상품 정보 조회 실패");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setTotalAmount(data.unitPrice * goodsQty);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (!product || !totalAmount) return;

    const fetchPaymentInfo = async () => {
      try {
        const payload = {
          productId: id,
          merchantId: product.merchantId,
          mid: product.mid,
          goodsAmt: totalAmount,
          goodsNm: product.goodsNm,
        };

        const res = await fetch(`${API_BASE_URL}/api/payment/getPaymentinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('결제정보 요청 실패');
        const data = await res.json();
        setPaymentInfo(data);

        // 최초 자동 결제 요청
        await handlePayment(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPaymentInfo();
  }, [product, totalAmount]);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (!event.data) return;

      const receivedData = Array.isArray(event.data) ? event.data[1] : event.data;

      if (receivedData?.encData) {
        await handlePayment(receivedData);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handlePayment = async (data) => {
    try {
      const result = await paymentRequest(data);
      if (result.resultCd === "0000") {
        await registerPayment(data);
      } else {
        alert(`결제 실패: ${result.resultMsg}`);
      }
    } catch (err) {
      alert(`결제 요청 중 오류: ${err.message}`);
    }
  };

  const paymentRequest = async (data) => {
    const formData = new URLSearchParams();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch('https://api.skyclassism.com/payment.do', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!response.ok) throw new Error('결제 요청 실패');
    return response.json();
  };

  const registerPayment = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/successInfoAdd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("결제 등록 실패");
      alert("결제 성공");

      if (formRef.current) {
        document.body.appendChild(formRef.current);
        formRef.current.submit();
      }
    } catch (err) {
      alert("결제 등록 중 오류 발생: " + err.message);
    }
  };

  const formatPrice = (value) => value.toLocaleString('ko-KR') + '원';

  if (error) return <div>오류: {error}</div>;
  if (!product) return <div>상품 정보를 불러오는 중...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.container__title}>
        <Image src="/confirmPayment.png" alt="결제 요청" width={100} height={100} />
        <h3>결제 요청</h3>
        <h1>{formatPrice(totalAmount)}</h1>
      </div>

      <div className={styles.container__content}>
        <table>
          <tbody>
            <tr><th>상품명</th><td>{product.goodsNm}</td></tr>
            <tr><th>단가</th><td>{formatPrice(product.unitPrice)}</td></tr>
            <tr><th>수량</th><td>{goodsQty}</td></tr>
          </tbody>
        </table>
      </div>

      {paymentInfo && (
        <form
          ref={formRef}
          method="post"
          action="https://api.skyclassism.com/payInit_hash.do"
          target="responseIframe"
        >
          <input type="hidden" name="merchantId" value={paymentInfo?.merchantId || ''} />
          <input type="hidden" name="unitPrice" value={product.unitPrice} />
          <input type="hidden" name="goodsAmt" value={totalAmount} />
          <input type="hidden" name="encData" value={paymentInfo.encData} />
          <input type="hidden" name="ediDate" value={paymentInfo.ediDate} />
          <input type="hidden" name="mid" value={paymentInfo.mid} />
          <input type="hidden" name="ordNo" value={paymentInfo.ordNo} />
          <input type="hidden" name="goodsNm" value={product.goodsNm} />
          <input type="hidden" name="returnUrl" value={paymentInfo.returnUrl} />
          <input type="hidden" name="payMethod" value="card" />
          <input
            type="hidden"
            name="userIp"
            value={typeof window !== 'undefined' ? window.location.hostname : ''}
          />
          <button className='cta' type="submit" onClick={openModal}>
            결제 요청 제출
          </button>
        </form>
      )}

      <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="결제 프레임 모달">
        <button onClick={closeModal}>모달 닫기</button>
        <iframe
          name="responseIframe"
          title="결제 프레임"
          width="100%"
          height="100%"
          style={{ border: 'none', zIndex: 9999, position: 'relative' }}
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation"
        />
      </Modal>
    </div>
  );
}
