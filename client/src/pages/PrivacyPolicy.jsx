import LegalLayout from "../components/LegalLayout";

// Set this to your real contact address. While it is empty, the Contact
// section is hidden instead of showing placeholder text to visitors.
const CONTACT_EMAIL = "";

const sections = [
  {
    heading: "Introduction",
    body: "This policy explains how Omegly handles information when you use our anonymous text-chat service. By using Omegly, you agree to this policy.",
  },
  {
    heading: "Information You Provide",
    body: "You may provide profile preferences such as your age, gender, and country, and choose who you would like to be matched with. We use this to pair you with other users. Do not enter passwords, financial information, or other sensitive personal data.",
  },
  {
    heading: "Chat Messages",
    body: "Messages are relayed through our servers to the person you are matched with. Do not assume conversations are private or confidential, and avoid sharing information that could identify you. Other users can copy or screenshot what you write. Omegly may keep limited records where needed for safety, abuse prevention, or legal compliance.",
  },
  {
    heading: "Cookies and Technical Data",
    body: "Omegly and its hosting providers may process technical information such as IP addresses, connection details, and security logs. Your browser also stores your profile preferences and your confirmation of the age and safety checkboxes in local storage on your own device, so you do not have to re-enter them. You can clear this at any time in your browser settings.",
  },
  {
    heading: "Third-Party Services",
    body: "Omegly relies on hosting and infrastructure providers to operate the service. The site also loads fonts from Google Fonts, which means your browser connects to Google's servers when you visit. These providers handle data under their own policies and agreements.",
  },
  ...(CONTACT_EMAIL
    ? [
        {
          heading: "Contact",
          body: (
            <>
              Questions about this policy? Email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#FFB07A" }}>
                {CONTACT_EMAIL}
              </a>
              .
            </>
          ),
        },
      ]
    : []),
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      seo={{
        title: "Privacy Policy | Omegly",
        description: "How Omegly handles your data and privacy.",
        path: "/privacy",
      }}
      title="Privacy Policy"
      updated="November 23, 2026"
      sections={sections}
    />
  );
}
