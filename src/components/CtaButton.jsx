'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './test.module.scss';

export default function CTAButton() {
  const pathname = usePathname();
  const router = useRouter();
  console.log('현재 pathname:', pathname);

  const handleClick = () => {
    switch (pathname.toLowerCase()) {
      case '/login':
        alert('로그인 요청을 보냅니다.');
        break;

      case '/signup':
        alert('회원가입 요청을 보냅니다.');
        break;

      case '/menu':
        router.push('/paymentInfo');
        break;

      case '/menu/userInfo':
        console.log('사용자 정보 수정 기능 실행');
        break;

      case '/menu/changePassword':
        console.log('사용자 정보 수정 기능 실행');
        break;

      default:
        alert('기본 CTA 버튼입니다.');

    }
  };

  const getLabel = () => {
    switch (pathname.toLowerCase()) {
      case '/login':
        return '로그인하기';
      case '/signup':
        return '가입 완료';
      case '/menu':
        return '결제하러 가기';
      case '/menu/userInfo':
        return '정보 수정';
      case '/menu/changePassword':
        return '변경하기';
      default:
        return '버튼';
    }
  };

  const getSubLabel = () => {
    if (pathname.toLowerCase() === '/login')
      return (
        <>
          계정이 없으신가요? <strong>회원가입</strong>
        </>
      );
    if (pathname.toLowerCase() === '/signup')
      return (
        <>
          이미 계정이 있나요? <strong>로그인</strong>
        </>
      );
  };

  const visibleRoutes = ['/login', '/signup', '/menu', '/userInfo', '/changePassword'];
  const isVisible = visibleRoutes.some(route =>
    pathname.toLowerCase().endsWith(route)
  );

  const handleSubClick = () => {
    if (pathname.toLowerCase() === '/login') router.push('/signup');
    if (pathname.toLowerCase() === '/signup') router.push('/login');
  };

  return (
    <div className={styles.btn}>
      {(pathname.toLowerCase() === '/login' || pathname.toLowerCase() === '/signup') && (
        <div className={styles.sub}>
          <button onClick={handleSubClick}>
            {getSubLabel()}
          </button>
        </div>
      )}

      {/* 안보이는 이유는 header 와 연관이 있을까 */}
      {/* <button className={styles.cta} onClick={handleClick}>{getLabel()}</button> */}

      {isVisible && (
        <button className={styles.cta} onClick={handleClick}>
          {getLabel()}
        </button>
      )}

    </div>
  );
}
