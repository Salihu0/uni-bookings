import type { Metadata } from 'next';
import { ToastProvider } from '@/lib/toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'CampusBook – University Facility Booking',
  description: 'Book university facilities quickly and easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="pt-14 min-h-screen">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
