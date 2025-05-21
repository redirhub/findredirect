import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import BlockChecker from "@/components/block-check/BlockChecker";
import { APP_NAME } from "@/configs/constant";
import { FaLink, FaShieldVirus } from "react-icons/fa";
import { styles } from "@/configs/checker";
import FAQSection from "@/components/common/FAQSection";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { generateHrefLangsAndCanonicalTag } from "@/utils";

export default function DomainBlockPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { locale, asPath } = router;
    const faqData = [
        {
            "question": t('tool.block-faq-1-question', "What is the Domain Block by GFW China tool?"),
            "answer": t('tool.block-faq-1-answer', "The Domain Block by GFW China tool helps users check if a specific domain is blocked by the Great Firewall of China. It provides insights into accessibility issues for users in China.")
        },
        {
            "question": t('tool.block-faq-2-question', "How does the Great Firewall of China work?"),
            "answer": t('tool.block-faq-2-answer', "The Great Firewall of China is a system of internet censorship that blocks access to certain foreign websites and slows down cross-border internet traffic. It is used to control the information available to Chinese citizens.")
        },
        {
            "question": t('tool.block-faq-3-question', "Why is it important to check if a domain is blocked?"),
            "answer": t('tool.block-faq-3-answer', "Checking if a domain is blocked is crucial for businesses and individuals who want to ensure their content is accessible to users in China. Blocked domains can lead to loss of traffic and engagement.")
        },
        {
            "question": t('tool.block-faq-4-question', "How can I use the Domain Block tool?"),
            "answer": t('tool.block-faq-4-answer', "Simply enter the domain you wish to check in the provided input field and click the 'Check Domain' button. The tool will analyze the domain's accessibility from within China.")
        },
        {
            "question": t('tool.block-faq-5-question', "What should I do if my domain is blocked?"),
            "answer": t('tool.block-faq-5-answer', "If your domain is blocked, consider using alternative domains, VPN services, or other methods to ensure your content reaches users in China.")
        },
        {
            "question": t('tool.block-faq-6-question', "Can I check multiple domains at once?"),
            "answer": t('tool.block-faq-6-answer', "Yes, our tool allows you to check multiple domains simultaneously, providing a comprehensive overview of their accessibility.")
        }
    ];
    const title = `${t('tool.block-title', 'Domain Block Checker: Verify Accessibility in China')} | ${APP_NAME}`;

    return (
        <MainLayout>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={t('tool.block-description', "Check if your domain is blocked by the Great Firewall of China. Ensure your content is accessible to users in China with our reliable tool.")}
                />
                {/* hreflangs and canonical tag */}
                {generateHrefLangsAndCanonicalTag(locale, asPath)}
            </Head>
            <AppContainer>
                <Box my={12}>
                    <BlockChecker icon={FaLink} buttonText={t('tool.block-check-button', 'Check Domain')} examples={[ "example.com", "test.com", "sample.com" ]}>
                        <Flex direction="column" align="center" textAlign="center">
                            <Box {...styles.checkPage.heroBox}>
                                <Icon as={FaShieldVirus} {...styles.checkPage.heroIcon} />
                            </Box>
                            <Heading as="h1" {...styles.checkPage.heading}>
                                {t('tool.block-checker-title', 'Domain Block Checker')}
                            </Heading>
                            <Text {...styles.checkPage.description}>
                                {t('tool.block-checker-description', 'Verify if your domain is accessible from China and avoid potential traffic loss.')}
                            </Text>
                        </Flex>
                    </BlockChecker>
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
