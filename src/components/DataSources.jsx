import { Box, Flex, Grid, GridItem, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { AppContainer } from "./AppContainer";
import { useEffect, useState } from "react";
import axios from "axios";
import { getFluidFontSize } from "@/utils";

export default function DataSources() {
  const [dataSources, setDataSources] = useState([]);

  async function fetchDataSources() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_UPDOWN_BASE_URL}/api/nodes`);
      setDataSources(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDataSources();
  }, []);

  return (
    <>
      <Box maxW="90%" mx="auto" mt="50px" p="20px">
        <Stack>
          <Heading fontSize={getFluidFontSize(20, 26)} fontWeight="500">
            Data Sources
          </Heading>
          <Text>Performance data are tested by updown.io from {Object.keys(dataSources)?.length} locations.</Text>
        </Stack>
        <Grid mt="30px" gap="15px" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
          {Object.keys(dataSources)?.map((sourceKey) => {
            const { city, country, country_code } = dataSources[sourceKey];

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
