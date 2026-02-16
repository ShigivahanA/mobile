const palette = {
  cream: '#F6F0D7',
  lightGreen: '#C5D89D',
  midGreen: '#9CAB84',
  darkGreen: '#89986D',
  deepText: '#2D3321', // Harmonized deep green-black
};

export default {
  light: {
    text: palette.deepText,
    background: palette.cream,
    tint: palette.darkGreen,
    tabIconDefault: palette.midGreen,
    tabIconSelected: palette.darkGreen,
    card: '#FFFFFF',
    border: palette.lightGreen,
    nature: palette,
  },
  dark: {
    text: palette.deepText,
    background: palette.cream,
    tint: palette.darkGreen,
    tabIconDefault: palette.midGreen,
    tabIconSelected: palette.darkGreen,
    card: '#FFFFFF',
    border: palette.lightGreen,
    nature: palette,
  },
};
