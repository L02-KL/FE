// Mock StyleSheet to avoid PixelRatio dependency
const StyleSheet = {
  create: (styles) => {
    // Simply return the styles object as-is for testing
    return styles;
  },
  flatten: (style) => style,
  compose: (style1, style2) => [style1, style2],
  hairlineWidth: 0.5,
  absoluteFill: {},
  absoluteFillObject: {},
};

module.exports = StyleSheet;

