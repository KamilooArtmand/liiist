'use client';

import React from 'react';
import { AuthUI } from '@liiist/ui';
import { createClient } from '@supabase/supabase-js';

// In production, use standard env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AuthPage() {
  // In a real i18n setup, we'd use useTranslations('Auth')
  // Simulating the strings injection for the UI component
  const authStrings = {
    title: 'Authenticate',
    google: 'Continue with Google',
    facebook: 'Continue with Facebook',
    devLogin: 'DEV: Login as Admin'
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) console.error('Google SSO Error:', error);
  };

  const handleFacebookLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) console.error('Facebook SSO Error:', error);
  };

  const handleDevLogin = async () => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Dev login attempted in production!');
      return;
    }
    // Hardcoded dev credentials per requirements
    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@liiist.local', // Map admin username to an email for Supabase auth
      password: 'admin',
    });
    
    if (error) {
      console.error('Mock Admin Login Failed:', error);
      alert('Ensure mock admin user exists in Supabase local DB');
    } else {
      window.location.href = '/settings';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthUI 
        strings={authStrings}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        onDevAdminLogin={handleDevLogin}
      />
    </div>
  );
}
