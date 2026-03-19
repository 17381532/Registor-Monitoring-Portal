import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SurgicalCaseCreate({ fbunits }) {
    const { data, setData, post, errors, processing } = useForm({
        patient_name: '',
        patient_id: '',
        procedure_name: '',
        procedure_code: '',
        fbu_id: '',
        scheduled_start_time: '',
        scheduled_end_time: '',
        surgeon: '',
        anesthesiologist: '',
        notes: '',
        status: 'scheduled'
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

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Patient Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Patient Name *</label>
                                        <input
                                            type="text"
                                            name="patient_name"
                                            value={data.patient_name}
                                            onChange={handleChange}
                                            className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                                errors.patient_name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter patient name"
                                        />
                                        {errors.patient_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.patient_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Patient ID *</label>
                                        <input
                                            type="text"
                                            name="patient_id"
                                            value={data.patient_id}
                                            onChange={handleChange}
                                            className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                                errors.patient_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter patient ID"
                                        />
                                        {errors.patient_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.patient_id}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Procedure Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Procedure Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Procedure Name *</label>
                                        <input
                                            type="text"
                                            name="procedure_name"
                                            value={data.procedure_name}
                                            onChange={handleChange}
                                            className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                                errors.procedure_name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter procedure name"
                                        />
                                        {errors.procedure_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.procedure_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Procedure Code</label>
                                        <input
                                            type="text"
                                            name="procedure_code"
                                            value={data.procedure_code}
                                            onChange={handleChange}
                                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            placeholder="Enter procedure code"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">FBU *</label>
                                        <select
                                            name="fbu_id"
                                            value={data.fbu_id}
                                            onChange={handleChange}
                                            className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                                errors.fbu_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select FBU</option>
                                            {fbunits.map(fbu => (
                                                <option key={fbu.id} value={fbu.id}>{fbu.name} ({fbu.code})</option>
                                            ))}
                                        </select>
                                        {errors.fbu_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fbu_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Status</label>
                                        <select
                                            name="status"
                                            value={data.status}
                                            onChange={handleChange}
                                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="postponed">Postponed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Start Time *</label>
                                        <input
                                            type="datetime-local"
                                            name="scheduled_start_time"
                                            value={data.scheduled_start_time}
                                            onChange={handleChange}
                                            className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                                errors.scheduled_start_time ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.scheduled_start_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.scheduled_start_time}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">End Time *</label>
                                        <input
                                            type="datetime-local"
                                            name="scheduled_end_time"
                                            value={data.scheduled_end_time}
                                            onChange={handleChange}
                                            className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                                errors.scheduled_end_time ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.scheduled_end_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.scheduled_end_time}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Medical Team */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Team</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Surgeon *</label>
                                        <input
                                            type="text"
                                            name="surgeon"
                                            value={data.surgeon}
                                            onChange={handleChange}
                                            className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                                errors.surgeon ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter surgeon name"
                                        />
                                        {errors.surgeon && (
                                            <p className="mt-1 text-sm text-red-600">{errors.surgeon}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Anesthesiologist *</label>
                                        <input
                                            type="text"
                                            name="anesthesiologist"
                                            value={data.anesthesiologist}
                                            onChange={handleChange}
                                            className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                                errors.anesthesiologist ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter anesthesiologist name"
                                        />
                                        {errors.anesthesiologist && (
                                            <p className="mt-1 text-sm text-red-600">{errors.anesthesiologist}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Notes</label>
                                <textarea
                                    name="notes"
                                    value={data.notes}
                                    onChange={handleChange}
                                    rows="4"
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter any additional notes"
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-6 border-t">
                                <a
                                    href={route('surgical-case.index')}
                                    className="flex-1 text-center px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Surgical Case'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}