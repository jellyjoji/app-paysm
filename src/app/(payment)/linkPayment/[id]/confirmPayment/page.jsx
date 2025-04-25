'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE_URL } from "@/lib/api";
import Modal from 'react-modal';

export default function ConfirmPaymentPage() {
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  // 모달 열기
  const openModal = () => setIsOpen(true);
  // 모달 닫기
  const closeModal = () => setIsOpen(false);

  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [goodsQty, setGoodsQty] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);

  const formRef = useRef(null);

  // 상품 정보 불러오기
  useEffect(() => {
    if (!productId) return;

    fetch(`${API_BASE_URL}/api/product/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("상품 정보 조회 실패");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setTotalAmount(data.unitPrice); // 초기 금액 설정
      })
      .catch((err) => setError(err.message));
  }, [productId]);

  // 총 결제금액 계산
  useEffect(() => {
    if (product) {
      const price = parseInt(product.unitPrice || 0);
      setTotalAmount(price * goodsQty);
    }
  }, [goodsQty, product]);

  // 결제 정보 자동 요청
  useEffect(() => {
    if (!product || !totalAmount) return;

    const fetchPaymentInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payment/getPaymentinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            merchantId: product.merchantId,
            mid: product.mid,
            goodsAmt: totalAmount,
            goodsNm: product.goodsNm,
          }),
        });

        if (!res.ok) throw new Error('결제정보 요청 실패');
        const data = await res.json();
        setPaymentInfo(data);
      } catch (err) {
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">결제 확인</h2>
      <div>
        <button onClick={openModal}>모달 열기</button>

        <Modal
          isOpen={isOpen}             // 모달의 열림 상태
          onRequestClose={closeModal} // 모달 닫기
          contentLabel="모달 내용"   // 모달의 설명
        >
          <h2>모달 내용</h2>
          <button onClick={closeModal}>모달 닫기</button>
        </Modal>
      </div>
      <div>
        <p>상품명: {product.goodsNm}</p>
        <p>단가: {formatPrice(product.unitPrice)}</p>

        <label>수량:
          <input
            type="number"
            value={goodsQty}
            min={1}
            onChange={(e) => setGoodsQty(parseInt(e.target.value))}
            className="ml-2 border p-1"
          />
        </label>

        <p>총 결제금액: {formatPrice(totalAmount)}</p>

        <div>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="merchantId" value={product.merchantId} />
          <input type="hidden" name="mid" value={product.mid} />
          <input type="hidden" name="goodsAmt" value={totalAmount} />
          <input type="hidden" name="goodsNm" value={product.goodsNm} />
        </div>

        {paymentInfo && (
          <>
            <form
              ref={formRef}
              method="post"
              action="https://api.skyclassism.com/payInit_hash.do" // 결제 API URL
              target="responseIframe" // 응답을 iframe에서 표시
              className="mt-4 border p-3"
            >


              {/* form 에 넘겨줄 필수 데이터 값 */}
              <input type="hidden" name="encData" value={paymentInfo.encData} />
              <input type="hidden" name="ediDate" value={paymentInfo.ediDate} />
              <input type="hidden" name="mid" value={paymentInfo.mid} />
              <input type="hidden" name="ordNo" value={paymentInfo.ordNo} />
              <input type="hidden" name="goodsNm" value={product.goodsNm} />
              <input type="hidden" name="goodsAmt" value={totalAmount} />
              <input type="hidden" name="returnUrl" value={paymentInfo.returnUrl} />
              <input type="hidden" name="charset" value="utf-8" />

              <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                결제 요청 제출
              </button>
            </form>

            {/* 결제 응답을 표시할 iframe */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">결제창</h3>
              <iframe
                name="responseIframe" // 폼의 target과 일치
                title="결제 프레임"
                width="100%"
                height="100%"
                className="border w-full"
              ></iframe>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
