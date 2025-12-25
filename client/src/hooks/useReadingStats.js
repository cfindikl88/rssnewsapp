import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'reading_stats';

// Helper to check and update streak during initialization
const getInitialStats = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultStats = {
        totalArticles: 0,
        totalTimeSeconds: 0,
        dailyStats: {},
        categoryStats: {},
        sourceStats: {},
        lastReadDate: null,
        streak: 0
    };

    if (!saved) return defaultStats;

    const parsed = JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check streak during initialization
    if (parsed.lastReadDate === today || parsed.lastReadDate === yesterday) {
        return parsed; // Keep streak
    }
    if (parsed.lastReadDate && parsed.lastReadDate !== today) {
        return { ...parsed, streak: 0 }; // Reset streak
    }
    return parsed;
};

const useReadingStats = () => {
    const [stats, setStats] = useState(getInitialStats);

    // Save to localStorage whenever stats change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }, [stats]);

    const trackArticleRead = useCallback((article, timeSpentSeconds = 60) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        setStats(prev => {
            const wasYesterday = prev.lastReadDate === yesterday;
            const wasToday = prev.lastReadDate === today;

            // Calculate new streak
            let newStreak = prev.streak;
            if (!wasToday) {
                newStreak = wasYesterday ? prev.streak + 1 : 1;
            }

            // Update daily stats
            const dailyStats = { ...prev.dailyStats };
            if (!dailyStats[today]) {
                dailyStats[today] = { articles: 0, timeSeconds: 0 };
            }
            dailyStats[today].articles += 1;
            dailyStats[today].timeSeconds += timeSpentSeconds;

            // Update category stats
            const categoryStats = { ...prev.categoryStats };
            (article.categories || []).forEach(cat => {
                categoryStats[cat] = (categoryStats[cat] || 0) + 1;
            });

            // Update source stats
            const sourceStats = { ...prev.sourceStats };
            if (article.feedName) {
                sourceStats[article.feedName] = (sourceStats[article.feedName] || 0) + 1;
            }

            return {
                totalArticles: prev.totalArticles + 1,
                totalTimeSeconds: prev.totalTimeSeconds + timeSpentSeconds,
                dailyStats,
                categoryStats,
                sourceStats,
                lastReadDate: today,
                streak: newStreak
            };
        });
    }, []);

    const getTodayStats = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        return stats.dailyStats[today] || { articles: 0, timeSeconds: 0 };
    }, [stats.dailyStats]);

    const getWeekStats = useCallback(() => {
        const result = { articles: 0, timeSeconds: 0 };
        const now = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(now - i * 86400000).toISOString().split('T')[0];
            if (stats.dailyStats[date]) {
                result.articles += stats.dailyStats[date].articles;
                result.timeSeconds += stats.dailyStats[date].timeSeconds;
            }
        }

        return result;
    }, [stats.dailyStats]);

    const getTopCategories = useCallback((limit = 5) => {
        return Object.entries(stats.categoryStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([category, count]) => ({ category, count }));
    }, [stats.categoryStats]);

    const getTopSources = useCallback((limit = 5) => {
        return Object.entries(stats.sourceStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([source, count]) => ({ source, count }));
    }, [stats.sourceStats]);

    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    };

    return {
        stats,
        trackArticleRead,
        getTodayStats,
        getWeekStats,
        getTopCategories,
        getTopSources,
        formatTime,
        streak: stats.streak,
        totalArticles: stats.totalArticles,
        totalTime: stats.totalTimeSeconds
    };
};

export default useReadingStats;
