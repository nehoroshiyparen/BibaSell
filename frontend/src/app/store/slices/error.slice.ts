import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ErrorState {
    code: string | null
    message: string | null
}

const initialState: ErrorState = {
    code: null,
    message: null
}

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<ErrorState>) => { 
            state.code = action.payload.code
            state.message = action.payload.message
        },
        cleanEror: (state) => { 
            state.code = null
            state.message = null
        }
    }
})

export const { setError, cleanEror } = errorSlice.actions
export default errorSlice.reducer