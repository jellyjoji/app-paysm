"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function ConfirmPayment() {
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
      <form className={styles.container__content} onSubmit={handleSubmit}>
        <div>
          <div>상품 금액</div>
          <div>{Number(formValues.unitPrice).toLocaleString()}원</div>
        </div>
        <table className={styles.paymentTable}>
          <tbody>
            <tr>
              <th>상품명</th>
              <td>{formValues.goodsNm}</td>
            </tr>
            <tr>
              <th>결제금액</th>
              <td>{Number(formValues.goodsAmt).toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>


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

        <button type="submit" className="cta">
          결제하기
        </button>
      </form>
    </div>
  );
}