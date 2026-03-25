import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MonitoringCreate({ location, systemType }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    
    const { data, setData, post, errors, processing } = useForm({
        location: location,
        system_type: systemType,
        monitoring_date: new Date().toISOString().slice(0, 16),
        monitored_by: '',
        status: 'up',
        backup_location: '',
        backup_file: null,
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setData('backup_file', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create FormData for file upload
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        
        // IMPORTANT: Use monitoring.store, NOT monitoring.create
        post(route('monitoring.store'), {
            data: formData,
            forceFormData: true,
        });
    };

    const locationInfo = {
        BMDH: {
            name: 'BMDH',
            system: 'FBU System',
            color: '#3b82f6',
            icon: '🏥',
            bgLight: '#eff6ff'
        },
        SBAH: {
            name: 'SBAH',
            system: 'Surgical Case System',
            color: '#8b5cf6',
            icon: '⚕️',
            bgLight: '#f5f3ff'
        }
    };

    const info = locationInfo[location];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Log Monitoring Check - {info.name} ({info.system})
                </h2>
            }
        >
            <Head title="Add Monitoring Log" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        {/* Location Banner */}
                        <div className="mb-6 p-4 rounded-lg" style={{ 
                            background: info.bgLight,
                            borderLeft: `4px solid ${info.color}`
                        }}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{info.icon}</span>
                                <div>
                                    <h3 style={{ color: info.color }} className="font-semibold">
                                        {info.name} - {info.system}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {location === 'SBAH' 
                                            ? 'Upload backup file to ensure data safety' 
                                            : 'Log FBU system status'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Date and Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="monitoring_date"
                                    value={data.monitoring_date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.monitoring_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.monitoring_date}</p>
                                )}
                            </div>

                            {/* Monitored By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Monitored By *
                                </label>
                                <input
                                    type="text"
                                    name="monitored_by"
                                    value={data.monitored_by}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter your name"
                                    required
                                />
                                {errors.monitored_by && (
                                    <p className="mt-1 text-sm text-red-600">{errors.monitored_by}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    System Status *
                                </label>
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

                            {/* Backup Section - Only for SBAH Surgical Cases */}
                            {location === 'SBAH' && systemType === 'Surgical Case' && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Information</h3>
                                    
                                    {/* Backup Location */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Backup Location *
                                        </label>
                                        <input
                                            type="text"
                                            name="backup_location"
                                            value={data.backup_location}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="e.g., Backup Server 1, External Drive, Cloud Storage"
                                        />
                                        {errors.backup_location && (
                                            <p className="mt-1 text-sm text-red-600">{errors.backup_location}</p>
                                        )}
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Backup File
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".zip,.sql,.backup,.bak,.gz,.tar,.sqlite"
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Allowed: zip, sql, backup, bak, gz, tar, sqlite (max 100MB)
                                        </p>
                                        {errors.backup_file && (
                                            <p className="mt-1 text-sm text-red-600">{errors.backup_file}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={data.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter any additional notes or observations"
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4 border-t">
                                <a
                                    href={route('monitoring.dashboard')}
                                    className="flex-1 text-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Saving...' : 'Save Monitoring Log'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}