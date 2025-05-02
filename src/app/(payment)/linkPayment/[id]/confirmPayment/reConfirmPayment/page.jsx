"use client";

import { useEffect } from 'react';
import Head from 'next/head';
import { API_BASE_URL } from "@/lib/api";
import { useParams } from "next/navigation";

export default function ReConfirmPayment() {
  const params = useParams();
  const productId = params?.id;
  useEffect(() => {
    console.log("경로에서 추출한 productId:", productId);
  }, [productId]);

  useEffect(() => {
    const unitPriceInput = document.getElementById("unitPrice");
    const goodsQty = document.getElementById("goodsQty");
    const goodsAmt = document.getElementById("goodsAmt");

    const getProductInfo = () => {
      fetch(`${API_BASE_URL}/api/product/${productId}`)
        .then((response) => {
          if (!response.ok) throw new Error("api 호출 실패");
          return response.json();
        })
        .then((data) => {
          document.getElementById("merchantId").value = data.merchantId;
          document.getElementById("mid").value = data.mid;
          document.getElementById("goodsNm").value = data.goodsNm;
          document.getElementById("unitPrice").value = data.unitPrice;
          document.getElementById("goodsAmt").value = data.unitPrice;
          document.getElementById("ordNo").value = data.ordNo;
        })
        .catch((error) => console.error("오류 발생:", error));
    };

    const updateAmount = () => {
      const unitPrice = parseInt(unitPriceInput.value.trim());
      const qty = parseInt(goodsQty.value);
      if (isNaN(unitPrice) || isNaN(qty)) {
        goodsAmt.value = "잘못된 값";
        return;
      }
      goodsAmt.value = unitPrice * qty;
    };

    goodsQty?.addEventListener("input", updateAmount);
    getProductInfo();
  }, []);

  const getPaymentInfo = (callback) => {
    const productId = new URLSearchParams(window.location.search).get("productId");
    const data = {
      productId,
      merchantId: document.getElementById("merchantId").value,
      mid: document.getElementById("mid").value,
      goodsAmt: document.getElementById("goodsAmt").value,
      goodsNm: document.getElementById("goodsNm").value,
    };

    fetch(`${API_BASE_URL}/api/payment/getPaymentinfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) throw new Error("결제정보 요청 실패");
        return response.json();
      })
      .then((result) => {
        document.getElementById("payMethod").value = result.payMethod;
        document.getElementById("mid").value = result.mid;
        document.getElementById("goodsNm").value = result.goodsNm;
        document.getElementById("unitPrice").value = result.goodsAmt;
        document.getElementById("goodsAmt").value = result.goodsAmt;
        document.getElementById("ediDate").value = result.ediDate;
        document.getElementById("encData").value = result.encData;
        if (callback) callback();
      })
      .catch((error) => console.error("오류 발생:", error));
  };

  const sendToInit = () => {
    getPaymentInfo(() => {
      const form = document.getElementById("postForm");
      const formData = new FormData(form);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      form.submit();
    });
  };

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="container text-center mt-5">
        <div className="row">
          <div className="col-4"></div>
          <div className="col-4">
            <form method="post" action="/payment/paymentInit" target="_blank" id="postForm">
              <div className="mb-5 h3">필수</div>
              <div className="form-group">
                <label htmlFor="payMethod">결제수단</label>
                <input type="text" className="form-control" id="payMethod" name="payMethod" defaultValue="card" />
              </div>
              <div className="form-group">
                <label htmlFor="merchantId">merchantId</label>
                <input type="text" className="form-control" id="merchantId" name="merchantId" />
              </div>
              <div className="form-group">
                <label htmlFor="mid">MID</label>
                <input type="text" className="form-control" id="mid" name="mid" />
              </div>
              <div className="form-group">
                <label htmlFor="goodsNm">상품명</label>
                <input type="text" className="form-control" id="goodsNm" name="goodsNm" />
              </div>
              <div className="form-group">
                <label htmlFor="ordNo">주문번호</label>
                <input type="text" className="form-control" id="ordNo" name="ordNo" />
              </div>
              <div className="form-group">
                <label htmlFor="unitPrice">상품 금액</label>
                <input type="text" className="form-control" id="unitPrice" name="unitPrice" />
              </div>
              <div className="form-group">
                <label>수량:</label>
                <input type="number" id="goodsQty" name="goodsQty" min="1" defaultValue="1" />
              </div>
              <div className="form-group">
                <label htmlFor="goodsAmt">결제금액</label>
                <input type="text" className="form-control" id="goodsAmt" name="goodsAmt" />
              </div>
              <input type="hidden" id="ediDate" name="ediDate" />
              <input type="hidden" id="encData" name="encData" />
              <div className="mt-5 h3">선택사항</div>
              <div className="form-group">
                <label htmlFor="ordTel">구매자연락처</label>
                <input type="text" className="form-control" id="ordTel" name="ordTel" defaultValue="01000000000" />
              </div>
              <div className="form-group">
                <label htmlFor="returnUrl">returnUrl</label>
                <input type="text" className="form-control" id="returnUrl" name="returnUrl" defaultValue="/payment/result" />
              </div>
              <div className="form-group">
                <label htmlFor="trxCd">trxCd</label>
                <input type="text" className="form-control" id="trxCd" name="trxCd" defaultValue="0" />
              </div>
              <div className="form-group">
                <label htmlFor="mbsUsrId">mbsUsrId</label>
                <input type="text" className="form-control" id="mbsUsrId" name="mbsUsrId" defaultValue="고객명" />
              </div>
              <div className="form-group">
                <label htmlFor="charSet">charSet</label>
                <input type="text" className="form-control" id="charSet" name="charSet" defaultValue="UTF-8" />
              </div>
              <div id="payInfoDiv"></div>
            </form>
            <button onClick={sendToInit} className="btn btn-secondary mt-3">
              최종확인 페이지로 전달
            </button>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </>
  );
}