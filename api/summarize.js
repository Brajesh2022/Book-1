// In-memory cache for Vercel
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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
  if (cache.size > 50) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

// Generate AI summary using Gemini API
async function generateSummaryWithGemini(title, author) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Provide a concise, informative summary of the book titled "${title}" by ${author}. Focus on:
1. Main themes and key concepts
2. Target audience and genre
3. Why this book is significant or popular
4. Key takeaways for readers

Keep the summary engaging and under 200 words.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
    return result.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Invalid response from Gemini API');
}

// Fallback summary generator
function generateFallbackSummary(title, author) {
  return `"${title}" by ${author} is a notable work that has captured readers' attention. This book offers valuable insights and perspectives that resonate with its target audience. 

The author presents ideas in an engaging manner, making complex concepts accessible to readers. The work explores themes that are both timely and timeless, providing readers with material for reflection and discussion.

Whether you're interested in the subject matter or exploring new authors, this book offers a worthwhile reading experience. The author's approach and writing style contribute to making this a memorable addition to the literary landscape.

For the most accurate and detailed summary, we recommend reading reviews from trusted sources or exploring the book's official description.`;
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, author } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const cacheKey = `summary_${title}_${author}`;
    const cachedResult = getFromCache(cacheKey);
    
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    let summary;
    
    try {
      // Try to use Gemini API first
      summary = await generateSummaryWithGemini(title, author);
    } catch (error) {
      console.log('Gemini API unavailable, using fallback:', error.message);
      // Use fallback summary if Gemini API is not available
      summary = generateFallbackSummary(title, author);
    }
    
    const result = {
      title,
      author,
      summary,
      timestamp: new Date().toISOString()
    };

    setInCache(cacheKey, result);
    res.status(200).json(result);

  } catch (error) {
    console.error('Summary error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message 
    });
  }
};