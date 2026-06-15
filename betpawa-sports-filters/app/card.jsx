/* ════════════════════════════════════════════════════════════════
   card.jsx — event card + per-market renderers
   Bet buttons emit full selection objects to the betslip.
   ════════════════════════════════════════════════════════════════ */
const { useState: useStateC } = React;

// resolve outcome code → human pick (team name for 1X2)
function resolvePick(ev, outcome) {
  if (outcome === "1") return ev.home;
  if (outcome === "2") return ev.away;
  if (outcome === "X") return "Draw";
  return outcome;
}
// betslip market line, e.g. "1X2 | Full Time (1)"
function selLine(marketId, outcome) {
  if (marketId.indexOf("1x2") === 0 && (outcome === "1" || outcome === "X" || outcome === "2"))
    return "1X2 | Full Time (" + outcome + ")";
  if (marketId === "tg" || marketId === "tg-fh") return "Over/Under | Full Time (" + outcome + ")";
  const nm = (MKT_META[marketId] || {}).label || marketId;
  return nm + " (" + outcome + ")";
}
function buildSel(ev, marketId, outcome, oddsNum) {
  return {
    id: ev.id + ":" + marketId + ":" + outcome,
    matchId: ev.id, home: ev.home, away: ev.away,
    league: ev.leagueLabel || ((ev.cat || "").split(" / ").pop()) || "",
    market: marketId, marketName: (MKT_META[marketId] || {}).label || marketId,
    outcome, pick: resolvePick(ev, outcome), line: selLine(marketId, outcome),
    odds: oddsNum, live: !!ev.live, score: ev.live ? (ev.score || "0 - 0") : null,
  };
}

function Bet({ label, odds, selObj, dir, flame, picks, onPick }) {
  const on = picks.has(selObj.id);
  return (
    <button className={"bet" + (on ? " on" : "") + (dir ? " bet--" + dir : "")} onClick={() => onPick(selObj)}>
      <span className="bet__sel">{label}</span>
      <span className="bet__odds">
        {flame && <PIcon name="FlameFilled" size={13} style={{ color: "var(--orange)" }} />}
        {dir === "up" && <PIcon name="TrendingUp" size={13} />}
        {dir === "down" && <PIcon name="TrendingUp" size={13} style={{ transform: "scaleY(-1)" }} />}
        {odds}
      </span>
    </button>
  );
}

function Moneyline({ ev, mkt, picks, onPick, twoWay, labels }) {
  const o = ev.odds;
  const cells = (twoWay
    ? [{ l: labels?.[0] || "1", v: o.h }, { l: labels?.[1] || "2", v: o.a }]
    : [{ l: labels?.[0] || "1", v: o.h, key: "h" }, { l: labels?.[1] || "X", v: o.d, key: "d" }, { l: labels?.[2] || "2", v: o.a, key: "a" }]
  ).filter(c => c.v != null);
  return (
    <div className="betline">
      {cells.map(c => (
        <Bet key={c.l} label={c.l} odds={c.v.toFixed(2)} selObj={buildSel(ev, mkt, c.l, c.v)}
             flame={ev.flame && c.key && ev.flame.includes(c.key)} picks={picks} onPick={onPick} />
      ))}
      <button className="bet bet--more" aria-label="More markets"><PIcon name="ChevronRight" size={15} /></button>
    </div>
  );
}

function TotalGoals({ ev, mkt, picks, onPick }) {
  const [open, setOpen] = useStateC(false);
  const rows = ouRows(ev);
  const shown = open ? rows : rows.slice(0, 4);
  const cell = (ev2, code, oddStr) => {
    const s = buildSel(ev2, mkt, code, parseFloat(oddStr));
    return (
      <div className={"oucell" + (picks.has(s.id) ? " on" : "")} onClick={() => onPick(s)}>
        <span className="lab">{code}</span><span className="od">{oddStr}</span>
      </div>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div className="ougrid">
        {shown.map(r => (
          <React.Fragment key={r.n}>
            {cell(ev, "Over " + r.n, r.over)}
            {cell(ev, "Under " + r.n, r.under)}
          </React.Fragment>
        ))}
      </div>
      <button className="ouexpand" onClick={() => setOpen(o => !o)} aria-label="Toggle more lines">
        <PIcon name="ChevronDown" size={15} className={open ? "open" : ""} />
      </button>
    </div>
  );
}

function TwoWay({ ev, mkt, picks, onPick, labels }) {
  const o = ev.odds;
  const ls = labels || ["GG", "NG"];
  const vals = [+(o.h * 0.85).toFixed(2), +(o.a * 0.9).toFixed(2)];
  return (
    <div className="betline">
      {ls.map((l, i) => (
        <Bet key={l} label={l} odds={vals[i].toFixed(2)} selObj={buildSel(ev, mkt, l, vals[i])} picks={picks} onPick={onPick} />
      ))}
    </div>
  );
}

function ouHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

// "1X2 and Over/Under" — 3 columns (1 / X / 2) × Over/Under lines
function OneX2OverUnder({ ev, mkt, picks, onPick }) {
  const [open, setOpen] = useStateC(false);
  const cols = ["1", "X", "2"];
  const allLines = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5];
  const lines = open ? allLines : allLines.slice(0, 4);
  const rows = [];
  lines.forEach((n) => { rows.push({ n, dir: "o" }); rows.push({ n, dir: "u" }); });
  const odd = (n, dir, ci) => {
    const r = (ouHash(ev.id + mkt + n + dir + ci) % 1000) / 1000;
    const v = ci === 0 ? 1.12 + r * 7.6 + (dir === "u" ? 0.4 : 0) : 8 + r * 90;
    return v.toFixed(2);
  };
  return (
    <div className="oux">
      <div className="oux__hd">{cols.map((c) => <span key={c}>{c}</span>)}</div>
      <div className="oux__grid">
        {rows.map(({ n, dir }) => cols.map((c, ci) => {
          const label = (dir === "o" ? "Over" : "Under") + " " + n;
          const od = odd(n, dir, ci);
          const sel = buildSel(ev, mkt, label + " · " + c, parseFloat(od));
          const flame = n === 1.5 && dir === "o" && ci === 0;
          return (
            <div key={n + dir + c} className={"oux__cell" + (picks.has(sel.id) ? " on" : "")} onClick={() => onPick(sel)}>
              <span className="lab">{label}</span>
              <span className="od">{flame && <PIcon name="FlameFilled" size={13} style={{ color: "var(--orange)" }} />}{od}</span>
            </div>
          );
        }))}
      </div>
      <button className="ouexpand" onClick={() => setOpen((o) => !o)} aria-label="Toggle more lines">
        <PIcon name="ChevronDown" size={15} className={open ? "open" : ""} />
      </button>
    </div>
  );
}

// "Double Chance and Both Teams To Score" — Yes / No columns × 1X / 12 / X2
function DoubleChanceBTTS({ ev, mkt, picks, onPick }) {
  const groups = ["Yes", "No"];
  const rowsL = ["1X", "12", "X2"];
  const odd = (g, row) => {
    const r = (ouHash(ev.id + mkt + g + row) % 1000) / 1000;
    return (1.4 + r * 9.6).toFixed(2);
  };
  return (
    <div className="dcb">
      <div className="dcb__hd"><span>Yes</span><span>No</span></div>
      <div className="dcb__grid">
        {rowsL.map((row) => groups.map((g) => {
          const od = odd(g, row);
          const sel = buildSel(ev, mkt, row + " · " + g, parseFloat(od));
          return (
            <button key={g + row} className={"dcb__cell" + (picks.has(sel.id) ? " on" : "")} onClick={() => onPick(sel)}>
              <span className="lab">{row}</span>
              <span className="od">{od}</span>
            </button>
          );
        }))}
      </div>
      <button className="ouexpand" aria-label="More"><PIcon name="ChevronDown" size={15} /></button>
    </div>
  );
}

const MKT_META = {
  "1x2": { label: "1X2", info: true },
  "1x2-1up": { label: "1X2 | 1UP", up: 1 },
  "1x2-2up": { label: "1X2 | 2UP", up: 2 },
  "tg": { label: "Total Goals", info: true },
  "1x2-fh": { label: "1X2 First Half" },
  "tg-fh": { label: "Total Goals First Half" },
  "dc": { label: "Double Chance" },
  "btts": { label: "Both Teams to Score" },
  "1x2-ou": { label: "1X2 and Over/Under" },
  "hwmg": { label: "Half With More Goals" },
  "dc-btts": { label: "Double Chance & BTTS" },
  "1x2-int": { label: "1X2 — Interval 10 min" },
};

function MarketBlock({ ev, mkt, picks, onPick, twoWay, showTitles }) {
  const meta = MKT_META[mkt] || { label: mkt };
  let body;
  switch (mkt) {
    case "tg": case "tg-fh": body = <TotalGoals ev={ev} mkt={mkt} picks={picks} onPick={onPick} />; break;
    case "1x2-ou": body = <OneX2OverUnder ev={ev} mkt={mkt} picks={picks} onPick={onPick} />; break;
    case "dc-btts": body = <DoubleChanceBTTS ev={ev} mkt={mkt} picks={picks} onPick={onPick} />; break;
    case "dc": body = <Moneyline ev={ev} mkt={mkt} picks={picks} onPick={onPick} labels={["1X", "12", "X2"]} />; break;
    case "btts": body = <TwoWay ev={ev} mkt={mkt} picks={picks} onPick={onPick} labels={["GG", "NG"]} />; break;
    case "hwmg": body = <Moneyline ev={ev} mkt={mkt} picks={picks} onPick={onPick} labels={["1st", "Equal", "2nd"]} />; break;
    default: body = <Moneyline ev={ev} mkt={mkt} picks={picks} onPick={onPick} twoWay={twoWay} />;
  }
  const hideHeader = (twoWay && mkt === "1x2") || !showTitles;
  return (
    <div className="mkt">
      {!hideHeader && (
        <div className="mkt__hd">
          <span>{meta.label}</span>
          {meta.info && <PIcon name="CirlceInfo" size={14} />}
          {meta.up === 2 && <span className="tag"><PIcon name="Color2Up" size={15} /></span>}
          {meta.up === 1 && <span className="tag"><PIcon name="C1Up" size={15} /></span>}
        </div>
      )}
      {body}
    </div>
  );
}

function EventCard({ ev, markets, picks, onPick, twoWay, showTitles }) {
  return (
    <article className="card">
      <div className="card__top">
        <div className="card__when">
          {ev.live && <span className="card__livedot"></span>}
          <span className={"card__time" + (ev.live ? " card__time--live" : "")}>{ev.time}</span>
          {ev.day && <span className="card__day">{ev.day}</span>}
        </div>
        <div className="card__tags">
        </div>
      </div>
      <div className="card__teams">
        <div className="card__team-row">
          <span className="card__team">{ev.home}</span>
          {ev.live && ev.score && <span className="card__score">{ev.score.split("-")[0].trim()}</span>}
        </div>
        <div className="card__team-row">
          <span className="card__team">{ev.away}</span>
          {ev.live && ev.score && <span className="card__score">{ev.score.split("-")[1].trim()}</span>}
        </div>
      </div>
      <div className="card__cat">{ev.cat}</div>
      {markets.map(m => <MarketBlock key={m} ev={ev} mkt={m} picks={picks} onPick={onPick} twoWay={twoWay} showTitles={showTitles} />)}
    </article>
  );
}

Object.assign(window, { EventCard });
