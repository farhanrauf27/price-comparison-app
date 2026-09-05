interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-4 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 bg-white ${
      type === 'success' ? 'border-emerald-200 text-emerald-800' : 'border-rose-200 text-rose-800'
    }`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold ml-2">×</button>
    </div>
  );
}