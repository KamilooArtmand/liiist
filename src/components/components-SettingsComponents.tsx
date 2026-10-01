'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * ==============================================================================
 * NATIVE-FEEL SETTINGS PRIMITIVES (iOS/macOS Style)
 * ==============================================================================
 */

export const SettingsGroup = ({ children, title }: { children: React.ReactNode, title?: string }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mb-8">
      {title && (
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-tertiary)] ml-4">
          {title}
        </span>
      )}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
};

export const SettingsRow = ({ 
  label, 
  value, 
  icon: Icon, 
  onClick, 
  danger = false,
  hasBorder = true
}: { 
  label: string; 
  value?: React.ReactNode;
  icon?: any;
  onClick?: () => void;
  danger?: boolean;
  hasBorder?: boolean;
}) => {
  const isInteractive = !!onClick;
  
  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center justify-between p-4 bg-[var(--color-bg-secondary)]
        ${hasBorder ? 'border-b border-[var(--color-border-subtle)]' : ''}
        ${isInteractive ? 'cursor-pointer hover:bg-[var(--color-bg-tertiary)] active:bg-[var(--color-border-subtle)] transition-colors' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-[var(--color-text-secondary)]'}`} />}
        <span className={`text-base font-bold ${danger ? 'text-red-500' : 'text-[var(--color-text-primary)]'}`}>
          {label}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {value && <div className="text-sm text-[var(--color-text-tertiary)]">{value}</div>}
        {isInteractive && <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)]" />}
      </div>
    </div>
  );
};

/**
 * ==============================================================================
 * DANGER ZONE (Account Lifecycle)
 * ==============================================================================
 */
export const DangerZone = () => {
  const [reAuth, setReAuth] = React.useState(false);

  const handleDeactivate = async () => {
    if (!reAuth) return alert('Re-authentication required. Please enter password or use biometric check.');
    // Trigger Deactivation API
    alert('Account deactivated. You are now logged out.');
  };

  const handleDelete = async () => {
    if (!reAuth) return alert('Re-authentication required. Please enter password or use biometric check.');
    const confirm = window.confirm('This will queue your account for deletion in 30 days. Proceed?');
    if (confirm) {
      // Trigger Queue Edge Function
      await fetch('/api/account/delete', { method: 'POST' });
      alert('Account scheduled for permanent deletion.');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-4 border border-[var(--color-border-strong)] rounded-xl bg-[var(--color-bg-primary)]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={reAuth} 
            onChange={(e) => setReAuth(e.target.checked)}
            className="w-5 h-5 rounded border-[var(--color-border-strong)]"
          />
          <span className="text-sm font-bold text-[var(--color-text-primary)]">
            [MOCK] Re-authenticate (Simulate WebAuthn/Password)
          </span>
        </label>
      </div>

      <SettingsGroup title="Danger Zone">
        <SettingsRow 
          label="Deactivate Account" 
          value="Hide profile temporarily"
          onClick={handleDeactivate}
          danger
        />
        <SettingsRow 
          label="Delete Account" 
          value="Queue 30-day hard wipe"
          onClick={handleDelete}
          danger
          hasBorder={false}
        />
      </SettingsGroup>
    </div>
  );
};
