import { NextLoad } from "@mdx-js/node-loader/lib";

export const nextLoad: NextLoad = async (url, context) => {
    throw new Error(`Cannot load ${url}`);
};