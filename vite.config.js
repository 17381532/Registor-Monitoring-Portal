import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

// Load and expand .env so VITE_ variables can reference other env vars (e.g. VITE_APP_NAME="${APP_NAME}")
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/App.jsx'],
            refresh: true,
        }),
    ],
    server: {
        host: 'localhost',
    },
});