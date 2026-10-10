/** Decorative line icons. No additional icon library is required. */
export default function UiIcon({ name, size = 24, strokeWidth = 1.9 }) {
  const icons = {
    building: <><path d="M3 21h18M5 21V8l7-5 7 5v13M3 9l9-6 9 6M9 21v-8h6v8M9 9h.01M15 9h.01" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrowLeft: <><path d="m12 19-7-7 7-7M5 12h14" /></>,
    arrowRight: <><path d="M5 12h14m-7-7 7 7-7 7" /></>,
    chevron: <><path d="m9 5 7 7-7 7" /></>,
    customer: <><circle cx="10" cy="8" r="3" /><path d="M4 20v-2a6 6 0 0 1 12 0v2M17 6a3 3 0 0 1 0 6M18 15a4 4 0 0 1 3 4v1" /></>,
    package: <><path d="m12 2 9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    check: <><path d="m5 12 4.5 4.5L19 7" /></>,
    ticket: <><path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5ZM13 5v2M13 10v2M13 15v2M13 19v0" /></>,
    alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[name] ?? icons.info}
    </svg>
  );
}
