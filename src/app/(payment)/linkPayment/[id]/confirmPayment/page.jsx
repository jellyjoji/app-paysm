'use client';
import styles from "./page.module.scss";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE_URL } from "@/lib/api";
import Modal from 'react-modal';
import Image from "next/image";

export default function ConfirmPaymentPage() {
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const [productId, setProductId] = useState(null);
  const [product, setProduct] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [goodsQty, setGoodsQty] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (params?.id) {
      setProductId(String(params.id));
    }
  }, [params]);

  useEffect(() => {
    if (!productId) return;
    fetch(`${API_BASE_URL}/api/product/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("상품 정보 조회 실패");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setTotalAmount(data.unitPrice);
      })
      .catch((err) => setError(err.message));
  }, [productId]);

  useEffect(() => {
    if (product) {
      const price = parseInt(product.unitPrice || 0, 10);
      setTotalAmount(price * goodsQty);
    }
  }, [goodsQty, product]);

  async function paymentRequest(receivedData) {
    try {
      // 서버에서 허용된 merchantId, mid, unitPrice를 써야 해요.
      const paymentData = {
        mid: receivedData?.mid || "defaultMid",
        merchantId: receivedData?.merchantId || "testMerchant",
        goodsNm: receivedData?.goodsNm || "Test Product",
        unitPrice: receivedData?.unitPrice || "100",
        returnUrl: receivedData?.returnUrl || "https://example.com/return",
        notiUrl: receivedData?.notiUrl || "https://example.com/notify",
        payMethod: receivedData?.payMethod || "CARD",
      };
  
      const formData = new URLSearchParams();
      for (const key in receivedData) {
        formData.append(key, receivedData[key]);
      }

      const response = await fetch('https://api.skyclassism.com/payment.do', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('결제 요청 실패');
      }

      const result = await response.json();
      console.log('결제 요청 결과:', result);
      if (result.resultCd !== "0000") {
        throw new Error(`결제 실패: ${result.resultMsg}`);
      }
      return result;
    } catch (error) {
      console.error('paymentRequest 오류:', error);
      throw error;
    }
  }

  async function paymentSuccess(form, data) {
    console.log('paymentSuccess 호출', data);
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/successInfoAdd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("등록 실패");
      }

      const result = await response.json();
      alert("결제 성공");

      if (form) {
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("결제 등록 중 오류 발생");
    }
  }

  useEffect(() => {
    if (!product || !totalAmount) return;

    const fetchPaymentInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payment/getPaymentinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            merchantId: product.merchantId || 'MID-074ee10a-cbc0-4011-b258-d572af22718c',
            mid: product.mid || 'paysmtestm',
            goodsAmt: totalAmount,
            goodsNm: product.goodsNm,
          }),
        });

        if (!res.ok) throw new Error('결제정보 요청 실패');
        const data = await res.json();
        console.log('응답 데이터:', data);
        setPaymentInfo(data);

        try {
          const paymentResult = await paymentRequest(data);
          if (paymentResult.resultCd === "0000") {
            if (!data.merchantId && data.mid) {
              data.merchantId = data.mid;
            }
            if (!data.unitPrice && data.goodsAmt) {
              data.unitPrice = data.goodsAmt;
            }

            if (!data.merchantId || !data.goodsAmt || !data.goodsNm || !data.encData) {
              throw new Error('결제 필수 데이터 누락');
            }

            await paymentSuccess(formRef.current, data);
          } else {
            throw new Error(`결제 실패: ${paymentResult.resultMsg}`);
          }
        } catch (error) {
          console.error('결제 실패 처리:', error);
          alert('결제 실패: ' + error.message);
        }

        if (data.status === "success") {
          window.location.href = "/success";
        } else {
          console.log("결제 실패");
        }
      } catch (err) {
        console.error('응답 처리 중 오류 발생:', err);
        setError(err.message);
      }
    };

    fetchPaymentInfo();
  }, [product, totalAmount]);

  const formatPrice = (value) => {
    return value.toLocaleString('ko-KR') + '원';
  };

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

        <div>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="merchantId" value={product.merchantId} />
          <input type="hidden" name="mid" value={product.mid} />
          <input type="hidden" name="goodsNm" value={product.goodsNm} />
          <input type="hidden" name="goodsAmt" value={totalAmount} />
        </div>
      </div>

      {paymentInfo && (
        <form
          ref={formRef}
          method="post"
          action="https://api.skyclassism.com/payInit_hash.do"
          target="responseIframe"
        >
          <input type="hidden" name="merchantId" value={paymentInfo.merchantId || 'MID-074ee10a-cbc0-4011-b258-d572af22718c'} />
          <input type="hidden" name="unitPrice" value={product.unitPrice || totalAmount} />
          <input type="hidden" name="goodsAmt" value={totalAmount} />
          <input type="hidden" name="encData" value={paymentInfo.encData} />
          <input type="hidden" name="ediDate" value={paymentInfo.ediDate} />
          <input type="hidden" name="mid" value={paymentInfo.mid} />
          <input type="hidden" name="ordNo" value={paymentInfo.ordNo} />
          <input type="hidden" name="goodsNm" value={product.goodsNm} />
          <input type="hidden" name="returnUrl" value={paymentInfo.returnUrl || `${API_BASE_URL}/success`} />
          <input type="hidden" name="payMethod" value="card" />
          <input type="hidden" name="ordNm" value="" placeholder="구매자명" />
          <input type="hidden" name="ordTel" value="01000000000" placeholder="구매자연락처" />
          <input type="hidden" name="ordEmail" value="" placeholder="구매자이메일" />
          <input type="hidden" name="userIp" value={typeof window !== 'undefined' ? window.location.hostname : ''} />
          <input type="hidden" name="mbsUsrId" value="고객명" />
          <input type="hidden" name="trxCd" value="0" />
          <input type="hidden" name="charSet" value="UTF-8" />
          <input type="hidden" name="mbsReserved" value="reservedField" />

          <button type="submit" onClick={openModal}>
            결제 요청 제출
          </button>
        </form>
      )}

      <div>
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="모달 내용"
        >
          <button onClick={closeModal}>모달 닫기</button>
          <div>
            <iframe
              name="responseIframe"
              title="결제 프레임"
              width="100%"
              height="100vh"
              style={{ height: '100vh', border: 'none', zIndex: 9999, position: 'relative' }}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation"
            ></iframe>
          </div>
        </Modal>
      </div>
    </div>
  );
}
