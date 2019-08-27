export function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) - Math.pow((y1 - y2), 2));
}

export function formatRGB(rgb) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

export function compareArrays(a, b) {
    if (a.length !== b.length) { return false }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true;
}

export function rgbToHex(rgb) {
    const r = rgb[0]
    const g = rgb[1]
    const b = rgb[2]

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  