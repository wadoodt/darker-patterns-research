// src/components/landing/FloatingIcons.tsx
'use client';
import type { ElementType } from 'react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
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
} from 'lucide-react';

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

const FloatingIcons = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [icons, setIcons] = useState<IconState[]>([]);
  const animationFrameId = useRef<number>();
  const isInitialized = useRef(false); // To ensure initialization runs once

  const initializeIcons = useCallback(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined' || isInitialized.current) return [];

    const initialIconsList: IconState[] = [];
    for (let i = 0; i < numIcons; i++) {
      const IconComp = iconComponentsList[i % iconComponentsList.length];
      initialIconsList.push({
        id: i,
        IconComponent: IconComp,
        x: Math.random() * (container.offsetWidth || window.innerWidth),
        y: Math.random() * (container.offsetHeight || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.2, // Reduced velocity slightly
        vy: (Math.random() - 0.5) * 0.2, // Reduced velocity slightly
        size: Math.random() * 12 + 18, // Size range: 18px to 30px
        opacity: 0, // Start fully transparent
        targetOpacity: Math.random() * 0.08 + 0.07, // Target opacity range: 0.07 - 0.15 (very subtle)
        colorHue: Math.random() * 360,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.03, // Reduced rotation speed
        initialDelay: Math.random() * 2500, // Staggered fade-in up to 2.5s
        fadedIn: false,
      });
    }
    isInitialized.current = true; // Mark as initialized
    return initialIconsList;
  }, []);

  useEffect(() => {
    if (containerRef.current && !isInitialized.current) {
      setIcons(initializeIcons());
    }

    const handleResize = () => {
      isInitialized.current = false; // Re-initialize on resize
      if (containerRef.current) {
        setIcons(initializeIcons());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeIcons]);

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
          let newX = icon.x + icon.vx * (deltaTime / 16.67); // Normalize speed based on typical frame time
          let newY = icon.y + icon.vy * (deltaTime / 16.67);
          const newRotation = icon.rotation + icon.rotationSpeed * (deltaTime / 16.67);
          const newColorHue = (icon.colorHue + 0.02 * (deltaTime / 16.67)) % 360; // Slower color shift

          let newOpacity = icon.opacity;
          let currentInitialDelay = icon.initialDelay;
          let currentFadedIn = icon.fadedIn;

          if (currentInitialDelay > 0) {
            currentInitialDelay -= deltaTime;
            if (currentInitialDelay < 0) currentInitialDelay = 0;
          } else if (!currentFadedIn) {
            newOpacity += 0.0015 * (deltaTime / 16.67); // Slower fade-in
            if (newOpacity >= icon.targetOpacity) {
              newOpacity = icon.targetOpacity;
              currentFadedIn = true;
            }
          }

          // Boundary wrapping
          if (newX < -icon.size) newX = offsetWidth + icon.size / 2;
          if (newX > offsetWidth + icon.size) newX = -icon.size / 2;
          if (newY < -icon.size) newY = offsetHeight + icon.size / 2;
          if (newY > offsetHeight + icon.size) newY = -icon.size / 2;

          return {
            ...icon,
            x: newX,
            y: newY,
            opacity: newOpacity,
            colorHue: newColorHue,
            rotation: newRotation,
            initialDelay: currentInitialDelay,
            fadedIn: currentFadedIn,
          };
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
  }, [icons.length]); // Only re-run if icons array itself changes (on init)

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {icons.map((iconData) => {
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
              color: `hsla(${iconData.colorHue}, 60%, 75%, ${Math.min(iconData.opacity + 0.1, 0.8)})`, // Adjusted base opacity in hsla
              textShadow: `0 0 ${iconData.size / 6}px hsla(${iconData.colorHue}, 70%, 70%, 0.5)`, // More subtle shadow
              transform: `rotate(${iconData.rotation}deg) translateZ(0)`,
              willChange: 'transform, opacity',
              transition: iconData.initialDelay > 0 || !iconData.fadedIn ? 'opacity 0.8s ease-out' : 'none',
            }}
          >
            <IconToRender style={{ display: 'block' }} strokeWidth={1.5} /> {/* Thinner stroke for subtlety */}
          </div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;
