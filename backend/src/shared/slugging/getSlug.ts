import { translitMap } from "./translitMap.js";

export function getSlug(s: string | undefined) {
    if (!s) return null
    return s
        .toLowerCase()
        .split('')
        .map(char => translitMap[char] || char)
        .join('')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}