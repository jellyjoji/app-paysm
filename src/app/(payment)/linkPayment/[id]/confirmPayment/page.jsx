'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_BASE_URL } from "@/lib/api";

export default function ConfirmPaymentPage() {
  const params = useSearchParams();
  const productId = params.get("productId");
  console.log(productId);
  console.log("productId 가 URL 에 없는 중/왜 없지");

  const [product, setProduct] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [goodsQty, setGoodsQty] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);

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
        setTotalAmount(data.unitPrice); // 초기 결제금액 설정
      })
      .catch((err) => setError(err.message));
  }, [productId]);

  // 수량 변경 시 결제금액 갱신
  useEffect(() => {
    if (product) {
      const price = parseInt(product.unitPrice || 0);
      setTotalAmount(price * goodsQty);
    }
  }, [goodsQty, product]);

  // 결제 정보 요청
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

  if (error) return <div>오류: {error}</div>;
  if (!product) return <div>상품 정보를 불러오는 중...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">결제 확인</h2>

      <div>
        <p>상품명: {product.goodsNm}</p>
        <p>가격: {product.unitPrice}원</p>

        <label>수량:
          <input
            type="number"
            value={goodsQty}
            min={1}
            onChange={(e) => setGoodsQty(parseInt(e.target.value))}
          />
        </label>

        <p>총 결제금액: {totalAmount}원</p>

        <button onClick={fetchPaymentInfo}>결제 정보 요청</button>

        {paymentInfo && (
          <div className="mt-4">
            <h4>결제 준비 완료</h4>
            <pre>{JSON.stringify(paymentInfo, null, 2)}</pre>
            {/* 실제 결제 submit은 form으로 하거나 iframe 호출 등 필요 시 추가 */}
          </div>
        )}
      </div>
    </div>
  );
}
