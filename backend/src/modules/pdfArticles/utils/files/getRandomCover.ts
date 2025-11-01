import { RandomCovers } from "./RandomCovers.js";

/**
 * 
 * @param covers array of cover titles from client
 * @returns Random cover filepath
 */
export function getRandomCover(covers: string[] = RandomCovers): string {
    const random = Math.floor(Math.random() * RandomCovers.length)
    return covers[random]
}