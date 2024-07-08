import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Heading, Text } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

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
      <main className={`${inter.className}`}>
        <Heading as="h1">Redirect Services Performance Comparison</Heading>
        <Text>
          Discover which redirect service delivers the fastest response times and highest uptime with our real-time
          comparison tool.
        </Text>
      </main>
    </>
  );
}
