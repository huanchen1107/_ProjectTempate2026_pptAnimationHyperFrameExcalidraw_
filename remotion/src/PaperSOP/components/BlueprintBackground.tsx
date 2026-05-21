import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const BlueprintBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle grid pulse driven by frame
  const gridOpacity = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [0.15, 0.25]
  );

  // Holographic scan bar sweeping from top to bottom
  const scanBarY = interpolate(
    (frame % 150),
    [0, 150],
    [-100, 1180]
  );

  // Rotating background radar rings
  const radarRotation = (frame * 0.2) % 360;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030611",
        overflow: "hidden",
      }}
    >
      {/* 1. Deep sci-fi radial background gradient */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at center, #0b1535 0%, #030611 100%)",
        }}
      />

      {/* 2. Premium Engineering/Blueprint Grid Mesh */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(17, 136, 255, ${gridOpacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17, 136, 255, ${gridOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: "center center",
          opacity: 0.8,
        }}
      />

      {/* Fine-grain blueprint sub-grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(17, 136, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17, 136, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "15px 15px",
          backgroundPosition: "center center",
          opacity: 0.5,
        }}
      />

      {/* 3. Pulsing holographic circles (schematics) in background */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 800,
          height: 800,
          marginLeft: -400,
          marginTop: -400,
          border: "1px double rgba(0, 191, 255, 0.08)",
          borderRadius: "50%",
          transform: `rotate(${radarRotation}deg)`,
          pointerEvents: "none",
        }}
      >
        {/* Radar concentric ring */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: "10%",
            width: "80%",
            height: "80%",
            border: "1px dashed rgba(0, 191, 255, 0.06)",
            borderRadius: "50%",
          }}
        />
        {/* Crosshair markers */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: 1,
            height: "100%",
            background: "linear-gradient(to bottom, rgba(0, 191, 255, 0) 0%, rgba(0, 191, 255, 0.06) 50%, rgba(0, 191, 255, 0) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: "100%",
            height: 1,
            background: "linear-gradient(to right, rgba(0, 191, 255, 0) 0%, rgba(0, 191, 255, 0.06) 50%, rgba(0, 191, 255, 0) 100%)",
          }}
        />
      </div>

      {/* 4. Sweeping laser diagnostic line */}
      <div
        style={{
          position: "absolute",
          top: scanBarY,
          left: 0,
          width: "100%",
          height: 80,
          background: "linear-gradient(to bottom, transparent, rgba(0, 168, 255, 0.08) 50%, rgba(0, 240, 255, 0.15) 75%, rgba(0, 168, 255, 0.08) 90%, transparent)",
          boxShadow: "0 0 15px rgba(0, 220, 255, 0.1)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
