import { NextRequest, NextResponse } from 'next/server';
import { generateBookSummary } from '@/lib/api';
import { ApiResponse } from '@/types/book';

export async function POST(request: NextRequest) {
  try {
    const { title, author } = await request.json();

    if (!title || !author) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Title and author are required'
      }, { status: 400 });
    }

    const summary = await generateBookSummary(title, author);

    return NextResponse.json<ApiResponse<string>>({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to generate summary'
    }, { status: 500 });
  }
}