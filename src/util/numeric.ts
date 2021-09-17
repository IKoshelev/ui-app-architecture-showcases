


export function expandMagnitudeShortcuts(val: string) {
    return val
            .replace('k', '000')
            .replace('K', '000')
            .replace('m', '000000')
            .replace('M', '000000');
}

export function isInteger(val: string) {
    return /^-?\d+$/.test(val);
}