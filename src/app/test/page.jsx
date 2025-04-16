'use client'

import React, { useEffect, useState } from 'react'

export default function TestPage() {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://192.168.1.8:8080/api/user/myPage', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }

        const data = await res.json()
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  if (!userData) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>유저 정보</h1>
      <p><strong>ID:</strong> {userData.userId}</p>
      <p><strong>이름:</strong> {userData.userName}</p>
      <p><strong>전화번호:</strong> {userData.userPhone}</p>
      <p><strong>사업자 번호:</strong> {userData.businessNumber}</p>
    </div>
  )
}
