import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import HttpClient from "../../services/HttpService"; // Replace with your actual API functions

export const fetchReviews = createAsyncThunk(
  "reviews/getReviews",
  async (productId) => {
    try {
      const reviews = await HttpClient.getReviews(productId);
      return reviews;
    } catch (error) {
      console.error("error while fetching reviews: ", error);
    }
  }
);

export const postReviewAsync = createAsyncThunk(
  "reviews/postReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const newReview = await HttpClient.postReview(productId, {
        rating,
        comment,
      });
      return newReview;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(postReviewAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postReviewAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews.unshift(action.payload);
      })
      .addCase(postReviewAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default reviewsSlice.reducer;
