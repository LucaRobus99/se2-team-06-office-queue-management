/** Duotone illustrations for the role cards on the home page only. */
export default function HomeRoleIcon({ name }) {
  const icons = {
    customer: (
      <>
        <circle cx="32" cy="19" r="10" fill="currentColor" />
        <path d="M13 52v-4c0-10 8-17 19-17s19 7 19 17v4" fill="currentColor" opacity=".2" />
        <path d="M18 52v-4c0-9 6-15 14-15s14 6 14 15v4" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
        <circle cx="11.5" cy="27" r="6" fill="currentColor" opacity=".58" />
        <path d="M5 46c0-6 2.5-10.5 7.5-12.5" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" opacity=".7" />
        <circle cx="52.5" cy="27" r="6" fill="currentColor" opacity=".58" />
        <path d="M59 46c0-6-2.5-10.5-7.5-12.5" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" opacity=".7" />
      </>
    ),
    officer: (
      <>
        <circle cx="22" cy="17" r="9" fill="currentColor" />
        <path d="M5 48v-5c0-11 7-18 17-18 7 0 12.5 4 15 10" fill="currentColor" opacity=".18" />
        <path d="M8 48v-5c0-9.5 5.5-15 14-15 5.5 0 9.5 2.5 12 7" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
        <rect x="32" y="33" width="26" height="23" rx="4.5" fill="currentColor" opacity=".18" />
        <rect x="32" y="33" width="26" height="23" rx="4.5" stroke="currentColor" strokeWidth="3.6" />
        <path d="M40 40h10M40 46h6" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
      </>
    ),
    display: (
      <>
        <rect x="7" y="9" width="50" height="35" rx="6" fill="currentColor" opacity=".2" />
        <rect x="7" y="9" width="50" height="35" rx="6" stroke="currentColor" strokeWidth="3.5" />
        <path d="M24 56h16M32 44v12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <rect x="15" y="17" width="17" height="7" rx="3.5" fill="currentColor" opacity=".9" />
        <path d="M38 19h11M17 32h13M38 32h11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity=".76" />
      </>
    ),
    manager: (
      <>
        <path d="M7 56h50" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
        <rect x="11" y="35" width="9" height="18" rx="2.5" fill="currentColor" opacity=".42" />
        <rect x="25" y="27" width="9" height="26" rx="2.5" fill="currentColor" opacity=".62" />
        <rect x="39" y="16" width="9" height="37" rx="2.5" fill="currentColor" />
        <path d="m10 24 12-8 11 4L49 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 7h9v9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    admin: (
      <>
        <path
          d="M27 5h10l1.7 7.1c1.7.7 3.3 1.6 4.7 2.7l7-2.3 5 8.7-5.4 4.8c.2 1.9.2 3.9 0 5.8l5.4 4.8-5 8.7-7-2.3a22 22 0 0 1-4.7 2.7L37 53H27l-1.7-7.3a22 22 0 0 1-4.7-2.7l-7 2.3-5-8.7 5.4-4.8a27 27 0 0 1 0-5.8l-5.4-4.8 5-8.7 7 2.3a22 22 0 0 1 4.7-2.7L27 5Z"
          fill="currentColor"
          fillOpacity=".18"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="29" r="9" fill="currentColor" opacity=".9" />
        <circle cx="32" cy="29" r="3.8" fill="white" />
      </>
    ),
  };

  return (
    <svg className="home-role-art" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      {icons[name] ?? icons.customer}
    </svg>
  );
}
