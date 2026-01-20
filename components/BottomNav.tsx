'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <div className="bottom-nav">
      <Link href="/dashboard" className={`nav-item ${isActive('/dashboard') && !isActive('/dashboard/documents') && !isActive('/dashboard/profile') ? 'active' : ''}`}>
        <LayoutDashboard className="w-6 h-6 mb-1" />
        <span>Home</span>
      </Link>

      <Link href="/dashboard/documents" className={`nav-item ${isActive('/dashboard/documents') ? 'active' : ''}`}>
        <FileText className="w-6 h-6 mb-1" />
        <span>File</span>
      </Link>

      <Link href="/dashboard/profile" className={`nav-item ${isActive('/dashboard/profile') ? 'active' : ''}`}>
        <User className="w-6 h-6 mb-1" />
        <span>Profilo</span>
      </Link>
    </div>
  );
}
