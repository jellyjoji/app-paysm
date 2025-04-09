"use client"
import Image from "next/image";
import styles from "./page.module.scss";

export default function Home() {


  return (
    <div className={styles.container}>
      <h1>쉽고 빠른 PG 연동 <br />페이즘</h1>
      <h2>다양한 결제 수단으로 편리하고 안전한 결제를 지원해 드려요.</h2>
      <div className={styles.container__payment}>
        <div className={styles.container__payment__item}>
          <Image src="/link.png" alt="손 이미지"
            width={150}
            height={150} />
          <p>
            링크 결제
          </p>
        </div>
        <div className={styles.container__payment__item}>
          <Image src="/manual.png" alt="손 이미지"
            width={150}
            height={150} />
          <p>
            수기 결제
          </p>
        </div>
        <div className={styles.container__payment__item}>
          <Image src="/qr.png" alt="손 이미지"
            width={150}
            height={150} />
          <p>
            QR 결제
          </p>
        </div>
      </div>
    </div>
  );
}
