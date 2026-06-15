/* ════════════════════════════════════════════════════════════════
   faq.jsx — "Help" bottom sheet
   Home view (tiles + Request-a-Free-Call form + About/News),
   with Help & FAQ, Rules and Responsible Gaming as sub-views.
   ════════════════════════════════════════════════════════════════ */
const { useState: useStateQ, useRef: useRefQ, useEffect: useEffectQ } = React;

// FAQ data — ordered by real support-ticket volume (count = monthly tickets)
const FAQ_TOP = [
{ id: "reset", cat: "Account", count: 336172, q: "How do I reset my password?", a: "Tap Login → Forgot password and enter your registered phone number. We'll send a reset code by SMS — enter it, then set a new password." },
{ id: "register", cat: "Account", count: 247880, q: "How do I register an account?", a: "Tap Join Now, choose your country, enter your phone number and create a password. Confirm the SMS code we send and your account is ready to bet." },
{ id: "withdraw", cat: "Withdrawals", count: 151352, q: "My withdrawal is still pending — when will I get it?", a: "Most withdrawals land within minutes. During high demand, or a delay on your provider (Intouch, Orange), it can take longer. If it's been over 30 minutes, contact us with the time you requested it." },
{ id: "settled", cat: "Bets", count: 106874, q: "How is my bet settled?", a: "Bets settle automatically on official results once the event ends. This usually takes a few minutes after full time, and winnings are paid straight to your balance." },
{ id: "balance", cat: "Payments", count: 75260, q: "How do I check my balance or statement?", a: "Your balance is shown at the top of every screen. For a full history of deposits, bets and withdrawals, go to Account → Statement." },
{ id: "paydown", cat: "Payments", count: 69128, q: "Why are payments not working right now?", a: "Occasionally a provider (Intouch, MTN, Airtel, Orange) has a short outage on their side. Live status is posted here — please try again shortly or use another payment method." },
{ id: "depmissing", cat: "Deposits", count: 58849, q: "I deposited but it's not in my balance", a: "Deposits are normally instant. If you were charged but don't see it, wait 2–3 minutes and refresh. Still missing? Share your transaction ID and we'll trace it." },
{ id: "depfail", cat: "Deposits", count: 56765, q: "My deposit failed", a: "Check you have enough balance with your provider and entered the correct amount. If money left your account but the deposit failed, it's automatically reversed within 24 hours." },
{ id: "postponed", cat: "Bets", count: 56321, q: "My match was postponed or cancelled", a: "Postponed or cancelled events are voided and your stake returned, unless the match is replayed within 48 hours. In a multibet, your remaining selections stand." },
{ id: "reactivate", cat: "Account", count: 50865, q: "How do I reactivate my account?", a: "Go to Account → Reactivate account, confirm your phone number and verify the SMS code. Self-excluded accounts reopen only after the cooling-off period ends." }];


const FAQ_CHIPS = ["All", "Account", "Deposits", "Withdrawals", "Bets", "Payments"];

// Smooth height-collapse wrapper (measures content)
function Collapse({ open, children }) {
  const inner = useRefQ(null);
  const [h, setH] = useStateQ(0);
  useEffectQ(() => {if (inner.current) setH(open ? inner.current.scrollHeight : 0);}, [open, children]);
  return (
    <div style={{ overflow: "hidden", maxHeight: h, transition: "max-height .3s cubic-bezier(.4,0,.2,1)" }}>
      <div ref={inner}>{children}</div>
    </div>);

}

// ════════ Home tiles — primary navigation ════════
function HelpTiles({ onFaq, onRules, onRg }) {
  const tiles = [
  { icon: "CircleHelp", label: "Help & FAQ", action: onFaq },
  { icon: "ListChecks", label: "Rules", action: onRules },
  { icon: "ShieldCheck", label: "Responsible Gaming", action: onRg }];

  return (
    <div className="htiles">
      {tiles.map((t) =>
      <button key={t.label} className="htile" onClick={t.action}>
          <PIcon name={t.icon} size={22} className="htile__ic" />
          <span className="htile__lbl">{t.label}</span>
        </button>
      )}
    </div>);

}

// ════════ Request a Free Call (inline on home) ════════
const CALL_REASONS = ["Deposit", "Withdrawal", "Betslip", "Other"];

function CallCard({ onSubmit }) {
  const [num, setNum] = useStateQ("");
  const [reason, setReason] = useStateQ(null);
  const ready = !!reason && num.trim().length >= 6;
  return (
    <div className="callcard">
      <div className="callcard__ttl">Request a Free Call</div>

      <div className="fld-label">Mobile Number</div>
      <div className="phone-input">
        <span className="cc"><FlagCircle code="benin" size={26} />+229</span>
        <input type="tel" inputMode="numeric" value={num} onChange={(e) => setNum(e.target.value)} placeholder="123456789" />
      </div>
      <div className="fld-help">Enter your mobile number without the country code (e.g., 123456789).</div>

      <div className="q-label">How can we help <span className="req">(Required)</span></div>
      <div className="radio-list">
        {CALL_REASONS.map((r) =>
        <button key={r} className={"radio-row" + (reason === r ? " on" : "")} onClick={() => setReason(r)}>
            <span className="radio-dot"></span>
            <span className="radio-lbl">{r}</span>
          </button>
        )}
      </div>

      <div className="eta">
        <div className="eta__lbl">Expect a call in:</div>
        <div className="eta__bar">
          <span className="eta__seg eta__seg--1"></span>
          <span className="eta__seg eta__seg--2"></span>
          <span className="eta__seg eta__seg--3"></span>
        </div>
        <div className="eta__val">0-5 minutes</div>
      </div>

      <button className="call-btn" disabled={!ready} onClick={() => ready && onSubmit(reason)}>CALL ME</button>
    </div>);

}

function CallDoneView({ reason }) {
  return (
    <div className="call-done">
      <span className="cd-ic"><PIcon name="Phone" size={34} /></span>
      <div className="cd-ttl">Call requested</div>
      <div className="cd-sub">We'll call you about <b>{(reason || "your request").toLowerCase()}</b> within 0–5 minutes. Keep your phone nearby.</div>
    </div>);

}

// ════════ Betting Rules view (Help → Rules) ════════
const RULES = [
{ sec: "1. General Sports Betting Rules", items: [
  { id: "1.1", t: "1.1 General", a: "Company reserves the right to correct obvious errors in the input of betting odds and/or the evaluation of betting results, even after an event. It is the customer's responsibility to ensure they place their bets correctly.\n\nNormally bets are open until the official starting time of the event. Any bets received after the event has started will be cancelled.\n\nIf an event occurs that is unclear or not covered by these rules, Company reserves the right to decide the outcome of each event on a case-by-case basis." },
  { id: "1.2", t: "1.2 Bet Types", a: "A single is a bet on one selection. A multibet (accumulator) combines two or more selections into one bet — every selection must win for the bet to win, and the total odds are the product of each selection's odds." },
  { id: "1.3", t: "1.3 Settlement of Bets", a: "Bets are settled on the official result once the event has ended and the result is confirmed. Settlement usually takes a few minutes after full time, and winnings are paid straight to your balance." },
  { id: "1.4", t: "1.4 Maximum Payout", a: "Maximum winnings per betslip are subject to the limits published in the Sportsbook maxima. Where total winnings would exceed the limit, Company may reduce the bet to comply with the winnings limit." },
  { id: "1.5", t: "1.5 Void Selections", a: "A void selection is treated as odds of 1.00 and removed from the bet. In a multibet, the remaining selections stand and the total odds are recalculated." }] },

{ sec: "2. Football (Soccer) Betting Rules", items: [
  { id: "2.1", t: "2.1 Match Length", a: "Unless otherwise stated, all bets are settled on the result at the end of regular 90-minute play, including any time added by the referee for stoppages. Extra time and penalty shoot-outs do not count." },
  { id: "2.2", t: "2.2 Abandoned Matches", a: "If a match is abandoned before completion, all bets are void and stakes returned — unless the market has already been unconditionally decided before the abandonment." },
  { id: "2.3", t: "2.3 Goal Scoring", a: "Own goals count towards team and match totals but not towards individual goalscorer markets. Goals scored in extra time do not count towards full-time markets." },
  { id: "2.4", t: "2.4 Postponed Matches", a: "Postponed or cancelled matches are void and stakes returned, unless the match is rescheduled and played within 48 hours of the original kick-off." },
  { id: "2.5", t: "2.5 Extra Time & Penalties", a: "Markets specified as 'to qualify' or 'to win the trophy' include extra time and penalties. All other markets are settled on 90 minutes only unless stated otherwise." }] }];


function RulesView() {
  const [open, setOpen] = useStateQ("1.1");
  return (
    <div className="rules">
      {RULES.map((sec) =>
      <div className="rule-sec" key={sec.sec}>
          <div className="rule-sec__ttl">{sec.sec}</div>
          {sec.items.map((it) => {
          const isOpen = open === it.id;
          return (
            <div className={"rule-item" + (isOpen ? " open" : "")} key={it.id}>
                <button className="rule-q" onClick={() => setOpen(isOpen ? null : it.id)}>
                  <span className="qt">{it.t}</span>
                  <PIcon name="ChevronDown" size={20} className="chev" />
                </button>
                <Collapse open={isOpen}>
                  <div className="rule-a">{it.a}</div>
                </Collapse>
              </div>);

        })}
        </div>
      )}
    </div>);

}

// ════════ Responsible Gaming view ════════
const RG_TOOLS = [
{ icon: "CircleDollarSign", t: "Deposit limits", d: "Cap how much you can deposit per day, week or month." },
{ icon: "Stopwatch", t: "Reality check", d: "Get a reminder of how long you've been playing." },
{ icon: "Lock", t: "Take a break", d: "Lock your account for 24 hours up to 6 weeks." },
{ icon: "ShieldCheck", t: "Self-exclusion", d: "Close your account for 6 months or longer." }];


function ResponsibleGamingView() {
  return (
    <div className="rg">
      <p className="rg__lead">Betting should always be fun. These tools help you stay in control of your time and money.</p>
      <div className="rg__tools">
        {RG_TOOLS.map((it) =>
        <button key={it.t} className="rg-row">
            <span className="rg-row__ic"><PIcon name={it.icon} size={22} /></span>
            <span className="rg-row__tx">
              <span className="rg-row__t">{it.t}</span>
              <span className="rg-row__d">{it.d}</span>
            </span>
            <PIcon name="ChevronRight" size={18} className="rg-row__chev" />
          </button>
        )}
      </div>
      <div className="rg__help">
        Need to talk to someone? Call the national gambling helpline — free and confidential, 24/7.
      </div>
    </div>);

}

// ════════ Help & FAQ view (smart list) ════════
function FaqView() {
  const [chip, setChip] = useStateQ("All");
  const [exp, setExp] = useStateQ("reset");
  const [query, setQuery] = useStateQ("");

  const max = FAQ_TOP[0].count;
  const fmt = (n) => n >= 1000 ? Math.round(n / 1000) + "K" : "" + n;
  const q = query.trim().toLowerCase();
  const list = FAQ_TOP.
  filter((t) => chip === "All" || t.cat === chip).
  filter((t) => !q || t.q.toLowerCase().includes(q) || t.a.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)).
  slice(0, 6);

  return (
    <>
      <div className="help-search">
        <PIcon name="Search" size={20} />
        <input placeholder="Search help — e.g. withdrawal, password"
        value={query} onChange={(e) => {setQuery(e.target.value);setExp(null);}} />
      </div>

      <div className="hchips" style={{ margin: "12px 0 14px" }}>
        {FAQ_CHIPS.map((c) =>
        <button key={c} className={"hchip" + (chip === c ? " on" : "")}
        onClick={() => {setChip(c);setExp(null);}}>{c}</button>
        )}
      </div>

      <div className="smart">
        {list.map((it, i) => {
          const isOpen = exp === it.id;
          const pct = Math.max(8, Math.round(it.count / max * 100));
          return (
            <div key={it.id} className={"smart__item" + (isOpen ? " open" : "")}>
              <button className="smart__q" onClick={() => setExp(isOpen ? null : it.id)}>
                <span className="smart__rank">{i + 1}</span>
                <span className="smart__main">
                  <span className="smart__qt">{it.q}</span>
                  <span className="smart__meta">
                    {i === 0 && chip === "All" && !q ?
                    <span className="smart__tag"><PIcon name="TrendingUp" size={12} />Most asked</span> : null}
                    <span className="smart__bar"><span style={{ width: pct + "%" }}></span></span>
                    <span className="smart__pct">{fmt(it.count)}</span>
                  </span>
                </span>
                <PIcon name="ChevronDown" size={20} className="smart__chev" />
              </button>
              <Collapse open={isOpen}>
                <div className="smart__a-inner">
                  {it.a}
                  <a className="alink" href="#" onClick={(e) => e.preventDefault()}>Open guide <PIcon name="ArrowRight" size={15} /></a>
                </div>
              </Collapse>
            </div>);

        })}
        {list.length === 0 &&
        <div style={{ padding: "24px 8px", textAlign: "center", color: "var(--muted)", font: "400 14px/20px Roboto" }}>
            No results for “{query}”. Try Request a Free Call.
          </div>
        }
      </div>
    </>);

}

// ════════ Home view — tiles + call form + nav rows ════════
function HelpHome({ onFaq, onRules, onRg, onCall }) {
  return (
    <>
      <HelpTiles onFaq={onFaq} onRules={onRules} onRg={onRg} />
      <CallCard onSubmit={onCall} />
      <div className="hnav">
        <button className="hnav-row">About betPawa</button>
        <button className="hnav-row">News</button>
      </div>
    </>);

}

// ordering used to pick slide direction (forward = slide in from right)
const VIEW_ORDER = { home: 0, faq: 1, rules: 1, rg: 1, "call-done": 1 };

// keeps the outgoing view mounted briefly so it can animate out
function useViewTransition(view) {
  const [t, setT] = useStateQ({ cur: view, prev: null, dir: 1 });
  const prevRef = useRefQ(view);
  useEffectQ(() => {
    if (prevRef.current === view) return;
    const from = prevRef.current;
    const dir = (VIEW_ORDER[view] ?? 0) >= (VIEW_ORDER[from] ?? 0) ? 1 : -1;
    prevRef.current = view;
    setT({ cur: view, prev: from, dir });
    const id = setTimeout(() => setT({ cur: view, prev: null, dir }), 340);
    return () => clearTimeout(id);
  }, [view]);
  return t;
}

const VIEW_TITLE = { faq: "Help & FAQ", rules: "Rules", rg: "Responsible Gaming", "call-done": "Request a Free Call" };

function HelpSheet({ open, onClose }) {
  const [view, setView] = useStateQ("home");
  const [callReason, setCallReason] = useStateQ("Deposit");

  // reset to home each time the sheet (re)opens
  useEffectQ(() => {if (open) setView("home");}, [open]);

  const t = useViewTransition(view);
  const transitioning = t.prev !== null;
  const vxIn = t.dir > 0 ? "28px" : "-28px";
  const vxOut = t.dir > 0 ? "-22px" : "22px";

  const renderHeader = (v) => v === "home" ?
  <div className="hsheet__hd hsheet__hd-fade" key="home-hd">
      <div style={{ flex: 1 }}><div className="ttl">Help</div></div>
      <button className="close" onClick={onClose} aria-label="Close"><PIcon name="X" size={18} /></button>
    </div> :

  <div className="hsheet__hd hsheet__hd-fade" key={v + "-hd"}>
      <button className="back" onClick={() => setView("home")} aria-label="Back"><PIcon name="ChevronLeft" size={20} /></button>
      <div style={{ flex: 1 }}><div className="ttl">{VIEW_TITLE[v]}</div></div>
      <button className="close" onClick={onClose} aria-label="Close"><PIcon name="X" size={18} /></button>
    </div>;


  const renderView = (v) => {
    if (v === "faq") return <FaqView />;
    if (v === "rules") return <RulesView />;
    if (v === "rg") return <ResponsibleGamingView />;
    if (v === "call-done") return <CallDoneView reason={callReason} />;
    return (
      <HelpHome
        onFaq={() => setView("faq")}
        onRules={() => setView("rules")}
        onRg={() => setView("rg")}
        onCall={(r) => {setCallReason(r);setView("call-done");}} />);

  };

  // the sheet is "tall" for every view except the short confirmation
  const isTall = (v) => v !== "call-done";
  const tall = isTall(view) || transitioning && isTall(t.prev);

  return (
    <>
      <div className={"backdrop" + (open ? " show" : "")} onClick={onClose}></div>
      <div className={"hsheet" + (tall ? " hsheet--tall" : "") + (open ? " show" : "")} role="dialog" aria-label="Help">
        <div className="hsheet__grab"></div>

        {renderHeader(view)}

        <div className={"hsheet__body" + (transitioning ? " hsheet__body--locked" : "")}>
          <div className={"viewstack" + (transitioning ? " viewstack--anim" : "")}>
            <div className="viewstack__layer viewstack__layer--in" key={t.cur} style={transitioning ? { "--vx": vxIn } : null}>
              {renderView(t.cur)}
            </div>
            {transitioning &&
            <div className="viewstack__layer viewstack__layer--out" key={t.prev + "-out"} style={{ "--vxo": vxOut }}>
                {renderView(t.prev)}
              </div>
            }
          </div>
        </div>
      </div>
    </>);

}

Object.assign(window, { HelpSheet });