import { deletePersonsApi, getFilteredPersonsApi, getPersonByIdApi, getPersonsApi, uploadPersonPackApi } from "../api";
import type { PersonAdvanced } from "../model/types/PersonAdvanced";
import type { PersonFilters } from "../model/types/PersonFilters";
import { pushPersons, setPersons } from "../model";
import { store } from "src/app/store";

export const getFilteredPersons = async (filters: PersonFilters) => {
    const state = store.getState()
    const persons = state.person

    const filteredPersons = await getFilteredPersonsApi(filters)

    if (!persons || persons.length === 0) {
        store.dispatch(setPersons(filteredPersons))
    } else {
        store.dispatch(pushPersons(filteredPersons))
    }

    return persons
}

export const getPersonById = async (id: number) => {
    const fetchedPerson = await getPersonByIdApi(id)

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

export const uploadPersonPack = async (pack: PersonAdvanced[]) => {
    await uploadPersonPackApi(pack)
}

export const deletePersons = async (ids: number[]) => {
    await deletePersonsApi(ids)
}