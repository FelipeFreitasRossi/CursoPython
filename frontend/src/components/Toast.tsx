import { useEffect } from 'react';
import gsap from 'gsap';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    gsap.fromTo('.toast', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 });
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-white font-medium text-sm backdrop-blur-md"
      style={{ background: type === 'success' ? '#10b981' : '#ef4444', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
      {message}
    </div>
  );
}