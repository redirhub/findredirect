import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.scss";
import "nprogress/nprogress.css";
import theme from "@/theme";
import { appWithTranslation } from "next-i18next";
import nextI18nConfig from '../../next-i18next.config'
import { useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    // Configure NProgress with slower animation
    NProgress.configure({
      showSpinner: false,
      minimum: 0.3,
      easing: 'ease',
      speed: 500,
      trickleSpeed: 200
    });

    const handleStart = () => {
      NProgress.start();
    };

    const handleComplete = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default appWithTranslation(App, nextI18nConfig);
