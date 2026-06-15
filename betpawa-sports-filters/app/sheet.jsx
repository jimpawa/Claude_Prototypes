/* ════════════════════════════════════════════════════════════════
   sheet.jsx — Filters bottom sheet (draft state, apply/clear)
   ════════════════════════════════════════════════════════════════ */
const { useState: useStateF, useRef: useRefF, useEffect: useEffectF, useCallback: useCallbackF } = React;

function FSection({ title, count, defaultOpen = true, children }) {
  const [open, setOpen] = useStateF(defaultOpen);
  return (
    <div className="fsec">
      <button className="fsec__hd" onClick={() => setOpen((o) => !o)}>
        <span className="t" style={{ fontSize: "16px" }}>{title}</span>
        {count != null && <span className="c">{count}</span>}
        <PIcon name="ChevronDown" size={18} className={"chev" + (open ? " open" : "")} />
      </button>
      {open && <div className="fsec__body">{children}</div>}
    </div>);

}

function Chip({ label, count, on, onClick, showCounts, flag, disabled }) {
  return (
    <button className={"fchip" + (on ? " on" : "")} onClick={onClick} disabled={disabled}>
      {flag && <Flag code={flag} className="flag" />}
      <span>{label}</span>
      {showCounts && count != null && <span className="ct">{count}</span>}
    </button>);

}

function OddsSlider({ min, max, onChange }) {
  const trackRef = useRefF(null);
  const drag = useRefF(null);
  const span = ODDS_MAX - ODDS_MIN;
  const pct = (v) => (v - ODDS_MIN) / span * 100;

  const valFromX = useCallbackF((clientX) => {
    const el = trackRef.current;if (!el) return null;
    const r = el.getBoundingClientRect();
    const pad = 8;
    let t = (clientX - r.left - pad) / (r.width - pad * 2);
    t = Math.max(0, Math.min(1, t));
    let v = ODDS_MIN + t * span;
    v = Math.round(v / 0.1) * 0.1;
    return Math.max(ODDS_MIN, Math.min(ODDS_MAX, v));
  }, [span]);

  useEffectF(() => {
    const move = (e) => {
      if (!drag.current) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const v = valFromX(cx);if (v == null) return;
      if (drag.current === "min") onChange(Math.min(v, max - 0.1), max);else
      onChange(min, Math.max(v, min + 0.1));
    };
    const up = () => {drag.current = null;};
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {window.removeEventListener("pointermove", move);window.removeEventListener("pointerup", up);};
  }, [min, max, onChange, valFromX]);

  return (
    <div className="odds">
      <div className="odds__track" ref={trackRef}>
        <div className="odds__rail"></div>
        <div className="odds__fill" style={{ left: `calc(8px + (100% - 16px) * ${pct(min) / 100})`, width: `calc((100% - 16px) * ${(pct(max) - pct(min)) / 100})` }}></div>
        <div className="odds__handle" style={{ left: `calc(8px + (100% - 16px) * ${pct(min) / 100})`, top: "50%", marginTop: -11 }}
        onPointerDown={(e) => {drag.current = "min";e.currentTarget.setPointerCapture(e.pointerId);}} role="slider" aria-label="Minimum odds" aria-valuenow={min}></div>
        <div className="odds__handle" style={{ left: `calc(8px + (100% - 16px) * ${pct(max) / 100})`, top: "50%", marginTop: -11 }}
        onPointerDown={(e) => {drag.current = "max";e.currentTarget.setPointerCapture(e.pointerId);}} role="slider" aria-label="Maximum odds" aria-valuenow={max}></div>
      </div>
      <div className="odds__scale">
        <span>1.1</span><span>2.0</span><span>3.0</span><span>4.0</span><span>5+</span>
      </div>
    </div>);

}

function CountryRow({ c, selected, onToggle, showCounts }) {
  const [open, setOpen] = useStateF(false);
  return (
    <div>
      <div className={"frow" + (selected.has(c.id) ? " on" : "")}>
        <FlagCircle code={c.flag} size={24} />
        <span className="nm" onClick={() => onToggle(c.id)}>{c.label}</span>
        {showCounts && <span className="ct">{c.count}</span>}
        <span className="exp" onClick={() => setOpen((o) => !o)}><PIcon name="ChevronDown" size={16} className={open ? "open" : ""} /></span>
      </div>
      {open &&
      <div className="subleagues">
          {c.leagues.map((l) => {
          const k = c.id + ":" + l;
          return (
            <div key={l} className={"subrow" + (selected.has(k) ? " on" : "")} onClick={() => onToggle(k)}>
                <span className="nm">{l}</span>
                <span className="chk"><PIcon name="Check" size={12} /></span>
              </div>);

        })}
        </div>
      }
    </div>);

}

const seedDraft = (s) => s.markets.length ? s : { ...s, markets: ["1x2"] };

const FILTER_TABS = [
{ id: "leagues", label: "Leagues" },
{ id: "markets", label: "Markets" },
{ id: "kickoff", label: "Kick Off" }];


function FiltersSheet({ open, sport, initial, onApply, onClose, showCounts, layout = "sections", onLayoutChange }) {
  const [draft, setDraft] = useStateF(() => seedDraft(initial));
  const [tab, setTab] = useStateF("leagues");
  // re-seed draft whenever the sheet is (re)opened
  useEffectF(() => {if (open) {setDraft(seedDraft(initial));setTab("leagues");}}, [open]);

  const toggle = (key, id) => setDraft((d) => {
    const arr = d[key];
    return { ...d, [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
  });
  const toggleCountry = (id) => setDraft((d) => {
    const arr = d.countries;
    return { ...d, countries: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
  });

  // Markets: the default 1X2 is always on; users may add up to 3 markets total
  const MAX_MARKETS = 3;
  const toggleMarket = (id) => setDraft((d) => {
    const on = d.markets.includes(id);
    if (on) return { ...d, markets: d.markets.filter((x) => x !== id) };
    if (d.markets.length >= MAX_MARKETS) return d; // cap reached
    return { ...d, markets: [...d.markets, id] };
  });

  const count = countEvents(sport, draft);
  const active = activeCount(draft);
  const countrySet = new Set(draft.countries);

  // ── shared filter bodies (reused by both layouts) ──
  const marketsAtCap = draft.markets.length >= MAX_MARKETS;
  const marketsBody =
  <div>
      <div className="fnote">
        <PIcon name="CirlceInfo" size={14} />
        <span>Add up to <b>{MAX_MARKETS} markets</b> · {draft.markets.length}/{MAX_MARKETS} selected</span>
      </div>
      <div className="fchips">
        {MARKETS.map((m) => {
        const on = draft.markets.includes(m.id);
        return <Chip key={m.id} label={m.label} on={on} disabled={!on && marketsAtCap} onClick={() => toggleMarket(m.id)} />;
      })}
      </div>
    </div>;

  const datesBody =
  <div className="fchips">
      {DATES.map((d) =>
    <Chip key={d.id} label={d.label} count={d.count} showCounts={showCounts} disabled={d.count === 0}
    on={draft.dates.includes(d.id)} onClick={() => toggle("dates", d.id)} />
    )}
    </div>;

  const oddsBody =
  <OddsSlider min={draft.oddsMin} max={draft.oddsMax}
  onChange={(lo, hi) => setDraft((d) => ({ ...d, oddsMin: lo, oddsMax: hi }))} />;

  const leaguesChips =
  <div className="fchips">
      {LEAGUES.map((l) =>
    <Chip key={l.id} label={l.label} count={l.count} showCounts={showCounts} flag={l.flag}
    on={draft.leagues.includes(l.id)} onClick={() => toggle("leagues", l.id)} />
    )}
    </div>;

  const popularCountriesBody =
  <div style={{ display: "flex", flexDirection: "column" }}>
      {COUNTRIES.map((c) =>
    <CountryRow key={c.id} c={c} selected={countrySet} onToggle={toggleCountry} showCounts={showCounts} />
    )}
    </div>;

  const otherCountriesBody =
  <div style={{ display: "flex", flexDirection: "column" }}>
      {OTHER_COUNTRIES.map((c) =>
    <CountryRow key={c.id} c={c} selected={countrySet} onToggle={toggleCountry} showCounts={showCounts} />
    )}
    </div>;


  const oddsTitle = `Odds : ${oddsLabel(draft.oddsMin)} - ${oddsLabel(draft.oddsMax)}`;

  // count of selections per tab (drives the small tab badges)
  const tabCounts = {
    leagues: draft.leagues.length + draft.countries.length,
    markets: draft.markets.filter((id) => id !== "1x2").length,
    kickoff: draft.dates.length
  };

  return (
    <>
      <div className={"backdrop" + (open ? " show" : "")} onClick={onClose}></div>
      <div className={"sheet" + (open ? " show" : "")} role="dialog" aria-label="Filters">
        <div className="sheet__grab"></div>
        <div className="sheet__hd">
          <PIcon name="Sliders" size={24} className="ic" />
          <span className="ttl">Filters</span>
          {active > 0 && <span className="cnt">{active}</span>}
          <button className="close" onClick={onClose} aria-label="Close"><PIcon name="X" size={16} /></button>
        </div>

        {layout === "tabs" ?
        <>
            {/* Odds range — separate filter pinned above the tabs */}
            <div className="ftabs-odds">
              <div className="ftabs-odds__lbl">{oddsTitle}</div>
              {oddsBody}
            </div>

            {/* Tabs */}
            <div className="ftabs" role="tablist">
              {FILTER_TABS.map((tb) =>
            <button key={tb.id} role="tab" aria-selected={tab === tb.id}
            className={"ftab" + (tab === tb.id ? " on" : "")} onClick={() => setTab(tb.id)}>
                  {tb.label}
                  {tabCounts[tb.id] > 0 && <span className="ftab__c">{tabCounts[tb.id]}</span>}
                </button>
            )}
            </div>

            <div className="sheet__body sheet__body--tabbed">
              {tab === "markets" && <div className="ftabpanel">{marketsBody}</div>}
              {tab === "kickoff" && <div className="ftabpanel">{datesBody}</div>}
              {tab === "leagues" &&
            <div className="ftabpanel">
                  <div className="fgrouplab">Popular Leagues</div>
                  {leaguesChips}
                  <div className="fgrouplab">Popular Countries</div>
                  {popularCountriesBody}
                  <FSection title="Other Countries" defaultOpen={false}>{otherCountriesBody}</FSection>
                </div>
            }
              <div style={{ height: 8 }}></div>
            </div>
          </> :

        <div className="sheet__body">
            <FSection title={oddsTitle}>{oddsBody}</FSection>

            <FSection title="Markets">{marketsBody}</FSection>

            <FSection title="Leagues" defaultOpen={false}>
              <div className="lg-group">
                <div className="fgrouplab">Popular Leagues</div>
                {leaguesChips}
              </div>
              <div className="lg-group">
                <div className="fgrouplab">Popular Countries</div>
                {popularCountriesBody}
              </div>
              <div className="lg-group lg-group--other">
                <FSection title="Other Countries" defaultOpen={false}>{otherCountriesBody}</FSection>
              </div>
            </FSection>

            <FSection title="Kick - Off" defaultOpen={false} count={draft.dates.length ? null : countEvents(sport, EMPTY_SEL)}>{datesBody}</FSection>

            <div style={{ height: 8 }}></div>
          </div>
        }

        <div className="sheet__ft">
          {active > 0 &&
          <button className="fbtn fbtn--clear" onClick={() => onApply(EMPTY_SEL)}>Clear All</button>
          }
          <button className="fbtn fbtn--primary" onClick={() => onApply(draft)}>
            Show {count} Events
          </button>
        </div>
      </div>
    </>);

}

Object.assign(window, { FiltersSheet });