'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // Use Next.js router for client-side navigation
    router.push('/login');
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between bg-gray-900 px-4 md:hidden">
        <h1 className="text-xl font-bold text-white">CRM System</h1>
        <div className="flex items-center space-x-3">
          <button
            className="rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden w-64 bg-gray-800 md:block">
        <div className="flex h-16 items-center justify-between bg-gray-900 px-4">
          <h1 className="text-xl font-bold text-white">CRM System</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  pathname === '/dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/enquiries"
                className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  pathname.startsWith('/dashboard/enquiries')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Enquiries
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/customers"
                className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  pathname.startsWith('/dashboard/customers')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Customers
              </Link>
            </li>
          </ul>
          <div className="mt-8">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu - Hidden by default */}
      <div id="mobile-menu" className="absolute inset-x-0 top-16 z-50 hidden w-full bg-gray-800 shadow-lg md:hidden">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  pathname === '/dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/enquiries"
                className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  pathname.startsWith('/dashboard/enquiries')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Enquiries
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/customers"
                className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  pathname.startsWith('/dashboard/customers')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Customers
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                  handleSignOut();
                }}
                className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {pathname === '/dashboard'
                ? 'Dashboard'
                : pathname.startsWith('/dashboard/enquiries')
                ? 'Enquiries'
                : pathname.startsWith('/dashboard/customers')
                ? 'Customers'
                : ''}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="flex items-center rounded-full bg-gray-100 p-1 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => document.getElementById('notification-dropdown')?.classList.toggle('hidden')}
              >
                <span className="absolute -top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">3</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Notification Dropdown */}
              <div id="notification-dropdown" className="absolute right-0 mt-2 hidden w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-2">
                  <h3 className="px-4 py-2 text-sm font-semibold text-gray-900">Notifications</h3>
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center gap-4 rounded-md p-3 hover:bg-gray-50">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-900">New enquiry from UPL</p>
                        <p className="text-gray-500">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-md p-3 hover:bg-gray-50">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-900">Reminder: Follow up with Raipur client</p>
                        <p className="text-gray-500">Today</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-md p-3 hover:bg-gray-50">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-900">Deal won with Agri Solutions Ltd</p>
                        <p className="text-gray-500">Yesterday</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <button className="block w-full rounded-md px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden text-sm md:block">
                {user?.email}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
