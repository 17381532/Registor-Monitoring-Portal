import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function FBUShow({ fbu, cases, filters }) {
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
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'postponed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">FBU Details</h2>}
        >
            <Head title={fbu.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* FBU Header */}
                    <div className="bg-white rounded-lg shadow p-8 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{fbu.name}</h1>
                                <p className="text-gray-600 text-sm mt-1">Code: {fbu.code}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    fbu.status === 'active' ? 'bg-green-100 text-green-800' :
                                    fbu.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {fbu.status}
                                </span>
                                <Link
                                    href={route('fbu.edit', fbu.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>

                        {fbu.description && (
                            <p className="text-gray-600 mb-6">{fbu.description}</p>
                        )}

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Total Cases</p>
                                <p className="text-2xl font-bold text-blue-600">{fbu.total_cases}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{fbu.completed_cases}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Avg Performance</p>
                                <p className="text-2xl font-bold text-purple-600">{fbu.average_performance_score.toFixed(2)}</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Completion Rate</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {fbu.total_cases > 0 ? ((fbu.completed_cases / fbu.total_cases) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cases Section */}
                    <div className="bg-white rounded-lg shadow p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Surgical Cases</h2>
                            <Link
                                href={route('surgical-case.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                New Case
                            </Link>
                        </div>

                        {/* Filters */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search by patient name or case number..."
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
                                <option value="scheduled">Scheduled</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="postponed">Postponed</option>
                            </select>
                        </div>

                        {/* Cases Table */}
                        {cases.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Case #</th>
                                            <th className="px-4 py-3 text-left">Patient</th>
                                            <th className="px-4 py-3 text-left">Status</th>
                                            <th className="px-4 py-3 text-left">Scheduled Start</th>
                                            <th className="px-4 py-3 text-left">Performance</th>
                                            <th className="px-4 py-3 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {cases.data.map((caseItem) => (
                                            <tr key={caseItem.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-semibold">{caseItem.case_number}</td>
                                                <td className="px-4 py-3">{caseItem.patient_name}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                                                        {caseItem.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs">{formatDate(caseItem.scheduled_start_time)}</td>
                                                <td className="px-4 py-3">
                                                    {caseItem.performance_score ? (
                                                        <span className="font-semibold text-gray-900">{caseItem.performance_score.toFixed(1)}</span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={route('surgical-case.show', caseItem.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No surgical cases found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
