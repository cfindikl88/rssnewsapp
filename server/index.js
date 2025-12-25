const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Parser = require('rss-parser');
const { getFixtures } = require('./fixturesScraper');
const { getEarthquakes } = require('./earthquakeScraper');

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 3000;

// --- Caches ---
const feedCache = new Map();
const FEED_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

let fixturesCache = {
    data: null,
    timestamp: null,
    duration: 6 * 60 * 60 * 1000 // 6 hours
};

let earthquakesCache = {
    data: null,
    timestamp: null,
    duration: 10 * 60 * 1000 // 10 minutes
};

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Security headers with Helmet.js
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
}));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Increased for news application with many feeds
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api', apiLimiter);

// --- Routes ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Feeds with Caching
app.get('/api/feeds', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing feed URL' });
    }

    try {
        const now = Date.now();
        const cached = feedCache.get(url);

        if (cached && (now - cached.timestamp) < FEED_CACHE_DURATION) {
            console.log(`✅ Cache Hit: ${url}`);
            return res.json({
                ...cached.data,
                fromCache: true,
                cachedAt: new Date(cached.timestamp).toISOString()
            });
        }

        console.log(`🌐 Fetching Fresh: ${url}`);
        const feed = await parser.parseURL(url);

        feedCache.set(url, {
            timestamp: now,
            data: feed
        });

        res.json({
            ...feed,
            fromCache: false
        });
    } catch (error) {
        console.error('Error parsing feed:', error);
        res.status(500).json({ error: 'Failed to parse feed', details: error.message });
    }
});

// Earthquakes
app.get('/api/earthquakes', async (req, res) => {
    try {
        const now = Date.now();
        const cacheValid = earthquakesCache.data &&
            earthquakesCache.timestamp &&
            (now - earthquakesCache.timestamp) < earthquakesCache.duration;

        if (cacheValid) {
            return res.json({
                earthquakes: earthquakesCache.data,
                cached: true,
                timestamp: earthquakesCache.timestamp
            });
        }

        const earthquakes = await getEarthquakes();
        earthquakesCache.data = earthquakes;
        earthquakesCache.timestamp = now;

        res.json({
            earthquakes,
            cached: false,
            timestamp: now
        });
    } catch (error) {
        console.error('Error fetching earthquakes:', error);
        res.status(500).json({
            error: 'Failed to fetch earthquakes',
            details: error.message
        });
    }
});

// Fixtures
app.get('/api/fixtures', async (req, res) => {
    try {
        const now = Date.now();
        const cacheValid = fixturesCache.data &&
            fixturesCache.timestamp &&
            (now - fixturesCache.timestamp) < fixturesCache.duration;

        if (cacheValid) {
            console.log('✅ Returning cached fixtures');
            return res.json({
                fixtures: fixturesCache.data,
                cached: true,
                timestamp: fixturesCache.timestamp
            });
        }

        const fixtures = await getFixtures();
        fixturesCache.data = fixtures;
        fixturesCache.timestamp = now;

        res.json({
            fixtures,
            cached: false,
            timestamp: now
        });
    } catch (error) {
        console.error('Error fetching fixtures:', error);
        res.status(500).json({
            error: 'Failed to fetch fixtures',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
