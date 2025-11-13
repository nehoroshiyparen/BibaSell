import React from "react";

interface MoreIconProps {
  size?: string | number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  direction?: "down" | "up" | "left" | "right"; // новая пропса
  transitionDuration?: string; // для плавности, например "0.3s"
}

const rotationMap: Record<"down" | "up" | "left" | "right", string> = {
  down: "0deg",
  up: "180deg",
  left: "90deg",
  right: "-90deg",
};

const MoreIcon: React.FC<MoreIconProps> = ({
  size = 24,
  color = "currentColor",
  className,
  strokeWidth = 2,
  direction = "down",
  transitionDuration = "0.3s",
}) => {
  const rotation = rotationMap[direction || "down"];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: `rotate(${rotation})`,
        transition: `all ${transitionDuration} ease`,
      }}
    >
      <path
        d="M478.312 644.16c24.38 26.901 64.507 26.538 88.507-0.89l270.57-309.222c7.758-8.867 6.86-22.344-2.008-30.103-8.866-7.759-22.344-6.86-30.103 2.007L534.71 615.173c-7.202 8.231-17.541 8.325-24.782 0.335L229.14 305.674c-7.912-8.73-21.403-9.394-30.133-1.482s-9.394 21.403-1.482 30.134l280.786 309.833z"
        fill={color}
      />
    </svg>
  );
};

export default MoreIcon;