const logoSvgs = {
  python: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#f5f7f6"/>
      <path d="M32 10c-10 0-10 6-10 6v8h20v4H14c-6 0-10 5-10 12s4 12 10 12h6v-8c0-7 6-12 14-12h16c6 0 10-5 10-12V22c0-6-5-12-14-12H32Z" fill="#3776ab"/>
      <path d="M32 54c10 0 10-6 10-6v-8H22v-4h28c6 0 10-5 10-12s-4-12-10-12h-6v8c0 7-6 12-14 12H14C8 32 4 37 4 44v4c0 6 5 12 14 12h14Z" fill="#f7c744"/>
      <circle cx="27" cy="19" r="2.5" fill="#ffffff"/>
      <circle cx="37" cy="45" r="2.5" fill="#ffffff"/>
    </svg>`,
  java: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#fff7f5"/>
      <path d="M22 46c4 2 16 2 20 0" stroke="#e76f51" stroke-width="4" stroke-linecap="round"/>
      <path d="M28 40c2 1 8 1 10 0" stroke="#f4a261" stroke-width="4" stroke-linecap="round"/>
      <path d="M34 14c6 5-5 8 0 14 4 5 2 8-2 12" stroke="#d62828" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="32" cy="50" rx="16" ry="5" fill="#264653"/>
    </svg>`,
  javascript: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#f7df1e"/>
      <path d="M22 18h8v28c0 8-4 12-11 12-3 0-6-1-8-3l4-7c1 1 2 2 4 2 2 0 3-1 3-5V18Zm16 0h8c1 6 4 9 9 9 5 0 7-2 7-5 0-3-2-4-8-7-8-3-13-7-13-15 0-8 6-14 16-14 7 0 12 2 15 8l-7 5c-2-3-4-5-8-5-4 0-6 2-6 5 0 3 2 4 8 6 9 4 13 8 13 16 0 9-7 14-17 14-10 0-17-5-20-14Z" fill="#333333" transform="scale(.55) translate(28 26)"/>
    </svg>`,
  cplusplus: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#eff5ff"/>
      <path d="M24 16 12 23v18l12 7 12-7V23l-12-7Z" fill="#00599c"/>
      <path d="M42 16 30 23v18l12 7 12-7V23l-12-7Z" fill="#659ad2"/>
      <path d="M27 32h-6m3-3v6m16-6h-6m3-3v6m7 0h-6m3-3v6" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  react: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#eefcff"/>
      <circle cx="32" cy="32" r="4.5" fill="#61dafb"/>
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke="#61dafb" stroke-width="3" fill="none"/>
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke="#61dafb" stroke-width="3" fill="none" transform="rotate(60 32 32)"/>
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke="#61dafb" stroke-width="3" fill="none" transform="rotate(120 32 32)"/>
    </svg>`,
  nodejs: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#f3fbf4"/>
      <path d="M32 10 49 20v24L32 54 15 44V20l17-10Z" fill="#539e43"/>
      <path d="M26 24v16m0-16 12 16V24" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  typescript: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#eaf2ff"/>
      <rect x="14" y="14" width="36" height="36" rx="8" fill="#3178c6"/>
      <path d="M24 26h16M32 26v18m4-9c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5Z" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  tensorflow: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#fff8f1"/>
      <path d="M12 16h40v8H36v28h-8V24H12v-8Zm28 8h12v8H40v-8Zm0 12h12v8H40v-8Z" fill="#ff6f00"/>
    </svg>`,
  pytorch: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#fff8f5"/>
      <path d="M34 14a18 18 0 1 0 16 16" stroke="#ee4c2c" stroke-width="6" stroke-linecap="round" fill="none"/>
      <circle cx="44" cy="18" r="6" fill="#ee4c2c"/>
    </svg>`,
  docker: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#f2fbff"/>
      <path d="M16 34h6v6h-6zm8 0h6v6h-6zm8 0h6v6h-6zm8 0h6v6h-6zm-20-8h6v6h-6zm8 0h6v6h-6zm8 0h6v6h-6z" fill="#2496ed"/>
      <path d="M46 40c3 0 5-1 7-4 2 5-2 12-10 12H18c-4 0-6-2-6-5v-3h34Z" fill="#2496ed"/>
    </svg>`,
  git: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#fff7f1"/>
      <path d="M32 10 54 32 32 54 10 32 32 10Z" fill="#f05032"/>
      <path d="M24 24v16m0-8h8m8-8v16m-8-8h8" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="4" fill="#ffffff"/>
      <circle cx="24" cy="40" r="4" fill="#ffffff"/>
      <circle cx="40" cy="32" r="4" fill="#ffffff"/>
    </svg>`,
  linux: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#f8f8f8"/>
      <ellipse cx="32" cy="26" rx="10" ry="14" fill="#1f2937"/>
      <ellipse cx="32" cy="40" rx="12" ry="14" fill="#1f2937"/>
      <ellipse cx="32" cy="38" rx="8" ry="10" fill="#ffffff"/>
      <path d="M26 16 22 8m16 8 4-8" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="28" cy="24" rx="2" ry="3" fill="#ffffff"/>
      <ellipse cx="36" cy="24" rx="2" ry="3" fill="#ffffff"/>
      <path d="M24 46h16" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  mongodb: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#f4fbf6"/>
      <path d="M32 10c4 8 8 14 8 24 0 10-4 16-8 20-4-4-8-10-8-20 0-10 4-16 8-24Z" fill="#13aa52"/>
      <path d="M32 16v34" stroke="#b6d7c5" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  postgresql: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#f0f6ff"/>
      <path d="M22 42c0-12 6-20 14-20 10 0 12 10 12 18 0 8-4 14-10 14-3 0-5-2-6-4-2 2-4 3-7 3-2 0-3-1-3-3 0-2 1-4 3-5-2-1-3-2-3-3Z" fill="#336791"/>
      <circle cx="36" cy="30" r="2.5" fill="#ffffff"/>
    </svg>`,
};

const buildDataUri = (key) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(logoSvgs[key] || logoSvgs.javascript)}`;

const TechLogo = ({ logo, alt, lazy = false }) => (
  <img
    alt={alt}
    className="lp-tech-logo"
    height="48"
    loading={lazy ? "lazy" : "eager"}
    src={buildDataUri(logo)}
    width="48"
  />
);

export default TechLogo;
