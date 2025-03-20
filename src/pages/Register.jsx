import AuthForm from '../components/AuthForm';

export default function Register() {
  return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-6">
              <AuthForm isLogin={false} />
          </div>
        </div>
      </div>
    );
}
