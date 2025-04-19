"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function AddLinkPaymentPage() {
  const [goodsNm, setGoodsNm] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    setToken(storedToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const data = {
      goodsNm,
      unitPrice: parseInt(unitPrice),
      payType: "LINK"
    };

    try {
      const res = await fetch(`${API_BASE_URL}/product/productAdd`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("상품 등록 실패");

      const result = await res.json();

      alert(result.message);
      if (result.code === 200) {
        router.push(`${API_BASE_URL}/product/linkPayList`);
      }
    } catch (err) {
      console.error(err);
      alert("상품 등록 중 오류 발생");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>링크 결제 상품 추가</h2>
      <form onSubmit={handleSubmit}>
        <label>
          상품명
        </label>
        <input
          type="text"
          value={goodsNm}
          onChange={(e) => setGoodsNm(e.target.value)}
          required
        />

        <label style={{ display: "block", marginTop: 15, fontWeight: "bold" }}>
          단가
        </label>
        <input
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />

        <button
          type="submit"

        >
          상품 등록
        </button>
      </form>
    </div>
  );
}
