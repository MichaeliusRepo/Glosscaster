export function sigmoid(z: number, k: number) {
    // The larger the k, the larger the useful domain.
    // For k=1, the useful domain is roughly -6 to +6.
    return 1 / (1 + Math.exp(-z / k));
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}