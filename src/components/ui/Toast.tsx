import React from 'react';

export interface ToastProps {
  open: boolean;
  type?: 'success' | 'error';
  message: string;
  onClose?: () => void;
  duration?: number; // ms
}

const Toast: React.FC<ToastProps> = ({
  open,
  type = 'info',
  message,
  onClose,
  duration = 4000,
}) => {
  React.useEffect(() => {
    if (open && duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-9999 animate-fade-in">
      <div
        className={`rounded-xl shadow-2xl p-4 min-w-[320px] border-l-4 ${
          type === 'success'
            ? 'bg-green-50 border-green-500'
            : 'bg-red-50 border-red-500'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {type === 'success' ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {type === 'success' ? 'Thành công!' : 'Thông báo'}
            </h4>
            <p
              className={`text-sm whitespace-pre-line wrap-break-word ${
                type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
            >
              {message}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Đóng thông báo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;
