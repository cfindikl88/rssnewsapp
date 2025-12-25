const axios = require('axios');

/**
 * Fetch latest earthquakes from AFAD API
 * API Docs: https://deprem.afad.gov.tr/apiv2
 */
const getEarthquakes = async () => {
    try {
        console.log('🔄 Fetching latest earthquakes from AFAD API...');

        // Set time window: last 24 hours
        const now = new Date();
        const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        const formatDate = (date) => {
            return date.toISOString().replace('T', ' ').substring(0, 19);
        };

        const startTime = formatDate(yesterday);
        const endTime = formatDate(now);

        const url = `https://deprem.afad.gov.tr/apiv2/event/filter?start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(endTime)}&format=json`;

        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!Array.isArray(response.data)) {
            console.error('❌ AFAD API returned unexpected data format');
            return [];
        }

        const earthquakes = response.data.map((item, index) => ({
            id: item.eventID || index,
            date: item.lastUpdate || item.eventDate,
            latitude: item.latitude,
            longitude: item.longitude,
            depth: item.depth,
            type: item.type,
            magnitude: item.magnitude,
            location: item.location || 'Bilinmiyor',
        }));

        // Sort by date descending and take top 20
        earthquakes.sort((a, b) => new Date(b.date) - new Date(a.date));
        const topEarthquakes = earthquakes.slice(0, 20);

        console.log(`✅ Successfully fetched ${topEarthquakes.length} earthquakes from API`);
        return topEarthquakes;
    } catch (error) {
        console.error('❌ AFAD API fetch failed:', error.message);
        return [];
    }
};

module.exports = { getEarthquakes };
