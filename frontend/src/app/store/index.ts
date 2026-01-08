import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./slices/loader.slice";
import errorReducer from './slices/error.slice'
import { personReducer } from 'src/entities/person/model'
import { rewardReducer } from "src/entities/reward/model";
import { articleReducer } from "src/entities/article/model";
import { mapReducer } from "src/entities/map/model";

export const store = configureStore({
    reducer: {
        loader: loaderReducer,
        error: errorReducer,
        person: personReducer,
        reward: rewardReducer,
        article: articleReducer,
        map: mapReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch