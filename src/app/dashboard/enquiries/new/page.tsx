'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Segment, Status, Customer } from '@/types/database.types';

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
};

export default function NewEnquiry() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      segment: 'Agri',
      status: 'Lead',
    },
  });

  const customerName = watch('customer_name');
  const phone = watch('phone');

  useEffect(() => {
    // Get the selected user from localStorage
    const user = localStorage.getItem('selectedUser');

    // If no user is selected, we'll show a selection in the form instead of redirecting
    setSelectedUser(user);

    // Fetch customers for auto-complete
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*');

        if (error) throw error;
        if (data) {
          setCustomers(data as Customer[]);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, [router]);

  // Auto-fill customer details when name is selected
  useEffect(() => {
    if (customerName) {
      const customer = customers.find(c => c.name === customerName);
      if (customer) {
        setValue('phone', customer.phone);
        setValue('location', customer.location);
      }
    }
  }, [customerName, customers, setValue]);

  const onSubmit = async (data: FormData) => {
    // If no user is selected, show an alert
    if (!selectedUser) {
      alert('Please select a user (Amit or Prateek) before creating an enquiry.');
      router.push('/dashboard');
      return;
    }

    setLoading(true);
    try {
      // Check if customer exists
      let customerId = null;
      const { data: existingCustomers } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', data.phone)
        .single();

      // If customer doesn't exist, create one
      if (!existingCustomers) {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: data.customer_name,
            phone: data.phone,
            location: data.location,
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer?.id;
      } else {
        customerId = existingCustomers.id;
      }

      // Create the enquiry
      const { error: enquiryError } = await supabase
        .from('enquiries')
        .insert({
          date: data.date,
          segment: data.segment,
          customer_id: customerId,
          customer_name: data.customer_name,
          phone: data.phone,
          location: data.location,
          requirement_details: data.requirement_details,
          status: data.status,
          remarks: data.remarks,
          reminder_date: data.reminder_date || null,
          assigned_to: selectedUser,
        });

      if (enquiryError) throw enquiryError;

      console.log('Enquiry created successfully!');

      // Show success message
      alert('Enquiry created successfully!');

      // Redirect to enquiries page
      router.push('/dashboard/enquiries');
    } catch (error) {
      console.error('Error creating enquiry:', error);
      alert('Failed to create enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">New Enquiry</h1>

      {!selectedUser && (
        <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="mb-2 font-medium text-yellow-800">
            Please select a user to assign this enquiry to:
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                setSelectedUser('Amit');
                localStorage.setItem('selectedUser', 'Amit');
              }}
              className="rounded-md bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Amit
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedUser('Prateek');
                localStorage.setItem('selectedUser', 'Prateek');
              }}
              className="rounded-md bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Prateek
            </button>
          </div>
        </div>
      )}

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
              list="customer-list"
              {...register('customer_name', { required: 'Customer name is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <datalist id="customer-list">
              {customers.map((customer) => (
                <option key={customer.id} value={customer.name} />
              ))}
            </datalist>
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
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Saving...' : 'Save Enquiry'}
          </button>
        </div>
      </form>
    </div>
  );
}
