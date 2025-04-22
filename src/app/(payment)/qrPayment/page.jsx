"use client"
import styles from "./page.module.scss";
import { QrCode, ChevronRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";

export default function QrPayment() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 JWT 토큰 가져오기
    const token = localStorage.getItem("jwtToken");
    console.log("토큰 확인: ", token);


    if (token) {
      // 상품 목록 데이터 요청
      fetch(`${API_BASE_URL}/api/product/linkProductFindAllByUserId`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`, // 인증 토큰 포함
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("상품 목록을 불러오는 데 실패했습니다.");
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data); // 받은 데이터를 상태로 설정
        })
        .catch((err) => {
          setError(err.message); // 에러 처리
        });
    } else {
      setError("로그인 토큰이 없습니다.");
    }
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  if (error) {
    return <p>{error}</p>; // 에러 메시지 출력
  }

  return (
    <div className={styles.container}>

      <ul className={styles.container__form}>
        <Link href="/linkPayment/addQrPayment">

          <div className={styles.container__form__content}>
            <button className={styles.container__form__content__addBtn}>
              <div className={styles.container__form__content__addBtn__title}>
                <span>
                  <QrCode />
                </span>
                <span>QR 결제 추가하기</span>
              </div>

              <ChevronRight />

            </button>
          </div>
        </Link>

        {products.length > 0 ? (
          products.map((product) => (

            <li key={product.productId} className={styles.container__form__content}>
              <Link href={`/linkPayment/${product.productId}`}>
                <div className={styles.container__form__content__info}>
                  <div className={styles.container__form__content__info__title}>
                    <h3>{product.goodsNm}</h3>
                    <p>{product.unitPrice} 원</p>
                    {/* <p>{product.payType}</p> */}
                    {/* <p>상품 ID: {product.productId}</p>
              <p>상점 ID: {product.mid}</p> */}
                  </div>
                  <ChevronRight />
                </div>
              </Link>

            </li>

          ))
        ) : (
          <p>구입한 상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}