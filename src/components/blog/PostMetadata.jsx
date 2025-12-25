import { Box, Flex, HStack, Text, Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import { FaCalendar, FaRegClock } from "react-icons/fa";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import { formatPostDate } from "@/utils/blogHelpers";
import { urlFor } from "@/sanity/lib/image";
import TagBadge from "./TagBadge";

const MotionFlex = motion(Flex);

export default function PostMetadata({
  publishedAt,
  author,
  readTimeMinutes,
  tags = [],
  compact = false,
  showTags = true,
  layout = "horizontal", // "horizontal" | "vertical"
  disableAuthorLink = false,
}) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Box>
      <Flex
        align="center"
        gap={2}
        wrap="wrap"
        fontSize={compact ? "sm" : "md"}
        color="#6C6965"
        fontWeight="500"
      >
        {publishedAt && (
          <>
            <Flex align="center" gap={1.5}>
              <FaCalendar size={compact ? 14 : 16} color="#6C6965" />
              <Text>{formatPostDate(publishedAt)}</Text>
            </Flex>
            {(readTimeMinutes || author) && <Text>•</Text>}
          </>
        )}

        {readTimeMinutes && (
          <>
            <Flex align="center" gap={1.5}>
              <FaRegClock size={compact ? 14 : 16} color="#6C6965" />
              <Text>{t('blog.min-read', '{{minutes}} min read', { minutes: readTimeMinutes })}</Text>
            </Flex>
            {author && <Text>•</Text>}
          </>
        )}

        {author && (
          <MotionFlex
            align="center"
            gap={2}
            cursor={!disableAuthorLink && author.slug ? "pointer" : "default"}
            onClick={(e) => {
              if (!disableAuthorLink && author.slug) {
                e.stopPropagation(); // Prevent parent click handlers
                router.push(`/blog/author/${author.slug.current}`);
              }
            }}
            _hover={!disableAuthorLink && author.slug ? { color: "#7D65DB" } : {}}
            transition="all 0.2s"
            whileHover={!disableAuthorLink && author.slug ? { scale: 1.05, y: -2 } : {}}
            whileTap={!disableAuthorLink && author.slug ? { scale: 0.98 } : {}}
          >
            {author.image && (
              <Avatar
                size={compact ? "xs" : "sm"}
                name={author.name}
                src={urlFor(author.image).width(40).height(40).url()}
                border="2px solid"
                borderColor="purple.200"
              />
            )}
            <Text textTransform="capitalize">
              {author.name}
            </Text>
          </MotionFlex>
        )}
      </Flex>

      {showTags && tags && tags.length > 0 && (
        <Wrap spacing={2} mt={3}>
          {tags.slice(0, 5).map((tag, index) => (
            <WrapItem key={index}>
              <TagBadge tag={tag} size={compact ? "sm" : "md"} />
            </WrapItem>
          ))}
          {tags.length > 5 && (
            <WrapItem>
              <Text fontSize="sm" color="gray.500">
                {t('blog.more-tags', '+{{count}} more', { count: tags.length - 5 })}
              </Text>
            </WrapItem>
          )}
        </Wrap>
      )}
    </Box>
  );
}
