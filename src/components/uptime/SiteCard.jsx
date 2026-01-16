import { Badge, Box, Flex, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import SiteLinks from "./SiteLinks";
import SiteStats from "./SiteStats";
import { SITESMAPPING } from "./sites";
import { FaBolt } from "react-icons/fa";
import { styles } from "@/configs/uptime";
import { getFluidFontSize, getFormattedTimeDiff } from "@/utils";
import { FaClock } from "react-icons/fa";
import { useDevice } from "@/hooks/useDevice";
import { useTranslation } from 'next-i18next';

export default function SiteCard({ site, isFastest }) {
  const { t } = useTranslation();
  const { token, url, alias, last_check_at, uptime } = site[0];
  const { timings } = site[1];
  const siteInfo = SITESMAPPING.find(site => site.id === token);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const {isMobile} = useDevice();

  return (
    <Box
      {...styles.card}
      bg={bgColor}
      borderRadius="xl"
      p={{ base: 4, sm: 6 }}
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
    >
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="stretch" gap={{ base: 4, md: 6 }}>
        <Stack spacing={{ base: 2, md: 4 }} flex={1}>
          <SiteTitle alias={alias} name={siteInfo?.name} url={url} isFastest={isFastest} t={t} />
          <SiteLastCheck lastCheckAt={last_check_at} token={token} t={t} />
          {!isMobile && <SiteLinks url={url} token={token} official={siteInfo?.official} />}
        </Stack>
        <SiteStats uptime={uptime} timings={timings} token={token} />
        {isMobile && <SiteLinks url={url} token={token} official={siteInfo?.official} />}
      </Flex>
    </Box>
  );
};

const SiteTitle = ({ alias, name, url, isFastest, t }) => (
  <Flex
    alignItems="center"
    gap={2}
    flexWrap={{ base: "wrap", md: "nowrap" }}
    justifyContent="space-between"
  >
    <Flex
      alignItems="center"
      gap={2}
      flexWrap={{ base: "wrap", md: "nowrap" }}
      maxWidth={{ base: "100%" }}
    >
      <Heading
        as="span"
        fontSize={{ base: "lg", sm: getFluidFontSize(20, 24) }}
        fontWeight="600"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {name || alias || url}
      </Heading>
      {name && (alias || url) && (
        <Text
          color="gray.600"
          fontSize={{ base: "sm", sm: getFluidFontSize(14, 16) }}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          ({alias || url})
        </Text>
      )}
    </Flex>
    {isFastest && (
      <Badge {...styles.fastestBadge} flexShrink={0}>
        <FaBolt /> {t('tool.fastest', 'Fastest')}
      </Badge>
    )}
  </Flex>
);

const SiteLastCheck = ({ lastCheckAt, token, t }) => (
  <Text
    href={`https://updown.io/${token}`}
    target="_blank"
    color="gray.600"
    fontSize={{ base: "xs", sm: getFluidFontSize(14, 16) }}
    display="flex"
    alignItems="center"
    gap={2}
  >
    <FaClock />
    {t('tool.last-check', 'Last check:')} {getFormattedTimeDiff(lastCheckAt)}
  </Text>
);