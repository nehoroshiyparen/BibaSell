import type { PersonFilters } from "../model/types/PersonFilters";
import { fetchPersons, fetchPersonsWithFilters } from "../model/person.thunks";
import { useAppDispatch } from "src/app/store/hooks";

export function usePersons() {
    const dispatch = useAppDispatch()

    // const globalLoading = useAppSelector(selectLoader)

    const load = async(page: number, limit?: number) => {     
        try {
            await dispatch(fetchPersons({ page, limit }))
        } catch (e) {
            console.log(e)
        }
    }

    const loadWithFilters = async(filters: PersonFilters, page: number, limit?: number) => {
        try {
            dispatch(await fetchPersonsWithFilters({ filters, page, limit }))
        } catch (e) {
            console.log(e)
        }
    }

    return { load, loadWithFilters }
}