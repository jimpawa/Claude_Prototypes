/* ════════════════════════════════════════════════════════════════
   data.jsx — icons, flags, logo, datasets, helpers
   ════════════════════════════════════════════════════════════════ */
const SPRITE = ""; // symbols inlined in the HTML document

// generic pawaIconZ glyph (external sprite)
function PIcon({ name, size, color, className, style, onClick }) {
  return (
    <svg className={"p-ico" + (className ? " " + className : "")}
         width={size} height={size} onClick={onClick}
         style={{ color, ...(style || {}) }} aria-hidden="true">
      <use href={`${SPRITE}#pIcon-${name}`} />
    </svg>
  );
}

// betPawa wordmark (P-mark lime + wordmark white, from ui kit)
function Logo() {
  return (
    <svg viewBox="0 0 250 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M118.479 0.206H97.188L89.472 42.789h13.038l2.273-13.875h12.5c14.593 0 15.251-13.876 15.251-13.876C133.969-.033 118.479.206 118.479.206Zm1.794 13.696c-.179 4.904-6.818 4.845-6.818 4.845h-6.997l1.495-8.553h7.655c4.905.06 4.665 3.708 4.665 3.708Z" fill="#9CE800"/>
      <path d="M27.93 10.014s-6.758-.18-10.167 3.768L20.275.206H7.476L0 42.071h12.56l.478-3.708s3.888 4.725 9.689 4.366c0 0 16.028.24 16.088-20.035-.06.06.718-12.739-10.885-12.68Zm-1.794 16.268c-.299 4.725-3.469 7.177-6.459 7.177-2.99 0-5.024-2.631-4.486-6.818.539-4.545 3.529-7.775 6.878-7.536 5.204.3 4.067 7.177 4.067 7.177Z" fill="#fff"/>
      <path d="M70.214 20.301c0 8.972-12.918 10.228-20.634 10.168.072.43.193.852.36 1.256.837 1.615 2.93 2.153 4.605 2.213 2.226.046 4.44-.34 6.519-1.137 1.072-.437 2.078-1.021 2.99-1.734l3.649 6.04c.12.18-2.512 1.914-2.631 2.034-2.098 1.315-4.403 2.265-6.819 2.811-4.664 1.076-10.226 1.315-14.712-.658-1.503-.669-2.836-1.666-3.903-2.918-1.066-1.253-1.837-2.729-2.257-4.319-.503-1.892-.745-3.844-.718-5.801 0-8.972 6.34-17.644 19.796-17.644 8.254.06 13.756 3.17 13.756 9.689ZM55.74 17.909c-3.947 0-6.519 3.05-6.758 7.296 4.246-.179 9.868-1.734 9.868-4.784-.06-1.555-1.196-2.512-3.11-2.512Z" fill="#fff"/>
      <path d="M87.379.206H76.972L75.059 10.732H70.214l-1.615 8.373h4.904L71.53 33.818s-1.136 8.851 7.596 8.971c8.732.12 13.277-4.784 13.277-4.784l-3.947-6.639s-5.383 1.914-5.263-1.495c.119-3.409 1.315-10.765 1.315-10.765l7.117-.06 1.495-8.433h-7.655L87.379.206Z" fill="#fff"/>
      <path d="M178.765 11.091h-13.038l4.426 31.698h11.244l8.373-15.849 1.615 15.849h11.363l15.849-31.698h-13.756l-5.861 16.806-1.914-16.806h-9.629l-7.775 17.524-.897-17.524Z" fill="#9CE800"/>
      <path d="M154.782 11.091l-.538 2.93c-3.012-2.298-6.678-3.576-10.466-3.648-6.101 0-15.371 4.964-15.311 19.139 0 7.655 3.05 13.815 12.38 13.337 0 0 5.024.06 8.553-3.23l-.598 3.11h11.961l5.981-31.638h-11.962Zm-9.15 22.069c-2.931.18-5.024-2.332-5.263-5.084-.299-3.827 2.811-8.193 6.818-8.492 1.04-.111 2.092.026 3.07.4.977.375 1.852.975 2.552 1.754l-1.675 8.971c-1.517 1.397-3.449 2.259-5.502 2.451Z" fill="#9CE800"/>
      <path d="M237.855 11.091l-.538 2.93c-3.012-2.298-6.678-3.576-10.467-3.648-6.1 0-15.37 4.964-15.31 19.139 0 7.655 3.05 13.815 12.38 13.337 0 0 5.024.06 8.552-3.23l-.598 3.11h11.962l5.981-31.638h-11.962Zm-9.15 22.069c-2.931.18-5.024-2.332-5.264-5.084-.299-3.827 2.811-8.193 6.819-8.492 1.04-.111 2.092.026 3.069.4.978.375 1.853.975 2.552 1.754l-1.674 8.971c-1.522 1.388-3.452 2.248-5.502 2.451Z" fill="#9CE800"/>
    </svg>
  );
}

// ── flag marks (simple but recognisable) ──
function Flag({ code, className, style }) {
  const cls = "flag " + (className || "");
  const r = 2;
  switch (code) {
    case "eng":
      return (<svg className={cls} style={style} viewBox="0 0 22 16"><rect width="22" height="16" rx={r} fill="#fff"/><rect x="9" width="4" height="16" fill="#CE1124"/><rect y="6" width="22" height="4" fill="#CE1124"/></svg>);
    case "ita":
      return (<svg className={cls} style={style} viewBox="0 0 22 16"><rect width="22" height="16" rx={r} fill="#fff"/><rect width="7.3" height="16" fill="#008C45"/><rect x="14.7" width="7.3" height="16" fill="#CD212A"/></svg>);
    case "ger":
      return (<svg className={cls} style={style} viewBox="0 0 22 16"><rect width="22" height="16" rx={r} fill="#000"/><rect y="5.3" width="22" height="5.4" fill="#DD0000"/><rect y="10.6" width="22" height="5.4" fill="#FFCE00"/></svg>);
    case "esp":
      return (<svg className={cls} style={style} viewBox="0 0 22 16"><rect width="22" height="16" rx={r} fill="#AA151B"/><rect y="4" width="22" height="8" fill="#F1BF00"/></svg>);
    case "fra":
      return (<svg className={cls} style={style} viewBox="0 0 22 16"><rect width="22" height="16" rx={r} fill="#fff"/><rect width="7.3" height="16" fill="#002654"/><rect x="14.7" width="7.3" height="16" fill="#ED2939"/></svg>);
    case "benin":
      return (<svg className={cls} style={style} viewBox="0 0 22 16"><rect width="22" height="16" rx={r} fill="#FCD116"/><rect width="8" height="16" fill="#008751"/><rect x="8" width="14" height="8" fill="#FCD116"/><rect x="8" y="8" width="14" height="8" fill="#E8112D"/></svg>);
    case "ucl":
    default:
      return (<svg className={cls} style={style} viewBox="0 0 22 16"><rect width="22" height="16" rx={r} fill="#0B1B3F"/><circle cx="11" cy="8" r="4.4" fill="none" stroke="#fff" strokeWidth="1.1"/><path d="M11 4.2l.5 1.5h1.6l-1.3 1 .5 1.5-1.3-.9-1.3.9.5-1.5-1.3-1h1.6z" fill="#fff"/></svg>);
  }
}

// ── datasets ──
const MARKETS = [
  { id: "1x2", label: "1X2" },
  { id: "1x2-1up", label: "1X2 | 1UP" },
  { id: "1x2-2up", label: "1X2 | 2UP" },
  { id: "tg", label: "Total Goals" },
  { id: "1x2-fh", label: "1X2 First Half" },
  { id: "tg-fh", label: "Total Goals First Half" },
  { id: "dc", label: "Double Chance" },
  { id: "btts", label: "Both Teams to Score (GG/NG)" },
  { id: "1x2-ou", label: "1X2 and Over/Under" },
  { id: "hwmg", label: "Half With More Goals" },
  { id: "dc-btts", label: "Double Chance and Both Teams To Score" },
  { id: "1x2-int", label: "1X2 - Interval 10 minutes (00:01-09:59)" },
];

const DATES = [
  { id: "live", label: "Live", count: 8 },
  { id: "today", label: "Today", count: 80 },
  { id: "tomorrow", label: "Tomorrow", count: 97 },
  { id: "sat", label: "Sat", count: 117 },
  { id: "sun", label: "Sun", count: 125 },
  { id: "mon", label: "Mon", count: 14 },
  { id: "tue", label: "Tue", count: 9 },
  { id: "wed", label: "Wed", count: 0 },
];

const LEAGUES = [
  { id: "pl", label: "Premier League", flag: "eng", count: 8 },
  { id: "seriea", label: "Serie A", flag: "ita", count: 8 },
  { id: "ligue1", label: "Ligue 1", flag: "fra", count: 8 },
  { id: "coupe", label: "Coupe De France", flag: "fra", count: 8 },
  { id: "bundes", label: "Bundesliga", flag: "ger", count: 8 },
  { id: "dfb", label: "DFB Pokal", flag: "ger", count: 8 },
  { id: "laliga", label: "LaLiga", flag: "esp", count: 8 },
  { id: "europa", label: "UEFA Europa League", flag: "ucl", count: 8 },
  { id: "ucl", label: "UEFA Champions League", flag: "ucl", count: 8 },
];

const COUNTRIES = [
  { id: "england", label: "England", flag: "eng", count: 82, leagues: ["Premier League", "Championship", "FA Cup", "EFL Cup"] },
  { id: "italy", label: "Italy", flag: "ita", count: 82, leagues: ["Serie A", "Serie B", "Coppa Italia"] },
  { id: "germany", label: "Germany", flag: "ger", count: 82, leagues: ["Bundesliga", "2. Bundesliga", "DFB Pokal"] },
  { id: "spain", label: "Spain", flag: "esp", count: 82, leagues: ["LaLiga", "LaLiga 2", "Copa del Rey"] },
  { id: "uclc", label: "UEFA Champions League", flag: "ucl", count: 82, leagues: ["Group Stage", "Knockout"] },
  { id: "france", label: "France", flag: "fra", count: 82, leagues: ["Ligue 1", "Ligue 2", "Coupe De France"] },
];

// "Other Countries" — full alphabetical list with circular flags
const OTHER_COUNTRIES = [
  { id: "algeria",   label: "Algeria",            flag: "algeria",   count: 1,   leagues: ["Ligue Professionnelle 1"] },
  { id: "argentina", label: "Argentina",          flag: "argentina", count: 56,  leagues: ["Primera División", "Primera Nacional", "Copa Argentina"] },
  { id: "austria",   label: "Austria",            flag: "austria",   count: 1,   leagues: ["Bundesliga", "2. Liga"] },
  { id: "bolivia",   label: "Bolivia",            flag: "bolivia",   count: 1,   leagues: ["División Profesional"] },
  { id: "cameroon",  label: "Cameroon",           flag: "cameroon",  count: 2,   leagues: ["Elite One", "Elite Two"] },
  { id: "china",     label: "China",              flag: "china",     count: 8,   leagues: ["Super League", "League One"] },
  { id: "colombia",  label: "Colombia",           flag: "colombia",  count: 0,   leagues: ["Primera A", "Copa Colombia"] },
  { id: "czech",     label: "Czech Republic",     flag: "czech",     count: 4,   leagues: ["First League", "FNL"] },
  { id: "denmark",   label: "Denmark",            flag: "denmark",   count: 0,   leagues: ["Superliga", "1st Division"] },
  { id: "engOther",  label: "England",            flag: "eng",       count: 0,   leagues: ["National League", "FA Trophy"] },
  { id: "estonia",   label: "Estonia",            flag: "estonia",   count: 5,   leagues: ["Meistriliiga", "Esiliiga"] },
  { id: "gerOther",  label: "Germany",            flag: "ger",       count: 0,   leagues: ["3. Liga", "Regionalliga"] },
  { id: "iceland",   label: "Iceland",            flag: "iceland",   count: 6,   leagues: ["Besta deild", "1. deild"] },
  { id: "intl",      label: "International",       flag: "international", count: 138, leagues: ["Int. Friendlies", "World Cup Qual."] },
  { id: "poland",    label: "Poland",             flag: "poland",    count: 1,   leagues: ["Ekstraklasa", "I Liga"] },
  { id: "korea",     label: "Republic of Korea",  flag: "korea",     count: 8,   leagues: ["K League 1", "K League 2"] },
  { id: "russia",    label: "Russian Federation", flag: "russia",    count: 3,   leagues: ["Premier League", "First League"] },
  { id: "scotland",  label: "Scotland",           flag: "scotland",  count: 0,   leagues: ["Premiership", "Championship"] },
  { id: "spainOther",label: "Spain",              flag: "esp",       count: 2,   leagues: ["Primera RFEF", "Copa Federación"] },
  { id: "sweden",    label: "Sweden",             flag: "sweden",    count: 7,   leagues: ["Allsvenskan", "Superettan"] },
  { id: "ukraine",   label: "Ukraine",            flag: "ukraine",   count: 1,   leagues: ["Premier League", "Persha Liha"] },
  { id: "uzbekistan",label: "Uzbekistan",         flag: "uzbekistan",count: 2,   leagues: ["Super League", "Pro League"] },
];

const ODDS_MIN = 1.1, ODDS_MAX = 5; // 5 == "5+"

// odds label helper
function oddsLabel(v) { return v >= ODDS_MAX ? "5+" : v.toFixed(1); }

// fake events per sport (betPawa style) — two-way sports omit odds.d
const EVENTS_BY_SPORT = {
  "Football": [
    { id: "f1", time: "11:30AM", day: "Wed 03/06", home: "Capalaba FC Women", away: "Olympic FC Brisbane Women", cat: "Football / Australia / Queensland NPL, Women", tags: ["stat"], odds: { h: 6.03, d: 4.48, a: 1.47 } },
    { id: "f2", time: "11:30AM", day: "Wed 03/06", home: "Myanmar Women", away: "Uzbekistan Women", cat: "Football / International / Int. Friendly Games W", tags: ["2up", "stat"], odds: { h: 2.65, d: 3.42, a: 2.61 } },
    { id: "f3", time: "11:45AM", day: "Wed 03/06", home: "Elizabeth Grove Women", away: "Cove FC Women", cat: "Football / Australia / South Australia State League, Women", tags: ["stat"], odds: { h: 1.93, d: 4.09, a: 3.26 } },
    { id: "f4", time: "10:30PM", day: "Wed 28/05", home: "St George Willawong FC", away: "Olympic FC Brisbane", cat: "Football / Australia / Queensland NPL", tags: ["2up", "boosted", "stat"], odds: { h: 4.35, d: 4.35, a: 4.35 } },
    { id: "f5", time: "12:00PM", day: "Wed 03/06", home: "Carramar Shamrock Rovers Res.", away: "East Perth FC Reserve", cat: "Football / Australia / WA State League 2, Reserves", tags: ["stat"], odds: { h: 9.77, d: 6.45, a: 1.23 } },
  ],
  "Basketball": [
    { id: "b1", time: "LIVE Q3", day: "", live: true, score: "71 - 68", home: "Barangay Ginebra", away: "Tropang Giga", cat: "Basketball / Philippines / PBA, Commissioner Cup", tags: ["stat"], odds: { h: 1.74, a: 2.06 }, flame: ["h"] },
    { id: "b2", time: "LIVE Q2", day: "", live: true, score: "43 - 50", home: "Hapoel Beer Sheva", away: "Maccabi Tel-Aviv", cat: "Basketball / Israel / Super League", tags: ["stat"], odds: { h: 8.00, a: 1.03 }, flame: ["a"] },
    { id: "b3", time: "4:50PM", day: "Wed 03/06", home: "BC Juventus Utena", away: "BC Neptunas Klaipeda", cat: "Basketball / Lithuania / LKL", tags: ["stat"], odds: { h: 1.95, a: 1.70 } },
    { id: "b4", time: "5:00PM", day: "Wed 03/06", home: "Basketball Nymburk", away: "BK Pardubice", cat: "Basketball / Czech Republic / NBL", tags: ["stat"], odds: { h: 1.11, a: 5.00 } },
  ],
  "Tennis": [
    { id: "t1", time: "LIVE Set 2", day: "", live: true, score: "1 - 0", home: "Balaji N S / Demoliner M", away: "Heliovaara H / Patten H", cat: "Tennis / International / French Open Men Doubles", tags: ["stat"], odds: { h: 5.50, a: 1.12 }, flame: ["a"] },
    { id: "t2", time: "11:30AM", day: "Wed 03/06", home: "Kawa, Katarzyna", away: "Joint, Maya", cat: "Tennis / International / WTA 125K Makarska Women Singles", tags: ["stat"], odds: { h: 2.08, a: 1.69 } },
    { id: "t3", time: "11:30AM", day: "Wed 03/06", home: "Mansouri S / Poljak D", away: "Nam J / Niklas-Salminen P", cat: "Tennis / International / ATP Challenger Prostejov Men Doubles", tags: ["stat"], odds: { h: 2.40, a: 1.53 } },
    { id: "t4", time: "11:30AM", day: "Wed 03/06", home: "Granollers M / Zeballos H", away: "Nys H / Roger-Vasselin E", cat: "Tennis / International / French Open Men Doubles", tags: ["stat"], odds: { h: 1.28, a: 3.45 } },
  ],
  "E-Football": [
    { id: "x1", time: "LIVE 67'", day: "", live: true, score: "2 - 1", home: "Manchester City FC (Haidan)", away: "Manchester United FC (Maverick)", cat: "eFootball / International / eAdriatic League", tags: ["stat"], odds: { h: 3.25, d: 7.25, a: 1.42 } },
    { id: "x2", time: "11:30AM", day: "Wed 03/06", home: "FC Bayern Munich (Bruno)", away: "Liverpool FC (Leonardo)", cat: "eFootball / International / eAdriatic League", tags: ["2up", "stat"], odds: { h: 2.02, d: 4.60, a: 2.30 } },
    { id: "x3", time: "11:30AM", day: "Wed 03/06", home: "Paris Saint Germain (Gabriel)", away: "Atletico Madrid (Flash)", cat: "eFootball / International / eAdriatic League", tags: ["stat"], odds: { h: 2.03, d: 4.40, a: 2.30 } },
    { id: "x4", time: "11:30AM", day: "Wed 03/06", home: "Arsenal FC (Eminem)", away: "Real Madrid (Titan)", cat: "eFootball / International / GT Leagues", tags: ["boosted", "stat"], odds: { h: 2.06, d: 4.30, a: 2.30 } },
  ],
};
// sports that have no draw (two-way 1/2 markets)
const TWO_WAY_SPORTS = ["Basketball", "Tennis"];

// derive over/under odds deterministically from base odds
function ouRows(ev) {
  const b = ev.odds.h;
  const mk = (n, dir) => {
    const seed = (b * 10 + n * (dir === "o" ? 3 : 5)) % 4;
    return (1.9 + seed * 0.55 + n * 0.02).toFixed(2);
  };
  return [2.5, 3.5, 4.5, 5.5, 6.5, 7.5].map(n => ({ n, over: mk(n, "o"), under: mk(n, "u") }));
}

// live event-count model — monotonic-ish, recomputed from current selections
function computeCount(sel) {
  let n = 502;
  if (sel.dates.length) {
    const s = sel.dates.reduce((a, id) => a + (DATES.find(d => d.id === id)?.count || 0), 0);
    n = Math.min(n, s);
  }
  if (sel.leagues.length) n = Math.min(n, sel.leagues.length * 8);
  if (sel.countries.length) n = Math.min(n, sel.countries.length * 82);
  // odds narrowing scales remaining pool
  const span = (sel.oddsMax - sel.oddsMin) / (ODDS_MAX - ODDS_MIN);
  if (span < 0.999) n = Math.round(n * (0.45 + 0.55 * span));
  return Math.max(n, 0);
}

// total active filter count (chips) — the default 1X2 market is not counted
function activeCount(sel) {
  const m = sel.markets.filter(id => id !== "1x2").length;
  return m + sel.dates.length + sel.leagues.length + sel.countries.length +
    ((sel.oddsMin > ODDS_MIN || sel.oddsMax < ODDS_MAX) ? 1 : 0);
}

const EMPTY_SEL = { markets: [], dates: [], leagues: [], countries: [], oddsMin: ODDS_MIN, oddsMax: ODDS_MAX };

/* ════════════════════════════════════════════════════════════════
   Real-feeling football fixture pool — tagged with league / country /
   kick-off bucket / odds, so the event list responds to applied filters.
   ════════════════════════════════════════════════════════════════ */
const LEAGUE_TEAMS = {
  pl:     ["Arsenal", "Liverpool", "Manchester City", "Chelsea", "Tottenham Hotspur", "Manchester United", "Newcastle United", "Aston Villa", "Brighton", "West Ham United", "Crystal Palace", "Everton"],
  seriea: ["Inter Milan", "Juventus", "AC Milan", "Napoli", "AS Roma", "Lazio", "Atalanta", "Fiorentina", "Bologna", "Torino"],
  ligue1: ["Paris Saint-Germain", "Marseille", "Monaco", "Lille", "Lyon", "Nice", "Lens", "Rennes", "Strasbourg", "Brest"],
  coupe:  ["Nantes", "Toulouse", "Reims", "Auxerre", "Le Havre", "Metz", "Angers", "Saint-Étienne"],
  bundes: ["Bayern Munich", "Borussia Dortmund", "RB Leipzig", "Bayer Leverkusen", "Stuttgart", "Eintracht Frankfurt", "Wolfsburg", "Freiburg", "Hoffenheim", "Mainz 05"],
  dfb:    ["Hamburger SV", "Schalke 04", "Hertha Berlin", "FC Köln", "Fortuna Düsseldorf", "Kaiserslautern"],
  laliga: ["Real Madrid", "Barcelona", "Atlético Madrid", "Athletic Bilbao", "Real Sociedad", "Real Betis", "Villarreal", "Valencia", "Sevilla", "Getafe"],
  europa: ["Ajax", "AS Roma", "Manchester United", "FC Porto", "Rangers", "Lazio", "Bayer Leverkusen", "Tottenham Hotspur", "Lyon", "Real Sociedad"],
  ucl:    ["Real Madrid", "Manchester City", "Bayern Munich", "Paris Saint-Germain", "Inter Milan", "Barcelona", "Arsenal", "Liverpool", "Borussia Dortmund", "Napoli"],
};
const LEAGUE_COUNTRY = { pl: "england", seriea: "italy", ligue1: "france", coupe: "france", bundes: "germany", dfb: "germany", laliga: "spain", europa: "uclc", ucl: "uclc" };

// league prestige → drives the Popular tab ordering (higher = more popular)
const LEAGUE_POP = { ucl: 92, pl: 88, laliga: 85, europa: 80, seriea: 79, bundes: 77, ligue1: 73, coupe: 54, dfb: 57 };

// teams for the "Other Countries" facet (real-ish clubs / national sides)
const OTHER_TEAMS = {
  argentina:  ["Boca Juniors", "River Plate", "Racing Club", "Independiente", "San Lorenzo", "Estudiantes"],
  russia:     ["Zenit", "Spartak Moscow", "CSKA Moscow", "Lokomotiv Moscow", "Krasnodar", "Dynamo Moscow"],
  korea:      ["Ulsan HD", "Jeonbuk Hyundai", "FC Seoul", "Pohang Steelers", "Suwon Bluewings", "Gangwon"],
  sweden:     ["Malmö FF", "AIK", "Djurgården", "Hammarby", "IFK Göteborg", "BK Häcken"],
  china:      ["Shanghai Port", "Shandong Taishan", "Beijing Guoan", "Shanghai Shenhua", "Chengdu Rongcheng"],
  poland:     ["Legia Warsaw", "Lech Poznań", "Raków Częstochowa", "Pogoń Szczecin"],
  ukraine:    ["Shakhtar Donetsk", "Dynamo Kyiv", "Zorya Luhansk", "Dnipro-1"],
  uzbekistan: ["Pakhtakor", "AGMK", "Nasaf", "Bunyodkor"],
  austria:    ["Red Bull Salzburg", "Rapid Wien", "Austria Wien", "Sturm Graz"],
  czech:      ["Slavia Prague", "Sparta Prague", "Viktoria Plzeň", "Baník Ostrava"],
  estonia:    ["Flora Tallinn", "Levadia", "Paide", "Nõmme Kalju"],
  iceland:    ["Víkingur", "Breiðablik", "KR Reykjavík", "Valur"],
  bolivia:    ["Bolívar", "The Strongest", "Always Ready", "Jorge Wilstermann"],
  cameroon:   ["Coton Sport", "Canon Yaoundé", "Union Douala", "Colombe Sportive"],
  algeria:    ["USM Alger", "CR Belouizdad", "MC Alger", "JS Kabylie"],
  intl:       ["Brazil", "Argentina", "France", "Germany", "Spain", "England", "Portugal", "Netherlands"],
};

const BUCKETS = {
  live:     { day: "LIVE", live: true, times: ["LIVE 23'", "LIVE 67'", "LIVE HT", "LIVE 81'"] },
  today:    { day: "Today", times: ["7:00PM", "8:30PM", "9:00PM", "10:45PM"] },
  tomorrow: { day: "Tomorrow", times: ["4:00PM", "6:30PM", "8:00PM", "9:30PM"] },
  sat:      { day: "Sat 07/06", times: ["1:30PM", "4:00PM", "6:30PM", "7:45PM"] },
  sun:      { day: "Sun 08/06", times: ["2:00PM", "5:30PM", "8:00PM"] },
  mon:      { day: "Mon 09/06", times: ["7:00PM", "9:00PM"] },
  tue:      { day: "Tue 10/06", times: ["8:00PM", "9:45PM"] },
};
const DATE_ORDER = ["live", "today", "tomorrow", "sat", "sun", "mon", "tue"];

function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function genOdds(seed) {
  const r = (n) => ((seed * 9301 + n * 49297) % 233280) / 233280;
  return { h: +(1.3 + r(1) * 3.4).toFixed(2), d: +(3.0 + r(3) * 1.7).toFixed(2), a: +(1.3 + r(2) * 3.4).toFixed(2) };
}
const ALL_COUNTRIES = [...COUNTRIES, ...OTHER_COUNTRIES];

function buildFixtures(groups) {
  const pool = [];
  let idc = 0;
  groups.forEach(({ lid, leagueLabel, cid, teams, n }, gi) => {
    const country = ALL_COUNTRIES.find(c => c.id === cid);
    // distinct unordered pairings (no repeated fixture)
    const pairs = [];
    for (let k = 1; k < teams.length && pairs.length < n; k++) {
      for (let i = 0; i < teams.length && pairs.length < n; i++) {
        const a = i, b = (i + k) % teams.length;
        if (a < b) pairs.push([a, b]);
      }
    }
    pairs.forEach(([hi, ai], i) => {
      const home = teams[hi], away = teams[ai];
      const bucket = DATE_ORDER[(gi + i) % DATE_ORDER.length];
      const b = BUCKETS[bucket];
      const seed = hashStr(lid + home + away);
      const time = b.live ? b.times[seed % b.times.length] : b.times[i % b.times.length];
      const tags = ["stat"];
      if (seed % 3 === 0) tags.push("2up");
      if (seed % 7 === 0) tags.push("boosted");
      pool.push({
        id: "fp" + (idc++),
        league: lid, leagueLabel,
        country: cid, countryLabel: country ? country.label : "",
        flag: country ? country.flag : "ucl",
        dateBucket: bucket, live: !!b.live, time, day: b.live ? "" : b.day,
        score: b.live ? (seed % 3) + " - " + ((seed >> 3) % 3) : null,
        home, away,
        cat: "Football / " + (country ? country.label : "") + " / " + leagueLabel,
        tags, odds: genOdds(seed),
        popularity: (LEAGUE_POP[lid] || 36) + seed % 12,
      });
    });
  });
  return pool;
}

// FIFA World Cup 2026 — marquee national fixtures that headline the Popular tab
const WORLDCUP_2026 = [
  { wc: 1, home: "Brazil", away: "Argentina", flag: "argentina", od: { h: 2.55, d: 3.20, a: 2.80 }, day: "Sat 13/06", time: "9:00PM", tags: ["stat", "boosted"] },
  { wc: 1, home: "France", away: "England", flag: "fra", od: { h: 2.40, d: 3.25, a: 3.00 }, day: "Sat 13/06", time: "6:00PM", tags: ["stat", "boosted"] },
  { wc: 1, home: "Spain", away: "Germany", flag: "esp", od: { h: 2.30, d: 3.30, a: 3.10 }, day: "Sun 14/06", time: "8:00PM", tags: ["stat"] },
  { wc: 1, home: "Portugal", away: "Netherlands", flag: "ucl", od: { h: 2.65, d: 3.20, a: 2.70 }, day: "Sun 14/06", time: "5:00PM", tags: ["stat", "boosted"] },
  { wc: 1, home: "USA", away: "Mexico", flag: "ucl", od: { h: 2.45, d: 3.15, a: 2.95 }, day: "Fri 12/06", time: "11:00PM", tags: ["stat"] },
  { wc: 1, home: "Argentina", away: "Spain", flag: "argentina", od: { h: 2.70, d: 3.25, a: 2.60 }, day: "Mon 15/06", time: "8:00PM", tags: ["stat"] },
].map((m, i) => ({
  id: "wc" + i,
  league: "wc2026", leagueLabel: "FIFA World Cup 2026",
  country: "intl", countryLabel: "International", flag: m.flag,
  dateBucket: ["tomorrow", "sat", "sun", "mon"][i % 4], live: false,
  time: m.time, day: m.day, score: null,
  home: m.home, away: m.away,
  cat: "Football / International / FIFA World Cup 2026",
  tags: m.tags, odds: m.od,
  popularity: 130 - i, // marquee — always lead the Popular tab
}));

const FOOTBALL_POOL = (() => {
  const groups = [];
  Object.keys(LEAGUE_TEAMS).forEach(lid => {
    const lg = LEAGUES.find(l => l.id === lid);
    groups.push({ lid, leagueLabel: lg ? lg.label : lid, cid: LEAGUE_COUNTRY[lid], teams: LEAGUE_TEAMS[lid], n: lg ? lg.count : 6 });
  });
  OTHER_COUNTRIES.forEach(c => {
    const teams = OTHER_TEAMS[c.id];
    if (teams && c.count > 0) {
      groups.push({ lid: c.id, leagueLabel: (c.leagues && c.leagues[0]) || "League", cid: c.id, teams, n: Math.min(c.count, 4) });
    }
  });
  const pool = buildFixtures(groups);
  // merge WC fixtures in, then order by date so Upcoming leads with the soonest.
  // (Popular re-sorts by popularity, so WC still leads there.)
  const all = [...WORLDCUP_2026, ...pool];
  all.sort((a, b) => DATE_ORDER.indexOf(a.dateBucket) - DATE_ORDER.indexOf(b.dateBucket));
  return all;
})();

// odds match: any 1X2 outcome falls within the selected band
function oddsInBand(ev, lo, hi) {
  const cap = hi >= ODDS_MAX ? Infinity : hi;
  return [ev.odds.h, ev.odds.d, ev.odds.a].filter(v => v != null).some(v => v >= lo && v <= cap);
}

// the events to display for a sport given the applied selection
function filterEvents(sport, sel) {
  let pool = sport === "Football" ? FOOTBALL_POOL : (EVENTS_BY_SPORT[sport] || []);
  if (sel.dates.length) pool = pool.filter(e => sel.dates.includes(e.dateBucket || "today"));
  if (sport === "Football" && (sel.leagues.length || sel.countries.length)) {
    pool = pool.filter(e =>
      (sel.leagues.length && sel.leagues.includes(e.league)) ||
      (sel.countries.length && sel.countries.includes(e.country)));
  }
  if (sel.oddsMin > ODDS_MIN || sel.oddsMax < ODDS_MAX) pool = pool.filter(e => oddsInBand(e, sel.oddsMin, sel.oddsMax));
  return pool;
}
function countEvents(sport, sel) { return filterEvents(sport, sel).length; }

Object.assign(window, {
  PIcon, Logo, Flag,
  MARKETS, DATES, LEAGUES, COUNTRIES, OTHER_COUNTRIES, EVENTS_BY_SPORT, TWO_WAY_SPORTS, FOOTBALL_POOL,
  ODDS_MIN, ODDS_MAX, oddsLabel, ouRows, computeCount, activeCount, filterEvents, countEvents, EMPTY_SEL,
});
