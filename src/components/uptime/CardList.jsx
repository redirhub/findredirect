import { Stack } from "@chakra-ui/react";
import CardListSkeleton from "./CardListSkeleton";
import React from "react";
import SiteCard from "./SiteCard";

const findFastestSite = (sitesData) => {
  return sitesData.reduce((fastest, current) => {
    const currentTiming = current[1].timings?.total || Infinity;
    const fastestTiming = fastest ? fastest[1].timings?.total || Infinity : Infinity;
    return currentTiming < fastestTiming ? current : fastest;
  }, null);
};

export default function CardList({ sitesData = [], isLoading = false }) {
  const fastestSite = findFastestSite(sitesData);

  return (
    <Stack spacing={4} mx="auto">
      {isLoading || sitesData?.length === 0 ? (
        <CardListSkeleton />
      ) : (
        sitesData.map((site) => (
          <SiteCard
            key={`${site[0].token}-${site[0].url}`}
            site={site}
            isFastest={site[0].token === fastestSite?.[0].token}
          />
        ))
      )}
    </Stack>
  );
}

