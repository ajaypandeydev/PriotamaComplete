/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  Instagram,
  Favorite,
  CameraAlt,
  WorkOutline,
  Token,
} from "@mui/icons-material";
import registerImg from "../../../public/assets/registerImg.png";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const storedUser = JSON.parse(localStorage.getItem("userProfile"));

  const [user, setUser] = useState(storedUser || {});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      if (user.imageFile && user.imageFile.preview) {
        URL.revokeObjectURL(user.imageFile.preview);
      }
    };
  }, [user]);

  if (!storedUser) return <Typography>No user data found</Typography>;

  const handleLogout = () => {
    // Clean up preview URL before logout
    if (user.imageFile && user.imageFile.preview) {
      URL.revokeObjectURL(user.imageFile.preview);
    }
    localStorage.removeItem("userProfile");
    logout();
    Swal.fire("👋 Logged out", "You have been logged out.", "info").then(() =>
      navigate("/login")
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("instaId", user.instaId);
      formData.append("hobby", user.hobby);
      formData.append("profession", user.profession);
      formData.append("gender", user.gender);

      if (user.imageFile) {
        formData.append("profilePic", user.imageFile.file);
      }

      const response = await axios.put(
        "https://bitmaxtest.com/api/users/profile",
        formData,
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          : {}
      );

      // Clean up the preview URL after successful upload
      if (user.imageFile && user.imageFile.preview) {
        URL.revokeObjectURL(user.imageFile.preview);
      }

      // Handle profilePic safely - check if it exists in response
      const responseProfilePic = response.data.user?.profilePic;
      let updatedProfilePic = user.profilePic; // Keep existing profilePic as fallback

      if (responseProfilePic && responseProfilePic.url) {
        // If we have a new profilePic from response, use it with cache busting
        updatedProfilePic = {
          ...responseProfilePic,
          url: `${responseProfilePic.url}?v=${Date.now()}`,
        };
      } else if (responseProfilePic === null) {
        // If profilePic is explicitly set to null in response, clear it
        updatedProfilePic = null;
      }
      // If no profilePic in response, keep the existing one

      const updatedUser = { 
        ...user, 
        ...response.data.user, 
        imageFile: null,
        profilePic: updatedProfilePic,
      };
      
      setUser(updatedUser);
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
      setIsEditing(false);

      Swal.fire("Success", "Your profile has been updated", "success");
    } catch (error) {
      console.error("Profile update failed", error.response?.data || error.message);
      Swal.fire("Error", "Failed to update profile", "error");
    }
    finally{
      setLoading(false)
    }
  };

  const handleChange = (field, value) => setUser({ ...user, [field]: value });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Clean up previous preview URL
      if (user.imageFile && user.imageFile.preview) {
        URL.revokeObjectURL(user.imageFile.preview);
      }
      
      const file = e.target.files[0];
      setUser({ 
        ...user, 
        imageFile: {
          file,
          preview: URL.createObjectURL(file)
        } 
      });
    }
  };

  const readOnlyStyle = {
    backgroundColor: "#f0f0f0",
    color: "#555",
    borderRadius: 2,
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#555",
    },
  };

  const location = user.state && user.country ? `${user.state}, ${user.country}` : "";

  // Get avatar source with proper handling and null checks
  const getAvatarSrc = () => {
    if (user.imageFile?.preview) {
      return user.imageFile.preview;
    }
    if (user.profilePic?.url) {
      return user.profilePic.url;
    }
    return registerImg;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #ffe4ec, #e1f5ff)",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 650,
          width: "100%",
          borderRadius: 5,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          overflow: "visible",
          position: "relative",
          bgcolor: "#fff",
          p: 3,
        }}
      >
        {/* Cover Banner */}
        <Box
          sx={{
            height: 160,
            background: "linear-gradient(90deg,#ff6a88,#ff99ac,#a18cd1)",
            borderRadius: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              bottom: -60,
              transform: "translateX(-50%)",
            }}
          >
            <Avatar
              key={avatarSrc} 
              src={avatarSrc}
              alt={user.name}
              sx={{
                width: 130,
                height: 130,
                border: "5px solid #fff",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              }}
            />
            {isEditing && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: -12,
                  background: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  "&:hover": { background: "#f5f5f5" },
                }}
              >
                <CameraAlt fontSize="small" />
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </IconButton>
            )}
          </Box>
        </Box>

        <CardContent sx={{ textAlign: "center", mt: 9 }}>
          {isEditing ? (
            <Grid container spacing={2}>
              {/* Editable Fields */}
              <Grid item xs={12}>
                <TextField fullWidth label="Name" value={user.name || ""} variant="outlined" sx={readOnlyStyle} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Hobby" value={user.hobby || ""} onChange={(e) => handleChange("hobby", e.target.value)} variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Profession" value={user.profession || ""} onChange={(e) => handleChange("profession", e.target.value)} variant="outlined" />
              </Grid>

              {/* Gender & Location Row */}
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Gender" value={user.gender || ""} variant="outlined" onChange={(e) => handleChange("gender", e.target.value)}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Location" value={location} InputProps={{ readOnly: true }} sx={readOnlyStyle} variant="outlined" />
              </Grid>

              {/* Instagram, Email, Phone */}
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Instagram" value={user.instaId || ""} variant="outlined" onChange={(e) => handleChange("instaId", e.target.value)}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" value={user.email || ""} InputProps={{ readOnly: true }} sx={readOnlyStyle} variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" value={user.phone || ""} InputProps={{ readOnly: true }} sx={readOnlyStyle} variant="outlined" />
              </Grid>
            </Grid>
          ) : (
            <>
              <Typography variant="h5" fontWeight={700} color="#333" gutterBottom>
                {user.name}
              </Typography>

              {/* Gender & Location Row */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap", mb: 1 }}>
                {user.gender && (
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {user.gender}
                  </Typography>
                )}
                {location && (
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnOutlined sx={{ fontSize: 16, mr: 0.5 }} /> {location}
                  </Typography>
                )}
              </Box>

              {/* Info Chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, mt: 1 }}>
                {user.hobby && (
                  <Chip icon={<Favorite />} label={user.hobby} sx={{ background: "linear-gradient(45deg,#ff6a88,#ff99ac)", color: "#fff", fontWeight: "bold", "&:hover": { opacity: 0.8 } }} />
                )}
                {user.instaId && (
                  <Chip label={`@${user.instaId}`} icon={<Instagram />} sx={{ background: "linear-gradient(45deg,#a18cd1,#fbc2eb)", color: "#fff", fontWeight: "bold", "&:hover": { opacity: 0.8 } }} />
                )}
                {user.email && (
                  <Chip label={user.email} icon={<EmailOutlined />} sx={{ background: "#e0f7fa", color: "#00796b", fontWeight: "bold" }} />
                )}
                {user.phone && (
                  <Chip label={user.phone} icon={<PhoneOutlined />} sx={{ background: "#e8f5e9", color: "#2e7d32", fontWeight: "bold" }} />
                )}
                {user.profession && (
                  <Chip
                    label={user.profession}
                    icon={<WorkOutline/>}
                    sx={{ background: "#f3e5f5", color: "#6a1b9a", fontWeight: "bold" }}
                  />
                )}

              </Box>
            </>
          )}

          {/* Buttons */}
          <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
            {isEditing ? (
              <Button variant="contained" color="success" onClick={handleSave} sx={{ px: 5, borderRadius: 3, fontWeight: "bold", textTransform: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.25)" } }} disabled={loading}>
                {loading ? (<CircularProgress size={24} sx={{color:'262626'}}/>):(
                  'Save'
                )}
              </Button>
            ) : (
              <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ px: 5, borderRadius: 3, background: "linear-gradient(45deg, #ff6a88,#a18cd1)", fontWeight: "bold", textTransform: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.25)" } }}>
                Edit
              </Button>
            )}

            <Button variant="contained" onClick={handleLogout} sx={{ px: 5, borderRadius: 3, background: "linear-gradient(45deg,#81c784,#aed581)", fontWeight: "bold", textTransform: "none", color: "#333", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.25)" } }}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
