import React from 'react';

export default function Guest({ children, title = '' }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="/build/assets/logo.svg"
                        alt="Logo"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
                    <p className="mt-2 text-sm text-gray-600">Access your account securely.</p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    {children}
                </div>

                <p className="text-center text-xs text-gray-400">© {new Date().getFullYear()} MyApp. All rights reserved.</p>
            </div>
        </div>
    );
}
