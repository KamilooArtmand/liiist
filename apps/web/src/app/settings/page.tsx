import React from 'react';
import { DangerZone, SettingsGroup, SettingsRow } from '@liiist/ui';
import { Shield, Moon, Smartphone, UserX } from 'lucide-react';

export default function SettingsIndexPage() {
  return (
    <div className="flex flex-col gap-12 max-w-3xl">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tighter uppercase">
          Account & Security
        </h1>
        <p className="text-sm font-serif text-[var(--color-text-secondary)] mt-2">
          Manage your Liiist identity, active sessions, and account lifecycle.
        </p>
      </div>

      {/* Appearance Section */}
      <section>
        <SettingsGroup title="Appearance">
          <SettingsRow 
            label="Theme Preference" 
            value="System Default"
            icon={Moon}
            onClick={() => {}}
            hasBorder={false}
          />
        </SettingsGroup>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono ml-4 -mt-6 mb-8">
          Toggle powered by next-themes avoiding FOUC.
        </p>
      </section>

      {/* Security & Privacy Section */}
      <section>
        <SettingsGroup title="Security & Privacy">
          <SettingsRow 
            label="Two-Factor Authentication (2FA)" 
            value="Enabled via WebAuthn"
            icon={Shield}
            onClick={() => {}}
          />
          <SettingsRow 
            label="Active Sessions" 
            value="3 Devices"
            icon={Smartphone}
            onClick={() => {}}
          />
          <SettingsRow 
            label="Blocked Users" 
            value="0 Users"
            icon={UserX}
            onClick={() => {}}
            hasBorder={false}
          />
        </SettingsGroup>
      </section>

      {/* Danger Zone Section */}
      <section>
        <DangerZone />
      </section>

    </div>
  );
}
