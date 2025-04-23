"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import styles from "./page.module.scss";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("토큰이 없습니다.");
      return;
    }

    fetch(`${API_BASE_URL}/api/admin/getUserDetail?userId=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setError("회원 정보를 불러오는 중 오류 발생"));
  }, [id]);

  const handleSave = () => {
    const token = localStorage.getItem("jwtToken");
    fetch(`${API_BASE_URL}/api/admin/updateUserAndMerchant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch(() => alert("저장 중 오류 발생"));
  };

  const toggleBan = () => {
    const newBan = user.ban ? 0 : 1;
    const token = localStorage.getItem("jwtToken");

    fetch(`${API_BASE_URL}/api/admin/banSettingUser`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: id, ban: newBan }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        alert(newBan ? "계정이 차단되었습니다." : "차단이 해제되었습니다.");
        setUser((prev) => ({ ...prev, ban: newBan }));
      })
      .catch(() => alert("처리 중 오류 발생"));
  };

  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <form className={styles.container__form}>
        <div className={styles.container__form__content}>
          <label htmlFor="userId">아이디</label>
          <input type="text" id="userId" value={user.userId || ""} readOnly />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="userName">이름</label>
          <input
            type="text"
            id="userName"
            value={user.userName || ""}
            onChange={(e) => setUser({ ...user, userName: e.target.value })}
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="userPhone">전화번호</label>
          <input
            type="text"
            id="userPhone"
            value={user.userPhone || ""}
            onChange={(e) => setUser({ ...user, userPhone: e.target.value })}
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="businessNumber">사업자번호</label>
          <input
            type="text"
            id="businessNumber"
            value={user.businessNumber || ""}
            onChange={(e) => setUser({ ...user, businessNumber: e.target.value })}
          />
        </div>

        <div className={styles.container__form__content}>
          <label>상태</label>
          <input type="text"
            id="ban"
            value={user.ban ? "1" : "0"} readOnly />
          <div>
            <button className={styles.container__form__content__toggle} type="button" onClick={toggleBan} style={{
              backgroundColor: user.ban ? "var(--red700)" : "var(--green700)"
            }}>
              {user.ban ? "차단 중" : "사용 중"}
            </button>
          </div>
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="merchantId">상점 ID</label>
          <input type="text" id="merchantId" value={user.merchantId || ""} readOnly />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="merchantKey">상점 키</label>
          <input
            type="text"
            id="merchantKey"
            value={user.merchantKey || ""}
            onChange={(e) => setUser({ ...user, merchantKey: e.target.value })}
          />
        </div>

        <div className={styles.container__form__content}>
          <label htmlFor="mid">MID</label>
          <input
            type="text"
            id="mid"
            value={user.mid || ""}
            onChange={(e) => setUser({ ...user, mid: e.target.value })}
          />
        </div>

        <div>
          <button type="button" onClick={handleSave}>저장</button>
        </div>
      </form >
    </div >
  );
}
