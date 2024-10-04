import { HStack, Icon, Stack, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { getFluidFontSize } from "@/utils";
import { FiCheck, FiZap } from "react-icons/fi";
import { styles } from "@/configs/uptime";
import React from "react";
import { FaBicycle, FaCar } from "react-icons/fa";
import { GiTurtle } from "react-icons/gi";
import { useTranslation } from 'next-i18next';

export default function SiteStats({ uptime, timings, token }) {
  const { t } = useTranslation();
  const responseTime = timings?.total || 0;
  const { icon, color } = getResponseIcon(responseTime);

  return (
    <HStack spacing={{ base: 2, md: 4 }} justifyContent={{ base: "space-between", md: "flex-end" }} flexWrap="wrap" width="100%">
      <StatItem 
        label={t('tool.uptime', 'Uptime')} 
        value={`${uptime}%`} 
        icon={<Icon as={FiCheck} color="green.500" boxSize={{ base: 6, md: 8 }} />} 
      />
      <StatItem 
        label={t('tool.response', 'Response')} 
        value={`${responseTime}ms`} 
        icon={<Icon as={icon} color={color} boxSize={{ base: 6, md: 8 }} />}
      />
    </HStack>
  );
};

const getResponseIcon = (responseTime) => {
  if (responseTime <= 150) {
    return { icon: FiZap, color: "green.500" };
  } else if (responseTime <= 300) {
    return { icon: FaCar, color: "blue.500" };
  } else if (responseTime <= 500) {
    return { icon: FaBicycle, color: "orange.500" };
  } else {
    return { icon: GiTurtle, color: "red.500" };
  }
};

const StatItem = ({ label, value, icon }) => (
  <Tooltip label={label} placement="top">
    <Stack {...styles.statItem} minWidth={{ base: "auto", md: "120px", lg: "180px" }} p={{ base: 2, md: 4 }}>
      {React.cloneElement(icon, { size: { base: 24, md: 32 } })}
      <Text fontWeight="bold" fontSize={{ base: "lg", md: getFluidFontSize(22, 26) }}>
        {value}
      </Text>
      <Text color="gray.500" fontSize={{ base: "xs", md: getFluidFontSize(14, 16) }}>
        {label}
      </Text>
    </Stack>
  </Tooltip>
);
