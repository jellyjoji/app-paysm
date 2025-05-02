"use client"
import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')

    if (!token || !isTokenValid(token)) {
      router.replace('/login') // 토큰 없거나 만료되면 로그인 페이지로 리다이렉션
    }
  }, [])

  return (
    <div className={styles.container}>
      <h1>쉽고 빠른 PG 연동 <br />페이즘</h1>
      <h2>다양한 결제 수단으로 <br />편리하고 안전한 결제를 <br />지원해 드려요.</h2>
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

        <Link href="https://www.paysm.net" target="_blank" rel="noopener noreferrer">
          <div className={styles.container__content__item}>
            <Image src="/paysm.png" alt="페이즘 바로가기"
              width={100}
              height={100} />
            <p>
              PG 신청하기
            </p>
          </div>
        </Link>

      </div >
    </div >
  );
}

// JWT 유효성 검사 함수
function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp > now
  } catch {
    return false
  }
}