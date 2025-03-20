import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as postService from "../../services/postService";

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.fetchPosts();
      return response.posts;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch the posts"
      );
    }
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postService.fetchPostById(id);
      return response.post;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch the post"
      );
    }
  }
);

export const addPost = createAsyncThunk(
  "posts/add",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(postData);
      return response.post;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add the post"
      );
    }
  }
);

export const editPost = createAsyncThunk(
  "posts/edit",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost({ id, postData });
      return response.post;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add the post"
      );
    }
  }
);

export const removePost = createAsyncThunk("post/remove", async (id) => {
  try {
    await postService.deletePost(id);
    return id;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add the post"
    );
  }
});

export const postSlice = createSlice({
  name: "posts",
  initialState: {
    list: [],
    currentPost: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPost = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.loading = false;
        state.success = true;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }

        state.currentPost = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.list.filter((post) => post._id !== action.payload);
        state.loading = false;
        state.success = true;

        if (state.currentPost && state.currentPost._id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(removePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPost, clearSuccess } = postSlice.actions;
export default postSlice.reducer;
