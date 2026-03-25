import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { exportToExcel, exportToPDF } from '@/utils/export';

export default function MonitoringIndex({ logs, stats, filters }) {
    const [exporting, setExporting] = useState(false);

    const handleExportExcel = () => {
        setExporting(true);
        try {
            exportToExcel(logs.data, 'monitoring_logs');
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    const handleExportPDF = () => {
        setExporting(true);
        try {
            exportToPDF(logs.data, 'Monitoring Logs Report', filters);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    const handleExportAll = () => {
        // Fetch all data without pagination
        router.get(route('monitoring.index'), { ...filters, export: 'all' }, {
            preserveState: false,
            onSuccess: (page) => {
                if (page.props.exportData) {
                    exportToExcel(page.props.exportData, 'all_monitoring_logs');
                }
            }
        });
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
                        {/* Export Buttons */}
                        <div className="relative">
                            <button
                                onClick={handleExportExcel}
                                disabled={exporting}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                Excel
                            </button>
                        </div>
                        
                        <button
                            onClick={handleExportPDF}
                            disabled={exporting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            PDF
                        </button>
                        
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

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-sm font-medium text-gray-500">Backups</h3>
                            <div className="mt-2">
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_backups}</p>
                                <p className="text-xs text-gray-500">Total backup files</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
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
                                <select
                                    onChange={(e) => router.get(route('monitoring.index'), { ...filters, status: e.target.value })}
                                    value={filters.status || ''}
                                    className="text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">All Status</option>
                                    <option value="up">Up</option>
                                    <option value="down">Down</option>
                                </select>
                                <select
                                    onChange={(e) => router.get(route('monitoring.index'), { ...filters, has_backup: e.target.value })}
                                    value={filters.has_backup || ''}
                                    className="text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">All Backups</option>
                                    <option value="yes">Has Backup</option>
                                    <option value="no">No Backup</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Export Info Bar */}
                    <div className="mb-4 flex justify-end items-center gap-2 text-sm text-gray-500">
                        <span>{logs.total} total records</span>
                        <span>•</span>
                        <span>Showing {logs.from}-{logs.to} of {logs.total}</span>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">System</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monitored By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(log.monitoring_date).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    log.location === 'BMDH' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {log.location}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{log.system_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{log.monitored_by}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(log.status)}`}>
                                                    {log.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {log.backup_file_name ? (
                                                    <a 
                                                        href={route('monitoring.download-backup', log.id)}
                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        {log.backup_file_name.substring(0, 20)}...
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {log.response_time_ms ? `${log.response_time_ms}ms` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={route('monitoring.edit', log.id)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this log?')) {
                                                            router.delete(route('monitoring.destroy', log.id));
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {logs.data.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No monitoring logs found.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {logs.links && logs.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Showing {logs.from} to {logs.to} of {logs.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {logs.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded ${
                                                    link.active 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}