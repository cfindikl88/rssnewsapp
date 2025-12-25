import React from 'react';
import { useTheme } from '../contexts/useTheme';

const ThemeSkinSwitcher = () => {
    const { skin, changeSkin, availableSkins, autoTimeSync, setAutoTimeSync, theme } = useTheme();

    const skinColors = {
        purple: { bg: 'bg-purple-500', glow: 'shadow-purple-500/50' },
        ocean: { bg: 'bg-sky-500', glow: 'shadow-sky-500/50' },
        sunset: { bg: 'bg-orange-500', glow: 'shadow-orange-500/50' },
        forest: { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50' },
        gold: { bg: 'bg-amber-500', glow: 'shadow-amber-500/50' },
        neon: { bg: 'bg-pink-500', glow: 'shadow-pink-500/50' },
        midnight: { bg: 'bg-slate-700', glow: 'shadow-slate-500/50' },
        nordic: { bg: 'bg-zinc-400', glow: 'shadow-zinc-400/50' },
        sepia: { bg: 'bg-[#78350f]', glow: 'shadow-orange-800/50' },
        lavender: { bg: 'bg-violet-400', glow: 'shadow-violet-400/50' },
    };

    return (
        <div className="flex flex-col gap-2 bg-theme-bg-tertiary rounded-xl p-2 border border-theme-border-medium shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider">Görünüm</span>
                <button
                    onClick={() => setAutoTimeSync(!autoTimeSync)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${autoTimeSync
                            ? 'bg-theme-accent-primary text-white'
                            : 'bg-theme-bg-quaternary text-theme-text-muted'
                        }`}
                    title="Otomatik Zaman Modu (19:00 - 07:00 Gece)"
                >
                    <span className="text-[11px]">{autoTimeSync ? '🕒' : '⏰'}</span>
                    {autoTimeSync ? 'OTOMATİK' : 'MANUEL'}
                </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {Object.keys(availableSkins).map((skinKey) => {
                    const skinConfig = availableSkins[skinKey];
                    const colors = skinColors[skinKey] || { bg: 'bg-gray-500', glow: '' };
                    const isActive = skin === skinKey;

                    return (
                        <button
                            key={skinKey}
                            onClick={() => changeSkin(skinKey)}
                            className={`w-7 h-7 rounded-lg transition-all duration-300 ${colors.bg} ${isActive
                                    ? `ring-2 ring-white dark:ring-gray-300 ${colors.glow} shadow-lg scale-110`
                                    : 'opacity-50 hover:opacity-100 hover:scale-105'
                                }`}
                            title={skinConfig.name}
                            aria-label={`Switch to ${skinConfig.name} theme`}
                            aria-pressed={isActive}
                        >
                            <span className="sr-only">{skinConfig.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ThemeSkinSwitcher;
