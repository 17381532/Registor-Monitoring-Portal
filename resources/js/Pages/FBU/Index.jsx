import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function FBUIndex({ fbUs, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'search') {
            setSearch(value);
        } else {
            setStatus(value);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Functional Based Units (FBU)</h2>}
        >
            <Head title="FBU Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header and Create Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">FBU Monitoring</h1>
                        <Link
                            href={route('fbu.create')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Create FBU
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search by name or code..."
                                value={search}
                                onChange={handleFilterChange}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <select
                                name="status"
                                value={status}
                                onChange={handleFilterChange}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setStatus('');
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* FBU Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fbUs.data.length > 0 ? (
                            fbUs.data.map((fbu) => (
                                <Link
                                    key={fbu.id}
                                    href={route('fbu.show', fbu.id)}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{fbu.name}</h3>
                                            <p className="text-sm text-gray-500">Code: {fbu.code}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(fbu.status)}`}>
                                            {fbu.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Cases:</span>
                                            <span className="font-semibold">{fbu.total_cases}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Completed:</span>
                                            <span className="font-semibold">{fbu.completed_cases}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Avg Performance:</span>
                                            <span className="font-semibold">{fbu.average_performance_score.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {fbu.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{fbu.description}</p>
                                    )}

                                    <div className="pt-4 border-t flex gap-2">
                                        <Link
                                            href={route('fbu.edit', fbu.id)}
                                            className="flex-1 text-center px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Edit
                                        </Link>
                                        <button className="flex-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                                            View Details
                                        </button>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">No FBUs found</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {fbUs.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <div className="text-sm text-gray-600">
                                Page {fbUs.current_page} of {fbUs.last_page}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
