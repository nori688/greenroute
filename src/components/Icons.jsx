// Сызықтық (stroke) иконкалар жиынтығы. Сыртқы кітапхана жоқ — APK үшін жеңіл.
const S = ({ children, size = 22, stroke = 1.8, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
)

const paths = {
  walk: (
    <>
      <circle cx="13" cy="4.3" r="1.8" />
      <path d="M12.6 8.2 10.9 12l2.3 2.4.9 5.5" />
      <path d="M12.6 8.2l3.6 1.5 1.2 3.2" />
      <path d="M10.9 12 7.4 13.5 5.6 18.3" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="16.5" r="3.4" />
      <circle cx="18" cy="16.5" r="3.4" />
      <path d="M6 16.5 10.6 9h5.2" />
      <path d="M10.6 9l3.2 7.5" />
      <path d="M15.8 9l2.2 3.6" />
      <path d="M9.6 9h2" />
    </>
  ),
  scooter: (
    <>
      <circle cx="6" cy="17.5" r="2.5" />
      <circle cx="18" cy="17.5" r="2.5" />
      <path d="M8.5 17.5h7" />
      <path d="M10.5 12.5h4.6l1.6 5" />
      <path d="M15 12.5V7h2.4" />
      <path d="M13.6 7h3.6" />
    </>
  ),
  bus: (
    <>
      <rect x="4" y="3.5" width="16" height="13" rx="3" />
      <path d="M4 11h16" />
      <path d="M9 3.5v7.5M15 3.5v7.5" />
      <circle cx="7.8" cy="18.6" r="1.7" />
      <circle cx="16.2" cy="18.6" r="1.7" />
    </>
  ),
  trolley: (
    <>
      <rect x="4.5" y="6" width="15" height="10.5" rx="2.6" />
      <path d="M4.5 12h15" />
      <circle cx="8.2" cy="18.7" r="1.6" />
      <circle cx="15.8" cy="18.7" r="1.6" />
      <path d="M8.5 6 5.6 2.6M15.5 6l2.9-3.4" />
    </>
  ),
  metro: (
    <>
      <rect x="4.5" y="3" width="15" height="14" rx="3.4" />
      <path d="M4.5 12h15" />
      <path d="M9 7.5h6" />
      <path d="M8 17v2.6M16 17v2.6" />
      <path d="M8.6 21.5 7 22.8M15.4 21.5l1.6 1.3" />
    </>
  ),
  ev: (
    <>
      <path d="M4 17v-3.6l1.7-4.2A2 2 0 0 1 7.6 7.9h8.8a2 2 0 0 1 1.9 1.3L20 13.4V17" />
      <path d="M3 17h18" />
      <circle cx="7.6" cy="18.4" r="1.7" />
      <circle cx="16.4" cy="18.4" r="1.7" />
      <path d="M12.9 9.6l-1.7 3.2h2.6l-1.6 3.2" />
    </>
  ),
  car: (
    <>
      <path d="M4 16.6v-3.2l1.7-4.4A2 2 0 0 1 7.6 7.5h8.8a2 2 0 0 1 1.9 1.5l1.7 4.4v3.2" />
      <path d="M3 16.6h18" />
      <circle cx="7.6" cy="18" r="1.7" />
      <circle cx="16.4" cy="18" r="1.7" />
      <path d="M6 13h12" />
    </>
  ),
  taxi: (
    <>
      <path d="M4 16.6v-3.2l1.7-4.4A2 2 0 0 1 7.6 7.5h8.8a2 2 0 0 1 1.9 1.5l1.7 4.4v3.2" />
      <path d="M3 16.6h18" />
      <circle cx="7.6" cy="18" r="1.7" />
      <circle cx="16.4" cy="18" r="1.7" />
      <rect x="9.6" y="3.6" width="4.8" height="2.6" rx="1" />
    </>
  ),
  steps: (
    <>
      <ellipse cx="8" cy="7.4" rx="2.4" ry="3.4" />
      <path d="M5.6 13.4c0 2.2 1.1 3.6 2.4 3.6s2.4-1.4 2.4-3.6" />
      <ellipse cx="16.4" cy="12.4" rx="2.4" ry="3.4" />
      <path d="M14 18.4c0 2.2 1.1 3.6 2.4 3.6s2.4-1.4 2.4-3.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4V12l3.2 2" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c0 8.4-4.5 12.6-9.6 12.6A5.4 5.4 0 0 1 5 11.2C5 6.2 9.6 4 20 4Z" />
      <path d="M4 21c.6-5 3.4-8.6 8-11" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M9.4 9.6h5.2M9.4 14.4h5.2M12 8v8" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c3.6 3.4 5.6 6.2 5.6 9.4A5.6 5.6 0 0 1 12 18a5.6 5.6 0 0 1-5.6-5.6C6.4 9.2 8.4 6.4 12 3Z" />
      <path d="M12 18v3" />
    </>
  ),
  swap: (
    <>
      <path d="M7 4.5v13M7 4.5 4.2 7.4M7 4.5l2.8 2.9" />
      <path d="M17 19.5v-13M17 19.5l-2.8-2.9M17 19.5l2.8-2.9" />
    </>
  ),
  route: (
    <>
      <circle cx="5.5" cy="6" r="2.4" />
      <circle cx="18.5" cy="18" r="2.4" />
      <path d="M5.5 8.4v4.2a3 3 0 0 0 3 3h6.4a3.6 3.6 0 0 1 3.6 3.6" />
    </>
  ),
  compare: (
    <>
      <path d="M4 20V9.5M10 20V4M16 20v-8M22 20h-20" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.4" r="3.4" />
      <path d="M2.8 19.4c.6-3.4 3.1-5.4 6.2-5.4s5.6 2 6.2 5.4" />
      <path d="M16.4 5.4a3.2 3.2 0 0 1 0 6.2" />
      <path d="M18 14.4c2 .7 3.4 2.5 3.8 5" />
    </>
  ),
  trophy: (
    <>
      <path d="M7.6 4h8.8v4.6a4.4 4.4 0 0 1-8.8 0V4Z" />
      <path d="M7.6 5.4H5a2.6 2.6 0 0 0 2.6 5.2" />
      <path d="M16.4 5.4H19a2.6 2.6 0 0 1-2.6 5.2" />
      <path d="M12 13v3.4M8.6 20.2c0-2 1.5-3.4 3.4-3.4s3.4 1.4 3.4 3.4" />
    </>
  ),
  close: <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
    </>
  ),
  moon: <path d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4Z" />,
  check: <path d="M4.8 12.6 9.4 17 19.2 6.8" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  chevron: <path d="M9.4 5.6 15.8 12l-6.4 6.4" />,
  chevronDown: <path d="M5.6 9.4 12 15.8l6.4-6.4" />,
  pin: (
    <>
      <path d="M12 21c4-4.6 6-8 6-10.6A6 6 0 0 0 6 10.4C6 13 8 16.4 12 21Z" />
      <circle cx="12" cy="10.2" r="2.4" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.4" />
      <path d="M15 9V6.4A2.4 2.4 0 0 0 12.6 4H6.4A2.4 2.4 0 0 0 4 6.4v6.2A2.4 2.4 0 0 0 6.4 15H9" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11v5.4M12 7.8v.6" />
    </>
  ),
  bolt: <path d="M13.4 3 6.2 13.4h4.8L10.6 21l7.2-10.4h-4.8L13.4 3Z" />,
  shield: (
    <>
      <path d="M12 3 5 5.8v5.6c0 4.2 2.9 7.6 7 9.6 4.1-2 7-5.4 7-9.6V5.8L12 3Z" />
      <path d="M9 12.2l2.2 2.2 4-4.2" />
    </>
  ),
}

export default function Icon({ name, size = 22, stroke = 1.8, className = '', style }) {
  const d = paths[name] ?? paths.route
  return (
    <S size={size} stroke={stroke} className={className} style={style} aria-hidden="true">
      {d}
    </S>
  )
}
