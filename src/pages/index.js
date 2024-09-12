import Head from "next/head";
import { Box, Container, Flex, Heading, Text, Button, VStack, useColorModeValue, Center } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { AppContainer } from "@/components/AppContainer";
import { getFluidFontSize } from "@/utils";
import CardList from "@/components/CardList";
import DataSources from "@/components/DataSources";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRocket } from "react-icons/fa";

export default function Home() {
  const [ sitesData, setSitesData ] = useState({
    nodes: {},
    sites: []
  });

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.100, green.100)",
    "linear(to-r, blue.900, green.900)"
  );

  async function fetchDataSources() {
    try {
      const apiRouteResponse = await axios.get("api/data");
      setSitesData(apiRouteResponse.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDataSources();
  }, []);

  return (
    <>
      <Head>
        <title>Compare Redirect Service Speeds | Uptime & Response Times Comparison</title>
        <meta
          name="description"
          content="Find the fastest redirect services from RedirHub, Redirect.pizza, and EasyRedir with our comprehensive speed comparison tool. Check uptime, response times, and performance details in real-time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box bgGradient={bgGradient} py={20}>
          <Container maxW="container.xl">
            <VStack spacing={8} alignItems="center" textAlign="center">
              <Heading as="h1" fontSize={getFluidFontSize(36, 48)} fontWeight="800" lineHeight="1.2">
                Redirect Services Performance Comparison
              </Heading>
              <Text fontSize={getFluidFontSize(18, 22)} maxW="800px" color={useColorModeValue("gray.600", "gray.300")}>
                Discover which redirect service delivers the fastest response times and highest uptime with our real-time
                comparison tool. Make data-driven decisions for your website&apos;s performance.
              </Text>
            </VStack>
          </Container>
        </Box>
        <AppContainer>
          <Box my={12}>
            <CardList sitesData={sitesData?.sites} />
          </Box>
          <Center my={12}>
            <Button
              as={Link}
              href="https://www.redirhub.com"
              size="lg"
              colorScheme="green"
              rightIcon={<FaRocket />}
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.3s"
            >
              Get started with RedirHub
            </Button>
          </Center>
          <DataSources sitesData={sitesData?.nodes} />
        </AppContainer>
      </main>
    </>
  );
}
