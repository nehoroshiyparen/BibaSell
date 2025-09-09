import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PersonPreview } from "./types/PersonPreview";
import { getFilteredPersonsApi, getPersonsApi } from "../api";
import type { PersonFilters } from "./types/PersonFilters";

type FetchPersonArgs = {
    page: number,
    limit?: number
}

type FetchPersonsWithFiltersArg = {
    filters: PersonFilters,
    page: number,
    limit?: number
}

export const fetchPersons = createAsyncThunk<PersonPreview[], FetchPersonArgs>(
    'person/fetchPersons',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const data = await getPersonsApi(page*10, limit ?? 10)
            return data
        } catch (e) {
            if (e instanceof Error) return rejectWithValue(e.message)
            return rejectWithValue(String(e))
        }
    }
)

export const fetchPersonsWithFilters = createAsyncThunk<
    PersonPreview[],
    FetchPersonsWithFiltersArg
>('person/fetchPersonsWithFilters', async ({ filters, page, limit }, { rejectWithValue }) => {
    try {
        const data = await getFilteredPersonsApi(filters, page * 10, limit ?? 10)
        return data
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message)
        return rejectWithValue(String(e))
    }
})