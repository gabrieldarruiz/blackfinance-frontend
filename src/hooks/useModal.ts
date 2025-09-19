import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useModal = () => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (title: string, message: string) => {
    showModal(title, message, 'success');
  };

  const showError = (title: string, message: string) => {
    showModal(title, message, 'error');
  };

  const showWarning = (title: string, message: string) => {
    showModal(title, message, 'warning');
  };

  const showInfo = (title: string, message: string) => {
    showModal(title, message, 'info');
  };

  return {
    modal,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

