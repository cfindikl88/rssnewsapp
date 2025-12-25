import React, { createContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

// Full Theme Skin Definitions with Backgrounds
export const THEME_SKINS = {
    purple: {
        name: 'Purple',
        primary: '#a855f7',
        secondary: '#6366f1',
        dark: {
            bg: 'linear-gradient(135deg, #0f172a, #581c87, #4c1d95)',
            secondary: 'rgba(255, 255, 255, 0.03)',
            tertiary: 'rgba(255, 255, 255, 0.07)',
            text: '#f8fafc'
        },
        light: {
            bg: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            secondary: '#ffffff',
            tertiary: '#f1f5f9',
            text: '#0f172a'
        }
    },
    ocean: {
        name: 'Ocean',
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        dark: {
            bg: 'linear-gradient(135deg, #082f49, #0c4a6e, #075985)',
            secondary: 'rgba(255, 255, 255, 0.05)',
            tertiary: 'rgba(255, 255, 255, 0.08)',
            text: '#f0f9ff'
        },
        light: {
            bg: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            secondary: '#ffffff',
            tertiary: '#f0f9ff',
            text: '#0c4a6e'
        }
    },
    sunset: {
        name: 'Sunset',
        primary: '#f97316',
        secondary: '#ef4444',
        dark: {
            bg: 'linear-gradient(135deg, #431407, #7c2d12, #9a3412)',
            secondary: 'rgba(255, 255, 255, 0.04)',
            tertiary: 'rgba(255, 255, 255, 0.07)',
            text: '#fff7ed'
        },
        light: {
            bg: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
            secondary: '#ffffff',
            tertiary: '#fff7ed',
            text: '#431407'
        }
    },
    forest: {
        name: 'Forest',
        primary: '#10b981',
        secondary: '#059669',
        dark: {
            bg: 'linear-gradient(135deg, #064e3b, #065f46, #047857)',
            secondary: 'rgba(255, 255, 255, 0.04)',
            tertiary: 'rgba(255, 255, 255, 0.08)',
            text: '#ecfdf5'
        },
        light: {
            bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
            secondary: '#ffffff',
            tertiary: '#ecfdf5',
            text: '#064e3b'
        }
    },
    gold: {
        name: 'Gold',
        primary: '#f59e0b',
        secondary: '#d97706',
        dark: {
            bg: 'linear-gradient(135deg, #451a03, #78350f, #92400e)',
            secondary: 'rgba(255, 255, 255, 0.05)',
            tertiary: 'rgba(255, 255, 255, 0.09)',
            text: '#fffbeb'
        },
        light: {
            bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            secondary: '#ffffff',
            tertiary: '#fffbeb',
            text: '#451a03'
        }
    },
    neon: {
        name: 'Neon',
        primary: '#ec4899',
        secondary: '#06b6d4',
        dark: {
            bg: 'linear-gradient(135deg, #000000, #1e1b4b, #312e81)',
            secondary: 'rgba(236, 72, 153, 0.05)',
            tertiary: 'rgba(6, 182, 212, 0.1)',
            text: '#ffffff'
        },
        light: {
            bg: 'linear-gradient(135deg, #ffffff, #fdf2f8, #ecfeff)',
            secondary: '#ffffff',
            tertiary: '#fdf2f8',
            text: '#1e1b4b'
        }
    },
    // 4 Additional Modes
    midnight: {
        name: 'Midnight',
        primary: '#334155',
        secondary: '#0f172a',
        dark: {
            bg: 'linear-gradient(135deg, #020617, #0f172a, #1e293b)',
            secondary: 'rgba(255, 255, 255, 0.02)',
            tertiary: 'rgba(255, 255, 255, 0.05)',
            text: '#f8fafc'
        },
        light: {
            bg: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
            secondary: '#ffffff',
            tertiary: '#f8fafc',
            text: '#020617'
        }
    },
    nordic: {
        name: 'Nordic',
        primary: '#8b949e',
        secondary: '#484f58',
        dark: {
            bg: 'linear-gradient(135deg, #0d1117, #161b22, #21262d)',
            secondary: 'rgba(255, 255, 255, 0.03)',
            tertiary: 'rgba(255, 255, 255, 0.06)',
            text: '#c9d1d9'
        },
        light: {
            bg: 'linear-gradient(135deg, #ffffff, #f6f8fa)',
            secondary: '#ffffff',
            tertiary: '#f6f8fa',
            text: '#24292f'
        }
    },
    sepia: {
        name: 'Sepia',
        primary: '#78350f',
        secondary: '#92400e',
        dark: {
            bg: 'linear-gradient(135deg, #2d241e, #3e322b, #4a3c34)',
            secondary: 'rgba(255, 255, 255, 0.03)',
            tertiary: 'rgba(255, 255, 255, 0.06)',
            text: '#e6d8c4'
        },
        light: {
            bg: 'linear-gradient(135deg, #f4ecd8, #ede0c8)',
            secondary: '#fdfbf7',
            tertiary: '#f4ecd8',
            text: '#433422'
        }
    },
    lavender: {
        name: 'Lavender',
        primary: '#8b5cf6',
        secondary: '#d946ef',
        dark: {
            bg: 'linear-gradient(135deg, #1e1b4b, #4c1d95, #701a75)',
            secondary: 'rgba(255, 255, 255, 0.04)',
            tertiary: 'rgba(255, 255, 255, 0.08)',
            text: '#f5f3ff'
        },
        light: {
            bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
            secondary: '#ffffff',
            tertiary: '#f5f3ff',
            text: '#1e1b4b'
        }
    }
};

export const ThemeProvider = ({ children }) => {
    // Initial theme based on time
    const getInitialTheme = () => {
        const saved = localStorage.getItem('app_theme');
        if (saved) return saved;

        const hour = new Date().getHours();
        return (hour >= 19 || hour < 7) ? 'dark' : 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);
    const [skin, setSkin] = useState(() => localStorage.getItem('app_skin') || 'purple');
    const [autoTimeSync, setAutoTimeSync] = useState(() => {
        const saved = localStorage.getItem('app_auto_time');
        return saved === null ? true : saved === 'true';
    });

    // Handle Time-based Sync
    useEffect(() => {
        if (!autoTimeSync) return;

        const checkTime = () => {
            const hour = new Date().getHours();
            const shouldBeDark = hour >= 19 || hour < 7;
            const currentTheme = shouldBeDark ? 'dark' : 'light';

            if (theme !== currentTheme) {
                setTheme(currentTheme);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [autoTimeSync, theme]);

    useEffect(() => {
        localStorage.setItem('app_theme', theme);
        localStorage.setItem('app_auto_time', autoTimeSync);

        document.documentElement.classList.remove('theme-dark', 'theme-light');
        document.documentElement.classList.add(`theme-${theme}`);
    }, [theme, autoTimeSync]);

    useEffect(() => {
        localStorage.setItem('app_skin', skin);

        const skinConfig = THEME_SKINS[skin];
        const modeConfig = theme === 'dark' ? skinConfig.dark : skinConfig.light;

        if (skinConfig && modeConfig) {
            // Accent Colors
            document.documentElement.style.setProperty('--accent-primary', skinConfig.primary);
            document.documentElement.style.setProperty('--accent-secondary', skinConfig.secondary);

            // Background Colors
            document.documentElement.style.setProperty('--bg-primary', modeConfig.bg);
            document.documentElement.style.setProperty('--bg-secondary', modeConfig.secondary);
            document.documentElement.style.setProperty('--bg-tertiary', modeConfig.tertiary);

            // Text Colors
            document.documentElement.style.setProperty('--text-primary', modeConfig.text);

            // Shared logic for glass effects based on mode
            if (theme === 'dark') {
                document.documentElement.style.setProperty('--text-secondary', '#e2e8f0');
                document.documentElement.style.setProperty('--text-muted', '#94a3b8');
                document.documentElement.style.setProperty('--border-light', 'rgba(255, 255, 255, 0.05)');
                document.documentElement.style.setProperty('--border-medium', 'rgba(255, 255, 255, 0.1)');
                document.documentElement.style.setProperty('--glass-100', 'rgba(255, 255, 255, 0.05)');
            } else {
                document.documentElement.style.setProperty('--text-secondary', '#334155');
                document.documentElement.style.setProperty('--text-muted', '#64748b');
                document.documentElement.style.setProperty('--border-light', 'rgba(0, 0, 0, 0.05)');
                document.documentElement.style.setProperty('--border-medium', 'rgba(0, 0, 0, 0.1)');
                document.documentElement.style.setProperty('--glass-100', 'rgba(255, 255, 255, 0.7)');
            }
        }
    }, [skin, theme]);

    const toggleTheme = () => {
        setAutoTimeSync(false); // Disable auto-sync if user manually toggles
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const changeSkin = (newSkin) => {
        if (THEME_SKINS[newSkin]) {
            setSkin(newSkin);
        }
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            toggleTheme,
            isDark,
            skin,
            setSkin,
            changeSkin,
            availableSkins: THEME_SKINS,
            autoTimeSync,
            setAutoTimeSync
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
