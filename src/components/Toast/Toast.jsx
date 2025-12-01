import React, { useEffect } from 'react';
import { MdCheckCircle, MdError, MdClose } from 'react-icons/md';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' 
    ? 'bg-green-50 border-green-500' 
    : 'bg-red-50 border-red-500';
  
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <div 
      className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 ${bgColor} ${textColor} min-w-[300px] max-w-[500px] animate-slide-in-right`}
      style={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      {type === 'success' ? (
        <MdCheckCircle className={`text-2xl ${iconColor} flex-shrink-0`} />
      ) : (
        <MdError className={`text-2xl ${iconColor} flex-shrink-0`} />
      )}
      
      <p className="flex-1 font-medium text-sm">{message}</p>
      
      <button
        onClick={onClose}
        className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close"
      >
        <MdClose className="text-xl" />
      </button>
    </div>
  );
};

export default Toast;
