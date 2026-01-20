'use client';

import { useState, useEffect } from 'react';

export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  message: string;
  onClose?: () => void;
  autoDismiss?: boolean;
  dismissAfter?: number;
}

const variantStyles = {
  error: {
    background: '#f8d7da',
    border: '#f5c6cb',
    color: '#721c24',
    icon: '⚠️',
  },
  success: {
    background: '#d4edda',
    border: '#c3e6cb',
    color: '#155724',
    icon: '✓',
  },
  warning: {
    background: '#fff3cd',
    border: '#ffeeba',
    color: '#856404',
    icon: '⚠',
  },
  info: {
    background: '#d1ecf1',
    border: '#bee5eb',
    color: '#0c5460',
    icon: 'ℹ',
  },
};

export function Alert({
  variant,
  message,
  onClose,
  autoDismiss = false,
  dismissAfter = 5000,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = variantStyles[variant];

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onClose]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        backgroundColor: styles.background,
        border: `1px solid ${styles.border}`,
        color: styles.color,
        borderRadius: '6px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.9rem',
        fontWeight: 500,
      }}
      role="alert"
    >
      <span style={{ fontSize: '1.1rem' }}>{styles.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: styles.color,
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
            padding: 0,
            opacity: 0.7,
          }}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}
