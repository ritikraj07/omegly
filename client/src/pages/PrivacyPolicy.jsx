import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo";

// Privacy page



export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#080B14", color: "white", py: 5 }}>
<Seo title="Privacy Policy | Omegly" description="How Omegly handles your data and privacy." path="/privacy" />
      <Container maxWidth="md">
        <Button onClick={() => navigate("/")} sx={{ mb: 3 }}>
          ← Back to Home
        </Button>

        <Typography variant="h3" fontWeight={800} mb={2}>
          Privacy Policy
        </Typography>

        <Typography color="#929BB0" mb={4}>
          Last updated: November 23, 2026
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          1. Introduction
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          This policy explains how Omegly handles information when you use our
          anonymous text-chat service.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          2. Information You Provide
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          You may provide profile preferences such as age, gender, country, and
          interests to help match you with other users. Do not enter passwords,
          financial information, or other sensitive personal data.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          3. Chat Messages
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          Do not assume conversations are private or confidential. Avoid sharing
          information that could identify or expose you. The actual handling and
          retention of chat data will depend on the service's implemented
          technical and moderation policies.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          4. Cookies and Technical Data
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          The service or its hosting providers may process technical information
          such as IP addresses, connection details, and security logs. Update
          this section to reflect the actual analytics, cookies, and logging
          tools used by Omegly.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          5. Third-Party Services
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          Omegly may rely on hosting or infrastructure providers to operate the
          service. Their handling of data is subject to their own policies and
          applicable agreements.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          6. Contact
        </Typography>
        <Typography color="#B0B8C8">
          Add an official Omegly contact email here before publishing this
          policy.
        </Typography>
      </Container>
    </Box>
  );
}
