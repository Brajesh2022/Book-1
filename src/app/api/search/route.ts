import { NextRequest, NextResponse } from 'next/server';
import { fetchWithStrategies, parseBookHTML } from '@/lib/api';
import { ApiResponse, SearchResult } from '@/types/book';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!query) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Search query is required'
    }, { status: 400 });
  }

  try {
    const targetUrl = `https://annas-archive.org/search?q=${encodeURIComponent(query)}&page=${page}`;
    const html = await fetchWithStrategies(targetUrl);
    const result = parseBookHTML(html);

    return NextResponse.json<ApiResponse<SearchResult>>({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch book data'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, page = 1 } = await request.json();

    if (!query) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Search query is required'
      }, { status: 400 });
    }

    const targetUrl = `https://annas-archive.org/search?q=${encodeURIComponent(query)}&page=${page}`;
    const html = await fetchWithStrategies(targetUrl);
    const result = parseBookHTML(html);

    return NextResponse.json<ApiResponse<SearchResult>>({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch book data'
    }, { status: 500 });
  }
}