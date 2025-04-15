'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { Search } from 'lucide-react';


export default function UserInfo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBlocked, setIsBlocked] = useState(true);
  const router = useRouter();

  const handleClick = () => {
    setIsBlocked((prev) => !prev);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = () => {
    router.push('/menu/userInfo/userDetail'); // ✅ 원하는 경로로 이동
  };

  const handleSearch = () => {
    alert(`Searching for: ${searchTerm}`);
    // You can replace the alert with your search logic
  };

  return <>
    <div className={styles.container}>
      <div className={styles.container__search}>
        <div className={styles.container__serach__input} style={{ position: 'relative', display: 'inline-block' }}>
          <Search
            style={{
              flex: 1,
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              color: '#888',
            }}
          />
          <input
            type="text"
            placeholder="사업자등록번호로 찾기"
            value={searchTerm}
            onChange={handleInputChange}
            style={{
              padding: '8px 8px 8px 42px', // 왼쪽 패딩을 아이콘만큼 줘야 겹치지 않음
            }}
          />
        </div>
        <button className={styles.container__serach__btn} onClick={handleSearch}>검색</button>

      </div>

      <div className={styles.container__content}>
        <div className={styles.container__content__card}>
          <div
            className={styles.container__content__card__info}
            onClick={handleCardClick} // ✅ 클릭 시 이동
            style={{ cursor: 'pointer' }} // 마우스 오버 시 손가락 모양
          >
            <h3>User name</h3>
            <p>ID</p>
          </div>
          <button
            className={isBlocked ? "unblock" : "blocked"}
            onClick={handleClick}
          >
            <h2>{isBlocked ? "차단하기" : "차단 풀기"}</h2>
          </button>
        </div>
      </div>
    </div>
  </>
}