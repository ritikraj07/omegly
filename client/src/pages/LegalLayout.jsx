import { Box, Container, Typography, Stack, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Seo from "./Seo";

const C = {
  bg: "#150F22",
  line: "rgba(255,230,210,0.09)",
  text: "#F6EEF8",
  muted: "#A89CC0",
  faint: "#7A6E94",
  coral: "#FF6F61",
  peach: "#FFB07A",
};
const FONT_DISPLAY = '"Bricolage Grotesque", "DM Sans", system-ui, sans-serif';
const FONT_BODY = '"DM Sans", system-ui, sans-serif';

/**
 * Shared page shell for Privacy and Terms.
 *
 * <LegalLayout
 *   seo={{ title, description, path }}
 *   title="Privacy Policy"
 *   updated="November 23, 2026"
 *   sections={[{ heading: "Introduction", body: "..." }]}
 * />
 */
export default function LegalLayout({ seo, title, updated, sections }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: C.text,
        fontFamily: FONT_BODY,
        background: `
          radial-gradient(700px 420px at 90% -5%, rgba(255,111,97,0.14), transparent 65%),
          radial-gradient(800px 500px at 0% 105%, rgba(191,168,255,0.1), transparent 65%),
          ${C.bg}`,
      }}
    >
      <Seo {...seo} />

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Top bar */}
        <Stack
          component="header"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: { xs: 5, md: 8 } }}
        >
          <Typography
            component={RouterLink}
            to="/"
            aria-label="Omegly home"
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: -1,
              color: C.text,
              textDecoration: "none",
            }}
          >
            omegly<Box component="span" sx={{ color: C.coral }}>.</Box>
          </Typography>

          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
            variant="outlined"
            size="small"
            sx={{
              color: C.text,
              borderColor: C.line,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { borderColor: C.peach, bgcolor: "rgba(255,176,122,0.08)" },
            }}
          >
            Back to home
          </Button>
        </Stack>

        <Box component="main" sx={{ maxWidth: 760 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: { xs: 38, md: 56 },
              lineHeight: 1.05,
              letterSpacing: -1.5,
              mb: 1.5,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ color: C.faint, mb: { xs: 5, md: 7 } }}>
            Last updated: {updated}
          </Typography>

          {sections.map((s, i) => (
            <Box
              component="section"
              key={s.heading}
              sx={{ borderTop: `1px solid ${C.line}`, py: 3.5 }}
            >
              <Typography
                component="h2"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: 22,
                  mb: 1.25,
                }}
              >
                <Box component="span" sx={{ color: C.peach, mr: 1.25 }}>
                  {i + 1}.
                </Box>
                {s.heading}
              </Typography>
              <Typography sx={{ color: C.muted, lineHeight: 1.85 }}>{s.body}</Typography>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Stack
          component="footer"
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mt: 8, pt: 4, borderTop: `1px solid ${C.line}` }}
        >
          <Typography variant="body2" sx={{ color: C.faint }}>
            © {new Date().getFullYear()} Omegly
          </Typography>
          <Stack component="nav" aria-label="Legal" direction="row" spacing={3}>
            {[
              ["Privacy Policy", "/privacy"],
              ["Terms", "/terms"],
            ].map(([label, to]) => (
              <Typography
                key={to}
                component={RouterLink}
                to={to}
                variant="body2"
                sx={{ color: C.muted, textDecoration: "none", "&:hover": { color: C.text } }}
              >
                {label}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
