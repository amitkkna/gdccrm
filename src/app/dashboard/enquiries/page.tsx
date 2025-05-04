'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Enquiry, Status } from '@/types/database.types';
import { format } from 'date-fns';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Function to fetch enquiries
  const fetchEnquiries = async (userFilter: string | null = null) => {
    setLoading(true);
    try {
      console.log('Fetching enquiries...');
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Enquiries fetched:', data);

      if (data) {
        // Filter by selected user if one is selected
        const filteredData = userFilter
          ? data.filter(enquiry => enquiry.assigned_to === userFilter)
          : data;

        console.log('Filtered data:', filteredData);
        setEnquiries(filteredData as Enquiry[]);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get the selected user from localStorage
    const user = localStorage.getItem('selectedUser');
    setSelectedUser(user);

    // Fetch enquiries when the component mounts
    fetchEnquiries(user);

    // Set up an interval to refresh the data every 5 seconds
    const intervalId = setInterval(() => {
      fetchEnquiries(user);
    }, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Function to get status color
  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Lead':
        return 'bg-gray-100 text-gray-800';
      case 'Enquiry':
        return 'bg-blue-100 text-blue-800';
      case 'Quote':
        return 'bg-yellow-100 text-yellow-800';
      case 'Won':
        return 'bg-green-100 text-green-800';
      case 'Loss':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {selectedUser ? `${selectedUser}'s Enquiries` : 'All Enquiries'}
          </h1>
          <button
            onClick={() => fetchEnquiries(selectedUser)}
            className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Refresh enquiries"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        <Link
          href="/dashboard/enquiries/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Enquiry
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <svg className="h-6 w-6 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading enquiries...</p>
          </div>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No enquiries found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new enquiry.</p>
          <Link
            href="/dashboard/enquiries/new"
            className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create your first enquiry
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop View - Table */}
          <div className="hidden overflow-x-auto rounded-lg border shadow-sm md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reminder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      {format(new Date(enquiry.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{enquiry.customer_name}</div>
                      <div className="text-sm text-gray-500">{enquiry.location}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{enquiry.segment}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                          enquiry.status
                        )}`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {enquiry.reminder_date
                        ? format(new Date(enquiry.reminder_date), 'dd/MM/yyyy')
                        : '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/enquiries/${enquiry.id}`}
                          className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/enquiries/${enquiry.id}/edit`}
                          className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Cards */}
          <div className="space-y-4 md:hidden">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="overflow-hidden rounded-lg border bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{enquiry.customer_name}</div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                        enquiry.status
                      )}`}
                    >
                      {enquiry.status}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-xs font-medium text-gray-500">Date</div>
                      <div>{format(new Date(enquiry.date), 'dd/MM/yyyy')}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">Segment</div>
                      <div>{enquiry.segment}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">Location</div>
                      <div>{enquiry.location}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">Reminder</div>
                      <div>
                        {enquiry.reminder_date
                          ? format(new Date(enquiry.reminder_date), 'dd/MM/yyyy')
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex divide-x border-t border-gray-200">
                  <Link
                    href={`/dashboard/enquiries/${enquiry.id}`}
                    className="flex flex-1 items-center justify-center py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>
                  <Link
                    href={`/dashboard/enquiries/${enquiry.id}/edit`}
                    className="flex flex-1 items-center justify-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
