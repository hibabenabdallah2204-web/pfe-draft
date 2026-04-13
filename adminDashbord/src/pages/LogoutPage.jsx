import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, TriangleAlert } from "lucide-react";
import API from "../api/axios";

export default function LogoutPage() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setMessage("");
    setShowPrompt(true);
  };

  const handleCancel = () => {
    if (loading) return;
    setShowPrompt(false);
  };

  const handleConfirmLogout = async () => {
    setLoading(true);
    setMessage("");

    try {
      await API.post("/logout");

      setShowPrompt(false);
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      setMessage(
        error?.response?.data?.message ||
        "Logout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Log Out</h1>
        <p className="mt-3 text-[16px] text-slate-500">
          Securely end your current session and return to the authentication page.
        </p>
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              End Current Session
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Click the button below to sign out from your account safely.
            </p>
          </div>

          <button
            onClick={handleLogoutClick}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-md"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                <TriangleAlert size={24} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Logout Confirmation
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to log out from your account?
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={loading}
                className={`rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 ${loading ? "cursor-not-allowed opacity-60" : ""
                  }`}
              >
                No
              </button>

              <button
                onClick={handleConfirmLogout}
                disabled={loading}
                className={`rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-md ${loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                  }`}
              >
                {loading ? "Logging Out..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}