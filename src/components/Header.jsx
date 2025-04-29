'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { House, ChevronLeft, Menu } from 'lucide-react';
import styles from './test.module.scss';
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [title, setTitle] = useState('');

  useEffect(() => {

    const path = pathname.toLowerCase();

    if (path.startsWith('/menu/paymenthistory/') && path.endsWith('/receipt')) {
      setTitle('영수증 조회');
      return;
    }
    if (path.startsWith('/menu/paymenthistory/')) {
      setTitle('결제 내역 상세');
      return;
    }

    // if (path.startsWith('/linkPayment/') && path.endsWith('/confirmPayment')) {
    //   setTitle('결제 요청하기');
    //   return;
    // }
    // if (path.startsWith('/linkPayment/')) {
    //   setTitle('링크 결제 상세보기');
    //   return;
    // }

    // if (path.startsWith('/menu/userInfo/')) {
    //   setTitle('회원정보 상세');
    //   return;
    // }

    switch (pathname) {
      case '/':
        setTitle('HOME');
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

      case '/menu/paymentHistory':
        setTitle('결제 내역 확인');
        break;

      case '/menu/paymentInfo':
        setTitle('결제 필수 정보');
        break;

      case '/menu/userInfo':
        setTitle('회원 정보 조회');
        break;

      case '/menu/changePassword':
        setTitle('비밀번호 변경');
        break;

      case '/linkPayment':
        setTitle('링크 결제');
        break;

      case '/linkPayment/addLinkPayment':
        setTitle('링크 결제 추가하기');
        break;

      case '/manualPayment':
        setTitle('수기 결제');
        break;

      case '/manualPayment/scanCard':
        setTitle('카드 번호 스캔하기');
        break;

      case '/qrPayment':
        setTitle('QR 결제');
        break;

      case '/qrPayment/addQrPayment':
        setTitle('QR 결제 추가하기');
        break;

      default:
        setTitle('페이지 경로없음');
    }
  }, [pathname]);

  const isHome = pathname === '/';

  const goHome = () => {
    router.push('/')
  }

  const goBack = () => {
    router.back(); // 🔙 뒤로 가기 기능
  };

  const goMenu = () => {
    router.push('/menu')
  }

  return (
    <>
      <header className={styles.header}>
        {isHome ? (<>
          <Image
            src="/logo.png"
            alt="페이즘"
            width={71}
            height={32}
          ></Image>
          <button onClick={goMenu}>
            <Menu />
          </button></>
        ) : (<>
          <button onClick={goBack}>
            <ChevronLeft />
          </button>
          <h2>{title}</h2>
          <button onClick={goHome}>
            <House />
          </button></>
        )}
      </header >

    </>);
}
