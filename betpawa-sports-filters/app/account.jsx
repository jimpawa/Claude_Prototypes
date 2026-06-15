/* ════════════════════════════════════════════════════════════════
   account.jsx — "Account" bottom sheet (header account icon)
   Two states:
   • logged-out → JOIN NOW / LOG IN + basic settings
   • logged-in  → wallet balance + full settings menu
   Tapping LOG IN / JOIN NOW signs in; Log Out signs back out.
   ════════════════════════════════════════════════════════════════ */
const { useState: useStateA } = React;

function AcctRow({ icon, label, right, danger, onClick }) {
  return (
    <button className={"acct-row" + (danger ? " acct-row--logout" : "")} onClick={onClick}>
      <PIcon name={icon} size={22} className="acct-row__ic" />
      <span className="acct-row__lbl">{label}</span>
      {right}
    </button>);

}

function LangSeg({ lang, setLang }) {
  return (
    <span className="acct-seg" role="group" aria-label="Language">
      <button className={"acct-seg__o" + (lang === "EN" ? " on" : "")} onClick={(e) => {e.stopPropagation();setLang("EN");}}>EN</button>
      <button className={"acct-seg__o" + (lang === "FR" ? " on" : "")} onClick={(e) => {e.stopPropagation();setLang("FR");}}>FR</button>
    </span>);

}

function ThemeSwitch({ dark, setDark }) {
  return (
    <button className={"acct-switch" + (dark ? " on" : "")} role="switch" aria-checked={dark}
      aria-label="Dark Theme" onClick={(e) => {e.stopPropagation();setDark((v) => !v);}}></button>);

}

function AccountSheet({ open, onClose }) {
  const [loggedIn, setLoggedIn] = useStateA(true);
  const [lang, setLang] = useStateA("EN");
  const [dark, setDark] = useStateA(true);
  const [promo, setPromo] = useStateA(true);
  const [manageOpen, setManageOpen] = useStateA(false);

  const signIn = () => setLoggedIn(true);
  // logged-out view is hidden for now — Log Out just closes the sheet
  const signOut = () => {setManageOpen(false);onClose();};

  return (
    <>
      <div className={"backdrop" + (open ? " show" : "")} onClick={onClose}></div>
      <div className={"hsheet hsheet--tall asheet" + (open ? " show" : "")} role="dialog" aria-label="Account">
        <div className="hsheet__grab"></div>

        <div className="hsheet__hd">
          <div style={{ flex: 1 }}><div className="ttl">Account</div></div>
          <button className="close" onClick={onClose} aria-label="Close"><PIcon name="X" size={18} /></button>
        </div>

        <div className="hsheet__body">

          {loggedIn ?
          /* ───────── Logged-in: wallet ───────── */
          <div className="acct-wallet">
              <div className="acct-wallet__lbl">Wallet Balance</div>
              <div className="acct-wallet__bal">GH₵ 882.10</div>
              <div className="acct-wallet__phone">
                <span className="acct-prov" aria-hidden="true"></span>+243 7073457532
              </div>
              <div className="acct-wallet__btns">
                <button className="acct-login">WITHDRAW</button>
                <button className="acct-join">DEPOSIT</button>
              </div>
            </div> :

          /* ───────── Logged-out: auth ───────── */
          <div className="acct-auth">
              <button className="acct-join" onClick={signIn}>JOIN NOW</button>
              <button className="acct-login" onClick={signIn}>LOG IN</button>
            </div>
          }

          {/* Settings */}
          <div className="acct-card">
            <div className="acct-row">
              <PIcon name="Languages" size={22} className="acct-row__ic" />
              <span className="acct-row__lbl">Change language</span>
              <LangSeg lang={lang} setLang={setLang} />
            </div>

            {loggedIn ?
            <>
                <AcctRow icon="Bell" label="Notifications" />
                <div className="acct-manage">
                  <button className="acct-row" onClick={() => setManageOpen((v) => !v)}>
                    <PIcon name="ManageAccount" size={22} className="acct-row__ic" />
                    <span className="acct-row__lbl">Manage account</span>
                    <PIcon name="ChevronDown" size={20} className={"acct-row__chev" + (manageOpen ? " open" : "")} />
                  </button>
                  <div className={"acct-sub" + (manageOpen ? " open" : "")}>
                    <button className="acct-subrow">Personal details</button>
                    <button className="acct-subrow">Change password</button>
                    <button className="acct-subrow">Reset deposit limit</button>
                  </div>
                </div>
                <AcctRow icon="MyBets" label="My Bets" />
                <AcctRow icon="Statement" label="Statement" />
              </> :

            <AcctRow icon="Deposit" label="Deposit" />
            }

            <div className="acct-row">
              <PIcon name="SunMoon" size={22} className="acct-row__ic" />
              <span className="acct-row__lbl">Dark Theme</span>
              <ThemeSwitch dark={dark} setDark={setDark} />
            </div>
          </div>

          {/* Add to Home Screen promo */}
          {promo &&
          <div className="acct-promo">
              <span className="acct-promo__icon"><span className="b">b</span><span className="p">P</span></span>
              <div className="acct-promo__tx">
                <span className="acct-promo__lead">Add the betPawa app to your Home Screen.</span>
                <a className="acct-promo__add" href="#" onClick={(e) => e.preventDefault()}>ADD</a>
              </div>
              <button className="acct-promo__x" onClick={() => setPromo(false)} aria-label="Dismiss"><PIcon name="X" size={18} /></button>
            </div>
          }

          {/* Log out */}
          <div className="acct-card">
            <AcctRow icon="LogOut" label="Log Out" danger onClick={signOut} />
          </div>
        </div>
      </div>
    </>);

}

Object.assign(window, { AccountSheet });
