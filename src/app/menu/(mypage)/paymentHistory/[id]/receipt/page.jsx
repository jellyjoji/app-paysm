"use client"
import styles from "./page.module.scss";

export default function ReceiptPage() {

  return (
    <div className={styles.container}>
      <dl>
        {/* {receiptData.map((item, index) => ( */}
        <div className={styles.container__content}>
          <dt className={styles.container__content__title}>결제 수단</dt>
          <dd className={styles.container__content__value}>신용카드</dd>
        </div>
        {/* ))} */}
      </dl>
      <dl>
        <div className={styles.container__content}>
          <dt className={styles.container__content__title}>결제 일시</dt>
          <dd className={styles.container__content__value}>
            <time dateTime="2025-04-11T15:30:00">2025년 4월 11일 15:30</time>
          </dd>
        </div>
      </dl>

    </div>
  );
}