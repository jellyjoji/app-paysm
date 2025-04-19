"use client"
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function PurchasedProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 JWT 토큰 가져오기
    const token = localStorage.getItem("jwtToken");
    console.log("토큰 확인: ", token);


    if (token) {
      // 상품 목록 데이터 요청
      fetch(`${API_BASE_URL}/product/linkProductFindAllByUserId`, {
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
    <div>
      <h2>구입한 상품 목록</h2>
      <ul>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.productId}>
              <h3>{product.goodsNm}</h3>
              <p>가격: {product.unitPrice} 원</p>
              <p>결제 방식: {product.payType}</p>
              <p>상품 ID: {product.productId}</p>
              <p>상점 ID: {product.mid}</p>
            </li>
          ))
        ) : (
          <p>구입한 상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
