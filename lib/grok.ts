export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callGrokAPI(
  messages: GrokMessage[],
  temperature: number = 0.8
): Promise<string> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages,
      temperature,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.statusText}`);
  }

  const data: GrokResponse = await response.json();
  return data.choices[0].message.content;
}

export async function generateMultiAngleConcept(
  seedIdea: string,
  category: string
): Promise<{
  title: string;
  description: string;
  fullConcept: string;
  noveltyScore: number;
}> {
  // Multi-angle prompts for creative synthesis
  const prompts = [
    {
      name: 'logical',
      system: `You are a logical, structured creative thinker. Focus on coherent world-building and cause-effect relationships.`,
      user: `Create a ${category} concept based on this seed idea: "${seedIdea}". Focus on logical consistency and structured development.`,
    },
    {
      name: 'emotional',
      system: `You are an emotionally-driven storyteller. Focus on character depth, relationships, and emotional impact.`,
      user: `Create a ${category} concept based on this seed idea: "${seedIdea}". Focus on emotional resonance and character development.`,
    },
    {
      name: 'wildcard',
      system: `You are an avant-garde creative who thinks outside the box. Be unconventional, absurd, and unexpected.`,
      user: `Create a ${category} concept based on this seed idea: "${seedIdea}". Be as creative and unconventional as possible. Break rules.`,
    },
  ];

  // Call Grok API for each angle in parallel
  const angleResults = await Promise.all(
    prompts.map(async (prompt) => {
      try {
        const result = await callGrokAPI([
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ], 0.9);
        return { name: prompt.name, content: result };
      } catch (error) {
        console.error(`Error in ${prompt.name} angle:`, error);
        return { name: prompt.name, content: '' };
      }
    })
  );

  // Synthesize all angles into one coherent concept
  const synthesisPrompt = `You are a master creative synthesizer. 

I have generated a ${category} concept from three different creative angles:

LOGICAL ANGLE:
${angleResults[0].content}

EMOTIONAL ANGLE:
${angleResults[1].content}

WILDCARD ANGLE:
${angleResults[2].content}

Your task: Synthesize these three perspectives into ONE coherent, original ${category} concept that:
1. Takes the best elements from each angle
2. Creates something truly unique and innovative
3. Ensures logical consistency while maintaining emotional depth and creative surprise
4. Is commercially viable but artistically bold

Respond in JSON format:
{
  "title": "Catchy title for the concept",
  "description": "2-3 sentence elevator pitch",
  "fullConcept": "Detailed 5-7 paragraph description covering: premise, core mechanics/plot, unique selling points, target audience, and why it's original"
}`;

  const synthesisResult = await callGrokAPI([
    { role: 'system', content: 'You are a creative synthesis expert. Always respond in valid JSON format.' },
    { role: 'user', content: synthesisPrompt },
  ], 0.7);

  // Parse JSON response
  let parsedResult;
  try {
    // Clean potential markdown code blocks
    const cleanedResult = synthesisResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsedResult = JSON.parse(cleanedResult);
  } catch (error) {
    console.error('Failed to parse synthesis result:', error);
    // Fallback
    parsedResult = {
      title: 'Generated Concept',
      description: 'A unique creative concept.',
      fullConcept: synthesisResult,
    };
  }

  // Calculate novelty score (simplified - in production, use embeddings + vector DB)
  const noveltyScore = calculateNoveltyScore(parsedResult.fullConcept);

  return {
    ...parsedResult,
    noveltyScore,
  };
}

export async function getBrainstormSuggestions(seedIdea: string): Promise<{
  existingWorks: string[];
  unusualAngles: string[];
  frameworks: string[];
  nextSteps: string;
}> {
  const prompt = `You are a creative brainstorming assistant.

User's seed idea: "${seedIdea}"

Provide:
1. 3 existing works/concepts similar to this (for reference)
2. 3 unusual angles or unexplored aspects of this idea
3. 2 creative frameworks that could help develop this
4. Suggested next steps

Respond in JSON format:
{
  "existingWorks": ["work1", "work2", "work3"],
  "unusualAngles": ["angle1", "angle2", "angle3"],
  "frameworks": ["framework1", "framework2"],
  "nextSteps": "What to do next"
}`;

  const result = await callGrokAPI([
    { role: 'system', content: 'You are a brainstorming expert. Always respond in valid JSON format.' },
    { role: 'user', content: prompt },
  ], 0.8);

  // Parse JSON response
  try {
    const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedResult);
  } catch (error) {
    console.error('Failed to parse brainstorm result:', error);
    return {
      existingWorks: [],
      unusualAngles: [],
      frameworks: [],
      nextSteps: 'Proceed to AI Creator to develop your concept.',
    };
  }
}

// Simplified novelty calculation
// In production: use embeddings + cosine similarity against database
function calculateNoveltyScore(content: string): number {
  // Simple heuristic based on:
  // - Length (longer = more developed)
  // - Unique words
  // - Sentence complexity
  
  const words = content.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  
  const lengthScore = Math.min(words.length / 500, 1) * 30;
  const uniquenessScore = (uniqueWords.size / words.length) * 40;
  const complexityScore = Math.min(sentences.length / 10, 1) * 30;
  
  const baseScore = lengthScore + uniquenessScore + complexityScore;
  
  // Add randomness for demo (in production, use real similarity)
  const randomFactor = Math.random() * 15 - 5;
  
  return Math.round(Math.max(0, Math.min(100, baseScore + randomFactor)));
}
