// Football Service - Turkish Süper Lig Fixtures
// Uses local backend scraping service (NO API KEY REQUIRED)

const CACHE_KEY = 'football_matches_cache';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
const API_URL = 'http://localhost:3000/api/fixtures';

// Mock data for absolute fallback
const MOCK_MATCHES = [
    {
        id: 1,
        homeTeam: 'Galatasaray',
        awayTeam: 'Trabzonspor',
        date: '21 Ara',
        time: '19:00',
        odds: {
            home: '1.45',
            draw: '4.20',
            away: '6.50'
        }
    },
    {
        id: 2,
        homeTeam: 'Fenerbahçe',
        awayTeam: 'Kasımpaşa',
        date: '22 Ara',
        time: '16:00',
        odds: {
            home: '1.35',
            draw: '4.80',
            away: '8.00'
        }
    },
    {
        id: 3,
        homeTeam: 'Beşiktaş',
        awayTeam: 'Hatayspor',
        date: '22 Ara',
        time: '19:00',
        odds: {
            home: '1.55',
            draw: '3.90',
            away: '5.75'
        }
    }
];

/**
 * Get cached matches from localStorage
 * @returns {Object|null} Cached data or null if not found/expired
 */
const getCachedMatches = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Return cached data if less than CACHE_DURATION old
        if (age < CACHE_DURATION) {
            console.log('✅ Using cached football matches');
            return data;
        }

        console.log('⏰ Cache expired, will fetch fresh data');
        return null;
    } catch (error) {
        console.error('❌ Error reading cache:', error);
        return null;
    }
};

/**
 * Save matches to localStorage cache
 * @param {Array} matches - Array of match objects
 */
const cacheMatches = (matches) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: matches,
            timestamp: Date.now()
        }));
        console.log('💾 Matches cached successfully');
    } catch (error) {
        console.error('❌ Error caching matches:', error);
    }
};

/**
 * Fetch fixtures from local backend API
 * @returns {Promise<Array>} Array of match objects
 */
const fetchFromBackend = async () => {
    try {
        console.log('🔄 Fetching fixtures from backend...');

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.fixtures || data.fixtures.length === 0) {
            console.warn('⚠️ No fixtures found in backend response');
            return null;
        }

        console.log(`✅ Fetched ${data.fixtures.length} fixtures from backend${data.cached ? ' (cached)' : ''}`);
        return data.fixtures;

    } catch (error) {
        console.error('❌ Error fetching from backend:', error);
        return null;
    }
};

/**
 * Get top 3 teams' next matches
 * Uses cache, backend API, or falls back to mock data
 * @returns {Promise<Array>} Array of 3 match objects
 */
export const getTopTeamsMatches = async () => {
    // Try cache first
    const cached = getCachedMatches();
    if (cached) {
        return cached;
    }

    console.log('🔄 Fetching fresh football data...');

    // Try backend API
    const backendMatches = await fetchFromBackend();
    if (backendMatches && backendMatches.length > 0) {
        cacheMatches(backendMatches);
        return backendMatches;
    }

    // Fallback to mock data
    console.warn('⚠️ Using fallback mock data');
    return MOCK_MATCHES;
};

/**
 * Clear the cache (useful for testing)
 */
export const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    console.log('🗑️ Cache cleared');
};

export default {
    getTopTeamsMatches,
    clearCache
};
