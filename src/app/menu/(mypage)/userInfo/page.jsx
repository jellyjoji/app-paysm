"use client";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from './page.module.scss';
import { Search } from 'lucide-react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchUsers = async (businessNumber = "") => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("토큰이 없습니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const query = businessNumber ? `?businessNumber=${businessNumber}` : "";
      const res = await fetch(`${API_BASE_URL}/api/admin/getUserList${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("사용자 목록 불러오기 실패");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("사용자 목록을 불러오는 중 오류 발생, 권한을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 검색어가 변경될 때마다 500ms 후 API 호출
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers(searchKeyword);
    }, 500); // 디바운스 타이머 500ms

    return () => clearTimeout(debounceTimer); // 이전 타이머 제거
  }, [searchKeyword]);

  const handleSearch = () => {
    fetchUsers(search.trim());
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__search}>
        <p className={styles.container__search__icon}><Search /></p>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => {
            const input = e.target.value;
            // 숫자와 하이픈(-)만 허용
            const onlyValid = input.replace(/[^0-9-]/g, "");
            setSearchKeyword(onlyValid);
          }} placeholder="사업자등록번호로 찾기 (예 : 123-45-67890)"
        />

      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className={styles.container__content}>
          {users.length > 0 ? (
            users.map((user) => (
              <ul
                className={styles.container__content__item}
                key={user.userId}
                onClick={() =>
                  router.push(`/menu/userInfo/${user.userId}`)}
              >
                <li className={styles.container__content__item__info}>
                  <h3>{user.userName}</h3>
                  <p>{user.userId}</p>
                  <p>{user.businessNumber || "-"}</p>
                  {/* <p>{user.userPhone}</p> */}
                </li>
                <h2 style={{ color: user.ban ? "var(--red700)" : "var(--green700)" }}>{user.ban ? "차단 중" : "사용 중"}</h2>
              </ul>
            ))
          ) : (
            <li>사용자가 없습니다.</li>
          )}
        </div>

      )}
    </div>
  );
}
