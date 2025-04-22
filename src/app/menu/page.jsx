"use client"
import styles from './page.module.scss';
import Image from "next/image";
import { useRouter } from 'next/navigation';
// import Modal from "@/components/Modal";
import { useEffect, useState } from 'react';
import { fetchWithToken } from '@/lib/api';

const menuData = [
  {
    category: '마이페이지',
    items: [
      { name: '결제 내역 확인', path: '/menu/paymentHistory' },
      { name: '결제 필수 정보', path: '/menu/paymentInfo' },
      { name: '회원 정보 조회', path: '/menu/userInfo' },
    ]
  },
  {
    category: '설정',
    items: [
      { name: '비밀번호 변경', path: '/menu/changePassword' },
      { name: '로그아웃', path: 'logout' }, // path는 실제 사용하지 않음
    ]
  },
]



export default function Menu() {
  const router = useRouter();
  // const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await fetch("http://192.168.1.8:8080/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  // const handleClick = (path) => {
  //   if (path === 'logout') {
  //     setShowLogoutModal(true);
  //   } else {
  //     router.push(path);
  //   }
  // };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await fetchWithToken('/api/user/myPage'); // ✅ 로그인된 사용자 정보
        setUser(data);
      } catch (err) {
        setError('사용자 정보를 불러오지 못했습니다.');
        console.error(err);
      }
    };
    fetchDetail();
  }, []);
  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  }
  if (!user) return <div style={{ padding: '2rem' }}>불러오는 중...</div>;

  return (
    <div className={styles.container}>
      <div className={`${styles.container__content} ${styles.profile}`}>
        <Image
          src='/user.png'
          alt="user"
          width={50}
          height={50}
        />
        <div>
          <h3>{user?.userName}</h3>
          <p>{user?.userPhone}</p>
        </div>
      </div>

      {menuData.map((menu, index) => (
        <div key={index} className={styles.container__content}>
          <p>{menu.category}</p>
          <ul>
            {menu.items.map((item, idx) => (
              <li
                key={idx}
                className={styles.container__content__item}
                onClick={() => handleClick(item.path)}
              >
                <h4>
                  {item.name}
                </h4>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* {showLogoutModal && (
        <Modal
          title="로그아웃"
          message="정말 로그아웃 하시겠습니까?"
          confirmText="네, 로그아웃"
          cancelText="아니오"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )} */}
    </div>
  );
}