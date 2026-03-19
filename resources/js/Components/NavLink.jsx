import { Link } from '@inertiajs/react';

export default function NavLink({ href, active, children, ...props }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                active
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
            }`}
            {...props}
        >
            {children}
        </Link>
    );
}