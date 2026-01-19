import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import type { RootState } from "src/app/store";
import { fetchRewards } from "../model/reward.thunks";
import type { RewardFilters } from "../model/types/RewardFilters";
import { resetRewards, setSearchQuery } from "../model";

export function useRewards() {
  const dispatch = useAppDispatch();

  const { rewards, page, hasMore, searchQuery, isLoading } = useAppSelector(
    (state: RootState) => state.reward,
  );

  // high-level UI функция
  const loadMoreRewards = async (filtersOverride?: RewardFilters) => {
    if (!hasMore || isLoading) return;

    const filters =
      filtersOverride ??
      (searchQuery.trim() ? { label: searchQuery.trim() } : {});

    await dispatch(fetchRewards({ page, filters }));
  };

  const reset = () => {
    dispatch(resetRewards());
  };

  const setQuery = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  return {
    // state
    rewards,
    page,
    hasMore,
    searchQuery,
    isLoading,

    // actions
    loadMoreRewards,
    reset,
    setQuery,
  };
}
