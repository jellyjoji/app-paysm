"use client"
import styles from './page.module.scss';
import { SlidersHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from "@/lib/api";


export default function PaymentHistory() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0); // 오늘 자정(00:00:00)
    return date;
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999); // 오늘 끝(23:59:59.999)
    return date;
  });

  const [showDatePicker, setShowDatePicker] = useState(true);
  const [payments, setPayments] = useState([]);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("전체");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const formatDate = (date) => date ? date.toISOString().split("T")[0] : null;

        const body = {
          startDate: formatDate(startDate) || "",
          endDate: formatDate(endDate) || "",
        };

        const res = await fetch(`${API_BASE_URL}/api/payment/getPaymentListByMerchant`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),

        });


        if (!res.ok)
          throw new Error("결제 목록 요청 실패");
        const data = await res.json();
        console.log(data);
        console.log("응답 상태 코드:", res.status);

        setPayments(data);
      } catch (err) {
        console.error("❌ 오류:", err);
        console.log("결제 목록을 불러오지 못했습니다.");
      }
    };

    fetchPayments();
  }, [startDate, endDate]);



  // ✅ 필터 처리
  const filtered = payments.filter((payment) => {
    if (activeTab === "전체") return true;
    if (activeTab === "완료") return payment.resultMsg === "정상처리" && payment.cancelYN === "N";
    if (activeTab === "미완료") return payment.resultMsg !== "정상처리";
    if (activeTab === "결제 취소") return payment.cancelYN === "Y"; // 👈 추가
  });

  return <div className={styles.container}>
    <div className={styles.container__tab}>
      <div className={styles.container__tab__item}>
        {["전체", "완료", "미완료", "결제 취소"].map((tab) => (
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
                setEndDate(date); // 자동 조정
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

    {filtered.map((payment) => (
      <ul key={payment.paymentId} className={styles.container__content}>
        <li className={styles.container__content__item} onClick={() => router.push(`/menu/paymentHistory/${payment.paymentId}`)}>
          <div className={styles.container__content__item__info}>
            <h4>{payment.goodsName}</h4>
            <p>{payment.amt.toLocaleString()}원</p>
          </div>
          <h2
            className={
              payment.cancelYN === "Y"
                ? "statusCanceled"
                : payment.resultMsg === "정상처리"
                  ? "statusDone"
                  : "statusPending"
            }
          >
            {payment.cancelYN === "Y"
              ? "결제 취소"
              : payment.resultMsg === "정상처리"
                ? "완료"
                : "미완료"}
          </h2>
        </li>
      </ul>
    ))}

  </div>
}