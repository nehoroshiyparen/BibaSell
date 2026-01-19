import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PersonPreview } from "./types/PersonPreview";
import { fetchPersons } from "./person.thunks";

type PersonState = {
  persons: PersonPreview[];

  page: number;
  hasMore: boolean;

  searchQuery: string;

  isLoading: boolean;
  error: string | null;
};

const initialState: PersonState = {
  persons: [],

  page: 0,
  hasMore: true,

  searchQuery: "",

  isLoading: false,
  error: null,
};

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setPersons: (state, action: PayloadAction<PersonPreview[]>) => {
      state.persons = action.payload;
    },
    pushPersons: (state, action: PayloadAction<PersonPreview[]>) => {
      state.persons = [...state.persons, ...action.payload];
    },
    resetPersons: (state) => {
      state.persons = [];
      state.page = 0;
      state.hasMore = true;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 0;
      state.hasMore = true;
      state.persons = [];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPersons.fulfilled,
        (state, action: PayloadAction<PersonPreview[]>) => {
          state.isLoading = false;
          if (action.payload.length === 0) {
            state.hasMore = false;
          } else {
            state.persons =
              state.page === 0
                ? action.payload
                : [...state.persons, ...action.payload];
            state.page += 1;
          }
        },
      )
      .addCase(fetchPersons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPersons,
  pushPersons,
  resetPersons,
  setSearchQuery,
  setLoading,
  setError,
} = personSlice.actions;
export default personSlice.reducer;
