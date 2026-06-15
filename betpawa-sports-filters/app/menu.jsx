/* ════════════════════════════════════════════════════════════════
   menu.jsx — main "Menu" bottom sheet (from the Menu bottom-nav item)
   Shortcut grid + Popular Leagues + Popular Countries.
   ════════════════════════════════════════════════════════════════ */
const { useState: useStateM } = React;

const MENU_SHORTCUTS = [
  { id: "home", label: "Home", icon: "Home", wide: true },
  { id: "live", label: "Live", icon: "Activity", wide: true },
  { id: "virtuals", label: "Virtuals", icon: "VirtualSports", wide: true },
  { id: "aviator", label: "Aviator", icon: "Aviator" },
  { id: "popular", label: "Popular", icon: "Flame" },
  { id: "pawapps", label: "pawApps", icon: "LayoutGrid" },
  { id: "bigwins", label: "Big Wins", icon: "Trophy" },
];

function MenuCountryRow({ c, showCounts, onSelectLeague }) {
  const [open, setOpen] = useStateM(false);
  return (
    <div className="mnu-crow">
      <button className="mnu-crow__hd" onClick={() => setOpen(o => !o)}>
        <FlagCircle code={c.flag} size={26} />
        <span className="nm">{c.label}</span>
        {showCounts && <span className="ct">{c.count}</span>}
        <PIcon name="ChevronDown" size={18} className={"chev" + (open ? " open" : "")} />
      </button>
      {open && (
        <div className="mnu-crow__sub">
          {c.leagues.map(l => (
            <div key={l} className="mnu-subrow" onClick={() => onSelectLeague && onSelectLeague(l, c.id)}><span>{l}</span><PIcon name="ChevronRight" size={15} /></div>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuSheet({ open, onClose, showCounts, onLeague, onSelectLeague }) {
  const [countriesOpen, setCountriesOpen] = useStateM(true);

  return (
    <>
      <div className={"backdrop" + (open ? " show" : "")} onClick={onClose}></div>
      <div className={"mnu-sheet" + (open ? " show" : "")} role="dialog" aria-label="Menu">
        <div className="mnu-hd">
          <span className="mnu-hd__ttl">Menu</span>
          <button className="mnu-hd__x" onClick={onClose} aria-label="Close"><PIcon name="X" size={18} /></button>
        </div>

        <div className="mnu-body">
          {/* shortcut grid */}
          <div className="mnu-grid">
            {MENU_SHORTCUTS.map(s => (
              <button key={s.id} className={"mnu-tile" + (s.wide ? " mnu-tile--wide" : "")}>
                <PIcon name={s.icon} size={26} className="mnu-tile__ic" />
                <span className="mnu-tile__lab">{s.label}</span>
              </button>
            ))}
          </div>

          {/* popular leagues */}
          <div className="mnu-card">
            <div className="mnu-sec">
              <span className="mnu-sec__t">Popular Leagues</span>
              <button className="mnu-sec__more" aria-label="See all leagues"><PIcon name="ChevronRight" size={20} /></button>
            </div>
            <div className="mnu-lchips">
              {LEAGUES.map(l => (
                <button key={l.id} className="mnu-lchip" onClick={() => onLeague && onLeague(l.id)}>
                  <FlagCircle code={l.flag} size={24} />
                  <span className="nm">{l.label}</span>
                  {showCounts && <span className="ct">{l.count}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* popular countries */}
          <div className="mnu-card">
            <button className="mnu-sec mnu-sec--btn" onClick={() => setCountriesOpen(o => !o)}>
              <span className="mnu-sec__t">Popular Countries</span>
              <PIcon name="ChevronDown" size={20} className={"mnu-sec__chev" + (countriesOpen ? " open" : "")} />
            </button>
            {countriesOpen && (
              <div className="mnu-clist">
                {COUNTRIES.map(c => <MenuCountryRow key={c.id} c={c} showCounts={showCounts} onSelectLeague={onSelectLeague} />)}
              </div>
            )}
          </div>

          <div style={{ height: 8 }}></div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { MenuSheet });
