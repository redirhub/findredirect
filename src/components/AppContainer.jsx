import {Box, Image} from "@chakra-ui/react";

export function AppContainer({ children, ...rest }) {
  return (
    <Box className="app-container" maxWidth="1140px" mx="auto" px="15px" {...rest}>
      {children}
    </Box>
  );
}
