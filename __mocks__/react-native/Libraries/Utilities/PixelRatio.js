// Mock PixelRatio for Jest
const PixelRatio = {
  get: () => 2,
  getFontScale: () => 2,
  getPixelSizeForLayoutSize: (size) => size,
  roundToNearestPixel: (size) => Math.round(size),
};

module.exports = PixelRatio;
