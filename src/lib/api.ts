import { Book, SearchResult, Pagination, GeminiResponse } from '@/types/book';
import { getFromCache, setInCache } from './cache';

const PROXY_ENDPOINT = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
];

export async function fetchWithStrategies(url: string): Promise<string> {
  const cacheKey = `search-cache-${url}`;
  const cachedData = getFromCache<string>(cacheKey);
  
  if (cachedData) {
    console.log("Serving from cache:", url);
    return cachedData;
  }

  for (let i = 0; i < USER_AGENTS.length; i++) {
    const userAgent = USER_AGENTS[i];
    try {
      const requestUrl = PROXY_ENDPOINT(url);
      const response = await fetch(requestUrl, {
        headers: { 'User-Agent': userAgent }
      });
      
      if (response.ok) {
        const html = await response.text();
        if (html.includes('"contents":null')) {
          throw new Error(`Proxy returned an error for strategy ${i + 1}`);
        }
        
        console.log(`Success with strategy: ${i + 1}`);
        setInCache(cacheKey, html);
        return html;
      }
      throw new Error(`Strategy ${i + 1} failed with status: ${response.status}`);
    } catch (error) {
      console.warn(`Strategy ${i + 1} failed:`, error);
      if (i < USER_AGENTS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
  }

  throw new Error('All fetching strategies failed.');
}

export function parseBookHTML(rawHtml: string): SearchResult {
  const cleanHtml = rawHtml.replace(/<!--/g, '').replace(/-->/g, '');
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, 'text/html');
  
  const bookElements = doc.querySelectorAll('.h-\\[110px\\] a');
  const books: Book[] = [];

  bookElements.forEach(el => {
    try {
      const titleEl = el.querySelector('h3');
      const authorEl = el.querySelector('.truncate.leading-\\[1\\.2\\]');
      const detailsEl = el.querySelector('.text-\\[10px\\]');
      
      if (titleEl && authorEl && detailsEl) {
        const title = titleEl.textContent?.trim() || '';
        const author = authorEl.textContent?.trim() || '';
        const details = detailsEl.textContent?.trim() || '';
        const description = el.querySelector('.italic')?.textContent?.trim() || 'No description available.';
        const posterEl = el.querySelector('img') as HTMLImageElement;
        const poster = posterEl?.src || 'https://placehold.co/200x280/f7f4ed/2a2a2a?text=No+Image';
        const downloadLink = new URL(el.getAttribute('href') || '', 'https://annas-archive.org/').href;
        
        const sizeMatch = details.match(/(\d+(\.\d+)?\s*(MB|KB|GB))/i);
        const size = sizeMatch ? sizeMatch[0] : 'N/A';

        books.push({ 
          title, 
          author, 
          description, 
          poster, 
          size, 
          date: 'N/A', 
          downloadLink 
        });
      }
    } catch (e) {
      console.warn("Could not parse a book element:", e);
    }
  });
  
  const pagination = parsePagination(doc);
  return { books, pagination };
}

function parsePagination(doc: Document): Pagination {
  const pagination: Pagination = { currentPage: 1, totalPages: 1, pages: [] };
  const nav = doc.querySelector('nav[aria-label="Pagination"]');
  
  if (nav) {
    const pageLinks = Array.from(nav.querySelectorAll('a[href*="page="]'));
    const pageNumbers = pageLinks.map(a => {
      try {
        const url = new URL(a.getAttribute('href') || '', 'https://annas-archive.org/');
        return parseInt(url.searchParams.get('page') || '1', 10);
      } catch { 
        return null; 
      }
    }).filter(p => p !== null && !isNaN(p)) as number[];
    
    const currentPageEl = nav.querySelector('a[aria-current="page"]');
    if (currentPageEl) {
      pagination.currentPage = parseInt(currentPageEl.textContent || '1', 10);
    }
    
    const allNumbers = [...pageNumbers, pagination.currentPage];
    if (allNumbers.length > 0) {
      pagination.pages = [...new Set(allNumbers)].sort((a, b) => a - b);
      pagination.totalPages = Math.max(...pagination.pages);
    } else {
      pagination.pages = [1];
      pagination.totalPages = 1;
    }
  }

  return pagination;
}

export async function generateBookSummary(title: string, author: string): Promise<string> {
  const prompt = `Provide a concise summary of the book titled "${title}" by ${author}. Focus on the main themes, key concepts, and intended audience. Keep it under 200 words.`;
  
  const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
  const payload = { contents: chatHistory };
  
  // In a real app, you'd get this from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result: GeminiResponse = await response.json();
    
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", result);
      return "Could not generate a summary due to an unexpected response from the AI.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Summary generation is currently unavailable. Please try again later.";
  }
}