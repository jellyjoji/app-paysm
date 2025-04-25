"use client"

import styles from "./page.module.scss";
import { useEffect, useRef } from 'react';
import { ScanLine, ChevronRight } from 'lucide-react';
import Link from "next/link";

export default function ManualPayment() {
  const inputRef = useRef(null);

  useEffect(() => {
    const expiryInput = inputRef.current;

    const handleInput = (e) => {
      let value = e.target.value.replace(/\D/g, '').slice(0, 4); // 숫자만, 최대 4자리 (MMYY)
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      e.target.value = value;
    };

    expiryInput.addEventListener('input', handleInput);
    return () => expiryInput.removeEventListener('input', handleInput);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  }


  return <>
    <div className={styles.container}>
      <div className={styles.container__form} onSubmit={handleSubmit}>
        <Link href="/manualPayment/scanCard">
          <div className={styles.container__form__content}>
            <button className={styles.container__form__content__addBtn}>
              <div className={styles.container__form__content__addBtn__title}>
                <span> <ScanLine /></span>
                <span>카드 번호 스캔하기</span>
              </div>
              <ChevronRight />
            </button>
          </div>
        </Link>

        <div className={styles.container__form__content}>
          <label htmlFor="cardNumber">카드번호</label>
          <input type="text" name="cardNumber" id="cardNumber" placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            maxLength="19" />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="businessNumber">생년월일 혹은 사업자등록번호</label>
          <input type="text" name="businessNumber" id="businessNumber" placeholder="123-45-67890" />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="cardExpiry">유효기간</label>
          <input type="text" name="cardExpiry" id="cardExpiry" placeholder="MM/YY"
            maxLength="5"
            inputMode="numeric"
            ref={inputRef}
          />

          <label htmlFor="cardPassword">비밀번호</label>

          <input
            type="password"
            name="cardPassword"
            id="cardPassword"
            placeholder="앞 2자리"
            maxLength="2"
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="cardPassword">비밀번호</label>

          <input
            type="password"
            name="cardPassword"
            id="cardPassword"
            placeholder="앞 2자리"
            maxLength="2"
          />
        </div>

      </div>
    </div>
  </>
}