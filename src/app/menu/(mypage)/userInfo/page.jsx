'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { Search } from 'lucide-react';
import { useEffect, useState } from "react";
import { fetchWithToken } from '@/lib/api';


export default function UserInfo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBlocked, setIsBlocked] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await fetchWithToken('/api/user/myPage');
        setUser(data);
      } catch (err) {
        console.error('사용자 정보 로드 실패:', err);
        setError('로그인이 필요하거나 사용자 정보를 불러오지 못했습니다.');
      }
    };

    fetchUserInfo();
  }, []);

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  }

  if (!user) {
    return <div style={{ padding: '2rem' }}>불러오는 중...</div>;
  }


  const handleClick = () => {
    setIsBlocked((prev) => !prev);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (userId) => {
    router.push(`/menu/userInfo/userDetail/${userId}`);
  };

  const handleSearch = () => {
    alert(`Searching for: ${searchTerm}`);
    // You can replace the alert with your search logic
  };

  return <>
    <div className={styles.container}>
      <div className={styles.container__search}>
        <div className={styles.container__serach__input} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
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
              padding: '8px 8px 8px 42px',
            }}
          />
        </div>
        <button className={styles.container__serach__btn} onClick={handleSearch}>검색</button>

      </div>

      <div className={styles.container__content}>
        <div className={styles.container__content__card}>
          <div
            className={styles.container__content__card__info}
            onClick={() => handleCardClick(user.userId)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{user.userName}</h3>
            <p>{user.userId}</p>
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