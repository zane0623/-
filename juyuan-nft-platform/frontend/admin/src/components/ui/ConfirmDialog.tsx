'use client';

import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'success';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = '确认',
  cancelText = '取消',
  loading = false,
}: ConfirmDialogProps) {
  const icons = {
    danger: Trash2,
    warning: AlertTriangle,
    success: CheckCircle,
  };

  const iconStyles = {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-600',
    success: 'bg-emerald-100 text-emerald-600',
  };

  const buttonStyles = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500/30',
    warning: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/30',
    success: 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500/30',
  };

  const Icon = icons[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${iconStyles[type]}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mt-4">{title}</h3>
        <p className="text-gray-500 mt-2">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-colors focus:ring-4 disabled:opacity-50 ${buttonStyles[type]}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                处理中...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

