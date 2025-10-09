/**
 * Converts HSL color values to a CSS color string
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns CSS color string
 */

export function hsl(h: number, s: number, l:number): string {

    h = h % 360;
    if (h < 0) h += 360;
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));

    return `hsl(${h}, ${s}%, ${l}%)`;
}

// export function hsl(h: number, s: number, l: number): string {
//     // Normalize values
//     h = h % 360;
//     s = Math.max(0, Math.min(100, s)) / 100;
//     l = Math.max(0, Math.min(100, l)) / 100;

//     const c = (1 - Math.abs(2 * l - 1)) * s;
//     const x = c * (1 - Math.abs((h / 60) % 2 - 1));
//     const m = l - c / 2;

//     let r = 0, g = 0, b = 0;

//     if (h >= 0 && h < 60) {
//         [r, g, b] = [c, x, 0];
//     } else if (h >= 60 && h < 120) {
//         [r, g, b] = [x, c, 0];
//     } else if (h >= 120 && h < 180) {
//         [r, g, b] = [0, c, x];
//     } else if (h >= 180 && h < 240) {
//         [r, g, b] = [0, x, c];
//     } else if (h >= 240 && h < 300) {
//         [r, g, b] = [x, 0, c];
//     } else {
//         [r, g, b] = [c, 0, x];
//     }

//     // Convert to 0-255 range and add lightness adjustment
//     const toHex = (n: number) => {
//         const hex = Math.round((n + m) * 255).toString(16);
//         return hex.length === 1 ? '0' + hex : hex;
//     };

//     return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
// }

// export function hsla(h: number, s: number, l: number, a: number = 1): string {
//     const hex = hsl(h, s, l);
//     const alpha = Math.max(0, Math.min(1, a));
//     const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
//     return `${hex}${alphaHex}`;
// }