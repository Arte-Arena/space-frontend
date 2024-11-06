import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blogposts: [],
  recentPosts: [],
  blogSearch: '',
  sortBy: 'newest',
  selectedPost: null, 
};

export const BlogSlice = createSlice({
  name: 'Blog',
  initialState,
  reducers: {
    getPosts: (state, action) => {
      state.blogposts = action.payload;
    },
    getPost: (state, action) => {
      state.selectedPost = action.payload;
    },
  },
});

export const { getPosts, getPost } = BlogSlice.actions;

export const fetchBlogPosts = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/data/blog/BlogPosts');
    dispatch(getPosts(response.data));
  } catch (err) {
    throw new Error();
  }
};
export const addComment = (postId, comment) => async (dispatch) => {
  try {
    const response = await axios.post('/api/data/blog/post/add', { postId, comment });
    dispatch(getPosts(response.data.posts));
  } catch (err) {
    throw new Error(err);
  }
};
export const fetchBlogPost = (title) => async (dispatch) => {
  try {
    const response = await axios.post('/api/data/blog/post', { title });
    dispatch(getPost(response.data.post));
  } catch (err) {
    throw new Error(err);
  }
};
export default BlogSlice.reducer;
