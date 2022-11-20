import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
// reducer functions
import {getAuthors, createAuthor, updateAuthor, deleteAuthor} from "./authors.utils"

type Author = {
    _id: string,
    name: string,
}

interface AuthorsState{
    authors: Author[],
    loading: boolean,
    error: string
}

const initialState: AuthorsState = {
    authors: [],
    loading: false,
    error: ''
}

const AuthorsSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAuthors.pending, (state) => {
            state.loading = true
        })
        .addCase(getAuthors.fulfilled, (state, action: PayloadAction<Author[]>) => {
            state.loading = false
            state.authors = action.payload;
        })
        .addCase(getAuthors.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message || "Something went wrong while fetching all books..."
        })
        .addCase(createAuthor.pending, (state) => {
            state.loading = true;
        })
        .addCase(createAuthor.fulfilled, (state, action: PayloadAction<Author>) => {
            state.loading = false
            state.authors = [...state.authors, action.payload];
        })
        .addCase(createAuthor.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message || "Something went wrong while creating a new book...";
        })
        .addCase(updateAuthor.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateAuthor.fulfilled, (state, action: PayloadAction<Author>) => {
            state.loading = false
            state.authors = state.authors.map((author) => author._id === action.payload._id ? action.payload : author)
        })
        .addCase(updateAuthor.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message || "Something went wrong while updating a book...";
        })
        .addCase(deleteAuthor.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteAuthor.fulfilled, (state, action: PayloadAction<{_id: string}>) => {
            state.loading = false
            state.authors = state.authors.filter((author) => author._id !== action.payload._id);
        })
        .addCase(deleteAuthor.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message || "Something went wrong while deleting a book...";
        })
    }
});

export const SelectAuthors = (state: RootState) => state.authors.authors

export const SelectAuthorCount = createSelector([SelectAuthors], (authors) => {
    return authors.reduce(accumulator => accumulator + 1, 0)
})

export const SelectAuthorById = (_id: string) =>
    createSelector([SelectAuthors], (authors) => 
        _id? authors.find((author) => author._id === _id) : null
    )

export default AuthorsSlice.reducer