import { extendTheme } from "@chakra-ui/react";
import { themeHeading } from "@/theme/components/heading";
import { themeText } from "@/theme/components/text";
import { themeButton } from "@/theme/components/button";
import { Inter, Manrope } from "next/font/google";

const inter = Inter({
  subsets: [ "latin" ],
  variable: "--font-inter",
  fallback: [ "system-ui", "sans-serif" ],
});

const fonts = {
  heading: inter.style.fontFamily,
  body: inter.style.fontFamily,
};

const colors = {
  white: "#ffffff",
  black: "#000000",
  primary: "#042517",
  secondary: "#A97D0C",
  tertiary: "#3B3838",

  // state
  info: "#007bff",
  success: "#00F668",
  warning: "#D29A0A",
  error: "#F50A0A",

  // normal
  gray1: "#565656",
  gray2: "#BBBBBB",
  gray3: "#3B3838",

  // invert
  gray_inv1: "#FFFFFF",
  gray_inv2: "#CCCCCC",

  // text
  text_primary: "#042517",
  text_secondary: "#3B3838",
};

export default extendTheme({
  styles: {
    global: () => ({
      ":root": {},
      body: {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        fontWeight: 300,
        bg: "gray.50", // Light mode background
        color: "gray.800", // Light mode text color
        _dark: {
          bg: "gray.800", // Dark mode background
          color: "gray.200", // Dark mode text color
        },
      },
      a: {
        color: "teal.500", // Link color
        _hover: {
          textDecoration: "underline", // Link hover effect
        },
        _dark: {
          color: "teal.300", // Dark mode link color
        },
      },
      input: {
        bg: "white", // Input background
        borderColor: "gray.300", // Input border color
        _dark: {
          bg: "gray.700", // Dark mode input background
          borderColor: "gray.600", // Dark mode input border color
        },
      },
      textarea: {
        bg: "white", // Textarea background
        borderColor: "gray.300", // Textarea border color
        _dark: {
          bg: "gray.700", // Dark mode textarea background
          borderColor: "gray.600", // Dark mode textarea border color
        },
      },
    }),
  },
  fonts,
  colors,
  components: {
    Heading: themeHeading,
    Text: themeText,
    Button: themeButton,
    // Add more components here if needed
  },
});
