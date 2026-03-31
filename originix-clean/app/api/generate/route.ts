import { NextRequest, NextResponse } from 'next/server';
import { generateMultiAngleConcept } from '@/lib/grok';

export async function POST(request: NextRequest) {
  try {
    const { seedIdea, category } = await request.json();

    if (!seedIdea || !category) {
      return NextResponse.json(
        { error: 'Seed idea and category are required' },
        { status: 400 }
      );
    }

    const concept = await generateMultiAngleConcept(seedIdea, category);

    return NextResponse.json(concept);
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate concept' },
      { status: 500 }
    );
  }
}
