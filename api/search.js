const axios = require('axios');
const cheerio = require('cheerio');

// In-memory cache for Vercel (limited but works for demo)
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Proxy configuration for fetching data
const proxyConfig = {
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }
};

// Parse search results from Anna's Archive
function parseSearchResults(html) {
  const $ = cheerio.load(html);
  const books = [];
  
  // Find book elements
  $('a[href*="/md5/"]').each((index, element) => {
    try {
      const $el = $(element);
      const href = $el.attr('href');
      
      if (!href) return;
      
      const $img = $el.find('img').first();
      const $title = $el.find('h3').first();
      const $author = $el.find('.truncate').first();
      const $details = $el.find('.text-xs').first();
      
      if ($title.length && $author.length) {
        const title = $title.text().trim();
        const author = $author.text().trim();
        const poster = $img.attr('src') || '/api/placeholder-book.png';
        const details = $details.text().trim();
        
        // Extract file size
        const sizeMatch = details.match(/(\d+(?:\.\d+)?\s*(?:MB|KB|GB))/i);
        const size = sizeMatch ? sizeMatch[0] : 'N/A';
        
        // Extract format
        const formatMatch = details.match(/\.(pdf|epub|mobi|azw3|txt|djvu)/i);
        const format = formatMatch ? formatMatch[1].toUpperCase() : 'Unknown';
        
        books.push({
          id: href.split('/').pop(),
          title,
          author,
          poster: poster.startsWith('http') ? poster : `https://annas-archive.org${poster}`,
          size,
          format,
          downloadLink: `https://annas-archive.org${href}`,
          description: 'Click to view details and download options'
        });
      }
    } catch (err) {
      console.warn('Error parsing book element:', err.message);
    }
  });
  
  // Parse pagination
  const pagination = {
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  };
  
  const $pagination = $('nav[aria-label="Pagination"]');
  if ($pagination.length) {
    const $current = $pagination.find('[aria-current="page"]');
    if ($current.length) {
      pagination.currentPage = parseInt($current.text()) || 1;
    }
    
    pagination.hasNext = $pagination.find('a[rel="next"]').length > 0;
    pagination.hasPrev = $pagination.find('a[rel="prev"]').length > 0;
    
    // Estimate total pages from visible page numbers
    const pageNumbers = [];
    $pagination.find('a').each((i, el) => {
      const pageNum = parseInt($(el).text());
      if (!isNaN(pageNum)) {
        pageNumbers.push(pageNum);
      }
    });
    
    if (pageNumbers.length > 0) {
      pagination.totalPages = Math.max(...pageNumbers, pagination.currentPage);
    }
  }
  
  return { books, pagination };
}

// Get from cache
function getFromCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const { timestamp, data } = cached;
  if (Date.now() - timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return data;
}

// Set in cache
function setInCache(key, data) {
  cache.set(key, { timestamp: Date.now(), data });
  
  // Clean old entries if cache gets too large
  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { q: query, page = 1 } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const cacheKey = `search_${query}_${page}`;
    const cachedResult = getFromCache(cacheKey);
    
    if (cachedResult) {
      console.log('Serving from cache:', cacheKey);
      return res.status(200).json(cachedResult);
    }

    const targetUrl = `https://annas-archive.org/search?q=${encodeURIComponent(query)}&page=${page}`;
    console.log('Fetching:', targetUrl);

    const response = await axios.get(targetUrl, proxyConfig);
    const books = parseSearchResults(response.data);
    
    const result = {
      books: books.books,
      pagination: books.pagination,
      query,
      page: parseInt(page),
      timestamp: new Date().toISOString()
    };

    // Cache the result
    setInCache(cacheKey, result);
    res.status(200).json(result);

  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch search results',
      message: error.message 
    });
  }
};