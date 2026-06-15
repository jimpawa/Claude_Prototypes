/* ════════════════════════════════════════════════════════════════
   betslip.jsx — floating betslip bar + betslip bottom sheet
   Bar morphs width via a JS timer (setInterval) so it animates even
   inside a scaled/transformed stage. Sheet slides via CSS `translate`.
   ════════════════════════════════════════════════════════════════ */
const { useState: useStateB, useRef: useRefB, useEffect: useEffectB } = React;

const BAL = 882.10;
const MIN_LEG_ODDS = 1.20; // a leg must be priced 1.20+ to count toward the Win Bonus
const MAX_BONUS = 1250;    // betPawa max Win Bonus %

// Win Bonus % by number of *eligible* legs — betPawa-style ramp:
// nothing under 3 legs, 3% at 3 legs, growing with every added leg up to 1250%.
const WB_TABLE = {
  3: 3, 4: 5, 5: 8, 6: 13, 7: 20, 8: 30, 9: 45, 10: 65,
  11: 90, 12: 120, 13: 155, 14: 195, 15: 245, 16: 300, 17: 360, 18: 430,
  19: 510, 20: 600, 21: 700, 22: 810, 23: 930, 24: 1060, 25: 1150, 26: 1250 };

function money(n) {return (n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });}
function productOdds(sels) {return sels.reduce((p, s) => p * s.odds, 1);}
// only legs at 1.20+ count toward the bonus tier (shorter-odds legs are ignored)
function eligibleLegs(sels) {return sels.filter((s) => s.odds >= MIN_LEG_ODDS).length;}
function bonusPct(n) {if (n < 3) return 0;if (n >= 26) return MAX_BONUS;return WB_TABLE[n] || 0;}
// The Win Bonus is paid on winnings *excluding* the stake → stake × (odds − 1) × pct.
// One shared calc so the green bar and the betslip sheet always agree.
function winBonus(sels, stakeNum) {
  const odds = productOdds(sels);
  const pct = bonusPct(eligibleLegs(sels));
  const bonus = (stakeNum || 0) * (odds - 1) * (pct / 100);
  return { odds, pct, bonus };
}

/* ───────────── Floating bar ───────────── */
function BetslipBar({ selections, collapsed, onOpen, stake }) {
  const n = selections.length;
  const { odds, pct, bonus } = winBonus(selections, parseFloat(stake) || 0);
  const barRef = useRefB(null);
  const fullRef = useRefB(null);
  const miniRef = useRefB(null);
  const mounted = useRefB(false);
  const timer = useRefB(null);

  useEffectB(() => {
    const node = barRef.current;if (!node) return;
    const parentW = node.parentElement ? node.parentElement.clientWidth : 377;
    const FULL = parentW - 16; // 8px inset each side
    const SMALL = 60;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const apply = (w, contentOpacity, miniOpacity, radius) => {
      node.style.width = w + "px";
      if (fullRef.current) fullRef.current.style.opacity = String(contentOpacity);
      if (miniRef.current) miniRef.current.style.opacity = String(miniOpacity);
      node.style.borderRadius = radius + "px";
    };
    // first paint: snap, no animation
    if (!mounted.current) {
      mounted.current = true;
      apply(collapsed ? SMALL : FULL, collapsed ? 0 : 1, collapsed ? 1 : 0, collapsed ? 12 : 14);
      return;
    }
    const from = parseFloat(node.style.width) || (collapsed ? FULL : SMALL);
    const to = collapsed ? SMALL : FULL;
    const t0 = performance.now();
    const DUR = 320;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / DUR);
      const e = ease(p);
      const w = from + (to - from) * e;
      const contentOpacity = collapsed ? 1 - p : p;
      const miniOpacity = collapsed ? p : 1 - p;
      apply(w, contentOpacity, miniOpacity, 14 - 2 * (collapsed ? e : 1 - e));
      if (p >= 1) clearInterval(timer.current);
    }, 16);
    return () => clearInterval(timer.current);
  }, [collapsed]);

  return (
    <div className="bs-bar" ref={barRef} onClick={onOpen} role="button" aria-label="Open betslip">
      <div className="bs-bar__full" ref={fullRef}>
        <div className="bs-bar__icon">
          <PIcon name="Betslip" size={22} />
          <span className="bs-bar__badge">{n}</span>
        </div>
        {n === 0 ?
        <div className="bs-bar__promo">Add legs for up to a <b>1250% Win Bonus</b></div> :

        <div className="bs-bar__stats">
            <div className="bs-bar__stat"><span className="k">Odds</span><span className="v">{odds.toFixed(2)}</span></div>
            <div className="bs-bar__stat"><span className="k">Win Bonus</span><span className="v">{pct}% of {MAX_BONUS}%</span></div>
          </div>
        }
        <button className="bs-bar__chev" aria-label="Expand betslip" onClick={onOpen}>
          <PIcon name="ChevronUp" size={20} />
        </button>
      </div>
      <div className="bs-bar__mini" ref={miniRef}>
        <PIcon name="Betslip" size={22} />
        <span className="bs-bar__badge">{n}</span>
      </div>
    </div>);

}

/* ───────────── Selection card ───────────── */
function SlipSelection({ s, onRemove }) {
  return (
    <div className="bs-sel">
      <button className="bs-sel__close" onClick={() => onRemove(s.id)} aria-label="Remove selection">
        <PIcon name="X" size={14} />
      </button>
      <div className="bs-sel__card">
        {s.live &&
        <div className="bs-sel__top"><span className="bs-sel__live">LIVE</span></div>
        }
        <div className="bs-sel__row">
          <PIcon name="FootballBall" size={14} className="bs-sel__ico" />
          <span className="bs-sel__teams">{s.home} - {s.away}</span>
          {s.live && <span className="bs-sel__score">{s.score}</span>}
        </div>
        <div className="bs-sel__row">
          <span className="bs-sel__market">{s.line}</span>
          <span className="bs-sel__odd">{s.odds.toFixed(2)}</span>
        </div>
      </div>
    </div>);

}

/* ───────────── Sheet ───────────── */
const STAKE_CHIPS = [100, 500, 1000, 5000];

function BetslipSheet({ open, view, selections, stake, setStake, acceptOdds, setAcceptOdds,
  onClose, onRemove, onClear, onPlace, onPlaceAnother, betId }) {
  const n = selections.length;
  // total odds = product of every selection's odds (live, off the betslip)
  const odds = productOdds(selections);
  const effOdds = odds;
  const elig = eligibleLegs(selections);
  const pct = bonusPct(elig);
  const stakeNum = parseFloat(stake) || 0;
  const winnings = stakeNum * effOdds; // potential return = stake × total odds
  const bonus = stakeNum * (effOdds - 1) * (pct / 100); // bonus on winnings excluding the stake
  const payout = winnings + bonus; // what you collect
  const oddsChanged = false; // no live odds-feed in this prototype
  const oddsDir = "down";

  const placed = view === "placed";
  const empty = n === 0 && !placed;

  return (
    <>
      <div className={"backdrop" + (open ? " show" : "")} onClick={onClose}></div>
      <div className={"bs-sheet" + (open ? " show" : "")} role="dialog" aria-label="Betslip">
        {/* Header */}
        <div className="bs-hd">
          <div className="bs-seg">
            <button className={"bs-seg__b" + (!placed ? " on" : "")}>Betslip <span className="bs-seg__badge">{n}</span></button>
            <button className={"bs-seg__b" + (placed ? " on" : "")}>My Bets{placed ? <span className="bs-seg__badge">1</span> : null}</button>
          </div>
          <span className="bs-hd__bal">₦ {money(BAL)}</span>
          <button className="bs-hd__x" onClick={onClose} aria-label="Close"><PIcon name="X" size={16} /></button>
        </div>

        {placed ?
        <div className="bs-body bs-body--center">
            <div className="bs-placed__badge"><PIcon name="Check" size={36} /></div>
            <div className="bs-placed__ttl">Bet placed!</div>
            <div className="bs-placed__sub">Bet ID <b>{betId}</b></div>
            <div className="bs-placed__card">
              <div className="r"><span>Stake</span><span className="b">₦ {money(stakeNum)}</span></div>
              <div className="r"><span>Total odds</span><span className="b">{effOdds.toFixed(2)}</span></div>
              <div className="r r--top"><span>Potential payout</span><span className="g">₦ {money(payout)}</span></div>
            </div>
            <div className="bs-placed__btns">
              <button className="bs-place">Share booking code</button>
              <button className="bs-ghost" onClick={onPlaceAnother}>Place another bet</button>
            </div>
          </div> :
        empty ?
        <div className="bs-body" style={{ gap: 12 }}>
            <div className="bs-book">
              <label>Booking Code</label>
              <div className="bs-book__in"><input placeholder="Enter booking code" /></div>
              <button className="bs-book__load">LOAD</button>
            </div>
            <div className="bs-divider"></div>
            <div className="bs-empty">
              <svg width="132" height="132" viewBox="0 0 184 184" fill="none" aria-hidden="true">
                <rect x="36" y="28" width="112" height="138" rx="8" fill="var(--bg-card)" stroke="var(--line)" strokeWidth="1.5" />
                <rect x="48" y="44" width="88" height="10" rx="2" fill="var(--line)" />
                <rect x="48" y="62" width="60" height="6" rx="2" fill="var(--line)" />
                <rect x="48" y="78" width="88" height="22" rx="4" fill="var(--line)" />
                <rect x="48" y="108" width="88" height="22" rx="4" fill="var(--line)" />
                <rect x="48" y="138" width="50" height="10" rx="2" fill="var(--line)" />
                <circle cx="138" cy="38" r="20" fill="var(--accent)" />
                <path d="M132 38l4 4 8-8" stroke="#1A2200" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div className="bs-empty__ttl">Betslip is empty</div>
              <div className="bs-empty__sub">Pick selections from the markets to start building your bet.</div>
            </div>
            <div className="bs-vbtns">
              <button className="bs-place" onClick={onClose}>BROWSE SPORTS</button>
              <button className="bs-ghost2">BROWSE CASINO</button>
              <button className="bs-ghost3">HELP</button>
            </div>
          </div> :

        <>
            <div className="bs-tabs">
              <div className="bs-tab on">Sports <span className="bs-tab__c">{n}</span></div>
              <div className="bs-tab">Virtuals</div>
            </div>
            <div className="bs-body">
              {elig >= 3 &&
            <div className="bs-alert">Congrats! These selections give you a <b>Win Bonus</b>! Add more legs to boost your bonus. <a href="#" onClick={(e) => e.preventDefault()}>Read more</a></div>
            }
              <div className="bs-meta">
                <button className="bs-meta__l"><PIcon name="Share" size={14} />Booking code</button>
                <button className="bs-meta__r" onClick={onClear}>Clear Betslip</button>
              </div>

              {selections.map((s) => <SlipSelection key={s.id} s={s} onRemove={onRemove} />)}

              <div className="bs-foot">
                <button className={"bs-switch" + (acceptOdds ? " on" : "")} onClick={() => setAcceptOdds((v) => !v)}>
                  <span className="bs-switch__tr"></span>
                  <span className="bs-switch__lbl">Accept odds changes. <a href="#" onClick={(e) => e.preventDefault()}>Learn more</a></span>
                </button>

                <div className="bs-stake">
                  <div className="bs-stake__lab">Stake</div>
                  <div className="bs-stake__in">
                    <span className="cur">₦</span>
                    <input value={stake} inputMode="decimal"
                  onChange={(e) => setStake(e.target.value.replace(/[^0-9.]/g, ""))} />
                    <span className="max" onClick={() => setStake(String(BAL.toFixed(2)))}>MAX</span>
                  </div>
                  <div className="bs-chips">
                    {STAKE_CHIPS.map((c) =>
                  <button key={c} className="bs-chip" onClick={() => setStake(String(((parseFloat(stake) || 0) + c).toFixed(2)))}>+{c.toLocaleString("en-US")}</button>
                  )}
                  </div>
                  <div className="bs-stake__hint"><span>Min 1.00 · Max 10,000</span><span>Balance ₦ {money(BAL)}</span></div>
                </div>

                <div className="bs-analysis">
                  <div className="bs-an__row">
                    <span className="bs-an__k bs-an__k--b">Odds:</span>
                    <span className="bs-an__v">
                      {acceptOdds && oddsChanged && <span className="bs-an__old">{odds.toFixed(2)}</span>}
                      {acceptOdds && oddsChanged &&
                    <PIcon name="TrendingUp" size={14} className={"bs-an__arr bs-an__arr--" + oddsDir}
                    style={oddsDir === "down" ? { transform: "scaleY(-1)" } : null} />
                    }
                      <span className={"bs-an__b" + (acceptOdds && oddsChanged ? " bs-an__b--" + oddsDir : "")}>{effOdds.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="bs-an__row">
                    <span className="bs-an__k">Potential Winnings:</span>
                    <span className="bs-an__v bs-an__v--mut">₦ {money(winnings)}</span>
                  </div>
                  {pct > 0 &&
                <div className="bs-an__row">
                      <span className="bs-an__k">{pct}% Win Bonus:</span>
                      <span className="bs-an__v bs-an__v--mut">₦ {money(bonus)}</span>
                    </div>
                }
                  <div className="bs-an__row">
                    <span className="bs-an__k bs-an__k--b">Payout:</span>
                    <span className="bs-an__v bs-an__v--b">₦ {money(payout)}</span>
                  </div>
                </div>

                <button className="bs-place" onClick={onPlace}>Place Bet <span className="amt">· ₦ {money(stakeNum)}</span></button>
              </div>
            </div>
          </>
        }
      </div>
    </>);

}

Object.assign(window, { BetslipBar, BetslipSheet, productOdds, bonusPct, money });