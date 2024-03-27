import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
    name: "authData",
    initialState: {
        user: "",
        token: "",
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setToken(state, action) {
            state.token = action.payload;
        },
    },
});

export const authDataActions = dataSlice.actions;
