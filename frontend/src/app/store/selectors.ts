import type { RootState } from ".";

export const selectLoader = (state: RootState) => state.loader.loading
export const selectError = (state: RootState) => state.error