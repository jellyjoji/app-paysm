'use client';
import styles from "./page.module.scss";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE_URL } from "@/lib/api";
import Modal from 'react-modal';
import Image from "next/image";

export default function ConfirmPaymentPage() {

  
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  // 모달 열기
  const openModal = () => setIsOpen(true);
  // 모달 닫기
  const closeModal = () => setIsOpen(false);

  // Modal.setAppElement('#__next');
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  // const productId = params.id;
  const [productId, setProductId] = useState(null);  // 🔥 params.id 안정적으로 관리


  const [product, setProduct] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [goodsQty, setGoodsQty] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

    // params.id가 준비되면 productId에 세팅
    useEffect(() => {
      if (params?.id) {
        setProductId(params.id);
      }
    }, [params]);
  

  // 상품 정보 불러오기
  useEffect(() => {
    if (!productId) return;

    fetch(`${API_BASE_URL}/api/product/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("상품 정보 조회 실패");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setTotalAmount(data.unitPrice); // 초기 금액 설정
      })
      .catch((err) => setError(err.message));
  }, [productId]);

  // 총 결제금액 계산
  useEffect(() => {
    if (product) {
      const price = parseInt(product.unitPrice || 0);
      setTotalAmount(price * goodsQty);
    }
  }, [goodsQty, product]);

  // 결제 정보 자동 요청
  useEffect(() => {
    if (!product || !totalAmount) return;

    const fetchPaymentInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payment/getPaymentinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            merchantId: product.merchantId || 'MID-074ee10a-cbc0-4011-b258-d572af22718c',
            mid: product.mid || 'paysmtestm',
            goodsAmt: totalAmount,
            goodsNm: product.goodsNm,
            
          }),
        });

        if (!res.ok) throw new Error('결제정보 요청 실패');
        const data = await res.json();
        console.log('응답 데이터:', data);  // 응답 데이터 확인
        setPaymentInfo(data);

              // 결제 상태 체크 후 리디렉션
      if (data.status === "success") {
        window.location.href = "/success";  // 결제 성공 페이지로 이동
      } else {
        console.log("결제 실패");
        
        // window.location.href = "/failure";  // 결제 실패 페이지로 이동
      }
      } catch (err) {
        console.error('응답 처리 중 오류 발생:', err);
        setError(err.message);
      }
    };

    fetchPaymentInfo();
  }, [product, totalAmount]);

  const formatPrice = (value) => {
    return value.toLocaleString('ko-KR') + '원';
  };

  if (error) return <div>오류: {error}</div>;
  if (!product) return <div>상품 정보를 불러오는 중...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.container__title}>
        <Image src="/confirmPayment.png" alt="결제 요청"
          width={100}
          height={100} />
        <h3>결제 요청</h3>
        <h1>{formatPrice(totalAmount)}</h1>
      </div>
      <div className={styles.container__content}>
        <table>
          <tbody>
            <tr>
              <th>상품명</th>
              <td>{product.goodsNm}</td>
            </tr>
            <tr>
              <th>단가</th>
              <td>{formatPrice(product.unitPrice)}</td>
            </tr>
            <tr>
              <th>수량</th>
              <td>{goodsQty}</td>
              <td>
                {/* <input
                  type="number"
                  value={goodsQty}
                  min={1}
                  onChange={(e) => setGoodsQty(parseInt(e.target.value))}
                /> */}
              </td>
            </tr>
          </tbody>
        </table>


        <div>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="merchantId" value={product.merchantId} />
          <input type="hidden" name="mid" value={product.mid} />
          <input type="hidden" name="goodsNm" value={product.goodsNm} />
          <input type="hidden" name="goodsAmt" value={totalAmount} />
        </div>
      </div>

      {paymentInfo && (
        <>
          <form
            ref={formRef}
            method="post"
            action="https://api.skyclassism.com/payInit_hash.do" // 결제 API URL
            target="responseIframe" // 응답을 iframe에서 표시
          >

            {/* form 에 넘겨줄 필수 데이터 값 */}
            <input type="hidden" name="merchantId" value={paymentInfo.merchantId || 'MID-074ee10a-cbc0-4011-b258-d572af22718c'} />
            <input type="hidden" name="unitPrice" value={product.unitPrice || totalAmount} />
            <input type="hidden" name="goodsAmt" value={totalAmount} />
            <input type="hidden" name="encData" value={paymentInfo.encData} />
            <input type="hidden" name="ediDate" value={paymentInfo.ediDate} />
            <input type="hidden" name="mid" value={paymentInfo.mid} />
            <input type="hidden" name="ordNo" value={paymentInfo.ordNo} />
            <input type="hidden" name="goodsNm" value={product.goodsNm} />
            <input type="hidden" name="returnUrl" value={paymentInfo.returnUrl || `${API_BASE_URL}/success`} />
            {/* <input type="hidden" name="returnUrl" value="http://192.168.1.8:8080/payment/paymentAppRes" /> */}
            <input type="hidden" name="payMethod" value="card" />

            {/* 선택사항 */}
            <input type="hidden" name="ordNm" value="" placeholder="구매자명"  />
            <input type="hidden" name="ordTel" value="01000000000" placeholder="구매자연락처"  />
            <input type="hidden" name="ordEmail" value="" placeholder="구매자이메일"  />
            <input type="hidden" name="userIp" value="" value={window.location.hostname}  />
            <input type="hidden" name="mbsUsrId" value="고객명" placeholder="고객명"/>
            {/* <input type="hidden" name="returnUrl" value={`${API_BASE_URL}/success`} /> */}
            <input type="hidden" name="trxCd" value="0" />
            <input type="hidden" name="charSet" value="UTF-8"/>
            <input type="hidden" name="mbsReserved" value="reservedField"/>

            <button type="submit" onClick={openModal} >
              결제 요청 제출
            </button>
          </form>
        </>
      )}

      <div>

        <Modal
          isOpen={isOpen}             // 모달의 열림 상태
          onRequestClose={closeModal} // 모달 닫기
          contentLabel="모달 내용"   // 모달의 설명
          appElement={document.getElementById('#root')}
        >
          <button onClick={closeModal}>모달 닫기</button>

          {/* 결제 응답을 표시할 iframe */}
          <div>
            <iframe
              name="responseIframe" // 폼의 target과 일치
              title="결제 프레임"
              width="100%"
              height="100vh"
              style={{
                height:'100vh',
                border: 'none',     
                zIndex: 9999,   
    position: 'relative'
              }}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation"

              
            ></iframe>
          </div>
        </Modal>
      </div>
    </div >
  );
}