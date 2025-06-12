// src/components/landing/FloatingIcons.tsx
'use client';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  BarChart3,
  Brain,
  Database,
  GitBranch,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import type { ElementType } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

const iconComponentsList: ElementType[] = [
  Brain,
  Database,
  Users,
  BarChart3,
  Sparkles,
  Zap,
  GitBranch,
  ShieldCheck,
  Search,
  MessageSquare,
];
const numIcons = 18; // Number of icons to render, increased slightly

interface IconState {
  id: number;
  IconComponent: ElementType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  targetOpacity: number; // Target opacity after fade-in
  colorHue: number;
  rotation: number;
  rotationSpeed: number;
  initialDelay: number; // Delay before starting fade-in
  fadedIn: boolean;
}

const updateIconPosition = (
  icon: IconState,
  deltaTime: number,
  offsetWidth: number,
  offsetHeight: number,
): IconState => {
  let newX = icon.x + icon.vx * (deltaTime / 16.67);
  let newY = icon.y + icon.vy * (deltaTime / 16.67);
  const newRotation = icon.rotation + icon.rotationSpeed * (deltaTime / 16.67);
  const newColorHue = (icon.colorHue + 0.02 * (deltaTime / 16.67)) % 360;

  // Boundary wrapping
  if (newX < -icon.size) newX = offsetWidth + icon.size / 2;
  if (newX > offsetWidth + icon.size) newX = -icon.size / 2;
  if (newY < -icon.size) newY = offsetHeight + icon.size / 2;
  if (newY > offsetHeight + icon.size) newY = -icon.size / 2;

  return { ...icon, x: newX, y: newY, rotation: newRotation, colorHue: newColorHue };
};

const updateIconOpacity = (icon: IconState, deltaTime: number): Partial<IconState> => {
  let newOpacity = icon.opacity;
  let currentInitialDelay = icon.initialDelay;
  let currentFadedIn = icon.fadedIn;

  if (currentInitialDelay > 0) {
    currentInitialDelay -= deltaTime;
    if (currentInitialDelay < 0) currentInitialDelay = 0;
  } else if (!currentFadedIn) {
    newOpacity += 0.0015 * (deltaTime / 16.67);
    if (newOpacity >= icon.targetOpacity) {
      newOpacity = icon.targetOpacity;
      currentFadedIn = true;
    }
  }

  return { opacity: newOpacity, initialDelay: currentInitialDelay, fadedIn: currentFadedIn };
};

const IconElement = ({ iconData }: { iconData: IconState }) => {
  const IconToRender = iconData.IconComponent;
  return (
    <div
      key={iconData.id}
      style={{
        position: 'absolute',
        left: `${iconData.x}px`,
        top: `${iconData.y}px`,
        fontSize: `${iconData.size}px`,
        opacity: iconData.opacity,
        color: `hsla(${iconData.colorHue}, 70%, 80%, 1)`,
        textShadow: `0 0 ${iconData.size / 3}px hsla(${iconData.colorHue}, 70%, 75%, 0.8)`,
        transform: `rotate(${iconData.rotation}deg) translateZ(0)`,
        willChange: 'transform, opacity',
        transition: iconData.initialDelay > 0 || !iconData.fadedIn ? 'opacity 0.8s ease-out' : 'none',
      }}
    >
      <IconToRender style={{ display: 'block' }} strokeWidth={1.5} />
    </div>
  );
};

const useFloatingIcons = (containerRef: React.RefObject<HTMLDivElement | null>, isMobile: boolean) => {
  const [icons, setIcons] = useState<IconState[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const isInitialized = useRef(false);

  const initializeIcons = useCallback(() => {
    if (isMobile || !containerRef.current || typeof window === 'undefined' || isInitialized.current) {
      return [];
    }
    const container = containerRef.current;
    const initialIconsList: IconState[] = [];

    for (let i = 0; i < numIcons; i++) {
      initialIconsList.push({
        id: i,
        IconComponent: iconComponentsList[i % iconComponentsList.length],
        x: Math.random() * (container.offsetWidth || window.innerWidth),
        y: Math.random() * (container.offsetHeight || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 12 + 18,
        opacity: 0,
        targetOpacity: Math.random() * 0.15 + 0.15,
        colorHue: Math.random() * 360,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        initialDelay: Math.random() * 2500,
        fadedIn: false,
      });
    }
    isInitialized.current = true;
    return initialIconsList;
  }, [containerRef, isMobile]);

  useEffect(() => {
    if (containerRef.current && !isInitialized.current) {
      setIcons(initializeIcons());
    }

    const handleResize = () => {
      isInitialized.current = false;
      if (containerRef.current) {
        setIcons(initializeIcons());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef, initializeIcons]);

  useEffect(() => {
    if (icons.length === 0) return;

    let lastTimestamp = 0;
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      const container = containerRef.current;
      if (!container) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      const { offsetWidth, offsetHeight } = container;
      setIcons((prevIcons) =>
        prevIcons.map((icon) => {
          const updatedPosition = updateIconPosition(icon, deltaTime, offsetWidth, offsetHeight);
          const updatedOpacity = updateIconOpacity(icon, deltaTime);
          return { ...updatedPosition, ...updatedOpacity };
        }),
      );
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [containerRef, icons.length]);

  return icons;
};

const FloatingIcons = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const icons = useFloatingIcons(containerRef, isMobile);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      style={{
        background: 'linear-gradient(180deg, var(--color-dark-bg-primary) 0%, var(--color-brand-purple-950) 100%)',
      }}
    >
      {icons.map((iconData) => (
        <IconElement key={iconData.id} iconData={iconData} />
      ))}
    </div>
  );
};

export default FloatingIcons;
