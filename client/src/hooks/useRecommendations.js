import { useState, useCallback } from 'react';

const STORAGE_KEY = 'rss_recommendations_data';
const MAX_HISTORY = 100; // Keep last 100 reads

/**
 * Custom hook for managing article recommendations based on user reading behavior
 * Tracks reading history and calculates personalized recommendations
 */
const useRecommendations = () => {
    // Load data from localStorage during initialization
    const [data, setData] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load recommendation data:', error);
        }
        return {
            readHistory: [],
            feedPreferences: {},
            lastUpdated: null
        };
    });

    // Save data to localStorage whenever it changes
    const saveData = useCallback((newData) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            setData(newData);
        } catch (error) {
            console.error('Failed to save recommendation data:', error);
        }
    }, []);

    /**
     * Track when user reads an article
     */
    const trackRead = useCallback((article) => {
        if (!article || !article.feedName) return;

        const articleId = article.link || article.title;
        const timestamp = Date.now();

        setData(prevData => {
            // Update read history
            const newHistory = [
                {
                    articleId,
                    feedName: article.feedName,
                    title: article.title,
                    timestamp
                },
                ...prevData.readHistory.slice(0, MAX_HISTORY - 1)
            ];

            // Update feed preferences
            const feedName = article.feedName;
            const feedPrefs = { ...prevData.feedPreferences };

            if (!feedPrefs[feedName]) {
                feedPrefs[feedName] = { count: 0, lastRead: null };
            }

            feedPrefs[feedName].count += 1;
            feedPrefs[feedName].lastRead = timestamp;

            const newData = {
                readHistory: newHistory,
                feedPreferences: feedPrefs,
                lastUpdated: timestamp
            };

            // Save to localStorage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            } catch (error) {
                console.error('Failed to save recommendation data:', error);
            }

            return newData;
        });
    }, []);

    /**
     * Calculate recommendation score for an article
     */
    const calculateScore = useCallback((article, readHistory, feedPrefs) => {
        if (!article) return 0;

        const now = Date.now();
        let score = 0;

        // 1. Feed Affinity (40 points max)
        const feedName = article.feedName;
        if (feedPrefs[feedName]) {
            const feedCount = feedPrefs[feedName].count;
            const totalReads = Object.values(feedPrefs).reduce((sum, f) => sum + f.count, 0);
            const affinity = feedCount / totalReads;
            score += affinity * 40;
        }

        // 2. Recency (30 points max)
        const articleAge = now - new Date(article.pubDate).getTime();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        const recencyScore = Math.max(0, 1 - (articleAge / maxAge));
        score += recencyScore * 30;

        // 3. Reading Pattern - Time of Day (20 points max)
        const articleHour = new Date(article.pubDate).getHours();
        const readsAtHour = readHistory.filter(r => {
            const readHour = new Date(r.timestamp).getHours();
            return Math.abs(readHour - articleHour) <= 2; // Within 2 hours
        }).length;
        const patternScore = Math.min(1, readsAtHour / 5); // Normalize
        score += patternScore * 20;

        // 4. Diversity Bonus (10 points max)
        // Give bonus to feeds user hasn't read in a while
        if (feedPrefs[feedName]) {
            const timeSinceLastRead = now - feedPrefs[feedName].lastRead;
            const hoursSince = timeSinceLastRead / (1000 * 60 * 60);
            if (hoursSince > 24) {
                score += 10;
            } else if (hoursSince > 12) {
                score += 5;
            }
        } else {
            // New feed - give exploration bonus
            score += 10;
        }

        return score;
    }, []);

    /**
     * Get recommended articles from available articles
     */
    const getRecommendations = useCallback((articles, count = 5) => {
        if (!articles || articles.length === 0) return [];
        if (data.readHistory.length === 0) {
            // No history - return most recent articles
            return articles
                .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
                .slice(0, count);
        }

        // Calculate scores for all articles
        const scoredArticles = articles.map(article => ({
            article,
            score: calculateScore(article, data.readHistory, data.feedPreferences)
        }));

        // Sort by score and return top N
        return scoredArticles
            .sort((a, b) => b.score - a.score)
            .slice(0, count)
            .map(item => item.article);
    }, [data, calculateScore]);

    /**
     * Get reason for recommendation (for UI display)
     */
    const getRecommendationReason = useCallback((article) => {
        if (!article || !article.feedName) return 'Yeni';

        const feedName = article.feedName;
        const feedPref = data.feedPreferences[feedName];

        if (!feedPref) {
            return 'Keşfet';
        }

        const totalReads = Object.values(data.feedPreferences).reduce((sum, f) => sum + f.count, 0);
        const affinity = feedPref.count / totalReads;

        if (affinity > 0.3) {
            return `Sık okuduğunuz ${feedName}`;
        } else if (affinity > 0.1) {
            return `${feedName}'den`;
        } else {
            return 'Size özel';
        }
    }, [data]);

    /**
     * Clear all recommendation data
     */
    const clearHistory = useCallback(() => {
        const emptyData = {
            readHistory: [],
            feedPreferences: {},
            lastUpdated: null
        };
        saveData(emptyData);
    }, [saveData]);

    /**
     * Get reading statistics
     */
    const getStats = useCallback(() => {
        const totalReads = data.readHistory.length;
        const totalFeeds = Object.keys(data.feedPreferences).length;
        const topFeed = Object.entries(data.feedPreferences)
            .sort((a, b) => b[1].count - a[1].count)[0];

        return {
            totalReads,
            totalFeeds,
            topFeedName: topFeed ? topFeed[0] : null,
            topFeedCount: topFeed ? topFeed[1].count : 0
        };
    }, [data]);

    return {
        trackRead,
        getRecommendations,
        getRecommendationReason,
        clearHistory,
        getStats,
        hasHistory: data.readHistory.length > 0
    };
};

export default useRecommendations;
