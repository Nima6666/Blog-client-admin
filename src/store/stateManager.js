import { configureStore } from "@reduxjs/toolkit";

import { dataSlice } from "./slices/authData";
import { postSlice } from "./slices/posts";

const store = configureStore({
    reducer: {
        authDataReducer: dataSlice.reducer,
        postReducer: postSlice.reducer,
    },
});

export default store;
