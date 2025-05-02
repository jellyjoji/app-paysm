"use client"

import styles from "./page.module.scss";
import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from "@/lib/api";

export default function ManualPayment() {
  const [formData, setFormData] = useState({
    // 화면에 표시할 필드
    goodsNm: '수기결제',
    unitPrice: '',
    goodsQty: '1',
    goodsAmt: '',
    
    // 시스템 필드 (숨김)
    cpCd: '01',
    cardTypeCd: '01',
    cardNo: '',
    expireYymm: '',
    ordAuthNo: '',
    cardPw: '',
    quotaMon: '00',
    payMethod: 'card',
    mid: '',
    merchantKey: '',
    merchantId: '',
    notiUrl: '/result',
    returnUrl: '/result',
    ordEmail: 'skyclass@gmail.com',
    ordTel: '',
    ordNm: '',
    ordNo: '',
    userIp: '127.0.0.1',
    trxCd: '0',
    noIntFlg: '0',
    pointFlg: '0',
    mbsReserved: 'MallReserved',
    charSet: 'UTF-8'
  });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    fetch(`${API_BASE_URL}/api/payment/getKeyInPaymentInfo`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("상품 조회 실패");
        return res.json();
      })
      .then(data => {
        setFormData(prev => ({
          ...prev,
          mid: data.mid || "",
          merchantKey: data.merchantKey || "",
          merchantId: data.merchantId || "",
          ordTel: data.ordTel || "",
          ordNm: data.ordNm || "",
          ordNo: data.ordNo || ""
        }));
      })
      .catch(err => {
        console.error("에러 발생:", err);
        alert("정보를 가져오는 중 문제가 발생했습니다.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'unitPrice' || name === 'goodsQty') {
      const numericValue = value.replace(/[^\d]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));

      if (name === 'unitPrice' || name === 'goodsQty') {
        const unitPrice = name === 'unitPrice' ? numericValue : formData.unitPrice;
        const goodsQty = name === 'goodsQty' ? numericValue : formData.goodsQty;
        const goodsAmt = (parseInt(unitPrice) || 0) * (parseInt(goodsQty) || 0);
        setFormData(prev => ({
          ...prev,
          goodsAmt: goodsAmt.toString()
        }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${API_BASE_URL}/api/payment/keyInPaymentReq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("요청 실패");

      const result = await response.json();

      if (result.resultCd === '0000') {
        alert("결제가 완료되었습니다.");
      } else {
        alert(`결제 오류: ${result.resultMsg} (${result.resultCd})`);
      }
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
      alert("결제 요청 실패");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.container__form} onSubmit={handleSubmit}>
        <div className={styles.container__form__content}>
          <label htmlFor="goodsNm">상품명</label>
          <input
            type="text"
            name="goodsNm"
            id="goodsNm"
            value={formData.goodsNm}
            onChange={handleChange}
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="unitPrice">상품 금액</label>
          <input
            type="text"
            name="unitPrice"
            id="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            placeholder="상품 금액을 입력하세요"
            inputMode="numeric"
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="goodsQty">수량</label>
          <input
            type="number"
            name="goodsQty"
            id="goodsQty"
            value={formData.goodsQty}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="goodsAmt">결제 금액</label>
          <input
            type="text"
            name="goodsAmt"
            id="goodsAmt"
            value={formData.goodsAmt.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            readOnly
          />
        </div>

        <button type="submit" className='cta'>
          결제 요청하기
        </button>
      </form>
    </div>
  );
}