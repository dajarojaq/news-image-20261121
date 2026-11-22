import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const REPO_DIR = path.resolve(import.meta.dirname);
const ROOT_DIR = path.resolve(REPO_DIR, '..');
const VERIFY_DIR = path.join(ROOT_DIR, 'verify');
fs.mkdirSync(VERIFY_DIR, { recursive: true });

const HTML_PATH = path.join(VERIFY_DIR, 'poster.html');
const RAW_PNG = path.join(VERIFY_DIR, 'raw_render.png');
const OUT_PNG = path.join(REPO_DIR, 'entry.png');
const PREVIEW_300 = path.join(VERIFY_DIR, 'preview_300.png');
const CARDS_ZOOM = path.join(VERIFY_DIR, 'cards_zoom.png');
const BOTTOM_ZOOM = path.join(VERIFY_DIR, 'bottom_zoom.png');

const REGIONS = {
  EU: { name: 'Europe', color: '#1B4F9C' },      // Biru
  AS: { name: 'Asia', color: '#137A54' },        // Hijau
  ME: { name: 'Middle East', color: '#D45B0A' }, // Orange
  AM: { name: 'Americas', color: '#C41E1A' },    // Merah
  AF: { name: 'Africa', color: '#6D3FA6' },      // Ungu
  OC: { name: 'Oceania', color: '#B57B08' },     // Jingga
  SP: { name: 'Space', color: '#14171F' },       // Hitam
};

const KEY_FIGURES = [
  { val: 'Day 13', label: 'of COP31 talks past deadline' },
  { val: '<$59,000', label: 'Bitcoin low in tech sell-off' },
  { val: '8 yrs', label: "BepiColombo's trip to Mercury" },
  { val: '5', label: 'missiles downed (Riyadh, Jizan)' },
  { val: '98.5%', label: 'tariffs cut in EU–Indonesia pact' },
  { val: '146', label: 'evacuated safe off Davao 767' },
];

// Lead cards (#1 - #3) — exact 324x130 inner fit, uniform x=6 y=6 banner & x=0 bottom-left source tag
const LEAD_CARDS = [
  {
    id: 1,
    reg: 'ME',
    kicker: 'ANTALYA · CLIMATE',
    headline: 'COP31 climate talks stall in Antalya overtime',
    deck: 'Summit misses Friday close; draft strips fossil-fuel language as France, Panama and EU push back.',
    source: 'UN, AFP',
    svg: `<svg viewBox="0 0 324 130" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="copSky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#DCEEE4"/>
          <stop offset="100%" stop-color="#EFF6F1"/>
        </linearGradient>
      </defs>
      <rect width="324" height="130" fill="url(#copSky)"/>
      <line x1="0" y1="65" x2="324" y2="65" stroke="#C5DDD0" stroke-width="0.8"/>
      <!-- Detailed Earth Globe bottom-left -->
      <g transform="translate(56,85)">
        <circle cx="0" cy="0" r="23" fill="#3C91C9" stroke="#111827" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="10.5" ry="23" fill="none" stroke="#8CC6EB" stroke-width="0.9"/>
        <line x1="-23" y1="0" x2="23" y2="0" stroke="#8CC6EB" stroke-width="0.9"/>
        <path d="M-11,-13 C-6,-14 0,-10 1,-5 C2,0 -4,3 -2,9 C0,14 -8,18 -13,13 C-17,8 -16,-5 -11,-13 Z" fill="#2F8E5B" stroke="#111827" stroke-width="0.9"/>
        <path d="M6,-11 C13,-10 19,-4 17,5 C15,11 9,14 5,8 C3,4 6,-4 6,-11 Z" fill="#2F8E5B" stroke="#111827" stroke-width="0.9"/>
      </g>
      <!-- Rising Red Mercury Thermometer -->
      <g transform="translate(106,59)">
        <rect x="-5" y="0" width="10" height="35" rx="5" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>
        <circle cx="0" cy="38" r="8.8" fill="#C92119" stroke="#111827" stroke-width="2"/>
        <rect x="-2.4" y="6" width="4.8" height="29" rx="2" fill="#C92119"/>
        <line x1="7" y1="8" x2="11" y2="8" stroke="#111827" stroke-width="1.4"/>
        <line x1="7" y1="16" x2="11" y2="16" stroke="#111827" stroke-width="1.4"/>
        <line x1="7" y1="24" x2="11" y2="24" stroke="#111827" stroke-width="1.4"/>
      </g>
      <!-- Overtime Clock top-right -->
      <g transform="translate(287,31)">
        <circle cx="0" cy="0" r="21.5" fill="#FFFFFF" stroke="#111827" stroke-width="2.2"/>
        <path d="M0,0 L0,-17.5 A17.5,17.5 0 0,1 17.5,0 Z" fill="#FAD4D1"/>
        <line x1="0" y1="-18.5" x2="0" y2="-14.5" stroke="#111827" stroke-width="1.8"/>
        <line x1="18.5" y1="0" x2="14.5" y2="0" stroke="#111827" stroke-width="1.8"/>
        <line x1="0" y1="18.5" x2="0" y2="14.5" stroke="#111827" stroke-width="1.8"/>
        <line x1="-18.5" y1="0" x2="-14.5" y2="0" stroke="#111827" stroke-width="1.8"/>
        <line x1="0" y1="0" x2="0" y2="-11.5" stroke="#111827" stroke-width="2.4" stroke-linecap="round"/>
        <line x1="0" y1="0" x2="11" y2="5" stroke="#D45B0A" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="0" cy="0" r="2.5" fill="#111827"/>
      </g>
      <!-- Draft Treaty Document with crossed-out Fossil Fuels + Gavel -->
      <g transform="translate(140,59)">
        <path d="M0,0 L150,0 L164,14 L164,62 L0,62 Z" fill="#FFFDF9" stroke="#111827" stroke-width="1.8"/>
        <path d="M150,0 L150,14 L164,14" fill="#E5DFD2" stroke="#111827" stroke-width="1.4"/>
        <text x="10" y="16" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="9" font-weight="800" fill="#4B5563">REVISED DRAFT TEXT</text>
        <text x="10" y="34" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.5" font-weight="800" fill="#111827">FOSSIL FUELS</text>
        <line x1="8" y1="29.5" x2="108" y2="29.5" stroke="#C41E1A" stroke-width="3.2"/>
        <rect x="113" y="21" width="42" height="14" rx="2" fill="#C41E1A"/>
        <text x="134" y="31" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.2" font-weight="800" fill="#FFFFFF">CUT</text>
        <line x1="10" y1="45" x2="95" y2="45" stroke="#9CA3AF" stroke-width="2.2"/>
        <line x1="10" y1="53" x2="78" y2="53" stroke="#9CA3AF" stroke-width="2.2"/>
        <!-- Wooden Gavel striking corner -->
        <g transform="translate(124,47) rotate(-32)">
          <rect x="-14" y="-6" width="24" height="11" rx="2.5" fill="#7C4A22" stroke="#111827" stroke-width="1.6"/>
          <rect x="-15" y="-7" width="4" height="13" rx="1" fill="#A66A38" stroke="#111827" stroke-width="1.3"/>
          <rect x="7" y="-7" width="4" height="13" rx="1" fill="#A66A38" stroke="#111827" stroke-width="1.3"/>
          <rect x="-3" y="5" width="5" height="22" rx="1.5" fill="#5C3415" stroke="#111827" stroke-width="1.5"/>
        </g>
      </g>
      <!-- Uniform Top Banner (Middle East = Orange) -->
      <rect x="6" y="6" width="184" height="27" fill="${REGIONS.ME.color}" stroke="#FFFFFF" stroke-width="1.6"/>
      <text x="98" y="25.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="18.2" font-weight="800" fill="#FFFFFF" letter-spacing="0.2">COP31: DAY 13</text>
      <rect x="6" y="37" width="166" height="18" fill="#FFFFFF" stroke="#111827" stroke-width="1.2"/>
      <text x="89" y="49.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="11" font-weight="700" fill="#111827">No deal · overtime talks</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="112" width="128" height="18" fill="#111827"/>
      <text x="64" y="124.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="9.5" font-weight="700" fill="#FFFFFF">Confirmed · UN, AFP</text>
    </svg>`,
  },
  {
    id: 2,
    reg: 'SP',
    kicker: 'MERCURY · SPACE',
    headline: 'BepiColombo enters Mercury orbit after 8 years',
    deck: 'ESA–JAXA spacecraft reaches innermost planet; twin MPO and Mio orbiters separate in December.',
    source: 'ESA, JAXA',
    svg: `<svg viewBox="0 0 324 130" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="deepSpace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#071022"/>
          <stop offset="70%" stop-color="#132245"/>
          <stop offset="100%" stop-color="#1E305C"/>
        </linearGradient>
        <radialGradient id="sunGlow" cx="100%" cy="55%" r="45%">
          <stop offset="0%" stop-color="#FFE066" stop-opacity="0.85"/>
          <stop offset="40%" stop-color="#F59E0B" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="mercSphere" cx="68%" cy="42%" r="68%">
          <stop offset="0%" stop-color="#E4DCD0"/>
          <stop offset="48%" stop-color="#9A9085"/>
          <stop offset="85%" stop-color="#4A453F"/>
          <stop offset="100%" stop-color="#272421"/>
        </radialGradient>
      </defs>
      <rect width="324" height="130" fill="url(#deepSpace)"/>
      <rect width="324" height="130" fill="url(#sunGlow)"/>
      <!-- Crisp stars -->
      <g fill="#FFFFFF">
        <circle cx="26" cy="64" r="1.2"/><circle cx="52" cy="96" r="1"/><circle cx="72" cy="70" r="1.3"/>
        <circle cx="222" cy="18" r="1.2"/><circle cx="256" cy="24" r="1.5"/><circle cx="288" cy="14" r="1.1"/>
        <circle cx="196" cy="110" r="1.2"/><circle cx="242" cy="116" r="1"/><circle cx="294" cy="106" r="1.4"/>
      </g>
      <circle cx="336" cy="74" r="24" fill="#FFF3B0"/>
      <!-- Orbital capture trajectory -->
      <ellipse cx="168" cy="82" rx="112" ry="36" transform="rotate(-9 168 82)" fill="none" stroke="#60D5FF" stroke-width="2" stroke-dasharray="6 4"/>
      <polygon points="216,46 228,47 221,56" fill="#60D5FF"/>
      <!-- Detailed Cratered Mercury -->
      <g transform="translate(118,83)">
        <circle cx="0" cy="0" r="31" fill="url(#mercSphere)" stroke="#D6CEC2" stroke-width="1"/>
        <circle cx="10" cy="-9" r="6.8" fill="#7D7469" stroke="#C5BCB0" stroke-width="0.9"/>
        <line x1="10" y1="-15.8" x2="13" y2="-22.5" stroke="#E0D8CC" stroke-width="0.7" opacity="0.6"/>
        <line x1="16.8" y1="-9" x2="23.5" y2="-11" stroke="#E0D8CC" stroke-width="0.7" opacity="0.6"/>
        <circle cx="-11" cy="7" r="5.8" fill="#46413B" stroke="#756E65" stroke-width="0.8"/>
        <circle cx="8" cy="12" r="4.8" fill="#696157" stroke="#A89F93" stroke-width="0.8"/>
        <circle cx="-6" cy="-14" r="4" fill="#5D564E"/>
        <circle cx="18.5" cy="3" r="3.2" fill="#8B8276"/>
        <circle cx="-18" cy="-4" r="3.5" fill="#3B3732"/>
      </g>
      <!-- Detailed BepiColombo Stacked Spacecraft -->
      <g transform="translate(235,61) rotate(-14)">
        <polygon points="-24,0 -52,-5 -44,0 -52,5" fill="#5CE1FF" opacity="0.8"/>
        <rect x="-32" y="-17" width="22" height="10" fill="#1D6AD8" stroke="#BAE0FF" stroke-width="1.1"/>
        <line x1="-25" y1="-17" x2="-25" y2="-7" stroke="#85C1FF" stroke-width="0.7"/>
        <line x1="-17" y1="-17" x2="-17" y2="-7" stroke="#85C1FF" stroke-width="0.7"/>
        <line x1="-32" y1="-12" x2="-10" y2="-12" stroke="#85C1FF" stroke-width="0.7"/>
        <rect x="10" y="-17" width="22" height="10" fill="#1D6AD8" stroke="#BAE0FF" stroke-width="1.1"/>
        <line x1="17" y1="-17" x2="17" y2="-7" stroke="#85C1FF" stroke-width="0.7"/>
        <line x1="25" y1="-17" x2="25" y2="-7" stroke="#85C1FF" stroke-width="0.7"/>
        <line x1="10" y1="-12" x2="32" y2="-12" stroke="#85C1FF" stroke-width="0.7"/>
        <rect x="-11" y="-12" width="22" height="22" rx="2" fill="#E8B638" stroke="#FFFFFF" stroke-width="1.2"/>
        <rect x="-8" y="-18" width="16" height="6" rx="1.5" fill="#E2E8F0" stroke="#1E293B" stroke-width="0.9"/>
        <path d="M-6,-22 Q0,-16 6,-22 Z" fill="#F8FAFC" stroke="#1E293B" stroke-width="0.9"/>
        <line x1="11" y1="6" x2="28" y2="14" stroke="#E2E8F0" stroke-width="1.3"/>
        <circle cx="29" cy="14.5" r="2" fill="#FBBF24"/>
      </g>
      <!-- Uniform Top Banner (Space = Hitam) -->
      <rect x="6" y="6" width="194" height="27" fill="${REGIONS.SP.color}" stroke="#FFFFFF" stroke-width="1.6"/>
      <text x="103" y="25.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" letter-spacing="0.2">MERCURY ORBIT</text>
      <rect x="6" y="37" width="154" height="18" fill="#FFFFFF" stroke="#0C1730" stroke-width="1.2"/>
      <text x="83" y="49.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="11" font-weight="700" fill="#111827">8 yrs · MPO + Mio probes</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="112" width="144" height="18" fill="#0B1220"/>
      <text x="72" y="124.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="9.5" font-weight="700" fill="#FFFFFF">Confirmed · ESA, JAXA</text>
    </svg>`,
  },
  {
    id: 3,
    reg: 'EU',
    kicker: 'WARSAW · BALTIC',
    headline: 'Rutte pledges Polish defense as drones hit ship',
    deck: 'NATO chief vows to defend "every inch" in Warsaw; drones cripple Russian cargo ship Sparta II.',
    source: 'NATO, Yle',
    svg: `<svg viewBox="0 0 324 130" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <!-- Baltic Sea / Gulf of Finland -->
      <rect width="324" height="130" fill="#6EA2CF"/>
      <path d="M180,30 Q190,26 200,30 T220,30 M256,22 Q266,18 276,22 M195,97 Q208,93 221,97 T247,97 M270,93 Q282,89 294,93" fill="none" stroke="#B7D7F0" stroke-width="1.4" stroke-linecap="round"/>
      <!-- Poland landmass left -->
      <path d="M0,0 L166,0 L166,46 C158,64 162,88 152,130 L0,130 Z" fill="#EAE1CD" stroke="#6E6554" stroke-width="1.6"/>
      <line x1="146" y1="53" x2="138" y2="112" stroke="#C41E1A" stroke-width="2" stroke-dasharray="5 3"/>
      <!-- Warsaw Palace spire silhouette -->
      <g fill="#B8AF9B" stroke="#6E6554" stroke-width="1">
        <rect x="20" y="90" width="32" height="22"/>
        <rect x="28" y="78" width="16" height="12"/>
        <polygon points="33,78 36,62 39,78"/>
      </g>
      <!-- Bold NATO Shield protecting Warsaw -->
      <g transform="translate(78,84)">
        <path d="M-16,-20 L16,-20 L16,0 C16,13 0,21 0,21 C0,21 -16,13 -16,0 Z" fill="${REGIONS.EU.color}" stroke="#FFFFFF" stroke-width="2.2"/>
        <path d="M-16,-20 L16,-20 L16,0 C16,13 0,21 0,21 C0,21 -16,13 -16,0 Z" fill="none" stroke="#111827" stroke-width="1"/>
        <polygon points="0,-13 3,-3 12,0 3,3 0,13 -3,3 -12,0 -3,-3" fill="#FFFFFF"/>
      </g>
      <path d="M158,84 Q130,70 106,80" fill="none" stroke="#C41E1A" stroke-width="2.2" stroke-dasharray="4 2.5"/>
      <polygon points="103,80 110,74 108,80 114,83 107,85 104,90 102,84 96,82" fill="#F59E0B" stroke="#C41E1A" stroke-width="0.9"/>
      <!-- Detailed Burning Cargo Ship Sparta II on Baltic -->
      <g transform="translate(240,67)">
        <ellipse cx="0" cy="18" rx="58" ry="4" fill="#3D6D99" opacity="0.6"/>
        <polygon points="-50,4 54,4 46,16 -44,16" fill="#1E293B" stroke="#111827" stroke-width="1.6"/>
        <polygon points="-46,12 48,12 46,16 -44,16" fill="#C41E1A"/>
        <rect x="-34" y="-4" width="24" height="8" fill="#475569" stroke="#111827" stroke-width="1.2"/>
        <rect x="-6" y="-5" width="22" height="9" fill="#64748B" stroke="#111827" stroke-width="1.2"/>
        <line x1="-22" y1="-4" x2="-12" y2="-20" stroke="#111827" stroke-width="1.8"/>
        <line x1="6" y1="-5" x2="18" y2="-20" stroke="#111827" stroke-width="1.8"/>
        <rect x="24" y="-14" width="18" height="18" fill="#F1F5F9" stroke="#111827" stroke-width="1.4"/>
        <rect x="27" y="-10" width="12" height="4" fill="#1E293B"/>
        <circle cx="-12" cy="-22" r="10" fill="#4B5563" opacity="0.85"/>
        <circle cx="-2" cy="-32" r="13" fill="#6B7280" opacity="0.72"/>
        <circle cx="12" cy="-40" r="11" fill="#9CA3AF" opacity="0.55"/>
        <polygon points="-24,3 -14,-16 -6,-4 0,-18 8,3" fill="#DC2626"/>
        <polygon points="-19,3 -12,-9 -6,0 0,-10 4,3" fill="#FACC15"/>
        <path d="M36,24 Q48,20 58,24 L54,29 L40,29 Z" fill="#F97316" stroke="#111827" stroke-width="1.2"/>
      </g>
      <g fill="#111827" stroke="#FFFFFF" stroke-width="0.7">
        <polygon points="186,21 202,28 190,32 192,27"/>
        <polygon points="210,11 224,19 213,22 215,17"/>
      </g>
      <text x="240" y="108" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="9.2" font-weight="800" fill="#0B1F38">SPARTA II · CREW EVACUATED</text>
      <!-- Uniform Top Banner (Europe = Biru) -->
      <rect x="6" y="6" width="168" height="27" fill="${REGIONS.EU.color}" stroke="#FFFFFF" stroke-width="1.6"/>
      <text x="90" y="25.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" letter-spacing="0.2">NATO · BALTIC</text>
      <rect x="6" y="37" width="144" height="18" fill="#FFFFFF" stroke="#111827" stroke-width="1.2"/>
      <text x="78" y="49.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="11" font-weight="700" fill="#111827">"Every inch" · ship hit</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="112" width="142" height="18" fill="#111827"/>
      <text x="71" y="124.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="9.5" font-weight="700" fill="#FFFFFF">Confirmed · NATO, Yle</text>
    </svg>`,
  },
];

// Mid cards (#4 - #13) — 10 unique beats, exact 192x76 inner fit, uniform x=6 y=6 banner & x=0 bottom-left tag
const MID_CARDS = [
  {
    id: 4,
    reg: 'ME',
    kicker: 'RIYADH · JIZAN',
    headline: 'Five Houthi missiles downed over Saudi Arabia',
    deck: 'Air defenses destroy three over Riyadh and two over Jizan.',
    source: 'AFP',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="76" fill="#0F1B36"/>
      <circle cx="164" cy="14" r="1" fill="#FFF"/><circle cx="182" cy="24" r="1.2" fill="#FFF"/><circle cx="148" cy="26" r="1" fill="#FFF"/>
      <rect x="8" y="50" width="13" height="26" fill="#273A63"/>
      <rect x="24" y="46" width="12" height="30" fill="#32497A"/>
      <polygon points="39,76 46,35 53,76" fill="#4B669E" stroke="#85A5E0" stroke-width="0.7"/>
      <circle cx="46" cy="45" r="2.6" fill="#FBBF24"/>
      <path d="M58,76 L62,29 L76,29 L80,76 Z" fill="#6483BF" stroke="#B7CEFA" stroke-width="0.8"/>
      <path d="M64,29 Q69,46 74,29 Z" fill="#0F1B36"/>
      <line x1="63" y1="29" x2="75" y2="29" stroke="#E2ECFF" stroke-width="1.3"/>
      <rect x="83" y="52" width="15" height="24" fill="#273A63"/>
      <g fill="none" stroke="#FF6B6B" stroke-width="1.4" stroke-dasharray="3 2">
        <path d="M188,68 Q154,36 116,32"/>
        <path d="M190,56 Q160,34 134,39"/>
        <path d="M182,74 Q146,48 112,48"/>
        <path d="M190,42 Q168,28 152,32"/>
        <path d="M174,75 Q146,56 128,56"/>
      </g>
      <g stroke="#7DD3FC" stroke-width="1.2" opacity="0.85">
        <line x1="94" y1="74" x2="116" y2="32"/>
        <line x1="96" y1="74" x2="134" y2="39"/>
        <line x1="92" y1="74" x2="112" y2="48"/>
      </g>
      <g fill="#FACC15" stroke="#EA580C" stroke-width="0.8">
        <polygon points="116,25 118,30 123,32 118,34 116,39 114,34 109,32 114,30"/>
        <polygon points="134,33 136,37 140,39 136,41 134,45 132,41 128,39 132,37"/>
        <polygon points="112,42 114,46 118,48 114,50 112,54 110,50 106,48 110,46"/>
        <polygon points="152,27 153.5,30.5 157,32 153.5,33.5 152,37 150.5,33.5 147,32 150.5,30.5"/>
        <polygon points="128,51 129.5,54.5 133,56 129.5,57.5 128,61 126.5,57.5 123,56 126.5,54.5"/>
      </g>
      <!-- Uniform Top Banner (Middle East = Orange) -->
      <rect x="6" y="6" width="148" height="20" fill="${REGIONS.ME.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="80" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.2" font-weight="800" fill="#FFFFFF">SAUDI: 5 MISSILES</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="96" height="14" fill="#0B1120"/>
      <text x="48" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">Officials · Coalition</text>
    </svg>`,
  },
  {
    id: 5,
    reg: 'AS',
    kicker: 'INDONESIA · EU',
    headline: 'Indonesia and EU sign landmark trade pact',
    deck: 'Ten-year talks end in Brussels; pact cuts 98.5% of tariff lines.',
    source: 'EU',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="76" fill="#E6F3EC"/>
      <rect x="0" y="52" width="192" height="24" fill="#2A6EA6"/>
      <path d="M8,62 Q22,58 36,62 T64,62 M118,64 Q132,60 146,64 T174,64" fill="none" stroke="#9BD0F5" stroke-width="1.3"/>
      <rect x="7" y="30" width="33" height="10" fill="#CE1126"/>
      <rect x="7" y="40" width="33" height="10" fill="#FFFFFF"/>
      <rect x="7" y="30" width="33" height="20" fill="none" stroke="#111827" stroke-width="1.1"/>
      <rect x="152" y="30" width="33" height="20" fill="#003399" stroke="#111827" stroke-width="1.1"/>
      <g fill="#FFCC00">
        <circle cx="168.5" cy="34" r="0.9"/><circle cx="171.5" cy="35" r="0.9"/><circle cx="173.5" cy="37.2" r="0.9"/>
        <circle cx="174.3" cy="40" r="0.9"/><circle cx="173.5" cy="42.8" r="0.9"/><circle cx="171.5" cy="45" r="0.9"/>
        <circle cx="168.5" cy="46" r="0.9"/><circle cx="165.5" cy="45" r="0.9"/><circle cx="163.5" cy="42.8" r="0.9"/>
        <circle cx="162.7" cy="40" r="0.9"/><circle cx="163.5" cy="37.2" r="0.9"/><circle cx="165.5" cy="35" r="0.9"/>
      </g>
      <g transform="translate(96,48)">
        <polygon points="-44,-2 48,-2 40,10 -38,10" fill="#1E293B" stroke="#111827" stroke-width="1.3"/>
        <polygon points="-40,6 42,6 40,10 -38,10" fill="#C41E1A"/>
        <rect x="-34" y="-11" width="16" height="9" fill="#CE1126" stroke="#111827" stroke-width="1"/>
        <rect x="-18" y="-11" width="16" height="9" fill="#137A54" stroke="#111827" stroke-width="1"/>
        <rect x="-2" y="-11" width="16" height="9" fill="#1B4F9C" stroke="#111827" stroke-width="1"/>
        <rect x="-28" y="-19" width="16" height="8" fill="#E59A17" stroke="#111827" stroke-width="1"/>
        <rect x="-12" y="-19" width="16" height="8" fill="#0D9488" stroke="#111827" stroke-width="1"/>
        <rect x="18" y="-20" width="14" height="18" fill="#FFFFFF" stroke="#111827" stroke-width="1.2"/>
        <rect x="20" y="-17" width="10" height="4" fill="#1E293B"/>
      </g>
      <!-- Uniform Top Banner (Asia = Hijau) -->
      <rect x="6" y="6" width="132" height="20" fill="${REGIONS.AS.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="72" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.4" font-weight="800" fill="#FFFFFF">EU–INDONESIA</text>
      <rect x="142" y="6" width="44" height="20" fill="#FFFFFF" stroke="#111827" stroke-width="1.2"/>
      <text x="164" y="19.8" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="11.2" font-weight="800" fill="${REGIONS.AS.color}">−98.5%</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="90" height="14" fill="#111827"/>
      <text x="45" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">Confirmed · EU</text>
    </svg>`,
  },
  {
    id: 6,
    reg: 'AM',
    kicker: 'JUNÍN · PERU',
    headline: 'M6.7 quake shakes central Peru and Lima',
    deck: 'Deep tremor empties Congress; minor damage, no deaths.',
    source: 'USGS',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="76" fill="#F6E8DE"/>
      <polygon points="0,50 24,28 46,43 74,24 104,47 134,31 162,50" fill="#A68C74" stroke="#5C493A" stroke-width="1.1"/>
      <polygon points="24,28 18,34 24,33 30,35" fill="#FFFFFF"/>
      <polygon points="74,24 66,32 74,30 82,33" fill="#FFFFFF"/>
      <g transform="translate(131,32)">
        <polygon points="0,7 26,0 52,7" fill="#E8DCC8" stroke="#111827" stroke-width="1.2"/>
        <rect x="4" y="7" width="44" height="15" fill="#F8F2E6" stroke="#111827" stroke-width="1.1"/>
        <line x1="12" y1="7" x2="12" y2="22" stroke="#111827" stroke-width="1.8"/>
        <line x1="22" y1="7" x2="22" y2="22" stroke="#111827" stroke-width="1.8"/>
        <line x1="32" y1="7" x2="32" y2="22" stroke="#111827" stroke-width="1.8"/>
        <line x1="42" y1="7" x2="42" y2="22" stroke="#111827" stroke-width="1.8"/>
      </g>
      <rect x="0" y="50" width="192" height="26" fill="#C29169" stroke="#5C493A" stroke-width="1.2"/>
      <circle cx="132" cy="63" r="18" fill="none" stroke="#C41E1A" stroke-width="1.2" opacity="0.5"/>
      <circle cx="132" cy="63" r="11" fill="none" stroke="#C41E1A" stroke-width="1.6"/>
      <circle cx="132" cy="63" r="4.5" fill="#C41E1A"/>
      <polyline points="0,44 34,44 40,37 45,51 50,29 55,58 60,28 66,55 72,37 78,47 86,44 130,44" fill="none" stroke="#C41E1A" stroke-width="2"/>
      <!-- Uniform Top Banner (Americas = Merah) -->
      <rect x="6" y="6" width="144" height="20" fill="${REGIONS.AM.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="78" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.4" font-weight="800" fill="#FFFFFF">PERU: M6.7 QUAKE</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="94" height="14" fill="#111827"/>
      <text x="47" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">USGS · 00:09 UTC</text>
    </svg>`,
  },
  {
    id: 7,
    reg: 'AM',
    kicker: 'MARKETS · CRYPTO',
    headline: 'Bitcoin plunges below $59,000 in tech sell-off',
    deck: 'Hits lowest since July as AI-stock slump rattles crypto.',
    source: 'Reuters',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="btcMidBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0E1729"/>
          <stop offset="100%" stop-color="#1B121D"/>
        </linearGradient>
        <linearGradient id="btcMidDrop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#EF4444" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#EF4444" stop-opacity="0.03"/>
        </linearGradient>
      </defs>
      <rect width="192" height="76" fill="url(#btcMidBg)"/>
      <g stroke="#293548" stroke-width="0.6">
        <line x1="0" y1="35" x2="192" y2="35"/><line x1="0" y1="53" x2="192" y2="53"/>
        <line x1="48" y1="26" x2="48" y2="76"/><line x1="96" y1="26" x2="96" y2="76"/><line x1="144" y1="26" x2="144" y2="76"/>
      </g>
      <!-- Yellow $59K support floor line -->
      <line x1="0" y1="45" x2="192" y2="45" stroke="#FACC15" stroke-width="1.1" stroke-dasharray="4 2.5"/>
      <rect x="138" y="34" width="49" height="10" rx="1.5" fill="#FACC15"/>
      <text x="162.5" y="41.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="7.2" font-weight="800" fill="#111827">$59K LINE</text>
      <!-- Plunging red trend + area -->
      <polygon points="8,36 32,35 56,39 80,33 104,42 126,53 150,59 172,66 172,76 8,76" fill="url(#btcMidDrop)"/>
      <polyline points="8,36 32,35 56,39 80,33 104,42 126,53 150,59 172,66" fill="none" stroke="#FF4D4F" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="172" cy="66" r="3.6" fill="#FF4D4F" stroke="#FFFFFF" stroke-width="1.2"/>
      <!-- Crisp Gold Bitcoin Emblem top-right -->
      <g transform="translate(172,17)">
        <circle cx="0" cy="0" r="12" fill="#F59E0B" stroke="#FEF08A" stroke-width="1.3"/>
        <text x="0" y="5" text-anchor="middle" font-family="Georgia,'IBM Plex Sans',serif" font-size="14" font-weight="900" fill="#FFFFFF">₿</text>
      </g>
      <!-- Uniform Top Banner (Americas = Merah) -->
      <rect x="6" y="6" width="134" height="20" fill="${REGIONS.AM.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="73" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.4" font-weight="800" fill="#FFFFFF">BITCOIN &lt;$59K</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="102" height="14" fill="#090F1C"/>
      <text x="51" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">Confirmed · Markets</text>
    </svg>`,
  },
  {
    id: 8,
    reg: 'AM',
    kicker: 'WASHINGTON · CYBER',
    headline: "Hackers breach FBI's core criminal database",
    deck: 'Apparent cyberattack hits NCIC warrant system; probe under way.',
    source: 'CNN, AP',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="76" fill="#0C1628"/>
      <!-- Subtle cyber grid -->
      <g stroke="#1E3A5F" stroke-width="0.6">
        <line x1="0" y1="34" x2="192" y2="34"/><line x1="0" y1="52" x2="192" y2="52"/>
        <line x1="48" y1="26" x2="48" y2="76"/><line x1="96" y1="26" x2="96" y2="76"/><line x1="144" y1="26" x2="144" y2="76"/>
      </g>
      <!-- Left Server Rack Stack (NCIC) -->
      <g transform="translate(10,30)">
        <rect x="0" y="0" width="48" height="30" rx="2" fill="#1E293B" stroke="#64748B" stroke-width="1.2"/>
        <rect x="4" y="4" width="40" height="6" rx="1" fill="#334155"/>
        <circle cx="9" cy="7" r="1.5" fill="#22C55E"/><circle cx="15" cy="7" r="1.5" fill="#EF4444"/>
        <rect x="4" y="12" width="40" height="6" rx="1" fill="#334155"/>
        <circle cx="9" cy="15" r="1.5" fill="#EF4444"/><circle cx="15" cy="15" r="1.5" fill="#EF4444"/>
        <rect x="4" y="20" width="40" height="6" rx="1" fill="#334155"/>
        <text x="30" y="25.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="6.4" font-weight="800" fill="#93C5FD">NCIC</text>
      </g>
      <!-- Center Cracked Federal Shield + Breach Bolt -->
      <g transform="translate(96,47)">
        <circle cx="0" cy="0" r="20" fill="none" stroke="#EF4444" stroke-width="1" stroke-dasharray="3 2" opacity="0.65"/>
        <path d="M-13,-14 L13,-14 L13,0 C13,10 0,16 0,16 C0,16 -13,10 -13,0 Z" fill="#1D4ED8" stroke="#FACC15" stroke-width="1.5"/>
        <polyline points="-3,-13 2,-4 -4,1 4,13" fill="none" stroke="#0C1628" stroke-width="2.6"/>
        <polyline points="-3,-13 2,-4 -4,1 4,13" fill="none" stroke="#FF4D4F" stroke-width="1.4"/>
      </g>
      <!-- Right Unlocked Breach Padlock + Alert Screen -->
      <g transform="translate(132,31)">
        <rect x="0" y="0" width="52" height="36" rx="2" fill="#1F1218" stroke="#EF4444" stroke-width="1.2"/>
        <rect x="4" y="4" width="44" height="10" rx="1" fill="#C41E1A"/>
        <text x="26" y="11.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="7.2" font-weight="800" fill="#FFFFFF">BREACH</text>
        <!-- Open shackle padlock -->
        <path d="M21,24 L21,20 A5,5 0 0,1 30,18" fill="none" stroke="#FACC15" stroke-width="2"/>
        <rect x="19" y="23" width="14" height="10" rx="1.5" fill="#FACC15" stroke="#111827" stroke-width="1"/>
        <circle cx="26" cy="28" r="1.5" fill="#111827"/>
      </g>
      <!-- Uniform Top Banner (Americas = Merah) -->
      <rect x="6" y="6" width="142" height="20" fill="${REGIONS.AM.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="77" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.2" font-weight="800" fill="#FFFFFF">FBI DATA BREACH</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="96" height="14" fill="#090F1C"/>
      <text x="48" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">Reported · CNN, AP</text>
    </svg>`,
  },
  {
    id: 9,
    reg: 'AM',
    kicker: 'SINALOA · MEXICO',
    headline: 'Mexico captures FBI-wanted cartel boss in raid',
    deck: 'Guasave op nets "El Chapo Isidro"; clashes kill at least 11.',
    source: 'Officials',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="76" fill="#111B2E"/>
      <polygon points="0,76 0,55 38,43 76,55 124,41 164,53 192,45 192,76" fill="#22304A"/>
      <polygon points="118,38 30,57 76,61" fill="#FEF08A" opacity="0.34"/>
      <rect x="28" y="46" width="42" height="14" fill="#475569" stroke="#CBD5E1" stroke-width="1.1"/>
      <rect x="37" y="40" width="24" height="6" fill="#64748B" stroke="#CBD5E1" stroke-width="0.9"/>
      <rect x="45" y="51" width="8" height="9" fill="#FDE047"/>
      <g transform="translate(128,39)">
        <line x1="-22" y1="-8" x2="22" y2="-8" stroke="#CBD5E1" stroke-width="2"/>
        <line x1="0" y1="-8" x2="0" y2="-3" stroke="#CBD5E1" stroke-width="1.8"/>
        <path d="M-16,2 L-10,-4 L12,-4 L18,2 L12,5 L-14,5 Z" fill="#475569" stroke="#E2E8F0" stroke-width="1.1"/>
        <polygon points="-13,-2 -7,-2 -7,2 -14,2" fill="#38BDF8"/>
        <line x1="16" y1="0" x2="36" y2="-3" stroke="#94A3B8" stroke-width="2.6"/>
        <circle cx="37" cy="-4" r="3.5" fill="none" stroke="#E2E8F0" stroke-width="1.2"/>
        <circle cx="-11" cy="4.5" r="2" fill="#FEF08A"/>
      </g>
      <g transform="translate(148,59)" fill="none" stroke="#E2E8F0" stroke-width="2">
        <circle cx="-11" cy="0" r="6.3"/>
        <circle cx="11" cy="0" r="6.3"/>
        <line x1="-4.5" y1="0" x2="4.5" y2="0" stroke-dasharray="2.5 1.5"/>
      </g>
      <!-- Uniform Top Banner (Americas = Merah) -->
      <rect x="6" y="6" width="124" height="20" fill="${REGIONS.AM.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="68" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.4" font-weight="800" fill="#FFFFFF">SINALOA RAID</text>
      <rect x="134" y="6" width="52" height="20" fill="#1E293B" stroke="#FACC15" stroke-width="1.2"/>
      <text x="160" y="19.3" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="9.4" font-weight="800" fill="#FACC15">FBI TOP 10</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="94" height="14" fill="#090F1C"/>
      <text x="47" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">Officials · Mexico</text>
    </svg>`,
  },
  {
    id: 10,
    reg: 'AS',
    kicker: 'DAVAO · PHILIPPINES',
    headline: 'Air Niugini 767 makes emergency landing',
    deck: 'All 146 evacuate safely via slides after engine-fire alert.',
    source: 'CAAP',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="76" fill="#D5EBF8"/>
      <rect x="0" y="50" width="192" height="26" fill="#475569"/>
      <line x1="6" y1="63" x2="186" y2="63" stroke="#F8FAFC" stroke-width="1.8" stroke-dasharray="12 8"/>
      <circle cx="84" cy="39" r="6.5" fill="#64748B" opacity="0.78"/>
      <circle cx="71" cy="35" r="8.5" fill="#94A3B8" opacity="0.62"/>
      <circle cx="57" cy="32" r="7" fill="#CBD5E1" opacity="0.48"/>
      <g transform="translate(18,27)">
        <polygon points="10,12 2,-1 16,-1 26,12" fill="#CE1126" stroke="#111827" stroke-width="1.3"/>
        <polygon points="5,4 14,4 18,10 9,10" fill="#111827"/>
        <circle cx="11" cy="3" r="2.2" fill="#FACC15"/>
        <path d="M12,11 L118,11 C132,11 142,15 144,19 C142,22 132,23 118,23 L12,23 Z" fill="#FFFFFF" stroke="#111827" stroke-width="1.5"/>
        <path d="M124,13 L134,14 L132,17 L124,17 Z" fill="#1E293B"/>
        <line x1="30" y1="15.5" x2="116" y2="15.5" stroke="#334155" stroke-width="2" stroke-dasharray="3.2 2.4"/>
        <polygon points="64,19 92,19 78,28 58,28" fill="#CBD5E1" stroke="#111827" stroke-width="1.1"/>
        <rect x="74" y="21" width="12" height="6" rx="2" fill="#334155"/>
        <polygon points="76,23 60,18 65,24 58,29 76,27" fill="#EA580C"/>
        <polygon points="75,24 66,21 66,27" fill="#FACC15"/>
        <polygon points="108,21 114,21 128,33 119,33" fill="#FACC15" stroke="#713F12" stroke-width="1.1"/>
        <polygon points="36,21 42,21 31,32 22,32" fill="#FACC15" stroke="#713F12" stroke-width="1.1"/>
        <g fill="#111827">
          <circle cx="136" cy="31" r="1.9"/><line x1="136" y1="33" x2="136" y2="38" stroke="#111827" stroke-width="1.5"/>
          <circle cx="144" cy="31" r="1.9"/><line x1="144" y1="33" x2="144" y2="38" stroke="#111827" stroke-width="1.5"/>
          <circle cx="152" cy="31" r="1.9"/><line x1="152" y1="33" x2="152" y2="38" stroke="#111827" stroke-width="1.5"/>
        </g>
      </g>
      <!-- Uniform Top Banner (Asia = Hijau) -->
      <rect x="6" y="6" width="142" height="20" fill="${REGIONS.AS.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="77" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.4" font-weight="800" fill="#FFFFFF">DAVAO: 146 SAFE</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="94" height="14" fill="#111827"/>
      <text x="47" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">Confirmed · CAAP</text>
    </svg>`,
  },
  {
    id: 11,
    reg: 'EU',
    kicker: 'PARIS · BERLIN',
    headline: 'Tens of thousands march across Europe',
    deck: 'Living-cost and anti-war rallies draw 21,500 in Paris alone.',
    source: 'Press',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="76" fill="#E8EEF5"/>
      <g stroke="#64748B" stroke-width="1.4" fill="none">
        <path d="M18,70 L25,29 L32,70"/>
        <line x1="21" y1="53" x2="29" y2="53"/><line x1="23" y1="42" x2="27" y2="42"/>
        <path d="M21,70 Q25,60 29,70"/>
      </g>
      <g fill="#7C8A9E" stroke="#475569" stroke-width="0.9">
        <rect x="140" y="33" width="44" height="6"/>
        <rect x="152" y="28" width="20" height="5"/>
        <rect x="143" y="39" width="4" height="24"/><rect x="152" y="39" width="4" height="24"/>
        <rect x="161" y="39" width="4" height="24"/><rect x="170" y="39" width="4" height="24"/><rect x="178" y="39" width="4" height="24"/>
      </g>
      <g stroke="#111827" stroke-width="1.1">
        <line x1="56" y1="52" x2="56" y2="38"/><rect x="44" y="30" width="24" height="10.5" fill="#FACC15"/>
        <line x1="97" y1="52" x2="97" y2="35"/><rect x="81" y="27" width="32" height="11.5" fill="#FFFFFF"/>
        <line x1="85" y1="31.5" x2="109" y2="31.5" stroke="#C41E1A" stroke-width="2"/>
        <line x1="85" y1="35.5" x2="103" y2="35.5" stroke="#1B4F9C" stroke-width="1.6"/>
        <line x1="135" y1="52" x2="135" y2="38"/><rect x="123" y="31" width="24" height="10" fill="#C41E1A"/>
      </g>
      <g stroke="#111827" stroke-width="0.9">
        <circle cx="36" cy="53" r="4.4" fill="#1B4F9C"/><rect x="30" y="58" width="12" height="18" rx="3" fill="#1B4F9C"/>
        <circle cx="56" cy="51" r="4.7" fill="#C41E1A"/><rect x="49" y="56" width="14" height="20" rx="3" fill="#C41E1A"/>
        <circle cx="77" cy="53" r="4.4" fill="#334155"/><rect x="71" y="58" width="12" height="18" rx="3" fill="#334155"/>
        <circle cx="97" cy="50" r="4.9" fill="#1B4F9C"/><rect x="90" y="55" width="14" height="21" rx="3" fill="#1B4F9C"/>
        <circle cx="118" cy="53" r="4.4" fill="#C41E1A"/><rect x="112" y="58" width="12" height="18" rx="3" fill="#C41E1A"/>
        <circle cx="138" cy="51" r="4.7" fill="#334155"/><rect x="131" y="56" width="14" height="20" rx="3" fill="#334155"/>
        <circle cx="158" cy="53" r="4.4" fill="#1B4F9C"/><rect x="152" y="58" width="12" height="18" rx="3" fill="#1B4F9C"/>
      </g>
      <!-- Uniform Top Banner (Europe = Biru) -->
      <rect x="6" y="6" width="144" height="20" fill="${REGIONS.EU.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="78" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.2" font-weight="800" fill="#FFFFFF">EUROPE MARCHES</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="102" height="14" fill="#111827"/>
      <text x="51" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">21,500 Paris · Press</text>
    </svg>`,
  },
  {
    id: 12,
    reg: 'AF',
    kicker: 'ASWAN · EGYPT',
    headline: 'Al-Sisi opens Aswan Forum on debt relief',
    deck: 'African leaders urge global finance reform and peace funding.',
    source: 'Egypt',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="76" fill="#F7EBD0"/>
      <rect x="0" y="57" width="192" height="19" fill="#2A65A6"/>
      <polygon points="84,58 94,35 102,58" fill="#FFFFFF" stroke="#111827" stroke-width="1.2"/>
      <path d="M80,58 L106,58 L102,63 L84,63 Z" fill="#7C4A22" stroke="#111827" stroke-width="1.1"/>
      <path d="M23,28 L45,28 L54,35 L51,44 L42,56 L35,60 L29,48 L19,41 L18,34 Z" fill="#C9963A" stroke="#5C4212" stroke-width="1.3"/>
      <path d="M39,29 Q42,37 39,44" fill="none" stroke="#2A65A6" stroke-width="1.7"/>
      <circle cx="40" cy="34" r="2.6" fill="#C41E1A" stroke="#FFFFFF" stroke-width="0.9"/>
      <g transform="translate(120,29)">
        <rect x="4" y="0" width="58" height="28" fill="#E6D5B0" stroke="#7A6232" stroke-width="1"/>
        <line x1="12" y1="0" x2="12" y2="28" stroke="#7A6232" stroke-width="2"/>
        <line x1="54" y1="0" x2="54" y2="28" stroke="#7A6232" stroke-width="2"/>
        <rect x="20" y="13" width="26" height="16" fill="#3B2F2F" stroke="#111827" stroke-width="1.2"/>
        <rect x="17" y="10" width="32" height="4" fill="${REGIONS.AF.color}" stroke="#111827" stroke-width="1"/>
        <line x1="27" y1="10" x2="25" y2="4" stroke="#111827" stroke-width="1.3"/>
        <line x1="39" y1="10" x2="41" y2="4" stroke="#111827" stroke-width="1.3"/>
        <rect x="25" y="18" width="16" height="2.2" fill="#CE1126"/>
        <rect x="25" y="20.2" width="16" height="2.2" fill="#FFFFFF"/>
        <rect x="25" y="22.4" width="16" height="2.2" fill="#111827"/>
      </g>
      <!-- Uniform Top Banner (Africa = Ungu) -->
      <rect x="6" y="6" width="130" height="20" fill="${REGIONS.AF.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="71" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.4" font-weight="800" fill="#FFFFFF">ASWAN FORUM</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="88" height="14" fill="#111827"/>
      <text x="44" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">Officials · Egypt</text>
    </svg>`,
  },
  {
    id: 13,
    reg: 'OC',
    kicker: 'TWICKENHAM · RUGBY',
    headline: 'England routs All Blacks 37–12 in record win',
    deck: 'Ireland tops Springboks 20–17; Wallabies edge Wales 29–26.',
    source: 'Rugby',
    svg: `<svg viewBox="0 0 192 76" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="45" fill="#13233A"/>
      <line x1="20" y1="45" x2="20" y2="30" stroke="#94A3B8" stroke-width="1.8"/>
      <rect x="12" y="26" width="16" height="5" fill="#FEF08A"/>
      <line x1="172" y1="45" x2="172" y2="30" stroke="#94A3B8" stroke-width="1.8"/>
      <rect x="164" y="26" width="16" height="5" fill="#FEF08A"/>
      <rect x="0" y="45" width="192" height="31" fill="#176E40"/>
      <rect x="0" y="53" width="192" height="8" fill="#1F824D"/>
      <rect x="0" y="68" width="192" height="8" fill="#1F824D"/>
      <line x1="0" y1="52" x2="192" y2="52" stroke="#FFFFFF" stroke-width="1.2" opacity="0.8"/>
      <g stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round">
        <line x1="75" y1="60" x2="75" y2="29"/>
        <line x1="117" y1="60" x2="117" y2="29"/>
        <line x1="75" y1="46" x2="117" y2="46"/>
      </g>
      <g transform="translate(96,36) rotate(-18)">
        <ellipse cx="0" cy="0" rx="11" ry="6.5" fill="#F8F4E9" stroke="#111827" stroke-width="1.4"/>
        <line x1="-5" y1="0" x2="5" y2="0" stroke="#C41E1A" stroke-width="1.5"/>
        <line x1="-2" y1="-2" x2="-2" y2="2" stroke="#C41E1A" stroke-width="1"/>
        <line x1="2" y1="-2" x2="2" y2="2" stroke="#C41E1A" stroke-width="1"/>
      </g>
      <rect x="6" y="43" width="54" height="16" rx="2" fill="#FFFFFF" stroke="#C41E1A" stroke-width="1.4"/>
      <text x="33" y="54.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="10.5" font-weight="800" fill="#C41E1A">ENG 37</text>
      <rect x="132" y="43" width="54" height="16" rx="2" fill="#111827" stroke="#FFFFFF" stroke-width="1.2"/>
      <text x="159" y="54.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="10.5" font-weight="800" fill="#FFFFFF">NZ 12</text>
      <!-- Uniform Top Banner (Oceania = Jingga) -->
      <rect x="6" y="6" width="148" height="20" fill="${REGIONS.OC.color}" stroke="#FFFFFF" stroke-width="1.3"/>
      <text x="80" y="20.2" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="13.2" font-weight="800" fill="#FFFFFF">RUGBY: ENG 37–12</text>
      <!-- Uniform Bottom-Left Source Ribbon -->
      <rect x="0" y="62" width="106" height="14" fill="#0B1624"/>
      <text x="53" y="72" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="8.4" font-weight="700" fill="#FFFFFF">Record margin · Rugby</text>
    </svg>`,
  },
];

// 22 Briefs (#14 - #35) across 2 clean wide columns (11 + 11, all single-line)
const BRIEFS_COLS = [
  [
    { id: 14, reg: 'EU', lead: 'Kryvyi Rih', text: 'Russian missile kills 2, wounds ~60', src: 'AP' },
    { id: 15, reg: 'EU', lead: 'Kyiv', text: 'Overnight missiles & drones spark fires', src: 'Reuters' },
    { id: 16, reg: 'EU', lead: 'Copenhagen', text: 'Denmark expels Russian attaché over plot', src: 'AJ' },
    { id: 17, reg: 'EU', lead: 'Geneva', text: 'UN delegates agree on "killer robots" talks', src: 'AJ' },
    { id: 18, reg: 'EU', lead: 'Finland', text: 'Curbs Baltic airspace after ship strike', src: 'Yle' },
    { id: 19, reg: 'EU', lead: 'Turin', text: 'Alcaraz reaches ATP Finals title match', src: 'ATP' },
    { id: 20, reg: 'ME', lead: 'Bahrain', text: 'Iranian strike sparks industrial site fire', src: 'AJ' },
    { id: 21, reg: 'ME', lead: 'Hormuz', text: 'Iran claims US drone downed; tankers hit', src: 'Reuters' },
    { id: 22, reg: 'ME', lead: 'Gaza', text: 'Israeli strikes kill 4, 3 in food truck', src: 'AP' },
    { id: 23, reg: 'ME', lead: 'Basra', text: 'Power-plant gas fire kills 4, hurts 35', src: 'INA' },
    { id: 24, reg: 'AS', lead: 'Banda Sea', text: 'M6.8 deep quake hits Indonesia; no tsunami', src: 'USGS' },
  ],
  [
    { id: 25, reg: 'AS', lead: 'Dhaka', text: '80+ garment plants shut in wage sit-ins', src: 'Press' },
    { id: 26, reg: 'AS', lead: 'Japan–Saudi', text: 'Oil reserve deal triples to 24m bbl', src: 'Kyodo' },
    { id: 27, reg: 'AS', lead: 'India', text: 'Google pledges $5m AI grant to IIT', src: 'PTI' },
    { id: 28, reg: 'AS', lead: 'China–S’pore', text: 'Li Qiang, PM Wong push FTA 4.0', src: 'CNA' },
    { id: 29, reg: 'AM', lead: 'Washington', text: 'Trump vows tax on overseas AI data sites', src: 'Guardian' },
    { id: 30, reg: 'AM', lead: 'Las Vegas F1', text: 'Verstappen gets pole on grid penalty', src: 'F1' },
    { id: 31, reg: 'AM', lead: 'Brazil', text: '16-yr-old Silva beats Canada in BJK Cup', src: 'ITF' },
    { id: 32, reg: 'AF', lead: 'Ethiopia', text: 'China–Africa poverty forum opens', src: 'Xinhua' },
    { id: 33, reg: 'AF', lead: 'Somalia', text: 'Moves vaccine hub home after 30 yrs', src: 'UNICEF' },
    { id: 34, reg: 'OC', lead: 'Melbourne', text: 'Australia edges England in 1st T20I', src: 'CA' },
    { id: 35, reg: 'SP', lead: 'SpaceX CRS-35', text: 'Dragon splashes down (22:03 UTC)', src: 'NASA' },
  ],
];

// Dynamically compute exact regional counts so totals can never drift
function computeRegionCounts() {
  const counts = Object.fromEntries(Object.keys(REGIONS).map((k) => [k, 0]));
  for (const c of LEAD_CARDS) counts[c.reg] += 1;
  for (const c of MID_CARDS) counts[c.reg] += 1;
  for (const col of BRIEFS_COLS) {
    for (const b of col) counts[b.reg] += 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total !== 35) throw new Error(`Expected 35 stories, got ${total}`);
  return { counts, total };
}

// High-contrast world map projection: lon [-172..180] -> [2..264], lat [78..-60] -> [2..148] in 266x150 SVG
function lonLatToXY(lon, lat) {
  const x = 2 + ((lon + 172) / 352) * 262;
  const y = 2 + ((78 - lat) / 138) * 146;
  return [x.toFixed(1), y.toFixed(1)];
}

function polyPath(coords) {
  return coords
    .map(([lon, lat], idx) => {
      const [x, y] = lonLatToXY(lon, lat);
      return `${idx === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ') + ' Z';
}

const WORLD_LANDMASSES = [
  // North America
  [
    [-168, 66], [-162, 69], [-156, 71], [-141, 70], [-134, 69], [-125, 70],
    [-110, 68], [-96, 69], [-88, 66], [-94, 61], [-90, 56], [-80, 51],
    [-77, 56], [-78, 62], [-70, 61], [-64, 59], [-56, 52], [-61, 47],
    [-60, 46], [-66, 44], [-70, 42], [-74, 40], [-76, 35], [-81, 30],
    [-80, 25], [-82, 26], [-83, 29], [-89, 30], [-97, 26], [-96, 20],
    [-91, 18], [-90, 21], [-87, 21], [-88, 17], [-84, 15], [-83, 10],
    [-78, 8], [-80, 8], [-85, 10], [-89, 13], [-93, 15], [-98, 16],
    [-105, 19], [-107, 24], [-112, 29], [-114, 31], [-110, 23], [-113, 27],
    [-117, 32], [-121, 35], [-124, 40], [-124, 48], [-130, 54], [-137, 59],
    [-148, 60], [-153, 57], [-162, 55], [-166, 60], [-161, 63], [-166, 65],
  ],
  [[-86, 73], [-75, 72], [-66, 68], [-64, 63], [-74, 63], [-80, 68]],
  [[-118, 72], [-104, 72], [-102, 69], [-116, 69]],
  [[-59, 51], [-53, 49], [-53, 46], [-59, 47]],
  [[-85, 22], [-79, 23], [-74, 20], [-78, 20], [-83, 21]],
  [[-74, 20], [-68, 19], [-69, 18], [-74, 18]],
  [[-56, 75], [-42, 77.5], [-20, 77.5], [-17, 74], [-24, 69], [-35, 66], [-44, 60], [-51, 64], [-53, 70]],
  [[-24, 66], [-14, 66], [-14, 64], [-23, 64]],
  // South America
  [
    [-78, 9], [-73, 12], [-68, 11], [-61, 10], [-52, 4], [-50, 0],
    [-42, -3], [-35, -6], [-38, -13], [-41, -22], [-48, -26], [-53, -34],
    [-58, -38], [-64, -42], [-67, -48], [-67, -54], [-71, -55], [-74, -50],
    [-73, -41], [-71, -30], [-70, -18], [-77, -12], [-81, -5], [-80, 1],
  ],
  // Africa
  [
    [-6, 36], [3, 37], [11, 37], [11, 33], [20, 32], [25, 31],
    [32, 31], [34, 27], [38, 20], [43, 12], [51, 12], [49, 5],
    [41, -2], [40, -10], [35, -20], [33, -26], [28, -33], [19, -35],
    [15, -26], [12, -16], [12, -6], [9, 4], [2, 6], [-8, 5],
    [-16, 12], [-17, 16], [-16, 22], [-10, 30],
  ],
  [[49, -12], [50, -17], [47, -25], [44, -24], [45, -17]],
  // Eurasia
  [
    [-9, 37], [-9, 43], [-2, 43], [-4, 48], [2, 51], [8, 54],
    [9, 57], [12, 56], [11, 58], [5, 60], [7, 63], [15, 68],
    [25, 71], [40, 67], [45, 66], [60, 70], [72, 73], [104, 77],
    [135, 72], [170, 69], [178, 66], [168, 60], [162, 56], [156, 51],
    [155, 58], [142, 59], [138, 54], [141, 51], [135, 44], [129, 39],
    [129, 35], [126, 36], [125, 39], [121, 40], [122, 37], [120, 34],
    [122, 30], [118, 24], [113, 22], [109, 20], [109, 13], [105, 9],
    [103, 12], [100, 13], [103, 6], [104, 1], [101, 4], [98, 9],
    [98, 15], [94, 16], [92, 22], [87, 21], [80, 14], [77, 8],
    [73, 19], [69, 23], [62, 25], [57, 26], [50, 30], [49, 27],
    [55, 25], [59, 22], [53, 16], [44, 13], [40, 20], [35, 28],
    [33, 31], [35, 33], [36, 36], [28, 37], [27, 40], [24, 40],
    [23, 37], [20, 39], [14, 45], [18, 41], [16, 38], [12, 42],
    [9, 44], [3, 43], [-1, 38], [-5, 36],
  ],
  [[-5, 50], [-4, 53], [-5, 57], [-2, 58], [-2, 55], [1, 52], [-1, 50]],
  [[-10, 52], [-9, 55], [-6, 55], [-6, 52]],
  [[12, 38], [15, 38], [15, 36.7]],
  [[8.2, 41], [9.6, 41], [9.5, 39], [8.3, 39]],
  [[80, 9.5], [81.8, 7.5], [80.5, 6], [79.8, 7.5]],
  [[140, 42], [142, 45], [145, 43], [142, 42]],
  [[130, 31], [131, 34], [136, 35], [141, 38], [141, 41], [138, 39], [134, 35], [130, 33]],
  [[120.5, 25], [122, 24.5], [121, 22], [120, 23]],
  [[120, 18], [122, 18], [123, 14], [120, 14]],
  [[122, 8], [126, 9], [126, 6], [123, 6]],
  [[95, 5.5], [99, 3], [105, -5], [103, -6], [98, 0]],
  [[105, -6.2], [114, -7.8], [114, -8.5], [106, -7.2]],
  [[109, 1], [115, 6], [118, 5], [117, -3], [111, -3]],
  [[119, 1], [125, 1], [122, -4], [119, -5]],
  [[131, -1.5], [141, -3], [150, -10], [144, -8], [136, -5]],
  [
    [114, -22], [122, -17], [130, -12], [136, -12], [137, -15], [141, -16],
    [142, -11], [146, -17], [153, -26], [150, -37], [141, -38], [136, -35],
    [129, -32], [118, -35], [115, -34], [114, -27],
  ],
  [[145, -41], [148, -41], [147, -43.5], [145.5, -43]],
  [[173, -35], [178, -38], [176, -41], [174, -40]],
  [[173, -41], [174, -43], [169, -46.5], [167, -45.5], [171, -42]],
];

const INLAND_SEAS = [
  [[11, 56], [13, 55], [16, 54], [20, 55], [22, 57], [24, 59], [29, 60], [24, 60], [21, 61], [21, 65], [18, 63], [17, 59], [14, 56]],
  [[28, 41], [28, 44], [32, 46], [34, 44.5], [37, 45], [41, 42], [38, 41], [33, 42]],
  [[47, 46], [52, 46], [54, 42], [53, 37], [49, 37], [48, 41]],
];

// All 34 Earth-plotted stories + #2 Mercury inset = complete 35/35 coverage
const MAP_PINS = [
  // Space (#35 Dragon Pacific splashdown off California; #2 Mercury sits in Space inset)
  { id: 35, reg: 'SP', pos: lonLatToXY(-136, 26) },
  // Americas (7: #6, #7, #8, #9, #29, #30, #31)
  { id: 30, reg: 'AM', pos: lonLatToXY(-121, 45) },  // Las Vegas F1
  { id: 29, reg: 'AM', pos: lonLatToXY(-99, 43) },   // US Trump AI data tax
  { id: 7, reg: 'AM', pos: lonLatToXY(-68, 46) },    // Bitcoin / Global Crypto Markets (NYC)
  { id: 8, reg: 'AM', pos: lonLatToXY(-81, 32) },    // Washington DC / FBI NCIC Breach
  { id: 9, reg: 'AM', pos: lonLatToXY(-107, 20) },   // Sinaloa, Mexico
  { id: 6, reg: 'AM', pos: lonLatToXY(-77, -11) },   // Peru M6.7 Quake
  { id: 31, reg: 'AM', pos: lonLatToXY(-48, -22) },  // Brazil BJK Cup
  // Europe (8: #3, #11, #14, #15, #16, #17, #18, #19)
  { id: 11, reg: 'EU', pos: lonLatToXY(-6, 48) },    // Paris / Western Europe marches
  { id: 16, reg: 'EU', pos: lonLatToXY(7, 61) },     // Copenhagen, Denmark
  { id: 18, reg: 'EU', pos: lonLatToXY(25, 68) },    // Finland / Baltic airspace
  { id: 3, reg: 'EU', pos: lonLatToXY(19, 54) },     // Warsaw / Baltic (Sparta II)
  { id: 17, reg: 'EU', pos: lonLatToXY(6, 44) },     // Geneva UN "killer robots"
  { id: 19, reg: 'EU', pos: lonLatToXY(14, 36) },    // Turin ATP Finals
  { id: 15, reg: 'EU', pos: lonLatToXY(35, 58) },    // Kyiv
  { id: 14, reg: 'EU', pos: lonLatToXY(41, 47) },    // Kryvyi Rih
  // Middle East (6: #1, #4, #20, #21, #22, #23)
  { id: 1, reg: 'ME', pos: lonLatToXY(28, 39) },     // Antalya COP31
  { id: 22, reg: 'ME', pos: lonLatToXY(32, 28) },    // Gaza
  { id: 23, reg: 'ME', pos: lonLatToXY(47, 36) },    // Basra, Iraq
  { id: 4, reg: 'ME', pos: lonLatToXY(44, 21) },     // Riyadh & Jizan, Saudi
  { id: 20, reg: 'ME', pos: lonLatToXY(56, 29) },    // Bahrain
  { id: 21, reg: 'ME', pos: lonLatToXY(63, 19) },    // Strait of Hormuz
  // Africa (3: #12, #32, #33)
  { id: 12, reg: 'AF', pos: lonLatToXY(21, 21) },    // Aswan Forum, Egypt
  { id: 32, reg: 'AF', pos: lonLatToXY(34, 8) },     // Addis Ababa, Ethiopia
  { id: 33, reg: 'AF', pos: lonLatToXY(48, 3) },     // Somalia vaccine hub
  // Asia (7: #5, #10, #24, #25, #26, #27, #28)
  { id: 27, reg: 'AS', pos: lonLatToXY(77, 22) },    // India IIT Kharagpur
  { id: 25, reg: 'AS', pos: lonLatToXY(92, 27) },    // Dhaka, Bangladesh
  { id: 28, reg: 'AS', pos: lonLatToXY(112, 28) },   // China–Singapore FTA 4.0
  { id: 26, reg: 'AS', pos: lonLatToXY(141, 38) },   // Japan–Saudi oil deal
  { id: 5, reg: 'AS', pos: lonLatToXY(104, -7) },    // Indonesia–EU CEPA (Jakarta)
  { id: 10, reg: 'AS', pos: lonLatToXY(126, 9) },    // Davao, Philippines
  { id: 24, reg: 'AS', pos: lonLatToXY(134, -8) },   // Banda Sea M6.8
  // Oceania (2: #13, #34)
  { id: 34, reg: 'OC', pos: lonLatToXY(145, -36) },  // Melbourne T20I
  { id: 13, reg: 'OC', pos: lonLatToXY(172, -42) },  // New Zealand / Rugby
];

function buildWorldMapSVG() {
  // Verify exact 35/35 story pin completeness (34 map pins + #2 Mercury inset)
  const plotted = new Set([2, ...MAP_PINS.map((p) => p.id)]);
  if (plotted.size !== 35) {
    throw new Error(`Expected 35 unique plotted stories on map, got ${plotted.size}`);
  }
  let minDist = Infinity;
  let closestPair = '';
  for (let i = 0; i < MAP_PINS.length; i++) {
    for (let j = i + 1; j < MAP_PINS.length; j++) {
      const dx = parseFloat(MAP_PINS[i].pos[0]) - parseFloat(MAP_PINS[j].pos[0]);
      const dy = parseFloat(MAP_PINS[i].pos[1]) - parseFloat(MAP_PINS[j].pos[1]);
      const d = Math.hypot(dx, dy);
      if (d < minDist) {
        minDist = d;
        closestPair = `#${MAP_PINS[i].id}-#${MAP_PINS[j].id}`;
      }
    }
  }
  console.log(`Map verified: ${plotted.size}/35 stories plotted (min pin distance ${minDist.toFixed(1)}px for ${closestPair})`);

  const landSvg = WORLD_LANDMASSES.map(
    (poly) => `<path d="${polyPath(poly)}" fill="#EDE4D0" stroke="#7A7260" stroke-width="0.6" stroke-linejoin="round"/>`
  ).join('\n');

  const seasSvg = INLAND_SEAS.map(
    (poly) => `<path d="${polyPath(poly)}" fill="#18385E" stroke="#7A7260" stroke-width="0.5" stroke-linejoin="round"/>`
  ).join('\n');

  const gratLons = [-120, -60, 0, 60, 120];
  const gratLats = [60, 30, 0, -30];
  const gratLines = [
    ...gratLons.map((lon) => {
      const [x] = lonLatToXY(lon, 0);
      return `<line x1="${x}" y1="2" x2="${x}" y2="148" stroke="#2A4E7A" stroke-width="0.45"/>`;
    }),
    ...gratLats.map((lat) => {
      const [, y] = lonLatToXY(0, lat);
      return `<line x1="2" y1="${y}" x2="264" y2="${y}" stroke="#2A4E7A" stroke-width="0.45" ${lat === 0 ? 'stroke-dasharray="3 2"' : ''}/>`;
    }),
  ].join('\n');

  const pinsSvg = MAP_PINS.map(({ id, reg, pos }) => {
    const color = REGIONS[reg].color;
    const isFeatured = id <= 13;
    const r = isFeatured ? 5.2 : 4.4;
    const fs = isFeatured ? 5.7 : 4.9;
    return `<g>
      <circle cx="${pos[0]}" cy="${pos[1]}" r="${r}" fill="${color}" stroke="#FFFFFF" stroke-width="${isFeatured ? 1.05 : 0.8}"/>
      <text x="${pos[0]}" y="${(parseFloat(pos[1]) + (isFeatured ? 1.95 : 1.7)).toFixed(1)}" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="${fs}" font-weight="800" fill="#FFFFFF">${id}</text>
    </g>`;
  }).join('\n');

  return `<svg viewBox="0 0 266 150" width="290" height="164" xmlns="http://www.w3.org/2000/svg" style="display:block;border:1.4px solid #1E293B;border-radius:2px;">
    <rect width="266" height="150" fill="#18385E"/>
    ${gratLines}
    ${landSvg}
    ${seasSvg}
    <!-- Space Inset Box (#2 Mercury; #35 CRS-35 is plotted off California) -->
    <rect x="5" y="123" width="66" height="21" rx="2.5" fill="#0B1324" stroke="#93C5FD" stroke-width="1"/>
    <circle cx="15.5" cy="133.5" r="5.2" fill="${REGIONS.SP.color}" stroke="#FFFFFF" stroke-width="1"/>
    <text x="15.5" y="135.5" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="5.8" font-weight="800" fill="#FFFFFF">2</text>
    <text x="45.5" y="135.8" text-anchor="middle" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="6.6" font-weight="800" fill="#FFFFFF">MERCURY</text>
    ${pinsSvg}
  </svg>`;
}

function renderHtml() {
  const { counts, total } = computeRegionCounts();

  const figHtml = KEY_FIGURES.map((f) => `
    <div class="fig-item">
      <div class="fig-val">${f.val}</div>
      <div class="fig-label">${f.label}</div>
    </div>`).join('');

  const regionOrder = ['EU', 'AS', 'ME', 'AM', 'AF', 'OC', 'SP'];
  const regionBarHtml = regionOrder.map((key) => {
    const r = REGIONS[key];
    const cnt = counts[key];
    return `<div class="reg-seg" style="flex:${cnt};background:${r.color};">${r.name} ${cnt}</div>`;
  }).join('');

  const leadHtml = LEAD_CARDS.map((c) => `
    <article class="lead-card">
      <div class="lead-art">${c.svg}</div>
      <div class="meta-row">
        <span class="num-dot" style="background:${REGIONS[c.reg].color}">${c.id}</span>
        <span class="kicker" style="color:${REGIONS[c.reg].color}">${c.kicker}</span>
      </div>
      <h2 class="lead-h2">${c.headline}</h2>
      <p class="lead-deck">${c.deck} <span class="src-tag">(${c.source})</span></p>
    </article>`).join('');

  const renderMid = (cards) => cards.map((c) => `
    <article class="mid-card">
      <div class="mid-art">${c.svg}</div>
      <div class="meta-row sm">
        <span class="num-dot sm" style="background:${REGIONS[c.reg].color}">${c.id}</span>
        <span class="kicker sm" style="color:${REGIONS[c.reg].color}">${c.kicker}</span>
      </div>
      <h3 class="mid-h3">${c.headline}</h3>
      <p class="mid-deck">${c.deck} <span class="src-tag">(${c.source})</span></p>
    </article>`).join('');

  const briefsHtml = BRIEFS_COLS.map((col) => `
    <div class="briefs-col">
      ${col.map((b) => `
        <div class="brief-item">
          <span class="num-dot xs" style="background:${REGIONS[b.reg].color}">${b.id}</span>
          <span class="brief-body"><strong>${b.lead}</strong> ${b.text} <span class="src-tag">(${b.src})</span></span>
        </div>`).join('')}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Saturday 21 November 2026 — World News</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@500;600;700&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1024px;
    min-height: 1024px;
    background: #FAF6EE;
    color: #111111;
    font-family: 'IBM Plex Sans', Arial, Helvetica, sans-serif;
    text-rendering: geometricPrecision;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    min-height: 1024px;
    padding: 6px 12px 5px 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  /* Masthead */
  .masthead-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.6px;
    font-weight: 700;
    letter-spacing: 0.055em;
    text-transform: uppercase;
    padding-bottom: 2px;
    border-bottom: 2.5px solid #111111;
  }
  .masthead-kicker { color: #B51F18; }
  .masthead-meta { color: #111111; }
  .masthead-title {
    font-family: Georgia, 'Liberation Serif', 'Times New Roman', serif;
    font-size: 58px;
    font-weight: 700;
    line-height: 0.98;
    letter-spacing: -0.02em;
    text-align: center;
    color: #111111;
    margin: 2px 0 2px 0;
  }
  .masthead-sub {
    font-family: Georgia, 'Liberation Serif', serif;
    font-style: italic;
    font-size: 12.6px;
    font-weight: 400;
    text-align: center;
    color: #1E1E1E;
    padding-bottom: 4px;
    border-bottom: 1.5px solid #111111;
  }
  /* Key Figures Strip */
  .fig-strip {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    padding: 5px 0 4px 0;
  }
  .fig-item {
    border-left: 3px solid #B51F18;
    padding-left: 6px;
  }
  .fig-val {
    font-family: Georgia, 'Liberation Serif', serif;
    font-size: 19.5px;
    font-weight: 700;
    line-height: 1.04;
    color: #111111;
  }
  .fig-label {
    font-size: 10px;
    font-weight: 600;
    line-height: 1.16;
    color: #1E1E1E;
    margin-top: 1px;
  }
  /* Regional Proportional Bar */
  .reg-bar {
    display: flex;
    gap: 2px;
    height: 19px;
    width: 100%;
  }
  .reg-seg {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  /* Lead Row (#1-#3) */
  .lead-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 5px 0 4px 0;
    border-bottom: 1.4px solid #C8BFA8;
  }
  .lead-art {
    width: 100%;
    height: 132px;
    border: 1.3px solid #1E293B;
    overflow: hidden;
  }
  .meta-row {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 4px;
  }
  .meta-row.sm { margin-top: 3px; gap: 4px; }
  .num-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .num-dot.sm {
    width: 15px;
    height: 15px;
    font-size: 9px;
  }
  .num-dot.xs {
    width: 15px;
    height: 15px;
    font-size: 8.6px;
    margin-top: 0.5px;
  }
  .kicker {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .kicker.sm { font-size: 8.9px; }
  .lead-h2 {
    font-family: Georgia, 'Liberation Serif', serif;
    font-size: 19.6px;
    font-weight: 700;
    line-height: 1.09;
    color: #111111;
    margin-top: 2px;
  }
  .lead-deck {
    font-size: 11.4px;
    font-weight: 500;
    line-height: 1.24;
    color: #1C1C1C;
    margin-top: 3px;
  }
  .src-tag {
    color: #57534E;
    font-weight: 600;
    font-size: 0.93em;
  }
  /* Mid Rows (#4-#13) */
  .mid-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    padding: 4px 0 4px 0;
    border-bottom: 1.2px solid #C8BFA8;
  }
  .mid-grid.last-mid {
    border-bottom: 1.8px solid #111111;
  }
  .mid-art {
    width: 100%;
    height: 78px;
    border: 1.2px solid #1E293B;
    overflow: hidden;
  }
  .mid-h3 {
    font-family: Georgia, 'Liberation Serif', serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.11;
    color: #111111;
    margin-top: 2px;
  }
  .mid-deck {
    font-size: 10.3px;
    font-weight: 500;
    line-height: 1.19;
    color: #1C1C1C;
    margin-top: 2px;
  }
  /* Bottom Zone: Map + 2-Column Briefs */
  .bottom-zone {
    display: grid;
    grid-template-columns: 290px 1fr;
    gap: 12px;
    padding: 5px 0 4px 0;
    align-items: start;
  }
  .sec-title {
    font-size: 11px;
    font-weight: 700;
    color: #B51F18;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }
  .map-cap {
    font-size: 9.4px;
    font-weight: 600;
    color: #3F3F46;
    margin-top: 3px;
    line-height: 1.15;
  }
  .briefs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .briefs-col {
    display: flex;
    flex-direction: column;
    gap: 3.6px;
  }
  .brief-item {
    display: flex;
    align-items: flex-start;
    gap: 4.5px;
    font-size: 10.6px;
    font-weight: 500;
    line-height: 1.22;
    color: #18181B;
  }
  .brief-body strong {
    color: #111111;
    font-weight: 700;
  }
  /* Date Check + Footer */
  footer { margin-top: auto; }
  .date-check {
    background: #FDF3F1;
    border: 1.5px solid #B51F18;
    padding: 4.5px 8px;
    font-size: 10px;
    line-height: 1.24;
    color: #18181B;
  }
  .dc-lead {
    color: #B51F18;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin-right: 4px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 3px;
    font-size: 9.4px;
    font-weight: 600;
    color: #3F3F46;
  }
</style>
</head>
<body>
  <main class="page">
    <header>
      <div class="masthead-top">
        <span class="masthead-kicker">THE WORLD IN ONE DAY</span>
        <span class="masthead-meta">${total} STORIES · 7 REGIONS · EVERY ONE DATED SATURDAY 21 NOVEMBER 2026</span>
      </div>
      <h1 class="masthead-title">Saturday 21 November 2026</h1>
      <div class="masthead-sub">COP31 stalls into Day 13 overtime · BepiColombo reaches Mercury · Rutte pledges Polish defense as drones hit ship</div>
    </header>

    <section class="fig-strip">${figHtml}</section>

    <section class="reg-bar">${regionBarHtml}</section>

    <section class="lead-grid">${leadHtml}</section>

    <section class="mid-grid">${renderMid(MID_CARDS.slice(0, 5))}</section>

    <section class="mid-grid last-mid">${renderMid(MID_CARDS.slice(5, 10))}</section>

    <section class="bottom-zone">
      <div>
        <div class="sec-title">WHERE IT HAPPENED</div>
        ${buildWorldMapSVG()}
        <div class="map-cap">All 35 stories plotted (#1–#35; #2 Mercury inset).</div>
      </div>
      <div>
        <div class="sec-title">ALSO ON SATURDAY 21 NOVEMBER — 22 MORE STORIES</div>
        <div class="briefs-grid">${briefsHtml}</div>
      </div>
    </section>

    <footer>
      <div class="date-check">
        <span class="dc-lead">DATE CHECK</span>
        <strong>Left out as Friday 20 Nov:</strong> Cyclone Akvan's Odisha landfall, Wall Street's drop into correction, Kyiv bridge barrage, the missile breach in Poland, the EU–UK summit close and Nigeria's Bayelsa boat capsize. Older: Voyager 1's light-day (18 Nov). <strong>Not yet:</strong> Las Vegas GP race (Sun 22), ATP Finals title match (Sun 22) and any final COP31 text.
      </div>
      <div class="footer">
        <span>Every story happened, or was first reported, on Saturday 21 November 2026 (00:09–22:03 UTC). Officials' claims are attributed.</span>
        <span>Sources named beside each story · original vector drawings</span>
      </div>
    </footer>
  </main>
</body>
</html>`;
}

function main() {
  const html = renderHtml();
  fs.writeFileSync(HTML_PATH, html, 'utf8');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'mkfun-chrome-'));
  try {
    const fileUrl = pathToFileURL(HTML_PATH).href;
    execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      `--user-data-dir=${tempProfile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--force-device-scale-factor=1',
      '--window-size=1024,1160',
      '--hide-scrollbars',
      '--virtual-time-budget=8000',
      `--screenshot=${RAW_PNG}`,
      fileUrl,
    ], { stdio: 'inherit' });
  } finally {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  }

  const pyScript = `
from PIL import Image
import os

im = Image.open(r"${RAW_PNG}").convert("RGB")
w, h = im.size
if w != 1024 or h < 1024:
    raise SystemExit(f"Unexpected render size: {w}x{h}")

# Measure actual content height beyond 1024 if any overflow occurred
bg = im.getpixel((5, 1150))
max_y = 0
for y in range(h - 1, -1, -1):
    row_diff = False
    for x in range(0, w, 4):
        if im.getpixel((x, y)) != bg:
            row_diff = True
            break
    if row_diff:
        max_y = y
        break
print(f"Detected content max_y={max_y} (target <= 1023)")

cropped = im.crop((0, 0, 1024, 1024))
cropped.save(r"${OUT_PNG}", format="PNG", optimize=True)
sz = os.path.getsize(r"${OUT_PNG}")
if sz > 1000000:
    cropped.save(r"${OUT_PNG}", format="JPEG", quality=93, optimize=True)
    sz = os.path.getsize(r"${OUT_PNG}")
prev = cropped.resize((300, 300), Image.Resampling.LANCZOS)
prev.save(r"${PREVIEW_300}", format="PNG", optimize=True)
cropped.crop((0, 155, 1024, 760)).save(r"${CARDS_ZOOM}", format="PNG", optimize=True)
cropped.crop((0, 740, 1024, 1024)).save(r"${BOTTOM_ZOOM}", format="PNG", optimize=True)
print(f"Saved {r'${OUT_PNG}'} ({sz} bytes, 1024x1024)")
`;
  execFileSync('python', ['-c', pyScript], { stdio: 'inherit' });
}

main();
