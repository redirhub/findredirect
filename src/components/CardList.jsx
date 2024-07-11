import { Box, Flex, HStack, Heading, Stack, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { getFluidFontSize, getFormattedTimeDiff } from "@/utils";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CardList() {
  const [sitesData, setSitesData] = useState({});
  const [maxResponseItem, setMaxResponseItem] = useState(null);

  async function fetchChecks() {
    try {
      const apiRouteResponse = await axios.get("api/data");
      setSitesData(apiRouteResponse.data.data);

      // Find the element with the maximum data.timings.total
      const maxResponseTiming = apiRouteResponse.data.data.sites
        .map((site) => site)
        .reduce((prev, current) => (prev[1].timings.total > current[1].timings.total ? prev : current));
      setMaxResponseItem(maxResponseTiming);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchChecks();
  }, []);

  const stylesBigTag = {
    display: "flex",
    fontSize: getFluidFontSize(14, 16),
    padding: "5px",
    textAlign: "center",
    borderRadius: "3px",
    color: "#fff",
    backgroundColor: "#17b96e",
  };

  const stylesTag = {
    className: "btn-tag",
    display: "flex",
    textAlign: "center",
    fontSize: getFluidFontSize(12, 14),
    fontWeight: "800",
    padding: "2px 10px",
    borderRadius: "3px",
    backgroundColor: "#ffd831",
  };

  return (
    <Box mx="auto" borderBlockStart="1px solid var(--chakra-colors-gray-200)">
      {/* <code>{JSON.stringify(sitesData.sites[1])}</code> */}
      {sitesData?.sites?.map((site) => {
        const { token, url, alias, last_check_at, uptime } = site[0];
        const { timings } = site[1];

        return (
          <Box
            key={`${token}-${url}`}
            className="uptime-card"
            p="20px"
            borderBlockEnd="1px solid var(--chakra-colors-gray-200)"
          >
            <HStack
              maxW={{ lg: "90%" }}
              mx="auto"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap="30px"
              textAlign="center"
            >
              <HStack gap={{ base: "15px", md: "30px" }} flexWrap="wrap">
                <Box>
                  <Box as="span" {...stylesBigTag}>
                    UP
                  </Box>
                </Box>
                <Stack textAlign="left" gap="10px">
                  {process.env.NEXT_PUBLIC_FASTEST_FLAG_ON === token ? (
                    <HStack flexWrap="wrap">
                      <Heading
                        as="h4"
                        className="uptime-card-title"
                        fontSize={getFluidFontSize(20, 26)}
                        fontWeight="500"
                      >
                        {alias && url ? `${alias}` : `${url}`}
                      </Heading>
                      <Box as="span" {...stylesTag}>
                        Fastest
                      </Box>
                    </HStack>
                  ) : (
                    <Heading as="h4" className="uptime-card-title" fontSize={getFluidFontSize(20, 26)} fontWeight="500">
                      {alias && url ? `${alias}` : `${url}`}
                    </Heading>
                  )}

                  <Heading as="h5" className="uptime-card-subtitle" fontSize={getFluidFontSize(15, 17)}>
                    <Link href="https://updown.io/fzba" target="_blank" color="gray.500">
                      Last check: {getFormattedTimeDiff(last_check_at)}
                    </Link>
                  </Heading>
                </Stack>
              </HStack>
              <HStack gap={{ base: "30px", md: "60px" }} flexWrap="wrap">
                <Box className="uptime-card-uptime">
                  <Text color="gray.500" fontSize={getFluidFontSize(20, 24)}>
                    Uptime
                  </Text>
                  <Box as="span" fontSize={getFluidFontSize(26, 32)}>
                    {uptime}%
                  </Box>
                </Box>
                <Box className="uptime-card-uptime">
                  <Text color="gray.500" fontSize={getFluidFontSize(20, 24)}>
                    Response
                  </Text>
                  <Box as="span" fontSize={getFluidFontSize(26, 32)}>
                    {timings.total}ms
                  </Box>
                </Box>
                <Link
                  href={`https://updown.io/${token}`}
                  target="_blank"
                  color="info"
                  fontSize={getFluidFontSize(16, 17)}
                >
                  Details →
                </Link>
              </HStack>
            </HStack>
          </Box>
        );
      })}
    </Box>
  );
}
