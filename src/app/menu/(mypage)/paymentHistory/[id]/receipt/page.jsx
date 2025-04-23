"use client";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function ReceiptPage() {
  const { id } = useParams();
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    const fetchReceipt = async () => {
      try {
        if (!id) {
          throw new Error("ID가 없습니다.");
        }

        // 1. id로 결제 상세정보에서 tid 추출
        const detailRes = await fetch(`${API_BASE_URL}/api/payment/getPaymentDetail/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!detailRes.ok) {
          console.error("결제 상세 정보 응답 상태:", detailRes.status, detailRes.statusText);
          throw new Error("결제 상세 정보 불러오기 실패");
        }

        const detailData = await detailRes.json();
        const tid = detailData.tid;

        if (!tid) throw new Error("TID가 없습니다");

        // 2. tid로 영수증 정보 조회
        const receiptRes = await fetch(`${API_BASE_URL}/api/payment/receipt/${tid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!receiptRes.ok) {
          console.error("영수증 응답 상태:", receiptRes.status, receiptRes.statusText);
          throw new Error("영수증 조회 실패");
        }

        const receiptJson = await receiptRes.json();
        setReceiptData(receiptJson);
      } catch (err) {
        console.error("❌ 영수증 조회 오류:", err);
        alert("영수증을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>로딩 중...</p>;
  if (!receiptData) return <p style={{ padding: 20 }}>영수증 정보를 불러올 수 없습니다.</p>;

  return (
    <div className={styles.container}>
      <dl>
        {Object.entries(receiptData).map(([key, value]) => (
          <div key={key} className={styles.container__content}>
            <dt className={styles.container__content__title}>{key}</dt>
            <dd className={styles.container__content__value}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
