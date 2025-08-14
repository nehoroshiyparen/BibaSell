import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./slices/loader.slice";
import errorReducer from './slices/error.slice'

export const store = configureStore({
    reducer: {
        loader: loaderReducer,
        error: errorReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch