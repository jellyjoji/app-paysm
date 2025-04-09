'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { House, ChevronLeft } from 'lucide-react';
import styles from './Components.module.scss';


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [title, setTitle] = useState('');

  useEffect(() => {
    const path = pathname.toLowerCase();
    switch (pathname) {
      case '/':
        setTitle('MAIN');
        break;

      case '/login':
        setTitle('로그인');
        break;

      case '/signup':
        setTitle('회원가입');
        break;

      case '/menu':
        setTitle('메뉴');
        break;

      case '/paymentHistory':
        setTitle('결제 내역 확인');
        break;

      case '/paymentInfo':
        setTitle('결제 필수 정보');
        break;

      case '/userInfo':
        setTitle('UserInfo');
        break;

      case '/changePassword':
        setTitle('비밀번호 변경');
        break;

      case '/linkPayment':
        setTitle('링크 결제');
        break;

      case '/manualPayment':
        setTitle('수기 결제');
        break;

      case '/qrPayment':
        setTitle('QR 결제');
        break;

      default:
        setTitle('페이지 경로없음');
    }
  }, [pathname]);

  const home = () => {
    router.push('/')
  }

  const back = () => {
    router.back(); // 🔙 뒤로 가기 기능
  };

  return (
    <header className={styles.header}>
      <button onClick={back}>
        <ChevronLeft />
      </button>
      <h2>{title}</h2>
      <button onClick={home}>
        <House />
      </button>
    </header>
  );
}
