"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { formatClaim } from '@/lib/formatters';

export function ClaimsPageView({ claims, initialQuery }: { claims: any[]; initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (query.trim()) params.set('q', query.trim()); else params.delete('q');
    router.push(`/claims?${params.toString()}`);
  }

  return (
    <div className="space-y-6 px-5 py-6 sm:px-8">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Search claims, categories, addresses, homeowners..." />
        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Search</button>
      </form>
      <Card>
        <div className="border-b border-slate-200 px-5 py-4"><h3 className="text-lg font-semibold">All Claims</h3></div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {claims.map((claim) => {
            const c = formatClaim(claim);
            return (
              <Link key={claim.id} href={`/claims/${claim.id}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white">
                <div className="text-sm font-semibold text-slate-900">{c.claimNumber}</div>
                <div className="mt-1 text-base font-medium">{c.homeownerName}</div>
                <div className="text-sm text-slate-500">{c.address}</div>
                <div className="mt-3 flex gap-2 text-xs text-slate-500"><span>{c.category}</span><span>•</span><span>{c.priority}</span><span>•</span><span>{c.status}</span></div>
                <p className="mt-4 line-clamp-3 text-sm text-slate-600">{c.description}</p>
                <div className="mt-4 text-xs text-slate-500">Vendor: {c.vendorName ?? 'Unassigned'}</div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
