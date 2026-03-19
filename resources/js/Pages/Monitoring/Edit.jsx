import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MonitoringEdit({ log }) {
    const { data, setData, put, errors, processing } = useForm({
        location: log.location,
        system_type: log.system_type,
        monitoring_date: log.monitoring_date.slice(0, 16),
        monitored_by: log.monitored_by,
        status: log.status,
        backup_location: log.backup_location || '',
        notes: log.notes || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('monitoring.update', log.id));
    };

    const locationInfo = {
        BMDH: {
            name: 'BMDH',
            system: 'FBU System',
            color: 'blue',
            icon: '🏥'
        },
        SBAH: {
            name: 'SBAH',
            system: 'Surgical Case System',
            color: 'purple',
            icon: '⚕️'
        }
    };

    const info = locationInfo[log.location];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Edit Monitoring Log - {info.name} ({info.system})
                </h2>
            }
        >
            <Head title="Edit Monitoring Log" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-8">
                        {/* Location Banner */}
                        <div className={`mb-6 p-4 bg-${info.color}-50 rounded-lg border border-${info.color}-200`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{info.icon}</span>
                                <div>
                                    <h3 className={`font-semibold text-${info.color}-800`}>{info.name} - {info.system}</h3>
                                    <p className={`text-sm text-${info.color}-600`}>
                                        {log.location === 'SBAH' ? 'Update backup location if needed' : 'Update FBU system status'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Date and Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    name="monitoring_date"
                                    value={data.monitoring_date}
                                    onChange={handleChange}
                                    className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                        errors.monitoring_date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.monitoring_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.monitoring_date}</p>
                                )}
                            </div>

                            {/* Monitored By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Monitored By *</label>
                                <input
                                    type="text"
                                    name="monitored_by"
                                    value={data.monitored_by}
                                    onChange={handleChange}
                                    className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                        errors.monitored_by ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your name"
                                />
                                {errors.monitored_by && (
                                    <p className="mt-1 text-sm text-red-600">{errors.monitored_by}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">System Status *</label>
                                <div className="mt-2 grid grid-cols-2 gap-4">
                                    <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        data.status === 'up' 
                                            ? 'bg-green-50 border-green-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="up"
                                            checked={data.status === 'up'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="text-center">
                                            <div className="text-2xl mb-2">✅</div>
                                            <span className="font-medium">System Up</span>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        data.status === 'down' 
                                            ? 'bg-red-50 border-red-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="down"
                                            checked={data.status === 'down'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="text-center">
                                            <div className="text-2xl mb-2">❌</div>
                                            <span className="font-medium">System Down</span>
                                        </div>
                                    </label>
                                </div>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>

                            {/* Backup Location - Only for SBAH Surgical Cases */}
                            {log.location === 'SBAH' && log.system_type === 'Surgical Case' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Backup Location *</label>
                                    <input
                                        type="text"
                                        name="backup_location"
                                        value={data.backup_location}
                                        onChange={handleChange}
                                        className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                                            errors.backup_location ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="e.g., Backup Server 1, External Drive, Cloud Storage"
                                    />
                                    {errors.backup_location && (
                                        <p className="mt-1 text-sm text-red-600">{errors.backup_location}</p>
                                    )}
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Notes</label>
                                <textarea
                                    name="notes"
                                    value={data.notes}
                                    onChange={handleChange}
                                    rows="4"
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter any additional notes or observations"
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-6 border-t">
                                <a
                                    href={route('monitoring.index')}
                                    className="flex-1 text-center px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Monitoring Log'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}