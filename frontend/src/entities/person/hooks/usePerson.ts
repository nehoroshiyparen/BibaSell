import type { PersonFilters } from "../model/types/PersonFilters";
import { fetchPersons } from "../model/person.thunks";
import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import type { RootState } from "src/app/store";

export function usePerson() {
    const dispatch = useAppDispatch()

    const useLoad = async(params: { page: number, limit?: number, filters?: PersonFilters }) => {     
        try {
            await dispatch(fetchPersons({ page: params.page, limit: params.limit, filters: params.filters }))
        } catch (e) {
            console.log(e)
        }
    }

    const usePersonState = () => {
        const persons = useAppSelector((state: RootState) => state.person.persons)
        const page = useAppSelector((state: RootState) => state.person.page)
        const hasMore = useAppSelector((state: RootState) => state.person.hasMore) 
        const searchQuery = useAppSelector((state: RootState) => state.person.searchQuery)
        const isLoading = useAppSelector((state: RootState) => state.person.isLoading)

        return {
            persons,
            page,
            hasMore,
            searchQuery,
            isLoading
        }
    }

    return { useLoad, usePersonState }
}