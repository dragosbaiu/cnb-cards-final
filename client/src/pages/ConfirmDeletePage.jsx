import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../lib/api";

export function ConfirmDeletePage() {
  const [searchParams] = useSearchParams();
  const { signOut } = useContext(AuthContext);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`${API_URL}/api/auth/confirm-delete?token=${encodeURIComponent(token)}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          signOut();
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] px-8 py-10 max-w-md w-full text-center">
        {status === "loading" && (
          <p className="text-[#4B5563]">Deleting your account...</p>
        )}
        {status === "success" && (
          <>
            <h1 className="text-xl font-bold text-[#111111] mb-3">Account deleted</h1>
            <p className="text-sm text-[#4B5563] mb-6">
              Your account and all associated data have been permanently removed.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors"
            >
              Go to homepage
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-xl font-bold text-[#111111] mb-3">Link invalid or expired</h1>
            <p className="text-sm text-[#4B5563] mb-6">
              This deletion link is invalid or has expired. Please request a new one from your account page.
            </p>
            <Link
              to="/account"
              className="inline-block px-6 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors"
            >
              Back to account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
