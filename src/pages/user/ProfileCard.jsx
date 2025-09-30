/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Container,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import { MdLocationOn, MdFavorite, MdShare, MdMoreVert } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import { getUserProfiles } from "../../components/HomeComponents/UserProfileRecommendations";

export default function ProfileCard() {
  const { id } = useParams();
  const { isLogged } = useContext(AuthContext);

  const profiles = getUserProfiles();
  const profile = profiles.find((p) => p.id === parseInt(id));

  if (!isLogged) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 4,
            p: 6,
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              zIndex: 1,
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ position: "relative", zIndex: 2, mb: 2 }}
          >
            🔒 Access Restricted
          </Typography>
          <Typography
            variant="h6"
            sx={{ position: "relative", zIndex: 2, opacity: 0.9 }}
          >
            Please login to view profile details
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
            borderRadius: 4,
            p: 6,
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={2}>
            🚫 Profile Not Found
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            The profile you're looking for doesn't exist
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6, position: "relative" }}>
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #F75270, #FF7B7B)",
          opacity: 0.1,
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          opacity: 0.1,
          filter: "blur(15px)",
          zIndex: 0,
        }}
      />

      <Card
        sx={{
          borderRadius: 6,
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          zIndex: 1,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          "&:hover": {
            transform: "translateY(-12px) scale(1.02)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #F75270, #FF7B7B, #667eea)",
            zIndex: 2,
          },
        }}
      >
        {/* Action buttons overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 3,
            display: "flex",
            gap: 1,
          }}
        >
        </Box>

        {/* Profile image with overlay gradient */}
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={profile.profileImage}
            alt={profile.name}
            sx={{
              height: 450,
              objectFit: "cover",
              transition: "transform 0.6s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background:
                "linear-gradient(transparent, rgba(0,0,0,0.7), rgba(0,0,0,0.9))",
              zIndex: 1,
            }}
          />
          
          {/* Profile avatar overlay */}
          <Avatar
            src={profile.profileImage}
            alt={profile.name}
            sx={{
              width: 100,
              height: 100,
              position: "absolute",
              bottom: -50,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              border: "6px solid white",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          />
        </Box>

        <CardContent sx={{ textAlign: "center", pt: 8, pb: 4, px: 4 }}>
          {/* Animated name with gradient */}
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg, #F75270 0%, #FF7B7B 50%, #667eea 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 200%",
              animation: "gradientShift 3s ease-in-out infinite",
              "@keyframes gradientShift": {
                "0%, 100%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
              },
              mb: 2,
            }}
          >
            {profile.name}
          </Typography>

          {/* Enhanced age chip */}
          <Chip
            label={`${profile.age} years`}
            sx={{
              px: 3,
              py: 1,
              fontWeight: 700,
              fontSize: "1rem",
              background: "linear-gradient(45deg, #FFE4EC, #F8F4FF)",
              color: "#F75270",
              borderRadius: "20px",
              border: "2px solid rgba(247, 82, 112, 0.2)",
              boxShadow: "0 4px 20px rgba(247, 82, 112, 0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 30px rgba(247, 82, 112, 0.25)",
              },
            }}
          />

          {/* Stylized divider */}
          <Box
            sx={{
              my: 4,
              height: 2,
              background: "linear-gradient(90deg, transparent, #F75270, transparent)",
              borderRadius: 1,
              opacity: 0.6,
            }}
          />

          {/* Enhanced location section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(247, 82, 112, 0.05), rgba(102, 126, 234, 0.05))",
              border: "1px solid rgba(247, 82, 112, 0.1)",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(247, 82, 112, 0.1), rgba(102, 126, 234, 0.1))",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: "50%",
                background: "linear-gradient(45deg, #F75270, #FF7B7B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdLocationOn color="white" size={20} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: "#444",
                letterSpacing: "0.5px",
              }}
            >
              {profile.location}
            </Typography>
          </Box>

          {/* Additional decorative elements */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {[1, 2, 3].map((dot) => (
              <Box
                key={dot}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #F75270, #FF7B7B)",
                  opacity: dot === 2 ? 1 : 0.5,
                  animation: `pulse 2s ease-in-out infinite ${dot * 0.5}s`,
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
                    "50%": { transform: "scale(1.2)", opacity: 1 },
                  },
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}