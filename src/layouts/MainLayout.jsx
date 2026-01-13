import { Box } from "@chakra-ui/react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FooterWithLinks from "@/components/common/FooterWithLinks";

export default function MainLayout({ children, pages = [] }) {
  // Use enhanced footer if pages are provided, otherwise use simple footer
  const FooterComponent = pages.length > 0 ? FooterWithLinks : Footer;

  return (
    <Box>
      <Header />
      <main>{children}</main>
      <FooterComponent pages={pages} />
    </Box>
  );
}