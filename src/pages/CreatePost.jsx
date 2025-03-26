import PostForm from "../features/post/PostForm";

export default function CreatePost() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <PostForm />
        </div>
      </div>
    </div>
  );
}
