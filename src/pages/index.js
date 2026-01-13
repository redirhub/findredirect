import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchAllPagesForFooter, fetchPageBySlug } from "@/services/pageService";
import ToolPage from "./[tool]";

const Home = ({ homeData, pages = [] }) => {
  // If homepage exists in CMS with slug "home", use it
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
