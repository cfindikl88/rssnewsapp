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

// Cache for fixtures
let fixturesCache = {
    data: null,
    timestamp: null,
    duration: 6 * 60 * 60 * 1000 // 6 hours
};
let earthquakesCache = { data: null, timestamp: null, duration: 10 * 60 * 1000 }; // 10 minutes

app.use(cors());
app.use(express.json());

// Security headers with Helmet.js
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // For inline scripts in development
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:"], // Allow API calls
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny' // Prevent clickjacking
    },
    noSniff: true, // Prevent MIME type sniffing
    xssFilter: true, // Enable XSS filter
}));

// Rate limiting to protect APIs from abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/feeds', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing feed URL' });
    }

    try {
        const feed = await parser.parseURL(url);
        res.json(feed);
    } catch (error) {
        console.error('Error parsing feed:', error);
        res.status(500).json({ error: 'Failed to parse feed', details: error.message });
    }
});

// New earthquakes endpoint
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

// New fixtures endpoint
app.get('/api/fixtures', async (req, res) => {
    try {
        // Check cache
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

        // Fetch fresh data
        const fixtures = await getFixtures();

        // Update cache
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
