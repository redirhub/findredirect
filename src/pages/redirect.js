import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";
import { APP_NAME, EXAMPLE_REDIRECT_URL } from "@/configs/constant";
import { FaLink } from "react-icons/fa";
import { styles } from "@/configs/checker";
import FAQSection from "@/components/common/FAQSection";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { generateHrefLangsAndCanonicalTag } from "@/utils";

export default function RedirectCheckPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { locale, asPath } = router;
    const faqData = [
        {
            "question": t('tool.redirect-faq-1', "What is a URL redirect and why is it important?"),
            "answer": t('tool.redirect-faq-1-answer', "A URL redirect sends users and search engines from one web address to another. Redirects are crucial when moving content, rebranding, or changing domains, as they ensure users reach the correct page and prevent broken links. Proper use of redirects helps maintain SEO rankings and provides a smooth user experience.")
        },
        {
            "question": t('tool.redirect-faq-2', "How do redirects affect my website's SEO?"),
            "answer": t('tool.redirect-faq-2-answer', "Redirects can influence SEO if not used correctly. 301 redirects are preferred for permanent changes because they pass most of the original page’s link equity (ranking power) to the new URL. Misusing redirects, such as creating long redirect chains, can slow down your website and negatively impact its ranking in search engine results.")
        },
        {
            "question": t('tool.redirect-faq-3', "What are 301 and 302 redirects, and when should I use them?"),
            "answer": t('tool.redirect-faq-3-answer', "301 Redirects: Permanent redirects that transfer most of the original URL’s link equity to the new URL, which is best for SEO when content has permanently moved. 302 Redirects: Temporary redirects that do not pass link equity, suitable for situations where the original page will return, such as maintenance or temporary changes. Using the correct redirect type ensures your site maintains search rankings and provides a seamless user experience.")
        },
        {
            "question": t('tool.redirect-faq-4', "What is a redirect chain, and why should it be optimized?"),
            "answer": t('tool.redirect-faq-4-answer', "A redirect chain occurs when a URL is redirected multiple times before reaching the final destination. For example, URL A redirects to URL B, which then redirects to URL C. These chains can slow down your website, affect SEO, and harm user experience. Optimizing or eliminating unnecessary redirects ensures faster page load times and better search engine rankings.")
        },
        {
            "question": t('tool.redirect-faq-5', "How can I check if my redirects are working properly?"),
            "answer": t('tool.redirect-faq-5-answer', "You can use our Bulk Redirect Checker to easily analyze if your redirects are working as intended. It provides detailed insights into the type of redirect (301, 302, etc.), how many redirects are in a chain, and the speed of each redirect. This helps you ensure your redirects are efficient and SEO-friendly.")
        },
        {
            "question": t('tool.redirect-faq-6', "Can long redirect chains negatively impact my site’s performance?"),
            "answer": t('tool.redirect-faq-6-answer', "Yes, long redirect chains can slow down your website’s performance and decrease your SEO rankings. Every additional redirect adds load time, which can frustrate users and result in search engines penalizing your site for slow performance. Use our tool to analyze and reduce these chains for optimal performance.")
        },
        {
            "question": t('tool.redirect-faq-7', "Why is it important to monitor redirects after a website migration?"),
            "answer": t('tool.redirect-faq-7-answer', "After a website migration, it’s crucial to monitor your redirects to ensure users and search engines are being directed to the correct URLs. Failing to set up proper redirects can result in broken links, lost traffic, and a drop in search engine rankings. Regularly using a redirect checker ensures everything is functioning smoothly post-migration.")
        },
        {
            "question": t('tool.redirect-faq-8', "How can I fix broken redirects on my website?"),
            "answer": t('tool.redirect-faq-8-answer', "Broken redirects occur when a URL points to a page that no longer exists or is not properly redirected. You can fix them by identifying the broken links with a redirect checker and then updating the redirects to point to the correct or most relevant page. This will restore link equity and improve both SEO and user experience.")
        },
        {
            "question": t('tool.redirect-faq-9', "How do redirects impact page speed and user experience?"),
            "answer": t('tool.redirect-faq-9-answer', "Each redirect adds a small delay in loading the final page. If you have multiple redirects (redirect chains), it can significantly slow down the page load time, leading to poor user experience. Slow-loading pages often lead to higher bounce rates and lower SEO rankings. Regularly checking and optimizing redirects is essential for maintaining fast page speeds.")
        },
        {
            "question": t('tool.redirect-faq-10', "Can I use FindRedirect.com to track both HTTP and HTTPS redirects?"),
            "answer": t('tool.redirect-faq-10-answer', "Yes, our Bulk Redirect Checker can track both HTTP and HTTPS redirects, helping you identify whether your URLs are correctly transitioning to secure protocols. Ensuring proper HTTPS redirects is vital for security, SEO, and user trust, as modern browsers and search engines prioritize HTTPS over HTTP.")
        }
    ];
    const title = `${t('tool.redirect-title', 'Bulk Redirect Checker: Analyze URL Chains & Speed Compare')} | ${APP_NAME}`;

    return (
        <MainLayout>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={t('tool.redirect-description', "Instantly check and analyze your URL redirects with our powerful tool. Uncover redirect chains, measure speed, and optimize your website's performance. Try our free redirect checker now!")}
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
                    <RedirectChecker icon={FaLink} buttonText={t('tool.redirect-check-button', 'Check Redirects')} examples={[ EXAMPLE_REDIRECT_URL, "http://google.com", "http://twitter.com" ].filter(Boolean)}>
                        <Flex direction="column" align="center" textAlign="center">
                            <Box {...styles.checkPage.heroBox}>
                                <Icon as={FaLink} {...styles.checkPage.heroIcon} />
                            </Box>
                            <Heading as="h1" {...styles.checkPage.heading}>
                                {t('tool.redirect-checker-title', 'Redirect Checker')}
                            </Heading>
                            <Text {...styles.checkPage.description}>
                                {t('tool.redirect-checker-description', 'Analyze redirect chains and performance for multiple URLs at once.')}
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