import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  FaUser,
  FaEnvelope,
  FaHeart,
  FaInstagram,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import { Country, State } from "country-state-city";
import ReactCountryFlag from "react-country-flag";
import registerImg from "../../../public/assets/registerImg.png";
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

export default function Register() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:900px)");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    country: null,
    state: null,
    profession: "",
    hobby: "",
    instagram: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.isoCode,
      phonecode: c.phonecode,
      maxLength: c.phoneNumberLength || 10,
    }));
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (formData.country) {
      const countryStates = State.getStatesOfCountry(formData.country.value);
      setStates(
        countryStates.map((s) => ({ label: s.name, value: s.isoCode }))
      );
    } else {
      setStates([]);
    }
    setFormData((prev) => ({ ...prev, state: null, phone: "" }));
  }, [formData.country]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((prev) => ({ ...prev, profilePic: file }));
    reader.readAsDataURL(file);
    setPreview(URL.createObjectURL(file))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      age,
      gender,
      email,
      phone,
      country,
      state,
      profession,
      hobby,
      instagram,
      password,
      confirmPassword,
      profilePic,
    } = formData;

    if (
      !name ||
      !age ||
      !gender ||
      !email ||
      !phone ||
      !country ||
      !state ||
      !profession ||
      !hobby ||
      !instagram ||
      !password ||
      !confirmPassword ||
      !profilePic
    ) {
      Swal.fire(`⚠️ Please fill all fields`);
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire("❌ Passwords do not match");
      return;
    }
    if (Number(age) < 18) {
      Swal.fire("⚠️ You must be at least 18 years old to register");
      return;
    }

    try {
      // FormData for file upload
      const data = new FormData();
      const formattedPhone = `+${country.phonecode}${phone}`;
      data.append("name", name);
      data.append("email", email);
      data.append("phone", formattedPhone);
      data.append("country", country.label);
      data.append("code", country.value);
      data.append("state", state.label);
      data.append("gender", gender);
      data.append("age", age);
      data.append("profilePic", profilePic);
      data.append("instaId", instagram);
      data.append("hobby", hobby);
      data.append("password", password);
      data.append("confirmPassword", confirmPassword);
      data.append("profession", profession);

      const res = await axios.post(
        "https://bitmaxtest.com/api/auth/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      sessionStorage.setItem("pendingUser", JSON.stringify(res.data));
      navigate("/confirmation", { state: { tempId: res.data.tempId } });
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally{
      setLoading(false)
    }
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      borderColor: "#F75270",
      minHeight: 56,
      height: 56,
      backgroundColor: "#FFF5F2",
      boxShadow: "none",
      "&:hover": { borderColor: "#F75270" },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: 56,
      padding: "0 12px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F2F9FF" : "white",
      color: "#262626",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      color: "#262626",
    }),
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: isMobile ? 1 : 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 1000,
            width: "100%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <Box
            sx={{
              flex: isMobile ? "unset" : 1,
              width: isMobile ? "100%" : "auto",
              bgcolor: "#B3D8A8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: isMobile ? 2 : 4,
            }}
          >
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <img
                src={preview || registerImg}
                alt="Register preview"
                style={{
                  width: isMobile ? "100%" : isTablet ? "250px" : "300px",
                  maxWidth: "100%",
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    borderRadius: "12px",
                    color: "#262626",
                    border: "2px solid #F75270",
                    px: 3,
                    py: 1,
                  }}
                >
                  Upload Photo
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Box>
          </Box>

          <CardContent
            sx={{ flex: 2, bgcolor: "#FFF5F2", p: isMobile ? 2 : 4 }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: 700,
                textAlign: "center",
                mb: 2,
              }}
            >
              Create Your Account
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              }}
            >
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ marginRight: 8, color: "#F75270" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope
                        style={{ marginRight: 8, color: "#F75270" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, age: value }));
                }}
                inputProps={{ min: 18 }}
              />

              <Select
                options={countries}
                value={formData.country}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    country: val,
                    phone: "",
                    state: null,
                  }))
                }
                placeholder="Select Country"
                isSearchable
                styles={selectStyles}
              />
              <Select
                options={states}
                value={formData.state}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, state: val }))
                }
                placeholder="Select State"
                isSearchable
                isDisabled={!formData.country}
                styles={selectStyles}
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => {
                  if (!formData.country) return;
                  const value = e.target.value.replace(/\D/g, "");
                  const maxLength = formData.country?.maxLength || 10;
                  if (value.length > maxLength) return;
                  setFormData((prev) => ({ ...prev, phone: value }));
                }}
                disabled={!formData.country}
                InputProps={{
                  startAdornment: formData.country && (
                    <InputAdornment
                      position="start"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <ReactCountryFlag
                        countryCode={formData.country.value}
                        svg
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: 8,
                        }}
                      />
                      +{formData.country.phonecode}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Hobby"
                name="hobby"
                value={formData.hobby}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaHeart style={{ marginRight: 8, color: "#F75270" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Instagram ID"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaInstagram
                        style={{ marginRight: 8, color: "#F75270" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ marginRight: 8, color: "#F75270" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <FaEyeSlash color="#F75270" />
                        ) : (
                          <FaEye color="#8CCDED" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ marginRight: 8, color: "#F75270" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  gridColumn: isMobile ? "span 1" : "span 2",
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#F75270",
                    color: "#fff",
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: "1rem",
                    "&:hover": { bgcolor: "#C2185B" },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{color: "#262626"}}/>
                  ):(
                    "Register"
                  )}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
