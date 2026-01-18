import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchAllPagesForFooter, fetchPageBySlug } from "@/services/pageService";

import MainLayout from "@/layouts/MainLayout";
import { Box, Heading } from "@chakra-ui/react";
import ToolPage from "./[tool]";
import { AppContainer } from '@/components/common/AppContainer';

const Home = ({ homeData, pages = [] }) => {
  // If homepage exists in CMS with slug "home", use it
  const isDev = process.env.NODE_ENV === 'development';

  // return (
  //   <MainLayout pages={pages}>
  //     <AppContainer>
  //       <Box textAlign="center" py={20}>
  //         <Heading size="2xl">Development Mode</Heading>
  //       </Box>
  //     </AppContainer>
  //   </MainLayout>
  // );

  if (homeData) {
    return <ToolPage toolData={homeData} pages={pages} />;
  }
}

export async function getStaticProps({ locale }) {
  const pages = await fetchAllPagesForFooter(locale);
  const homeData = await fetchPageBySlug('home', locale);

  return {
    props: {
      homeData,
      pages,
      ...(await serverSideTranslations(locale, [ 'common' ])),
    },
    revalidate: 3600, // Revalidate every hour to pick up new pages
  };
}

export default Home;
