import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, locale = 'en' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
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

IMPORTANT: Return ONLY valid JSON, no markdown code blocks or explanations.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    const generatedPost = JSON.parse(content);

    // Validate the response structure
    if (!generatedPost.title || !generatedPost.content) {
      throw new Error('Invalid response from AI');
    }

    // Ensure content is properly formatted for Sanity
    const formattedContent = generatedPost.content.map((block) => {
      if (block._type === 'block') {
        return {
          _type: 'block',
          _key: generateKey(),
          style: block.style || 'normal',
          children: block.children.map(child => ({
            _type: 'span',
            _key: generateKey(),
            text: child.text || '',
            marks: child.marks || []
          })),
          markDefs: block.markDefs || []
        };
      }
      return block;
    });

    // Ensure FAQs don't exceed 5
    const faqs = generatedPost.faqs ? generatedPost.faqs.slice(0, 5) : [];

    return res.status(200).json({
      title: generatedPost.title,
      excerpt: generatedPost.excerpt || '',
      tags: generatedPost.tags || [],
      content: formattedContent,
      faqs: faqs
    });

  } catch (error) {
    console.error('Error generating post:', error);
    return res.status(500).json({
      error: 'Failed to generate post',
      details: error.message
    });
  }
}

// Generate random key for Sanity blocks
function generateKey() {
  return Math.random().toString(36).substring(2, 11);
}
