import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

const VerifyEmail = () => {
  const { token } = useParams(); // Get the token from the URL params
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Send the token to the backend for verification
    axios
      .get(`http://localhost:5555/user/verify/${token}`)
      .then(() => {
        enqueueSnackbar("Email verified successfully!", { variant: "success" });
        navigate("/");
      })

      .catch(() => {
        enqueueSnackbar("Invalid or expired token", { variant: "error" });
      })
      .finally(() => setLoading(false));
  }, [token, enqueueSnackbar, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>

      {loading ? (
        <p>Please wait while we verify your email...</p>
      ) : (
        <p>Email verification complete.</p>
      )}
    </div>
  );
};

export default VerifyEmail;
