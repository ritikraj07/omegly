import { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { keyframes } from "@mui/material/styles";
import {
  Forum,
  Public,
  Security,
  Shuffle,
  ArrowForward,
  ExpandMore,
  Tune,
  Check,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Seo from "../components/Seo";

/* ---------------- Tokens (same as Chat page) ---------------- */
const C = {
  bg: "#150F22",
  surface: "#1E1730",
  surfaceHi: "#281F3F",
  line: "rgba(255,230,210,0.09)",
  text: "#F6EEF8",
  muted: "#A89CC0",
  faint: "#7A6E94",
  coral: "#FF6F61",
  peach: "#FFB07A",
  lilac: "#BFA8FF",
  mint: "#7EE8C7",
};
const FONT_DISPLAY = '"Bricolage Grotesque", "DM Sans", system-ui, sans-serif';
const FONT_BODY = '"DM Sans", system-ui, sans-serif';
const gradient = `linear-gradient(135deg, ${C.coral} 0%, ${C.peach} 100%)`;

const blink = keyframes`
  0%, 80%, 100% { opacity: .25; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
`;

/* ---------------- Content ---------------- */
const FAQS = [
  {
    q: "Is Omegly free to use?",
    a: "Yes. Omegly is free to use and you don't need to create an account to start a text chat.",
  },
  {
    q: "Is Omegly an Omegle alternative?",
    a: "Omegle shut down in November 2023. If you used it to meet random people, Omegly offers a similar idea: one-to-one random chat with strangers. It is an independent service and is not affiliated with Omegle.",
  },
  {
    q: "How is Omegly different from Azar or Monkey?",
    a: "Azar and Monkey are built around video. Omegly is text-first, so you can talk to strangers without turning on a camera or signing up.",
  },
  {
    q: "Can I choose who I talk to?",
    a: "Yes. You can set a gender preference, a country, and an age range before you start, and change them at any time.",
  },
  {
    q: "Is Omegly safe?",
    a: "You can leave any conversation with one click, and we ask everyone to follow the community guidelines. No chat service can guarantee how strangers behave, so never share passwords, financial details or your home address.",
  },
  {
    q: "Who can use Omegly?",
    a: "Omegly is for adults aged 18 and over only.",
  },
];

const FEATURES = [
  {
    icon: <Shuffle />,
    title: "Random one-to-one matching",
    description:
      "Press one button and get paired with someone new. Not feeling it? Skip to the next person.",
    span: { xs: 12, md: 7 },
  },
  {
    icon: <Public />,
    title: "People from everywhere",
    description: "Talk to people from different countries and cultures.",
    span: { xs: 12, md: 5 },
  },
  {
    icon: <Forum />,
    title: "Instant text chat",
    description: "No account and no download. Open the page and start talking.",
    span: { xs: 12, md: 5 },
  },
  {
    icon: <Security />,
    title: "Built with safety in mind",
    description:
      "Community guidelines, adults-only access, and a quick way to leave any chat that feels wrong.",
    span: { xs: 12, md: 7 },
  },
];

const STEPS = [
  {
    title: "Set your preferences",
    body: "Pick who you'd like to meet: gender, country and age range.",
  },
  { title: "Get matched", body: "We pair you with a random person who fits." },
  {
    title: "Chat or skip",
    body: "Keep talking, or move on to someone new any time.",
  },
];

/* ---------------- Shared styles ---------------- */
const primaryBtnSx = {
  background: gradient,
  color: "#2A1020",
  px: 4.5,
  py: 1.6,
  borderRadius: 999,
  fontFamily: FONT_DISPLAY,
  fontWeight: 700,
  fontSize: 17,
  textTransform: "none",
  boxShadow: "0 14px 36px rgba(255,111,97,0.32)",
  transition: "transform .2s ease, box-shadow .2s ease",
  "&:hover": {
    background: gradient,
    transform: "translateY(-2px)",
    boxShadow: "0 18px 44px rgba(255,111,97,0.46)",
  },
  "&:focus-visible": { outline: `2px solid ${C.text}`, outlineOffset: 3 },
};

const ghostBtnSx = {
  color: C.text,
  borderColor: C.line,
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 600,
  "&:hover": { borderColor: C.peach, bgcolor: "rgba(255,176,122,0.08)" },
};

const h2Sx = {
  fontFamily: FONT_DISPLAY,
  fontWeight: 800,
  fontSize: { xs: 30, md: 42 },
  lineHeight: 1.1,
  letterSpacing: -1,
};

const sectionSx = { py: { xs: 7, md: 11 }, scrollMarginTop: 80 };

/* ---------------- Decorative chat preview ---------------- */
function Bubble({ you, children }) {
  return (
    <Box
      sx={{
        alignSelf: you ? "flex-end" : "flex-start",
        maxWidth: "80%",
        px: 2,
        py: 1.1,
        borderRadius: you ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
        color: you ? "#2A1020" : C.text,
        fontWeight: you ? 500 : 400,
        background: you ? gradient : C.surfaceHi,
        border: you ? "none" : `1px solid ${C.line}`,
        fontSize: 15,
        lineHeight: 1.45,
      }}
    >
      {children}
    </Box>
  );
}

function ChatPreview() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        bgcolor: C.surface,
        border: `1px solid ${C.line}`,
        borderRadius: 5,
        overflow: "hidden",
        boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        transform: { md: "rotate(1.5deg)" },
        width: "100%",
        maxWidth: 440,
        mx: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${C.line}` }}
      >
        <Box
          sx={{
            position: "relative",
            width: 42,
            height: 42,
            borderRadius: "15px",
            display: "grid",
            placeItems: "center",
            background: gradient,
            color: "#2A1020",
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 19,
          }}
        >
          ?
          <Box
            sx={{
              position: "absolute",
              right: -3,
              bottom: -3,
              width: 13,
              height: 13,
              borderRadius: "50%",
              bgcolor: C.mint,
              border: `3px solid ${C.surface}`,
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700 }}>
            Stranger
          </Typography>
          <Typography variant="caption" sx={{ color: C.mint }}>
            Online now
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1} sx={{ p: 2.5, minHeight: 270 }}>
        <Bubble>hey! where are you from?</Bubble>
        <Bubble you>Delhi. You?</Bubble>
        <Bubble>Lisbon. Best thing you ate this week?</Bubble>
        <Bubble you>Honestly? Street momos.</Bubble>
        <Box
          sx={{
            alignSelf: "flex-start",
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
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                },
              }}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  );
}

/* ---------------- Page ---------------- */
export default function Home() {
  // Load fonts once (or move this <link> into index.html, which is faster)
  useEffect(() => {
    const id = "omegly-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: C.text,
        fontFamily: FONT_BODY,
        overflow: "hidden",
        scrollBehavior: "smooth",
        background: `
          radial-gradient(800px 480px at 88% -4%, rgba(255,111,97,0.17), transparent 65%),
          radial-gradient(900px 560px at -5% 55%, rgba(191,168,255,0.12), transparent 65%),
          ${C.bg}`,
      }}
    >
      <Seo
        title="Omegly: Free Random Text Chat, an Omegle Alternative"
        description="Talk to strangers online with Omegly, a free random chat. No sign-up, text-only, with gender, country and age filters. A simple alternative to Omegle, Azar and Monkey. 18+."
        path="/"
        faqs={FAQS}
      />

      {/* Header */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          py: 1.75,
          backdropFilter: "blur(16px)",
          bgcolor: "rgba(21,15,34,0.72)",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
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
              omegly
              <Box component="span" sx={{ color: C.coral }}>
                .
              </Box>
            </Typography>

            <Stack
              component="nav"
              aria-label="Main"
              direction="row"
              spacing={3.5}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {[
                ["How it works", "#how-it-works"],
                ["Alternatives", "#alternative"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <Typography
                  key={href}
                  component="a"
                  href={href}
                  sx={{
                    color: C.muted,
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: 15,
                    "&:hover": { color: C.text },
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>

            <Button
              component={RouterLink}
              to="/chat"
              variant="outlined"
              sx={{ ...ghostBtnSx, px: 3 }}
            >
              Start chat
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container component="main" maxWidth="lg">
        {/* Hero */}
        <Box
          component="section"
          aria-labelledby="hero-title"
          sx={{
            py: { xs: 7, md: 13 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: { xs: 7, md: 8 },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              id="hero-title"
              component="h1"
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: { xs: "2.8rem", sm: "3.6rem", md: "4.6rem" },
                lineHeight: 1.02,
                letterSpacing: { xs: -1.5, md: -2.5 },
                mb: 3,
              }}
            >
              Talk to strangers online. No sign-up.
            </Typography>

            <Typography
              sx={{
                color: C.muted,
                fontSize: { xs: 17, md: 20 },
                lineHeight: 1.65,
                maxWidth: 540,
                mb: 4.5,
              }}
            >
              Omegly is a free random chat for meeting new people one-to-one.
              Think of it as a simple Omegle alternative: text-only, instant,
              and you choose who you'd like to meet.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "center" }}
            >
              <Button
                component={RouterLink}
                to="/chat"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={primaryBtnSx}
              >
                Start chatting
              </Button>
              <Typography
                component="a"
                href="#how-it-works"
                sx={{
                  color: C.muted,
                  textDecoration: "none",
                  fontWeight: 600,
                  px: 1,
                  "&:hover": { color: C.text },
                }}
              >
                See how it works
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mt: 4 }}
            >
              {["Free", "No account", "Text chat", "18+ only"].map((t) => (
                <Chip
                  key={t}
                  size="small"
                  icon={
                    <Check
                      sx={{ fontSize: 14, color: `${C.mint} !important` }}
                    />
                  }
                  label={t}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: C.muted,
                    border: `1px solid ${C.line}`,
                    fontWeight: 500,
                  }}
                />
              ))}
            </Stack>
          </Box>

          <ChatPreview />
        </Box>

        {/* How it works */}
        <Box
          component="section"
          id="how-it-works"
          aria-labelledby="how-title"
          sx={sectionSx}
        >
          <Typography id="how-title" component="h2" sx={{ ...h2Sx, mb: 1.5 }}>
            How random chat works on Omegly
          </Typography>
          <Typography sx={{ color: C.muted, mb: 6, maxWidth: 560 }}>
            From opening the page to your first message takes under a minute.
          </Typography>

          <Box
            component="ol"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 4, md: 5 },
            }}
          >
            {STEPS.map((s, i) => (
              <Box
                component="li"
                key={s.title}
                sx={{ borderTop: `1px solid ${C.line}`, pt: 3 }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 800,
                    fontSize: 44,
                    lineHeight: 1,
                    mb: 2,
                    background: gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {i + 1}
                </Typography>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 20,
                    mb: 1,
                  }}
                >
                  {s.title}
                </Typography>
                <Typography sx={{ color: C.muted, lineHeight: 1.7 }}>
                  {s.body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Features */}
        <Box
          component="section"
          aria-labelledby="features-title"
          sx={sectionSx}
        >
          <Typography
            id="features-title"
            component="h2"
            sx={{ ...h2Sx, mb: 6, maxWidth: 640 }}
          >
            Why people choose Omegly
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 2.5,
            }}
          >
            {FEATURES.map((f, i) => (
              <Box
                key={f.title}
                sx={{
                  gridColumn: { xs: "span 12", md: `span ${f.span.md}` },
                  p: { xs: 3, md: 4 },
                  borderRadius: 5,
                  bgcolor: i === 0 ? C.surfaceHi : C.surface,
                  border: `1px solid ${C.line}`,
                  transition: "border-color .25s ease",
                  "&:hover": { borderColor: "rgba(255,176,122,0.4)" },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "16px",
                    mb: 3,
                    color: i === 0 ? "#2A1020" : C.peach,
                    background: i === 0 ? gradient : "rgba(255,176,122,0.1)",
                  }}
                >
                  {f.icon}
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 22,
                    mb: 1,
                  }}
                >
                  {f.title}
                </Typography>
                <Typography
                  sx={{ color: C.muted, lineHeight: 1.7, maxWidth: 480 }}
                >
                  {f.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Alternative / comparison (SEO) */}
        <Box
          component="section"
          id="alternative"
          aria-labelledby="alt-title"
          sx={sectionSx}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 5, md: 8 },
              alignItems: "start",
            }}
          >
            <Box>
              <Typography
                id="alt-title"
                component="h2"
                sx={{ ...h2Sx, mb: 2.5 }}
              >
                Looking for an Omegle alternative?
              </Typography>
              <Typography sx={{ color: C.muted, lineHeight: 1.8, mb: 2 }}>
                Omegle closed in November 2023, and many people have been
                looking for somewhere new to talk to strangers since. Apps like
                Azar and Monkey focus on video. Omegly keeps it simple: a
                text-only random chat that works in your browser.
              </Typography>
              <Typography sx={{ color: C.muted, lineHeight: 1.8, mb: 3 }}>
                Set who you want to meet, get matched, and skip whenever you
                like. No account, no app to install.
              </Typography>
              <Button
                component={RouterLink}
                to="/chat"
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{ ...primaryBtnSx, py: 1.3, px: 3.5, fontSize: 16 }}
              >
                Try Omegly free
              </Button>
              <Typography
                variant="caption"
                sx={{ display: "block", color: C.faint, mt: 3, maxWidth: 460 }}
              >
                Omegly is an independent service and is not affiliated with
                Omegle, Azar, Monkey or any other platform mentioned.
              </Typography>
            </Box>

            <TableContainer
              sx={{
                bgcolor: C.surface,
                border: `1px solid ${C.line}`,
                borderRadius: 4,
              }}
            >
              <Table aria-label="How Omegly compares with video-first chat apps">
                <TableHead>
                  <TableRow>
                    {["", "Omegly", "Video-first apps"].map((h, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          borderColor: C.line,
                          color: i === 1 ? C.peach : C.muted,
                          fontFamily: FONT_DISPLAY,
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    ["Format", "Text chat", "Video"],
                    ["Account", "Not needed", "Usually required"],
                    ["Preferences", "Gender, country, age", "Varies"],
                    ["Price", "Free", "Varies"],
                  ].map(([k, a, b]) => (
                    <TableRow key={k}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ borderColor: C.line, color: C.muted }}
                      >
                        {k}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: C.line,
                          color: C.text,
                          fontWeight: 600,
                        }}
                      >
                        {a}
                      </TableCell>
                      <TableCell sx={{ borderColor: C.line, color: C.muted }}>
                        {b}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* FAQ */}
        <Box
          component="section"
          id="faq"
          aria-labelledby="faq-title"
          sx={sectionSx}
        >
          <Typography id="faq-title" component="h2" sx={{ ...h2Sx, mb: 5 }}>
            Frequently asked questions
          </Typography>
          <Box sx={{ maxWidth: 820 }}>
            {FAQS.map((f) => (
              <Accordion
                key={f.q}
                disableGutters
                elevation={0}
                square
                sx={{
                  bgcolor: "transparent",
                  color: C.text,
                  borderTop: `1px solid ${C.line}`,
                  "&:last-of-type": { borderBottom: `1px solid ${C.line}` },
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: C.muted }} />}
                  sx={{ py: 1 }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {f.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 3 }}>
                  <Typography sx={{ color: C.muted, lineHeight: 1.75 }}>
                    {f.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Safety */}
        <Box
          component="section"
          aria-labelledby="safety-title"
          sx={{
            my: { xs: 4, md: 6 },
            p: { xs: 4, md: 7 },
            borderRadius: 6,
            bgcolor: C.surface,
            border: `1px solid ${C.line}`,
            backgroundImage:
              "radial-gradient(500px 260px at 100% 0%, rgba(255,111,97,0.13), transparent 70%)",
          }}
        >
          <Security sx={{ fontSize: 34, color: C.peach, mb: 2 }} />
          <Typography id="safety-title" component="h2" sx={{ ...h2Sx, mb: 2 }}>
            Chat responsibly
          </Typography>
          <Typography
            sx={{ color: C.muted, maxWidth: 650, lineHeight: 1.8, mb: 3 }}
          >
            Be respectful, protect your personal information, and leave any
            conversation that makes you uncomfortable. Never share passwords,
            financial details, or your private address.
          </Typography>
          <Typography sx={{ color: C.peach, fontWeight: 700 }}>
            Omegly is intended for adults aged 18 and above.
          </Typography>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{ py: 6, mt: 6, borderTop: `1px solid ${C.line}` }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Typography sx={{ color: C.faint }} variant="body2">
              © {new Date().getFullYear()} Omegly. All rights reserved.
            </Typography>
            <Stack
              component="nav"
              aria-label="Legal"
              direction="row"
              spacing={1}
            >
              <Button
                component={RouterLink}
                to="/privacy"
                size="small"
                sx={{
                  color: C.muted,
                  textTransform: "none",
                  "&:hover": { color: C.text },
                }}
              >
                Privacy Policy
              </Button>
              <Button
                component={RouterLink}
                to="/terms"
                size="small"
                sx={{
                  color: C.muted,
                  textTransform: "none",
                  "&:hover": { color: C.text },
                }}
              >
                Terms
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
