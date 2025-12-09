// Mock StyleSheetExports to avoid PixelRatio dependency
const StyleSheet = {
  create: (styles) => {
    // Simply return the styles object as-is for testing
    return styles;
  },
  flatten: (style) => {
    if (!style) return {};
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean));
    }
    return style;
  },
  compose: (style1, style2) => {
    return [style1, style2];
  },
  hairlineWidth: 0.5,
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  absoluteFillObject: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};

module.exports = StyleSheet;

