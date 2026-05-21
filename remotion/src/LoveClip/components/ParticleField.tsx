import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

interface Particle {
  id: number;
  xSeed: string;
  ySeed: string;
  sizeSeed: string;
  speedSeed: string;
  color: string;
}

export const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();
  const particleCount = 120;

  // Pre-generate deterministic seeds for particles
  const particles = useMemo(() => {
    const list: Particle[] = [];
    const colors = [
      "rgba(255, 99, 132, 0.75)",  // Soft Red
      "rgba(99, 179, 237, 0.75)",  // Soft Blue
      "rgba(179, 136, 255, 0.75)", // Romantic Purple
      "rgba(255, 255, 255, 0.85)", // Cinematic white stardust
    ];
    for (let i = 0; i < particleCount; i++) {
      const colorIndex = Math.floor(random(`color-${i}`) * colors.length);
      list.push({
        id: i,
        xSeed: `x-${i}`,
        ySeed: `y-${i}`,
        sizeSeed: `size-${i}`,
        speedSeed: `speed-${i}`,
        color: colors[colorIndex],
      });
    }
    return list;
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p) => {
        // Deterministic properties
        const xInit = random(p.xSeed) * 1920;
        const yInit = random(p.ySeed) * 1080;
        const size = 1 + random(p.sizeSeed) * 5;
        const speed = 0.5 + random(p.speedSeed) * 1.5;

        // Custom motion formulas
        // Star drift based on frame
        const yDrift = -frame * speed * 0.8;
        // Subtle horizontal wiggle to look like atmospheric dust floating
        const xWiggle = Math.sin(frame * 0.02 + random(p.xSeed) * 10) * 15;

        // Wrap around screen boundaries
        const finalX = (xInit + xWiggle + 1920) % 1920;
        const finalY = (yInit + yDrift + 1080) % 1080;

        // Pulse opacity periodically for twinkling stars
        const twinkle = 0.4 + Math.sin(frame * 0.05 + random(p.ySeed) * 20) * 0.5;

        // Gravitational swirl effect during Scenes 5-6 (frame 240 onwards)
        let swirlX = 0;
        let swirlY = 0;
        let swirlOpacity = 1;
        if (frame > 240) {
          const swirlProgress = Math.min(1, (frame - 240) / 90);
          const angle = random(p.xSeed) * Math.PI * 2 + (frame * 0.03);
          const radius = (1 - swirlProgress * 0.7) * (300 + random(p.ySeed) * 400);
          
          // Interpolate to center swirl (960, 540)
          const targetX = 960 + Math.cos(angle) * radius;
          const targetY = 540 + Math.sin(angle) * radius;

          // Blend current drift with gravity swirl
          swirlX = (targetX - finalX) * swirlProgress;
          swirlY = (targetY - finalY) * swirlProgress;
          swirlOpacity = 1 - (swirlProgress * 0.3); // Slightly fade out as they compress
        }

        const opacity = twinkle * swirlOpacity;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: finalX + swirlX,
              top: finalY + swirlY,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: opacity,
              boxShadow: size > 4 ? `0 0 10px ${p.color}` : "none",
              transform: `scale(${1 + Math.sin(frame * 0.1 + random(p.sizeSeed) * 5) * 0.2})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
