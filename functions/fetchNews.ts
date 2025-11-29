import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Simple RSS sources that are reliable
const RSS_FEEDS = {
    bbc_world: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    bbc_tech: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    bbc_business: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    bbc_science: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    npr: 'https://feeds.npr.org/1001/rss.xml',
};

const CATEGORY_MAP = {
    technology: 'bbc_tech',
    business: 'bbc_business',
    science: 'bbc_science',
    world: 'bbc_world',
};

function extractTag(xml, tag) {
    const cdataMatch = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'));
    if (cdataMatch) return cdataMatch[1];
    const simpleMatch = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
    return simpleMatch ? simpleMatch[1] : null;
}

function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatTime(dateStr) {
    if (!dateStr) return 'Recently';
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    } catch {
        return 'Recently';
    }
}

function parseRSS(xml, sourceName) {
    const articles = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null && articles.length < 15) {
        const item = match[1];
        const title = cleanText(extractTag(item, 'title'));
        const link = extractTag(item, 'link') || extractTag(item, 'guid');
        const pubDate = extractTag(item, 'pubDate');
        const description = cleanText(extractTag(item, 'description'));
        
        if (title && link) {
            articles.push({
                title,
                url: link.trim(),
                source: sourceName,
                summary: description || `Read more about: ${title}`,
                time: formatTime(pubDate),
            });
        }
    }
    
    return articles;
}

async function fetchFeed(feedKey) {
    const url = RSS_FEEDS[feedKey];
    if (!url) return [];
    
    const sourceName = feedKey.includes('bbc') ? 'BBC' : 'NPR';
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; NewsReader/1.0)',
                'Accept': 'application/rss+xml, application/xml, text/xml',
            },
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return [];
        
        const xml = await response.text();
        return parseRSS(xml, sourceName);
    } catch (error) {
        console.error(`Feed ${feedKey} failed:`, error.message);
        return [];
    }
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let body = {};
        try {
            body = await req.json();
        } catch {
            // Empty body is fine
        }
        
        const { category, limit = 30 } = body;
        
        // Determine which feeds to fetch
        let feedKeys = ['bbc_world', 'npr'];
        if (category && CATEGORY_MAP[category]) {
            feedKeys = [CATEGORY_MAP[category]];
        }
        
        // Fetch feeds in parallel
        const results = await Promise.allSettled(feedKeys.map(fetchFeed));
        
        const allArticles = [];
        for (const result of results) {
            if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                allArticles.push(...result.value);
            }
        }
        
        // Deduplicate by URL
        const seen = new Set();
        const unique = allArticles.filter(art => {
            if (seen.has(art.url)) return false;
            seen.add(art.url);
            return true;
        }).slice(0, limit);
        
        return Response.json({
            success: true,
            count: unique.length,
            articles: unique,
        });
        
    } catch (error) {
        console.error('fetchNews error:', error);
        return Response.json({ 
            success: false, 
            error: error.message,
            articles: [] 
        }, { status: 500 });
    }
});