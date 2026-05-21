import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TwilightSky } from "./components/TwilightSky";
import { ParticleField } from "./components/ParticleField";
import { LoveCharacter } from "./components/LoveCharacter";
import { AnimeCharacter } from "./components/AnimeCharacter";
import { HeartConnector, HeartCore } from "./components/HeartCore";
import { getCameraDrift, getCameraScale } from "./utils/camera";
import { CRISP_DECEL, EASE_IN_OUT_CUBIC } from "./utils/easing";

export const LoveClip: React.FC = () => {
  const frame = useCurrentFrame();

  // 1. Cinematic Camera System
  const cameraDrift = getCameraDrift(frame);

  // Camera scale: slow dolly zoom across scenes
  // Scene 1-2 (0-120): slow push in from 1.0 to 1.08
  // Scene 3 (120-180): transform pull back to 0.98
  // Scene 4-5 (180-300): emotional zoom from 0.98 to 1.12
  // Scene 6 (300-360): dramatic zoom out to 0.85 before final heart explosion
  let cameraScale = 1.0;
  if (frame < 120) {
    cameraScale = getCameraScale(frame, 0, 120, 1.0, 1.08, EASE_IN_OUT_CUBIC);
  } else if (frame < 180) {
    cameraScale = getCameraScale(frame, 120, 180, 1.08, 0.98, CRISP_DECEL);
  } else if (frame < 300) {
    cameraScale = getCameraScale(frame, 180, 300, 0.98, 1.12, EASE_IN_OUT_CUBIC);
  } else {
    cameraScale = getCameraScale(frame, 300, 360, 1.12, 0.85, CRISP_DECEL);
  }

  // 2. Scene Timeline Orchestration
  // Scene 1 & 2: Show calligraphy characters (frames 0 to 160, dissolved by 160)
  const showCalligraphy = frame < 160;

  // Scene 3 & 4 & 5 & 6: Show anime boy and girl (frame 135 onwards)
  const showHumanCharacters = frame >= 135;

  // Scene 6: Combined heart (frame 300 onwards)
  const showCombinedHeart = frame >= 300;

  // 3. Final Cinematic Flash / Bloom Out (Scene 6: frames 340 to 360)
  const flashOpacity = interpolate(frame, [340, 355, 360], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#020206", overflow: "hidden" }}>
      {/* Dynamic Background Sky */}
      <TwilightSky />

      {/* Seeded Star & Stardust Particle Field */}
      <ParticleField />

      {/* Main Cinematic Camera Wrapper */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${cameraScale}) translate(${cameraDrift.x}px, ${cameraDrift.y}px) rotate(${cameraDrift.rotation}deg)`,
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* ==========================================
            SCENES 1 & 2: CALLIGRAPHY CHARACTERS (愛)
            ========================================== */}
        {showCalligraphy && (
          <>
            <LoveCharacter type="left" />
            <LoveCharacter type="right" />
          </>
        )}

        {/* ==========================================
            SCENES 3 & 4 & 5: ANIME BOY & GIRL
            ========================================== */}
        {showHumanCharacters && (
          <>
            <AnimeCharacter gender="boy" />
            <AnimeCharacter gender="girl" />
          </>
        )}

        {/* ==========================================
            SCENE 4: RESONANCE ENERGY BEAMS
            ========================================== */}
        <HeartConnector />

        {/* ==========================================
            SCENE 6: COMBINED HEART IN CENTER
            ========================================== */}
        {showCombinedHeart && (
          <div
            style={{
              position: "absolute",
              left: 960 - 75,
              top: 540 - 75,
              width: 150,
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HeartCore type="center" />
          </div>
        )}
      </div>

      {/* Atmospheric Cinematic Lighting Overlays */}
      {/* 1. Subtle vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 2. Soft overall glow/lens bloom */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 99, 132, 0.05) 0%, rgba(59, 130, 246, 0.05) 60%, rgba(0,0,0,0) 100%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* 3. Final Scene 6 Luminous Flash Whiteout */}
      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
export default LoveClip;
