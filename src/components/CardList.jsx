import { Box, Flex, HStack, Heading, Stack, Text, Badge, Tooltip, Button } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { getFluidFontSize, getFormattedTimeDiff } from "@/utils";
import CardListSkeleton from "./CardListSkeleton";
import { FaCheckCircle, FaClock, FaBolt, FaCar, FaBicycle, FaRocket, FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";
import React from "react";

// Extracted styles to a separate object
const styles = {
  card: {
    transition: "all 0.3s ease",
    _hover: {
      boxShadow: "xl",
      transform: "translateY(-2px)",
    },
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    px: 3,
    py: 1,
    borderRadius: "full",
    fontWeight: "medium",
  },
  fastestBadge: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 2,
    py: 1,
    borderRadius: "full",
    bg: "yellow.100",
    color: "yellow.800",
    fontWeight: "medium",
    fontSize: "sm",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bg: "gray.50",
    borderRadius: "md",
    p: 4, // Increased padding
    minWidth: "120px", // Increased minimum width
  },
};

// New utility function to find the fastest site
const findFastestSite = (sitesData) => {
  return sitesData.reduce((fastest, current) => {
    const currentTiming = current[1].timings?.total || Infinity;
    const fastestTiming = fastest ? fastest[1].timings?.total || Infinity : Infinity;
    return currentTiming < fastestTiming ? current : fastest;
  }, null);
};

// New utility function to generate official website URL
const generateOfficialUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const rootDomain = parsedUrl.hostname.split('.').slice(-2).join('.');
    return `https://www.${rootDomain}`;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return url; // Return original URL if parsing fails
  }
};

// Main component (moved up for context)
export default function CardList({ sitesData = [] }) {
  const fastestSite = findFastestSite(sitesData);

  return (
    <Stack spacing={4} mx="auto">
      {sitesData?.length > 0 ? (
        sitesData.map((site) => (
          <SiteCard 
            key={`${site[0].token}-${site[0].url}`} 
            site={site} 
            isFastest={site[0].token === fastestSite?.[0].token}
          />
        ))
      ) : (
        <CardListSkeleton />
      )}
    </Stack>
  );
}

// Updated SiteCard component
const SiteCard = ({ site, isFastest }) => {
  const { token, url, alias, last_check_at, uptime } = site[0];
  const { timings } = site[1];

  return (
    <Box
      {...styles.card}
      bg="white"
      borderRadius="xl"
      p={6}
      boxShadow="md"
      border="1px solid"
      borderColor="gray.100"
    >
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="stretch" gap={6}>
        <Stack spacing={4} flex={1}>
          <SiteTitle alias={alias} url={url} isFastest={isFastest} />
          <SiteLastCheck lastCheckAt={last_check_at} token={token} />
          <SiteLinks url={url} token={token} />
        </Stack>
        <SiteStats uptime={uptime} timings={timings} token={token} />
      </Flex>
    </Box>
  );
};

// Updated SiteTitle component
const SiteTitle = ({ alias, url, isFastest }) => (
  <Flex alignItems="center" gap={2}>
    <Heading
      as="h4"
      fontSize={getFluidFontSize(20, 24)}
      fontWeight="600"
    >
      {alias || url}
    </Heading>
    {isFastest && (
      <Badge {...styles.fastestBadge}>
        <FaBolt /> Fastest
      </Badge>
    )}
  </Flex>
);

const SiteLastCheck = ({ lastCheckAt, token }) => (
    <Text
      href={`https://updown.io/${token}`}
      target="_blank"
      color="gray.600"
      fontSize={getFluidFontSize(14, 16)}
      display="flex"
      alignItems="center"
      gap={2}
    >
      <FaClock />
      Last check: {getFormattedTimeDiff(lastCheckAt)}
    </Text>
);

const SiteLinks = ({ url, token }) => {
  const officialUrl = generateOfficialUrl(url);

  return (
    <HStack spacing={2}>
      <Tooltip label="View full details" placement="top">
        <Button
          as={Link}
          href={`https://updown.io/${token}`}
          target="_blank"
          size="sm"
          colorScheme="blue"
          leftIcon={<FaInfoCircle />}
          variant="ghost"
          fontWeight="normal"
          fontSize={getFluidFontSize(14, 16)}
        >
          Details
        </Button>
      </Tooltip>
      <Tooltip label="Visit official website" placement="top">
        <Button
          as={Link}
          href={officialUrl}
          target="_blank"
          size="sm"
          colorScheme="green"
          leftIcon={<FaExternalLinkAlt />}
          variant="ghost"
          fontWeight="normal"
          fontSize={getFluidFontSize(14, 16)}
        >
          Website
        </Button>
      </Tooltip>
    </HStack>
  );
};

const SiteStats = ({ uptime, timings, token }) => {
  const responseTime = timings?.total || 0;
  const isFastResponse = responseTime < 150;

  return (
    <HStack spacing={4} justifyContent="flex-end" flexWrap="wrap">
      <StatItem label="Uptime" value={`${uptime}%`} icon={<FaCheckCircle color="green" />} />
      <StatItem 
        label="Response" 
        value={`${responseTime}ms`} 
        icon={isFastResponse ? <FaBolt color="green" /> : <FaBicycle color="orange" />}
      />
    </HStack>
  );
};

const StatItem = ({ label, value, icon }) => (
  <Tooltip label={label} placement="top">
    <Stack {...styles.statItem}>
      {React.cloneElement(icon, { size: 24 })} {/* Increased icon size */}
      <Text fontWeight="bold" fontSize={getFluidFontSize(22, 26)}> {/* Increased font size */}
        {value}
      </Text>
      <Text color="gray.500" fontSize={getFluidFontSize(14, 16)}> {/* Slightly increased label font size */}
        {label}
      </Text>
    </Stack>
  </Tooltip>
);
