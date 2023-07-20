export const interpolateColor = (c0: string, c1: string, f: number | undefined) => {
    if (!f) return c0;

    const cc0 = c0.match(/.{1,2}/g)?.map((oct) => parseInt(oct, 16) * (1 - f))
    const cc1 = c1.match(/.{1,2}/g)?.map((oct) => parseInt(oct, 16) * f)

    if (!cc0 || !cc1) return c0;

    let ci = [0, 1, 2].map(i => Math.min(Math.round(cc0[i] + cc1[i]), 255))

    return ci.reduce((a, v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
}