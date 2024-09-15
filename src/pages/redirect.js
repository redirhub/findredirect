import { useState, useMemo } from "react";
import Head from "next/head";
import { Box, Flex, Heading, Icon, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, Grid, GridItem, VStack, Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";
import { APP_NAME } from "@/configs/constant";
import { FaLink } from "react-icons/fa";
import { styles } from "@/configs/checker";
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import FAQSection from "@/components/redirect-check/FAQSection";

export default function RedirectCheckPage() {

    const faqData = [
        {
            question: "What are the different between 301, 302, 307, and 308 redirects?",
            answer: "There are several redirect status codes, each with different implications for SEO: 301 (permanent redirect) is best for SEO as it passes most link equity; 302 (temporary redirect) is less ideal as it passes less link equity; 307 (temporary redirect) and 308 (permanent redirect) are newer alternatives to 302 and 301 respectively. Our redirect checker identifies these status codes, helping you ensure you're using the most SEO-friendly redirects for your site."
        },
        {
            question: "What is a redirect checker and why is it important for SEO?",
            answer: "A redirect checker is a tool that analyzes URL redirects, showing you the full chain of redirects and measuring the speed of each step. It's crucial for SEO as it helps identify issues that could impact your site's performance and search engine rankings."
        },
        {
            question: "How can a bulk redirect check benefit my website's SEO?",
            answer: "A bulk redirect check allows you to analyze multiple URLs simultaneously, saving time and helping you identify widespread redirect issues across your website. This can significantly improve your site's overall SEO performance by ensuring all pages are accessible and load quickly."
        },
        {
            question: "What is a redirect chain and how does it affect SEO?",
            answer: "A redirect chain occurs when there are multiple redirects between the initial URL and the final destination. Long redirect chains can negatively impact SEO by slowing down page load times and potentially losing link equity. Our redirect checker helps you identify and fix these chains."
        },
        {
            question: "How does redirect analysis contribute to better SEO practices?",
            answer: "Redirect analysis helps you understand how your site's URL structure impacts user experience and search engine crawling. By identifying unnecessary redirects or broken redirect paths, you can streamline your site architecture and improve your SEO performance."
        },
        {
            question: "Why is redirect speed important for SEO, and how can I check it?",
            answer: "Redirect speed is crucial for SEO because faster redirects lead to better user experience and improved page load times, which are important ranking factors. Our redirect checker tool measures the speed of each redirect in the chain, helping you optimize for performance."
        },
        {
            question: "How often should I perform a bulk redirect check for SEO purposes?",
            answer: "It's recommended to perform a bulk redirect check at least monthly, or after any significant changes to your website structure. Regular checks help maintain optimal SEO performance and catch any redirect issues early."
        },
        {
            question: "Can redirect chains impact my website's crawl budget?",
            answer: "Yes, long or complex redirect chains can waste your site's crawl budget. Our redirect checker helps you identify these issues so you can optimize your site structure and ensure search engines can efficiently crawl your important pages."
        },
        {
            question: "What SEO benefits can I gain from using a bulk redirect checker?",
            answer: "Using a bulk redirect checker can help improve your site's overall health by identifying redirect loops, reducing redirect chains, and optimizing redirect speed. This can lead to better crawlability, improved page load times, and potentially higher search engine rankings."
        },
        {
            question: "How can I use the results from a redirect check to improve my SEO strategy?",
            answer: "The results from our redirect checker can guide your SEO strategy by highlighting areas for improvement in your site's URL structure. Use the data to fix broken redirects, shorten redirect chains, and ensure all important pages are easily accessible, thus enhancing your site's SEO performance."
        }
    ];

    return (
        <MainLayout>
            <Head>
                <title>Bulk Redirect Checker: Analyze URL Chains & Speed Compare | {APP_NAME}</title>
                <meta
                    name="description"
                    content="Instantly check and analyze your URL redirects with our powerful tool. Uncover redirect chains, measure speed, and optimize your website's performance. Try our free redirect checker now!"
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
                    <RedirectChecker>
                        <Flex direction="column" align="center" textAlign="center">
                            <Box {...styles.checkPage.heroBox}>
                                <Icon as={FaLink} {...styles.checkPage.heroIcon} />
                            </Box>
                            <Heading as="h1" {...styles.checkPage.heading}>
                                Redirect Checker
                            </Heading>
                            <Text {...styles.checkPage.description}>
                                Analyze redirect chains and performance for multiple URLs at once.
                            </Text>
                        </Flex>
                    </RedirectChecker>
                    <FAQSection data={faqData} />
                </Box>
            </AppContainer>
        </MainLayout>
    );
}