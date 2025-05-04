'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Segment, Status, Enquiry } from '@/types/database.types';

type FormData = {
  date: string;
  segment: Segment;
  customer_name: string;
  phone: string;
  location: string;
  requirement_details: string;
  status: Status;
  remarks: string;
  reminder_date: string;
  assigned_to: string;
};

export default function EditEnquiry({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

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
        
        const enquiry = data as Enquiry;
        
        // Set form values
        setValue('date', enquiry.date);
        setValue('segment', enquiry.segment);
        setValue('customer_name', enquiry.customer_name);
        setValue('phone', enquiry.phone);
        setValue('location', enquiry.location);
        setValue('requirement_details', enquiry.requirement_details);
        setValue('status', enquiry.status);
        setValue('remarks', enquiry.remarks);
        setValue('reminder_date', enquiry.reminder_date || '');
        setValue('assigned_to', enquiry.assigned_to);
      } catch (error) {
        console.error('Error fetching enquiry:', error);
        router.push('/dashboard/enquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiry();
  }, [params.id, router, setValue]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({
          date: data.date,
          segment: data.segment,
          customer_name: data.customer_name,
          phone: data.phone,
          location: data.location,
          requirement_details: data.requirement_details,
          status: data.status,
          remarks: data.remarks,
          reminder_date: data.reminder_date || null,
          assigned_to: data.assigned_to,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (error) throw error;

      router.push(`/dashboard/enquiries/${params.id}`);
    } catch (error) {
      console.error('Error updating enquiry:', error);
      alert('Failed to update enquiry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading enquiry...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Edit Enquiry</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              {...register('date', { required: 'Date is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Segment */}
          <div>
            <label htmlFor="segment" className="block text-sm font-medium text-gray-700">
              Segment
            </label>
            <select
              id="segment"
              {...register('segment', { required: 'Segment is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="Agri">Agri</option>
              <option value="Corporate">Corporate</option>
              <option value="Others">Others</option>
            </select>
            {errors.segment && (
              <p className="mt-1 text-sm text-red-600">{errors.segment.message}</p>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              id="customer_name"
              {...register('customer_name', { required: 'Customer name is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.customer_name && (
              <p className="mt-1 text-sm text-red-600">{errors.customer_name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone', { required: 'Phone number is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              {...register('location', { required: 'Location is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              {...register('status', { required: 'Status is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="Lead">Lead</option>
              <option value="Enquiry">Enquiry</option>
              <option value="Quote">Quote</option>
              <option value="Won">Won</option>
              <option value="Loss">Loss</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Assigned To */}
          <div>
            <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">
              Assigned To
            </label>
            <select
              id="assigned_to"
              {...register('assigned_to', { required: 'Assignment is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="Amit">Amit</option>
              <option value="Prateek">Prateek</option>
            </select>
            {errors.assigned_to && (
              <p className="mt-1 text-sm text-red-600">{errors.assigned_to.message}</p>
            )}
          </div>

          {/* Reminder Date */}
          <div>
            <label htmlFor="reminder_date" className="block text-sm font-medium text-gray-700">
              Reminder Date
            </label>
            <input
              type="date"
              id="reminder_date"
              {...register('reminder_date')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Requirement Details */}
        <div>
          <label htmlFor="requirement_details" className="block text-sm font-medium text-gray-700">
            Requirement Details
          </label>
          <textarea
            id="requirement_details"
            rows={4}
            {...register('requirement_details', { required: 'Requirement details are required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          ></textarea>
          {errors.requirement_details && (
            <p className="mt-1 text-sm text-red-600">{errors.requirement_details.message}</p>
          )}
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            id="remarks"
            rows={3}
            {...register('remarks')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {saving ? 'Saving...' : 'Update Enquiry'}
          </button>
        </div>
      </form>
    </div>
  );
}
