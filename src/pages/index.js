import { INDEX_PAGE } from "@/configs/constant";
import RedirectCheckPage from "./redirect";
import UptimePage from "./uptime";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchAllPagesForFooter, fetchPageBySlug } from "@/services/pageService";
import ToolPage from "./[tool]";

const Home = ({ homeData, pages = [] }) => {
  // If homepage exists in CMS with slug "home", use it
  if (homeData) {
    return <ToolPage toolData={homeData} pages={pages} />;
  }

  // Otherwise, fall back to INDEX_PAGE config
  switch (INDEX_PAGE) {
    case 'uptime':
      return <UptimePage pages={pages} />;
    case 'check':
    case 'redirect':
      return <RedirectCheckPage pages={pages} />;
    case 'block':
      // Block page is now managed by CMS at /block
      return <RedirectCheckPage pages={pages} />;
    default:
      return <UptimePage pages={pages} />;
  }
}

export async function getStaticProps({ locale }) {
  const pages = await fetchAllPagesForFooter(locale);
  const homeData = await fetchPageBySlug('home', locale);

  return {
    props: {
        homeData,
        pages,
        ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 3600, // Revalidate every hour to pick up new pages
  };
}

export default Home;
