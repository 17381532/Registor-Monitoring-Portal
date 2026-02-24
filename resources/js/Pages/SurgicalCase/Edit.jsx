import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function SurgicalCaseEdit({ case: surgicalCase, fbUs }) {
    const { data, setData, patch, errors, processing } = useForm({
        fbu_id: surgicalCase.fbu_id,
        case_number: surgicalCase.case_number,
        patient_name: surgicalCase.patient_name,
        procedure_description: surgicalCase.procedure_description || '',
        status: surgicalCase.status,
        scheduled_start_time: surgicalCase.scheduled_start_time || '',
        scheduled_end_time: surgicalCase.scheduled_end_time || '',
        estimated_duration_minutes: surgicalCase.estimated_duration_minutes || '',
        performance_score: surgicalCase.performance_score || '',
        notes: surgicalCase.notes || '',
        surgeon_name: surgicalCase.surgeon_name || '',
        anesthetist_name: surgicalCase.anesthetist_name || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('surgical-case.update', surgicalCase.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Edit Surgical Case</h2>}
        >
            <Head title={`Edit ${surgicalCase.case_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* FBU Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <label className="block text-sm font-medium text-gray-900">Case Number *</label>
                                    <input
                                        type="text"
                                        name="case_number"
                                        value={data.case_number}
                                        onChange={handleChange}
                                        className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                            errors.case_number ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.case_number && (
                                        <p className="mt-1 text-sm text-red-600">{errors.case_number}</p>
                                    )}
                                </div>
                            </div>

                            {/* Patient Info */}
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
                                    />
                                    {errors.patient_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.patient_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Status *</label>
                                    <select
                                        name="status"
                                        value={data.status}
                                        onChange={handleChange}
                                        className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                            errors.status ? 'border-red-500' : 'border-gray-300'
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

                            {/* Procedure Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Procedure Description</label>
                                <textarea
                                    name="procedure_description"
                                    value={data.procedure_description}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    rows="3"
                                ></textarea>
                            </div>

                            {/* Schedule */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Scheduled Start Time *</label>
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
                                    <label className="block text-sm font-medium text-gray-900">Scheduled End Time</label>
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

                            {/* Team */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Surgeon Name</label>
                                    <input
                                        type="text"
                                        name="surgeon_name"
                                        value={data.surgeon_name}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Anesthetist Name</label>
                                    <input
                                        type="text"
                                        name="anesthetist_name"
                                        value={data.anesthetist_name}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Performance & Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Performance Score (0-100)</label>
                                    <input
                                        type="number"
                                        name="performance_score"
                                        value={data.performance_score}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                    />
                                    {errors.performance_score && (
                                        <p className="mt-1 text-sm text-red-600">{errors.performance_score}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Estimated Duration (minutes)</label>
                                    <input
                                        type="number"
                                        name="estimated_duration_minutes"
                                        value={data.estimated_duration_minutes}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">Notes</label>
                                <textarea
                                    name="notes"
                                    value={data.notes}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    rows="3"
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-6 border-t">
                                <a
                                    href={route('surgical-case.show', surgicalCase.id)}
                                    className="flex-1 text-center px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Case'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
