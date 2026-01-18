import Link from "next/link";
import { Box, Heading, Text, Link as ChakraLink, Image as ChakraImage } from "@chakra-ui/react";
import { urlFor } from "@/sanity/lib/image";

/**
 * Generate a unique key for mark definitions
 */
const genKey = () => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Transform PortableText content to handle non-standard link structure
 * Converts spans with `url` properties to proper PortableText mark definitions
 *
 * Input: { _type: 'span', marks: ['link'], text: '...', url: '/path' }
 * Output: { _type: 'span', marks: ['link-abc123'], text: '...' }
 * With markDefs: [{ _key: 'link-abc123', _type: 'link', href: '/path' }]
 */
export const transformPortableTextLinks = (content, targetLocale = 'en') => {
  if (!Array.isArray(content)) return content;

  return content.map(block => {
    if (!block.children || !Array.isArray(block.children)) return block;

    const markDefs = [...(block.markDefs || [])];
    const children = block.children.map(child => {
      if (!child.url) return child;

      // Create a new mark definition for this URL
      const linkKey = genKey();
      markDefs.push({
        _key: linkKey,
        _type: 'link',
        href: targetLocale !== 'en' ? `/${targetLocale}${child.url}` : child.url,
      });

      // Return the child with url removed and mark reference added
      // Remove 'link' from marks if it exists to avoid nested <a> tags
      const { url, ...childWithoutUrl } = child;
      const marks = (child.marks || []).filter(mark => mark !== 'link');
      return {
        ...childWithoutUrl,
        marks: [...marks, linkKey]
      };
    });

    return {
      ...block,
      markDefs,
      children
    };
  });
};

/**
 * Shared PortableText components configuration
 * Handles links, images, and custom blocks
 */
export const createPortableTextComponents = (options = {}) => {
  const {
    postData,
    enableHeadings = false,
    currentHeadingIndexRef = { current: -1 },
    locale = 'en'
  } = options;

  return {
    types: {
      image: ({ value }) => {
        const src = value?.asset
          ? urlFor(value).width(1200).fit("max").url()
          : value?.url;

        if (!src) return null;

        return (
          <Box my={6} textAlign="center">
            <ChakraImage
              src={src}
              alt={value?.alt || postData?.title || "Image"}
              mx="auto"
              maxH="640px"
              maxWidth="800px"
              w="100%"
              objectFit="contain"
              loading="lazy"
            />
            {value?.caption && (
              <Text mt={2} fontSize="sm" color="gray.500">
                {value.caption}
              </Text>
            )}
          </Box>
        );
      },
      // Handle span blocks (inline content)
      span: ({ value, children }) => {
          return <Text as="span">{children}</Text>;
        },
    },
    marks: {
      // Internal links
      internalLink: ({ value, children }) => {
        const slug = value?.reference?.slug?.current;
        if (!slug) return <>{children}</>;

        // Prefix internal links with locale if not English
        const href = locale !== 'en' ? `/${locale}/${slug}` : `/${slug}`;

        return (
          <ChakraLink
            as={Link}
            href={href}
            color="blue.600"
            textDecoration="underline"
            _hover={{ color: "blue.700" }}
          >
            {children}
          </ChakraLink>
        );
      },
      // External links
      link: ({ value, children }) => {
        const target = value?.href?.startsWith('http') ? '_blank' : undefined;
        const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

        const href = !value?.href?.includes(locale) && locale !== 'en'
          ? `/${locale}${value?.href}`
          : value?.href;

        return (
          <ChakraLink
            href={href}
            target={target}
            rel={rel}
            color="blue.600"
            pl={locale !== 'en' && href?.startsWith('/') ? 1 : 0}
            textDecoration="underline"
            _hover={{ color: "blue.700" }}
          >
            {children}
          </ChakraLink>
        );
      },
      // Strong/bold text
      strong: ({ children }) => <strong>{children}</strong>,
      // Emphasis/italic text
      em: ({ children }) => <em>{children}</em>,
      // Code
      code: ({ children }) => (
        <Text
          as="code"
          px={2}
          py={1}
          bg="gray.100"
          borderRadius="md"
          fontSize="0.9em"
          fontFamily="mono"
        >
          {children}
        </Text>
      ),
    },
    block: enableHeadings ? {
      normal: ({ children, value }) => {
        return <Text>{children}</Text>;
      },
      bullet: ({ children, value }) => {
        return <Text as="li">{children}</Text>;
      },
      h2: ({ children }) => {
        currentHeadingIndexRef.current++;
        return (
          <Heading
            as="h2"
            id={`heading-${currentHeadingIndexRef.current}`}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            mt={10}
            mb={4}
            color="gray.900"
            scrollMarginTop="100px"
          >
            {children}
          </Heading>
        );
      },
      h3: ({ children }) => {
        currentHeadingIndexRef.current++;
        return (
          <Heading
            as="h3"
            id={`heading-${currentHeadingIndexRef.current}`}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            mt={6}
            mb={3}
            color="gray.900"
            scrollMarginTop="100px"
          >
            {children}
          </Heading>
        );
      },
    } : undefined,
  };
};

/**
 * Simple PortableText components for tool pages
 * No heading customization needed
 */
export const toolPageComponents = (locale = 'en') => createPortableTextComponents({
  enableHeadings: false,
  locale,
});
