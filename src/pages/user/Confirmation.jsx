import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, TextField,
  Button, InputAdornment,
  CircularProgress
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FaLock } from "react-icons/fa";
import { useNavigate,} from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: { main: "#8CCDED" },
    secondary: { main: "#F75270" },
    background: { default: "#F2F9FF", paper: "#FFF5F2" },
    text: { primary: "#262626", secondary: "#FAA4BD" },
  },
  typography: { fontFamily: "'Poppins', serif" },
});

function Confirmation() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const pendingUser = JSON.parse(sessionStorage.getItem("pendingUser"));
    if(!pendingUser){
      navigate('/register');
    } else{
      setUserData(pendingUser);
    }
  }, [navigate]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!otp) {
      Swal.fire({title: 'Please Enter OTP', icon: 'warning'});
      return
      }

      try{
        const tempId = userData?.tempId || userData?._id;

        const response = await axios.post(`https://bitmaxtest.com/api/auth/verify-otp`,{
          tempId,
          otp,
        });
        localStorage.setItem("userProfile", JSON.stringify(response.data.userData));
        sessionStorage.removeItem("pendingUser");
        Swal.fire("🎉 Registration successful", "success")
        navigate("/login");
      }
      catch(err){
        Swal.fire(" Invalid OTP", `${err.response?.data?.message}` || "Please enter the correct OTP", "error");
      }
      finally{
        setLoading(false)
      }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh", bgcolor: theme.palette.background.default,
          display: "flex", alignItems: "center", justifyContent: "center", p: 2,
        }}
      >
        <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: 6 }}>
          <CardContent sx={{ bgcolor: theme.palette.background.paper, p: 4 }}>
            <Typography variant="h4" textAlign="center" fontWeight={700} color="secondary" gutterBottom>
              Confirm OTP
            </Typography>
            <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
              Enter the 6-digit OTP sent to your email
            </Typography>

            <Box component="form" onSubmit={handleConfirm} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock color="#F75270" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained"
                sx={{
                  borderRadius: "20px", fontWeight: "bold",
                  background: "linear-gradient(250deg,#B3E5FC 0%,#C8E6C9 100%)",
                  color: "#262626", "&:hover": { transform: "scale(1.05)", boxShadow: "0 6px 15px rgba(0,0,0,0.2)" },
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{color: '#262626'}}/>
                ):(
                  "Confirm OTP"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
export default Confirmation;
