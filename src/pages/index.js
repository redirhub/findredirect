import { INDEX_PAGE } from "@/configs/constant";
import RedirectCheckPage from "./redirect";
import UptimePage from "./uptime";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchToolPagesForFooter } from "@/services/toolPageService";

const Home = ({ toolPages = [] }) => {
  switch (INDEX_PAGE) {
    case 'uptime':
      return <UptimePage toolPages={toolPages} />;
    case 'check':
    case 'redirect':
      return <RedirectCheckPage toolPages={toolPages} />;
    case 'block':
      // Block page is now managed by CMS at /block
      return <RedirectCheckPage toolPages={toolPages} />;
    default:
      return <UptimePage toolPages={toolPages} />;
  }
}

export async function getStaticProps({ locale }) {
  const toolPages = await fetchToolPagesForFooter(locale);

  return {
    props: {
        toolPages,
        ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 3600, // Revalidate every hour to pick up new tool pages
  };
}

export default Home;
