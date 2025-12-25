import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { normalizeTag } from "@/utils/blogHelpers";

const MotionBox = motion(Box);

export default function TagBadge({
  tag,
  onClick,
  size = "md",
  variant = "solid",
  clickable = true
}) {
  const router = useRouter();

  const sizeStyles = {
    sm: { px: 2, py: 1, fontSize: "xs" },
    md: { px: 3, py: 1.5, fontSize: "sm" },
    lg: { px: 4, py: 2, fontSize: "md" },
  };

  const variantStyles = {
    solid: {
      bg: "#7D65DB",
      color: "white",
      _hover: { bg: "#6550C0" },
    },
    outline: {
      border: "2px solid",
      borderColor: "#7D65DB",
      bg: "transparent",
      color: "#7D65DB",
      _hover: { bg: "#F5F3FF" },
    },
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent parent click handlers
    if (onClick) {
      onClick(tag);
    } else if (clickable) {
      router.push(`/blog/tag/${normalizeTag(tag)}`);
    }
  };

  return (
    <MotionBox
      as={clickable ? "button" : "span"}
      onClick={clickable ? handleClick : undefined}
      borderRadius="full"
      fontWeight="600"
      letterSpacing="0.02em"
      textTransform="lowercase"
      cursor={clickable ? "pointer" : "default"}
      transition="all 0.2s"
      whileHover={clickable ? { scale: 1.05, y: -2 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      {...sizeStyles[size]}
      {...variantStyles[variant]}
    >
      {tag}
    </MotionBox>
  );
}
