'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Enquiry, Status } from '@/types/database.types';
import { format } from 'date-fns';

export default function EnquiryDetails({ params }: { params: { id: string } }) {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnquiry = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setEnquiry(data as Enquiry);
      } catch (error) {
        console.error('Error fetching enquiry:', error);
        router.push('/dashboard/enquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiry();
  }, [params.id, router]);

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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading enquiry details...</p>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">Enquiry not found</p>
        <Link
          href="/dashboard/enquiries"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Enquiries
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Enquiry Details</h1>
        <div className="space-x-2">
          <Link
            href={`/dashboard/enquiries/${enquiry.id}/edit`}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
          <Link
            href="/dashboard/enquiries"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">{enquiry.customer_name}</h2>
              <p className="text-sm text-gray-500">{enquiry.phone}</p>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                enquiry.status
              )}`}
            >
              {enquiry.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(enquiry.date), 'dd/MM/yyyy')}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Segment</dt>
              <dd className="mt-1 text-sm text-gray-900">{enquiry.segment}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{enquiry.location}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900">{enquiry.assigned_to}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Reminder Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {enquiry.reminder_date
                  ? format(new Date(enquiry.reminder_date), 'dd/MM/yyyy')
                  : 'No reminder set'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(enquiry.created_at), 'dd/MM/yyyy HH:mm')}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Requirement Details</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                {enquiry.requirement_details}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Remarks</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                {enquiry.remarks || 'No remarks'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
