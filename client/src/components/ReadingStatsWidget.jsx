import React, { useMemo } from 'react';
import useReadingStats from '../hooks/useReadingStats';
import { useTranslation } from '../contexts/useLanguage';

const ReadingStatsWidget = () => {
    const {
        getTodayStats,
        getWeekStats,
        getTopCategories,
        formatTime,
        streak,
        totalArticles
    } = useReadingStats();
    const { t } = useTranslation();

    const todayStats = useMemo(() => getTodayStats(), [getTodayStats]);
    const weekStats = useMemo(() => getWeekStats(), [getWeekStats]);
    const topCategories = useMemo(() => getTopCategories(3), [getTopCategories]);

    // Calculate max for the bar chart (prevent division by zero)
    const maxCategoryCount = useMemo(() =>
        topCategories.length > 0
            ? Math.max(...topCategories.map(c => c.count), 1)
            : 1,
        [topCategories]
    );

    return (
        <div className="p-4 bg-glass-200 rounded-2xl border border-glass-200">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t('readingStats')}
            </h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Today */}
                <div className="bg-glass-100 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{todayStats.articles}</div>
                    <div className="text-xs text-gray-400">{t('today')}</div>
                </div>

                {/* This Week */}
                <div className="bg-glass-100 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{weekStats.articles}</div>
                    <div className="text-xs text-gray-400">{t('thisWeek')}</div>
                </div>

                {/* Time Spent */}
                <div className="bg-glass-100 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{formatTime(todayStats.timeSeconds)}</div>
                    <div className="text-xs text-gray-400">{t('timeSpent')}</div>
                </div>

                {/* Streak */}
                <div className="bg-glass-100 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-1">
                        {streak}
                        <span className="text-lg">🔥</span>
                    </div>
                    <div className="text-xs text-gray-400">{t('readingStreak')}</div>
                </div>
            </div>

            {/* Top Categories */}
            {topCategories.length > 0 && (
                <div>
                    <div className="text-xs text-gray-400 mb-2">{t('topCategories')}</div>
                    <div className="space-y-2">
                        {topCategories.map(({ category, count }) => (
                            <div key={category} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300">{category}</span>
                                        <span className="text-gray-500">{count}</span>
                                    </div>
                                    <div className="h-1.5 bg-glass-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Total */}
            <div className="mt-4 pt-3 border-t border-glass-200 text-center">
                <span className="text-xs text-gray-500">
                    {t('all')}: <span className="text-purple-400 font-bold">{totalArticles}</span> {t('articlesRead').toLowerCase()}
                </span>
            </div>
        </div>
    );
};

export default ReadingStatsWidget;
