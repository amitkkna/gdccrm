'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    activeLeads: 0,
    wonDeals: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the selected user from localStorage
    const user = localStorage.getItem('selectedUser');
    if (user) {
      setSelectedUser(user);
    }

    // Fetch stats
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch all enquiries
        const { data, error } = await supabase
          .from('enquiries')
          .select('*');

        if (error) throw error;

        if (data) {
          // Calculate stats
          const totalEnquiries = data.length;
          const activeLeads = data.filter(enquiry =>
            enquiry.status === 'Lead' || enquiry.status === 'Enquiry' || enquiry.status === 'Quote'
          ).length;
          const wonDeals = data.filter(enquiry => enquiry.status === 'Won').length;

          setStats({
            totalEnquiries,
            activeLeads,
            wonDeals
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user);
    router.push('/dashboard/enquiries');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to the CRM System</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your enquiries and customers efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Total Enquiries</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats.totalEnquiries}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/dashboard/enquiries" className="font-medium text-blue-600 hover:text-blue-900">View all</a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-100 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Active Leads</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats.activeLeads}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/dashboard/enquiries" className="font-medium text-blue-600 hover:text-blue-900">View details</a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Won Deals</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats.wonDeals}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/dashboard/enquiries" className="font-medium text-blue-600 hover:text-blue-900">View details</a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Conversion Rate</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : stats.totalEnquiries > 0
                        ? `${Math.round((stats.wonDeals / stats.totalEnquiries) * 100)}%`
                        : '0%'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/dashboard/enquiries" className="font-medium text-blue-600 hover:text-blue-900">View details</a>
            </div>
          </div>
        </div>
      </div>

      {/* User Selection */}
      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Select User to Manage Enquiries</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => handleUserSelect('Amit')}
              className={`flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md ${
                selectedUser === 'Amit'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-lg font-semibold">A</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Amit</h4>
                  <p className="text-sm text-gray-500">Manage Amit's enquiries</p>
                </div>
              </div>
              {selectedUser === 'Amit' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <button
              onClick={() => handleUserSelect('Prateek')}
              className={`flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md ${
                selectedUser === 'Prateek'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <span className="text-lg font-semibold">P</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Prateek</h4>
                  <p className="text-sm text-gray-500">Manage Prateek's enquiries</p>
                </div>
              </div>
              {selectedUser === 'Prateek' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New enquiry from UPL</p>
                <p className="mt-1 text-sm text-gray-500">Amit created a new enquiry for UPL regarding Agri products.</p>
                <p className="mt-1 text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Deal won with Agri Solutions Ltd</p>
                <p className="mt-1 text-sm text-gray-500">Prateek closed a deal with Agri Solutions Ltd worth ₹50,000.</p>
                <p className="mt-1 text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Reminder: Follow up with Raipur client</p>
                <p className="mt-1 text-sm text-gray-500">Don't forget to call the Raipur client about their pending quote.</p>
                <p className="mt-1 text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
