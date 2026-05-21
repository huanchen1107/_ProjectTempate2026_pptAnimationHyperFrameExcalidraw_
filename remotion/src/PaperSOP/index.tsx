import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { BlueprintBackground } from "./components/BlueprintBackground";
import { SOPNode, NodeConnector } from "./components/SOPNode";
import { CRISP_DECEL } from "./utils/PaperSOPEasing";

export const PaperSOP: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Dynamic Node Coordinates ---
  // Centered at Y = 540, distributed horizontally at 300px intervals
  const Y_CENTER = 540;
  const nodes = [
    { letter: "A", nameZh: "引人注意的破題", nameEn: "Attention Hook", x: 210, frame: 240 },
    { letter: "B", nameZh: "界定未解挑戰", nameEn: "Unresolved Challenge", x: 510, frame: 300 },
    { letter: "C", nameZh: "提出獨家解法", nameEn: "Exclusive Solution", x: 810, frame: 390 },
    { letter: "D", nameZh: "核心方法設計", nameEn: "Method Design", x: 1110, frame: 480 },
    { letter: "E", nameZh: "實驗評估對照", nameEn: "Experimental Eval", x: 1410, frame: 540 },
    { letter: "F", nameZh: "關鍵發現總結", nameEn: "Key Findings", x: 1710, frame: 600 },
  ];

  // --- Sequence Timing Timeline States ---
  const isDiagnostic = frame >= 660 && frame < 990;
  const isAligned = frame >= 990;

  // --- Header Slide In ---
  const headerY = interpolate(frame, [0, 45], [-120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CRISP_DECEL,
  });

  const headerOpacity = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Green Diagnostic Scanner Overlay ---
  // Horizontal sweep line from X=0 to X=1920 between frames 660 and 900
  const scanSweepX = interpolate(frame, [660, 930], [-100, 2020], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scannerOpacity = interpolate(frame, [660, 680, 930, 950], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Debugging Text Console logs (Frame 660 to 990) ---
  const consoleOpacity = interpolate(frame, [660, 680, 970, 990], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- B-to-C Precision Target alignment UI elements ---
  const targetScale = interpolate(frame, [990, 1015], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.back(1.5),
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background Audio from YouTube */}
      <Audio 
        src={staticFile("audio.webm")} 
        trimBefore={112 * fps} 
        trimAfter={149 * fps} 
      />

      {/* 1. Holographic Grid Blueprint Canvas */}
      <BlueprintBackground />

      {/* 2. Top Header Sci-fi Branding Overlay */}
      <div
        style={{
          position: "absolute",
          top: 60 + headerY,
          left: 100,
          opacity: headerOpacity,
          display: "flex",
          flexDirection: "column",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 8,
              height: 24,
              backgroundColor: isAligned ? "#ff3131" : isDiagnostic ? "#00ff7f" : "#00d2ff",
              boxShadow: `0 0 10px ${isAligned ? "#ff3131" : isDiagnostic ? "#00ff7f" : "#00d2ff"}`,
              transition: "background-color 0.4s ease",
            }}
          />
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: 24,
              color: "#ffffff",
              letterSpacing: 2,
              margin: 0,
            }}
          >
            ACADEMIC PAPER WRITING SOP
          </h1>
        </div>
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: isAligned ? "#ff4d4d" : isDiagnostic ? "#00ff7f" : "#00a8ff",
            letterSpacing: 4,
            marginTop: 6,
            textTransform: "uppercase",
            transition: "color 0.4s ease",
          }}
        >
          {isAligned
            ? "CRITICAL STAGE: B-C COGNITIVE COMPILER ALIGNMENT"
            : isDiagnostic
            ? "DIAGNOSTIC PROCESS: SCANNING LOGICAL CHAINS"
            : "MODULE 1: ABSTRACT & MOTIVATION (A to F)"}
        </h2>
      </div>

      {/* 3. Render Connector lines between sequential nodes */}
      <NodeConnector
        startX={210}
        startY={Y_CENTER}
        endX={510}
        endY={Y_CENTER}
        startFrame={270}
        endFrame={300}
        status={isAligned ? "aligned" : isDiagnostic ? "diagnostic" : frame >= 300 ? "active" : "idle"}
      />
      <NodeConnector
        startX={510}
        startY={Y_CENTER}
        endX={810}
        endY={Y_CENTER}
        startFrame={350}
        endFrame={390}
        status={isAligned ? "aligned" : isDiagnostic ? "diagnostic" : frame >= 390 ? "active" : "idle"}
      />
      <NodeConnector
        startX={810}
        startY={Y_CENTER}
        endX={1110}
        endY={Y_CENTER}
        startFrame={440}
        endFrame={480}
        status={isDiagnostic ? "diagnostic" : frame >= 480 ? "active" : "idle"}
      />
      <NodeConnector
        startX={1110}
        startY={Y_CENTER}
        endX={1410}
        endY={Y_CENTER}
        startFrame={510}
        endFrame={540}
        status={isDiagnostic ? "diagnostic" : frame >= 540 ? "active" : "idle"}
      />
      <NodeConnector
        startX={1410}
        startY={Y_CENTER}
        endX={1710}
        endY={Y_CENTER}
        startFrame={570}
        endFrame={600}
        status={isDiagnostic ? "diagnostic" : frame >= 600 ? "active" : "idle"}
      />

      {/* 4. Render A-F Nodes with state mapping */}
      {nodes.map((node) => {
        let nodeStatus: "idle" | "active" | "diagnostic" | "aligned" = "idle";
        
        if (isAligned && (node.letter === "B" || node.letter === "C")) {
          nodeStatus = "aligned";
        } else if (isDiagnostic) {
          nodeStatus = "diagnostic";
        } else if (frame >= node.frame) {
          nodeStatus = "active";
        }

        return (
          <SOPNode
            key={node.letter}
            letter={node.letter}
            titleZh={node.nameZh}
            titleEn={node.nameEn}
            x={node.x}
            y={Y_CENTER}
            startFrame={node.frame}
            status={nodeStatus}
          />
        );
      })}

      {/* ========================================================
          DIAGNOSTIC SCANNER SWEEP SCREEN OVERLAY (660 to 990)
          ======================================================== */}
      {frame >= 660 && frame < 990 && (
        <>
          {/* Neon green vertical scanner sweep bar */}
          <div
            style={{
              position: "absolute",
              left: scanSweepX,
              top: 0,
              width: 120,
              height: "100%",
              opacity: scannerOpacity,
              background: "linear-gradient(to right, transparent, rgba(0, 255, 127, 0.08) 30%, rgba(0, 255, 127, 0.3) 70%, rgba(0, 255, 127, 0.45) 85%, rgba(0, 255, 127, 0.8) 95%, #ffffff 100%)",
              boxShadow: "0 0 40px rgba(0, 255, 127, 0.4)",
              pointerEvents: "none",
              zIndex: 8,
            }}
          />

          {/* Diagnostic Console Log Terminal UI */}
          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 100,
              width: 480,
              height: 120,
              backgroundColor: "rgba(3, 8, 20, 0.85)",
              border: "1px solid rgba(0, 255, 127, 0.35)",
              borderRadius: 6,
              boxShadow: "0 0 20px rgba(0, 255, 127, 0.15)",
              padding: "16px 20px",
              fontFamily: "'Courier New', Courier, monospace",
              color: "#00ff7f",
              fontSize: 11,
              lineHeight: 1.6,
              opacity: consoleOpacity,
              zIndex: 5,
            }}
          >
            <div>&gt; INITIALIZING FULL PIPELINE SECURITY SCAN...</div>
            <div>&gt; SCANNING LOGICAL TRANSITIONS [A -&gt; B -&gt; C -&gt; D -&gt; E -&gt; F]</div>
            <div>
              &gt; STATUS: {frame < 750 ? "COMPILING INDEX..." : frame < 850 ? "MAPPING SEMANTICS: OK" : "0 LOGIC DISCONNECTED - SYSTEM GREEN"}
            </div>
            <div style={{ color: "#ffffff", fontWeight: "bold", marginTop: 4 }}>
              &gt; PROGRESS: {Math.min(100, Math.floor(((frame - 660) / 270) * 100))}% COMPLETED.
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          PRECISION TARGET ALIGNMENT OVERLAYS (990 to 1110)
          ======================================================= */}
      {isAligned && (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 7 }}>
          {/* Target marker around Node B */}
          <div
            style={{
              position: "absolute",
              left: 510,
              top: Y_CENTER - 1,
              width: 140,
              height: 140,
              border: "1px dashed #ff3131",
              borderRadius: "50%",
              transform: `translate(-50%, -50%) scale(${targetScale}) rotate(${frame}deg)`,
              boxShadow: "0 0 20px rgba(255, 49, 49, 0.2)",
            }}
          />

          {/* Target marker around Node C */}
          <div
            style={{
              position: "absolute",
              left: 810,
              top: Y_CENTER - 1,
              width: 140,
              height: 140,
              border: "1px dashed #ff3131",
              borderRadius: "50%",
              transform: `translate(-50%, -50%) scale(${targetScale}) rotate(${-frame}deg)`,
              boxShadow: "0 0 20px rgba(255, 49, 49, 0.2)",
            }}
          />

          {/* Target alignment subtext logs */}
          <div
            style={{
              position: "absolute",
              left: 510,
              top: Y_CENTER + 130,
              transform: `translateX(-50%) scale(${targetScale})`,
              fontFamily: "'Courier New', Courier, monospace",
              color: "#ff4d4d",
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
              textShadow: "0 0 10px rgba(255, 49, 49, 0.8)",
            }}
          >
            [B: CHALLENGE IDENTIFIED]
          </div>

          <div
            style={{
              position: "absolute",
              left: 810,
              top: Y_CENTER + 130,
              transform: `translateX(-50%) scale(${targetScale})`,
              fontFamily: "'Courier New', Courier, monospace",
              color: "#ff4d4d",
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
              textShadow: "0 0 10px rgba(255, 49, 49, 0.8)",
            }}
          >
            [C: SOLUTION 100% ALIGNED]
          </div>

          {/* Large diagnostic check console */}
          <div
            style={{
              position: "absolute",
              bottom: 60,
              right: 100,
              width: 480,
              backgroundColor: "rgba(25, 4, 10, 0.9)",
              border: "1px solid rgba(255, 49, 49, 0.7)",
              borderRadius: 6,
              boxShadow: "0 0 30px rgba(255, 49, 49, 0.25)",
              padding: "16px 20px",
              fontFamily: "'Courier New', Courier, monospace",
              color: "#ff3131",
              fontSize: 11,
              lineHeight: 1.6,
              transform: `scale(${targetScale})`,
              transformOrigin: "bottom right",
            }}
          >
            <div style={{ color: "#ffffff", fontWeight: "bold" }}>&gt;&gt;&gt; CRITICAL LOGIC ALIGNMENT VERIFIED:</div>
            <div>&gt; INITIATED TARGET MATCH: CHALLENGE B &lt;==&gt; SOLUTION C</div>
            <div>&gt; CRITERIA CHECK: INNOVATIVE, INTERESTING, IMPORTANT</div>
            <div style={{ color: "#00ff7f", fontWeight: "bold", marginTop: 4 }}>
              &gt; ALIGNMENT STATUS: PERFECT (0 DISCREPANCIES)
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Ambient Lens Vignette Layer */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(3, 6, 17, 0.6) 100%)",
          pointerEvents: "none",
          zIndex: 11,
        }}
      />
    </AbsoluteFill>
  );
};
export default PaperSOP;
