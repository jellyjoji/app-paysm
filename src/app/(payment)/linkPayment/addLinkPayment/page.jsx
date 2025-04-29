"use client";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function AddLinkPayment() {
  const [goodsNm, setGoodsNm] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // JWT 토큰 로컬스토리지에서 가져오기
    const storedToken = localStorage.getItem("jwtToken");
    setToken(storedToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 토큰이 없으면 로그인 유도
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
      const res = await fetch(`${API_BASE_URL}/api/product/productAdd`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("상품 등록 실패");

      const result = await res.json();

      // 상품 등록 성공 메시지와 페이지 리다이렉트
      alert(result.message);
      if (result.code === 200) {

        router.push("/linkPayment");
      }
    } catch (err) {
      console.error(err);
      alert("상품 등록 중 오류 발생");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.container__form}>
        <div className={styles.container__form__content}>
          <label htmlFor="goodsNm">상품명</label>
          <input
            type="text"
            name="goodsNm"
            id="goodsNm"
            value={goodsNm}
            onChange={(e) => setGoodsNm(e.target.value)}
            placeholder="상품명"
            required
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="unitPrice">상품 가격</label>
          <input
            type="number"
            name="unitPrice"
            id="unitPrice"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="상품 가격"
            required
          />
        </div>

        <button className='cta' type="submit">상품 등록</button>
      </form>
    </div>
  );
}