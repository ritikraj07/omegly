import { Box, Button, Typography, Container, Stack } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Seo from "../components/Seo";

const C = {
  bg: "#150F22",
  surfaceHi: "#281F3F",
  line: "rgba(255,230,210,0.09)",
  text: "#F6EEF8",
  muted: "#A89CC0",
  coral: "#FF6F61",
  peach: "#FFB07A",
};
const FONT_DISPLAY = '"Bricolage Grotesque", "DM Sans", system-ui, sans-serif';
const FONT_BODY = '"DM Sans", system-ui, sans-serif';
const gradient = `linear-gradient(135deg, ${C.coral} 0%, ${C.peach} 100%)`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
  50%      { transform: translateY(-14px) rotate(var(--r, 0deg)); }
`;
const ripple = keyframes`
  0%   { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(1.7); opacity: 0; }
`;
const blink = keyframes`
  0%, 80%, 100% { opacity: .25; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
`;
const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
`;
const still = {
  "@media (prefers-reduced-motion: reduce)": { animation: "none !important" },
};

const digitSx = {
  display: "inline-block",
  fontFamily: FONT_DISPLAY,
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: -4,
  background: gradient,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: C.text,
        fontFamily: FONT_BODY,
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        overflow: "hidden",
        py: 6,
        background: `
          radial-gradient(700px 420px at 90% -5%, rgba(255,111,97,0.16), transparent 65%),
          radial-gradient(800px 500px at 0% 105%, rgba(191,168,255,0.12), transparent 65%),
          ${C.bg}`,
      }}
    >
      <Seo title="Page not found | Omegly" path="/404" noindex />

      <Container maxWidth="sm">
        {/* 4 (radar) 4 */}
        <Box
          role="img"
          aria-label="404"
          sx={{
            fontSize: { xs: 110, sm: 170 },
            display: "inline-flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            mb: 4,
          }}
        >
          <Box
            sx={{
              ...digitSx,
              "--r": "-4deg",
              animation: `${float} 5s ease-in-out infinite`,
              ...still,
            }}
          >
            4
          </Box>

          <Box sx={{ position: "relative", display: "inline-flex" }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "0.9em",
                  height: "0.9em",
                  mt: "-0.45em",
                  ml: "-0.45em",
                  borderRadius: "50%",
                  border: `2px solid ${C.coral}`,
                  animation: `${ripple} 3s ease-out ${i}s infinite`,
                  ...still,
                }}
              />
            ))}
            <Box
              sx={{
                ...digitSx,
                "--r": "0deg",
                animation: `${float} 5s ease-in-out .6s infinite`,
                ...still,
              }}
            >
              0
            </Box>
          </Box>

          <Box
            sx={{
              ...digitSx,
              "--r": "4deg",
              animation: `${float} 5s ease-in-out 1.2s infinite`,
              ...still,
            }}
          >
            4
          </Box>
        </Box>

        {/* Chat flavour */}
        <Stack
          spacing={1}
          alignItems="center"
          sx={{ mb: 4, animation: `${rise} .6s ease-out .2s both`, ...still }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.1,
              borderRadius: "20px 20px 20px 6px",
              bgcolor: C.surfaceHi,
              border: `1px solid ${C.line}`,
              color: C.text,
            }}
          >
            hey… are you lost?
          </Box>
          <Box
            aria-hidden="true"
            sx={{
              display: "flex",
              gap: 0.6,
              px: 2,
              py: 1.5,
              borderRadius: "20px 20px 20px 6px",
              bgcolor: C.surfaceHi,
              border: `1px solid ${C.line}`,
            }}
          >
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: C.muted,
                  animation: `${blink} 1.2s ease-in-out ${i * 0.15}s infinite`,
                  ...still,
                }}
              />
            ))}
          </Box>
        </Stack>

        <Box sx={{ animation: `${rise} .6s ease-out .4s both`, ...still }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: { xs: 28, md: 36 },
              letterSpacing: -0.8,
              mb: 1.5,
            }}
          >
            This page wandered off
          </Typography>
          <Typography sx={{ color: C.muted, mb: 4 }}>
            The page you're looking for doesn't exist or has moved.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
          >
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              sx={{
                background: gradient,
                color: "#2A1020",
                px: 4,
                py: 1.3,
                borderRadius: 999,
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 12px 32px rgba(255,111,97,0.32)",
                "&:hover": {
                  background: gradient,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Back to home
            </Button>
            <Button
              component={RouterLink}
              to="/chat"
              variant="outlined"
              sx={{
                color: C.text,
                borderColor: C.line,
                px: 4,
                py: 1.3,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: C.peach,
                  bgcolor: "rgba(255,176,122,0.08)",
                },
              }}
            >
              Start chatting
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
