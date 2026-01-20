import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import type { MapFilters } from "../model/types/MapFilters";
import { fetchMaps } from "../model/map.thunks";
import type { RootState } from "src/app/store";
import {
  resetMaps,
  resetSelectedMap,
  setSearchQuery,
  setSelectedMap,
} from "../model";
import type { MapAdvanced } from "../model/types/MapAdvanced";

export function useMap() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s: RootState) => s.map);

  const loadMoreMaps = async (filters?: MapFilters) => {
    if (state.isLoading || !state.hasMore) return;

    await dispatch(
      fetchMaps({
        page: state.page,
        filters,
      }),
    );
  };

  return {
    // state
    ...state,

    // actions
    loadMoreMaps,
    resetMaps: () => dispatch(resetMaps()),
    setSearchQuery: (v: string) => dispatch(setSearchQuery(v)),
    setSelectedMap: (v: MapAdvanced) => dispatch(setSelectedMap(v)),
    resetSelectedMap: () => dispatch(resetSelectedMap()),
  };
}
