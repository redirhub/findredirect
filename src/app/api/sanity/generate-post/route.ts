import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function generateKey() {
  return Math.random().toString(36).substr(2, 9)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, locale = 'en' } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are a professional blog post writer. Generate a comprehensive blog post based on the user's prompt.

Return your response as a JSON object with the following structure:
{
  "title": "A compelling, SEO-friendly title (max 60 characters)",
  "excerpt": "A brief 2-3 sentence summary that entices readers (max 160 characters)",
  "tags": ["tag1", "tag2", "tag3"],
  "content": [
    {
      "_type": "block",
      "style": "normal",
      "children": [{"_type": "span", "text": "Paragraph text here"}]
    },
    {
      "_type": "block",
      "style": "h2",
      "children": [{"_type": "span", "text": "Heading text"}]
    }
  ],
  "faqs": [
    {
      "question": "Relevant question about the topic?",
      "answer": "Clear, concise answer (2-3 sentences)"
    }
  ]
}

Guidelines:
- Write in ${locale === 'en' ? 'English' : `the ${locale} language`}
- Title: Clear, engaging, SEO-optimized
- Excerpt: Compelling summary that makes people want to read more
- Tags: 3-5 relevant keywords (lowercase, no special characters)
- Content: Well-structured with:
  * Opening paragraph introducing the topic
  * 3-5 main sections with h2 headings
  * Each section has 2-3 paragraphs
  * Use h3 for subsections if needed
  * Lists (ul/ol) where appropriate
  * Conclusion paragraph
- FAQs: 3-5 common questions with clear answers (max 5)

Content structure for Sanity:
- "normal" style = paragraph
- "h2" style = main heading
- "h3" style = subheading
- Each block has children array with span objects containing text

IMPORTANT: Return ONLY valid JSON, no markdown code blocks or explanations.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No response from AI')
    }

    const generatedPost = JSON.parse(content)

    // Validate the response structure
    if (!generatedPost.title || !generatedPost.content) {
      throw new Error('Invalid response from AI')
    }

    // Ensure content is properly formatted for Sanity
    const formattedContent = generatedPost.content.map((block: any) => {
      if (block._type === 'block') {
        return {
          _type: 'block',
          _key: generateKey(),
          style: block.style || 'normal',
          children: block.children.map((child: any) => ({
            _type: 'span',
            _key: generateKey(),
            text: child.text || '',
            marks: child.marks || []
          }))
        }
      }
      return block
    })

    // Format FAQs with keys
    const formattedFaqs = Array.isArray(generatedPost.faqs)
      ? generatedPost.faqs.map((faq: any) => ({
        _key: generateKey(),
        question: faq.question,
        answer: faq.answer
      }))
      : []

    return NextResponse.json({
      title: generatedPost.title,
      excerpt: generatedPost.excerpt || '',
      tags: generatedPost.tags || [],
      content: formattedContent,
      faqs: formattedFaqs
    })
  } catch (error: any) {
    console.error('Error generating post:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate post',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
