"use client"
import styles from './page.module.scss';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const menuData = [
  {
    category: '마이페이지',
    items: [
      { name: '결제 내역 확인', path: '/paymentHistory' },
      { name: '결제 필수 정보', path: '/paymentInfo' },
      { name: '회원 정보 조회', path: '/userInfo' },
    ]
  },
  {
    category: '설정',
    items: [
      { name: '비밀번호 변경', path: '/changePassword' },
      { name: '로그아웃', path: '/logout' },
    ]
  },
]

export default function Menu() {
  const router = useRouter();

  const handleClick = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.container__content} ${styles.profile}`}>
        <Image
          src='/user.png'
          alt="user"
          width={50}
          height={50} ></Image>
        <div>
          <h3>YOUR NAME</h3>
          <p>000-0000-0000</p>
        </div>
      </div>
      {menuData.map((menu, index) => (
        <div key={index} className={styles.container__content}>
          <p>{menu.category}</p>
          <ul>
            {menu.items.map((item, idx) => (
              <li key={idx} className={styles.container__content__item} onClick={() => handleClick(item.path)}>
                <h4>{item.name}</h4>
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div >
  )
}