import { HStack, Icon, Stack, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { getFluidFontSize } from "@/utils";
import { FiCheck, FiZap } from "react-icons/fi";
import { styles } from "@/configs/uptime";
import React from "react";
import { FaBicycle, FaCar } from "react-icons/fa";
import { GiTurtle } from "react-icons/gi";

export default function SiteStats({ uptime, timings, token }) {
  const responseTime = timings?.total || 0;
  const { icon, color } = getResponseIcon(responseTime);

  return (
    <HStack spacing={4} justifyContent="flex-end" flexWrap="wrap">
      <StatItem 
        label="Uptime" 
        value={`${uptime}%`} 
        icon={<Icon as={FiCheck} color="green.500" boxSize={8} />} 
      />
      <StatItem 
        label="Response" 
        value={`${responseTime}ms`} 
        icon={<Icon as={icon} color={color} boxSize={8} />}
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
    <Stack {...styles.statItem}>
      {React.cloneElement(icon, { size: 32 })} {/* Increased icon size */}
      <Text fontWeight="bold" fontSize={getFluidFontSize(22, 26)}> {/* Increased font size */}
        {value}
      </Text>
      <Text color="gray.500" fontSize={getFluidFontSize(14, 16)}> {/* Slightly increased label font size */}
        {label}
      </Text>
    </Stack>
  </Tooltip>
);
