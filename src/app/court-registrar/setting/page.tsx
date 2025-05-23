"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourtInfoSetting from "@/components/court-registrar/setting/CourtInfoSetting";
import CourtNumberSetting from "@/components/court-registrar/setting/CourtNumberSetting";
import PasswordSetting from "@/components/court-registrar/setting/PasswordSetting";
import PasswordConfirmationSetting from "@/components/court-registrar/setting/PasswordConfirmationSetting";
import JudicialDivisionSetting from "@/components/court-registrar/setting/JudicialDivisionSetting";
import DeleteAccountModal from "@/components/users/setting/DeleteAccountModal";
import CourtRegistrarLayout from "@/components/court-registrar/layout";
import {
  UpdateCourtRegistrarSettings,
  DeleteAccountRequest,
} from "@/Services/AuthRequest/auth.request";
import { useRouter } from "next/navigation";

const UserSettingPage = () => {
  const router = useRouter();
  // Initialize with empty strings
  const [courtinfo, setCourtinfo] = useState("");
  const [courtnumber, setCourtnumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [judicialdivision, setJudicialdivision] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch court registrar data from session storage
  const fetchCourtRegistrarData = () => {
    try {
      // Get user data from session storage
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        const auth = JSON.parse(authStr);
        if (auth.data) {
          // Use data from auth object
          setCourtinfo(
            auth.data.court_info || "Court 3 of the Awka Judiciary Division"
          );
          setCourtnumber(auth.data.court_number || "i123456YUGDSFF");
          setJudicialdivision(
            auth.data.judicial_division || "Awka Judicial Division"
          );
          console.log("Loaded court registrar data from auth:", auth.data);
        } else {
          // Fallback to user object if available
          const userStr = sessionStorage.getItem("user");
          if (userStr) {
            const userData = JSON.parse(userStr);
            setCourtinfo(
              userData.court_info || "Court 3 of the Awka Judiciary Division"
            );
            setCourtnumber(userData.court_number || "i123456YUGDSFF");
            setJudicialdivision(
              userData.judicial_division || "Awka Judicial Division"
            );
            console.log("Loaded court registrar data from user:", userData);
          } else {
            console.log("No court registrar data found in session storage");
            // Set default values
            setDefaultValues();
          }
        }
      } else {
        console.log("No auth data found in session storage");
        // Set default values
        setDefaultValues();
      }
    } catch (error) {
      console.error("Error fetching court registrar data:", error);
      toast.error("Failed to load court registrar data");
      // Set default values
      setDefaultValues();
    }
  };

  // Fetch court registrar data on component mount
  useEffect(() => {
    fetchCourtRegistrarData();
  }, []);

  // Function to set default values
  const setDefaultValues = () => {
    setCourtinfo("Court 3 of the Awka Judiciary Division");
    setCourtnumber("i123456YUGDSFF");
    setJudicialdivision("Awka Judicial Division");
  };

  const handleSave = async () => {
    // Validate password confirmation if password is set
    if (password && password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSaving(true);
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await UpdateCourtRegistrarSettings({
        court_info: courtinfo,
        court_number: courtnumber,
        judicial_division: judicialdivision,
        password: password || undefined,
        password_confirmation: passwordConfirmation || undefined,
      });

      if (response.success) {
        // Reload data from session storage to reflect the changes
        // This is important because the API might have updated the session data
        fetchCourtRegistrarData();

        // Clear password fields after successful update
        setPassword("");
        setPasswordConfirmation("");

        // Show success notification
        toast.success("Settings updated successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(response.error || "Failed to update settings", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("An unexpected error occurred", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Call the delete account API
      const response = await DeleteAccountRequest();
      console.log("Delete account response:", response);

      // Close the modal
      setLoading(false);
      setModalOpen(false);

      // Show success message
      toast.success("Account deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setLoading(false);

      // Show error message
      toast.error(
        error.message || "Failed to delete account. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  return (
    <CourtRegistrarLayout
      title="Settings"
      description="Manage your account settings"
    >
      <ToastContainer />
      <div className="relative min-h-screen bg-gray-50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Saving settings...</p>
            </div>
          </div>
        )}
        <div
          className={`max-w-7xl mx-auto p-8 w-full transition-all duration-300 ${
            modalOpen ? "filter blur-sm pointer-events-none select-none" : ""
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <CourtInfoSetting courtinfo={courtinfo} onChange={setCourtinfo} />
            <CourtNumberSetting
              courtnumber={courtnumber}
              onChange={setCourtnumber}
            />
            <JudicialDivisionSetting
              judicialdivision={judicialdivision}
              onChange={setJudicialdivision}
            />
            <PasswordSetting onChange={setPassword} value={password} />
            <PasswordConfirmationSetting onChange={setPasswordConfirmation} />
          </div>
          <div className="flex justify-between items-center mt-8">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-lg font-semibold hover:bg-red-100 transition"
              onClick={() => setModalOpen(true)}
            >
              Delete Account
            </button>
          </div>
          {message && (
            <div
              className={`mt-6 text-center font-semibold ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
        <DeleteAccountModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setLoading(false);
          }}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </CourtRegistrarLayout>
  );
};

export default UserSettingPage;
