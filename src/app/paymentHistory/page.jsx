"use client"
import styles from './page.module.scss';
import { SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default function PaymentHistory() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);


  const [activeTab, setActiveTab] = useState("전체");
  const tasks = [
    { id: 1, product: "상품1", price: '9,9000원', name: '김이름', done: true },
    { id: 2, product: "상품2", price: '9,9000원', name: '김이름', done: false },
    { id: 3, product: "상품3", price: '9,9000원', name: '김이름', done: true },
    { id: 4, product: "상품4", price: '9,9000원', name: '김이름', done: false },
  ];
  const filtered = tasks.filter((task) => {
    if (activeTab === "전체") return true;
    if (activeTab === "완료") return task.done;
    if (activeTab === "미완료") return !task.done;
  });

  return <div className={styles.container}>
    <div className={styles.container__tab}>
      <div className={styles.container__tab__item}>
        {["전체", "완료", "미완료"].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? 'active' : ""
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <button onClick={() => setShowDatePicker((prev) => !prev)}>
        <SlidersHorizontal />
      </button>
    </div>
    {showDatePicker && (

      <div className={`${styles.container__date} ${showDatePicker ? styles.show : ''}`}>
        <div>
          <label>시작 날짜: </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) {
                setEndDate(null); // 시작일이 종료일보다 크면 종료일 초기화
              }
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="시작일 선택"
          />
        </div>
        <p>~</p>
        <div>
          <label>종료 날짜: </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="종료일 선택"
          />
        </div>
      </div>
    )}

    {filtered.map((task) => (
      <ul key={task.id} className={styles.container__content}>
        <li className={styles.container__content__item}>
          <div className={styles.container__content__item__info}>
            <h4>{task.product}</h4>
            <p>{task.price}</p>
          </div>
          <h2 className={
            task.done ? 'statusDone' : 'statusPending'
          }>{task.done ? "완료" : "미완료"}</h2>
        </li>
      </ul>
    ))}

  </div>
}