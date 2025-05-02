// pages/payment/index.jsx
"use client"

import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from "@/lib/api";
import Modal from 'react-modal';

// form	결제 요청을 위한 필수 및 선택 입력값을 포함. /payInit_hash.do로 전송됨.
// iframe + postMessage	iframe에서 응답을 받고, 그 데이터로 실제 결제를 요청.
// paymentRequest(receiveData)	payment.do API로 결제 요청 후, 결과를 받아 <form> 구성.
// paymentSuccess(form, data)	결제 성공 시, 서버에 결제 정보를 저장하고 최종 결과를 전송.
// fetch('/api/payment/successInfoAdd')	Next.js 서버 라우팅(API)으로 저장 요청 처리.

export default function reConfirmPayment() {
  const iframeRef = useRef(null);
  const formRef = useRef(null);
  const [encData, setEncData] = useState("5767354faf208c6fab4f6202f8babf71f1a587fe968d0ed4ca9f27cc58c78df5");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const data = event.data;
      const receiveData = data[1];
      paymentRequest(receiveData);
    });
  }, []);

  const paymentRequest = (receiveData) => {
    fetch("https://api.skyclassism.com/payment.do", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        tid: receiveData.tid,
        ediDate: receiveData.ediDate,
        mid: receiveData.mid,
        goodsAmt: receiveData.goodsAmt,
        charSet: receiveData.charSet,
        encData: encData,
        signData: receiveData.signData
      }),
    })
      .then(res => res.text())
      .then(response => {
        const response_json = JSON.parse(response);
        const form = document.createElement("form");
        form.method = "post";
        // 결제 성공시 리다이렉트 경로
        form.action = `/success`;

        Object.keys(response_json).forEach(key => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = response_json[key];
          form.appendChild(input);
        });

        const customFields = {
          payMethod: "CARD",
          unitPrice: document.getElementById("unitPrice").value,
          goodsQty: document.getElementById("goodsQty").value,
          merchantId: document.getElementById("merchantId").value
        };

        Object.keys(customFields).forEach(key => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = customFields[key];
          form.appendChild(input);
        });

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        paymentSuccess(form, data);
      })
      .catch(error => console.error("Error occurred:", error));
  };

  const paymentSuccess = (form, data) => {
    console.log('Payment Success Data:', data); // Add payment data logging

    fetch(`${API_BASE_URL}/api/payment/successInfoAdd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error("등록 실패");
        return res.json();
      })
      .then((response) => {
        console.log('Payment API Response:', response); // Add API response logging
        alert("결제 성공");
        document.body.appendChild(form);
        form.submit();
      })
      .catch(error => {
        console.error("오류 발생:", error);
        alert("결제 등록 중 오류 발생");
      });
  };

  return (
    <div>
      <form
        method="post"
        action="https://api.skyclassism.com/payInit_hash.do"
        target="responseIframe"
        id="postForm"
        ref={formRef}
      >
        <table>
          <tbody>
            <tr><td colSpan="2"><h3>필수</h3></td></tr>
            <tr>
              <td><label>결제수단</label></td>
              <td><input name="payMethod" defaultValue="CARD" /></td>
            </tr>
            <tr>
              <td><label>MID</label></td>
              <td><input name="mid" defaultValue="paysmtestm" /></td>
            </tr>
            <tr>
              <td><label>merchantId</label></td>
              <td><input id="merchantId" name="merchantId" defaultValue="MID-d493c260-2c80-4f46-a6e8-fdbcc66d6130" /></td>
            </tr>
            <tr>
              <td><label>상품명</label></td>
              <td><input name="goodsNm" defaultValue="111" /></td>
            </tr>
            <tr>
              <td><label>주문번호</label></td>
              <td><input name="ordNo" defaultValue="20250430161341-0206" /></td>
            </tr>
            <tr>
              <td><label>상품 금액</label></td>
              <td><input id="unitPrice" name="unitPrice" defaultValue="1000" /></td>
            </tr>
            <tr>
              <td><label>수량</label></td>
              <td><input id="goodsQty" name="goodsQty" defaultValue="1" /></td>
            </tr>
            <tr>
              <td><label>결제금액</label></td>
              <td><input name="goodsAmt" defaultValue="1000" /></td>
            </tr>
            <tr>
              <td><label>ediDate</label></td>
              <td><input name="ediDate" defaultValue="20250430163502" /></td>
            </tr>
            <tr>
              <td><label>encData</label></td>
              <td><input name="encData" defaultValue={encData} /></td>
            </tr>

            <tr><td colSpan="2"><h3>선택사항</h3></td></tr>
            <tr>
              <td><label>구매자연락처</label></td>
              <td><input name="ordTel" defaultValue="01000000000" /></td>
            </tr>
            <tr>
              <td><label>returnUrl</label></td>
              <td><input name="returnUrl" defaultValue="http://api.hitguys.net:80/payment/paymentAppRes" /></td>
            </tr>
            <tr>
              <td><label>trxCd</label></td>
              <td><input name="trxCd" defaultValue="0" /></td>
            </tr>
            <tr>
              <td><label>mbsUsrId</label></td>
              <td><input name="mbsUsrId" defaultValue="고객명" /></td>
            </tr>
            <tr>
              <td><label>mbsReserved</label></td>
              <td><input name="mbsReserved" defaultValue="reservedField" /></td>
            </tr>
            <tr>
              <td><label>charSet</label></td>
              <td><input name="charSet" defaultValue="UTF-8" /></td>
            </tr>
          </tbody>
        </table>

        <button className='cta' type="submit" onClick={openModal}>
          결제 요청 제출
        </button>
      </form>

      <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="결제 프레임 모달">
        <button onClick={closeModal}>모달 닫기</button>
        <iframe ref={iframeRef} name="responseIframe" style={{ width: "100%", height: "100vh", position: 'relative' }} />
      </Modal>
    </div>
  );
}