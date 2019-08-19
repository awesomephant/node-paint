export function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) - Math.pow((y1 - y2), 2));
}

export function formatRGB(rgb){
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}