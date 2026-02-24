import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function SurgicalCaseShow({ case: surgicalCase, metrics }) {
    const [showMetricForm, setShowMetricForm] = useState(false);
    const [showCompleteForm, setShowCompleteForm] = useState(false);

    const { data: metricData, setData: setMetricData, post: postMetric, reset: resetMetric } = useForm({
        metric_name: '',
        metric_value: '',
        unit: '',
        notes: '',
    });

    const { data: completeData, setData: setCompleteData, post: postComplete, reset: resetComplete } = useForm({
        performance_score: '',
        notes: '',
    });

    const { post: postAction, processing: actionProcessing } = useForm();

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
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString();
    };

    const handleMetricSubmit = (e) => {
        e.preventDefault();
        postMetric(route('surgical-case.addMetric', surgicalCase.id), {
            onSuccess: () => {
                resetMetric();
                setShowMetricForm(false);
                window.location.reload();
            },
        });
    };

    const handleCompleteSubmit = (e) => {
        e.preventDefault();
        postComplete(route('surgical-case.complete', surgicalCase.id), {
            onSuccess: () => {
                resetComplete();
                setShowCompleteForm(false);
                window.location.reload();
            },
        });
    };

    const handleAction = (routeName) => {
        postAction(route(routeName, surgicalCase.id), {
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    const handleMetricChange = (e) => {
        const { name, value } = e.target;
        setMetricData(name, value);
    };

    const handleCompleteChange = (e) => {
        const { name, value } = e.target;
        setCompleteData(name, value);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Case Details</h2>}
        >
            <Head title={surgicalCase.case_number} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow p-8 mb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{surgicalCase.case_number}</h1>
                                <p className="text-gray-600 text-sm mt-1">Patient: {surgicalCase.patient_name}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(surgicalCase.status)}`}>
                                    {surgicalCase.status.replace('_', ' ')}
                                </span>
                                <Link
                                    href={route('surgical-case.edit', surgicalCase.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>

                        {/* Case Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-600">FBU</p>
                                <p className="text-lg font-semibold">{surgicalCase.fbu.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Surgeon</p>
                                <p className="text-lg font-semibold">{surgicalCase.surgeon_name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Anesthetist</p>
                                <p className="text-lg font-semibold">{surgicalCase.anesthetist_name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Performance Score</p>
                                <p className="text-lg font-semibold">{surgicalCase.performance_score ? surgicalCase.performance_score.toFixed(1) : '—'}</p>
                            </div>
                        </div>

                        {surgicalCase.procedure_description && (
                            <div className="bg-gray-50 p-4 rounded mb-6">
                                <p className="text-sm text-gray-600 mb-2">Procedure Description</p>
                                <p className="text-gray-900">{surgicalCase.procedure_description}</p>
                            </div>
                        )}
                    </div>

                    {/* Schedule & Timing */}
                    <div className="bg-white rounded-lg shadow p-8 mb-6">
                        <h2 className="text-xl font-bold mb-4">Schedule & Timing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600">Scheduled Start</p>
                                <p className="font-semibold">{formatDate(surgicalCase.scheduled_start_time)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Scheduled End</p>
                                <p className="font-semibold">{formatDate(surgicalCase.scheduled_end_time)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Actual Start</p>
                                <p className="font-semibold">{formatDate(surgicalCase.actual_start_time)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Actual End</p>
                                <p className="font-semibold">{formatDate(surgicalCase.actual_end_time)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Estimated Duration</p>
                                <p className="font-semibold">{surgicalCase.estimated_duration_minutes ? `${surgicalCase.estimated_duration_minutes} minutes` : '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Actual Duration</p>
                                <p className="font-semibold">{surgicalCase.actual_duration_minutes ? `${surgicalCase.actual_duration_minutes} minutes` : '—'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {surgicalCase.status !== 'completed' && surgicalCase.status !== 'cancelled' && (
                        <div className="bg-white rounded-lg shadow p-8 mb-6">
                            <h2 className="text-xl font-bold mb-4">Case Actions</h2>
                            <div className="flex flex-wrap gap-3">
                                {surgicalCase.status === 'scheduled' && (
                                    <button
                                        onClick={() => handleAction('surgical-case.start')}
                                        disabled={actionProcessing}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                                    >
                                        Start Case
                                    </button>
                                )}
                                {(surgicalCase.status === 'scheduled' || surgicalCase.status === 'in_progress') && (
                                    <button
                                        onClick={() => setShowCompleteForm(!showCompleteForm)}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Complete Case
                                    </button>
                                )}
                                {(surgicalCase.status === 'scheduled' || surgicalCase.status === 'in_progress') && (
                                    <button
                                        onClick={() => handleAction('surgical-case.postpone')}
                                        disabled={actionProcessing}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        Postpone
                                    </button>
                                )}
                                {(surgicalCase.status === 'scheduled' || surgicalCase.status === 'in_progress') && (
                                    <button
                                        onClick={() => handleAction('surgical-case.cancel')}
                                        disabled={actionProcessing}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {/* Complete Form */}
                            {showCompleteForm && (
                                <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-300">
                                    <form onSubmit={handleCompleteSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Performance Score (0-100) *</label>
                                            <input
                                                type="number"
                                                name="performance_score"
                                                value={completeData.performance_score}
                                                onChange={handleCompleteChange}
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Final Notes</label>
                                            <textarea
                                                name="notes"
                                                value={completeData.notes}
                                                onChange={handleCompleteChange}
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Confirm Complete
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowCompleteForm(false)}
                                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Performance Metrics */}
                    <div className="bg-white rounded-lg shadow p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Performance Metrics</h2>
                            <button
                                onClick={() => setShowMetricForm(!showMetricForm)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Add Metric
                            </button>
                        </div>

                        {showMetricForm && (
                            <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-300">
                                <form onSubmit={handleMetricSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Metric Name *</label>
                                            <input
                                                type="text"
                                                name="metric_name"
                                                value={metricData.metric_name}
                                                onChange={handleMetricChange}
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                placeholder="e.g., blood_loss, complication_rate"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Value *</label>
                                            <input
                                                type="number"
                                                name="metric_value"
                                                value={metricData.metric_value}
                                                onChange={handleMetricChange}
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Unit</label>
                                            <input
                                                type="text"
                                                name="unit"
                                                value={metricData.unit}
                                                onChange={handleMetricChange}
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                placeholder="e.g., ml, %, score"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Notes</label>
                                            <input
                                                type="text"
                                                name="notes"
                                                value={metricData.notes}
                                                onChange={handleMetricChange}
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Save Metric
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowMetricForm(false)}
                                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {metrics && metrics.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Metric Name</th>
                                            <th className="px-4 py-3 text-left">Value</th>
                                            <th className="px-4 py-3 text-left">Unit</th>
                                            <th className="px-4 py-3 text-left">Recorded At</th>
                                            <th className="px-4 py-3 text-left">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {metrics.map((metric) => (
                                            <tr key={metric.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-semibold">{metric.metric_name}</td>
                                                <td className="px-4 py-3">{metric.metric_value}</td>
                                                <td className="px-4 py-3">{metric.unit || '—'}</td>
                                                <td className="px-4 py-3 text-xs">{formatDate(metric.recorded_at)}</td>
                                                <td className="px-4 py-3 text-sm">{metric.notes || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center py-12 text-gray-500">No metrics recorded yet</p>
                        )}
                    </div>

                    {/* Additional Notes */}
                    {surgicalCase.notes && (
                        <div className="bg-white rounded-lg shadow p-8 mt-6">
                            <h2 className="text-xl font-bold mb-4">Notes</h2>
                            <p className="text-gray-900">{surgicalCase.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
