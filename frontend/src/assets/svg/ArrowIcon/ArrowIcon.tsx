import React from "react";

type Direction = "up" | "down" | "left" | "right";

interface ArrowIconProps {
  direction?: Direction;
  size?: number | string;
  color?: string;
  className?: string;
}

const rotationMap: Record<Direction, number> = {
  up: 270,
  right: 0,
  down: 90,
  left: 180,
};

const ArrowIcon: React.FC<ArrowIconProps> = ({
  direction = "right",
  size = 24,
  color = "black",
  className
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotationMap[direction]}deg)` }}
      className={className}
    >
      <polyline
        points="44 40 52 32 44 24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="52"
        y1="32"
        x2="12"
        y2="32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ArrowIcon;