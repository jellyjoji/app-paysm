"use client"
import Image from 'next/image';
import styles from "./page.module.scss";

export default function Success() {


  // const data = [
  //   ['charSet', 'UTF-8'],
  //   ['resultCd', '0000'],
  //   ['acqCardCd', '06'],
  //   ['cancelYN', 'N'],
  //   ['cardType', '0'],
  //   ['mid', 'paysmtestm'],
  //   ['appNo', '32583497'],
  //   ['amt', '1000'],
  //   ['cardNo', '624331001114'],
  //   ['tid', 'paysmtestm01012504301227050282'],
  //   ['resultMsg', '정상처리'],
  //   ['ordNm', ''],
  //   ['ordNo', '20250430122701-0087'],
  //   ['mbsReserved', 'reservedField'],
  //   ['payMethod', 'CARD'],
  //   ['fnNm', '신한'],
  //   ['quota', '00'],
  //   ['appDtm', '20250430122729'],
  //   ['ediDate', '20250430122729'],
  //   ['usePointAmt', ''],
  //   ['authType', '03'],
  //   ['goodsName', '111'],
  //   ['appCardCd', '06'],
  //   ['unitPrice', '1000'],
  //   ['goodsQty', '1'],
  //   ['merchantId', 'MID-d493c260-2c80-4f46-a6e8-fdbcc66d6130'],
  // ];

  return (
    <div className={styles.container}>
      <Image src="/success.png" alt="결제 성공"
        width={130}
        height={130} />
      <h2>결제에 성공하였습니다.</h2>
      {/* <table>
        <thead>
          <tr>
            <th>항목</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          {data.map(([label, value], index) => (
            <tr key={index}>
              <td><strong>{label}</strong></td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}
