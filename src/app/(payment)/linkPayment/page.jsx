"use client";
import styles from "./page.module.scss";
import { Link2, ChevronRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";

export default function LinkPayment() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ 로딩 상태 추가

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      fetch(`${API_BASE_URL}/api/product/linkProductFindAllByUserId`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 403) {
              throw new Error("접근 권한이 없습니다. 로그인 상태를 확인해주세요.");
            }
            throw new Error("상품 목록을 불러오는 데 실패했습니다.");
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false); // ✅ 로딩 종료
        });
    } else {
      setError("로그인 토큰이 없습니다.");
      setIsLoading(false); // ✅ 토큰이 없을 때도 로딩 종료
    }
  }, []);

  return (
    <div className={styles.container} >
      <ul className={styles.container__form}>
        <Link href="/linkPayment/addLinkPayment">
          <li className={styles.container__form__content}>
            <button className={styles.container__form__content__addBtn}>
              <div className={styles.container__form__content__addBtn__title}>
                <span><Link2 /></span>
                <span>링크 결제 추가하기</span>
              </div>
              <ChevronRight />
            </button>
          </li>
        </Link>

        {/* ✅ 로딩 중일 때 표시 */}
        {isLoading && (
          <li className={styles.container__form__content}>
            <p>로딩 중...</p>
          </li>
        )}

        {/* ✅ 에러 메시지 표시 */}
        {!isLoading && error && (
          <li className={styles.container__form__content}>
            <p style={{ color: "red" }}>{error}</p>
          </li>
        )}

        {/* ✅ 상품 목록 출력 */}
        {!isLoading && !error && products.length > 0 && (
          products.map((product) => (
            <li key={product.productId} className={styles.container__form__content}>
              <Link href={`/linkPayment/${product.productId}`}>
                <div className={styles.container__form__content__info}>
                  <div className={styles.container__form__content__info__title}>
                    <h3>{product.goodsNm}</h3>
                    <p>{product.unitPrice} 원</p>
                  </div>
                  <ChevronRight />
                </div>
              </Link>
            </li>
          ))
        )}

      </ul>
    </div>
  );
}
