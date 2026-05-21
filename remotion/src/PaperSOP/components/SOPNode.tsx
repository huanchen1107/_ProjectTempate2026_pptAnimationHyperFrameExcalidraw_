import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { getPopSpring } from "../utils/PaperSOPEasing";

interface SOPNodeProps {
  letter: string;
  titleZh: string;
  titleEn: string;
  x: number;
  y: number;
  startFrame: number;
  status: "idle" | "active" | "diagnostic" | "aligned";
}

export const SOPNode: React.FC<SOPNodeProps> = ({
  letter,
  titleZh,
  titleEn,
  x,
  y,
  startFrame,
  status,
}) => {
  const frame = useCurrentFrame();

  // 1. Spring scaling pop-out animation
  const springScale = getPopSpring(frame, startFrame);

  // 2. Glow and border color styling based on diagnostic/alignment states
  let ringColor = "rgba(0, 168, 255, 0.4)";
  let fillColor = "rgba(8, 18, 45, 0.85)";
  let textColor = "#00d2ff";
  let glowColor = "rgba(0, 168, 255, 0.35)";

  if (status === "diagnostic") {
    ringColor = "rgba(0, 255, 127, 0.7)";
    textColor = "#00ff7f";
    glowColor = "rgba(0, 255, 127, 0.6)";
  } else if (status === "aligned") {
    // Red glowing link for B and C connection
    ringColor = "rgba(255, 49, 49, 1)";
    textColor = "#ff3131";
    fillColor = "rgba(25, 4, 10, 0.9)";
    glowColor = "rgba(255, 49, 49, 0.85)";
  }

  // 3. Subtle micro-breathing/floating offset using sine wave
  const breatheOffset = Math.sin(frame * 0.08 + startFrame) * 4;

  // 4. Label fade in offset slightly after node pop-out
  const labelOpacity = interpolate(
    frame - startFrame,
    [10, 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + breatheOffset,
        transform: `translate(-50%, -50%) scale(${springScale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: status === "aligned" ? 10 : 2,
      }}
    >
      {/* Dynamic Glow Outer Ring */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: `2px solid ${ringColor}`,
          backgroundColor: fillColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 25px ${glowColor}, inset 0 0 15px ${glowColor}`,
          position: "relative",
          transition: "border 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Holographic scanner sub-ring */}
        <div
          style={{
            position: "absolute",
            width: "80%",
            height: "80%",
            borderRadius: "50%",
            border: "1px dashed rgba(255, 255, 255, 0.15)",
            animation: "spin 10s linear infinite",
          }}
        />

        {/* Letter Label */}
        <span
          style={{
            fontFamily: "'Outfit', 'Inter', 'system-ui', sans-serif",
            fontWeight: 800,
            fontSize: 40,
            color: textColor,
            textShadow: `0 0 10px ${glowColor}`,
          }}
        >
          {letter}
        </span>
      </div>

      {/* Title Text labels */}
      <div
        style={{
          marginTop: 18,
          opacity: labelOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 250,
          textAlign: "center",
        }}
      >
        {/* Chinese designation */}
        <span
          style={{
            fontFamily: "'Microsoft JhengHei', 'PingFang TC', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: status === "aligned" ? "#ff4d4d" : "#ffffff",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
            letterSpacing: 1.5,
          }}
        >
          {titleZh}
        </span>

        {/* English designation */}
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            marginTop: 4,
            textTransform: "uppercase",
            letterSpacing: 1,
            lineHeight: 1.2,
          }}
        >
          {titleEn}
        </span>
      </div>
    </div>
  );
};

// --- Sequential connection line component ---
interface NodeConnectorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startFrame: number;
  endFrame: number;
  status: "idle" | "active" | "diagnostic" | "aligned";
}

export const NodeConnector: React.FC<NodeConnectorProps> = ({
  startX,
  startY,
  endX,
  endY,
  startFrame,
  endFrame,
  status,
}) => {
  const frame = useCurrentFrame();

  // Interpolate line draw-in progress
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (progress <= 0) return null;

  const dx = endX - startX;
  const dy = endY - startY;

  // Styling properties
  let strokeColor = "rgba(0, 191, 255, 0.4)";
  let strokeDash = "6, 6";
  let pulseOpacity = 0.3;

  if (status === "diagnostic") {
    strokeColor = "rgba(0, 255, 127, 0.6)";
  } else if (status === "aligned") {
    strokeColor = "rgba(255, 49, 49, 1)";
    strokeDash = "none";
    pulseOpacity = 0.8;
  }

  // Draw connector SVG path
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: status === "aligned" ? 9 : 1,
      }}
    >
      <defs>
        <linearGradient id={`grad-${startFrame}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.1} />
          <stop offset="50%" stopColor={strokeColor} stopOpacity={1} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>

      {/* Static connector line */}
      <line
        x1={startX}
        y1={startY}
        x2={startX + dx * progress}
        y2={startY + dy * progress}
        stroke={strokeColor}
        strokeWidth={status === "aligned" ? 3 : 2}
        strokeDasharray={strokeDash}
      />

      {/* Laser dash energy flow along the active path */}
      {progress > 0.01 && (
        <circle
          cx={startX + dx * ((progress + frame * 0.015) % 1)}
          cy={startY + dy * ((progress + frame * 0.015) % 1)}
          r={status === "aligned" ? 5 : 3.5}
          fill={status === "aligned" ? "#ff4d4d" : "#00fffa"}
          style={{
            filter: `drop-shadow(0 0 8px ${status === "aligned" ? "#ff0000" : "#00f0ff"})`,
            opacity: pulseOpacity,
          }}
        />
      )}
    </svg>
  );
};
