"use client"
import styles from "./page.module.scss";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function PaymentInfo() {
  const [merchantKey, setMerchantKey] = useState("");
  const [mid, setMid] = useState("");
  const [isEditMode, setIsEditMode] = useState(true); // 초기엔 수정모드로

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleSegmentChange = (index) => {
    setSelectedIndex(index);
  };
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    const fetchMerchantInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/merchant/getMerchantInfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });


        console.log("HTTP Status:", res.status);
        const data = await res.json();
        console.log("Parsed JSON:", data);

        if (data.code === "200") {
          setMerchantKey(data.response.merchantKey);
          setMid(data.response.mid);
        } else {
          alert(data.message);
          setIsEditMode(true); // 등록 모드로 전환
        }
      } catch (err) {
        console.error("에러 발생:", err);
        alert("상점 정보 불러오기 실패");
      }
    };

    fetchMerchantInfo();
  }, []);
  const handleSubmit = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!merchantKey || !mid) {
      alert("상점키와 상점아이디를 모두 입력하세요.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/merchant/addMerchant`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ merchantKey, mid }),
      });

      if (res.status === 401 || res.status === 403) {
        alert("인증 실패. 로그인 페이지로 이동합니다.");
        router.replace("/login");
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("서버 응답 오류:", text);
        alert("상점 등록 실패");
        return;
      }

      const result = await res.json();
      alert(result.message || "등록 완료");
      setIsEditMode(false);
    } catch (err) {
      console.error("등록 오류:", err);
      alert("상점 등록 중 오류 발생");
    }
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
      <label htmlFor="mid">Merchant ID</label>
      <input
        id="mid"
        type="text"
        value={mid}
        onChange={(e) => setMid(e.target.value)}
        disabled={!isEditMode}
      />
    </div>

    <div className={styles.container__content}>
      <label htmlFor="merchantKey">상점 Key</label>
      <input
        id="merchantKey"
        type="text"
        value={merchantKey}
        onChange={(e) => setMerchantKey(e.target.value)}
        disabled={!isEditMode}
      />
    </div>

    {isEditMode ? (
      <button onClick={handleSubmit}>등록</button>
    ) : (
      <button onClick={() => setIsEditMode(true)}>수정</button>
    )}
  </div >
}