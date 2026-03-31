import { NextRequest, NextResponse } from 'next/server';
import { getBrainstormSuggestions } from '@/lib/grok';

export async function POST(request: NextRequest) {
  try {
    const { seedIdea } = await request.json();

    if (!seedIdea) {
      return NextResponse.json(
        { error: 'Seed idea is required' },
        { status: 400 }
      );
    }

    const suggestions = await getBrainstormSuggestions(seedIdea);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Brainstorm API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
