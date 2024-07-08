import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
