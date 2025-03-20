import API from "./authService";

export const fetchPosts = async () => {
  const response = await API.get("/posts");
  return response.data;
};

export const fetchPostById = async (id) => {
  const response = await API.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await API.post("/posts", postData);
  return response.data;
};

export const updatePost = async ({ id, postData }) => {
  const response = await API.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await API.delete(`/posts/${id}`);
  return response.data;
};
