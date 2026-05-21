export const getCameraDrift = (frame: number) => {
  // Low-frequency subtle sine/cos waves to simulate organic handheld camera drift
  const x = Math.sin(frame * 0.04) * 8 + Math.cos(frame * 0.015) * 4;
  const y = Math.cos(frame * 0.035) * 6 + Math.sin(frame * 0.02) * 3;
  const rotation = Math.sin(frame * 0.025) * 0.12; // in degrees
  return { x, y, rotation };
};

export const getCameraScale = (
  frame: number,
  startFrame: number,
  endFrame: number,
  startScale: number,
  endScale: number,
  easing = (t: number) => t
) => {
  // Safe clamped scale mapping
  if (frame < startFrame) return startScale;
  if (frame > endFrame) return endScale;
  
  const progress = (frame - startFrame) / (endFrame - startFrame);
  return startScale + (endScale - startScale) * easing(progress);
};
