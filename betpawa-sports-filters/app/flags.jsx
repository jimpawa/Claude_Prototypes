/* ════════════════════════════════════════════════════════════════
   flags.jsx — circular country flags (simplified, recognisable)
   Renders a round flag chip from a compact per-country spec.
   ════════════════════════════════════════════════════════════════ */
function starPath(cx, cy, R, rot) {
  const r = R * 0.382; let d = "";
  for (let i = 0; i < 10; i++) {
    const ang = ((rot || -90) + i * 36) * Math.PI / 180;
    const rad = i % 2 === 0 ? R : r;
    const x = cx + rad * Math.cos(ang), y = cy + rad * Math.sin(ang);
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
  }
  return d + "Z";
}

// spec keys: h [colors] horizontal bands · v [colors] vertical bands ·
// solid · cross{field,cross,inner?} nordic · saltire{field,cross} ·
// tri color · dot color · star color · taeguk · globe
const FLAG_SPECS = {
  // popular set (also used by rectangular list elsewhere)
  eng:   { cross: { field: "#ffffff", cross: "#CE1124" } },
  ita:   { v: ["#008C45", "#ffffff", "#CD212A"] },
  ger:   { h: ["#000000", "#DD0000", "#FFCE00"] },
  esp:   { h: ["#AA151B", "#F1BF00", "#F1BF00", "#AA151B"] },
  fra:   { v: ["#002654", "#ffffff", "#ED2939"] },
  ucl:   { solid: "#0B1B3F", star: "#ffffff" },
  benin: { v: ["#008751", "#FCD116", "#E8112D"] },
  // other countries
  algeria:  { v: ["#006233", "#ffffff"], dot: "#D21034" },
  argentina:{ h: ["#74ACDF", "#ffffff", "#74ACDF"], dot: "#F6B40E" },
  austria:  { h: ["#ED2939", "#ffffff", "#ED2939"] },
  bolivia:  { h: ["#D52B1E", "#F9E300", "#007934"] },
  cameroon: { v: ["#007A5E", "#CE1126", "#FCD116"], star: "#FCD116" },
  china:    { solid: "#DE2910", star: "#FFDE00" },
  colombia: { h: ["#FCD116", "#FCD116", "#003893", "#CE1126"] },
  czech:    { h: ["#ffffff", "#D7141A"], tri: "#11457E" },
  denmark:  { cross: { field: "#C8102E", cross: "#ffffff" } },
  estonia:  { h: ["#0072CE", "#000000", "#ffffff"] },
  iceland:  { cross: { field: "#02529C", cross: "#ffffff", inner: "#DC1E35" } },
  international: { globe: true },
  poland:   { h: ["#ffffff", "#DC143C"] },
  korea:    { solid: "#ffffff", taeguk: true },
  russia:   { h: ["#ffffff", "#0039A6", "#D52B1E"] },
  scotland: { saltire: { field: "#0065BF", cross: "#ffffff" } },
  sweden:   { cross: { field: "#006AA7", cross: "#FECC00" } },
  ukraine:  { h: ["#0057B7", "#FFDD00"] },
  uzbekistan:{ h: ["#0099B5", "#ffffff", "#1EB53A"] },
};

function flagEls(spec) {
  const e = [];
  if (spec.solid) e.push(<rect key="f" width="24" height="24" fill={spec.solid} />);
  if (spec.h) { const n = spec.h.length; spec.h.forEach((c, i) => e.push(<rect key={"h" + i} x="0" y={i * 24 / n} width="24" height={24 / n + 0.5} fill={c} />)); }
  if (spec.v) { const n = spec.v.length; spec.v.forEach((c, i) => e.push(<rect key={"v" + i} x={i * 24 / n} y="0" width={24 / n + 0.5} height="24" fill={c} />)); }
  if (spec.cross) {
    e.push(<rect key="cf" width="24" height="24" fill={spec.cross.field} />);
    if (spec.cross.inner) {
      e.push(<rect key="cv" x="6" width="6" height="24" fill={spec.cross.cross} />);
      e.push(<rect key="ch" y="9" width="24" height="6" fill={spec.cross.cross} />);
      e.push(<rect key="cv2" x="7.5" width="3" height="24" fill={spec.cross.inner} />);
      e.push(<rect key="ch2" y="10.5" width="24" height="3" fill={spec.cross.inner} />);
    } else {
      e.push(<rect key="cv" x="6.5" width="4" height="24" fill={spec.cross.cross} />);
      e.push(<rect key="ch" y="10" width="24" height="4" fill={spec.cross.cross} />);
    }
  }
  if (spec.saltire) {
    e.push(<rect key="sf" width="24" height="24" fill={spec.saltire.field} />);
    e.push(<path key="s1" d="M-2 -2 L26 26" stroke={spec.saltire.cross} strokeWidth="4" />);
    e.push(<path key="s2" d="M26 -2 L-2 26" stroke={spec.saltire.cross} strokeWidth="4" />);
  }
  if (spec.tri) e.push(<path key="tri" d="M0 0 L13 12 L0 24 Z" fill={spec.tri} />);
  if (spec.dot) e.push(<circle key="dot" cx="12" cy="12" r="4" fill={spec.dot} />);
  if (spec.star) e.push(<path key="star" d={starPath(12, 12, 5)} fill={spec.star} />);
  if (spec.taeguk) {
    e.push(<circle key="tg" cx="12" cy="12" r="6" fill="#ffffff" />);
    e.push(<path key="tgr" d="M6 12 A6 6 0 0 1 18 12 Z" fill="#CD2E3A" />);
    e.push(<path key="tgb" d="M6 12 A6 6 0 0 0 18 12 Z" fill="#0047A0" />);
  }
  if (spec.globe) {
    e.push(<rect key="gf" width="24" height="24" fill="#1CA4BA" />);
    e.push(<circle key="g0" cx="12" cy="12" r="9" fill="#2BA84A" />);
    e.push(<circle key="g1" cx="8.5" cy="9" r="3.2" fill="#1f8a3b" />);
    e.push(<circle key="g2" cx="14" cy="15" r="3.6" fill="#1f8a3b" />);
  }
  return e;
}

function FlagCircle({ code, size }) {
  const sz = size || 24;
  const spec = FLAG_SPECS[code] || { h: ["#7A8185", "#AAAEB0"] };
  return (
    <span className="flag-circle" style={{ width: sz, height: sz }}>
      <svg viewBox="0 0 24 24" width={sz} height={sz} aria-hidden="true">{flagEls(spec)}</svg>
    </span>
  );
}

Object.assign(window, { FlagCircle });
