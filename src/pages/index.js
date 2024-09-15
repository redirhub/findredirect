import { INDEX_PAGE } from "@/configs/constant";
import RedirectCheckPage from "./redirect";
import UptimePage from "./uptime";

export default function Home() {
  switch (INDEX_PAGE) {
    case 'uptime':
      return <UptimePage />;
    case 'check':
      return <RedirectCheckPage />;
    case 'redirect':
      return <RedirectCheckPage />;
    default:
      return <UptimePage />;
  }
}