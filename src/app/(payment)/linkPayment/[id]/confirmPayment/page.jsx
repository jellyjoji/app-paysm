"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  useEffect(() => {
    console.log("경로에서 추출한 productId:", productId);
  }, [productId]);

  const [formValues, setFormValues] = useState({
    payMethod: "card",
    merchantId: "",
    mid: "",
    goodsNm: "",
    ordNo: "",
    unitPrice: "",
    goodsQty: 1,
    goodsAmt: "",
    ediDate: "",
    encData: "",
    ordTel: "01000000000",
    returnUrl: "/success",
    trxCd: "0",
    mbsUsrId: "고객명",
    charSet: "UTF-8",
  });

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
    <div className="container text-center mt-5">
      <form onSubmit={handleSubmit}>
        <h3 className="mb-5">필수</h3>
        {[
          { label: "결제수단", name: "payMethod" },
          { label: "merchantId", name: "merchantId" },
          { label: "MID", name: "mid" },
          { label: "상품명", name: "goodsNm" },
          { label: "주문번호", name: "ordNo" },
          { label: "상품 금액", name: "unitPrice" },
          { label: "결제금액", name: "goodsAmt" },
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label>{field.label}</label>
            <input
              type="text"
              className="form-control"
              name={field.name}
              value={formValues[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="form-group">
          <label>수량</label>
          <input
            type="number"
            className="form-control"
            name="goodsQty"
            min="1"
            value={formValues.goodsQty}
            onChange={handleChange}
          />
        </div>

        <h3 className="mt-5">선택사항</h3>
        {["ordTel", "returnUrl", "trxCd", "mbsUsrId", "charSet"].map((name) => (
          <div className="form-group" key={name}>
            <label>{name}</label>
            <input
              type="text"
              className="form-control"
              name={name}
              value={formValues[name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <button type="submit" className="btn btn-secondary mt-3">
          최종확인 페이지로 전달
        </button>
      </form>
    </div>
  );
}