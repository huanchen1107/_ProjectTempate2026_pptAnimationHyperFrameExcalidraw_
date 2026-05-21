import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface HeartCoreProps {
  type: "left" | "right" | "center";
}

export const HeartCore: React.FC<HeartCoreProps> = ({ type }) => {
  const frame = useCurrentFrame();

  // Rhythmic pulse breathing
  // Pulse speeds and scales vary depending on the active scene
  let pulseScale = 1;
  let pulseGlow = 20;

  if (type === "left") {
    // Red heart (Left)
    // Awaken: starts at frame 0. Pulse rhythm starts at frame 60 (Scene 2)
    const basePulse = Math.sin(frame * 0.15) * 0.08;
    const pulseTrigger = frame >= 60 ? Math.sin((frame - 60) * 0.28) * 0.15 : 0;
    pulseScale = 1 + basePulse + pulseTrigger;
    pulseGlow = 20 + (frame >= 60 ? Math.max(0, Math.sin((frame - 60) * 0.28)) * 30 : 0);
  } else if (type === "right") {
    // Blue aura heart (Right)
    // Soft delayed response starting at frame 75 (Scene 2 response)
    const basePulse = Math.sin(frame * 0.12) * 0.06;
    const pulseTrigger = frame >= 75 ? Math.sin((frame - 75) * 0.24) * 0.12 : 0;
    pulseScale = 1 + basePulse + pulseTrigger;
    pulseGlow = 18 + (frame >= 75 ? Math.max(0, Math.sin((frame - 75) * 0.24)) * 25 : 0);
  } else {
    // Combined center heart in Scene 6 (frame 300 - 360)
    const centerProgress = Math.max(0, (frame - 300) / 60);
    const beat = Math.sin((frame - 300) * 0.35) * 0.18;
    pulseScale = (1 + beat) * interpolate(centerProgress, [0, 0.9, 1], [0.8, 1.3, 15], {
      extrapolateRight: "clamp",
    });
    pulseGlow = 30 + centerProgress * 150;
  }

  // Heart color settings
  const color = type === "left" 
    ? "#FF4B6E" 
    : type === "right" 
      ? "#3B82F6" 
      : "url(#centerHeartGrad)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${pulseScale})`,
        filter: `drop-shadow(0 0 ${pulseGlow}px ${type === "center" ? "#EC4899" : color})`,
        transition: "filter 0.1s ease-out",
      }}
    >
      <svg viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="centerHeartGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF4B6E" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          
          <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor={type === "left" ? "#FF4B6E" : "#3B82F6"} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Heart Path */}
        <path
          d="M 50 85 C 50 85 20 60 20 37.5 C 20 20 35 15 50 32.5 C 65 15 80 20 80 37.5 C 80 60 50 85 50 85 Z"
          fill={color}
        />

        {/* Cinematic Highlight Aura (layered inside the heart) */}
        <circle cx="50" cy="40" r="18" fill="url(#innerGlow)" opacity="0.6" />
      </svg>
    </div>
  );
};

// Animated linking beam that connects the hearts during Scene 4-5 (frame 180 to 300)
export const HeartConnector: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 180 || frame > 300) return null;

  // Fade connector in and out
  const opacity = interpolate(frame, [180, 195, 280, 300], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flow dash array offset to simulate energy traveling
  const dashOffset = -frame * 6;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        pointerEvents: "none",
        opacity: opacity,
      }}
    >
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <filter id="beamGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF4B6E" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Double spiral energy beam connecting Left (540, 540) to Right (1380, 540) */}
        <path
          d="M 540 540 Q 750 420 960 540 T 1380 540"
          fill="none"
          stroke="url(#beamGrad)"
          strokeWidth="6"
          strokeDasharray="15, 10"
          strokeDashoffset={dashOffset}
          filter="url(#beamGlow)"
        />

        <path
          d="M 540 540 Q 750 660 960 540 T 1380 540"
          fill="none"
          stroke="url(#beamGrad)"
          strokeWidth="4"
          strokeDasharray="12, 12"
          strokeDashoffset={-dashOffset * 1.2}
          opacity="0.8"
          filter="url(#beamGlow)"
        />
      </svg>
    </div>
  );
};
