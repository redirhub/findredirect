import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { field, content, locale = 'en' } = body

    if (!field || !content) {
      return NextResponse.json(
        { error: 'Field and content are required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    let systemPrompt = ''
    let userPrompt = ''

    const contentText = Array.isArray(content)
      ? content
          .filter((block: any) => block._type === 'block')
          .map((block: any) =>
            block.children?.map((child: any) => child.text).join('') || ''
          )
          .join('\n\n')
      : content

    switch (field) {
      case 'title':
        systemPrompt = `You are an expert SEO copywriter. Generate a compelling, SEO-optimized blog post title in ${locale === 'en' ? 'English' : `the ${locale} language`}.

Requirements:
- Maximum 60 characters
- Clear, engaging, and click-worthy
- Include primary keywords naturally
- No clickbait

Return ONLY the title text, no quotes or additional formatting.`
        userPrompt = `Based on this blog post content, generate an SEO-optimized title:\n\n${contentText}`
        break

      case 'excerpt':
        systemPrompt = `You are an expert content summarizer. Generate a compelling excerpt in ${locale === 'en' ? 'English' : `the ${locale} language`}.

Requirements:
- Maximum 160 characters
- 2-3 sentences that entice readers
- Include primary keywords
- Clear and concise

Return ONLY the excerpt text, no quotes or additional formatting.`
        userPrompt = `Based on this blog post content, generate an engaging excerpt:\n\n${contentText}`
        break

      case 'tags':
        systemPrompt = `You are an SEO expert. Generate relevant tags in ${locale === 'en' ? 'English' : `the ${locale} language`}.

Requirements:
- Return a JSON array of 3-5 tags
- Lowercase, no special characters
- Relevant keywords for SEO
- Single words or short phrases

Return ONLY a valid JSON array like: ["tag1", "tag2", "tag3"]`
        userPrompt = `Based on this blog post content, generate relevant SEO tags:\n\n${contentText}`
        break

      case 'faqs':
        systemPrompt = `You are a content strategist. Generate relevant FAQs in ${locale === 'en' ? 'English' : `the ${locale} language`}.

Requirements:
- Generate 3-5 FAQs
- Questions should be natural and commonly asked
- Answers should be clear and concise (2-3 sentences each)
- Return as JSON array of objects with "question" and "answer" fields

Return ONLY a valid JSON array like:
[
  {"question": "Question text?", "answer": "Answer text."},
  {"question": "Another question?", "answer": "Another answer."}
]`
        userPrompt = `Based on this blog post content, generate relevant FAQs:\n\n${contentText}`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid field type' },
          { status: 400 }
        )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: field === 'faqs' ? 1000 : 200,
    })

    let result: any = completion.choices[0].message.content?.trim()

    // Parse JSON for tags and faqs
    if (field === 'tags' || field === 'faqs') {
      try {
        result = JSON.parse(result)
      } catch (e) {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = result.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1])
        } else {
          throw new Error('Invalid JSON response from AI')
        }
      }
    }

    return NextResponse.json({ value: result })
  } catch (error: any) {
    console.error('Error generating field:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate field',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
