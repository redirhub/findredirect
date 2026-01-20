import { Box, Heading, VStack, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

export default function TableOfContents({ content }) {
  const { t } = useTranslation();
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Extract headings from content
    if (!Array.isArray(content)) return;

    const extractedHeadings = content
      .filter((block) => block._type === "block" && block.style?.match(/^h[2-3]$/))
      .map((block, index) => {
        const text = block.children?.map((child) => child.text).join("") || "";
        const id = `heading-${index}`;
        const level = parseInt(block.style.replace("h", ""));
        return { text, id, level };
      });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    // Observe heading elements for active state
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -35% 0px",
        threshold: 0.5,
      }
    );

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <Box
      as="aside"
      position="sticky"
      top="100px"
      height="fit-content"
      maxH="calc(100vh - 40px)"
      overflowY="auto"
      p={6}
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#CBD5E0',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#A0AEC0',
        },
      }}
    >
      <Heading
        as="p"
        fontSize="sm"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.05em"
        color="gray.900"
        mb={4}
      >
        {t('blog.table-of-contents', 'TABLE OF CONTENTS:')}
      </Heading>

      <VStack align="stretch" spacing={2}>
        {headings.map(({ text, id, level }) => (
          <Link
            key={id}
            href={`#${id}`}
            fontSize="sm"
            color={activeId === id ? "#7D65DB" : "gray.600"}
            fontWeight={activeId === id ? "600" : "400"}
            pl={level === 3 ? 4 : 0}
            py={1}
            _hover={{
              color: "#7D65DB",
              textDecoration: "none",
            }}
            transition="all 0.2s"
            lineHeight="1.5"
          >
            {text}
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
