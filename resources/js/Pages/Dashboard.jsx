import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ stats }) {
    const statistics = [
        {
            name: 'Total FBUs',
            value: stats?.totalFBUs || 24,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            bgColor: 'bg-blue-500',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            name: 'Active FBUs',
            value: stats?.activeFBUs || 18,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-green-500',
            bgLight: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            name: 'Surgical Cases',
            value: stats?.totalCases || 156,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            bgColor: 'bg-purple-500',
            bgLight: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            name: 'In Progress',
            value: stats?.inProgress || 8,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-yellow-500',
            bgLight: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
    ];

    const recentActivities = [
        { id: 1, user: 'Dr. Smith', action: 'created a new surgical case', time: '2 minutes ago', case: 'Appendectomy' },
        { id: 2, user: 'Dr. Johnson', action: 'completed surgery', time: '15 minutes ago', case: 'Knee Replacement' },
        { id: 3, user: 'Dr. Williams', action: 'updated FBU status', time: '1 hour ago', case: 'Maintenance' },
        { id: 4, user: 'Dr. Brown', action: 'scheduled new case', time: '2 hours ago', case: 'Cataract Surgery' },
        { id: 5, user: 'Dr. Davis', action: 'cancelled surgery', time: '3 hours ago', case: 'Gallbladder Removal' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">Dashboard</h2>
                    <div className="flex space-x-3">
                        <Link href={route('fbu.create')} className="btn-primary">
                            Create FBU
                        </Link>
                        <Link href={route('surgical-case.create')} className="btn-primary">
                            New Case
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
                        <div className="px-8 py-12 relative">
                            <div className="absolute right-0 top-0 opacity-10">
                                <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"/>
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Dr. Smith!</h1>
                                <p className="text-blue-100 text-lg mb-4">Here's what's happening with your surgical cases today.</p>
                                <div className="flex space-x-4">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">8 cases today</span>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">3 in progress</span>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">2 scheduled</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statistics.map((stat, index) => (
                            <div key={index} className="stat-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="stat-label">{stat.name}</p>
                                        <p className="stat-value">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.bgLight} p-3 rounded-lg`}>
                                        <div className={`${stat.textColor}`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm">
                                        <span className="text-green-600 font-medium">↑ 12%</span>
                                        <span className="text-gray-500 ml-2">vs last month</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activities */}
                        <div className="lg:col-span-2">
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium text-sm">
                                                        {activity.user.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">{activity.user}</span>
                                                    {' '}{activity.action}{' '}
                                                    <span className="font-medium text-blue-600">{activity.case}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View all activities →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="lg:col-span-1">
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route('surgical-case.create')}
                                        className="block w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-center font-medium"
                                    >
                                        + New Surgical Case
                                    </Link>
                                    <Link
                                        href={route('fbu.create')}
                                        className="block w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-center font-medium"
                                    >
                                        + Create FBU
                                    </Link>
                                    <Link
                                        href={route('fbu.statistics')}
                                        className="block w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-center font-medium"
                                    >
                                        View Statistics
                                    </Link>
                                    <Link
                                        href={route('surgical-case.export')}
                                        className="block w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-center font-medium"
                                    >
                                        Export Data
                                    </Link>
                                </div>
                            </div>

                            {/* Upcoming Cases */}
                            <div className="card p-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Cases</h3>
                                <div className="space-y-3">
                                    <div className="p-3 border border-gray-100 rounded-lg">
                                        <p className="font-medium text-gray-900">Appendectomy</p>
                                        <p className="text-sm text-gray-500">Today, 14:30 • Dr. Smith</p>
                                    </div>
                                    <div className="p-3 border border-gray-100 rounded-lg">
                                        <p className="font-medium text-gray-900">Knee Replacement</p>
                                        <p className="text-sm text-gray-500">Tomorrow, 09:00 • Dr. Johnson</p>
                                    </div>
                                    <div className="p-3 border border-gray-100 rounded-lg">
                                        <p className="font-medium text-gray-900">Cataract Surgery</p>
                                        <p className="text-sm text-gray-500">Tomorrow, 11:30 • Dr. Williams</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}