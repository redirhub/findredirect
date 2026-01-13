import { Box, Button, Center, Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useTranslation } from 'next-i18next';
import CardList from "@/components/uptime/CardList";
import DataSources from "@/components/uptime/DataSources";
import { styles } from "@/configs/uptime";

export default function UptimeWidget({
  children,           // Hero content from [tool].js
  services,           // REQUIRED: Comma-separated service IDs (e.g., "yy6y,ps0k,peet")
  showDataSources = "true",  // Show data sources section
  ctaUrl = "https://www.redirhub.com",  // CTA button URL
  ctaText,            // CTA button text (optional)
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [sitesData, setSitesData] = useState({ nodes: {}, sites: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse services string into array (memoized to prevent unnecessary re-renders)
  const serviceIds = useMemo(() => {
    return services
      ? services.split(',').map(s => s.trim()).filter(Boolean)
      : [];
  }, [services]);

  useEffect(() => {
    async function fetchDataSources() {
      try {
        setIsLoading(true);
        setError(null);

        // Validate services are provided
        if (serviceIds.length === 0) {
          setError(t('tool.uptime-no-services', 'No services specified for uptime monitoring.'));
          setIsLoading(false);
          return;
        }

        // API only accepts services parameter
        const params = {
          services: serviceIds.join(',')
        };

        const apiResponse = await axios.get("/api/uptime", { params });
        setSitesData(apiResponse.data.data);
      } catch (error) {
        console.error("Error fetching uptime data:", error);
        setError(t('tool.uptime-error', 'Failed to load uptime data. Please try again later.'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchDataSources();
  }, [serviceIds, t]);

  // The API now returns filtered data based on services parameter
  // This is kept as a safety fallback
  const filteredSites = useMemo(() => {
    return serviceIds.length > 0 && sitesData.sites
      ? sitesData.sites.filter(site => serviceIds.includes(site[0]?.token))
      : sitesData.sites;
  }, [serviceIds, sitesData.sites]);

  return (
    <>
      {/* Hero section passed from [tool].js */}
      {children}

      {/* Error message */}
      {error && (
        <Alert status="error" borderRadius="md" my={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Uptime comparison cards */}
      <Box my={12}>
        <CardList sitesData={filteredSites} isLoading={isLoading} />
      </Box>

      {/* Optional CTA button */}
      {ctaUrl && (
        <Center my={12}>
          <Button
            as="a"
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            {...styles.getStartedButton}
          >
            {ctaText || t('tool.get-started', 'Get started with RedirHub')}
          </Button>
        </Center>
      )}

      {/* Optional data sources section */}
      {showDataSources === "true" && (
        <DataSources sitesData={sitesData.nodes} />
      )}
    </>
  );
}
