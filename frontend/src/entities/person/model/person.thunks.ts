import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PersonPreview } from "./types/PersonPreview";
import type { PersonFilters } from "./types/PersonFilters";
import { getPersonsApi } from "../api";

type FetchPersonArgs = {
  page: number;
  limit?: number;
  filters?: PersonFilters;
};

export const fetchPersons = createAsyncThunk<PersonPreview[], FetchPersonArgs>(
  "person/fetchPersons",
  async ({ page, limit, filters }, { rejectWithValue }) => {
    try {
      const data = await getPersonsApi(page * 10, limit ?? 10, filters);
      return data;
    } catch (e) {
      if (e instanceof Error) return rejectWithValue(e.message);
      return rejectWithValue(String(e));
    }
  },
);
