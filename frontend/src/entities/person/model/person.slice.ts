import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PersonPreview } from "./types/PersonPreview";
import { fetchPersons, fetchPersonsWithFilters } from "./person.thunks";

type PersonState = {
    persons: PersonPreview[],
    filteredPersons: PersonPreview[],

    page: number,
    hasMore: boolean,

    searchQuery: string,

    isLoading: boolean,
    error: string | null
}

const initialState: PersonState = {
    persons: [],
    filteredPersons: [],

    page: 0,
    hasMore: true,

    searchQuery: '',

    isLoading: false,
    error: null
}

const personSlice = createSlice({
    name: 'person',
    initialState,
    reducers: {
        setPersons: (state, action: PayloadAction<PersonPreview[]>) => {
            state.persons = action.payload
        },
        pushPersons: (state, action: PayloadAction<PersonPreview[]>) => {
            state.persons = [...state.persons, ...action.payload]
        },
        resetPersons: (state) => {
            state.persons = []
            state.page = 0
            state.hasMore = true
        },

        setFilteredPersons: (state, action: PayloadAction<PersonPreview[]>) => {
            state.filteredPersons = action.payload
        },
        pushFilteredPersons: (state, action: PayloadAction<PersonPreview[]>) => {
            state.filteredPersons = [...state.filteredPersons, ...action.payload]
        },
        resetFilteredPersons: (state) => {
            state.filteredPersons = []
            state.page = 0
            state.hasMore = true
        },

        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
            state.filteredPersons = []
            state.page = 0
            state.hasMore = true
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
            .addCase(fetchPersons.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchPersons.fulfilled, (state, action: PayloadAction<PersonPreview[]>) => {
                state.isLoading = false
                if (action.payload.length === 0) {
                    state.hasMore = false
                } else {
                    state.persons = state.page === 0 ? action.payload : [...state.persons, ...action.payload]
                    state.page += 1
                }
            })
            .addCase(fetchPersons.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        builder
            .addCase(fetchPersonsWithFilters.pending, (state) => {
                // state.isLoading = true Комопонент управляет этим состоянием, поэтому здесь это излишне
                state.error = null
            })
            .addCase(fetchPersonsWithFilters.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload.length === 0) {
                    state.hasMore = false
                } else {
                    state.filteredPersons = state.page === 0 ? action.payload : [...state.filteredPersons, ...action.payload]
                    state.page += 1
                }
            })
            .addCase(fetchPersonsWithFilters.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    }
})

export const { 
    setPersons, pushPersons, resetPersons, 
    setFilteredPersons, pushFilteredPersons, resetFilteredPersons, 
    setSearchQuery,
    setLoading, setError     
} = personSlice.actions
export default personSlice.reducer