import React from 'react';
import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome - MediMonitor" />
            <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                {/* Navigation */}
                <nav className="absolute top-0 right-0 p-6">
                    {auth.user ? (
                        <Link
                            href={route('monitoring.dashboard')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="space-x-4">
                            <Link
                                href={route('login')}
                                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <div className="pt-32 pb-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            <ApplicationLogo className="h-24 w-auto mx-auto" />
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Welcome to <span className="text-blue-600">Register Monitoring Portal</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Healthcare System Monitoring Portal
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href={route('register')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                            >
                               Access Portal
                            </Link>
                            <Link
                                href={route('login')}
                                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium border border-blue-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-6xl mx-auto px-4 pb-20">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">🏥</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">BMDH - FBU System</h3>
                            <p className="text-gray-600">
                                Monitor the FBU system at BMDH location. Track system uptime and record monitoring checks.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">⚕️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">SBAH - Surgical Case System</h3>
                            <p className="text-gray-600">
                                Monitor the Surgical Case system at SBAH location. Track system status and backup locations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-8">
                    <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} Register Monitoring Portal. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}