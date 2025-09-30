
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(""); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE = "https://bitmaxtest.com/api/auth";

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      Swal.fire("❌ Error", "Please enter your email", "error");
      return;
    }

    try {
      const { data } = await axios.post(`${API_BASE}/forgot-password`, { email });

      if (data.resetToken) {
        setResetToken(data.resetToken);
      }

      Swal.fire("📧 OTP Sent", data.message || "OTP has been sent to your email", "success");
      setStep(2); 
    } catch (error) {
      Swal.fire(
        "❌ Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
    finally{
      setLoading(false)
    }
  };

  // Step 2: Reset Password 
  
  const handleResetPassword = async () => {
  if (!otp || !newPassword || !confirmNewPassword) {
    Swal.fire("❌ Error", "Please fill in all fields", "error");
    return;
  }
  if (newPassword !== confirmNewPassword) {
    Swal.fire("❌ Error", "Passwords do not match!", "error");
    return;
  }

  try {
    const { data } = await axios.post(
      `${API_BASE}/reset-password`,
      {
        email,
        otp,
        newPassword,
        confirmNewPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${resetToken}`,
        },
      }
    );

    Swal.fire("🎉 Success", data.message || "Password reset successful", "success");
    navigate("/login");
  } catch (error) {
    Swal.fire(
      "❌ Error",
      error.response?.data?.message || "Something went wrong",
      "error"
    );
  } finally{
    setLoading(false)
  }
};


  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F2F9FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: "100%", borderRadius: 3, boxShadow: 6, p: 2 }}>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ mb: 3, textAlign: "center", fontWeight: 600, color: "#F75270" }}
          >
            Forget Password
          </Typography>

          {/* Step 1 - Email */}
          {step === 1 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Registered Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope color="#F75270" />
                    </InputAdornment>
                  ),
                }}
                required
              />
              <Button
                variant="contained"
                onClick={handleSendOtp}
                sx={{
                  borderRadius: "20px",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(250deg,rgba(179,229,252,1) 0%, rgba(200,230,201,1) 100%)",
                  color: "#262626",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{color:'262626'}}/>
                ):(
                  'Send OTP'
                )}
              </Button>
            </Box>
          )}

          {/* Step 2 - OTP + Password Reset */}
          {step === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Enter OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaKey color="#F75270" />
                    </InputAdornment>
                  ),
                }}
                required
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock color="#F75270" />
                    </InputAdornment>
                  ),
                }}
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock color="#F75270" />
                    </InputAdornment>
                  ),
                }}
                required
              />
              <Button
                variant="contained"
                onClick={handleResetPassword}
                sx={{
                  borderRadius: "20px",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(250deg,rgba(179,229,252,1) 0%, rgba(200,230,201,1) 100%)",
                  color: "#262626",
                }}
                disabled={loading}
              > {loading ? (
                <CircularProgress size={24} sx={{color:'262626'}}/>
              ): (
                'Reset Password'
              )}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}