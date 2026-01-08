import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { MapAdvanced } from "./types/MapAdvanced"
import type { MapPreview } from "./types/MapPreview"
import { fetchMaps } from "./map.thunks"

export type MapState = {
    maps: MapPreview[],

    page: number,
    hasMore: boolean,

    searchQuery: string,

    isLoading: boolean,
    error: string | null,

    selectedMap: MapAdvanced | null
}

const initialState: MapState = {
    maps: [],

    page: 0,
    hasMore: true,

    searchQuery: '',

    isLoading: false,
    error: null,

    selectedMap: null,
}

const mapSlice = createSlice({
    name: 'maps',
    initialState,
    reducers: {
        setMaps: (state, action: PayloadAction<MapPreview[]>) => {
            state.maps = action.payload
        },
        pushMaps: (state, action: PayloadAction<MapPreview[]>) => {
            state.maps = [...state.maps, ...action.payload]
        },
        resetMaps: (state: MapState) => {
            state.maps = [],
            state.page = 0,
            state.hasMore = true
        },

        setSelectedMap: (state, action: PayloadAction<MapAdvanced>) => {
            state.selectedMap = action.payload
        },
        resetSelectedMap: (state) => {
            state.selectedMap = null
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaps.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchMaps.fulfilled, (state, action: PayloadAction<MapPreview[]>) => {
                state.isLoading = false
                if (action.payload.length === 0) {
                    state.hasMore = false
                } else {
                    state.maps = state.page === 0 ? action.payload : [...state.maps, ...action.payload]
                    state.page += 1
                }
            })
            .addCase(fetchMaps.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    }
})

export const {
    setMaps, pushMaps, resetMaps,
    setSelectedMap, resetSelectedMap,
    setLoading, setError
} = mapSlice.actions
export default mapSlice.reducer