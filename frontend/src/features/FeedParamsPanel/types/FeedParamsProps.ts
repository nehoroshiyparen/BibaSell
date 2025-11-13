import type { FeedParamProps } from "./FeedParamProps";

export type FeedParamsPanelProps<TItem, TParams extends Record<string, FeedParamProps>> = {
    feedEntities: TItem[];
    params: TParams;
}