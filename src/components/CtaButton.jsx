'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './components.module.scss';

export default function CTAButton() {
  const pathname = usePathname();
  const router = useRouter();

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

      case '/userInfo':
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
      case '/userInfo':
        return '정보 수정';
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
      <button className={styles.cta} onClick={handleClick}>
        {getLabel()}
      </button>
    </div>
  );
}
