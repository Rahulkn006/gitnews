import { useState, useEffect } from "react";
import Lottie from "lottie-react";

export interface LottieAnimationProps {
  animationData: any; // The JSON object imported for Lottie
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className = "",
  width = "100%",
  height = "100%",
}: LottieAnimationProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Placeholder to maintain layout before hydration
    return (
      <div 
        className={`animate-pulse bg-stone-200 dark:bg-stone-800 rounded-lg ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
