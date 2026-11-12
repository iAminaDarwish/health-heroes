import type { ReactNode } from 'react';

/* Simple flat icons in the game's colours. All drawn on a 64 x 64 grid. */
const N = '#1E3A56';
const B = '#2F6DB5';
const T = '#3FAE9F';
const R = '#E0533D';
const Y = '#F5C24B';
const W = '#FFFFFF';
const LB = '#BFD9F2';
const G = '#6DBE6B';
const DG = '#3F9A58';
const O = '#F29A4A';
const BR = '#B9855A';
const P = '#F2A6B5';
const S = '#F3C9A8';

const line = { stroke: N, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const face = <circle cx="32" cy="34" r="20" fill={S} {...line} />;
const glass = (
  <>
    <path d="M18 12h28l-4 42H22z" fill={W} {...line} />
    <path d="M20.6 30h22.8l-2.2 22H22.8z" fill={LB} />
    <path d="M18 12h28l-4 42H22z" fill="none" {...line} />
  </>
);

const icons: Record<string, ReactNode> = {
  /* ---- signs and toys ---- */
  drop: (
    <>
      <path d="M32 6C22 20 13 30 13 40a19 19 0 0038 0C51 30 42 20 32 6z" fill={B} />
      <path d="M22 40a10 10 0 008 10" fill="none" stroke={W} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  thirsty: (
    <>
      {glass}
      <path d="M50 8v8M56 14l-5 5M8 14l5 5M14 8v8" {...line} stroke={B} fill="none" />
    </>
  ),
  water: glass,
  toilet: (
    <>
      <rect x="14" y="8" width="20" height="26" rx="4" fill={W} {...line} />
      <path d="M14 34h38a4 4 0 010 8c-2 8-10 12-20 12S16 50 14 42z" fill={LB} {...line} />
      <path d="M26 54h14v4H26z" fill={W} {...line} />
      <circle cx="29" cy="15" r="2.5" fill={B} />
    </>
  ),
  tired: (
    <>
      <rect x="8" y="22" width="42" height="24" rx="5" fill={W} {...line} />
      <rect x="50" y="29" width="6" height="10" rx="2" fill={N} />
      <rect x="13" y="27" width="8" height="14" rx="2" fill={R} />
      <path d="M32 6h8l-8 9h8M46 4h6l-6 7h6" fill="none" {...line} stroke={B} strokeWidth="2.5" />
    </>
  ),
  weight: (
    <>
      <rect x="10" y="18" width="44" height="38" rx="8" fill={LB} {...line} />
      <path d="M20 34a12 12 0 0124 0z" fill={W} {...line} />
      <path d="M32 34l5-6" {...line} stroke={R} />
      <path d="M32 2v10M27 8l5 5 5-5" fill="none" {...line} stroke={R} />
    </>
  ),
  ball: (
    <>
      <circle cx="32" cy="32" r="24" fill={W} {...line} />
      <path d="M32 8a24 24 0 0121 13L32 32z" fill={R} />
      <path d="M11 44a24 24 0 01-3-12 24 24 0 013-11l21 11z" fill={Y} />
      <path d="M53 43a24 24 0 01-42 1l21-12z" fill={T} />
      <circle cx="32" cy="32" r="24" fill="none" {...line} />
      <circle cx="32" cy="32" r="4" fill={W} {...line} />
    </>
  ),
  book: (
    <>
      <path d="M8 14c8-4 16-4 24 2v38c-8-6-16-6-24-2z" fill={T} {...line} />
      <path d="M56 14c-8-4-16-4-24 2v38c8-6 16-6 24-2z" fill={B} {...line} />
    </>
  ),
  teddy: (
    <>
      <circle cx="18" cy="14" r="7" fill={BR} {...line} />
      <circle cx="46" cy="14" r="7" fill={BR} {...line} />
      <ellipse cx="32" cy="44" rx="16" ry="14" fill={BR} {...line} />
      <circle cx="32" cy="24" r="15" fill={BR} {...line} />
      <ellipse cx="32" cy="29" rx="6" ry="4.5" fill={S} />
      <circle cx="32" cy="27" r="2" fill={N} />
      <ellipse cx="32" cy="46" rx="8" ry="7" fill={S} />
    </>
  ),
  kite: (
    <>
      <path d="M34 4l18 20-18 26-18-26z" fill={Y} {...line} />
      <path d="M34 4v46M16 24h36" {...line} />
      <path d="M34 50c-6 2-2 6-8 8" fill="none" {...line} stroke={R} />
    </>
  ),
  car: (
    <>
      <path d="M6 42v-8c0-3 2-5 5-5l6-10c1-2 3-3 5-3h18c2 0 4 1 5 3l6 10h2c3 0 5 2 5 5v8z" fill={R} {...line} />
      <path d="M21 29l4-8h14l4 8z" fill={LB} {...line} strokeWidth="2.5" />
      <circle cx="19" cy="44" r="6" fill={W} {...line} />
      <circle cx="45" cy="44" r="6" fill={W} {...line} />
    </>
  ),

  /* ---- food and habits ---- */
  milk: (
    <>
      <path d="M20 22l6-12h12l6 12v32H20z" fill={W} {...line} />
      <path d="M20 22h24M26 10v-4h12v4" fill="none" {...line} />
      <rect x="20" y="32" width="24" height="12" fill={LB} />
      <path d="M20 22l6-12h12l6 12v32H20z" fill="none" {...line} />
    </>
  ),
  egg: (
    <>
      <path d="M32 10c14-2 26 8 24 22-2 12-12 22-26 20S6 40 10 28c3-9 10-16 22-18z" fill={W} {...line} />
      <circle cx="33" cy="32" r="10" fill={Y} {...line} />
    </>
  ),
  fish: (
    <>
      <path d="M44 32l14-12v24z" fill={B} {...line} />
      <ellipse cx="28" cy="32" rx="22" ry="14" fill={LB} {...line} />
      <circle cx="16" cy="29" r="2.5" fill={N} />
      <path d="M28 22c4 6 4 14 0 20" fill="none" {...line} strokeWidth="2.5" />
    </>
  ),
  chicken: (
    <>
      <path d="M40 36l12 12" {...line} stroke={W} strokeWidth="8" />
      <path d="M40 36l12 12" {...line} strokeWidth="2" strokeDasharray="0" opacity="0" />
      <circle cx="52" cy="52" r="5" fill={W} {...line} />
      <circle cx="57" cy="46" r="4" fill={W} {...line} />
      <path d="M10 22c0-10 10-16 20-12 10 3 16 14 14 24-1 6-8 10-14 8C18 40 10 32 10 22z" fill={O} {...line} />
    </>
  ),
  broccoli: (
    <>
      <path d="M27 36h10l3 20H24z" fill={G} {...line} />
      <circle cx="20" cy="28" r="10" fill={DG} {...line} />
      <circle cx="44" cy="28" r="10" fill={DG} {...line} />
      <circle cx="32" cy="19" r="12" fill={DG} {...line} />
      <circle cx="32" cy="31" r="8" fill={DG} />
    </>
  ),
  apple: (
    <>
      <path d="M32 20c-8-6-22-2-22 14 0 12 8 22 16 22 3 0 4-1 6-1s3 1 6 1c8 0 16-10 16-22 0-16-14-20-22-14z" fill={R} {...line} />
      <path d="M32 20c0-6 2-10 6-13" fill="none" {...line} />
      <path d="M38 12c4-5 10-5 13-3-2 5-8 7-13 3z" fill={G} {...line} strokeWidth="2.5" />
    </>
  ),
  sleep: (
    <>
      <path d="M40 8a24 24 0 1014 40A22 22 0 0140 8z" fill={Y} {...line} />
      <path d="M44 16h10l-10 11h10" fill="none" {...line} stroke={B} />
    </>
  ),
  sport: (
    <>
      <circle cx="32" cy="32" r="24" fill={W} {...line} />
      <path d="M32 21l10 8-4 12H26l-4-12z" fill={N} />
      <path d="M32 21V9M42 29l12-4M38 41l7 10M26 41l-7 10M22 29l-12-4" {...line} strokeWidth="2.5" />
    </>
  ),
  candy: (
    <>
      <path d="M18 32L4 22v20zM46 32l14-10v20z" fill={P} {...line} />
      <circle cx="32" cy="32" r="15" fill={R} {...line} />
      <path d="M24 26c6 0 8 12 16 12" fill="none" stroke={W} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  chips: (
    <>
      <path d="M16 8h32l-3 6 3 6v30l-3 6H19l-3-6V20l3-6z" fill={Y} {...line} />
      <ellipse cx="32" cy="34" rx="10" ry="7" fill={O} {...line} strokeWidth="2.5" />
    </>
  ),
  fizzy: (
    <>
      <path d="M20 14l3-6h18l3 6v38l-3 6H23l-3-6z" fill={R} {...line} />
      <path d="M20 26h24v14H20z" fill={W} />
      <path d="M20 14l3-6h18l3 6v38l-3 6H23l-3-6z" fill="none" {...line} />
      <circle cx="28" cy="33" r="2.5" fill={R} />
      <circle cx="36" cy="31" r="2" fill={R} />
      <circle cx="35" cy="37" r="1.5" fill={R} />
    </>
  ),
  screen: (
    <>
      <rect x="6" y="14" width="52" height="36" rx="6" fill={N} />
      <rect x="11" y="19" width="42" height="26" rx="2" fill={LB} />
      <path d="M36 24a9 9 0 105 14 8 8 0 01-5-14z" fill={Y} stroke={N} strokeWidth="2" />
    </>
  ),
  carrot: (
    <>
      <path d="M38 18c6 6 6 12 2 18L18 58c-4 2-8-2-6-6l22-22c2-2 6-2 4-12z" fill={O} {...line} />
      <path d="M44 8c-2 6-2 10 0 14M52 12c-4 4-6 8-6 10M56 22c-4 0-8 0-10 2" fill="none" {...line} stroke={DG} />
      <path d="M26 38l4 4M20 46l3 3" {...line} strokeWidth="2.5" />
    </>
  ),
  tomato: (
    <>
      <ellipse cx="32" cy="36" rx="22" ry="20" fill={R} {...line} />
      <path d="M32 18l-8-6 6 1 2-6 2 6 6-1z" fill={G} {...line} strokeWidth="2.5" />
    </>
  ),
  rice: (
    <>
      <path d="M12 30a20 14 0 0140 0z" fill={W} {...line} />
      <path d="M8 30h48c0 14-10 24-24 24S8 44 8 30z" fill={B} {...line} />
      <path d="M24 22l3 2M34 18l3 2M40 24l-3 2" {...line} strokeWidth="2" />
    </>
  ),
  bread: (
    <>
      <path d="M12 26c-6-6 0-16 20-16s26 10 20 16v24a4 4 0 01-4 4H16a4 4 0 01-4-4z" fill={Y} {...line} />
      <path d="M12 26c-6-6 0-16 20-16s26 10 20 16" fill={O} {...line} />
    </>
  ),
  donut: (
    <>
      <circle cx="32" cy="32" r="24" fill={BR} {...line} />
      <path d="M32 10c14 0 24 10 22 24-3 2-5-2-8 0s-4 6-8 4-6 2-10 0-5-4-9-3-7 1-9-3C8 20 18 10 32 10z" fill={P} />
      <circle cx="32" cy="32" r="24" fill="none" {...line} />
      <circle cx="32" cy="32" r="7" fill={W} {...line} />
      <path d="M20 22l3 2M40 18l2 3M46 30l3-1M22 32l-3 2" {...line} stroke={W} strokeWidth="2.5" />
    </>
  ),

  /* ---- injection ---- */
  hands: (
    <>
      <path d="M18 56V34l-6-10c-2-4 3-7 6-3l6 8V14a4 4 0 018 0v12-2a4 4 0 018 0v4a4 4 0 018 0v16c0 8-4 14-10 14z" fill={S} {...line} />
      <circle cx="50" cy="12" r="6" fill={LB} {...line} strokeWidth="2.5" />
      <circle cx="12" cy="10" r="4" fill={LB} {...line} strokeWidth="2.5" />
      <circle cx="56" cy="26" r="3" fill={LB} {...line} strokeWidth="2" />
    </>
  ),
  pen: (
    <g transform="rotate(45 32 32)">
      <rect x="25" y="4" width="14" height="40" rx="5" fill={B} {...line} />
      <rect x="29" y="14" width="6" height="12" rx="2" fill={W} />
      <rect x="27" y="44" width="10" height="8" fill={W} {...line} />
      <path d="M32 52v8" {...line} />
      <rect x="27" y="-2" width="10" height="6" rx="2" fill={T} {...line} />
    </g>
  ),
  pin: (
    <>
      <path d="M32 58C20 42 12 34 12 24a20 20 0 0140 0c0 10-8 18-20 34z" fill={T} {...line} />
      <circle cx="32" cy="24" r="8" fill={W} {...line} />
    </>
  ),
  ten: (
    <>
      <circle cx="32" cy="32" r="25" fill={W} {...line} />
      <path d="M32 12v4M32 48v4M12 32h4M48 32h4" {...line} strokeWidth="2.5" />
      <text x="32" y="41" textAnchor="middle" fontSize="24" fontWeight="900" fill={B} fontFamily="Tajawal, sans-serif">
        10
      </text>
    </>
  ),
  box: (
    <>
      <path d="M12 22h40l-4 34H16z" fill={Y} {...line} />
      <rect x="8" y="12" width="48" height="10" rx="3" fill={R} {...line} />
      <rect x="24" y="15" width="16" height="4" rx="2" fill={N} />
      <path d="M32 30v14M25 37h14" {...line} stroke={R} strokeWidth="4" />
    </>
  ),
  plaster: (
    <g transform="rotate(-35 32 32)">
      <rect x="6" y="22" width="52" height="20" rx="10" fill={S} {...line} />
      <rect x="23" y="22" width="18" height="20" fill={W} {...line} />
      <circle cx="14" cy="32" r="1.8" fill={N} />
      <circle cx="50" cy="32" r="1.8" fill={N} />
    </g>
  ),

  /* ---- feelings ---- */
  shaky: (
    <>
      <path d="M22 56V34l-5-9c-2-4 3-7 6-3l5 7V14a4 4 0 018 0v10a4 4 0 018 0v4a4 4 0 017 0v14c0 8-4 14-10 14z" fill={S} {...line} />
      <path d="M8 20c3 3-3 6 0 9s-3 6 0 9M58 14c3 3-3 6 0 9s-3 6 0 9" fill="none" {...line} stroke={B} />
    </>
  ),
  sweaty: (
    <>
      {face}
      <path d="M10 8c-4 6-5 8-5 10a5 5 0 0010 0c0-2-1-4-5-10zM54 6c-4 6-5 8-5 10a5 5 0 0010 0c0-2-1-4-5-10zM32 0c-3 5-4 6-4 8a4 4 0 008 0c0-2-1-3-4-8z" fill={B} />
    </>
  ),
  hungry: (
    <>
      <circle cx="32" cy="34" r="20" fill={W} {...line} />
      <circle cx="32" cy="34" r="12" fill="none" {...line} stroke={LB} />
      <path d="M6 12v12a3 3 0 006 0V12M9 24v32M58 12c-5 4-5 14 0 18v26" fill="none" {...line} />
    </>
  ),
  dizzy: (
    <>
      <path d="M32 32c0-3 5-3 5 1 0 6-10 7-11 0-1-10 15-12 18-1 3 13-19 19-26 5C12 22 30 8 46 16" fill="none" {...line} stroke={B} strokeWidth="4" />
      <path d="M52 40l1.800 4 4.200.5-3 3 .800 4.500-3.800-2.200-3.800 2.200.800-4.500-3-3 4.200-.500z" fill={Y} stroke={N} strokeWidth="2" />
    </>
  ),
  pale: (
    <>
      <circle cx="32" cy="34" r="20" fill="#F4EEE6" {...line} />
      <path d="M24 44c4-3 12-3 16 0" fill="none" {...line} />
      <path d="M32 2v8M22 5l2 6M42 5l-2 6" {...line} stroke={LB} />
    </>
  ),
  headache: (
    <>
      {face}
      <path d="M12 4l-4 8h6l-4 8M54 4l-4 8h6l-4 8M33 0l-3 6h5l-3 6" fill="none" {...line} stroke={R} />
    </>
  ),
  laugh: (
    <>
      {face}
      <path d="M21 36a11 11 0 0022 0z" fill={W} {...line} />
    </>
  ),
  sing: (
    <>
      <path d="M22 46V14l28-6v32" fill="none" {...line} strokeWidth="4" />
      <ellipse cx="15" cy="46" rx="8" ry="6" fill={B} {...line} />
      <ellipse cx="43" cy="40" rx="8" ry="6" fill={B} {...line} />
    </>
  ),

  /* ---- low sugar helpers ---- */
  juice: (
    <>
      <path d="M36 14L44 2" {...line} stroke={R} strokeWidth="4" />
      <path d="M16 14h32v42a2 2 0 01-2 2H18a2 2 0 01-2-2z" fill={O} {...line} />
      <path d="M16 14l6-6h20l6 6" fill={Y} {...line} />
      <circle cx="32" cy="38" r="9" fill={Y} {...line} strokeWidth="2.5" />
      <path d="M32 29v18M23 38h18" {...line} strokeWidth="2" />
    </>
  ),
  tablets: (
    <>
      <circle cx="22" cy="24" r="13" fill={W} {...line} />
      <path d="M13 24h18" {...line} strokeWidth="2.5" />
      <circle cx="42" cy="42" r="13" fill={W} {...line} />
      <path d="M36 35l12 14" {...line} strokeWidth="2.5" />
    </>
  ),
  salad: (
    <>
      <circle cx="22" cy="24" r="9" fill={G} {...line} />
      <circle cx="40" cy="22" r="10" fill={DG} {...line} />
      <circle cx="32" cy="18" r="6" fill={R} {...line} />
      <path d="M6 30h52c0 14-10 24-26 24S6 44 6 30z" fill={LB} {...line} />
    </>
  ),
  cheese: (
    <>
      <path d="M6 44L48 14c6 4 10 12 10 20v10z" fill={Y} {...line} />
      <path d="M6 44h52v10H6z" fill={Y} {...line} />
      <circle cx="40" cy="30" r="4" fill={O} />
      <circle cx="26" cy="38" r="3" fill={O} />
      <circle cx="46" cy="48" r="2.500" fill={O} />
    </>
  ),

  /* ---- health things ---- */
  meter: (
    <>
      <path d="M26 8h12v10H26z" fill={W} {...line} />
      <rect x="14" y="16" width="36" height="42" rx="10" fill={T} {...line} />
      <rect x="20" y="22" width="24" height="16" rx="3" fill={W} {...line} strokeWidth="2.500" />
      <path d="M32 26c-2 3-3 4-3 5.500a3 3 0 006 0c0-1.500-1-2.500-3-5.500z" fill={R} />
      <circle cx="32" cy="48" r="4" fill={W} {...line} strokeWidth="2.500" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M16 6v16a12 12 0 0024 0V6" fill="none" {...line} strokeWidth="4" />
      <path d="M28 34v8a10 10 0 0020 0v-4" fill="none" {...line} strokeWidth="4" />
      <circle cx="48" cy="32" r="7" fill={T} {...line} />
      <circle cx="16" cy="6" r="3" fill={N} />
      <circle cx="40" cy="6" r="3" fill={N} />
    </>
  ),
  ruler: (
    <>
      <rect x="22" y="4" width="20" height="56" rx="4" fill={Y} {...line} />
      <path d="M22 14h8M22 24h12M22 34h8M22 44h12M22 54h8" {...line} strokeWidth="2.500" />
    </>
  ),
  bluecircle: <circle cx="32" cy="32" r="20" fill="none" stroke={B} strokeWidth="10" />,

  /* ---- home and interface ---- */
  plate: (
    <>
      <circle cx="36" cy="34" r="20" fill={W} {...line} />
      <path d="M36 14v40M36 34h20" {...line} stroke={LB} />
      <circle cx="36" cy="34" r="20" fill="none" {...line} />
      <path d="M6 10v12a3 3 0 006 0V10M9 22v34" fill="none" {...line} />
    </>
  ),
  cards: (
    <>
      <rect x="8" y="10" width="28" height="38" rx="5" fill={T} {...line} transform="rotate(-10 22 29)" />
      <rect x="28" y="16" width="28" height="38" rx="5" fill={W} {...line} transform="rotate(8 42 35)" />
      <path d="M42 29l2 4.500 5 .500-3.700 3.400 1 5-4.300-2.600-4.300 2.600 1-5-3.700-3.400 5-.500z" fill={Y} stroke={N} strokeWidth="2" transform="rotate(8 42 35)" />
    </>
  ),
  star: <path d="M32 4l8.500 17.500L60 24.300 46 38l3.300 19.500L32 48.300 14.700 57.500 18 38 4 24.300l19.500-2.800z" fill={Y} stroke={N} strokeWidth="3" strokeLinejoin="round" />,
  starOff: <path d="M32 4l8.500 17.500L60 24.300 46 38l3.300 19.500L32 48.300 14.700 57.500 18 38 4 24.300l19.500-2.800z" fill="#E3EAF3" stroke="#B8C6D8" strokeWidth="3" strokeLinejoin="round" />,
  medal: (
    <>
      <path d="M20 4l12 22L44 4" fill="none" {...line} stroke={R} strokeWidth="8" />
      <circle cx="32" cy="40" r="18" fill={Y} {...line} />
      <path d="M32 29l3.200 6.600 7.300 1-5.300 5 1.300 7.200-6.500-3.500-6.500 3.500 1.300-7.200-5.300-5 7.300-1z" fill={W} stroke={N} strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  back: <path d="M38 12L18 32l20 20M18 32h30" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />,
  soundOn: (
    <>
      <path d="M8 24h10l14-12v40L18 40H8z" fill="currentColor" />
      <path d="M40 22c5 5 5 15 0 20M47 14c9 9 9 27 0 36" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  soundOff: (
    <>
      <path d="M8 24h10l14-12v40L18 40H8z" fill="currentColor" />
      <path d="M42 24l14 16M56 24L42 40" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  home: (
    <>
      <path d="M8 32L32 10l24 22" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 30v24h32V30" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  replay: (
    <>
      <path d="M50 32a18 18 0 11-6-13.400" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M46 6v14H32" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  check: <path d="M12 34l14 14 26-30" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />,
};

export default function Icon({ name, size = 48, className }: { name: string; size?: number | string; className?: string }) {
  return (
    <svg className={className} viewBox="-2 -4 68 70" width={size} height={size} aria-hidden="true" focusable="false">
      {icons[name] ?? icons.star}
    </svg>
  );
}
