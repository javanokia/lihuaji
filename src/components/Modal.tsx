import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';

export const Modal: React.FC = () => {
  const { modalContent, closeModal } = useApp();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (modalContent) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [modalContent]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
      closeModal();
    }
  };

  return (
    <dialog
      id="modal"
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={() => closeModal()}
    >
      <button
        id="close-modal"
        className="icon-button"
        aria-label="关闭详情"
        onClick={() => closeModal()}
      >
        <Icon name="close" />
      </button>
      <div id="modal-body">{modalContent}</div>
    </dialog>
  );
};
