import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import { APP_NAME, EXAMPLE_EXPANDER_URL } from "@/configs/constant";
import { FaLink } from "react-icons/fa";
import { styles } from "@/configs/checker";
import FAQSection from "@/components/common/FAQSection";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { generateHrefLangsAndCanonicalTag } from "@/utils";

export default function ShortURLExpanderPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { locale, asPath } = router;
    const faqData = [
        {
            "question": t('tool.expander-faq-1-question', "What is a short URL expander?"),
            "answer": t('tool.expander-faq-1-answer', "A short URL expander is a tool that reveals the original long URL behind a shortened link. It helps users know where a shortened link will take them before clicking, ensuring safety and transparency.")
        },
        {
            "question": t('tool.expander-faq-2-question', "Why should I expand short URLs before clicking them?"),
            "answer": t('tool.expander-faq-2-answer', "Expanding short URLs helps you avoid potentially harmful or malicious websites. Many phishing attacks or unsafe links are hidden behind shortened URLs. Using a short URL expander ensures you're aware of the destination before visiting the link.")
        },
        {
            "question": t('tool.expander-faq-3-question', "How does the short URL expander work?"),
            "answer": t('tool.expander-faq-3-answer', "The short URL expander sends a request to the shortened URL and retrieves the original, full URL. This process allows you to see where the link is redirecting without actually visiting the page, keeping you safe from potentially harmful sites.")
        },
        {
            "question": t('tool.expander-faq-4-question', "Is expanding short URLs safe?"),
            "answer": t('tool.expander-faq-4-answer', "Yes, expanding short URLs is safe because the tool does not take you to the actual website; it only shows the original URL. This process ensures that you don't accidentally visit malicious sites or harmful content.")
        },
        {
            "question": t('tool.expander-faq-5-question', "Can a short URL expander reveal multiple redirects?"),
            "answer": t('tool.expander-faq-5-answer', "Yes, some short URLs may have multiple redirects in place. Our short URL expander will show you the full redirect chain, giving you a clear understanding of where the link will ultimately take you.")
        },
        {
            "question": t('tool.expander-faq-6-question', "Can I expand short URLs in bulk?"),
            "answer": t('tool.expander-faq-6-answer', "Yes, our tool allows you to expand short URLs in bulk, making it easy to analyze multiple shortened links at once. This is especially useful for businesses or users managing large numbers of short links.")
        },
        {
            "question": t('tool.expander-faq-7-question', "Are all shortened URLs safe to click on after expanding?"),
            "answer": t('tool.expander-faq-7-answer', "Expanding a shortened URL will reveal its destination, but it doesn't guarantee that the final site is safe. Always use caution when clicking on unknown links, and consider using a URL checker or security tool to further verify the site’s safety.")
        },
        {
            "question": t('tool.expander-faq-8-question', "Can the short URL expander detect affiliate links?"),
            "answer": t('tool.expander-faq-8-answer', "Yes, our short URL expander can often detect affiliate links by revealing the original URL, including any referral or tracking parameters. This is helpful for users who want to know if they are being redirected to an affiliate program.")
        },
        {
            "question": t('tool.expander-faq-9-question', "What types of short URL services does this tool support?"),
            "answer": t('tool.expander-faq-9-answer', "Our short URL expander supports a wide range of shortening services such as Bitly, TinyURL, Ow.ly, and many others. It can expand URLs from most popular short link services and even custom short domains.")
        },
        {
            "question": t('tool.expander-faq-10-question', "Can expanding short URLs affect my SEO?"),
            "answer": t('tool.expander-faq-10-answer', "Expanding short URLs is purely informational and does not impact your SEO. However, if you're managing a website or campaign, analyzing expanded URLs can help you ensure that redirects are working properly, which can indirectly influence SEO.")
        }
    ];
    const title = `${t('tool.expander-title', 'Bulk Short URL Expander: Reveal Full Links Instantly')} | ${APP_NAME}`;

    return (
        <MainLayout>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={t('tool.expander-description', "Instantly expand shortened URLs to reveal their full destination. Enhance your online safety and transparency with our free Short URL Expander tool. Try it now!")}
                />
                {/* hreflangs and canonical tag */}
                {generateHrefLangsAndCanonicalTag(locale, asPath)}
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
                    <RedirectChecker icon={FaLink} buttonText={t('tool.expander-button', 'Expand Short URLs')} examples={[ EXAMPLE_EXPANDER_URL, "http://bit.ly/try", "https://rbnd.ly/booked" ].filter(Boolean)}>
                        <Flex direction="column" align="center" textAlign="center">
                            <Box {...styles.checkPage.heroBox}>
                                <Icon as={FaLink} {...styles.checkPage.heroIcon} />
                            </Box>
                            <Heading as="h1" {...styles.checkPage.heading}>
                                {t('tool.expander-checker-title', 'Short URL Expander')}
                            </Heading>
                            <Text {...styles.checkPage.description}>
                                {t('tool.expander-checker-description', 'Reveal the full destination of shortened URLs instantly.')}
                            </Text>
                        </Flex>
                    </RedirectChecker>
                    <FAQSection data={faqData} />
                </Box>
            </AppContainer>
        </MainLayout>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}