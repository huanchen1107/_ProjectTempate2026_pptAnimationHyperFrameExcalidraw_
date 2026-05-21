import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { HeartCore } from "./HeartCore";
import { CRISP_DECEL, EASE_IN_OUT_CUBIC } from "../utils/easing";

interface AnimeCharacterProps {
  gender: "boy" | "girl";
}

export const AnimeCharacter: React.FC<AnimeCharacterProps> = ({ gender }) => {
  const frame = useCurrentFrame();

  // 1. Transformation Fade-in (Scene 3: frames 135 to 180)
  const opacity = interpolate(frame, [135, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CRISP_DECEL,
  });

  if (opacity <= 0) return null;

  // 2. Slow walk closer to each other (Scene 5: frames 240 to 300)
  // Boy walks right; Girl walks left.
  const walkProgress = interpolate(frame, [240, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_CUBIC,
  });

  const basePositionX = gender === "boy" ? 440 : 1280;
  const walkOffset = gender === "boy" ? 340 * walkProgress : -320 * walkProgress;
  const currentX = basePositionX + walkOffset;

  // 3. Hair & Clothing natural sway in the wind (sinusoidal offset)
  const windSway = Math.sin(frame * 0.05 + (gender === "boy" ? 0 : 2)) * 3.5;
  const windRotation = Math.sin(frame * 0.045 + (gender === "boy" ? 1 : 3)) * 1.5;

  // Breathing effect (sine wave on Y scale/translation)
  const breathingOffsetY = Math.sin(frame * 0.06) * 1.8;

  // Parallax / Depth layer scaling
  const scale = 1.05 + Math.sin(frame * 0.005) * 0.015;

  const colorTheme = gender === "boy" ? "#FF4B6E" : "#3B82F6";

  return (
    <div
      style={{
        position: "absolute",
        left: currentX,
        top: 260 + breathingOffsetY,
        width: 320,
        height: 480,
        opacity: opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 320 480"
        width="100%"
        height="100%"
        style={{
          filter: `drop-shadow(0 0 15px rgba(${gender === "boy" ? "255,75,110,0.18" : "59,130,246,0.18"}))`,
        }}
      >
        <defs>
          <linearGradient id={`skinGrad-${gender}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF4F2" />
            <stop offset="100%" stopColor="#FFE0DB" />
          </linearGradient>

          <linearGradient id={`hairGrad-${gender}`} x1="0" y1="0" x2="0" y2="1">
            {gender === "boy" ? (
              <>
                <stop offset="0%" stopColor="#1E1E2F" />
                <stop offset="60%" stopColor="#3F3F5A" />
                <stop offset="100%" stopColor="#5D4B6E" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#0B132B" />
                <stop offset="50%" stopColor="#1C2541" />
                <stop offset="100%" stopColor="#4A6572" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* 1. Body Silhouette & Clothes (Base Layer) */}
        <g transform={`translate(${windSway * 0.4}, 0)`}>
          {/* Shoulders & Chest */}
          <path
            d={
              gender === "boy"
                ? "M 60 480 Q 90 280 160 280 Q 230 280 260 480 Z"
                : "M 80 480 Q 105 310 160 310 Q 215 310 240 480 Z"
            }
            fill="#12121E"
            stroke={colorTheme}
            strokeWidth="3.5"
            opacity="0.95"
          />
          {/* Rim light highlight on shoulders */}
          <path
            d={
              gender === "boy"
                ? "M 65 470 Q 92 285 160 285 Q 228 285 255 470"
                : "M 85 470 Q 107 315 160 315 Q 213 315 235 470"
            }
            fill="none"
            stroke={colorTheme}
            strokeWidth="2.5"
            opacity="0.8"
          />
        </g>

        {/* 2. Head & Neck */}
        <g transform={`translate(0, ${breathingOffsetY * 0.2})`}>
          {/* Neck */}
          <path d="M 140 290 L 140 220 L 180 220 L 180 290 Z" fill="url(#skinGrad-boy)" opacity="0.9" />

          {/* Jaw / Face Shape */}
          <path
            d="M 120 160 Q 120 220 160 240 Q 200 220 200 160 Z"
            fill={`url(#skinGrad-${gender})`}
            stroke={colorTheme}
            strokeWidth="3"
          />

          {/* Calm Romantic Eyes (Boy look right, Girl look left) */}
          {gender === "boy" ? (
            <g opacity="0.95" stroke={colorTheme} strokeWidth="3" fill="none">
              {/* Eyelash curves */}
              <path d="M 140 172 Q 150 167 155 174" />
              <path d="M 172 174 Q 177 167 187 172" />
              {/* Pupils glowing */}
              <ellipse cx="152" cy="178" rx="2.5" ry="4" fill="#FF4B6E" stroke="none" />
              <ellipse cx="175" cy="178" rx="2.5" ry="4" fill="#FF4B6E" stroke="none" />
            </g>
          ) : (
            <g opacity="0.95" stroke={colorTheme} strokeWidth="3.2" fill="none">
              {/* Eyelash curves */}
              <path d="M 137 172 Q 147 165 152 174" />
              <path d="M 175 174 Q 180 165 190 172" />
              {/* Pupils glowing */}
              <ellipse cx="148" cy="178" rx="2.5" ry="4" fill="#3B82F6" stroke="none" />
              <ellipse cx="171" cy="178" rx="2.5" ry="4" fill="#3B82F6" stroke="none" />
            </g>
          )}
        </g>

        {/* 3. Hair (Layered Top with Wind Sway) */}
        <g transform={`translate(${windSway}, 0) rotate(${windRotation}, 160, 120)`}>
          {gender === "boy" ? (
            /* Handsome Boy Hair Cut */
            <path
              d="M 105 150 Q 80 120 110 80 Q 140 40 180 60 Q 220 80 210 120 Q 215 150 200 160 Q 190 120 180 130 Q 160 115 150 132 Q 130 110 120 145 Z"
              fill="url(#hairGrad-boy)"
              stroke="#FF4B6E"
              strokeWidth="3.2"
            />
          ) : (
            /* Flowing Elegant Girl Long Hair */
            <path
              d="M 100 170 Q 75 110 115 70 Q 160 30 205 70 Q 245 110 220 170 Q 250 290 260 410 Q 210 400 190 350 Q 160 320 150 370 Q 120 400 95 410 Q 90 280 100 170 Z"
              fill="url(#hairGrad-girl)"
              stroke="#3B82F6"
              strokeWidth="3.5"
            />
          )}

          {/* Premium Anime Hair Highlights */}
          <path
            d={
              gender === "boy"
                ? "M 130 75 Q 160 55 180 75"
                : "M 135 65 Q 160 45 185 65"
            }
            fill="none"
            stroke={gender === "boy" ? "#FFA3B1" : "#93C5FD"}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>
      </svg>

      {/* 4. Rhythmic Breathing Heart Core in Chest */}
      <div
        style={{
          position: "absolute",
          top: 275,
          width: 80,
          height: 80,
          opacity: 0.9,
        }}
      >
        <HeartCore type={gender === "boy" ? "left" : "right"} />
      </div>
    </div>
  );
};
