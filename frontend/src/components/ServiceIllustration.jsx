/** Visual-only duotone illustrations for the existing service cards. */
export default function ServiceIllustration({ name }) {
  const illustrations = {
    package: (
      <>
        <path d="M12 20 32 9l20 11-20 11-20-11Z" fill="currentColor" fillOpacity=".28" />
        <path d="m12 20 20 11v23L12 42V20Z" fill="currentColor" fillOpacity=".11" />
        <path d="m52 20-20 11v23l20-12V20Z" fill="currentColor" fillOpacity=".55" />
        <path d="M12 20 32 9l20 11v22L32 54 12 42V20Zm0 0 20 11 20-11M32 31v23M22 14l20 11" stroke="currentColor" strokeWidth="3.3" strokeLinejoin="round" strokeLinecap="round" />
        <path d="m26 12 20 11v9" stroke="white" strokeOpacity=".85" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    card: (
      <>
        <rect x="7" y="15" width="50" height="34" rx="7" fill="currentColor" fillOpacity=".2" />
        <rect x="7" y="15" width="50" height="34" rx="7" stroke="currentColor" strokeWidth="3.4" />
        <path d="M9 25h46v10H9z" fill="currentColor" fillOpacity=".6" />
        <path d="M9 25h46v10H9" stroke="currentColor" strokeWidth="2.4" />
        <rect x="15" y="40" width="12" height="3.5" rx="1.75" fill="currentColor" />
        <circle cx="46" cy="42" r="4" fill="white" fillOpacity=".8" />
      </>
    ),
    info: (
      <>
        <path d="M12 15h40a6 6 0 0 1 6 6v23a6 6 0 0 1-6 6H31L20 57v-7h-8a6 6 0 0 1-6-6V21a6 6 0 0 1 6-6Z" fill="currentColor" fillOpacity=".18" />
        <path d="M12 15h40a6 6 0 0 1 6 6v23a6 6 0 0 1-6 6H31L20 57v-7h-8a6 6 0 0 1-6-6V21a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        <circle cx="32" cy="28" r="4" fill="currentColor" />
        <path d="M32 37v6" stroke="currentColor" strokeWidth="4.6" strokeLinecap="round" />
      </>
    ),
    file: (
      <>
        <path d="M17 8h20l12 12v35H17a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Z" fill="currentColor" fillOpacity=".13" />
        <path d="M17 8h20l12 12v35H17a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Z" stroke="currentColor" strokeWidth="3.1" strokeLinejoin="round" />
        <path d="M37 8v12h12" fill="currentColor" fillOpacity=".34" stroke="currentColor" strokeWidth="3.1" strokeLinejoin="round" />
        <path d="M21 31h20M21 39h16M21 47h10" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg className="service-art" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      {illustrations[name] ?? illustrations.file}
    </svg>
  );
}
