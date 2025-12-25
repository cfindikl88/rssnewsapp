const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function (event, context) {
    const { url } = event.queryStringParameters;

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing feed URL' })
        };
    }

    try {
        // Custom headers to avoid some anti-bot protections if necessary, 
        // though rss-parser handles most.
        const feed = await parser.parseURL(url);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // CORS for direct access if not proxied
            },
            body: JSON.stringify(feed)
        };
    } catch (error) {
        console.error('Error parsing feed:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to parse feed', details: error.message })
        };
    }
};
