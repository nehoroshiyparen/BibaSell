import { translitMap } from "./translitMap";

export function getSlug(s: string) {
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