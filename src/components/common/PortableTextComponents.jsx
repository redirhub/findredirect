import Link from "next/link";
import { Box, Heading, Text, Link as ChakraLink, Image as ChakraImage } from "@chakra-ui/react";
import { urlFor } from "@/sanity/lib/image";

/**
 * Shared PortableText components configuration
 * Handles links, images, and custom blocks
 */
export const createPortableTextComponents = (options = {}) => {
  const {
    postData,
    enableHeadings = false,
    currentHeadingIndexRef = { current: -1 }
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
        const href = value?.reference?.slug?.current
          ? `/${value.reference.slug.current}`
          : '#';

        return (
          <Link href={href} passHref legacyBehavior>
            <ChakraLink
              color="blue.600"
              textDecoration="underline"
              _hover={{ color: "blue.700" }}
            >
              {children}
            </ChakraLink>
          </Link>
        );
      },
      // External links
      link: ({ value, children }) => {
        const target = value?.href?.startsWith('http') ? '_blank' : undefined;
        const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

        return (
          <ChakraLink
            href={value?.href}
            target={target}
            rel={rel}
            color="blue.600"
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
export const toolPageComponents = createPortableTextComponents({
  enableHeadings: false,
});
