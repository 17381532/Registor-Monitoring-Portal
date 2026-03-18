import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function SurgicalCaseIndex({ cases, fbUs, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [fbuId, setFbuId] = useState(filters?.fbu_id || '');

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'search') {
            setSearch(value);
        } else if (name === 'status') {
            setStatus(value);
        } else {
            setFbuId(value);
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

    const getExportRows = () =>
        cases.data.map((caseItem) => ({
            'Case #': caseItem.case_number,
            Patient: caseItem.patient_name,
            FBU: caseItem.fbu?.name || '',
            Status: caseItem.status.replace('_', ' '),
            'Scheduled Time': formatDate(caseItem.scheduled_start_time),
            Surgeon: caseItem.surgeon_name || '',
            'Performance Score': caseItem.performance_score ? caseItem.performance_score.toFixed(1) : '',
        }));

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getExportRows());
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cases');

        const filename = `surgical-cases-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, filename);
    };

    const exportToPdf = () => {
        const doc = new jsPDF();
        const rows = getExportRows();
        const headers = rows.length ? Object.keys(rows[0]) : [];

        doc.text('Surgical Cases', 14, 16);
        doc.autoTable({
            startY: 22,
            head: [headers],
            body: rows.map((row) => headers.map((key) => row[key])),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [30, 41, 59] },
        });

        const filename = `surgical-cases-${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(filename);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Surgical Cases</h2>}
        >
            <Head title="Surgical Cases Monitoring" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Surgical Cases Monitoring</h1>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            <button
                                type="button"
                                onClick={exportToExcel}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Export XLSX
                            </button>

                            <button
                                type="button"
                                onClick={exportToPdf}
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            >
                                Export PDF
                            </button>

                            <Link
                                href={route('surgical-case.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Create Case
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search by patient or case #..."
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
                            <select
                                name="fbu_id"
                                value={fbuId}
                                onChange={handleFilterChange}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All FBUs</option>
                                {fbUs.map((fbu) => (
                                    <option key={fbu.id} value={fbu.id}>
                                        {fbu.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setStatus('');
                                    setFbuId('');
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Cases Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {cases.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold">Case #</th>
                                            <th className="px-6 py-4 text-left font-semibold">Patient</th>
                                            <th className="px-6 py-4 text-left font-semibold">FBU</th>
                                            <th className="px-6 py-4 text-left font-semibold">Status</th>
                                            <th className="px-6 py-4 text-left font-semibold">Scheduled</th>
                                            <th className="px-6 py-4 text-left font-semibold">Surgeon</th>
                                            <th className="px-6 py-4 text-left font-semibold">Performance</th>
                                            <th className="px-6 py-4 text-left font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {cases.data.map((caseItem) => (
                                            <tr key={caseItem.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-semibold text-gray-900">{caseItem.case_number}</td>
                                                <td className="px-6 py-4">{caseItem.patient_name}</td>
                                                <td className="px-6 py-4 text-sm">{caseItem.fbu.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                                                        {caseItem.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs">{formatDate(caseItem.scheduled_start_time)}</td>
                                                <td className="px-6 py-4 text-sm">{caseItem.surgeon_name || '—'}</td>
                                                <td className="px-6 py-4">
                                                    {caseItem.performance_score ? (
                                                        <span className="font-semibold text-gray-900">{caseItem.performance_score.toFixed(1)}</span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
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
                                <p className="text-gray-500 text-lg">No surgical cases found</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {cases.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <div className="text-sm text-gray-600">
                                Page {cases.current_page} of {cases.last_page}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
