'use client';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';

export default function AdminToast({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error' | 'loading' | null;
  onClose: () => void;
}) {
  if (!type) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
      <div 
        className="flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border backdrop-blur-md"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          color: type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : 'var(--text-primary)'
        }}
      >
        {type === 'success' && <CheckCircle2 className="w-5 h-5" />}
        {type === 'error' && <XCircle className="w-5 h-5" />}
        {type === 'loading' && <RefreshCw className="w-5 h-5 animate-spin" />}
        
        <p className="text-sm font-semibold pr-4">{message}</p>
        
        {type !== 'loading' && (
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg transition-colors ml-2" style={{ color: 'var(--text-muted)' }}>
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
