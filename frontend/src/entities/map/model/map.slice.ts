import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MapAdvanced } from "./types/MapAdvanced";
import type { MapPreview } from "./types/MapPreview";
import { fetchMaps } from "./map.thunks";

export type MapState = {
  maps: MapPreview[];

  page: number;
  hasMore: boolean;

  searchQuery: string;

  isLoading: boolean;
  error: string | null;

  selectedMap: MapAdvanced | null;
};

const initialState: MapState = {
  maps: [],

  page: 0,
  hasMore: true,

  searchQuery: "",

  isLoading: false,
  error: null,

  selectedMap: null,
};

const resetPagination = (state: MapState) => {
  state.maps = [];
  state.page = 0;
  state.hasMore = true;
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    resetMaps(state) {
      resetPagination(state);
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedMap(state, action: PayloadAction<MapAdvanced>) {
      state.selectedMap = action.payload;
    },
    resetSelectedMap(state) {
      state.selectedMap = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMaps.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.length === 0) {
          state.hasMore = false;
          return;
        }

        state.maps =
          state.page === 0
            ? action.payload
            : [...state.maps, ...action.payload];

        state.page += 1;
      })
      .addCase(fetchMaps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetMaps, setSearchQuery, setSelectedMap, resetSelectedMap } =
  mapSlice.actions;
export default mapSlice.reducer;
