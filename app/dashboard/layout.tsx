'use client';

import BottomNav from '@/components/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="container">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
