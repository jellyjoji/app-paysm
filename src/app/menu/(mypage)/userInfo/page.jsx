'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { Search } from 'lucide-react';
import { useEffect, useState } from "react";


export default function UserInfo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBlocked, setIsBlocked] = useState(true);
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api"); // Next.js의 API 경유
        const data = await res.json();
        setUsers(data); // ✅ 여러 유저 저장
      } catch (error) {
        console.error('유저 데이터 불러오기 실패:', err);
      }
    };

    getUsers();
  }, []);

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
        {users.map((user, idx) => (
          <div key={idx} className={styles.container__content__card}>
            <div
              className={styles.container__content__card__info}
              onClick={handleCardClick}
              style={{ cursor: 'pointer' }}
            >
              <h3>{user.name}</h3>
              <p>{user.userId}</p>
            </div>
            <button
              className={isBlocked ? "unblock" : "blocked"}
              onClick={handleClick}
            >
              <h2>{isBlocked ? "차단하기" : "차단 풀기"}</h2>
            </button>
          </div>
        ))}

      </div>
    </div>
  </>
}