import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#080B14", color: "white", py: 5 }}>
      <Container maxWidth="md">
        <Button onClick={() => navigate("/")} sx={{ mb: 3 }}>
          ← Back to Home
        </Button>

        <Typography variant="h3" fontWeight={800} mb={2}>
          Terms and Conditions
        </Typography>

        <Typography color="#929BB0" mb={4}>
          Last updated: November 23, 2026
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          1. Age Requirement
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          Omegly is intended only for adults aged 18 and above. You must meet
          this requirement to use the service.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          2. User Conduct
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          You agree not to harass, threaten, exploit, impersonate, or abuse
          other users. Do not share illegal, harmful, or non-consensual content.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          3. Personal Safety
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          Never share your password, financial details, private address, or
          other sensitive information with strangers. You interact with other
          users at your own discretion.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          4. Service Availability
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          Omegly may change, suspend, or discontinue features. We do not
          guarantee uninterrupted availability or that a match will always be
          found.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          5. Misuse
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          Access may be restricted where users violate these terms or applicable
          laws. The service's actual reporting, blocking, and enforcement
          processes should be documented here.
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={1}>
          6. Changes to Terms
        </Typography>
        <Typography color="#B0B8C8" mb={3}>
          These terms may be updated as the service develops. Continued use
          after an update means you accept the revised terms, to the extent
          permitted by applicable law.
        </Typography>
      </Container>
    </Box>
  );
}
