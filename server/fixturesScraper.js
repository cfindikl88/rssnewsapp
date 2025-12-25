const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape fixtures from Turkish sports websites
 * Fetches upcoming matches for Galatasaray, Fenerbahçe, and Beşiktaş
 */

// Mock odds generator for betting predictions
const generateOdds = (homeTeam) => {
    const bigTeams = ['Galatasaray', 'Fenerbahçe', 'Beşiktaş'];
    const isHomeBig = bigTeams.includes(homeTeam);

    const home = isHomeBig ? (1.3 + Math.random() * 0.5).toFixed(2) : (2.0 + Math.random() * 2.0).toFixed(2);
    const draw = (3.5 + Math.random() * 1.5).toFixed(2);
    const away = isHomeBig ? (5.0 + Math.random() * 3.0).toFixed(2) : (1.5 + Math.random() * 1.0).toFixed(2);

    return { home, draw, away };
};

/**
 * Format date to Turkish format
 */
const formatDate = (dateStr) => {
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const date = new Date(dateStr);
    return `${date.getDate()} ${months[date.getMonth()]}`;
};

/**
 * Format time to HH:MM
 */
const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Scrape fixtures from NTV Spor
 * Alternative approach using their JSON API endpoint
 */
const scrapeFromNTVSpor = async () => {
    try {
        // NTV Spor often has an API endpoint for fixtures
        // This is more reliable than HTML scraping
        const response = await axios.get('https://www.ntvspor.net/api/v1/fixtures/super-lig', {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        });

        // Parse and filter for big 3 teams
        const bigTeams = ['Galatasaray', 'Fenerbahçe', 'Beşiktaş'];
        const matches = [];

        if (response.data && response.data.fixtures) {
            for (const team of bigTeams) {
                const teamMatch = response.data.fixtures.find(f =>
                    f.home === team || f.away === team
                );

                if (teamMatch) {
                    matches.push({
                        id: teamMatch.id || matches.length + 1,
                        homeTeam: teamMatch.home,
                        awayTeam: teamMatch.away,
                        date: formatDate(teamMatch.date),
                        time: formatTime(teamMatch.date),
                        odds: generateOdds(teamMatch.home)
                    });
                }
            }
        }

        return matches;
    } catch (error) {
        console.error('NTV Spor scraping failed:', error.message);
        return null;
    }
};

/**
 * Fallback: Use static upcoming matches from common knowledge
 * This ensures the widget always has data
 */
const getFallbackFixtures = () => {
    // Current time for reference: 2025-12-20T19:17:57
    // Using a fixed reference date to simulate "Live" and "Finished" matches
    const now = new Date('2025-12-20T19:17:57');

    const createMatch = (id, home, away, dateStr, timeStr) => {
        const [day, monthName] = dateStr.split(' ');
        const [hour, minute] = timeStr.split(':');

        // Month mapping (Turkish to index)
        const months = { 'Ara': 11 };
        const matchTime = new Date(2025, months[monthName], parseInt(day), parseInt(hour), parseInt(minute));

        let status = 'upcoming';
        let score = null;
        let matchMinute = null;

        const diffMinutes = (now - matchTime) / (1000 * 60);

        if (diffMinutes >= 0 && diffMinutes < 105) {
            status = 'live';
            matchMinute = Math.min(Math.floor(diffMinutes), 90);
            score = matchMinute > 45 ? '1 - 1' : '1 - 0';
        } else if (diffMinutes >= 105) {
            status = 'finished';
            score = '2 - 1';
        }

        return {
            id,
            homeTeam: home,
            awayTeam: away,
            date: dateStr,
            time: timeStr,
            status,
            score,
            minute: matchMinute,
            odds: generateOdds(home)
        };
    };

    return [
        createMatch(1, 'Eyüpspor', 'Fenerbahçe', '20 Ara', '17:00'),
        createMatch(2, 'Beşiktaş', 'Rizespor', '20 Ara', '19:00'),
        createMatch(3, 'Galatasaray', 'Kasımpaşa', '21 Ara', '19:00'),
        createMatch(4, 'Trabzonspor', 'Konyaspor', '21 Ara', '16:00'),
        createMatch(5, 'Adana Demirspor', 'Samsunspor', '21 Ara', '13:30')
    ];
};

/**
 * Main function to get fixtures
 * Tries multiple sources, falls back to static data
 */
const getFixtures = async () => {
    console.log('🔄 [Fixtures] Attempting to fetch from NTV Spor API...');

    // Try NTV Spor first
    const ntvData = await scrapeFromNTVSpor();
    if (ntvData && ntvData.length > 0) {
        console.log('✅ [Fixtures] Data successfully fetched from NTV Spor');
        // Add basic status for API data if missing
        return ntvData.map(match => ({
            ...match,
            status: match.status || 'upcoming',
            score: match.score || null
        }));
    }

    // Fallback to static data
    console.log('⚠️ [Fixtures] API failed or returned empty. Using fallback fixtures with simulated live scores.');
    return getFallbackFixtures();
};

module.exports = { getFixtures };
