import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function SurgicalCaseCreate({ fbUs }) {
    const { data, setData, post, errors, processing } = useForm({
        fbu_id: '',
        case_number: '',
        patient_name: '',
        procedure_description: '',
        status: 'scheduled',
        scheduled_start_time: '',
        scheduled_end_time: '',
        estimated_duration_minutes: '',
        surgeon_name: '',
        anesthetist_name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('surgical-case.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Create Surgical Case</h2>}
        >
            <Head title="Create Surgical Case" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">New Surgical Case</h1>
                                <p className="mt-1 text-sm text-gray-600">Add a new case and schedule the operating room.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase">FBU <span className="text-red-500">*</span></label>
                                    <select
                                        name="fbu_id"
                                        value={data.fbu_id}
                                        onChange={handleChange}
                                        className={`mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                            errors.fbu_id ? 'border-red-400' : 'border-gray-200'
                                        }`}
                                    >
                                        <option value="">Select FBU</option>
                                        {fbUs.map((fbu) => (
                                            <option key={fbu.id} value={fbu.id}>
                                                {fbu.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.fbu_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fbu_id}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase">Case Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="case_number"
                                        value={data.case_number}
                                        onChange={handleChange}
                                        className={`mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                            errors.case_number ? 'border-red-400' : 'border-gray-200'
                                        }`}
                                        placeholder="e.g., CS-2025-001"
                                    />
                                    {errors.case_number && (
                                        <p className="mt-1 text-sm text-red-600">{errors.case_number}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase">Patient Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="patient_name"
                                        value={data.patient_name}
                                        onChange={handleChange}
                                        className={`mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                            errors.patient_name ? 'border-red-400' : 'border-gray-200'
                                        }`}
                                        placeholder="Enter patient name"
                                    />
                                    {errors.patient_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.patient_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase">Status <span className="text-red-500">*</span></label>
                                    <select
                                        name="status"
                                        value={data.status}
                                        onChange={handleChange}
                                        className={`mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                            errors.status ? 'border-red-400' : 'border-gray-200'
                                        }`}
                                    >
                                        <option value="scheduled">Scheduled</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="postponed">Postponed</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 uppercase">Procedure Description</label>
                                <textarea
                                    name="procedure_description"
                                    value={data.procedure_description}
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 bg-white border rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    placeholder="Enter procedure details"
                                    rows="4"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase">Scheduled Start</label>
                                    <input
                                        type="datetime-local"
                                        name="scheduled_start_time"
                                        value={data.scheduled_start_time}
                                        onChange={handleChange}
                                        className={`mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                            errors.scheduled_start_time ? 'border-red-400' : 'border-gray-200'
                                        }`}
                                    />
                                    {errors.scheduled_start_time && (
                                        <p className="mt-1 text-sm text-red-600">{errors.scheduled_start_time}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase">Scheduled End</label>
                                    <input
                                        type="datetime-local"
                                        name="scheduled_end_time"
                                        value={data.scheduled_end_time}
                                        onChange={handleChange}
                                        className={`mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                            errors.scheduled_end_time ? 'border-red-400' : 'border-gray-200'
                                        }`}
                                    />
                                    {errors.scheduled_end_time && (
                                        <p className="mt-1 text-sm text-red-600">{errors.scheduled_end_time}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase">Surgeon Name</label>
                                    <input
                                        type="text"
                                        name="surgeon_name"
                                        value={data.surgeon_name}
                                        onChange={handleChange}
                                        className="mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        placeholder="Enter surgeon name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase">Anesthetist Name</label>
                                    <input
                                        type="text"
                                        name="anesthetist_name"
                                        value={data.anesthetist_name}
                                        onChange={handleChange}
                                        className="mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        placeholder="Enter anesthetist name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 uppercase">Estimated Duration (minutes)</label>
                                <input
                                    type="number"
                                    name="estimated_duration_minutes"
                                    value={data.estimated_duration_minutes}
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-2 bg-white border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    placeholder="e.g., 120"
                                    min="1"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t">
                                <a
                                    href={route('surgical-case.index')}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-600 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Case'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
