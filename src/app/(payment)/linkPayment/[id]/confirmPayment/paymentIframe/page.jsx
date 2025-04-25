"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function PaymentIframePage() {
  const { id } = useParams();
  const formRef = useRef(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");

      const productRes = await fetch(`${API_BASE_URL}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productData = await productRes.json();
      setProduct(productData);

      const paymentRes = await fetch(`${API_BASE_URL}/api/payment/init/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const paymentData = await paymentRes.json();
      setPaymentInfo(paymentData);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (paymentInfo && product && formRef.current) {
      formRef.current.submit();
    }
  }, [paymentInfo, product]);

  if (!paymentInfo || !product) return <p>로딩 중...</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg mb-2">결제 진행 중...</h2>

      <form
        ref={formRef}
        method="post"
        action="https://api.skyclassism.com/payInit_hash.do"
        target="responseIframe"
      >
        <input type="hidden" name="encData" value={paymentInfo.encData} />
        <input type="hidden" name="ediDate" value={paymentInfo.ediDate} />
        <input type="hidden" name="mid" value={paymentInfo.mid} />
        <input type="hidden" name="ordNo" value={paymentInfo.ordNo} />
        <input type="hidden" name="goodsNm" value={product.goodsNm} />
        <input type="hidden" name="goodsAmt" value={product.unitPrice} />
        <input type="hidden" name="returnUrl" value={paymentInfo.returnUrl} />
        <input type="hidden" name="charset" value="utf-8" />
      </form>

      <iframe
        name="responseIframe"
        title="결제창"
        width="100%"
        height="600px"
        className="border mt-4"
      ></iframe>
    </div>
  );
}
