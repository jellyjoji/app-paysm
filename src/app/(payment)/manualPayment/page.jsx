"use client"

import styles from "./page.module.scss";
import { useEffect, useRef, useState } from 'react';
import { ScanLine, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export default function ManualPayment() {
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({
    cpCd: '01',
    cardTypeCd: '01',
    cardNo: '',
    expireYymm: '',
    ordAuthNo: '',
    cardPw: '',
    quotaMon: '00',
    goodsAmt: '1000',
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
    goodsNm: '수기결제',
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

  useEffect(() => {
    const expiryInput = inputRef.current;

    const handleInput = (e) => {
      let value = e.target.value;

      // 숫자만 추출
      value = value.replace(/\D/g, '');

      // 4자리로 제한 (MM/YY)
      value = value.slice(0, 4);

      // MM/YY 형식으로 포맷팅
      if (value.length >= 2) {
        // 월이 12를 넘지 않도록
        let month = parseInt(value.slice(0, 2));
        if (month > 12) month = 12;
        if (month < 1) month = 1;
        month = month.toString().padStart(2, '0');

        value = month + (value.length > 2 ? '/' + value.slice(2) : '');
      }

      e.target.value = value;

      // formData 업데이트
      setFormData(prev => ({
        ...prev,
        expireYymm: value.replace('/', '') // 저장할 때는 구분자 제거
      }));
    };

    if (expiryInput) {
      expiryInput.addEventListener('input', handleInput);
      return () => expiryInput.removeEventListener('input', handleInput);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNo') {
      // 숫자만 추출
      const numericValue = value.replace(/[^\d]/g, '');

      // 16자리로 제한
      const truncatedValue = numericValue.slice(0, 16);

      // 4자리마다 하이픈 추가
      const formattedValue = truncatedValue.replace(/(\d{4})(?=\d)/g, '$1-');

      setFormData(prev => ({
        ...prev,
        [name]: numericValue // 저장은 숫자만
      }));

      // 화면에는 하이픈이 포함된 형식으로 표시
      e.target.value = formattedValue;
      return;
    }

    if (name === 'goodsAmt') {
      const numericValue = value.replace(/[^\d]/g, '');
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      e.target.value = formattedValue;
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

        {/* <Link href="/manualPayment/scanCard">
          <div className={styles.container__form__content}>
            <button className={styles.container__form__content__addBtn}>
              <div className={styles.container__form__content__addBtn__title}>
                <span><ScanLine /></span>
                <span>카드 번호 스캔하기</span>
              </div>
              <ChevronRight />
            </button>
          </div>
        </Link> */}

        <div className={styles.container__form__content}>
          <label htmlFor="cpCd">카드사</label>
          <select id="cpCd" name="cpCd" value={formData.cpCd} onChange={handleChange}>
            <option value="01">비씨</option>
            <option value="02">국민</option>
            <option value="03">하나</option>
            <option value="04">삼성</option>
            <option value="06">신한</option>
            <option value="07">현대</option>
            <option value="08">롯데</option>
            <option value="12">농협</option>
          </select>
        </div>

        <div className={styles.container__form__content}>
          <label>카드구분</label>
          <div className={styles.container__form__content__radio}>
            <label>
              <input
                type="radio"
                name="cardTypeCd"
                value="01"
                checked={formData.cardTypeCd === '01'}
                onChange={handleChange}
              />
              개인
            </label>
            <label>
              <input
                type="radio"
                name="cardTypeCd"
                value="02"
                checked={formData.cardTypeCd === '02'}
                onChange={handleChange}
              />
              법인
            </label>
          </div>
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="cardNo">카드번호</label>
          <input
            type="text"
            name="cardNo"
            id="cardNo"
            value={formData.cardNo.replace(/(\d{4})(?=\d)/g, '$1-')}
            onChange={handleChange}
            placeholder="1234-5678-9012-3456"
            inputMode="numeric"
            maxLength="19"
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="ordAuthNo">생년월일 혹은 사업자등록번호</label>
          <input
            type="text"
            name="ordAuthNo"
            id="ordAuthNo"
            value={formData.ordAuthNo}
            onChange={handleChange}
            placeholder="생년월일 6자리 혹은 사업자등록번호 10자리"
            maxLength="10"
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="expireYymm">유효기간</label>
          <input
            type="text"
            name="expireYymm"
            id="expireYymm"
            value={formData.expireYymm.replace(/(\d{2})(?=\d)/, '$1/')}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength="5"
            inputMode="numeric"
            ref={inputRef}
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="cardPw">비밀번호</label>
          <input
            type="password"
            name="cardPw"
            id="cardPw"
            value={formData.cardPw}
            onChange={handleChange}
            placeholder="앞 2자리"
            maxLength="2"
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="quotaMon">할부개월</label>
          <select
            id="quotaMon"
            name="quotaMon"
            value={formData.quotaMon}
            onChange={handleChange}
          >
            <option value="00">일시불</option>
            <option value="02">2개월</option>
            <option value="03">3개월</option>
            <option value="04">4개월</option>
            <option value="05">5개월</option>
            <option value="06">6개월</option>
            <option value="07">7개월</option>
            <option value="08">8개월</option>
            <option value="09">9개월</option>
            <option value="10">10개월</option>
            <option value="11">11개월</option>
            <option value="12">12개월</option>
          </select>
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="goodsAmt">결제 금액</label>
          <input
            type="text"
            name="goodsAmt"
            id="goodsAmt"
            value={formData.goodsAmt.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={handleChange}
            placeholder="결제 금액을 입력하세요"
            inputMode="numeric"
          />
        </div>

        <button type="submit" className='cta'>
          결제 요청하기
        </button>
      </form>
    </div>
  );
}