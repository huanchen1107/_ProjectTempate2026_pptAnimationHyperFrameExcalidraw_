import { Easing, spring } from "remotion";

export const PLAYFUL_OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);
export const CRISP_DECEL = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT_CUBIC = Easing.bezier(0.645, 0.045, 0.355, 1);

export const getPopSpring = (frame: number, startFrame: number, fps = 30) => {
  if (frame < startFrame) return 0;
  return spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 110,
      mass: 0.75,
    },
  });
};
