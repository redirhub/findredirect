import Head from "next/head";

import { Heading, Stack, Text } from "@chakra-ui/react";
import { AppContainer } from "@/components/AppContainer";

export default function Home() {
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
          <Stack gap="15px" textAlign="center" my="60px">
            <Heading as="h1" size="text40">
              Redirect Services Performance Comparison Redirect Services Performance Comparison Redirect Services
              Performance Comparison
            </Heading>
            <Text>
              Discover which redirect service delivers the fastest response times and highest uptime with our real-time
              comparison tool.
            </Text>
          </Stack>
          <hr />
        </AppContainer>
      </main>
    </>
  );
}
