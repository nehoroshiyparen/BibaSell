import type { PersonFilters } from "../model/types/PersonFilters";
import { fetchPersons, fetchPersonsWithFilters } from "../model/person.thunks";
import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import type { RootState } from "src/app/store";

export function usePerson() {
    const dispatch = useAppDispatch()

    // const globalLoading = useAppSelector(selectLoader)

    const useLoad = async(page: number, limit?: number) => {     
        try {
            await dispatch(fetchPersons({ page, limit }))
        } catch (e) {
            console.log(e)
        }
    }

    const useLoadWithFilters = async(filters: PersonFilters, page: number, limit?: number) => {
        try {
            await dispatch(fetchPersonsWithFilters({ filters, page, limit }))
        } catch (e) {
            console.log(e)
        }
    }

    const usePersonState = () => {
        const persons = useAppSelector((state: RootState) => state.person.persons)
        const filteredPersons = useAppSelector((state: RootState) => state.person.filteredPersons)
        const page = useAppSelector((state: RootState) => state.person.page)
        const hasMore = useAppSelector((state: RootState) => state.person.hasMore) 
        const searchQuery = useAppSelector((state: RootState) => state.person.searchQuery)
        const isLoading = useAppSelector((state: RootState) => state.person.isLoading)

        return {
            persons,
            filteredPersons,
            page,
            hasMore,
            searchQuery,
            isLoading
        }
    }

    return { useLoad, useLoadWithFilters, usePersonState }
}