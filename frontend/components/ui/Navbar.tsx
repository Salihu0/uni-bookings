'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: '⊞' },
  { href: '/facilities', label: 'Facilities', icon: '🏢' },
  { href: '/bookings', label: 'Bookings', icon: '📅' },
  { href: '/bookings/new', label: 'New Booking', icon: '+' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  // Hide main navbar in admin routes (use simplified version)
  if (pathname.startsWith('/admin')) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin/facilities" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-700 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-red-900/50">
              AD
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              Admin Panel
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/facilities"
              className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              Facilities
            </Link>
            <Link
              href="/admin/bookings"
              className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              Bookings
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              Users
            </Link>
            <Link
              href="/"
              className="px-4 py-1.5 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all"
            >
              Back to App
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="w-20 h-6 bg-slate-800 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-900/50">
            CB
          </div>
          <span className="font-bold text-white text-sm tracking-tight">
            CampusBook
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-violet-900/40 text-violet-300 border border-violet-700/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )}
                >
                  <span className="text-base leading-none">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    pathname === '/admin'
                      ? 'bg-red-900/40 text-red-300 border border-red-700/40'
                      : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                  )}
                >
                  <span className="text-base leading-none">⚙️</span>
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <span className="text-base leading-none">🔐</span>
              Login
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </div>
                <div className="text-xs text-slate-400 capitalize">{user?.role || 'user'}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-xs font-bold text-white">
                {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
