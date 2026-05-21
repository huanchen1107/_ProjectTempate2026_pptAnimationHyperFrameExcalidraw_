import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CRISP_DECEL } from "../utils/easing";

export const TwilightSky: React.FC = () => {
  const frame = useCurrentFrame();

  // Background transitions from dark starry sky to premium glowing twilight sky
  // Transition happens during Scene 3 (4s - 6s, frames 120 to 180)
  const twilightProgress = interpolate(frame, [120, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CRISP_DECEL,
  });

  // Dark sky background opacity
  const darkSkyOpacity = interpolate(twilightProgress, [0, 1], [1, 0.15]);

  // Cloud positions slow drift in wind
  const cloudOffset1 = interpolate(frame, [0, 360], [0, 120]);
  const cloudOffset2 = interpolate(frame, [0, 360], [0, -80]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Twilight Gradient Base */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, #0A0A28 0%, #1A0E3C 40%, #5B1C52 75%, #D65A62 90%, #EFA784 100%)",
        }}
      />

      {/* Volumetric Twilight Horizon Glow */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 100%, rgba(239, 167, 132, 0.45) 0%, rgba(91, 28, 82, 0) 70%)",
          mixBlendMode: "screen",
          opacity: twilightProgress,
        }}
      />

      {/* Dark Sky Overlay (covers twilight initially, fades out) */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, #020208 0%, #050512 60%, #0B0721 100%)",
          opacity: darkSkyOpacity,
        }}
      />

      {/* Horizon Silhouette Mountains/Clouds */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: -200,
          right: -200,
          height: 300,
          opacity: twilightProgress * 0.8,
          pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 2320 300" width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            {/* Soft bloom on mountains/clouds */}
            <filter id="horizonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#43184E" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1E0A27" />
            </linearGradient>
            <linearGradient id="cloudGradBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A0F3D" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#14061F" />
            </linearGradient>
          </defs>

          {/* Back Cloud Layer */}
          <path
            d={`M 0 300 L 0 210 Q 300 ${180 + Math.sin(frame * 0.02) * 10} 600 220 T 1200 ${200 + Math.cos(frame * 0.015) * 8} T 1800 230 T 2320 210 L 2320 300 Z`}
            fill="url(#cloudGradBack)"
            transform={`translate(${cloudOffset2}, 10)`}
          />

          {/* Front Cloud Layer */}
          <path
            d={`M 0 300 L 0 250 Q 400 ${220 + Math.cos(frame * 0.025) * 12} 800 240 T 1600 ${230 + Math.sin(frame * 0.02) * 10} T 2320 255 L 2320 300 Z`}
            fill="url(#cloudGrad)"
            filter="url(#horizonGlow)"
            transform={`translate(${cloudOffset1}, 0)`}
          />
        </svg>
      </div>

      {/* Atmospheric Haze/Fog Overlay */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(239, 167, 132, 0.15) 0%, rgba(91, 28, 82, 0.05) 50%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
          opacity: twilightProgress,
        }}
      />
    </AbsoluteFill>
  );
};
