import Head from "next/head";
import { Box, Container, VStack, Heading, Text, Button, useColorModeValue, Center, useColorMode, Switch } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import CardList from "@/components/uptime/CardList";
import DataSources from "@/components/uptime/DataSources";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRocket } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";
import Uptime from "@/components/uptime/Uptime";
import { APP_NAME } from "@/configs/constant";

export default function Home() {

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.100, green.100)",
    "linear(to-r, blue.800, green.800)"
  );

  const headingColor = useColorModeValue("gray.800", "white");

  return (
    <MainLayout>
      <Head>
        <title>Compare Redirect Service Speeds | Uptime & Response Times Comparison | {APP_NAME}</title>
        <meta
          name="description"
          content="Find the fastest redirect services from RedirHub, Redirect.pizza, and EasyRedir with our comprehensive speed comparison tool. Check uptime, response times, and performance details in real-time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="msapplication-TileImage" content="/favicon.png" />
        <meta property="og:image" content="/preview.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Redirect Services Performance Comparison" />
      </Head>
      <Box bgGradient={bgGradient} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} alignItems="center" textAlign="center">
            <Heading as="h1" fontSize={getFluidFontSize(36, 48)} fontWeight="800" lineHeight="1.2">
              Redirect Services Performance Comparison
            </Heading>
            <Text fontSize={getFluidFontSize(18, 22)} maxW="800px">
              Discover which redirect service delivers the fastest response times and highest uptime with our real-time
              comparison tool. Make data-driven decisions for your website&apos;s performance.
            </Text>
          </VStack>
        </Container>
      </Box>
      <AppContainer>
        <Uptime />
      </AppContainer>
    </MainLayout>
  );
}