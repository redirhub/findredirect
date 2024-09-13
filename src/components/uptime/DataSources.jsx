import { Box, Flex, Grid, GridItem, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { getFluidFontSize } from "@/utils";

export default function DataSources({ sitesData = {} }) {
  return (
    <>
      <Box maxW="90%" mx="auto" mt="50px" p="20px">
        <Stack>
          <Heading fontSize={getFluidFontSize(20, 26)} fontWeight="500">
            Data Sources
          </Heading>
          <Text>Performance data are tested by updown.io from {Object?.keys(sitesData)?.length} locations.</Text>
        </Stack>
        <Grid mt="30px" gap="15px" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
          {Object?.keys(sitesData)?.map((sourceKey) => {
            const { city, country, country_code } = sitesData[sourceKey];

            return (
              <GridItem key={sourceKey} display="flex" gap="10px">
                <Image width="30px" src={`https://flagcdn.com/${country_code}.svg`} alt={country_code} />
                <Text>
                  {city}, {country}
                </Text>
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
