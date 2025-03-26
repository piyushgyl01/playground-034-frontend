import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addPost,
  clearError,
  clearSuccess,
  editPost,
  fetchPost,
} from "./postSlice";

export default function PostForm() {
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    featuredImage: {
      url: "",
      thumbnail: "",
    },
  });
  const [tagsInput, setTagsInput] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost, loading, error, success } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchPost(id));
    }

    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentPost) {
      // Ensure tags is always a properly formatted array
      let tagsArray = [];

      if (currentPost.tags) {
        // Handle if tags is already an array
        if (Array.isArray(currentPost.tags)) {
          tagsArray = currentPost.tags.filter((tag) => tag !== "");
        }
        // Handle if tags is a string (could happen depending on API)
        else if (typeof currentPost.tags === "string") {
          tagsArray = currentPost.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== "");
        }
      }

      setFormData({
        title: currentPost.title || "",
        content: currentPost.content || "",
        tags: tagsArray,
        featuredImage: {
          url: currentPost.featuredImage?.url || "",
          thumbnail: currentPost.featuredImage?.thumbnail || "",
        },
      });

      // Set the tags input field
      if (Array.isArray(currentPost.tags)) {
        setTagsInput(currentPost.tags.join(", "));
      } else if (typeof currentPost.tags === "string") {
        setTagsInput(currentPost.tags);
      }
    }
  }, [currentPost, isEditMode]);

  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success, navigate]);

  function validateForm() {
    const errors = {};

    if (!formData.title || !formData.content) {
      errors.req = "Please fill all the required fields";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(editPost({ id, postData: formData })).unwrap();
      } else {
        await dispatch(addPost(formData)).unwrap();
      }
    } catch (error) {
      console.log("Error", error);
    }
  }

  if (isEditMode && loading && !currentPost) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow border-0">
      <div className="card-body p-4">
        <h2 className="card-title mb-4">
          {isEditMode ? "Edit Job Listing" : "Create New Job Listing"}
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Post Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              className={`form-control ${formErrors.req ? "is-invalid" : ""}`}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Post Content
            </label>
            <textarea
              type="text"
              name="content"
              id="content"
              rows="5"
              cols="33"
              value={formData.content}
              className={`form-control ${formErrors.req ? "is-invalid" : ""}`}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="tags" className="form-label">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={tagsInput}
              className="form-control"
              onChange={(e) => {
                // Just update the raw input string
                setTagsInput(e.target.value);

                // Also process it into the formData.tags array
                const newTags = e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== "");

                setFormData({
                  ...formData,
                  tags: newTags,
                });
              }}
              placeholder="Enter tags separated by commas"
            />
            <small className="form-text text-muted">
              Type freely, separate tags with commas
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="featuredImage" className="form-label">
              Featured Image URL
            </label>
            <input
              type="text"
              name="featuredImage"
              id="featuredImage"
              value={formData.featuredImage.url}
              className={`form-control ${formErrors.req ? "is-invalid" : ""}`}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  featuredImage: {
                    url: e.target.value,
                    thumbnail: e.target.value,
                  },
                })
              }
              required
            />
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={loading}
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
