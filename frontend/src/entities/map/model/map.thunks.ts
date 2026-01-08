import { createAsyncThunk } from "@reduxjs/toolkit"
import type { MapFilters } from "./types/MapFilters"
import type { MapPreview } from "./types/MapPreview"
import { getMapsApi } from "../api/get/getMaps"

type FetchMapArgs = {
    page: number,
    limit?: number,
    filters?: MapFilters,
}

export const fetchMaps = createAsyncThunk<MapPreview[], FetchMapArgs>(
    'map/fetchMaps',
    async ({ page, limit, filters }, { rejectWithValue }) => {
        try {
            const data = await getMapsApi(page*10, limit ?? 10, filters)
            return data
        } catch (e) {
            if (e instanceof Error) return rejectWithValue(e.message)
            return rejectWithValue(String(e))
        }
    }
)