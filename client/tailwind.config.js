/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                glass: {
                    100: 'var(--glass-100)',
                    200: 'var(--glass-200)',
                    300: 'var(--glass-300)',
                    dark: 'rgba(0, 0, 0, 0.6)',
                },
                theme: {
                    bg: {
                        primary: 'var(--bg-primary)',
                        secondary: 'var(--bg-secondary)',
                        tertiary: 'var(--bg-tertiary)',
                        quaternary: 'var(--bg-quaternary)',
                    },
                    text: {
                        primary: 'var(--text-primary)',
                        secondary: 'var(--text-secondary)',
                        muted: 'var(--text-muted)',
                        accent: 'var(--text-accent)',
                    },
                    border: {
                        light: 'var(--border-light)',
                        medium: 'var(--border-medium)',
                        strong: 'var(--border-strong)',
                    },
                    accent: {
                        primary: 'var(--accent-primary)',
                        secondary: 'var(--accent-secondary)',
                    }
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
