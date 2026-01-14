import { useEffect } from 'react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export const ErrorModal = ({ message, onClose }: ErrorModalProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-md">
        <p className="text-red-800 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};
