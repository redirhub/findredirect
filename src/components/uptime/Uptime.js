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
import { styles } from "@/configs/uptime";

export default function Uptime() {
    const [ sitesData, setSitesData ] = useState({
        nodes: {},
        sites: []
    });

    const { colorMode, toggleColorMode } = useColorMode();

    const bgGradient = useColorModeValue(
        "linear(to-r, blue.100, green.100)",
        "linear(to-r, blue.800, green.800)"
    );

    const textColor = useColorModeValue("gray.600", "gray.300");
    const headingColor = useColorModeValue("gray.800", "white");

    async function fetchDataSources() {
        try {
            const apiRouteResponse = await axios.get("api/uptime");
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
            <Box my={12}>
                <CardList sitesData={sitesData?.sites} />
            </Box>
            <Center my={12}>
                <Button
                    href="https://www.redirhub.com"
                    {...styles.getStartedButton}
                >
                    Get started with RedirHub
                </Button>
            </Center>
            <DataSources sitesData={sitesData?.nodes} />
        </>
    );
}