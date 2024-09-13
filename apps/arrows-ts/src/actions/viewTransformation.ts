export const adjustViewport = (scale: number, panX: number, panY: number) => {
  return {
    type: 'ADJUST_VIEWPORT',
    scale,
    panX,
    panY,
  };
};
