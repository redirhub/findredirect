import Head from "next/head";

import {Box, Flex, HStack, Heading, Stack, Text, Image} from "@chakra-ui/react";
import { AppContainer } from "@/components/AppContainer";
import { Link } from "@chakra-ui/next-js";
import { getFluidFontSize } from "@/utils";
import CardList from "@/components/CardList";
import DataSources from "@/components/DataSources";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Home() {
  const stylesBtnCta = {
    className: "btn-cta",
    display: "flex",
    fontSize: getFluidFontSize(16, 18),
    fontWeight: "500",
    padding: "5px 15px",
    textAlign: "center",
    borderRadius: "3px",
    color: "#fff",
    backgroundColor: "#17b96e",
  };
  
  const [sitesData, setSitesData] = useState({
    nodes: {},
    sites: []
  })
  
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
  }, [])
  
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
        <AppContainer>
          <Stack maxWidth="450px" gap="20px" textAlign="center" my="60px" mx="auto">
            <Heading as="h1" fontSize={getFluidFontSize(28, 32)} fontWeight="600">
              Redirect Services Performance Comparison
            </Heading>
             <Text maxWidth="90%">
              Discover which redirect service delivers the fastest response times and highest uptime with our real-time
              comparison tool.
            </Text>
          </Stack>
          <CardList sitesData={ sitesData?.sites } />
          <Flex my="50px" alignItems="center" justifyContent="center">
            <Link href="https://www.redirhub.com" {...stylesBtnCta}>
              Get started with RedirHub today
            </Link>
          </Flex>
          <DataSources sitesData={ sitesData?.nodes } />
        </AppContainer>
      </main>
    </>
  );
}
