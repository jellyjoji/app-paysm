'use client';

export default function Error({ error }) {
  return (
    <div style={{ padding: '2rem', color: 'red' }}>
      에러 발생: {error.message || '사용자 정보를 불러오지 못했습니다.'}
    </div>
  );
}