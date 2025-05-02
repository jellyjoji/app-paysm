"use client"
import Image from 'next/image';
import styles from "./page.module.scss";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Success() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Convert URL search params to object
    const data = {};
    searchParams.forEach((value, key) => {
      data[key] = value;
    });
    setPaymentData(data);
  }, [searchParams]);

  // Payment data fields to display
  const displayFields = [
    { key: 'goodsName', label: '상품명' },
    { key: 'amt', label: '결제금액' },
    { key: 'payMethod', label: '결제수단' },
    { key: 'fnNm', label: '카드사' },
    { key: 'cardNo', label: '카드번호' },
    { key: 'quota', label: '할부' },
    { key: 'appNo', label: '승인번호' },
    { key: 'appDtm', label: '승인일시' },
    { key: 'resultMsg', label: '결제결과' }
  ];

  return (
    <div className={styles.container}>
      <Image src="/success.png" alt="결제 성공"
        width={130}
        height={130} />
      <h2>결제에 성공하였습니다.</h2>

      {paymentData && (
        <div className={styles.paymentDetails}>
          <table>
            <tbody>
              {displayFields.map(({ key, label }) => (
                paymentData[key] && (
                  <tr key={key}>
                    <th>{label}</th>
                    <td>
                      {key === 'amt'
                        ? `${Number(paymentData[key]).toLocaleString()}원`
                        : key === 'quota'
                          ? paymentData[key] === '00'
                            ? '일시불'
                            : `${paymentData[key]}개월`
                          : key === 'cardNo'
                            ? `${paymentData[key].slice(-4).padStart(paymentData[key].length, '*')}`
                            : paymentData[key]
                      }
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
