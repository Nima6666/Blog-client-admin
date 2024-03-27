import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
    name: "postData",
    initialState: { posts: {}, selPost: {} },
    reducers: {
        setPosts(state, action) {
            state.posts = action.payload;
        },
        setSelPost(state, action) {
            state.selPost = action.payload;
        },
    },
});

export const postActions = postSlice.actions;
