import React from 'react';
import { getTranslations } from 'next-intl/server';
import { DangerZone, SettingsGroup, SettingsRow, ThemeToggleRow } from '@liiist/ui';
import { Shield, Moon, Smartphone, UserX } from 'lucide-react';

export default async function SettingsIndexPage({ params: { locale } }: { params: { locale: string } }) {
  // Using next-intl server-side translations
  const t = await getTranslations('Settings');

  return (
    <div className="flex flex-col gap-12 max-w-3xl">
      
      {/* Translated Page Header */}
      <div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tighter uppercase">
          {t('title')}
        </h1>
        <p className="text-sm font-serif text-[var(--color-text-secondary)] mt-2">
          {t('description')}
        </p>
      </div>

      <section>
        <SettingsGroup title="Appearance">
          <SettingsRow 
            label="Theme Preference" 
            value="System Default"
            icon={Moon}
            hasBorder={false}
          />
        </SettingsGroup>
      </section>

      <section>
        <SettingsGroup title="Security & Privacy">
          <SettingsRow 
            label="Two-Factor Authentication (2FA)" 
            value="Enabled via WebAuthn"
            icon={Shield}
          />
          <SettingsRow 
            label="Active Sessions" 
            value="3 Devices"
            icon={Smartphone}
          />
          <SettingsRow 
            label="Blocked Users" 
            value="0 Users"
            icon={UserX}
            hasBorder={false}
          />
        </SettingsGroup>
      </section>

      <section>
        <DangerZone />
      </section>

    </div>
  );
}

