const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const NodeCache = require('node-cache');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cache with 10 minute TTL
const cache = new NodeCache({ stdTTL: 600 });

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for API calls
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Proxy configuration for fetching data
const proxyConfig = {
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }
};

// Book search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q: query, page = 1 } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const cacheKey = `search_${query}_${page}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      console.log('Serving from cache:', cacheKey);
      return res.json(cachedResult);
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
    cache.set(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch search results',
      message: error.message 
    });
  }
});

// Book details endpoint
app.get('/api/book/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `book_${id}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // This would fetch detailed book information
    // For now, return a placeholder
    const result = {
      id,
      title: 'Book Details',
      message: 'Book details endpoint - to be implemented with specific book data'
    };

    cache.set(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('Book details error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch book details',
      message: error.message 
    });
  }
});

// AI Summary endpoint (placeholder for Gemini integration)
app.post('/api/summarize', async (req, res) => {
  try {
    const { title, author } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const cacheKey = `summary_${title}_${author}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Placeholder for AI summary - in production, integrate with Gemini API
    const summary = `This is a placeholder summary for "${title}" by ${author}. In a production environment, this would connect to the Gemini API to generate an intelligent summary of the book's content, themes, and key insights.`;
    
    const result = {
      title,
      author,
      summary,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('Summary error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache_keys: cache.keys().length
  });
});

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

// Serve static placeholder image
app.get('/api/placeholder-book.png', (req, res) => {
  res.redirect('https://via.placeholder.com/200x280/e2e8f0/334155?text=No+Image');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Book search API available at http://localhost:${PORT}/api/search`);
  console.log(`💾 Cache enabled with 10-minute TTL`);
});

module.exports = app;