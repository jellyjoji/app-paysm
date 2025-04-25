'use client';

import { useEffect, useState } from 'react';

import { API_BASE_URL } from "@/lib/api";
import { use } from 'react';

export default function ReceiptPage({ params }) {
  // const tid = params.id;
  const { id: tid } = use(params);

  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);
  console.log("tid : " + tid);



  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    console.log("token : " + token);
    console.log("fetch URL: ", `${API_BASE_URL}/api/payment/receipt/${tid}`);

    if (!tid) {
      setError('TID가 없습니다.');
      return;
    }

    fetch(`${API_BASE_URL}/api/payment/receipt/${tid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

      .then((res) => {
        console.log("response status:", res.status); // 401, 403, 500 등
        if (!res.ok) throw new Error('영수증 조회 실패');
        return res.json();
      })
      .then((data) => setReceipt(data))
      .catch((err) => {
        console.error(err);
        setError('영수증 정보를 불러오지 못했습니다.');
      });
  }, [tid]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">결제 영수증</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <table className="table table-bordered">
        <tbody>
          {receipt &&
            Object.entries(receipt).map(([key, value]) => (
              <tr key={key}>
                <th className="text-end">{key}</th>
                <td>{value}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="text-center">
        <button onClick={() => window.close()} className="btn btn-secondary">
          닫기
        </button>
      </div>
    </div>
  );
}
