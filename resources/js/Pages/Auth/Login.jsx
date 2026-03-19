import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import Checkbox from '@/Components/Checkbox';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Login - Monitoring Portal" />

            <div className="text-center mb-8">
                {/* Logo as link to home */}
                <Link href="/" className="inline-block mb-4">
                    <ApplicationLogo className="h-20 w-auto mx-auto hover:opacity-80 transition-opacity" />
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">Monitoring Portal</h2>
                <p className="text-sm text-gray-600 mt-1">Sign in to access the monitoring dashboard</p>
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('register')}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Need an account?
                    </Link>

                    <PrimaryButton disabled={processing}>
                        {processing ? 'Signing in...' : 'Sign in'}
                    </PrimaryButton>
                </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Registor Monitoring Portal. All rights reserved.</p>
            </div>
        </GuestLayout>
    );
}