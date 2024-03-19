import { configureStore } from "@reduxjs/toolkit";
import gameProfileReducer from "./reducers/GameProfileSlice";

// creates Redux store using configure store function
export const store = configureStore({
  reducer: {
    gameProfile: gameProfileReducer,
  },
  devTools: process.env.NODE_ENV === "development",
});

// get RooState and Dispatch type so that they can be referenced as needed
// infers RooState and Dispatch type from store so that they can update
// as more state slices is added
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
