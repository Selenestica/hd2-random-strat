const convertRGBToHex = (rgbString) => {
  const [r, g, b] = rgbString
    .match(/\d+/g) // extract numbers
    .map(Number); // convert to integers
  return rgbToHex(r, g, b);
};

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};
