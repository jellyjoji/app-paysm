"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [formValues, setFormValues] = useState({
    // 시스템 필드 - 숨김
    payMethod: "card",
    merchantId: "",
    mid: "",
    // 표시 필드
    goodsNm: "",
    unitPrice: "",
    goodsQty: 1,
    goodsAmt: "",
    // 시스템 필드 - 숨김
    ediDate: "",
    encData: "",
    ordTel: "01000000000",
    returnUrl: "/success",
    trxCd: "0",
    mbsUsrId: "고객명",
    charSet: "UTF-8",
    ordNo: "",
  });

  useEffect(() => {
    console.log("경로에서 추출한 productId:", productId);
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetch(`${API_BASE_URL}/api/product/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormValues((prev) => ({
            ...prev,
            merchantId: data.merchantId,
            mid: data.mid,
            goodsNm: data.goodsNm,
            unitPrice: data.unitPrice,
            goodsAmt: data.unitPrice,
            ordNo: data.ordNo,
          }));
        });
    }
  }, [productId]);

  useEffect(() => {
    const unit = parseInt(formValues.unitPrice);
    const qty = parseInt(formValues.goodsQty);
    if (!isNaN(unit) && !isNaN(qty)) {
      setFormValues((prev) => ({
        ...prev,
        goodsAmt: (unit * qty).toString(),
      }));
    }
  }, [formValues.goodsQty, formValues.unitPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const getPaymentInfo = async () => {
    const res = await fetch(`${API_BASE_URL}/api/payment/getPaymentinfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        merchantId: formValues.merchantId,
        mid: formValues.mid,
        goodsAmt: formValues.goodsAmt,
        goodsNm: formValues.goodsNm,
      }),
    });

    if (!res.ok) throw new Error("결제정보 요청 실패");
    const data = await res.json();
    setFormValues((prev) => ({
      ...prev,
      ...data,
    }));
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await getPaymentInfo();

    const form = document.createElement("form");
    form.method = "post";
    form.action = `/linkPayment/${productId}/confirmPayment/reConfirmPayment`;
    // form.target = "_blank";

    Object.entries(formValues).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h3>결제 정보</h3>

        <div className={styles.formGroup}>
          <label>상품명</label>
          <input
            type="text"
            name="goodsNm"
            value={formValues.goodsNm}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label>상품 금액</label>
          <input
            type="text"
            name="unitPrice"
            value={Number(formValues.unitPrice).toLocaleString()}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label>수량</label>
          <input
            type="number"
            name="goodsQty"
            min="1"
            value={formValues.goodsQty}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>결제금액</label>
          <input
            type="text"
            name="goodsAmt"
            value={Number(formValues.goodsAmt).toLocaleString()}
            onChange={handleChange}
            readOnly
          />
        </div>

        <button type="submit" className="cta">
          결제하기
        </button>
      </form>
    </div>
  );
}