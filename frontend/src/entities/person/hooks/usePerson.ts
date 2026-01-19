import type { PersonFilters } from "../model/types/PersonFilters";
import { fetchPersons } from "../model/person.thunks";
import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import type { RootState } from "src/app/store";

export function usePerson() {
  const dispatch = useAppDispatch();

  const { persons, page, hasMore, searchQuery, isLoading } = useAppSelector(
    (state: RootState) => state.person,
  );

  const loadMorePersons = async (filtersOverride?: PersonFilters) => {
    if (!hasMore || isLoading) return;

    const filters =
      filtersOverride ??
      (searchQuery.trim() ? { name: searchQuery.trim() } : {});
    await dispatch(fetchPersons({ page, filters }));
  };

  const reset = () => {
    dispatch({ type: "person/resetPersons" });
  };

  const setQuery = (query: string) => {
    dispatch({ type: "person/setSearchQuery", payload: query });
  };

  return {
    // state
    persons,
    page,
    hasMore,
    searchQuery,
    isLoading,

    // actions
    loadMorePersons,
    reset,
    setQuery,
  };
}
