const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cache setup - 15 minutes cache duration
const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://annas-archive.org", "https://generativelanguage.googleapis.com"]
    }
  }
}));

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Book search API endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q: query, page = 1 } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const cacheKey = `search-${query}-${page}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    const targetUrl = `https://annas-archive.org/search?q=${encodeURIComponent(query.trim())}&page=${page}`;
    
    // Multiple user agents for better success rate
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': randomUserAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000,
      maxRedirects: 5
    });

    const { books, pagination } = parseHTML(response.data);
    const result = { books, pagination, cached: false };
    
    // Cache the result
    cache.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch book data', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// AI Summary API endpoint
app.post('/api/summary', async (req, res) => {
  try {
    const { title, author } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const cacheKey = `summary-${title}-${author}`;
    const cachedSummary = cache.get(cacheKey);
    
    if (cachedSummary) {
      return res.json({ summary: cachedSummary, cached: true });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const prompt = `Provide a concise summary of the book titled "${title}" by ${author}. Focus on the main themes, key concepts, and intended audience. Keep it under 200 words.`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const summary = response.data.candidates[0].content.parts[0].text;
      cache.set(cacheKey, summary);
      res.json({ summary, cached: false });
    } else {
      res.status(500).json({ error: 'Unable to generate summary' });
    }
  } catch (error) {
    console.error('Summary error:', error.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// HTML parsing function
function parseHTML(rawHtml) {
  const $ = cheerio.load(rawHtml);
  const books = [];
  
  // Updated selectors for Anna's Archive
  $('.h-\\[110px\\] a, .js-vim-focus').each((_, element) => {
    try {
      const $el = $(element);
      const titleEl = $el.find('h3').first();
      const authorEl = $el.find('.truncate').first();
      const detailsEl = $el.find('.text-\\[10px\\]').first();
      
      if (titleEl.length && authorEl.length) {
        const title = titleEl.text().trim();
        const author = authorEl.text().trim();
        const details = detailsEl.text().trim();
        const description = $el.find('.italic').first().text().trim() || 'No description available.';
        
        let poster = $el.find('img').first().attr('src') || '';
        if (poster && !poster.startsWith('http')) {
          poster = `https://annas-archive.org${poster}`;
        }
        if (!poster) {
          poster = 'https://via.placeholder.com/72x100/e2e8f0/334155?text=No+Image';
        }
        
        const downloadLink = new URL($el.attr('href') || '', 'https://annas-archive.org/').href;
        
        const sizeMatch = details.match(/(\d+(?:\.\d+)?\s*(?:MB|KB|GB))/i);
        const size = sizeMatch ? sizeMatch[0] : 'N/A';

        books.push({
          title,
          author,
          description,
          poster,
          size,
          downloadLink
        });
      }
    } catch (e) {
      console.warn('Could not parse book element:', e.message);
    }
  });
  
  // Parse pagination
  const pagination = { currentPage: 1, totalPages: 1, pages: [] };
  const nav = $('nav[aria-label="Pagination"]');
  
  if (nav.length) {
    const pageLinks = nav.find('a[href*="page="]');
    const pageNumbers = [];
    
    pageLinks.each((_, link) => {
      try {
        const href = $(link).attr('href');
        const url = new URL(href, 'https://annas-archive.org/');
        const pageNum = parseInt(url.searchParams.get('page'), 10);
        if (!isNaN(pageNum)) pageNumbers.push(pageNum);
      } catch (e) {
        // Ignore parsing errors
      }
    });
    
    const currentPageEl = nav.find('a[aria-current="page"]');
    if (currentPageEl.length) {
      pagination.currentPage = parseInt(currentPageEl.text(), 10) || 1;
    }
    
    if (pageNumbers.length > 0) {
      const allNumbers = [...new Set([...pageNumbers, pagination.currentPage])].sort((a, b) => a - b);
      pagination.pages = allNumbers;
      pagination.totalPages = Math.max(...allNumbers);
    }
  }

  return { books, pagination };
}

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Kindle Book Search - Fast & Beautiful`);
});

module.exports = app;