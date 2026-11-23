import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  TextField,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  Drawer,
  useMediaQuery,
  useTheme,
  Chip,
  Dialog,
  DialogContent,
  Autocomplete,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { keyframes } from "@mui/material/styles";
import {
  Send,
  SkipNext,
  Stop,
  ArrowBack,
  Tune,
  Close,
  Search,
  Forum,
  Flag,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";

/* ---------------- Design tokens ---------------- */
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

const MAX_LEN = 1000;
const STORAGE_KEY = "omegly:prefs:v1";

const defaultProfile = { gender: "male", age: 23, country: "India", tags: [] };
const initialFilters = {
  gender: "any",
  country: "any",
  minAge: 18,
  maxAge: 99,
};
const initialConsent = {
  adultConfirmed: false,
  respectConfirmed: false,
  safetyConfirmed: false,
};

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

/* ---------------- Helpers ---------------- */
function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return {
      profile: { ...defaultProfile, ...d.profile },
      filters: { ...initialFilters, ...d.filters },
      consent: { ...initialConsent, ...d.consent },
    };
  } catch {
    return null;
  }
}

function savePrefs(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable: ignore */
  }
}

const allTrue = (o) => Object.values(o).every(Boolean);

function formatTime(t) {
  if (!t) return "";
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const genderLabel = (g) =>
  g === "any"
    ? "Anyone"
    : g === "male"
      ? "Men"
      : g === "female"
        ? "Women"
        : "Other";

/* ---------------- Animations ---------------- */
const ripple = keyframes`
  0%   { transform: scale(0.35); opacity: 0.55; }
  100% { transform: scale(1.5);  opacity: 0; }
`;
const orbit = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const popIn = keyframes`
  from { opacity: 0; transform: translateY(6px) scale(0.98); }
  to   { opacity: 1; transform: none; }
`;
const blink = keyframes`
  0%, 80%, 100% { opacity: .25; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
`;
const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": { animation: "none !important" },
};

/* ---------------- Shared styles ---------------- */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "rgba(255,255,255,0.03)",
    color: C.text,
    "& fieldset": { borderColor: C.line },
    "&:hover fieldset": { borderColor: "rgba(255,176,122,0.45)" },
    "&.Mui-focused fieldset": { borderColor: C.peach },
  },
  "& .MuiInputLabel-root": { color: C.muted },
  "& .MuiInputLabel-root.Mui-focused": { color: C.peach },
  "& .MuiSvgIcon-root": { color: C.muted },
  "& .MuiInputBase-input": { color: C.text },
  "& .MuiFormHelperText-root": { color: "#FFB4AB" },
};

const menuPaperSx = {
  bgcolor: C.surfaceHi,
  color: C.text,
  border: `1px solid ${C.line}`,
  "& .MuiAutocomplete-option": { fontSize: 14 },
  "& .MuiAutocomplete-option.Mui-focused": {
    bgcolor: "rgba(255,176,122,0.12)",
  },
  "& .MuiAutocomplete-option[aria-selected='true']": {
    bgcolor: "rgba(255,111,97,0.18)",
  },
  "& .MuiAutocomplete-noOptions": { color: C.muted },
};

const primaryBtnSx = {
  background: gradient,
  color: "#2A1020",
  px: 4,
  py: 1.4,
  borderRadius: 999,
  fontFamily: FONT_DISPLAY,
  fontWeight: 700,
  fontSize: 16,
  textTransform: "none",
  boxShadow: "0 12px 32px rgba(255,111,97,0.32)",
  transition: "transform .2s ease, box-shadow .2s ease",
  "&:hover": {
    background: gradient,
    transform: "translateY(-2px)",
    boxShadow: "0 16px 40px rgba(255,111,97,0.45)",
  },
  "&.Mui-disabled": {
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.3)",
    boxShadow: "none",
  },
  "&:focus-visible": { outline: `2px solid ${C.text}`, outlineOffset: 3 },
};

const ghostBtnSx = {
  color: C.text,
  borderColor: C.line,
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 600,
  minWidth: 0,
  "&:hover": { borderColor: C.peach, bgcolor: "rgba(255,176,122,0.08)" },
  "&.Mui-disabled": { borderColor: C.line, color: "rgba(255,255,255,0.25)" },
};

const dangerBtnSx = {
  ...ghostBtnSx,
  color: "#FFB4AB",
  borderColor: "rgba(255,111,97,0.35)",
  "&:hover": { borderColor: C.coral, bgcolor: "rgba(255,111,97,0.1)" },
};

const sectionTitleSx = {
  fontFamily: FONT_DISPLAY,
  fontWeight: 700,
  fontSize: 15,
  color: C.text,
  mb: 1.5,
};

const toggleSx = {
  width: "100%",
  "& .MuiToggleButton-root": {
    flex: 1,
    textTransform: "none",
    color: C.muted,
    borderColor: C.line,
    py: 0.9,
    fontWeight: 600,
    "&:first-of-type": { borderRadius: "999px 0 0 999px" },
    "&:last-of-type": { borderRadius: "0 999px 999px 0" },
    "&.Mui-selected": {
      color: "#2A1020",
      background: gradient,
      borderColor: "transparent",
      "&:hover": { background: gradient },
    },
  },
};

const checkboxSx = {
  alignItems: "flex-start",
  mx: 0,
  "& .MuiCheckbox-root": { color: C.faint, py: 0.5 },
  "& .Mui-checked": { color: `${C.peach} !important` },
};

/* ---------------- Two-tap confirm button ----------------
   First tap arms it ("Sure?"), second tap confirms. Resets after 2.5s.
   Prevents accidentally dropping a good conversation. */
function ConfirmButton({
  icon,
  label,
  armedLabel = "Sure?",
  needsConfirm,
  onConfirm,
  disabled,
  tooltip,
  sx,
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (disabled) setArmed(false);
  }, [disabled]);

  const handle = () => {
    if (!needsConfirm || armed) {
      clearTimeout(timer.current);
      setArmed(false);
      onConfirm();
      return;
    }
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), 2500);
  };

  return (
    <Tooltip title={armed ? "Tap again to confirm" : tooltip}>
      <span>
        <Button
          variant="outlined"
          size="small"
          onClick={handle}
          disabled={disabled}
          aria-label={label}
          sx={{
            ...sx,
            ...(armed && {
              bgcolor: "rgba(255,176,122,0.16)",
              borderColor: C.peach,
            }),
          }}
        >
          <Stack direction="row" spacing={0.75} alignItems="center">
            {icon}
            <Box
              component="span"
              sx={{ display: armed ? "inline" : { xs: "none", sm: "inline" } }}
            >
              {armed ? armedLabel : label}
            </Box>
          </Stack>
        </Button>
      </span>
    </Tooltip>
  );
}

/* ---------------- Form body (setup dialog + mobile drawer) ---------------- */
function FormBody({ p, f, c, onProfile, onFilter, onConsent }) {
  const ageInvalid = !Number.isInteger(p.age) || p.age < 18 || p.age > 99;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={sectionTitleSx}>About you</Typography>
        <ToggleButtonGroup
          exclusive
          value={p.gender}
          onChange={(_, v) => v && onProfile("gender", v)}
          sx={{ ...toggleSx, mb: 2 }}
          aria-label="Your gender"
        >
          <ToggleButton value="male">Male</ToggleButton>
          <ToggleButton value="female">Female</ToggleButton>
          <ToggleButton value="other">Other</ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            size="small"
            type="number"
            label="Age"
            value={p.age}
            onChange={(e) => onProfile("age", Number(e.target.value))}
            inputProps={{ min: 18, max: 99 }}
            error={ageInvalid}
            helperText={ageInvalid ? "18–99" : " "}
            sx={{ ...fieldSx, width: 110 }}
          />
          <Autocomplete
            fullWidth
            options={COUNTRIES}
            value={p.country || null}
            onChange={(_, v) => onProfile("country", v || "")}
            size="small"
            sx={fieldSx}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                placeholder="Search…"
                helperText=" "
              />
            )}
            PaperProps={{ sx: menuPaperSx }}
          />
        </Stack>
      </Box>

      <Divider sx={{ borderColor: C.line }} />

      <Box>
        <Typography sx={sectionTitleSx}>Who you'd like to meet</Typography>
        <ToggleButtonGroup
          exclusive
          value={f.gender}
          onChange={(_, v) => v && onFilter("gender", v)}
          sx={{ ...toggleSx, mb: 2 }}
          aria-label="Gender preference"
        >
          <ToggleButton value="any">Anyone</ToggleButton>
          <ToggleButton value="male">Men</ToggleButton>
          <ToggleButton value="female">Women</ToggleButton>
          <ToggleButton value="other">Other</ToggleButton>
        </ToggleButtonGroup>

        <Autocomplete
          options={["any", ...COUNTRIES]}
          value={f.country}
          onChange={(_, v) => onFilter("country", v || "any")}
          size="small"
          sx={{ ...fieldSx, mb: 2.5 }}
          getOptionLabel={(o) => (o === "any" ? "Any country" : o)}
          renderInput={(params) => (
            <TextField {...params} label="Country" placeholder="Search…" />
          )}
          PaperProps={{ sx: menuPaperSx }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Typography variant="body2" sx={{ color: C.muted }}>
            Age range
          </Typography>
          <Typography
            sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.peach }}
          >
            {f.minAge} – {f.maxAge === 99 ? "99+" : f.maxAge}
          </Typography>
        </Stack>
        <Slider
          value={[f.minAge, f.maxAge]}
          min={18}
          max={99}
          onChange={(_, [lo, hi]) => {
            onFilter("minAge", lo);
            onFilter("maxAge", hi);
          }}
          disableSwap
          getAriaLabel={() => "Age range"}
          sx={{
            color: C.peach,
            mx: 0.5,
            "& .MuiSlider-rail": {
              bgcolor: "rgba(255,255,255,0.12)",
              opacity: 1,
            },
            "& .MuiSlider-thumb": {
              bgcolor: C.text,
              border: `3px solid ${C.coral}`,
              boxShadow: "0 0 0 6px rgba(255,111,97,0.12)",
            },
          }}
        />
      </Box>

      <Divider sx={{ borderColor: C.line }} />

      <Box>
        <Typography sx={sectionTitleSx}>Before you start</Typography>
        <Stack>
          {[
            ["adultConfirmed", "I'm 18 or older."],
            ["respectConfirmed", "I'll be respectful to other people."],
            ["safetyConfirmed", "I've read the safety guidelines."],
          ].map(([key, label]) => (
            <FormControlLabel
              key={key}
              sx={checkboxSx}
              control={
                <Checkbox
                  size="small"
                  checked={c[key]}
                  onChange={(e) => onConsent(key, e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: C.text, pt: 0.4 }}>
                  {label}
                </Typography>
              }
            />
          ))}
        </Stack>
        <Typography
          sx={{ color: C.faint, mt: 1 }}
          variant="caption"
          display="block"
        >
          These checkboxes don't verify your age.
        </Typography>
      </Box>
    </Stack>
  );
}

/* ---------------- States ---------------- */
function SearchingState({ elapsed, onCancel, onEditPrefs }) {
  return (
    <Box sx={{ m: "auto", textAlign: "center", py: 4, px: 2 }}>
      <Box
        sx={{
          position: "relative",
          width: 160,
          height: 160,
          mx: "auto",
          mb: 3,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid ${C.coral}`,
              animation: `${ripple} 2.4s ease-out ${i * 0.8}s infinite`,
              ...reduceMotion,
            }}
          />
        ))}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            animation: `${orbit} 4s linear infinite`,
            ...reduceMotion,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 6,
              left: "50%",
              width: 12,
              height: 12,
              ml: "-6px",
              borderRadius: "50%",
              bgcolor: C.mint,
              boxShadow: `0 0 14px ${C.mint}`,
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 48,
            borderRadius: "50%",
            background: gradient,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 10px 30px rgba(255,111,97,0.4)",
          }}
        >
          <Search sx={{ color: "#2A1020" }} />
        </Box>
      </Box>

      <Typography
        sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20 }}
      >
        Finding someone for you
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: C.muted, mt: 0.5, mb: 2 }}
        aria-live="polite"
      >
        {elapsed < 20
          ? `Searching… ${elapsed}s`
          : "Taking a while. Try widening your country or age range."}
      </Typography>

      <Stack direction="row" spacing={1} justifyContent="center">
        {elapsed >= 20 && (
          <Button
            onClick={onEditPrefs}
            variant="outlined"
            size="small"
            sx={ghostBtnSx}
          >
            Edit preferences
          </Button>
        )}
        <Button
          onClick={onCancel}
          variant="outlined"
          size="small"
          sx={ghostBtnSx}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}

function IdleState({ onFind, disabled, summary, onEditPrefs, needsSetup }) {
  return (
    <Box sx={{ m: "auto", textAlign: "center", px: 2, py: 4, maxWidth: 420 }}>
      <Box
        sx={{
          width: 84,
          height: 84,
          mx: "auto",
          mb: 3,
          borderRadius: "28px",
          transform: "rotate(-6deg)",
          background:
            "linear-gradient(135deg, rgba(255,111,97,0.25), rgba(191,168,255,0.2))",
          border: `1px solid ${C.line}`,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Forum sx={{ fontSize: 38, color: C.peach }} />
      </Box>
      <Typography
        component="h1"
        sx={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: { xs: 28, md: 34 },
          lineHeight: 1.1,
          letterSpacing: -0.8,
        }}
      >
        Say hi to someone new
      </Typography>
      <Typography sx={{ color: C.muted, mt: 1.5, mb: 3 }}>
        You'll be matched with a random person who fits your preferences.
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 3.5 }}
      >
        {summary.map((s) => (
          <Chip
            key={s}
            size="small"
            label={s}
            onClick={onEditPrefs}
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              color: C.muted,
              border: `1px solid ${C.line}`,
              fontWeight: 500,
              cursor: "pointer",
            }}
          />
        ))}
      </Stack>

      <Button
        variant="contained"
        onClick={onFind}
        disabled={disabled}
        sx={primaryBtnSx}
      >
        Find a stranger
      </Button>
      {disabled && (
        <Typography
          variant="caption"
          display="block"
          sx={{ color: C.faint, mt: 1.5 }}
        >
          {needsSetup
            ? "Accept the three checkboxes in preferences to start."
            : "Connecting to the server…"}
        </Typography>
      )}
    </Box>
  );
}

/* ---------------- Main component ---------------- */
export default function Chat() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    connected,
    status,
    messages,
    error,
    findStranger,
    sendMessage,
    nextStranger,
    stopChat,
    // Optional: only used if your useSocket hook provides them
    partnerTyping,
    sendTyping,
    reportStranger,
  } = useSocket();

  const [saved] = useState(loadPrefs);
  const [message, setMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [showJump, setShowJump] = useState(false);

  const [profile, setProfile] = useState(saved?.profile ?? defaultProfile);
  const [filters, setFilters] = useState(saved?.filters ?? initialFilters);
  const [consent, setConsent] = useState(saved?.consent ?? initialConsent);

  // Setup popup opens only if the user hasn't completed it before
  const [setupOpen, setSetupOpen] = useState(
    !allTrue(saved?.consent ?? initialConsent),
  );
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftFilters, setDraftFilters] = useState(filters);
  const [draftConsent, setDraftConsent] = useState(consent);

  const listRef = useRef(null);
  const stickRef = useRef(true);
  const inputRef = useRef(null);
  const lastTypingRef = useRef(0);
  const baseTitleRef = useRef(
    typeof document !== "undefined" ? document.title : "",
  );

  const updateProfile = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const updateFilter = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const updateConsent = (k, v) => setConsent((p) => ({ ...p, [k]: v }));
  const updateDraftProfile = (k, v) =>
    setDraftProfile((p) => ({ ...p, [k]: v }));
  const updateDraftFilter = (k, v) =>
    setDraftFilters((p) => ({ ...p, [k]: v }));
  const updateDraftConsent = (k, v) =>
    setDraftConsent((p) => ({ ...p, [k]: v }));

  // Fonts
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

  // Sync drafts when the dialog opens
  useEffect(() => {
    if (setupOpen) {
      setDraftProfile(profile);
      setDraftFilters(filters);
      setDraftConsent(consent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupOpen]);

  // Remember preferences
  useEffect(() => {
    savePrefs({ profile, filters, consent });
  }, [profile, filters, consent]);

  const isConnected = status === "connected";
  const isSearching = status === "searching";
  const isBusy = isSearching || isConnected;
  const hasEnded = status === "idle" && messages.length > 0;

  // Search timer
  useEffect(() => {
    if (!isSearching) {
      setElapsed(0);
      return undefined;
    }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isSearching]);

  // Scroll handling: follow new messages only if the user is already at the bottom
  const scrollToBottom = useCallback((behavior = "smooth") => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    stickRef.current = true;
    setShowJump(false);
  }, []);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    stickRef.current = near;
    setShowJump(!near);
  };

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;
    if (stickRef.current || last.sender === "you") scrollToBottom("smooth");
    else setShowJump(true);
  }, [messages, partnerTyping, scrollToBottom]);

  // Focus the input when a chat starts (desktop only, to avoid popping the keyboard)
  useEffect(() => {
    if (isConnected && !isMobile) inputRef.current?.focus();
  }, [isConnected, isMobile]);

  // Tab title alert when a message arrives in a background tab
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (document.hidden && last && last.sender !== "you") {
      document.title = "New message · Omegly";
    }
  }, [messages]);

  useEffect(() => {
    const base = baseTitleRef.current;
    const restore = () => {
      if (!document.hidden) document.title = base;
    };
    document.addEventListener("visibilitychange", restore);
    return () => {
      document.removeEventListener("visibilitychange", restore);
      document.title = base;
    };
  }, []);

  const matchingPayload = {
    profile: { ...profile, tags: profile.tags },
    filters,
    consent,
  };

  const draftValid =
    Number.isInteger(draftProfile.age) &&
    draftProfile.age >= 18 &&
    draftProfile.age <= 99 &&
    draftFilters.minAge <= draftFilters.maxAge &&
    allTrue(draftConsent);

  const consentDone = allTrue(consent);
  const canStart = connected && consentDone && filters.minAge <= filters.maxAge;

  const handleConfirmSetup = () => {
    if (!draftValid) return;
    setProfile(draftProfile);
    setFilters(draftFilters);
    setConsent(draftConsent);
    setSetupOpen(false);
  };

  const handleFind = () => findStranger(matchingPayload);
  const handleNext = () => nextStranger(matchingPayload);

  const handleSend = () => {
    const text = message.trim();
    if (!text || !isConnected) return;
    sendMessage(text);
    setMessage("");
    inputRef.current?.focus();
  };

  const handleTyping = (e) => {
    setMessage(e.target.value.slice(0, MAX_LEN));
    const now = Date.now();
    if (sendTyping && now - lastTypingRef.current > 2000) {
      lastTypingRef.current = now;
      sendTyping();
    }
  };

  const handleReport = () => {
    reportStranger?.();
    setToast("Report sent. Finding someone new…");
    handleNext();
  };

  const openPrefs = () => (isMobile ? setDrawerOpen(true) : setSetupOpen(true));

  const statusLabel = isSearching
    ? "Searching…"
    : isConnected
      ? partnerTyping
        ? "typing…"
        : "Online now"
      : hasEnded
        ? "Chat ended"
        : "Not connected";

  const summary = [
    genderLabel(filters.gender),
    filters.country === "any" ? "Any country" : filters.country,
    `Ages ${filters.minAge}–${filters.maxAge === 99 ? "99+" : filters.maxAge}`,
  ];

  const showList = messages.length > 0 || isConnected;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100dvh",
        color: C.text,
        fontFamily: FONT_BODY,
        py: { xs: 0, md: 3 },
        overflow: "hidden",
        bgcolor: C.bg,
        background: `
          radial-gradient(700px 420px at 90% -5%, rgba(255,111,97,0.16), transparent 65%),
          radial-gradient(800px 500px at 0% 105%, rgba(191,168,255,0.14), transparent 65%),
          ${C.bg}`,
      }}
    >
      <Container
        maxWidth="md"
        disableGutters={isMobile}
        sx={{ position: "relative", zIndex: 1, px: { sm: 3 } }}
      >
        {/* Top bar */}
        <Stack
          component="header"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: { xs: 1, sm: 0 },
            py: { xs: 0.75, md: 0 },
            mb: { xs: 0, md: 2.5 },
            minHeight: 52,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              onClick={() => navigate("/")}
              aria-label="Back to home"
              sx={{
                color: C.text,
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: -1,
              }}
            >
              omegly
              <Box component="span" sx={{ color: C.coral }}>
                .
              </Box>
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: connected ? C.mint : C.coral,
                  boxShadow: `0 0 10px ${connected ? C.mint : C.coral}`,
                }}
              />
              <Typography variant="caption" sx={{ color: C.muted }}>
                {connected ? "Server connected" : "Connecting…"}
              </Typography>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Tune sx={{ fontSize: 18 }} />}
              onClick={openPrefs}
              sx={ghostBtnSx}
            >
              {isMobile ? "Filters" : "Preferences"}
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{
              mx: { xs: 1.5, sm: 0 },
              mb: 2,
              borderRadius: 3,
              bgcolor: "rgba(255,111,97,0.1)",
              color: "#FFC9C2",
              border: "1px solid rgba(255,111,97,0.25)",
              "& .MuiAlert-icon": { color: C.coral },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Chat card */}
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: { xs: "calc(100dvh - 52px)", md: "calc(100vh - 130px)" },
            minHeight: 440,
            bgcolor: C.surface,
            border: { xs: "none", sm: `1px solid ${C.line}` },
            borderTop: `1px solid ${C.line}`,
            borderRadius: { xs: "24px 24px 0 0", md: 5 },
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          }}
        >
          {/* Chat header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.5,
              borderBottom: `1px solid ${C.line}`,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  position: "relative",
                  width: 42,
                  height: 42,
                  borderRadius: "15px",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: 19,
                  color: isConnected ? "#2A1020" : C.muted,
                  background: isConnected ? gradient : "rgba(255,255,255,0.06)",
                  transition: "background .3s ease",
                }}
              >
                ?
                {isConnected && (
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
                )}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  Stranger
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: isConnected ? C.mint : C.muted }}
                  aria-live="polite"
                >
                  {statusLabel}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              {isConnected && typeof reportStranger === "function" && (
                <ConfirmButton
                  icon={<Flag fontSize="small" />}
                  label="Report"
                  armedLabel="Confirm"
                  needsConfirm
                  onConfirm={handleReport}
                  tooltip="Report this person and skip"
                  sx={dangerBtnSx}
                />
              )}
              <ConfirmButton
                icon={<SkipNext fontSize="small" />}
                label="Next"
                needsConfirm={isConnected && messages.length > 2}
                onConfirm={handleNext}
                disabled={!canStart || !isBusy}
                tooltip="Skip to someone new"
                sx={ghostBtnSx}
              />
              <ConfirmButton
                icon={<Stop fontSize="small" />}
                label="Stop"
                needsConfirm={isConnected && messages.length > 2}
                onConfirm={stopChat}
                disabled={!isBusy}
                tooltip="End chat"
                sx={dangerBtnSx}
              />
            </Stack>
          </Stack>

          {/* Messages */}
          <Box
            sx={{
              position: "relative",
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              ref={listRef}
              onScroll={handleScroll}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              sx={{
                flex: 1,
                px: { xs: 2, md: 3 },
                py: 2.5,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 3,
                },
              }}
            >
              {isSearching && (
                <SearchingState
                  elapsed={elapsed}
                  onCancel={stopChat}
                  onEditPrefs={openPrefs}
                />
              )}

              {status === "idle" && !showList && (
                <IdleState
                  onFind={handleFind}
                  disabled={!canStart}
                  needsSetup={!consentDone}
                  summary={summary}
                  onEditPrefs={openPrefs}
                />
              )}

              {showList && (
                <Typography
                  variant="caption"
                  sx={{
                    alignSelf: "center",
                    textAlign: "center",
                    color: C.faint,
                    bgcolor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${C.line}`,
                    borderRadius: 999,
                    px: 2,
                    py: 0.6,
                    mb: 1,
                    maxWidth: 360,
                  }}
                >
                  You're chatting with a stranger. Keep personal details
                  private.
                </Typography>
              )}

              {messages.map((msg, i) => {
                const isYou = msg.sender === "you";
                const prev = messages[i - 1];
                const next = messages[i + 1];
                const startsGroup = !prev || prev.sender !== msg.sender;
                const endsGroup = !next || next.sender !== msg.sender;
                const time = formatTime(
                  msg.time ?? msg.timestamp ?? msg.createdAt,
                );
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: isYou ? "flex-end" : "flex-start",
                      maxWidth: { xs: "82%", sm: "70%" },
                      mt: startsGroup ? 1.5 : 0,
                      animation: `${popIn} .22s ease-out`,
                      ...reduceMotion,
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1.1,
                        color: isYou ? "#2A1020" : C.text,
                        background: isYou ? gradient : C.surfaceHi,
                        border: isYou ? "none" : `1px solid ${C.line}`,
                        borderRadius: isYou
                          ? `20px 20px ${endsGroup ? "6px" : "20px"} 20px`
                          : `20px 20px 20px ${endsGroup ? "6px" : "20px"}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 15,
                          lineHeight: 1.5,
                          fontWeight: isYou ? 500 : 400,
                          overflowWrap: "anywhere",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.text}
                      </Typography>
                    </Box>
                    {endsGroup && time && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: C.faint,
                          mt: 0.4,
                          px: 0.5,
                          textAlign: isYou ? "right" : "left",
                          fontSize: 11,
                        }}
                      >
                        {time}
                      </Typography>
                    )}
                  </Box>
                );
              })}

              {isConnected && partnerTyping && (
                <Box
                  aria-label="Stranger is typing"
                  sx={{
                    alignSelf: "flex-start",
                    display: "flex",
                    gap: 0.6,
                    px: 2,
                    py: 1.6,
                    mt: 0.5,
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
                        ...reduceMotion,
                      }}
                    />
                  ))}
                </Box>
              )}

              {isConnected && messages.length === 0 && (
                <Typography
                  sx={{ m: "auto", color: C.muted, textAlign: "center" }}
                  variant="body2"
                >
                  You're connected. Say hi!
                </Typography>
              )}

              {hasEnded && (
                <Stack alignItems="center" spacing={1.5} sx={{ py: 3 }}>
                  <Divider
                    flexItem
                    sx={{ borderColor: C.line, color: C.faint, fontSize: 12 }}
                  >
                    Chat ended
                  </Divider>
                  <Button
                    variant="contained"
                    onClick={handleFind}
                    disabled={!canStart}
                    sx={{ ...primaryBtnSx, py: 1.1, px: 3.5, fontSize: 15 }}
                  >
                    Find someone new
                  </Button>
                </Stack>
              )}
            </Box>

            {showJump && (
              <Button
                onClick={() => scrollToBottom("smooth")}
                size="small"
                endIcon={<KeyboardArrowDown />}
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: 12,
                  transform: "translateX(-50%)",
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#2A1020",
                  background: gradient,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  "&:hover": { background: gradient },
                }}
              >
                Latest messages
              </Button>
            )}
          </Box>

          {/* Input */}
          <Box
            sx={{
              px: { xs: 1.5, md: 2 },
              pt: { xs: 1.5, md: 2 },
              pb: { xs: "max(12px, env(safe-area-inset-bottom))", md: 2 },
              borderTop: `1px solid ${C.line}`,
              bgcolor: "rgba(0,0,0,0.12)",
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="flex-end">
              <TextField
                fullWidth
                size="small"
                multiline
                maxRows={4}
                inputRef={inputRef}
                placeholder={
                  isConnected ? "Write a message…" : "Connect to start chatting"
                }
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={!isConnected}
                inputProps={{ "aria-label": "Message", maxLength: MAX_LEN }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                    px: 2.5,
                    bgcolor: "rgba(255,255,255,0.05)",
                    "& fieldset": { borderColor: C.line },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,176,122,0.4)",
                    },
                    "&.Mui-focused fieldset": { borderColor: C.peach },
                  },
                  "& .MuiInputBase-input": { color: C.text, py: 1.3 },
                  "& .MuiInputBase-input::placeholder": {
                    color: C.faint,
                    opacity: 1,
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!isConnected || !message.trim()}
                aria-label="Send message"
                sx={{
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                  color: "#2A1020",
                  background: gradient,
                  boxShadow: "0 8px 22px rgba(255,111,97,0.35)",
                  transition: "transform .15s ease",
                  "&:hover": { background: gradient, transform: "scale(1.06)" },
                  "&.Mui-disabled": {
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.3)",
                    boxShadow: "none",
                  },
                }}
              >
                <Send fontSize="small" />
              </IconButton>
            </Stack>

            {isConnected && (
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  mt: 0.75,
                  px: 1,
                  display: {
                    xs: message.length > 800 ? "flex" : "none",
                    md: "flex",
                  },
                }}
              >
                <Typography variant="caption" sx={{ color: C.faint }}>
                  Enter to send · Shift+Enter for a new line
                </Typography>
                {message.length > 800 && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: message.length >= MAX_LEN ? C.coral : C.faint,
                    }}
                  >
                    {message.length}/{MAX_LEN}
                  </Typography>
                )}
              </Stack>
            )}
          </Box>
        </Box>
      </Container>

      {/* Setup dialog */}
      <Dialog
        open={setupOpen}
        onClose={() => {
          if (consentDone) setSetupOpen(false);
        }}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            bgcolor: C.surface,
            backgroundImage:
              "radial-gradient(500px 260px at 100% 0%, rgba(255,111,97,0.14), transparent 70%)",
            color: C.text,
            fontFamily: FONT_BODY,
            borderRadius: { xs: 0, md: 5 },
            border: { xs: "none", md: `1px solid ${C.line}` },
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: -0.8,
              lineHeight: 1.1,
            }}
          >
            {consentDone ? "Your preferences" : "Set up your profile"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: C.muted, mt: 0.75, mb: 3.5 }}
          >
            {consentDone
              ? "Changes apply to your next match."
              : "It takes about 30 seconds. We'll remember it on this device."}
          </Typography>

          <FormBody
            p={draftProfile}
            f={draftFilters}
            c={draftConsent}
            onProfile={updateDraftProfile}
            onFilter={updateDraftFilter}
            onConsent={updateDraftConsent}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirmSetup}
            disabled={!draftValid}
            sx={{ ...primaryBtnSx, mt: 4 }}
          >
            {draftValid ? "Save and continue" : "Complete the form to continue"}
          </Button>
          {consentDone && (
            <Button
              fullWidth
              onClick={() => setSetupOpen(false)}
              sx={{ mt: 1, color: C.muted, textTransform: "none" }}
            >
              Cancel
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* Preferences drawer (mobile) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "88%", sm: 380 },
            bgcolor: C.surface,
            color: C.text,
            p: 3,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography
            sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 22 }}
          >
            Preferences
          </Typography>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="Close"
            sx={{ color: C.muted }}
          >
            <Close />
          </IconButton>
        </Stack>

        <FormBody
          p={profile}
          f={filters}
          c={consent}
          onProfile={updateProfile}
          onFilter={updateFilter}
          onConsent={updateConsent}
        />
      </Drawer>

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast("")}
        message={toast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{
          sx: {
            bgcolor: C.surfaceHi,
            color: C.text,
            border: `1px solid ${C.line}`,
            borderRadius: 3,
          },
        }}
      />
    </Box>
  );
}
