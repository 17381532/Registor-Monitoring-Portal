import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MonitoringIndex({ logs, stats, filters }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this log?')) {
            router.delete(route('monitoring.destroy', id));
        }
    };

    const getStatusBadge = (status) => {
        return status === 'up' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">Monitoring Logs</h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route('monitoring.create', { location: 'BMDH' })}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            + BMDH (FBU)
                        </Link>
                        <Link
                            href={route('monitoring.create', { location: 'SBAH' })}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            + SBAH (Surgical)
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Monitoring Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-sm font-medium text-gray-500">BMDH - FBU</h3>
                            <div className="mt-2 flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.bmdh_total}</p>
                                    <p className="text-xs text-gray-500">Total checks</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-green-600">Up: {stats.bmdh_up}</p>
                                    <p className="text-sm text-red-600">Down: {stats.bmdh_down}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-sm font-medium text-gray-500">SBAH - Surgical</h3>
                            <div className="mt-2 flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.sbah_total}</p>
                                    <p className="text-xs text-gray-500">Total checks</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-green-600">Up: {stats.sbah_up}</p>
                                    <p className="text-sm text-red-600">Down: {stats.sbah_down}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Filters</h3>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <select
                                    onChange={(e) => router.get(route('monitoring.index'), { ...filters, location: e.target.value })}
                                    value={filters.location || ''}
                                    className="text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">All Locations</option>
                                    <option value="BMDH">BMDH</option>
                                    <option value="SBAH">SBAH</option>
                                </select>
                                <select
                                    onChange={(e) => router.get(route('monitoring.index'), { ...filters, system_type: e.target.value })}
                                    value={filters.system_type || ''}
                                    className="text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">All Systems</option>
                                    <option value="FBU">FBU</option>
                                    <option value="Surgical Case">Surgical Case</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">System</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monitored By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(log.monitoring_date).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    log.location === 'BMDH' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {log.location}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{log.system_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{log.monitored_by}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(log.status)}`}>
                                                    {log.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {log.backup_location || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={route('monitoring.edit', log.id)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {logs.links && (
                                <div className="mt-6">
                                    {logs.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`mx-1 px-3 py-1 rounded ${
                                                link.active 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}