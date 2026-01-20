import "./Sparkle.css";

type SparkleProps = {
  size?: number;
  color?: string;
  duration?: number; // в секундах
  x?: string;
  y?: string;
  className?: string;
};

const Sparkle = ({
  size = 2,
  color = "255,255,255",
  x = "0",
  y = "0",
  className = "",
}: SparkleProps) => {
  return (
    <div
      className={`sparkle-shadow rounded-full relative ${className}`}
      style={
        {
          "--sparkle-size": `${size}px`,
          "--sparkle-blur": `${size * 3}px`, // подбираешь под нужный эффект
          "--sparkle-spread": `${size}px`,
          "--sparkle-color": `${color}`,
          top: y,
          left: x,
        } as React.CSSProperties
      }
    />
  );
};

export default Sparkle;
