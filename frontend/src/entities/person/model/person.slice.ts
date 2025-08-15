import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PersonPreview } from "./types/PersonPreview";

const initialState: PersonPreview[] = []

const personSlice = createSlice({
    name: 'person',
    initialState,
    reducers: {
        setPersons: (_, action: PayloadAction<PersonPreview[]>) => { return action.payload },
        pushPersons: (state, action: PayloadAction<PersonPreview[]>) => { return [...state, ...action.payload] },
        resetPersons: (_) => { return [] }
    }
})

export const { setPersons, pushPersons, resetPersons } = personSlice.actions
export default personSlice.reducer