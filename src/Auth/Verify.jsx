import React, { useEffect } from "react";
import { account } from "../lib/appwrite";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SoundWaveLoader from "../components/SoundWaveLoader"; // Import your custom loader

function Verify() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get("secret");
    const userId = urlParams.get("userId");

    if (userId && secret) {
      account.updateVerification(userId, secret).then(
        (response) => {
          Swal.fire({
            icon: "success",
            title: "Verification Successful",
            text: "Your email has been successfully verified.",
            confirmButtonText: "Go to Dashboard",
          }).then(() => {
            navigate("/signin");
          });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text: error.message,
            confirmButtonText: "Try Again",
          });
        }
      );
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md flex flex-col items-center">
        <SoundWaveLoader /> {/* Custom sound wave loader */}
        <h1 className="text-2xl font-semibold text-gray-800 mt-6 text-center">
          Email Verification
        </h1>
        <p className="text-gray-600 mt-4 text-center">
          Verifying your email. Please wait...
        </p>
      </div>
    </div>
  );
}

export default Verify;
