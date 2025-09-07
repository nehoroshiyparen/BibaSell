import { bulkDeletePersonsApi, getFilteredPersonsApi, getPersonByIdApi, getPersonsApi, bulkCreatePersonsApi } from "../api";
import type { PersonAdvanced } from "../model/types/PersonAdvanced";
import type { PersonFilters } from "../model/types/PersonFilters";
import { pushPersons, setPersons } from "../model";
import { store, type AppDispatch } from "src/app/store";

export const getPersonById = async (id: number, dispatch: AppDispatch) => {
    const fetchedPerson = await getPersonByIdApi(id, dispatch)

    return fetchedPerson
}

export const getPersons = async (offset: number, limit: number) => {
    const state = store.getState()
    const persons = state.person

    const fetchedPersons = await getPersonsApi(offset, limit)

    if (!persons || persons.length === 0) {
        store.dispatch(setPersons(fetchedPersons))
    } else {
        store.dispatch(pushPersons(fetchedPersons))
    }
}

export const getFilteredPersons = async (filters: PersonFilters) => {
    const filteredPersons = await getFilteredPersonsApi(filters)

    store.dispatch(setPersons(filteredPersons))

    return filteredPersons
}

export const bulkCreatePersons = async (pack: PersonAdvanced[]) => {
    await bulkCreatePersonsApi(pack)
}

export const bulkDeletePersons = async (ids: number[]) => {
    await bulkDeletePersonsApi(ids)
}