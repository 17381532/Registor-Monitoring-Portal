import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SurgicalCaseIndex({ surgicalCases, fbunits }) {
    const getStatusBadge = (status) => {
        const statusStyles = {
            scheduled: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            postponed: 'bg-yellow-100 text-yellow-800'
        };

        const statusLabels = {
            scheduled: 'Scheduled',
            in_progress: 'In Progress',
            completed: 'Completed',
            cancelled: 'Cancelled',
            postponed: 'Postponed'
        };

        return (
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this surgical case?')) {
            router.delete(route('surgical-case.destroy', id));
        }
    };

    const handleStatusChange = (id, status) => {
        const routes = {
            start: route('surgical-case.start', id),
            complete: route('surgical-case.complete', id),
            cancel: route('surgical-case.cancel', id),
            postpone: route('surgical-case.postpone', id)
        };

        if (routes[status]) {
            router.post(routes[status]);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">Surgical Cases</h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route('surgical-case.export')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Export
                        </Link>
                        <Link
                            href={route('surgical-case.create')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Create New Case
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Surgical Cases" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search cases..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">FBU</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">All FBUs</option>
                                    {fbunits?.map(fbu => (
                                        <option key={fbu.id} value={fbu.id}>{fbu.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">All Status</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="postponed">Postponed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cases Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Case ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Patient
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Procedure
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                FBU
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Schedule
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {surgicalCases?.data?.map((case_) => (
                                            <tr key={case_.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{case_.id}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{case_.patient_name}</div>
                                                    <div className="text-sm text-gray-500">{case_.patient_id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{case_.procedure_name}</div>
                                                    <div className="text-sm text-gray-500">{case_.procedure_code}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{case_.fbu?.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(case_.scheduled_start_time).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(case_.scheduled_start_time).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(case_.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route('surgical-case.show', case_.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('surgical-case.edit', case_.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        {case_.status === 'scheduled' && (
                                                            <button
                                                                onClick={() => handleStatusChange(case_.id, 'start')}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Start
                                                            </button>
                                                        )}
                                                        {case_.status === 'in_progress' && (
                                                            <button
                                                                onClick={() => handleStatusChange(case_.id, 'complete')}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Complete
                                                            </button>
                                                        )}
                                                        {(case_.status === 'scheduled' || case_.status === 'in_progress') && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(case_.id, 'cancel')}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(case_.id, 'postpone')}
                                                                    className="text-yellow-600 hover:text-yellow-900"
                                                                >
                                                                    Postpone
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(case_.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {(!surgicalCases?.data || surgicalCases.data.length === 0) && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="mt-4 text-gray-500">No surgical cases found.</p>
                                    <Link
                                        href={route('surgical-case.create')}
                                        className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                                    >
                                        Create your first case
                                    </Link>
                                </div>
                            )}

                            {/* Pagination */}
                            {surgicalCases?.links && surgicalCases.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {surgicalCases.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                    ${link.active 
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }
                                                    ${index === 0 ? 'rounded-l-md' : ''}
                                                    ${index === surgicalCases.links.length - 1 ? 'rounded-r-md' : ''}
                                                    ${!link.url ? 'cursor-not-allowed opacity-50' : ''}
                                                `}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}