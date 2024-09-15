import { useState } from "react";
import Head from "next/head";
import { Box, Flex, Heading, Icon, Text, VStack, Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import { APP_NAME } from "@/configs/constant";
import { FaLink, FaSearch } from "react-icons/fa";
import { styles } from "@/configs/checker";
import FAQSection from "@/components/redirect-check/FAQSection";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";

export default function ShortURLExpanderPage() {
    const faqData = [
        {
            question: "What is a Short URL Expander?",
            answer: "A Short URL Expander is a tool that reveals the full, original URL behind a shortened link. It's useful for checking the destination of a short link before clicking, enhancing security and transparency."
        },
        {
            question: "Why should I use a Short URL Expander?",
            answer: "Using a Short URL Expander helps you verify the destination of shortened links, protecting you from potential phishing attempts or malicious websites. It's a simple way to ensure online safety."
        },
        {
            question: "How does a Short URL Expander work?",
            answer: "A Short URL Expander works by sending a request to the shortened URL and following any redirects until it reaches the final destination. It then displays the full, original URL to the user without actually visiting the website."
        },
        {
            question: "Are Short URL Expanders safe to use?",
            answer: "Yes, Short URL Expanders are safe to use. They allow you to see the destination of a shortened link without actually visiting the website, reducing the risk of exposure to potentially harmful content."
        },
        {
            question: "Can I use a Short URL Expander for any type of shortened link?",
            answer: "Most Short URL Expanders work with popular URL shortening services like bit.ly, t.co, goo.gl, and others. However, some custom or private URL shorteners may not be compatible with all expander tools."
        },
        {
            question: "Is it legal to use a Short URL Expander?",
            answer: "Yes, using a Short URL Expander is legal. It simply reveals publicly available information about the destination of a shortened link, which is not protected or hidden content."
        },
        {
            question: "How can a Short URL Expander improve my online security?",
            answer: "A Short URL Expander allows you to preview the destination of a link before clicking, helping you avoid phishing attempts, malware-infected sites, or unwanted content. This added layer of verification enhances your overall online security."
        }
    ];

    return (
        <MainLayout>
            <Head>
                <title>Short URL Expander: Reveal Full Links Instantly | {APP_NAME}</title>
                <meta
                    name="description"
                    content="Instantly expand shortened URLs to reveal their full destination. Enhance your online safety and transparency with our free Short URL Expander tool. Try it now!"
                />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqData.map(({ question, answer }) => ({
                            "@type": "Question",
                            "name": question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": answer
                            }
                        }))
                    })}
                </script>
            </Head>
            <AppContainer>
                <Box my={12}>
                    <RedirectChecker icon={FaLink} buttonText="Expand Short URLs" examples={[ "http://bit.ly/try", "https://rbnd.ly/booked", "https://6x.work/zeMJ" ]}>
                        <Flex direction="column" align="center" textAlign="center">
                            <Box {...styles.checkPage.heroBox}>
                                <Icon as={FaLink} {...styles.checkPage.heroIcon} />
                            </Box>
                            <Heading as="h1" {...styles.checkPage.heading}>
                                Short URL Expander
                            </Heading>
                            <Text {...styles.checkPage.description}>
                                Reveal the full destination of shortened URLs instantly.
                            </Text>
                        </Flex>
                    </RedirectChecker>
                    <FAQSection data={faqData} />
                </Box>
            </AppContainer>
        </MainLayout>
    );
}