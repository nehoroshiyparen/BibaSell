import React from "react";

type Direction = "up" | "down" | "left" | "right";

interface ArrowIconProps {
  direction?: Direction;
  size?: number | string;
  color?: string;
  className?: string;
  length?: number | string; // Новая опция - длина стрелки
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
  color = "currentColor",
  className,
  length = 40, // Длина стрелки по умолчанию
}) => {
  // Рассчитываем размеры viewBox в зависимости от направления и длины
  const getViewBox = () => {
    const lengthNum = typeof length === "string" ? parseInt(length) : length;
    
    if (direction === "left" || direction === "right") {
      return `0 0 ${lengthNum + 24} ${size}`; // width = длина + отступ для стрелки, height = 24
    } else {
      return `0 0 ${size} ${lengthNum + 24}`; // height = длина + отступ для стрелки, width = 24
    }
  };

  // Рассчитываем координаты в зависимости от направления
  const getCoordinates = () => {
    const lengthNum = typeof length === "string" ? parseInt(length) : length;
    
    switch (direction) {
      case "right":
        return {
          polylinePoints: `${lengthNum} 12 ${lengthNum + 8} 4 ${lengthNum + 8} 20 ${lengthNum} 12`,
          line: { x1: "0", y1: "12", x2: lengthNum, y2: "12" }
        };
      case "left":
        return {
          polylinePoints: `8 4 0 12 8 20`,
          line: { x1: "8", y1: "12", x2: lengthNum + 8, y2: "12" }
        };
      case "down":
        return {
          polylinePoints: `12 ${lengthNum} 4 ${lengthNum + 8} 20 ${lengthNum + 8} 12 ${lengthNum}`,
          line: { x1: "12", y1: "0", x2: "12", y2: lengthNum }
        };
      case "up":
        return {
          polylinePoints: `12 8 4 0 20 0 12 8`,
          line: { x1: "12", y1: "8", x2: "12", y2: lengthNum + 8 }
        };
      default:
        return {
          polylinePoints: `${lengthNum} 12 ${lengthNum + 8} 4 ${lengthNum + 8} 20 ${lengthNum} 12`,
          line: { x1: "0", y1: "12", x2: lengthNum, y2: "12" }
        };
    }
  };

  const coordinates = getCoordinates();

  return (
    <svg
      width={size}
      height={size}
      viewBox={getViewBox()}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotationMap[direction]}deg)` }}
      className={className}
    >
      <polyline
        points={coordinates.polylinePoints}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1={coordinates.line.x1}
        y1={coordinates.line.y1}
        x2={coordinates.line.x2}
        y2={coordinates.line.y2}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ArrowIcon;