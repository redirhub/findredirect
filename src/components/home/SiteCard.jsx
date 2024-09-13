import { Box, Flex, Stack, useColorModeValue } from "@chakra-ui/react";
import SiteTitle from "./SiteTitle";
import SiteLastCheck from "./SiteLastCheck";
import SiteLinks from "./SiteLinks";
import SiteStats from "./SiteStats";
import { SITESMAPPING } from "./sites";

export default function SiteCard({ site, isFastest }) {
  const { token, url, alias, last_check_at, uptime } = site[0];
  const { timings } = site[1];
  const siteInfo = SITESMAPPING.find(s => s.id === token);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      p={6}
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.3s ease"
    >
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="stretch" gap={6}>
        <Stack spacing={4} flex={1}>
          <SiteTitle alias={alias} name={siteInfo?.name} url={url} isFastest={isFastest} />
          <SiteLastCheck lastCheckAt={last_check_at} token={token} />
          <SiteLinks url={url} token={token} official={siteInfo?.official} />
        </Stack>
        <Flex justifyContent={{ base: "center", md: "flex-end" }} width={{ base: "100%", md: "auto" }}>
          <SiteStats uptime={uptime} timings={timings} token={token} />
        </Flex>
      </Flex>
    </Box>
  );
}