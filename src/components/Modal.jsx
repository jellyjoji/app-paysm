"use client";
import styles from './components.module.scss';

export default function Modal({
  title = "확인",
  message = "이 작업을 진행하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) {
  const handleOverlayClick = (e) => {
    // 모달 내용 외 영역 클릭 시 닫기
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content__info}>
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className={styles.modal__content__btn}>
          <button className={styles.modal__content__btn__cancel} onClick={onCancel}>
            {cancelText}
          </button>
          <button className={styles.modal__content__btn__confirm} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
