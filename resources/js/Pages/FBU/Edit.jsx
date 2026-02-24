import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function FBUEdit({ fbu }) {
    const { data, setData, patch, errors, processing } = useForm({
        name: fbu.name,
        code: fbu.code,
        description: fbu.description || '',
        status: fbu.status,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('fbu.update', fbu.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Edit FBU</h2>}
        >
            <Head title={`Edit ${fbu.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">FBU Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter FBU name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Code *</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={data.code}
                                    onChange={handleChange}
                                    className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                        errors.code ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., FBU001"
                                />
                                {errors.code && (
                                    <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Description</label>
                                <textarea
                                    name="description"
                                    value={data.description}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter FBU description"
                                    rows="4"
                                ></textarea>
                            </div>

                            {/* Status */}
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
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-6 border-t">
                                <a
                                    href={route('fbu.show', fbu.id)}
                                    className="flex-1 text-center px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update FBU'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
