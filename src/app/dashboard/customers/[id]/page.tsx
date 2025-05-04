'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Customer, Enquiry } from '@/types/database.types';
import { format } from 'date-fns';

export default function CustomerDetails({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // Fetch customer details
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', params.id)
          .single();

        if (customerError) throw customerError;
        setCustomer(customerData as Customer);

        // Fetch customer enquiries
        const { data: enquiriesData, error: enquiriesError } = await supabase
          .from('enquiries')
          .select('*')
          .eq('customer_id', params.id)
          .order('date', { ascending: false });

        if (enquiriesError) throw enquiriesError;
        setEnquiries(enquiriesData as Enquiry[]);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        router.push('/dashboard/customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [params.id, router]);

  // Function to get status color
  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">Customer not found</p>
        <Link
          href="/dashboard/customers"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Details</h1>
        <Link
          href="/dashboard/customers"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to List
        </Link>
      </div>

      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold">{customer.name}</h2>
        </div>

        <div className="p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{customer.phone}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{customer.location}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(customer.created_at), 'dd/MM/yyyy')}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Total Enquiries</dt>
              <dd className="mt-1 text-sm text-gray-900">{enquiries.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Enquiries History</h2>
        
        {enquiries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">No enquiries found for this customer</p>
            <Link
              href="/dashboard/enquiries/new"
              className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Create New Enquiry
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Assigned To
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
                    <td className="whitespace-nowrap px-6 py-4">{enquiry.assigned_to}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/dashboard/enquiries/${enquiry.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
