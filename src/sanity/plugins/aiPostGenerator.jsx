import { useState, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Stack,
  Text,
  TextArea,
  Spinner,
  Label
} from '@sanity/ui'
import { SparklesIcon } from '@sanity/icons'
import { useDocumentOperation } from 'sanity'

export function AIPostGeneratorAction(props) {
  const { draft, id, onComplete } = props
  const { patch } = useDocumentOperation(id, 'post')
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          locale: draft?.locale || 'en'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const data = await response.json()

      // Build patch object for fields to update
      const patchData = {}
      let fieldsUpdated = 0

      if (data.title && !draft?.title) {
        patchData.title = data.title
        fieldsUpdated++
      }

      if (data.excerpt && !draft?.excerpt) {
        patchData.excerpt = data.excerpt
        fieldsUpdated++
      }

      if (data.tags && data.tags.length > 0 && (!draft?.tags || draft.tags.length === 0)) {
        patchData.tags = data.tags
        fieldsUpdated++
      }

      if (data.content && (!draft?.content || draft.content.length === 0)) {
        patchData.content = data.content
        fieldsUpdated++
      }

      if (data.faqs && data.faqs.length > 0 && (!draft?.faqs || draft.faqs.length === 0)) {
        patchData.faqs = data.faqs
        fieldsUpdated++
      }

      // Apply patches using document operation
      if (fieldsUpdated > 0) {
        // Execute the patch operation
        patch.execute([{ set: patchData }])

        onComplete()
        setIsOpen(false)
        setPrompt('')

        // Show success message
        // alert(`AI content generated successfully! ${fieldsUpdated} field(s) updated. Review and edit as needed.`)
      } else {
        setError('No fields were updated. Document may already have content.')
      }
    } catch (err) {
      console.error('Error generating post:', err)
      setError(err.message || 'Failed to generate post content')
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, draft, patch, onComplete])

  return {
    label: 'Generate with AI',
    icon: SparklesIcon,
    onHandle: () => setIsOpen(true),
    dialog: isOpen && {
      type: 'dialog',
      onClose: () => {
        setIsOpen(false)
        setError(null)
      },
      header: 'Generate Blog Post with AI',
      content: (
        <Card padding={4}>
          <Stack space={4}>
            <Text size={1} muted>
              Describe the blog post you want to create. AI will generate the title,
              excerpt, tags, content, and FAQs based on your prompt.
            </Text>

            <Stack space={3}>
              <Label size={1}>Prompt</Label>
              <TextArea
                placeholder="Example: Write a blog post about 'The benefits of URL shortening for social media marketing'. Include tips for tracking clicks and improving engagement."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                disabled={isGenerating}
              />
            </Stack>

            {error && (
              <Card tone="critical" padding={3} radius={2}>
                <Text size={1}>{error}</Text>
              </Card>
            )}

            {draft?.title && (
              <Card tone="caution" padding={3} radius={2}>
                <Text size={1}>
                  ⚠️ This document already has a title. Only empty fields will be populated.
                </Text>
              </Card>
            )}

            <Flex gap={3} justify="flex-end">
              <Button
                text="Cancel"
                mode="ghost"
                onClick={() => {
                  setIsOpen(false)
                  setError(null)
                }}
                disabled={isGenerating}
              />
              <Button
                text={isGenerating ? 'Generating...' : 'Generate'}
                tone="primary"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                icon={isGenerating ? Spinner : SparklesIcon}
              />
            </Flex>
          </Stack>
        </Card>
      ),
    },
  }
}

export const aiPostGeneratorPlugin = () => {
  return {
    name: 'ai-post-generator',
    document: {
      actions: (prev, { schemaType }) => {
        // Only add to post documents
        if (schemaType !== 'post') {
          return prev
        }

        return [AIPostGeneratorAction, ...prev]
      },
    },
  }
}
