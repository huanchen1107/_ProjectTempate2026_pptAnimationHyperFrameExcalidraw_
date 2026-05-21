import { Easing } from "remotion";

export const EASE_IN_OUT_CUBIC = Easing.bezier(0.645, 0.045, 0.355, 1);
export const CRISP_DECEL = Easing.bezier(0.16, 1, 0.3, 1);
export const SLOW_ACCEL = Easing.bezier(0.55, 0.085, 0.68, 0.53);
export const PLAYFUL_OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);
export const SMOOTH_CUBIC = Easing.cubic;
export const EXPO = Easing.exp;
export const CIRCLE = Easing.circle;
export const OUT_QUAD = Easing.out(Easing.quad);
