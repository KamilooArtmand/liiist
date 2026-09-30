import { headers } from 'next/headers';
import React from 'react';

export default function SubdomainPage({ params }: { params: { subdomain: string } }) {
  // We can access the subdomain either via params or the custom header injected by middleware
  const headersList = headers();
  const subdomainFromHeader = headersList.get('x-subdomain');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-[#050505]">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black dark:text-white">
          Cosmic Domain Resolved
        </h1>
        
        <div className="flex flex-col gap-4 p-8 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50 dark:bg-[#0a0a0a]">
          <div className="flex items-center justify-between gap-12 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <span className="text-neutral-500">Route Param:</span>
            <span className="font-bold">{params.subdomain}</span>
          </div>
          <div className="flex items-center justify-between gap-12">
            <span className="text-neutral-500">Injected Header:</span>
            <span className="font-bold">{subdomainFromHeader}</span>
          </div>
        </div>

        <p className="text-neutral-500 text-center max-w-lg mt-8">
          The Semantic Node context is now successfully extracted. Downstream Server Components can fetch the specific taxonomy data for <strong className="text-black dark:text-white uppercase">{params.subdomain}</strong>.
        </p>
      </div>
    </main>
  );
}
