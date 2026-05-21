import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { HeartCore } from "./HeartCore";
import { CRISP_DECEL, EASE_IN_OUT_CUBIC } from "../utils/easing";

interface LoveCharacterProps {
  type: "left" | "right";
}

export const LoveCharacter: React.FC<LoveCharacterProps> = ({ type }) => {
  const frame = useCurrentFrame();

  // Scene 1 (0s-2s / 0-60 frames) - Awakening breathing scale
  // Scene 2 (2s-4s / 60-120 frames) - Sync pulse
  // Scene 3 (4s-6s / 120-180 frames) - Transformation dissolution
  
  // Base breathing
  const breathe = Math.sin(frame * 0.08) * 0.03;

  // Awaken fade-in (frames 0 to 45)
  const fadeIn = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CRISP_DECEL,
  });

  // Dissolve fade-out (frames 120 to 160)
  const dissolveOpacity = interpolate(frame, [120, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_CUBIC,
  });

  // Scale during dissolve (shrink & stretch outward like a splash)
  const dissolveScale = interpolate(frame, [120, 160], [1, 1.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CRISP_DECEL,
  });

  const finalOpacity = fadeIn * dissolveOpacity;
  const finalScale = (1 + breathe) * dissolveScale;

  // Dynamic glow filters based on the frame
  const glowIntensity = interpolate(frame, [60, 120], [10, 35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const color = type === "left" ? "#FF4B6E" : "#3B82F6";

  return (
    <div
      style={{
        position: "absolute",
        left: type === "left" ? 440 : 1280, // Anchored left & right
        top: 360,
        width: 200,
        height: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: finalOpacity,
        transform: `scale(${finalScale})`,
        pointerEvents: "none",
      }}
    >
      {/* Premium SVG Calligraphy Character (愛) */}
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{
          filter: `drop-shadow(0 0 ${12 + glowIntensity}px ${color})`,
        }}
      >
        <defs>
          <filter id={`charGlow-${type}`}>
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Highly elegant stylized representation of the character '愛' (Love) */}
        <g 
          fill="none" 
          stroke={color} 
          strokeWidth="6.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter={`url(#charGlow-${type})`}
        >
          {/* Top strokes (Claw radical) */}
          <path d="M 70 40 Q 85 25 100 40" />
          <path d="M 60 55 C 60 55 75 48 90 55" />
          <path d="M 110 55 C 110 55 125 48 140 55" />
          
          {/* Middle cover roof stroke */}
          <path d="M 45 70 L 155 70 L 145 80" />
          
          {/* Heart radical in center */}
          <path d="M 75 92 C 60 102 75 120 100 105 C 125 120 140 102 125 92" />
          
          {/* Bottom leg strokes */}
          <path d="M 60 125 C 75 122 90 120 100 132" />
          <path d="M 75 145 C 55 160 40 175 35 180" />
          <path d="M 115 132 L 145 155 C 160 167 175 178 180 180" strokeWidth="8" />
          <path d="M 100 135 Q 120 150 110 170 T 80 185" />
        </g>
      </svg>

      {/* Rhythmic Inner Heart Core inside the calligraphy */}
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 50,
          width: 100,
          height: 100,
          opacity: 0.85,
        }}
      >
        <HeartCore type={type} />
      </div>
    </div>
  );
};
