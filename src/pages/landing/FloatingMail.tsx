import React, { useEffect, useRef } from "react";

export interface FloatingMailProps {
  id: string;
  topPercent: number;
  leftPercent: number;
  delay: number;
  onFinish: (id: string) => void;
}

export const FloatingMail: React.FC<FloatingMailProps> = ({
  id,
  topPercent,
  leftPercent,
  delay,
  onFinish,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleAnimationEnd = () => onFinish(id);
    node.addEventListener("animationend", handleAnimationEnd);
    return () => node.removeEventListener("animationend", handleAnimationEnd);
  }, [id, onFinish]);

  const duration = 10;
  const driftX = "15vw";
  const driftY = "-15vh";

  return (
    <div
      ref={ref}
      className="floatingMail"
      style={
        {
          top: `${topPercent}%`,
          left: `${leftPercent}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          "--driftX": driftX,
          "--driftY": driftY,
        } as React.CSSProperties
      }
    >
      <img
        src="/images/email_placeholder.png"
        alt="Floating Mail"
        width={32}
        height={32}
        style={{ opacity: 0.8 }}
      />
    </div>
  );
};
