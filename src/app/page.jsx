"use client"
import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";

export default function Home() {


  return (
    <div className={styles.container}>
      <h1>쉽고 빠른 PG 연동 <br />페이즘</h1>
      <h2>다양한 결제 수단으로 편리하고 안전한 결제를 지원해 드려요.</h2>
      <div className={styles.container__content}>
        <Link href="/linkPayment" passHref>
          <div className={styles.container__content__item}>
            <Image src="/link.png" alt="링크 결제"
              width={100}
              height={100} />
            <p>
              링크 결제
            </p>
          </div>
        </Link>

        <Link href="/manualPayment" passHref>
          <div className={styles.container__content__item}>
            <Image src="/manual.png" alt="수기 결제"
              width={100}
              height={100} />
            <p>
              수기 결제
            </p>
          </div>
        </Link>

        <Link href="/qrPayment" passHref>
          <div className={styles.container__content__item}>
            <Image src="/qr.png" alt="큐알 결제"
              width={100}
              height={100} />
            <p>
              QR 결제
            </p>
          </div>
        </Link>

      </div>
    </div >
  );
}
