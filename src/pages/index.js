import { INDEX_PAGE } from "@/configs/constant";
import RedirectCheckPage from "./redirect";
import UptimePage from "./uptime";
import DomainBlockPage from "./block";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Home = () => {
  switch (INDEX_PAGE) {
    case 'uptime':
      return <UptimePage />;
    case 'check':
    case 'redirect':
      return <RedirectCheckPage />;
    case 'block':
      return <DomainBlockPage />;
    default:
      return <UptimePage />;
  }
}

export async function getStaticProps({ locale }) {
  return {
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Home;
