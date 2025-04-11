"use client"
import styles from "./page.module.scss";
import React, { useState } from 'react';

export default function PaymentInfo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleSegmentChange = (index) => {
    setSelectedIndex(index);
  };

  return <div className={styles.container}>
    <div className={styles.container__segmentedControl}>
      <div className={styles.container__segmentedControl__content}>
        <button
          className={`${styles.container__segmentedControl__content__option} ${selectedIndex === 0 ? styles.active : ''}`}
          onClick={() => handleSegmentChange(0)}
        >
          링크 결제
        </button>
      </div>
      <div className={styles.container__segmentedControl__content}>
        <button
          className={`${styles.container__segmentedControl__content__option} ${selectedIndex === 1 ? styles.active : ''}`}
          onClick={() => handleSegmentChange(1)}
        >
          수기 결제
        </button>
      </div>
    </div>
    <div className={styles.container__content}>
      <label>Merchant ID</label>
      <input type="text" value="HERE" readOnly />
    </div>

    <div className={styles.container__content}>
      <label>상점 Key</label>
      <input type="text" value="HERE" readOnly />
    </div>
  </div >
}