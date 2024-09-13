import Head from "next/head";
import { Box } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";

export default function RedirectCheck() {
    return (
        <MainLayout>
            <Head>
                <title>Redirect Check | RedirHub</title>
                <meta
                    name="description"
                    content="Check and analyze your redirects with RedirHub's powerful redirect checking tool."
                />
            </Head>
            <AppContainer>
                <Box my={12}>
                    <RedirectChecker />
                </Box>
            </AppContainer>
        </MainLayout>
    );
}