import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./slices/loader.slice";
import errorReducer from './slices/error.slice'
import { personReducer } from 'src/entities/person/model'

export const store = configureStore({
    reducer: {
        loader: loaderReducer,
        error: errorReducer,
        person: personReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch