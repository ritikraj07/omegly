import LegalLayout from "../components/LegalLayout";

const sections = [
  {
    heading: "Age Requirement",
    body: "Omegly is intended only for adults aged 18 and above. You must meet this requirement to use the service.",
  },
  {
    heading: "User Conduct",
    body: "You agree not to harass, threaten, exploit, impersonate, or abuse other users. Do not share illegal, harmful, or non-consensual content.",
  },
  {
    heading: "Personal Safety",
    body: "Never share your password, financial details, private address, or other sensitive information with strangers. You interact with other users at your own discretion, and you can leave any conversation at any time.",
  },
  {
    heading: "Service Availability",
    body: "Omegly may change, suspend, or discontinue features. We do not guarantee uninterrupted availability or that a match will always be found.",
  },
  {
    heading: "Misuse",
    body: "Access may be restricted or ended where users violate these terms or applicable laws. Omegly may block users or remove content at its discretion to keep the service safe.",
  },
  {
    heading: "Changes to Terms",
    body: "These terms may be updated as the service develops. Continued use after an update means you accept the revised terms, to the extent permitted by applicable law.",
  },
];

export default function Terms() {
  return (
    <LegalLayout
      seo={{
        title: "Terms of Use | Omegly",
        description: "The terms for using Omegly. Adults 18+ only.",
        path: "/terms",
      }}
      title="Terms and Conditions"
      updated="November 23, 2026"
      sections={sections}
    />
  );
}
