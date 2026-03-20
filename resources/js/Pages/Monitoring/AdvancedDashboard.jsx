import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LineChart from '@/Components/Charts/LineChart';
import BarChart from '@/Components/Charts/BarChart';
import PieChart from '@/Components/Charts/PieChart';
import { exportToExcel, exportToPDF } from '@/utils/export';

export default function AdvancedDashboard({ initialStats, initialTrends, initialBackupStats }) {
    const [stats, setStats] = useState(initialStats);
    const [trends, setTrends] = useState(initialTrends);
    const [backupStats, setBackupStats] = useState(initialBackupStats);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState('dashboard');

    // Auto-refresh functionality
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchData();
            }, refreshInterval);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, dateRange]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/monitoring/dashboard-data?start=${dateRange.start}&end=${dateRange.end}`);
            const data = await response.json();
            setStats(data.stats);
            setTrends(data.trends);
            setBackupStats(data.backupStats);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    // Prepare chart data
    const uptimeChartData = {
        labels: trends.labels || [],
        datasets: [
            {
                label: 'BMDH - FBU System',
                data: trends.bmdhUptime || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'SBAH - Surgical System',
                data: trends.sbahUptime || [],
                borderColor: 'rgb(139, 92, 246)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const incidentsChartData = {
        labels: trends.labels || [],
        datasets: [
            {
                label: 'System Incidents',
                data: trends.incidents || [],
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderRadius: 8,
            },
        ],
    };

    const backupChartData = {
        labels: backupStats.types || [],
        datasets: [
            {
                label: 'Backup Distribution',
                data: backupStats.counts || [],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const handleExportExcel = () => {
        const exportData = trends.recentLogs.map(log => ({
            'Date/Time': new Date(log.monitoring_date).toLocaleString(),
            'Location': log.location,
            'System': log.system_type,
            'Status': log.status.toUpperCase(),
            'Monitored By': log.monitored_by,
            'Backup Location': log.backup_location || '-',
            'Notes': log.notes || '-',
            'Response Time (ms)': log.response_time_ms || '-',
        }));
        exportToExcel(exportData, `monitoring_report_${new Date().toISOString().split('T')[0]}`);
    };

    const handleExportPDF = () => {
        const exportData = trends.recentLogs || [];
        exportToPDF(exportData, `Monitoring Report - ${dateRange.start} to ${dateRange.end}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">Advanced Monitoring Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        {/* Auto-refresh controls */}
                        <div className="flex items-center space-x-2">
                            <label className="flex items-center space-x-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span>Auto-refresh</span>
                            </label>
                            {autoRefresh && (
                                <select
                                    value={refreshInterval}
                                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                                    className="text-sm border-gray-300 rounded-md"
                                >
                                    <option value={15000}>15 seconds</option>
                                    <option value={30000}>30 seconds</option>
                                    <option value={60000}>1 minute</option>
                                    <option value={300000}>5 minutes</option>
                                </select>
                            )}
                        </div>
                        
                        {/* Export buttons */}
                        <button
                            onClick={handleExportExcel}
                            className="btn-secondary text-sm"
                        >
                            📊 Export Excel
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="btn-secondary text-sm"
                        >
                            📄 Export PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Advanced Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Date Range Selector */}
                    <div className="mb-6 bg-white rounded-lg shadow p-4">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Date Range:</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="form-input text-sm"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="form-input text-sm"
                            />
                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className="btn-primary text-sm"
                            >
                                {loading ? 'Loading...' : 'Apply Filter'}
                            </button>
                        </div>
                    </div>

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span>Updating dashboard...</span>
                            </div>
                        </div>
                    )}

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">BMDH Uptime</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.bmdhUptime || 0}%</p>
                                </div>
                                <div className="text-3xl">🏥</div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">Last 30 days average</div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">SBAH Uptime</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.sbahUptime || 0}%</p>
                                </div>
                                <div className="text-3xl">⚕️</div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">Last 30 days average</div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Backups</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.totalBackups || 0}</p>
                                </div>
                                <div className="text-3xl">💾</div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">All time</div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Incidents</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.activeIncidents || 0}</p>
                                </div>
                                <div className="text-3xl">⚠️</div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">Currently open</div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Uptime Trends Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                System Uptime Trends
                                {autoRefresh && <span className="ml-2 text-xs text-green-600 animate-pulse">● Live</span>}
                            </h3>
                            <LineChart data={uptimeChartData} height={350} />
                        </div>

                        {/* Incidents Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Incidents</h3>
                            <BarChart data={incidentsChartData} height={350} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Backup Distribution */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Distribution</h3>
                            <PieChart data={backupChartData} height={300} />
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance Metrics</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Average Response Time</span>
                                        <span className="font-medium">{stats.avgResponseTime || 0}ms</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill bg-blue-600" 
                                            style={{ width: `${Math.min((stats.avgResponseTime || 0) / 10, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Success Rate</span>
                                        <span className="font-medium text-green-600">{stats.successRate || 0}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill bg-green-600" 
                                            style={{ width: `${stats.successRate || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Backup Success Rate</span>
                                        <span className="font-medium text-purple-600">{stats.backupSuccessRate || 0}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill bg-purple-600" 
                                            style={{ width: `${stats.backupSuccessRate || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Monitoring Activity</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">System</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monitored By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trends.recentLogs?.map((log) => (
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    log.status === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {log.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{log.monitored_by}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {log.response_time_ms ? `${log.response_time_ms}ms` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e5e7eb;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    transition: width 0.3s ease;
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}