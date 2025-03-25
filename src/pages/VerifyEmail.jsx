import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState({
    loading: false,
    success: false,
    error: null,
  })

  return (
    <div>VerifyEmail</div>
  )
}
