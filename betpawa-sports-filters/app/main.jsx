/* ════════════════════════════════════════════════════════════════
   main.jsx — App shell, state, applied-filters bar, mount
   ════════════════════════════════════════════════════════════════ */
const { useState, useMemo, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#9CE800",
  "sheetHeight": 92,
  "sportChipRadius": 30,
  "showCounts": true,
  "navMode": "standard",
  "sheetLayout": "sections"
} /*EDITMODE-END*/;

// build the ordered list of market ids to render in cards
function displayMarkets(appliedMarkets, toggle) {
  const set = new Set(appliedMarkets.length ? appliedMarkets : ["1x2"]);
  if (toggle) {set.add("1x2");set.add("1x2-2up");set.add("1x2-1up");}
  return MARKETS.map((m) => m.id).filter((id) => set.has(id));
}

// compact pill dropdown used by the Minimal nav layout
function NavDropdown({ icon, value, options, onChange, ariaLabel, align }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const cur = options.find((o) => o.id === value) || options[0];
  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos(align === "right" ?
      { top: r.bottom + 6, right: window.innerWidth - r.right } :
      { top: r.bottom + 6, left: r.left });
    }
    setOpen((o) => !o);
  };
  return (
    <div className="navdrop">
      <button ref={btnRef} className="navdrop__btn" onClick={toggle} aria-label={ariaLabel} aria-expanded={open}>
        {cur.icon && <PIcon name={cur.icon} size={17} />}
        <span className="navdrop__cur">{cur.label}</span>
        <PIcon name="ChevronDown" size={15} className={"navdrop__chev" + (open ? " open" : "")} />
      </button>
      {open &&
      <>
          <div className="navdrop__scrim" onClick={() => setOpen(false)}></div>
          <div className="navdrop__menu" style={pos}>
            {options.map((o) =>
          <button key={o.id} className={"navdrop__opt" + (o.id === value ? " on" : "")}
          onClick={() => {onChange(o.id);setOpen(false);}}>
                {o.icon && <PIcon name={o.icon} size={18} />}
                <span>{o.label}</span>
                {o.id === value && <PIcon name="Check" size={16} className="navdrop__tick" />}
              </button>
          )}
          </div>
        </>
      }
    </div>);

}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [sport, setSport] = useState("Football");
  const [filterTab, setFilterTab] = useState("Upcoming");
  const [sheetOpen, setSheetOpen] = useState(false);
  // two independent axes: navMode (top-nav density) + sheetLayout (filter-sheet organisation)
  const [navMode, setNavMode] = useState(TWEAK_DEFAULTS.navMode);
  const [sheetLayout, setSheetLayout] = useState(TWEAK_DEFAULTS.sheetLayout);
  const navMinimal = navMode === "minimal";
  // Minimal is a navigation proposal that reuses the Sections sheet
  const effectiveSheet = navMinimal ? "sections" : sheetLayout;
  const [helpOpen, setHelpOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [applied, setApplied] = useState(EMPTY_SEL);
  const [twoUp, setTwoUp] = useState(false);

  // ── betslip state ──
  const [selections, setSelections] = useState([]);
  const [betslipOpen, setBetslipOpen] = useState(false);
  const [stake, setStake] = useState("500.00");
  const [acceptOdds, setAcceptOdds] = useState(true);
  const [placedView, setPlacedView] = useState(false);
  const [betId, setBetId] = useState("");
  const [barCollapsed, setBarCollapsed] = useState(false);

  const active = activeCount(applied);
  const hasFilters = active > 0;
  const markets = useMemo(() => displayMarkets(applied.markets, twoUp), [applied.markets, twoUp]);
  const twoWay = TWO_WAY_SPORTS.includes(sport);
  const events = useMemo(() => {
    const list = filterEvents(sport, applied);
    // View tab gates by event state: Live → live only; Upcoming/Popular → pre-match only
    if (filterTab === "Live") return list.filter((e) => e.live);
    const pre = list.filter((e) => !e.live);
    // Popular → rank by popularity (World Cup 2026 leads), stable copy
    if (filterTab === "Popular") return [...pre].sort((a, b) => (b.popularity || 50) - (a.popularity || 50));
    return pre;
  }, [sport, applied, filterTab]);

  const pickIds = useMemo(() => new Set(selections.map((s) => s.id)), [selections]);

  // one pick per EVENT (match): selecting any outcome from a match replaces its
  // existing pick; clicking the same outcome again removes it.
  const togglePick = useCallback((sel) => {
    setSelections((prev) => {
      const same = prev.find((s) => s.matchId === sel.matchId);
      if (same) {
        if (same.id === sel.id) return prev.filter((s) => s.id !== sel.id);
        return prev.map((s) => s === same ? sel : s);
      }
      return [...prev, sel];
    });
    setPlacedView(false);
  }, []);

  const removeSel = useCallback((id) => setSelections((prev) => prev.filter((s) => s.id !== id)), []);
  const clearSlip = useCallback(() => {setSelections([]);setPlacedView(false);}, []);
  const openBetslip = useCallback(() => setBetslipOpen(true), []);
  const placeBet = useCallback(() => {
    const rnd = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    setBetId(rnd() + "-" + rnd() + "-" + rnd().slice(0, 2));
    setPlacedView(true);
  }, []);
  const placeAnother = useCallback(() => {setSelections([]);setPlacedView(false);}, []);

  // changing sport or view tab resets the advanced filters
  const changeSport = useCallback((id) => {setSport(id);setApplied(EMPTY_SEL);}, []);
  const changeTab = useCallback((id) => {setFilterTab(id);setApplied(EMPTY_SEL);}, []);

  // minimize-on-scroll: collapse when scrolling down; re-expand on scroll-up,
  // at the top, OR after scrolling stops (short idle delay)
  const lastY = useRef(0);
  const idleTimer = useRef(null);
  const onScroll = useCallback((e) => {
    const y = e.target.scrollTop;
    const prev = lastY.current;
    if (y <= 6) setBarCollapsed(false);else
    if (y > prev + 4) setBarCollapsed(true);else
    if (y < prev - 4) setBarCollapsed(false);
    lastY.current = y;
    // re-open shortly after scrolling settles
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setBarCollapsed(false), 900);
  }, []);

  const phoneStyle = {
    "--accent": t.accent,
    "--accent-2": t.accent,
    "--sheet-h": t.sheetHeight + "%",
    "--chip-pill": t.sportChipRadius + "px"
  };

  const SPORTS = [
  { id: "Football", icon: "FootballBall" },
  { id: "Basketball", icon: "Basketball" },
  { id: "Tennis", icon: "TennisBall" },
  { id: "E-Football", icon: "EFootballBall" }];

  const sportIcon = (SPORTS.find((s) => s.id === sport) || SPORTS[0]).icon;
  const TABS = [
  { id: "Upcoming", icon: "Stopwatch" },
  { id: "Popular", icon: "Flame" },
  { id: "Live", icon: "Activity" }];


  return (
    <>
    <div className="phone" style={phoneStyle}>
      {/* Header */}
      <div className="hdr">
        <span className="logo"><Logo /></span>
        <div className="hdr__right">
          <button className="ico-btn" aria-label="Search"><PIcon name="Search" size={22} /></button>
          <div className="hdr__dep">
            <PIcon name="Eye" size={17} className="eye" />
            <span className="bal"><span className="cur">₦</span> 882.10</span>
            <PIcon name="ChevronDown" size={15} className="chev" />
            <button className="plus" aria-label="Deposit"><PIcon name="Plus" size={18} /></button>
          </div>
          <button className="acct" aria-label="Account" onClick={() => setAcctOpen(true)}><PIcon name="Account" size={22} /></button>
        </div>
      </div>

      {/* Top menu — sport chips (primary; all filters depend on the selected sport) */}
      {navMinimal ?
        <div className="topnav topnav--min">
          <button className="home" aria-label="Home">
            <PIcon name="Home" size={18} />
          </button>
          <NavDropdown ariaLabel="Sport" value={sport}
          options={SPORTS.map((s) => ({ id: s.id, label: s.id, icon: s.icon }))}
          onChange={changeSport} />
          <NavDropdown ariaLabel="View" value={filterTab}
          options={TABS.map((tb) => ({ id: tb.id, label: tb.id, icon: tb.icon }))}
          onChange={changeTab} />
          <button className="filt filt--min" onClick={() => setSheetOpen(true)} aria-label="Filters">
            <PIcon name="Sliders" size={18} />
            {hasFilters && <span className="dot">{active}</span>}
          </button>
        </div> :

        <div className="topnav topnav--chips">
          <button className="home" aria-label="Home">
            <PIcon name="Home" size={18} />
          </button>
          <span className="topnav__div"></span>
          <div className="chips">
            {SPORTS.map((s) =>
            <button key={s.id} className={"schip" + (s.id === sport ? " on" : "")} onClick={() => changeSport(s.id)}>
                <PIcon name={s.icon} size={17} />{s.id}
              </button>
            )}
          </div>
        </div>
        }

      {/* Scrollable body */}
      <div className="scroll" onScroll={onScroll}>
        {/* filter tabs — secondary, depend on the selected sport (hidden in Minimal) */}
        {!navMinimal &&
          <div className="filtabs">
            <div className="filtabs__row">
              {TABS.map((tab) =>
              <button key={tab.id} className={"t" + (tab.id === filterTab ? " on" : "")} onClick={() => changeTab(tab.id)}>
                  <PIcon name={tab.icon} size={15} />{tab.id}
                </button>
              )}
            </div>
            <button className="filt" onClick={() => setSheetOpen(true)} aria-label="Filters">
              <PIcon name="Sliders" size={18} />
              {hasFilters && <span className="dot">{active}</span>}
            </button>
          </div>
          }

        {/* (1UP/2UP toggle row removed per design) */}
        <div style={{ height: 12 }}></div>

        {/* events */}
        <div className="list">
          {events.length > 0 ? events.map((ev) =>
            <EventCard key={ev.id} ev={ev} markets={markets} picks={pickIds} onPick={togglePick} twoWay={twoWay} showTitles={applied.markets.length > 0 || twoUp} />
            ) :
            <div className="empty">
              <PIcon name="Sliders" size={28} />
              <div className="empty__t">No events match your filters</div>
              <div className="empty__s">Try removing a filter or widening the odds range.</div>
              {hasFilters && <button className="empty__btn" onClick={() => setApplied(EMPTY_SEL)}>Clear filters</button>}
            </div>
            }
        </div>

        <div style={{ height: 92 }}></div>
      </div>

      {/* Floating betslip bar */}
      <BetslipBar selections={selections} collapsed={barCollapsed} onOpen={openBetslip} stake={stake} />

      {/* Bottom nav */}
      <div className="botnav">
        <button className={"b" + (menuOpen ? " on" : "")} onClick={() => setMenuOpen(true)}><PIcon name="Menu" size={22} /><span className="lab">Menu</span></button>
        <button className="b on"><PIcon name={sportIcon} size={22} /><span className="lab">Sports</span></button>
        <button className="b"><PIcon name="MyBets" size={22} /><span className="lab">My bets</span></button>
        <button className="b"><PIcon name="Cherry" size={22} /><span className="lab">Casino</span></button>
        <button className="b" onClick={() => setHelpOpen(true)}><PIcon name="CircleHelp" size={22} /><span className="lab">Help</span></button>
      </div>

      {/* Filters sheet */}
      <FiltersSheet
          open={sheetOpen}
          sport={sport}
          initial={applied}
          showCounts={t.showCounts}
          layout={effectiveSheet}
          onLayoutChange={setSheetLayout}
          onClose={() => setSheetOpen(false)}
          onApply={(sel) => {setApplied(sel);setSheetOpen(false);}} />
        

      {/* Help / Smart FAQ sheet */}
      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Account sheet */}
      <AccountSheet open={acctOpen} onClose={() => setAcctOpen(false)} />

      {/* Menu sheet */}
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} showCounts={t.showCounts}
        onLeague={(id) => {setSport("Football");setApplied({ ...EMPTY_SEL, leagues: [id] });setMenuOpen(false);}}
        onSelectLeague={(label, countryId) => {
          const lg = LEAGUES.find((l) => l.label === label);
          setSport("Football");
          setApplied(lg ? { ...EMPTY_SEL, leagues: [lg.id] } : { ...EMPTY_SEL, countries: [countryId] });
          setMenuOpen(false);
        }} />

      {/* Betslip sheet */}
      <BetslipSheet
          open={betslipOpen}
          view={placedView ? "placed" : "slip"}
          selections={selections}
          stake={stake} setStake={setStake}
          acceptOdds={acceptOdds} setAcceptOdds={setAcceptOdds}
          betId={betId}
          onClose={() => setBetslipOpen(false)}
          onRemove={removeSel}
          onClear={clearSlip}
          onPlace={placeBet}
          onPlaceAnother={placeAnother} />
        

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakColor label="Accent" value={t.accent}
          options={["#9CE800", "#22D3A6", "#FF7A00", "#A95CF2", "#3B82F6"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Bottom sheet" />
        <TweakRadio label="Filter sheet layout" value={sheetLayout}
          options={[{ value: "sections", label: "Sections" }, { value: "tabs", label: "Tabs" }]}
          onChange={(v) => {setSheetLayout(v);setTweak("sheetLayout", v);}} />
        <TweakRadio label="Navigation" value={navMode}
          options={[{ value: "standard", label: "Standard" }, { value: "minimal", label: "Minimal" }]}
          onChange={(v) => {setNavMode(v);setTweak("navMode", v);}} />
        <TweakSlider label="Sheet height" value={t.sheetHeight} min={60} max={96} step={1} unit="%"
          onChange={(v) => setTweak("sheetHeight", v)} />
        <TweakSection label="Style" />
        <TweakSlider label="Sport chip radius" value={t.sportChipRadius} min={8} max={30} step={1} unit="px"
          onChange={(v) => setTweak("sportChipRadius", v)} />
        <TweakToggle label="Show event counts" value={t.showCounts}
          onChange={(v) => setTweak("showCounts", v)} />
      </TweaksPanel>
    </div>

    {/* Prototype control (on the stage, outside the phone) — two axes:
              how the filter sheet is organised, and a denser nav proposal */}
    <div className="proto-ctrl" data-omelette-chrome="">
      <div className="proto-ctrl__hd">
        <span className="proto-ctrl__title">Sports filters — prototype options</span>
        <span className="proto-ctrl__intro">Compare two directions. These switches are for review only and aren't part of the screen.</span>
      </div>

      <div className="proto-grp">
        <span className="proto-grp__lbl">Filter sheet layout</span>
        <span className="proto-grp__cap">Two variants of the advanced-filters bottom sheet.</span>
        <div className={"proto-seg" + (navMinimal ? " proto-seg--locked" : "")} role="radiogroup" aria-label="Filter sheet layout">
          <button role="radio" aria-checked={effectiveSheet === "sections"} disabled={navMinimal}
            className={"proto-seg__b" + (effectiveSheet === "sections" ? " on" : "")}
            onClick={() => {setSheetLayout("sections");setTweak("sheetLayout", "sections");}}>Sections</button>
          <button role="radio" aria-checked={effectiveSheet === "tabs"} disabled={navMinimal}
            className={"proto-seg__b" + (effectiveSheet === "tabs" ? " on" : "")}
            onClick={() => {setSheetLayout("tabs");setTweak("sheetLayout", "tabs");}}>Tabs</button>
        </div>
        {navMinimal && <span className="proto-grp__note">Locked to Sections while Minimal nav is on.</span>}
      </div>

      <div className="proto-grp">
        <span className="proto-grp__lbl">Navigation <span className="proto-grp__tag">proposal</span></span>
        <span className="proto-grp__cap">Minimal collapses the top nav to one line and reuses the Sections sheet.</span>
        <div className="proto-seg" role="radiogroup" aria-label="Navigation layout">
          <button role="radio" aria-checked={!navMinimal}
            className={"proto-seg__b" + (!navMinimal ? " on" : "")}
            onClick={() => {setNavMode("standard");setTweak("navMode", "standard");}}>Standard</button>
          <button role="radio" aria-checked={navMinimal}
            className={"proto-seg__b" + (navMinimal ? " on" : "")}
            onClick={() => {setNavMode("minimal");setTweak("navMode", "minimal");}}>Minimal</button>
        </div>
      </div>
    </div>
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);