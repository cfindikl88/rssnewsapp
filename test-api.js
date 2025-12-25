const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testEndpoints() {
    console.log('--- Testing API Endpoints ---');

    // 1. Health Check
    try {
        const health = await axios.get(`${API_BASE}/health`);
        console.log('✅ Health Check:', health.data);
    } catch (e) {
        console.error('❌ Health Check Failed:', e.message);
    }

    // 2. Feeds
    try {
        const feed = await axios.get(`${API_BASE}/feeds?url=https://webrazzi.com/feed`);
        console.log('✅ Feeds (Webrazzi):', feed.data.title);
    } catch (e) {
        console.error('❌ Feeds Failed:', e.message);
    }

    // 3. Earthquakes
    try {
        const earthquakes = await axios.get(`${API_BASE}/earthquakes`);
        console.log('✅ Earthquakes:', earthquakes.data.earthquakes.length, 'events found');
    } catch (e) {
        console.error('❌ Earthquakes Failed:', e.message);
    }

    // 4. Fixtures
    try {
        const fixtures = await axios.get(`${API_BASE}/fixtures`);
        console.log('✅ Fixtures:', fixtures.data.fixtures.length, 'matches found');
        const first = fixtures.data.fixtures[0];
        console.log(`   Example: ${first.homeTeam} vs ${first.awayTeam} | Status: ${first.status} | Score: ${first.score || 'N/A'}`);
        if (fixtures.data.cached) {
            console.log('   (Data was cached)');
        }
    } catch (e) {
        console.error('❌ Fixtures Failed:', e.message);
    }
}

testEndpoints();
