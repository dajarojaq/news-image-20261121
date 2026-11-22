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

const REGIONS = {
  EU: { name: 'Europe', color: '#285DAB', count: 9 },
  ME: { name: 'Middle East', color: '#8F44A9', count: 6 },
  AS: { name: 'Asia', color: '#1D8D69', count: 8 },
  AM: { name: 'Americas', color: '#C23929', count: 6 },
  AF: { name: 'Africa', color: '#8A6B2B', count: 3 },
  OC: { name: 'Oceania', color: '#1A879C', count: 2 },
  SP: { name: 'Space', color: '#3B4D8A', count: 2 },
};

const UTC_STRIP = [
  { time: '00:09', text: 'M6.7 quake rocks Peru' },
  { time: 'Asia AM', text: '767 evacuates in Davao' },
  { time: '09:42', text: 'M6.8 Banda Sea quake' },
  { time: 'Europe day', text: 'Rutte visits Warsaw' },
  { time: 'Midday', text: 'EU–Indonesia pact signed' },
  { time: 'Sat PM', text: 'COP31 stalls in overtime' },
  { time: '22:03', text: 'Dragon splashes down' },
];

const NUMBERS_STRIP = [
  { num: '98.5%', text: 'EU–Indonesia tariffs cut' },
  { num: '3', text: 'missiles stopped over Riyadh' },
  { num: '8 yrs', text: "BepiColombo's trip to Mercury" },
  { num: 'M6.8', text: 'Banda Sea quake (09:42 UTC)' },
  { num: '146', text: 'safe off Davao 767 jet' },
  { num: '80+', text: 'Dhaka garment plants shut' },
];

// Lead cards (#1 - #3)
const LEAD_CARDS = [
  {
    id: 1,
    reg: 'ME',
    kicker: 'ANTALYA · COP31',
    badgeType: 'CONFIRMED',
    badgeText: 'CONFIRMED · UN',
    headline: 'COP31 climate talks stall in Antalya overtime',
    deck: 'Draft drops fossil fuels and a $120bn adaptation target; EU vows "good deal or no deal."',
    svg: `<svg viewBox="0 0 320 112" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="copBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#D9ECF5"/>
          <stop offset="100%" stop-color="#EDF5F0"/>
        </linearGradient>
      </defs>
      <rect width="320" height="112" fill="url(#copBg)"/>
      <!-- Left globe -->
      <circle cx="56" cy="58" r="38" fill="#5CA4D6" stroke="#1E4B6E" stroke-width="1.5"/>
      <ellipse cx="56" cy="58" rx="18" ry="38" fill="none" stroke="#9ACCEB" stroke-width="0.7" opacity="0.6"/>
      <line x1="18" y1="58" x2="94" y2="58" stroke="#9ACCEB" stroke-width="0.7" opacity="0.6"/>
      <path d="M38 34 C46 32, 56 36, 58 44 C60 50, 52 53, 56 61 C61 70, 50 82, 42 80 C35 76, 32 63, 37 53 C40 46, 33 39, 38 34 Z" fill="#469666"/>
      <path d="M66 38 C76 37, 86 46, 84 58 C82 69, 72 76, 66 70 C62 64, 65 55, 63 47 Z" fill="#469666"/>
      <!-- Clock badge top-right -->
      <circle cx="290" cy="21" r="12.5" fill="#FFFDF7" stroke="#AE322B" stroke-width="2"/>
      <line x1="290" y1="21" x2="290" y2="12" stroke="#171C23" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="290" y1="21" x2="296" y2="24" stroke="#AE322B" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Header pills -->
      <rect x="106" y="10" width="108" height="19" rx="3" fill="#172433"/>
      <text x="160" y="23" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="9.5" font-weight="800" fill="#FFFFFF" letter-spacing="0.4">COP31 · ANTALYA</text>
      <rect x="219" y="10" width="52" height="19" rx="3" fill="#B6231B"/>
      <text x="245" y="23" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.5" font-weight="800" fill="#FFFFFF">OVERTIME</text>
      <!-- Draft paper panel with crossed-out items -->
      <rect x="108" y="36" width="198" height="66" rx="4" fill="#FFFDF8" stroke="#9AA5AD" stroke-width="1.2"/>
      <text x="118" y="51" font-family="Inter,Arial,sans-serif" font-size="8.5" font-weight="700" fill="#525B63">REVISED DRAFT TEXT:</text>
      <text x="118" y="69" font-family="Inter,Arial,sans-serif" font-size="12.5" font-weight="900" fill="#171C23">FOSSIL FUELS</text>
      <line x1="115" y1="64.5" x2="212" y2="64.5" stroke="#C92A2A" stroke-width="2.6"/>
      <rect x="220" y="56" width="76" height="15" rx="2.5" fill="#FDE8E8" stroke="#C92A2A" stroke-width="0.9"/>
      <text x="258" y="66.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8" font-weight="800" fill="#B6231B">STRIPPED</text>
      <text x="118" y="90" font-family="Inter,Arial,sans-serif" font-size="11.5" font-weight="900" fill="#171C23">$120BN ADAPTATION</text>
      <line x1="115" y1="85.5" x2="246" y2="85.5" stroke="#C92A2A" stroke-width="2.4"/>
      <text x="254" y="89.5" font-family="Inter,Arial,sans-serif" font-size="8.5" font-weight="800" fill="#8F44A9">CUT</text>
    </svg>`,
  },
  {
    id: 2,
    reg: 'SP',
    kicker: 'MERCURY · SPACE',
    badgeType: 'CONFIRMED',
    badgeText: 'CONFIRMED · ESA, JAXA',
    headline: 'BepiColombo enters Mercury orbit after 8 years',
    deck: 'ESA–JAXA mission is only the second to orbit Mercury; dual probes separate in December.',
    svg: `<svg viewBox="0 0 320 112" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0C1428"/>
          <stop offset="100%" stop-color="#1A274A"/>
        </linearGradient>
        <radialGradient id="mercGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#C9C1B4"/>
          <stop offset="55%" stop-color="#8C8378"/>
          <stop offset="100%" stop-color="#4A453F"/>
        </radialGradient>
      </defs>
      <rect width="320" height="112" fill="url(#spBg)"/>
      <!-- Stars -->
      <circle cx="24" cy="20" r="1" fill="#FFF"/><circle cx="62" cy="14" r="1.2" fill="#DDE8FF"/>
      <circle cx="145" cy="22" r="1" fill="#FFF"/><circle cx="278" cy="16" r="1.3" fill="#FFE6A3"/>
      <circle cx="300" cy="48" r="1" fill="#FFF"/><circle cx="42" cy="92" r="1.1" fill="#DDE8FF"/>
      <circle cx="192" cy="95" r="1" fill="#FFF"/><circle cx="265" cy="88" r="1.2" fill="#FFF"/>
      <!-- Sun glow on right -->
      <circle cx="318" cy="108" r="32" fill="#FDB813" opacity="0.22"/>
      <!-- Orbital capture ellipse -->
      <ellipse cx="110" cy="64" rx="76" ry="34" transform="rotate(-14 110 64)" fill="none" stroke="#5AC8FA" stroke-width="1.6" stroke-dasharray="5 3"/>
      <path d="M168 38 L178 40 L172 48" fill="none" stroke="#5AC8FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Mercury planet -->
      <circle cx="96" cy="64" r="28" fill="url(#mercGrad)" stroke="#D4CCC0" stroke-width="0.7"/>
      <circle cx="86" cy="54" r="5" fill="#6F675E" opacity="0.6"/>
      <circle cx="106" cy="70" r="6.5" fill="#625A52" opacity="0.55"/>
      <circle cx="92" cy="76" r="3.5" fill="#625A52" opacity="0.6"/>
      <circle cx="107" cy="52" r="3" fill="#ADA498" opacity="0.5"/>
      <!-- BepiColombo spacecraft on orbit arc -->
      <g transform="translate(178,43) rotate(-18)">
        <rect x="-26" y="-4" width="18" height="8" rx="1" fill="#2E75D3" stroke="#99C8FF" stroke-width="0.7"/>
        <rect x="8" y="-4" width="18" height="8" rx="1" fill="#2E75D3" stroke="#99C8FF" stroke-width="0.7"/>
        <rect x="-8" y="-7" width="16" height="14" rx="2" fill="#E3B341" stroke="#FFF" stroke-width="0.8"/>
        <circle cx="0" cy="-10" r="2.8" fill="#D9E2EC"/>
        <path d="M-10 3 L-20 7 M-10 0 L-22 0" stroke="#7AE5FF" stroke-width="1.4" opacity="0.9"/>
      </g>
      <!-- Labels -->
      <rect x="10" y="9" width="138" height="17" rx="3" fill="#233768" stroke="#6E8EE0" stroke-width="0.8"/>
      <text x="79" y="20.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.5" font-weight="800" fill="#FFFFFF">ESA · JAXA · BEPICOLOMBO</text>
      <rect x="182" y="84" width="128" height="19" rx="3" fill="#0F8B6D"/>
      <text x="246" y="96.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.8" font-weight="800" fill="#FFFFFF">ORBIT CAPTURE · 8 YRS</text>
      <text x="246" y="75" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.2" font-weight="700" fill="#A5C3FF">MPO + MIO PROBES</text>
    </svg>`,
  },
  {
    id: 3,
    reg: 'EU',
    kicker: 'WARSAW · BALTIC',
    badgeType: 'CONFIRMED',
    badgeText: 'CONFIRMED · NATO',
    headline: 'Rutte pledges Polish defense as Baltic drone hits ship',
    deck: 'NATO chief visits Warsaw after missile breach; drones cripple Russian cargo ship Sparta II.',
    svg: `<svg viewBox="0 0 320 112" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="112" fill="#DCE6F2"/>
      <!-- Sea / Gulf of Finland top-right -->
      <path d="M145 0 L320 0 L320 56 C270 58, 220 48, 175 46 C155 44, 145 25, 145 0 Z" fill="#8DB3DC"/>
      <!-- Landmasses -->
      <path d="M0 0 L150 0 C150 30, 165 44, 195 48 L320 54 L320 112 L0 112 Z" fill="#EAE3D2" stroke="#B7AF9C" stroke-width="1"/>
      <!-- Map region labels -->
      <text x="174" y="21" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="6.8" font-weight="700" letter-spacing="0.06em" fill="#2B527E" opacity="0.85">BALTIC SEA</text>
      <text x="31" y="66" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7" font-weight="700" letter-spacing="0.08em" fill="#6F6858" opacity="0.85">POLAND</text>
      <!-- Border line Poland / East -->
      <path d="M138 56 L132 108" stroke="#C92A2A" stroke-width="1.6" stroke-dasharray="4 3"/>
      <!-- NATO Shield in Warsaw -->
      <path d="M58 46 L76 46 L76 62 C76 72, 67 78, 67 78 C67 78, 58 72, 58 62 Z" fill="#1D4D9B" stroke="#FFFFFF" stroke-width="1.5"/>
      <polygon points="67,52 69,59 74,60 69,62 67,69 65,62 60,60 65,59" fill="#FFFFFF"/>
      <text x="67" y="92" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.5" font-weight="800" fill="#171C23">WARSAW</text>
      <!-- Deflected missile arc -->
      <path d="M148 76 Q115 62 90 66" fill="none" stroke="#C92A2A" stroke-width="2" stroke-dasharray="3 2"/>
      <circle cx="88" cy="66" r="4" fill="#E67700"/>
      <!-- Burning Sparta II ship in Gulf of Finland -->
      <g transform="translate(226,30)">
        <polygon points="-24,6 24,6 19,14 -20,14" fill="#2A323D"/>
        <rect x="-14" y="0" width="18" height="6" fill="#495462"/>
        <rect x="6" y="-2" width="10" height="8" fill="#6B7582"/>
        <!-- Flames / smoke -->
        <circle cx="8" cy="-7" r="6" fill="#5A5F66" opacity="0.7"/>
        <circle cx="15" cy="-11" r="7" fill="#7C828B" opacity="0.55"/>
        <polygon points="6,1 10,-9 14,1" fill="#F03E3E"/>
        <polygon points="8,1 11,-5 13,1" fill="#FCC419"/>
      </g>
      <text x="234" y="54" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8" font-weight="800" fill="#171C23">SPARTA II · GULF OF FINLAND</text>
      <!-- Callout pills -->
      <rect x="10" y="9" width="96" height="17" rx="3" fill="#1D4D9B"/>
      <text x="58" y="20.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.5" font-weight="800" fill="#FFFFFF">NATO · WARSAW</text>
      <rect x="10" y="30" width="84" height="14" rx="2.5" fill="#FFFDF7" stroke="#1D4D9B" stroke-width="1"/>
      <text x="52" y="40" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.5" font-weight="800" fill="#1D4D9B">"EVERY INCH"</text>
      <rect x="166" y="84" width="144" height="19" rx="3" fill="#B6231B"/>
      <text x="238" y="96.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.2" font-weight="800" fill="#FFFFFF">DRONE HIT · CREW EVACUATED</text>
    </svg>`,
  },
];

// Mid cards (#4 - #13)
const MID_CARDS = [
  {
    id: 4,
    reg: 'ME',
    kicker: 'RIYADH',
    badgeType: 'OFFICIALS',
    badgeText: 'OFFICIALS · SAUDIS',
    headline: 'Saudis intercept three Houthi missiles over Riyadh',
    deck: 'Coalition lifts air-threat alert after explosions shake capital.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#182038"/>
      <!-- Riyadh skyline & Kingdom Centre -->
      <rect x="20" y="36" width="12" height="24" fill="#2E3A59"/>
      <rect x="35" y="42" width="10" height="18" fill="#25304A"/>
      <path d="M54 60 L57 18 L63 18 L66 60 Z" fill="#465884"/>
      <circle cx="60" cy="24" r="3" fill="#182038"/>
      <rect x="70" y="38" width="14" height="22" fill="#2E3A59"/>
      <!-- 3 intercepted arcs -->
      <path d="M170 48 Q128 24 100 18" fill="none" stroke="#FF6B6B" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M178 36 Q135 20 112 28" fill="none" stroke="#FF6B6B" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M164 56 Q130 34 106 38" fill="none" stroke="#FF6B6B" stroke-width="1.5" stroke-dasharray="3 2"/>
      <circle cx="100" cy="18" r="4" fill="#FFD43B"/><circle cx="112" cy="28" r="4" fill="#FFD43B"/><circle cx="106" cy="38" r="4" fill="#FFD43B"/>
      <rect x="6" y="6" width="60" height="13" rx="2" fill="#8F44A9"/>
      <text x="36" y="15" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.5" font-weight="800" fill="#FFF">RIYADH</text>
      <rect x="108" y="42" width="80" height="13" rx="2" fill="#B6231B"/>
      <text x="148" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.2" font-weight="800" fill="#FFF">3 INTERCEPTED</text>
    </svg>`,
  },
  {
    id: 5,
    reg: 'AS',
    kicker: 'INDONESIA · EU',
    badgeType: 'CONFIRMED',
    badgeText: 'CONFIRMED · EU',
    headline: 'Indonesia and EU sign landmark trade pact',
    deck: '10-year talks end; pact eliminates 98.5% of tariff lines.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#EAF4EE"/>
      <!-- Indonesia flag -->
      <rect x="14" y="10" width="44" height="13" fill="#CE1126"/>
      <rect x="14" y="23" width="44" height="13" fill="#FFFFFF"/>
      <rect x="14" y="10" width="44" height="26" fill="none" stroke="#999" stroke-width="0.7"/>
      <!-- Trade arrows -->
      <path d="M68 18 L124 18" stroke="#1D8D69" stroke-width="2.2"/>
      <polygon points="122,14 130,18 122,22" fill="#1D8D69"/>
      <path d="M126 28 L70 28" stroke="#285DAB" stroke-width="2.2"/>
      <polygon points="72,24 64,28 72,32" fill="#285DAB"/>
      <!-- EU flag -->
      <rect x="136" y="10" width="44" height="26" fill="#003399" stroke="#999" stroke-width="0.7"/>
      <g fill="#FFCC00">
        <circle cx="158" cy="15.5" r="1"/><circle cx="161.8" cy="16.5" r="1"/><circle cx="164.5" cy="19.3" r="1"/>
        <circle cx="165.5" cy="23" r="1"/><circle cx="164.5" cy="26.7" r="1"/><circle cx="161.8" cy="29.5" r="1"/>
        <circle cx="158" cy="30.5" r="1"/><circle cx="154.2" cy="29.5" r="1"/><circle cx="151.5" cy="26.7" r="1"/>
        <circle cx="150.5" cy="23" r="1"/><circle cx="151.5" cy="19.3" r="1"/><circle cx="154.2" cy="16.5" r="1"/>
      </g>
      <rect x="19" y="42" width="156" height="13" rx="2.5" fill="#1D8D69"/>
      <text x="97" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.4" font-weight="800" fill="#FFF">IEU-CEPA · 98.5% TARIFFS CUT</text>
    </svg>`,
  },
  {
    id: 6,
    reg: 'AM',
    kicker: 'PERU',
    badgeType: 'CONFIRMED',
    badgeText: 'CONFIRMED · USGS',
    headline: 'M6.7 quake shakes central Peru and Lima',
    deck: 'Deep Junín tremor empties Congress; minor damage, no deaths.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#F8ECE9"/>
      <!-- Peru silhouette -->
      <path d="M26 8 L48 12 L62 28 L56 54 L36 48 L22 26 Z" fill="#D5C8B0" stroke="#9C8F78" stroke-width="1"/>
      <!-- Epicenter rings -->
      <circle cx="44" cy="30" r="14" fill="none" stroke="#C23929" stroke-width="1" opacity="0.5"/>
      <circle cx="44" cy="30" r="8" fill="none" stroke="#C23929" stroke-width="1.4" opacity="0.8"/>
      <circle cx="44" cy="30" r="3.5" fill="#C23929"/>
      <!-- Seismograph wave -->
      <polyline points="72,30 82,30 86,23 90,37 94,14 98,46 102,11 106,49 110,20 114,40 118,27 124,30 184,30" fill="none" stroke="#C23929" stroke-width="1.7"/>
      <rect x="76" y="6" width="110" height="13" rx="2" fill="#C23929"/>
      <text x="131" y="15" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.5" font-weight="800" fill="#FFF">M6.7 · JUNÍN · 00:09 UTC</text>
      <text x="131" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.2" font-weight="700" fill="#3B2E2A">LIMA CONGRESS EVACUATED</text>
    </svg>`,
  },
  {
    id: 7,
    reg: 'AM',
    kicker: 'MEXICO',
    badgeType: 'OFFICIALS',
    badgeText: 'OFFICIALS · GOVT',
    headline: 'Mexico captures FBI-wanted cartel boss in Sinaloa',
    deck: 'Guasave raid nets "El Chapo Isidro"; clashes kill at least 11.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#1C2129"/>
      <!-- Target reticle / arrest badge -->
      <circle cx="34" cy="30" r="17" fill="#2A323E" stroke="#E05344" stroke-width="1.5"/>
      <line x1="34" y1="10" x2="34" y2="50" stroke="#E05344" stroke-width="1" opacity="0.7"/>
      <line x1="14" y1="30" x2="54" y2="30" stroke="#E05344" stroke-width="1" opacity="0.7"/>
      <circle cx="34" cy="25" r="5" fill="#D5DCE4"/>
      <path d="M24 41 C24 34, 44 34, 44 41 Z" fill="#D5DCE4"/>
      <rect x="60" y="8" width="124" height="14" rx="2" fill="#C23929"/>
      <text x="122" y="17.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.3" font-weight="800" fill="#FFF">SINALOA RAID · CAPTURED</text>
      <text x="122" y="34" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="900" fill="#FFFFFF">EL CHAPO ISIDRO</text>
      <rect x="68" y="41" width="108" height="12" rx="2" fill="#343D4B"/>
      <text x="122" y="49.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.1" font-weight="700" fill="#FFD8A8">FBI TOP 10 · 11 KILLED</text>
    </svg>`,
  },
  {
    id: 8,
    reg: 'AS',
    kicker: 'PHILIPPINES',
    badgeType: 'CONFIRMED',
    badgeText: 'CONFIRMED · CAAP',
    headline: 'Air Niugini 767 makes emergency landing in Davao',
    deck: 'All 146 evacuate safely via slides after engine-fire alert.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#DCEAF4"/>
      <!-- Runway -->
      <rect x="0" y="42" width="194" height="18" fill="#4B5563"/>
      <line x1="10" y1="51" x2="184" y2="51" stroke="#F8FAFC" stroke-width="1.5" stroke-dasharray="10 7"/>
      <!-- Plane silhouette -->
      <path d="M36 33 L130 33 L146 37 L130 40 L36 40 L26 22 L38 22 L46 33 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="1"/>
      <polygon points="78,36 105,27 110,27 94,36" fill="#CBD5E1" stroke="#1E293B" stroke-width="0.7"/>
      <!-- Engine alert glow -->
      <circle cx="92" cy="40" r="4" fill="#F97316"/>
      <!-- Yellow escape slide -->
      <polygon points="118,39 124,39 138,49 129,49" fill="#FACC15" stroke="#854D0E" stroke-width="0.8"/>
      <rect x="78" y="6" width="108" height="14" rx="2.5" fill="#1D8D69"/>
      <text x="132" y="15.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.5" font-weight="800" fill="#FFF">146 SAFE · DAVAO 767</text>
    </svg>`,
  },
  {
    id: 9,
    reg: 'EU',
    kicker: 'EUROPE',
    badgeType: 'REPORTED',
    badgeText: 'REPORTED · PRESS',
    headline: 'Tens of thousands march across France and Europe',
    deck: 'Living costs and youth anti-war rallies sweep Paris and Berlin.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#EDF1F7"/>
      <!-- Protest banner -->
      <rect x="22" y="5" width="150" height="14" rx="2" fill="#F2C94C" stroke="#171C23" stroke-width="1"/>
      <text x="97" y="14.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.6" font-weight="900" fill="#171C23">PARIS · BERLIN · EU MARCHES</text>
      <!-- Crowd heads & shoulders cleanly above bottom ribbon -->
      <g fill="#285DAB">
        <circle cx="24" cy="27" r="3.6"/><rect x="18" y="31.5" width="12" height="11" rx="2.5"/>
        <circle cx="52" cy="25.5" r="3.8"/><rect x="46" y="30" width="12" height="12.5" rx="2.5"/>
        <circle cx="80" cy="27" r="3.6"/><rect x="74" y="31.5" width="12" height="11" rx="2.5"/>
        <circle cx="110" cy="25.5" r="3.8"/><rect x="104" y="30" width="12" height="12.5" rx="2.5"/>
        <circle cx="138" cy="27" r="3.6"/><rect x="132" y="31.5" width="12" height="11" rx="2.5"/>
        <circle cx="168" cy="26" r="3.6"/><rect x="162" y="30.5" width="12" height="12" rx="2.5"/>
      </g>
      <g fill="#C23929">
        <circle cx="38" cy="28.5" r="3.4"/><rect x="33" y="32.5" width="10" height="10" rx="2"/>
        <circle cx="95" cy="28.5" r="3.4"/><rect x="90" y="32.5" width="10" height="10" rx="2"/>
        <circle cx="153" cy="28.5" r="3.4"/><rect x="148" y="32.5" width="10" height="10" rx="2"/>
      </g>
      <rect x="34" y="43" width="126" height="13" rx="2" fill="#171C23"/>
      <text x="97" y="52" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.3" font-weight="800" fill="#FFF">21,500 IN PARIS ALONE</text>
    </svg>`,
  },
  {
    id: 10,
    reg: 'AS',
    kicker: 'INDONESIA',
    badgeType: 'CONFIRMED',
    badgeText: 'CONFIRMED · USGS',
    headline: "M6.8 quake strikes Indonesia's Banda Sea",
    deck: 'Deep tremor hits 104 km NE of Lospalos; no tsunami threat.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#CBE6F4"/>
      <!-- Islands -->
      <path d="M12 44 L54 34 L62 40 L26 52 Z" fill="#84B88F" stroke="#4D7E58" stroke-width="0.8"/>
      <circle cx="102" cy="24" r="2.5" fill="#84B88F"/>
      <circle cx="116" cy="30" r="2" fill="#84B88F"/>
      <!-- Epicenter -->
      <circle cx="72" cy="28" r="14" fill="none" stroke="#C23929" stroke-width="1" opacity="0.5"/>
      <circle cx="72" cy="28" r="8" fill="none" stroke="#C23929" stroke-width="1.4"/>
      <circle cx="72" cy="28" r="3.5" fill="#C23929"/>
      <rect x="86" y="7" width="102" height="14" rx="2" fill="#1D8D69"/>
      <text x="137" y="16.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.5" font-weight="800" fill="#FFF">M6.8 · 09:42 UTC</text>
      <rect x="86" y="25" width="102" height="12" rx="2" fill="#FFFDF7" stroke="#1D8D69" stroke-width="0.8"/>
      <text x="137" y="33.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="6.4" font-weight="800" fill="#171C23">132 KM DEEP · BANDA SEA</text>
      <text x="137" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.2" font-weight="800" fill="#0F4C6E">NO TSUNAMI THREAT</text>
    </svg>`,
  },
  {
    id: 11,
    reg: 'AF',
    kicker: 'EGYPT',
    badgeType: 'OFFICIALS',
    badgeText: 'OFFICIALS · EGYPT',
    headline: 'Al-Sisi opens Aswan Forum with debt-relief call',
    deck: 'African leaders urge global financial reform and peace funding.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#F6EED2"/>
      <!-- Africa continent silhouette -->
      <path d="M26 10 L46 10 L56 18 L52 30 L42 46 L34 52 L28 38 L18 28 L18 18 Z" fill="#C49A45" stroke="#8A6B2B" stroke-width="1"/>
      <!-- Nile accent -->
      <path d="M40 12 Q42 22 39 30" fill="none" stroke="#285DAB" stroke-width="1.6"/>
      <!-- Summit podium & text -->
      <rect x="72" y="7" width="114" height="14" rx="2" fill="#8A6B2B"/>
      <text x="129" y="16.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.5" font-weight="800" fill="#FFF">6TH ASWAN FORUM</text>
      <text x="129" y="33" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.2" font-weight="900" fill="#171C23">DEBT RELIEF &amp; PEACE</text>
      <rect x="78" y="40" width="102" height="13" rx="2" fill="#FFFDF7" stroke="#8A6B2B" stroke-width="0.9"/>
      <text x="129" y="49" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7" font-weight="800" fill="#64510F">GLOBAL FINANCE REFORM</text>
    </svg>`,
  },
  {
    id: 12,
    reg: 'OC',
    kicker: 'OCEANIA · RUGBY',
    badgeType: 'CONFIRMED',
    badgeText: 'CONFIRMED · RUGBY',
    headline: 'England routs All Blacks 37–12; Ireland tops Springboks',
    deck: 'Wallabies edge Wales 29–26; France beats Argentina for final.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#14452E"/>
      <!-- Pitch lines -->
      <line x1="0" y1="48" x2="194" y2="48" stroke="#2E6F4E" stroke-width="1"/>
      <!-- Rugby ball -->
      <ellipse cx="28" cy="30" rx="16" ry="10" transform="rotate(-18 28 30)" fill="#F8F4E9" stroke="#171C23" stroke-width="1.1"/>
      <line x1="21" y1="32" x2="35" y2="28" stroke="#AE322B" stroke-width="1.3"/>
      <!-- Scoreboard -->
      <rect x="52" y="7" width="134" height="20" rx="2.5" fill="#0D281B" stroke="#42966D" stroke-width="0.9"/>
      <text x="119" y="20" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="9.5" font-weight="900" fill="#FFFFFF">ENG 37 – 12 NZ</text>
      <rect x="52" y="31" width="134" height="20" rx="2.5" fill="#1A879C"/>
      <text x="119" y="44" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.2" font-weight="800" fill="#FFFFFF">IRE 20–17 SA · AUS 29–26</text>
    </svg>`,
  },
  {
    id: 13,
    reg: 'AS',
    kicker: 'BANGLADESH',
    badgeType: 'REPORTED',
    badgeText: 'REPORTED · PRESS',
    headline: '80+ Bangladesh garment plants shut in wage protests',
    deck: 'Sit-ins hit Savar and Ashulia; police report dozens arrested.',
    svg: `<svg viewBox="0 0 194 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="194" height="60" fill="#F2ECE0"/>
      <!-- Factory sawtooth roof -->
      <polygon points="16,32 16,18 34,27 34,18 52,27 52,18 70,27 70,32" fill="#64748B" stroke="#334155" stroke-width="1"/>
      <rect x="16" y="32" width="54" height="22" fill="#CBD5E1" stroke="#334155" stroke-width="1"/>
      <rect x="34" y="38" width="18" height="16" fill="#475569"/>
      <line x1="34" y1="38" x2="52" y2="54" stroke="#F8FAFC" stroke-width="1.3"/>
      <line x1="52" y1="38" x2="34" y2="54" stroke="#F8FAFC" stroke-width="1.3"/>
      <rect x="80" y="8" width="106" height="15" rx="2.5" fill="#B6231B"/>
      <text x="133" y="18.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8" font-weight="800" fill="#FFF">80+ PLANTS SHUT</text>
      <text x="133" y="36" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8" font-weight="800" fill="#171C23">SAVAR &amp; ASHULIA</text>
      <text x="133" y="49" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7.2" font-weight="700" fill="#525B63">GARMENT WAGE SIT-INS</text>
    </svg>`,
  },
];

// Briefs #14 - #36 (23 briefs across 3 columns: 8 + 8 + 7 = 23)
const BRIEFS_COLS = [
  [
    { id: 14, reg: 'EU', lead: 'Kryvyi Rih:', text: 'Russian missile kills 2, wounds ~60' },
    { id: 15, reg: 'EU', lead: 'Kyiv:', text: 'overnight missiles and drones spark fires' },
    { id: 16, reg: 'EU', lead: 'Finland:', text: 'curbs Baltic airspace after ship strike' },
    { id: 17, reg: 'EU', lead: 'Kyiv–UK:', text: 'UK defense chief meets Zelenskyy on drones' },
    { id: 18, reg: 'EU', lead: 'Vatican:', text: 'Pope Leo XIV marks CNEWA centenary' },
    { id: 19, reg: 'EU', lead: 'Premier League:', text: 'Spurs win; teen Williams-Barnett scores' },
    { id: 20, reg: 'EU', lead: 'Turin:', text: 'Alcaraz reaches ATP Finals title match' },
    { id: 21, reg: 'ME', lead: 'Hormuz:', text: '3 oil tankers reported hit near strait' },
  ],
  [
    { id: 22, reg: 'ME', lead: 'Iran:', text: 'IRGC unveils underground dual-missile launcher' },
    { id: 23, reg: 'ME', lead: 'Gaza:', text: 'Israeli strikes kill 4, 3 in food truck' },
    { id: 24, reg: 'ME', lead: 'Basra:', text: 'power plant gas fire kills 4, hurts 35' },
    { id: 25, reg: 'AS', lead: 'Japan–Saudi:', text: 'oil stockpile deal triples to 24m bbl' },
    { id: 26, reg: 'AS', lead: 'India:', text: 'Google pledges $5m AI grant to IIT Kharagpur' },
    { id: 27, reg: 'AS', lead: 'China:', text: "Li Qiang, Singapore's Wong push FTA 4.0" },
    { id: 28, reg: 'AS', lead: 'S. Korea:', text: '111 caught with smart devices in Suneung exam' },
    { id: 29, reg: 'AM', lead: 'US–Canada:', text: 'leaked Hegseth memo curbs defense ties' },
  ],
  [
    { id: 30, reg: 'AM', lead: 'Las Vegas F1:', text: 'Verstappen gets pole via Antonelli penalty' },
    { id: 31, reg: 'AM', lead: 'Dominican Rep.:', text: 'LatAm govt summit closes in Cap Cana' },
    { id: 32, reg: 'AM', lead: 'Brazil:', text: '16-yr-old Silva sends Brazil past Canada in BJK Cup' },
    { id: 33, reg: 'AF', lead: 'Ethiopia:', text: 'China–Africa poverty forum opens in Addis Ababa' },
    { id: 34, reg: 'AF', lead: 'Somalia:', text: 'moves vaccine cold hub home after 30 yrs' },
    { id: 35, reg: 'OC', lead: 'Melbourne:', text: 'Australia edges England in 1st T20I cricket' },
    { id: 36, reg: 'SP', lead: 'SpaceX CRS-35:', text: 'Dragon splashes down off California (22:03 UTC)' },
  ],
];

// Map projection: lon [-172..180] -> [2..252], lat [78..-60] -> [2..140] in 254x144 SVG
function lonLatToXY(lon, lat) {
  const x = 2 + ((lon + 172) / 352) * 250;
  const y = 2 + ((78 - lat) / 138) * 138;
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
  // Baffin Island
  [[-86, 73], [-75, 72], [-66, 68], [-64, 63], [-74, 63], [-80, 68]],
  // Victoria Island
  [[-118, 72], [-104, 72], [-102, 69], [-116, 69]],
  // Newfoundland
  [[-59, 51], [-53, 49], [-53, 46], [-59, 47]],
  // Cuba
  [[-85, 22], [-79, 23], [-74, 20], [-78, 20], [-83, 21]],
  // Hispaniola
  [[-74, 20], [-68, 19], [-69, 18], [-74, 18]],
  // Greenland
  [[-56, 75], [-42, 77.5], [-20, 77.5], [-17, 74], [-24, 69], [-35, 66], [-44, 60], [-51, 64], [-53, 70]],
  // Iceland
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
  // Madagascar
  [[49, -12], [50, -17], [47, -25], [44, -24], [45, -17]],
  // Eurasia (continuous Europe + Middle East + Asia)
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
  // Great Britain & Ireland
  [[-5, 50], [-4, 53], [-5, 57], [-2, 58], [-2, 55], [1, 52], [-1, 50]],
  [[-10, 52], [-9, 55], [-6, 55], [-6, 52]],
  // Sicily & Sardinia
  [[12, 38], [15, 38], [15, 36.7]],
  [[8.2, 41], [9.6, 41], [9.5, 39], [8.3, 39]],
  // Sri Lanka
  [[80, 9.5], [81.8, 7.5], [80.5, 6], [79.8, 7.5]],
  // Japan (Hokkaido + Honshu/Kyushu)
  [[140, 42], [142, 45], [145, 43], [142, 42]],
  [[130, 31], [131, 34], [136, 35], [141, 38], [141, 41], [138, 39], [134, 35], [130, 33]],
  // Taiwan
  [[120.5, 25], [122, 24.5], [121, 22], [120, 23]],
  // Philippines (Luzon & Mindanao)
  [[120, 18], [122, 18], [123, 14], [120, 14]],
  [[122, 8], [126, 9], [126, 6], [123, 6]],
  // Sumatra, Java, Borneo, Sulawesi, New Guinea
  [[95, 5.5], [99, 3], [105, -5], [103, -6], [98, 0]],
  [[105, -6.2], [114, -7.8], [114, -8.5], [106, -7.2]],
  [[109, 1], [115, 6], [118, 5], [117, -3], [111, -3]],
  [[119, 1], [125, 1], [122, -4], [119, -5]],
  [[131, -1.5], [141, -3], [150, -10], [144, -8], [136, -5]],
  // Australia & Tasmania
  [
    [114, -22], [122, -17], [130, -12], [136, -12], [137, -15], [141, -16],
    [142, -11], [146, -17], [153, -26], [150, -37], [141, -38], [136, -35],
    [129, -32], [118, -35], [115, -34], [114, -27],
  ],
  [[145, -41], [148, -41], [147, -43.5], [145.5, -43]],
  // New Zealand (North & South Islands)
  [[173, -35], [178, -38], [176, -41], [174, -40]],
  [[173, -41], [174, -43], [169, -46.5], [167, -45.5], [171, -42]],
];

const INLAND_SEAS = [
  // Baltic Sea
  [[11, 56], [13, 55], [16, 54], [20, 55], [22, 57], [24, 59], [29, 60], [24, 60], [21, 61], [21, 65], [18, 63], [17, 59], [14, 56]],
  // Black Sea
  [[28, 41], [28, 44], [32, 46], [34, 44.5], [37, 45], [41, 42], [38, 41], [33, 42]],
  // Caspian Sea
  [[47, 46], [52, 46], [54, 42], [53, 37], [49, 37], [48, 41]],
];

const MAP_PINS = [
  { id: 7, reg: 'AM', pos: lonLatToXY(-107, 25) },   // Sinaloa Mexico
  { id: 6, reg: 'AM', pos: lonLatToXY(-75, -11) },   // Peru
  { id: 9, reg: 'EU', pos: lonLatToXY(2, 48) },      // Paris / Western Europe
  { id: 3, reg: 'EU', pos: lonLatToXY(21, 54) },     // Warsaw / Baltic
  { id: 1, reg: 'ME', pos: lonLatToXY(31, 37) },     // Antalya Turkey
  { id: 11, reg: 'AF', pos: lonLatToXY(31, 21) },    // Aswan Egypt
  { id: 4, reg: 'ME', pos: lonLatToXY(48, 24) },     // Riyadh
  { id: 13, reg: 'AS', pos: lonLatToXY(90, 24) },    // Bangladesh
  { id: 5, reg: 'AS', pos: lonLatToXY(107, -6) },    // Indonesia (Jakarta)
  { id: 8, reg: 'AS', pos: lonLatToXY(126, 7) },     // Davao Philippines
  { id: 10, reg: 'AS', pos: lonLatToXY(131, -8) },   // Banda Sea
  { id: 12, reg: 'OC', pos: lonLatToXY(171, -41) },  // Oceania / All Blacks & Wallabies
];

function buildWorldMapSVG() {
  const landSvg = WORLD_LANDMASSES.map(
    (poly) => `<path d="${polyPath(poly)}" fill="#DBD2BE" stroke="#8F8570" stroke-width="0.65" stroke-linejoin="round"/>`
  ).join('\n');

  const seasSvg = INLAND_SEAS.map(
    (poly) => `<path d="${polyPath(poly)}" fill="#E1EDF5" stroke="#8F8570" stroke-width="0.55" stroke-linejoin="round"/>`
  ).join('\n');

  const gratLons = [-120, -60, 0, 60, 120];
  const gratLats = [60, 30, -30];
  const gratLines = [
    ...gratLons.map((lon) => {
      const [x] = lonLatToXY(lon, 0);
      return `<line x1="${x}" y1="2" x2="${x}" y2="140" stroke="#CFE0EC" stroke-width="0.45"/>`;
    }),
    ...gratLats.map((lat) => {
      const [, y] = lonLatToXY(0, lat);
      return `<line x1="2" y1="${y}" x2="252" y2="${y}" stroke="#CFE0EC" stroke-width="0.45"/>`;
    }),
  ].join('\n');
  const [, eqY] = lonLatToXY(0, 0);
  const [pmX] = lonLatToXY(0, 0);

  const pinsSvg = MAP_PINS.map(({ id, reg, pos }) => {
    const color = REGIONS[reg].color;
    return `<g>
      <circle cx="${pos[0]}" cy="${pos[1]}" r="5.6" fill="${color}" stroke="#FFFDF7" stroke-width="1.15"/>
      <text x="${pos[0]}" y="${(parseFloat(pos[1]) + 2.1).toFixed(1)}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="6.1" font-weight="800" fill="#FFFFFF">${id}</text>
    </g>`;
  }).join('\n');

  return `<svg viewBox="0 0 254 144" width="274" height="156" xmlns="http://www.w3.org/2000/svg" style="display:block;border:1px solid #C8BFA8;border-radius:3px;">
    <defs>
      <linearGradient id="oceanBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ECF3F8"/>
        <stop offset="100%" stop-color="#DFECF4"/>
      </linearGradient>
    </defs>
    <rect width="254" height="144" fill="url(#oceanBg)"/>
    ${gratLines}
    <line x1="2" y1="${eqY}" x2="252" y2="${eqY}" stroke="#BDD3E3" stroke-width="0.65" stroke-dasharray="2.5 2"/>
    <line x1="${pmX}" y1="2" x2="${pmX}" y2="140" stroke="#BDD3E3" stroke-width="0.55" stroke-dasharray="2.5 2"/>
    ${landSvg}
    ${seasSvg}
    <!-- Space inset -->
    <rect x="5" y="116" width="58" height="21" rx="3" fill="#141F3D" stroke="#6E8EE0" stroke-width="0.8"/>
    <circle cx="15.5" cy="126.5" r="5.4" fill="#3B4D8A" stroke="#FFF" stroke-width="0.9"/>
    <text x="15.5" y="128.6" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="6.2" font-weight="800" fill="#FFF">2</text>
    <text x="42.5" y="128.8" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="6.2" font-weight="800" fill="#DDE8FF">MERCURY</text>
    ${pinsSvg}
  </svg>`;
}

function badgeColors(type) {
  if (type === 'CONFIRMED') return 'background:#D7F3DE;border-color:#4E8E68;color:#1F5434;';
  if (type === 'OFFICIALS') return 'background:#FBF1C4;border-color:#B89E4A;color:#64510F;';
  return 'background:#E8EAE8;border-color:#8C918E;color:#3E4240;';
}

function renderHtml() {
  const utcHtml = UTC_STRIP.map((u, idx) => `
    <div class="utc-item${idx === 0 ? ' first' : ''}">
      <div class="utc-time">${u.time}</div>
      <div class="utc-text">${u.text}</div>
    </div>`).join('');

  const numHtml = NUMBERS_STRIP.map((n, idx) => `
    <div class="num-item${idx === 0 ? ' first' : ''}">
      <div class="num-val">${n.num}</div>
      <div class="num-text">${n.text}</div>
    </div>`).join('');

  const leadHtml = LEAD_CARDS.map((c) => `
    <article class="lead-card">
      <div class="lead-art">${c.svg}</div>
      <div class="meta-row">
        <span class="meta-left">
          <span class="num-dot" style="background:${REGIONS[c.reg].color}">${c.id}</span>
          <span class="kicker" style="color:${REGIONS[c.reg].color}">${c.kicker}</span>
        </span>
        <span class="status-pill" style="${badgeColors(c.badgeType)}">${c.badgeText}</span>
      </div>
      <h2 class="lead-h2">${c.headline}</h2>
      <p class="lead-deck">${c.deck}</p>
    </article>`).join('');

  const renderMid = (cards) => cards.map((c) => `
    <article class="mid-card">
      <div class="mid-art">${c.svg}</div>
      <div class="meta-row mid-meta">
        <span class="meta-left">
          <span class="num-dot sm" style="background:${REGIONS[c.reg].color}">${c.id}</span>
          <span class="kicker sm" style="color:${REGIONS[c.reg].color}">${c.kicker}</span>
        </span>
        <span class="status-pill sm" style="${badgeColors(c.badgeType)}">${c.badgeText}</span>
      </div>
      <h3 class="mid-h3">${c.headline}</h3>
      <p class="mid-deck">${c.deck}</p>
    </article>`).join('');

  const legendHtml = Object.values(REGIONS).map((r) => `
    <span class="leg-item"><span class="leg-dot" style="background:${r.color}"></span>${r.name} <strong>${r.count}</strong></span>`).join('');

  const briefsHtml = BRIEFS_COLS.map((col) => `
    <div class="briefs-col">
      ${col.map((b) => `
        <div class="brief-item">
          <span class="num-dot sm" style="background:${REGIONS[b.reg].color}">${b.id}</span>
          <span class="brief-body"><strong>${b.lead}</strong> ${b.text}</span>
        </div>`).join('')}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Saturday 21 November 2026 — World News</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1024px;
    min-height: 1024px;
    background: #F8F4E9;
    color: #0E1B2B;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    min-height: 1024px;
    padding: 6px 10px 5px 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  /* Masthead */
  .masthead-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.055em;
    text-transform: uppercase;
  }
  .masthead-kicker { color: #AE322B; }
  .masthead-meta { color: #171C23; }
  .masthead-title {
    font-family: 'Playfair Display', Georgia, Cambria, serif;
    font-variant-numeric: lining-nums;
    font-size: 55px;
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.015em;
    text-align: center;
    color: #0E1B2B;
    margin: 1px 0 3px 0;
  }
  .double-rule {
    border-top: 2.5px solid #171C23;
    border-bottom: 1px solid #171C23;
    height: 5px;
  }
  /* UTC strip */
  .utc-strip {
    display: flex;
    align-items: stretch;
    padding: 4px 0;
    border-bottom: 1.5px solid #171C23;
  }
  .strip-pill {
    width: 78px;
    flex: 0 0 78px;
    background: #AE322B;
    color: #FFFFFF;
    font-size: 9px;
    font-weight: 800;
    line-height: 1.12;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 2px;
    margin-right: 6px;
    padding: 2px 4px;
  }
  .utc-cols {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
  .utc-item {
    padding: 0 4px;
    border-left: 1px solid #D4CCB9;
    text-align: center;
  }
  .utc-item.first { border-left: none; }
  .utc-time {
    font-size: 11.8px;
    font-weight: 800;
    color: #AE322B;
    line-height: 1.08;
  }
  .utc-text {
    font-size: 9.6px;
    font-weight: 600;
    color: #171C23;
    line-height: 1.14;
    margin-top: 1px;
  }
  /* Numbers strip */
  .num-strip {
    display: flex;
    align-items: center;
    background: #EEE9D6;
    padding: 4px 4px;
    border-bottom: 1.5px solid #171C23;
  }
  .num-label {
    width: 78px;
    flex: 0 0 78px;
    color: #AE322B;
    font-size: 9px;
    font-weight: 900;
    line-height: 1.12;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-align: center;
    margin-right: 6px;
  }
  .num-cols {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }
  .num-item {
    padding: 0 4px;
    border-left: 1px solid #D4CCB9;
    text-align: center;
  }
  .num-item.first { border-left: none; }
  .num-val {
    font-family: 'Playfair Display', Georgia, Cambria, serif;
    font-variant-numeric: lining-nums;
    font-size: 18.5px;
    font-weight: 900;
    color: #0E1B2B;
    line-height: 1.03;
  }
  .num-text {
    font-size: 9.5px;
    font-weight: 600;
    color: #262B33;
    line-height: 1.14;
    margin-top: 1px;
  }
  /* Lead cards */
  .lead-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 6px 0 6px 0;
    border-bottom: 1px solid #D4CCB9;
  }
  .lead-art {
    width: 100%;
    height: 122px;
    border: 1px solid #C8BFA8;
    border-radius: 3px;
    overflow: hidden;
  }
  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
    gap: 4px;
  }
  .meta-left {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }
  .num-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 800;
    flex-shrink: 0;
  }
  .num-dot.sm {
    width: 15px;
    height: 15px;
    font-size: 8.6px;
  }
  .kicker {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .kicker.sm { font-size: 8.4px; }
  .status-pill {
    font-size: 8.4px;
    font-weight: 800;
    letter-spacing: 0.02em;
    padding: 1px 4px;
    border-radius: 2px;
    border: 1px solid;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .status-pill.sm {
    font-size: 7px;
    padding: 0.5px 3px;
  }
  .lead-h2 {
    font-family: 'Playfair Display', Georgia, Cambria, serif;
    font-variant-numeric: lining-nums;
    font-size: 18.5px;
    font-weight: 800;
    line-height: 1.10;
    color: #0E1B2B;
    margin-top: 3px;
  }
  .lead-deck {
    font-size: 10.8px;
    font-weight: 500;
    line-height: 1.24;
    color: #262B33;
    margin-top: 2px;
  }
  /* Mid rows */
  .mid-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    padding: 5px 0 6px 0;
    border-bottom: 1px solid #D4CCB9;
  }
  .mid-grid.last-mid {
    border-bottom: 1.5px solid #171C23;
  }
  .mid-art {
    width: 100%;
    height: 68px;
    border: 1px solid #C8BFA8;
    border-radius: 2.5px;
    overflow: hidden;
  }
  .mid-meta { margin-top: 3px; }
  .mid-h3 {
    font-family: 'Playfair Display', Georgia, Cambria, serif;
    font-variant-numeric: lining-nums;
    font-size: 13px;
    font-weight: 800;
    line-height: 1.12;
    color: #0E1B2B;
    margin-top: 2px;
  }
  .mid-deck {
    font-size: 9.5px;
    font-weight: 500;
    line-height: 1.20;
    color: #262B33;
    margin-top: 2px;
  }
  /* Zone 7: Map + Briefs */
  .bottom-zone {
    display: grid;
    grid-template-columns: 274px 1fr;
    gap: 12px;
    padding: 6px 0 4px 0;
    align-items: start;
  }
  .sec-title {
    font-size: 11px;
    font-weight: 900;
    color: #AE322B;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    margin-top: 6px;
    font-size: 9.8px;
    color: #171C23;
    line-height: 1.25;
  }
  .leg-item {
    display: inline-flex;
    align-items: center;
    gap: 3.5px;
  }
  .leg-dot {
    width: 7.5px;
    height: 7.5px;
    border-radius: 50%;
    display: inline-block;
  }
  .briefs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 9px;
  }
  .briefs-col {
    display: flex;
    flex-direction: column;
    gap: 5.5px;
  }
  .brief-item {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    font-size: 10.6px;
    line-height: 1.22;
    color: #171C23;
  }
  .brief-body strong { color: #0E1B2B; }
  /* Zone 8: Date Check + Footer */
  footer { margin-top: auto; }
  .date-check {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F3EDE0;
    border: 1px solid #C8BFA8;
    border-radius: 2.5px;
    padding: 5px 8px;
  }
  .dc-pill {
    background: #B6231B;
    color: #FFFFFF;
    font-size: 9.2px;
    font-weight: 900;
    letter-spacing: 0.05em;
    padding: 3.5px 8px;
    border-radius: 2px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .dc-text {
    font-size: 9.5px;
    line-height: 1.25;
    color: #171C23;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #171C23;
    padding-top: 4px;
    margin-top: 4px;
    font-size: 8.9px;
    color: #262B33;
  }
  .footer-pills {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .f-pill-wrap {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
</style>
</head>
<body>
  <main class="page">
    <header>
      <div class="masthead-top">
        <span class="masthead-kicker">THE WORLD ON ONE PAGE</span>
        <span class="masthead-meta">36 STORIES · 6 CONTINENTS &amp; SPACE · 10 FIELDS · EVERY ONE FROM THIS SATURDAY</span>
      </div>
      <h1 class="masthead-title">Saturday 21 November 2026</h1>
      <div class="double-rule"></div>
    </header>

    <section class="utc-strip">
      <div class="strip-pill">THE DAY<br/>IN UTC</div>
      <div class="utc-cols">${utcHtml}</div>
    </section>

    <section class="num-strip">
      <div class="num-label">THE DAY IN<br/>NUMBERS</div>
      <div class="num-cols">${numHtml}</div>
    </section>

    <section class="lead-grid">${leadHtml}</section>

    <section class="mid-grid">${renderMid(MID_CARDS.slice(0, 5))}</section>

    <section class="mid-grid last-mid">${renderMid(MID_CARDS.slice(5, 10))}</section>

    <section class="bottom-zone">
      <div>
        <div class="sec-title">WHERE IT HAPPENED</div>
        ${buildWorldMapSVG()}
        <div class="legend">${legendHtml}</div>
      </div>
      <div>
        <div class="sec-title">ALSO ON SATURDAY 21 NOVEMBER</div>
        <div class="briefs-grid">${briefsHtml}</div>
      </div>
    </section>

    <footer>
      <div class="date-check">
        <span class="dc-pill">DATE CHECK</span>
        <p class="dc-text"><strong>Left out on purpose, first occurred/reported before Saturday:</strong> Cyclone Akvan's Odisha landfall, the EU–UK summit close, Nigeria's Bayelsa boat capsize, Phumzile Mlambo-Ngcuka's death, and Trump's post-Asia press conference (all Fri 20 Nov). <strong>Not yet:</strong> the Las Vegas GP race (04:00 UTC Sun 22), ATP Finals title match (Sun 22), and any final COP31 text.</p>
      </div>
      <div class="footer">
        <span>All stories occurred or first reported Sat 21 Nov 2026.</span>
        <span class="footer-pills">
          <span class="f-pill-wrap"><span class="status-pill sm" style="${badgeColors('CONFIRMED')}">CONFIRMED</span> on the record</span>
          <span class="f-pill-wrap"><span class="status-pill sm" style="${badgeColors('OFFICIALS')}">OFFICIALS</span> officials say</span>
          <span class="f-pill-wrap"><span class="status-pill sm" style="${badgeColors('REPORTED')}">REPORTED</span> news report</span>
        </span>
        <span>Sources: AP, Reuters, USGS, ESA, NATO, UN, EU</span>
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
cropped = im.crop((0, 0, 1024, 1024))
cropped.save(r"${OUT_PNG}", format="PNG", optimize=True)
sz = os.path.getsize(r"${OUT_PNG}")
if sz > 1000000:
    cropped.save(r"${OUT_PNG}", format="JPEG", quality=93, optimize=True)
    sz = os.path.getsize(r"${OUT_PNG}")
prev = cropped.resize((300, 300), Image.Resampling.LANCZOS)
prev.save(r"${PREVIEW_300}", format="PNG", optimize=True)
print(f"Saved {r'${OUT_PNG}'} ({sz} bytes, 1024x1024)")
`;
  execFileSync('python', ['-c', pyScript], { stdio: 'inherit' });
}

main();
