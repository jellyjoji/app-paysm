"use client";
import styles from "./page.module.scss";
import { QrCode, ChevronRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";

export default function QrPayment() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = () => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      fetch(`${API_BASE_URL}/api/product/qrProductFindAllByUserId`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 403) {
              throw new Error("접근 권한이 없습니다. 결제 필수 정보 상태를 확인해주세요. MID 와 상점 Key 를 발급받아주세요.");
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
          setIsLoading(false);
        });
    } else {
      setError("로그인 토큰이 없습니다.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${API_BASE_URL}/api/product/delete/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('삭제 실패');

      alert('상품이 삭제되었습니다.');
      fetchProducts();
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('상품 삭제 중 오류 발생');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <ul className={styles.container__form}>
        <Link href="/qrPayment/addQrPayment">
          <li className={styles.container__form__content}>
            <button className={styles.container__form__content__addBtn}>
              <div className={styles.container__form__content__addBtn__title}>
                <span><QrCode /></span>
                <span>QR 결제 추가하기</span>
              </div>
              <ChevronRight />
            </button>
          </li>
        </Link>

        {isLoading && (
          <li className={styles.container__form__content}>
            <p>불러오는 중...</p>
          </li>
        )}

        {!isLoading && error && (
          <li className={styles.container__form__content}>
            <p style={{ color: "red" }}>{error}</p>
          </li>
        )}

        {!isLoading && !error && products.length > 0 && products.map((product) => (
          <li key={product.productId} className={styles.container__form__content}>
            <Link href={`/qrPayment/${product.productId}`}>
              <div className={styles.container__form__content__info}>
                <div className={styles.container__form__content__info__title}>
                  <h3>{product.goodsNm}</h3>
                  <p>{product.unitPrice.toLocaleString()} 원</p>
                </div>

                <div className={styles.container__form__content__info__btn}>
                  <button
                    onClick={(e) => handleDelete(product.productId, e)}
                    disabled={isDeleting}
                    className='cta delete'
                    aria-label="상품 삭제"
                    style={{ marginRight: "1rem" }}
                  >
                    {isDeleting ? '삭제 중...' : '삭제하기'}

                  </button>

                  <ChevronRight />
                </div>

              </div>
            </Link>
          </li>
        ))}

        {!isLoading && !error && products.length === 0 && (
          <li className={styles.container__form__content}>
            <p>구입한 상품이 없습니다.</p>
          </li>
        )}
      </ul>
    </div>
  );
}
