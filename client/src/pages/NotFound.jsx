import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#080B14",
        color: "white",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
      }}
    >
      <Container>
        <Typography
          sx={{
            fontSize: { xs: 90, md: 140 },
            fontWeight: 900,
            color: "#8B7CFF",
          }}
        >
          404
        </Typography>

        <Typography variant="h4" fontWeight={700} mb={2}>
          Page not found
        </Typography>

        <Typography color="#929BB0" mb={4}>
          The page you are looking for doesn't exist.
        </Typography>

        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Container>
    </Box>
  );
}
