import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  async function handleSubmit(e) {
    
  }

  return <div>ForgotPassword</div>;
}
