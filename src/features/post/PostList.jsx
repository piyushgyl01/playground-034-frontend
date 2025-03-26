import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { clearSuccess, fetchAllPosts, removePost } from "./postSlice";

export default function PostList() {
  const dispatch = useDispatch();
  const {
    list: posts,
    loading,
    error,
    success,
  } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllPosts());

    return () => {
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  async function handleDelete(postId) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(removePost(postId)).unwrap();
      } catch (error) {
        console.error("Failed to delete job:", error);
      }
    }
  }

  if (loading && posts.length === 0) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      {success && (
        <div className="alert alert-success">Post deleted successfully</div>
      )}

      <div className="d-flex justify-content-between mb-4">
        <h2>All Posts</h2>
        {user && (
          <Link to="/create" className="btn btn-primary pt-2">
            Create Post
          </Link>
        )}
      </div>
      {posts.length === 0 ? (
        <div className="alert alert-info">
          No posts found. Be the first to post a job!
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {posts.map((post) => (
            <div className="col" key={post._id}>
              <div className="card h-100">
                <img className="card-img-top" src={post?.featuredImage?.url} />
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title">{post.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {post?.tags?.join("• ")}
                    </h6>
                  </div>
                  <p className="card-text">
                    {post?.content?.length > 100
                      ? `${post?.content?.substring(0, 100)}...`
                      : post?.content}
                  </p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <small className="text-muted">
                    By @{post?.author?.username}
                  </small>
                  <div>
                    {user && post?.author?._id === user._id && (
                      <>
                        <Link
                          to={`/edit/${post._id}`}
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(post._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
