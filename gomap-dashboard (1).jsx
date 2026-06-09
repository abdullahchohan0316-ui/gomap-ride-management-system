import { useState, useEffect, useRef } from "react";

const BRAND = "#FF8C00";
const BRAND_LIGHT = "#FFF3E0";
const BRAND_MID = "#FFA94D";
const BRAND_DARK = "#E65100";

const MOCK_USER = { email: "admin@gomap.pk", password: "admin123", name: "Zain Ahmed", role: "Super Admin", avatar: "ZA" };

const AGENCIES = [
  { id: 1, owner: "Muhammad Usman", phone: "+92 300 1234567", email: "usman@fastbus.pk", vehicles: 12, agency: "Fast Bus Co.", status: "Active" },
  { id: 2, owner: "Sara Khan", phone: "+92 321 9876543", email: "sara@citytrans.pk", vehicles: 8, agency: "City Transit", status: "Active" },
  { id: 3, owner: "Ahmed Raza", phone: "+92 333 4567890", email: "ahmed@greenline.pk", vehicles: 20, agency: "Green Line", status: "Inactive" },
  { id: 4, owner: "Fatima Malik", phone: "+92 311 2345678", email: "fatima@metrobus.pk", vehicles: 15, agency: "Metro Bus", status: "Active" },
  { id: 5, owner: "Hassan Ali", phone: "+92 345 6789012", email: "hassan@rapidride.pk", vehicles: 6, agency: "Rapid Ride", status: "Active" },
  { id: 6, owner: "Ayesha Siddiqui", phone: "+92 300 8901234", email: "ayesha@peoplexpress.pk", vehicles: 9, agency: "People Express", status: "Inactive" },
];

const VEHICLES = [
  { id: 1, name: "Express 01", reg: "KHI-2341", seats: 42, status: "Active", agency: "Fast Bus Co.", route: "Saddar → Gulshan" },
  { id: 2, name: "Metro B2", reg: "KHI-5678", seats: 38, status: "Active", agency: "City Transit", route: "DHA → Johar" },
  { id: 3, name: "Green 03", reg: "KHI-9012", seats: 50, status: "Inactive", agency: "Green Line", route: "Korangi → Clifton" },
  { id: 4, name: "Rapid 04", reg: "KHI-3456", seats: 30, status: "Active", agency: "Metro Bus", route: "Malir → Nazimabad" },
  { id: 5, name: "City 05", reg: "KHI-7890", seats: 44, status: "Active", agency: "Rapid Ride", route: "Surjani → Landhi" },
];

const USERS = [
  { id: 1, name: "Ali Hassan", email: "ali@gmail.com", loginDate: "Jun 07, 2026", status: "Active", initials: "AH" },
  { id: 2, name: "Sana Mirza", email: "sana@gmail.com", loginDate: "Jun 06, 2026", status: "Active", initials: "SM" },
  { id: 3, name: "Bilal Khan", email: "bilal@gmail.com", loginDate: "Jun 05, 2026", status: "Inactive", initials: "BK" },
  { id: 4, name: "Rabia Noor", email: "rabia@gmail.com", loginDate: "Jun 07, 2026", status: "Active", initials: "RN" },
  { id: 5, name: "Umar Farooq", email: "umar@gmail.com", loginDate: "Jun 04, 2026", status: "Active", initials: "UF" },
  { id: 6, name: "Hina Zaidi", email: "hina@gmail.com", loginDate: "Jun 03, 2026", status: "Inactive", initials: "HZ" },
];

const busPositions = [
  { x: 22, y: 38, route: "Saddar → Gulshan", id: "KHI-2341", status: "Active" },
  { x: 55, y: 25, route: "DHA → Johar", id: "KHI-5678", status: "Active" },
  { x: 70, y: 60, route: "Korangi → Clifton", id: "KHI-9012", status: "Delayed" },
  { x: 35, y: 65, route: "Malir → Nazimabad", id: "KHI-3456", status: "Active" },
  { x: 80, y: 35, route: "Surjani → Landhi", id: "KHI-7890", status: "Active" },
  { x: 45, y: 50, route: "Lyari → Gulshan", id: "KHI-1122", status: "Active" },
];

const routes = [
  { x1: 22, y1: 38, x2: 55, y2: 25 },
  { x1: 55, y1: 25, x2: 70, y2: 60 },
  { x1: 35, y1: 65, x2: 45, y2: 50 },
  { x1: 45, y1: 50, x2: 22, y2: 38 },
  { x1: 80, y1: 35, x2: 70, y2: 60 },
];

function css(obj) {
  return Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');
}

export default function App() {
  const [auth, setAuth] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showAddAgency, setShowAddAgency] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [agencySearch, setAgencySearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [rideSearch, setRideSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false });
  const [showPass, setShowPass] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [mapTick, setMapTick] = useState(0);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setMapTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    if (!loginData.email) { setLoginError("Email is required."); return; }
    if (!loginData.password) { setLoginError("Password is required."); return; }
    if (loginData.email !== MOCK_USER.email || loginData.password !== MOCK_USER.password) {
      setLoginError("Invalid email or password. Try admin@gomap.pk / admin123");
      return;
    }
    setLoginError("");
    setAuth(true);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setAuth(false);
    setScreen("dashboard");
    setLoginData({ email: "", password: "", remember: false });
  };

  const navTo = (s) => { setScreen(s); setShowAddAgency(false); setShowAddVehicle(false); setSelectedAgency(null); };

  if (!auth) return <LoginScreen loginData={loginData} setLoginData={setLoginData} showPass={showPass} setShowPass={setShowPass} loginError={loginError} onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#F8F6F2" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
      <Sidebar open={sidebarOpen} screen={screen} navTo={navTo} onLogout={handleLogout} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} screen={screen} onLogout={handleLogout} />
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {screen === "dashboard" && <DashboardScreen rideSearch={rideSearch} setRideSearch={setRideSearch} mapTick={mapTick} tooltip={tooltip} setTooltip={setTooltip} />}
          {screen === "agencies" && !selectedAgency && !showAddAgency && <AgenciesScreen search={agencySearch} setSearch={setAgencySearch} onView={(a) => setSelectedAgency(a)} onAdd={() => setShowAddAgency(true)} />}
          {screen === "agencies" && showAddAgency && <AddAgencyScreen onBack={() => setShowAddAgency(false)} />}
          {screen === "agencies" && selectedAgency && !showAddAgency && <AgencyDetailScreen agency={selectedAgency} onBack={() => setSelectedAgency(null)} showAddVehicle={showAddVehicle} setShowAddVehicle={setShowAddVehicle} vehicleSearch={vehicleSearch} setVehicleSearch={setVehicleSearch} />}
          {screen === "users" && <UsersScreen search={userSearch} setSearch={setUserSearch} />}
          {screen === "changepass" && <ChangePasswordScreen pwForm={pwForm} setPwForm={setPwForm} pwMsg={pwMsg} setPwMsg={setPwMsg} />}
        </main>
      </div>
    </div>
  );
}

function LoginScreen({ loginData, setLoginData, showPass, setShowPass, loginError, onLogin }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
      {/* Left illustration panel */}
      <div style={{ flex: 1, background: `linear-gradient(145deg, #FF8C00 0%, #FFA94D 50%, #FFD180 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        
        {/* Map illustration */}
        <svg width="340" height="280" viewBox="0 0 340 280" style={{ marginBottom: 32 }}>
          {/* Road network */}
          <path d="M20 140 Q80 60 170 80 Q240 95 320 60" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeDasharray="8,4" />
          <path d="M20 200 Q100 180 170 200 Q240 220 320 190" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeDasharray="8,4" />
          <path d="M170 20 Q160 80 165 140 Q168 200 170 260" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeDasharray="8,4" />
          <path d="M80 20 Q95 90 100 160 Q105 210 95 260" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" strokeDasharray="6,4" />
          <path d="M260 20 Q248 90 252 160 Q256 220 250 260" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" strokeDasharray="6,4" />
          
          {/* Active route highlight */}
          <path d="M20 140 Q80 60 170 80 Q240 95 320 60" stroke="rgba(255,255,255,0.7)" strokeWidth="4" fill="none" />
          
          {/* Location pins */}
          <g transform="translate(20,130)">
            <circle cx="0" cy="0" r="10" fill="white" opacity="0.9" />
            <circle cx="0" cy="0" r="5" fill="#FF8C00" />
          </g>
          <g transform="translate(320,50)">
            <circle cx="0" cy="0" r="10" fill="white" opacity="0.9" />
            <circle cx="0" cy="0" r="5" fill="#E65100" />
          </g>
          
          {/* Bus icons */}
          <g transform="translate(100,70)">
            <rect x="-18" y="-12" width="36" height="24" rx="5" fill="white" opacity="0.95" />
            <rect x="-14" y="-8" width="10" height="8" rx="2" fill="#FFA94D" opacity="0.8" />
            <rect x="2" y="-8" width="10" height="8" rx="2" fill="#FFA94D" opacity="0.8" />
            <circle cx="-10" cy="13" r="4" fill="white" opacity="0.9" />
            <circle cx="10" cy="13" r="4" fill="white" opacity="0.9" />
            <text x="0" y="5" fontSize="8" fill="#FF8C00" textAnchor="middle" fontWeight="700">BUS</text>
          </g>
          <g transform="translate(230,82)">
            <rect x="-18" y="-12" width="36" height="24" rx="5" fill="white" opacity="0.95" />
            <rect x="-14" y="-8" width="10" height="8" rx="2" fill="#FFA94D" opacity="0.8" />
            <rect x="2" y="-8" width="10" height="8" rx="2" fill="#FFA94D" opacity="0.8" />
            <circle cx="-10" cy="13" r="4" fill="white" opacity="0.9" />
            <circle cx="10" cy="13" r="4" fill="white" opacity="0.9" />
            <text x="0" y="5" fontSize="8" fill="#FF8C00" textAnchor="middle" fontWeight="700">BUS</text>
          </g>
          
          {/* Stat cards */}
          <g transform="translate(40,195)">
            <rect x="0" y="0" width="80" height="44" rx="8" fill="rgba(255,255,255,0.15)" />
            <text x="40" y="16" fontSize="9" fill="rgba(255,255,255,0.8)" textAnchor="middle">Active Rides</text>
            <text x="40" y="34" fontSize="18" fontWeight="700" fill="white" textAnchor="middle">24</text>
          </g>
          <g transform="translate(140,195)">
            <rect x="0" y="0" width="80" height="44" rx="8" fill="rgba(255,255,255,0.15)" />
            <text x="40" y="16" fontSize="9" fill="rgba(255,255,255,0.8)" textAnchor="middle">Vehicles</text>
            <text x="40" y="34" fontSize="18" fontWeight="700" fill="white" textAnchor="middle">70</text>
          </g>
          <g transform="translate(240,195)">
            <rect x="0" y="0" width="80" height="44" rx="8" fill="rgba(255,255,255,0.15)" />
            <text x="40" y="16" fontSize="9" fill="rgba(255,255,255,0.8)" textAnchor="middle">Agencies</text>
            <text x="40" y="34" fontSize="18" fontWeight="700" fill="white" textAnchor="middle">6</text>
          </g>
        </svg>

        <h1 style={{ color: "white", fontSize: 32, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>Go Map</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, textAlign: "center", maxWidth: 280, lineHeight: 1.6, margin: 0 }}>Smart public transportation & bus route management platform</p>
        
        <div style={{ display: "flex", gap: 20, marginTop: 32 }}>
          {["6 Agencies", "70 Vehicles", "24/7 Tracking"].map(t => (
            <div key={t} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 14px", color: "white", fontSize: 12, fontWeight: 500 }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div style={{ width: 480, background: "white", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 52px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: BRAND, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A1A1A" }}>Go Map</span>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" }}>Welcome back</h2>
        <p style={{ color: "#888", fontSize: 14, margin: "0 0 32px" }}>Sign in to your admin account</p>

        {loginError && (
          <div style={{ background: "#FFF0F0", border: "1px solid #FFB3B3", borderRadius: 10, padding: "12px 16px", color: "#C62828", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#C62828" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#C62828" strokeWidth="2" strokeLinecap="round"/></svg>
            {loginError}
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Email Address</label>
          <input
            type="email"
            placeholder="admin@gomap.pk"
            value={loginData.email}
            onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && document.getElementById("passfield").focus()}
            style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #E5E5E5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA", transition: "border 0.2s" }}
            onFocus={e => e.target.style.borderColor = BRAND}
            onBlur={e => e.target.style.borderColor = "#E5E5E5"}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="passfield"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={loginData.password}
              onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleLogin}
              style={{ width: "100%", padding: "12px 48px 12px 16px", border: "1.5px solid #E5E5E5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA" }}
              onFocus={e => e.target.style.borderColor = BRAND}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"}
            />
            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}>
              {showPass ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555", cursor: "pointer" }}>
            <input type="checkbox" checked={loginData.remember} onChange={e => setLoginData(p => ({ ...p, remember: e.target.checked }))} style={{ accentColor: BRAND, width: 15, height: 15 }} />
            Remember me
          </label>
          <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, color: BRAND, textDecoration: "none", fontWeight: 600 }}>Forgot password?</a>
        </div>

        <button
          onClick={onLogin}
          style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3 }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Sign In to Dashboard
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#BBB", marginTop: 28 }}>Go Map Admin Panel · v2.4.0 · © 2026 Go Map Technologies</p>
      </div>
    </div>
  );
}


function Sidebar({ open, screen, navTo, onLogout }) {
  const items = [
    { id: "dashboard", icon: <GridIcon />, label: "Dashboard" },
    { id: "agencies", icon: <BuildingIcon />, label: "Agencies" },
    { id: "users", icon: <UsersIcon />, label: "Users" },
    { id: "changepass", icon: <LockIcon />, label: "Change Password" },
  ];

  return (
    <div style={{
      width: open ? 240 : 68,
      background: "#1A1A2E",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
      flexShrink: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: BRAND, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white" />
          </svg>
        </div>
        {open && <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, color: "white", whiteSpace: "nowrap" }}>Go Map</span>}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        {open && <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, padding: "0 8px", margin: "0 0 8px", textTransform: "uppercase" }}>Main Menu</p>}
        {items.map(item => {
          const active = screen === item.id;
          return (
            <button key={item.id} onClick={() => navTo(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: open ? "11px 14px" : "11px 14px",
              justifyContent: open ? "flex-start" : "center",
              background: active ? `rgba(255,140,0,0.15)` : "transparent",
              border: `1px solid ${active ? "rgba(255,140,0,0.3)" : "transparent"}`,
              borderRadius: 10, cursor: "pointer", color: active ? BRAND_MID : "rgba(255,255,255,0.55)",
              fontSize: 14, fontWeight: active ? 600 : 400, transition: "all 0.2s", textAlign: "left", fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}>
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              {open && item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: 12, padding: open ? "11px 14px" : "11px 14px",
          justifyContent: open ? "flex-start" : "center",
          background: "transparent", border: "1px solid transparent", borderRadius: 10,
          cursor: "pointer", color: "rgba(255,100,100,0.7)", fontSize: 14, fontWeight: 400, width: "100%",
          fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,100,100,0.08)"; e.currentTarget.style.color = "rgba(255,120,120,0.95)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,100,100,0.7)"; }}>
          <LogoutIcon />
          {open && "Logout"}
        </button>
      </div>
    </div>
  );
}

function TopNav({ sidebarOpen, setSidebarOpen, screen, onLogout }) {
  const titles = { dashboard: "Dashboard", agencies: "Agencies", users: "Users", changepass: "Change Password" };
  return (
    <div style={{ height: 64, background: "white", borderBottom: "1px solid #F0EDE8", display: "flex", alignItems: "center", padding: "0 28px", gap: 16, flexShrink: 0 }}>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 4, display: "flex", borderRadius: 6 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{titles[screen]}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <button style={{ background: "#F8F6F2", border: "1px solid #EEE", borderRadius: 10, padding: "8px", cursor: "pointer", display: "flex", color: "#666" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, background: BRAND, borderRadius: "50%", border: "2px solid white" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8F6F2", border: "1px solid #EEE", borderRadius: 12, padding: "6px 14px 6px 6px" }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>ZA</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: 0, lineHeight: 1.2 }}>Zain Ahmed</p>
            <p style={{ fontSize: 11, color: "#999", margin: 0 }}>Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <span style={{ fontSize: 11, color: "#4CAF50", fontWeight: 600, background: "#E8F5E9", borderRadius: 20, padding: "3px 8px" }}>+4.2%</span>
      </div>
      <p style={{ fontSize: 28, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
      <p style={{ fontSize: 13, color: "#999", margin: "0 0 2px" }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: "#BBB", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function MapWidget({ mapTick, tooltip, setTooltip }) {
  const animated = busPositions.map((b, i) => ({
    ...b,
    ax: b.x + Math.sin((mapTick + i * 1.3) * 0.8) * 1.5,
    ay: b.y + Math.cos((mapTick + i * 0.9) * 0.7) * 1.2,
  }));

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden", position: "relative" }}>
      <div style={{ padding: "18px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F5F2EE" }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>Live Vehicle Tracking</h3>
          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Real-time positions across Karachi routes</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50", display: "inline-block", boxShadow: "0 0 0 3px rgba(76,175,80,0.2)" }} />
          <span style={{ fontSize: 12, color: "#4CAF50", fontWeight: 600 }}>Live</span>
          <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>{animated.length} vehicles tracked</span>
        </div>
      </div>
      <div style={{ position: "relative", background: "#F0F4E8", height: 320 }}>
        <svg width="100%" height="320" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
          {/* Grid lines */}
          {[20, 40, 60, 80].map(v => (
            <g key={v}>
              <line x1={v} y1={0} x2={v} y2={100} stroke="rgba(0,0,0,0.04)" strokeWidth="0.3" />
              <line x1={0} y1={v} x2={100} y2={v} stroke="rgba(0,0,0,0.04)" strokeWidth="0.3" />
            </g>
          ))}
          {/* Road network */}
          <path d="M5 30 Q30 10 50 25 Q70 38 95 20" stroke="#D4C9A8" strokeWidth="1.5" fill="none" />
          <path d="M5 50 Q25 45 50 55 Q75 62 95 50" stroke="#D4C9A8" strokeWidth="1.5" fill="none" />
          <path d="M5 70 Q30 75 50 68 Q70 62 95 75" stroke="#C8BFA0" strokeWidth="1" fill="none" />
          <path d="M20 5 Q22 30 20 55 Q18 75 22 95" stroke="#D4C9A8" strokeWidth="1.2" fill="none" />
          <path d="M50 5 Q52 30 50 55 Q48 75 50 95" stroke="#D4C9A8" strokeWidth="1.2" fill="none" />
          <path d="M80 5 Q78 30 80 55 Q82 75 80 95" stroke="#C8BFA0" strokeWidth="1" fill="none" />

          {/* Active routes */}
          {routes.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#FF8C00" strokeWidth="0.6" opacity="0.5" strokeDasharray="3,2" />
          ))}

          {/* Buses */}
          {animated.map((b, i) => (
            <g key={i} transform={`translate(${b.ax}, ${b.ay})`} style={{ cursor: "pointer" }}
              onClick={() => setTooltip(tooltip?.id === b.id ? null : b)}>
              <circle cx="0" cy="0" r="4" fill={b.status === "Delayed" ? "#F44336" : "#FF8C00"} opacity="0.2" />
              <circle cx="0" cy="0" r="2.5" fill={b.status === "Delayed" ? "#F44336" : "#FF8C00"} />
              <circle cx="0" cy="0" r="1" fill="white" />
            </g>
          ))}

          {/* Stop markers */}
          {[{x:5,y:30,n:"Saddar"},{x:95,y:20,n:"Gulshan"},{x:5,y:70,n:"Malir"},{x:95,y:75,n:"Clifton"}].map((s,i) => (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r="2" fill="white" stroke="#888" strokeWidth="0.5" />
            </g>
          ))}
        </svg>

        {/* Area labels */}
        {[{t:"SADDAR",l:"5%",top:"22%"},{t:"DHA",l:"70%",top:"10%"},{t:"GULSHAN",l:"85%",top:"30%"},{t:"MALIR",l:"8%",top:"68%"},{t:"CLIFTON",l:"60%",top:"75%"}].map(a => (
          <div key={a.t} style={{ position: "absolute", left: a.l, top: a.top, fontSize: 9, color: "#999", fontWeight: 600, letterSpacing: 1, pointerEvents: "none", userSelect: "none" }}>{a.t}</div>
        ))}

        {/* Tooltip */}
        {tooltip && (
          <div style={{ position: "absolute", left: `${Math.min(tooltip.ax, 75)}%`, top: `${Math.max(tooltip.ay - 15, 5)}%`, background: "white", border: "1px solid #EEE", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", minWidth: 160, zIndex: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>{tooltip.id}</p>
            <p style={{ fontSize: 11, color: "#666", margin: "0 0 2px" }}>{tooltip.route}</p>
            <span style={{ fontSize: 10, fontWeight: 600, background: tooltip.status === "Delayed" ? "#FFEBEE" : "#E8F5E9", color: tooltip.status === "Delayed" ? "#C62828" : "#2E7D32", borderRadius: 4, padding: "2px 8px" }}>{tooltip.status}</span>
          </div>
        )}

        {/* Legend */}
        <div style={{ position: "absolute", bottom: 12, right: 14, background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "8px 12px", display: "flex", gap: 12, fontSize: 11, color: "#666" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF8C00", display: "inline-block" }} />Active</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F44336", display: "inline-block" }} />Delayed</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 2, background: "#FF8C00", display: "inline-block", opacity: 0.5 }} />Route</span>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen({ rideSearch, setRideSearch, mapTick, tooltip, setTooltip }) {
  const filtered = VEHICLES.filter(v =>
    v.name.toLowerCase().includes(rideSearch.toLowerCase()) ||
    v.reg.toLowerCase().includes(rideSearch.toLowerCase())
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPIs */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPICard icon={<BuildingIcon color={BRAND} />} label="Total Agencies" value="6" sub="Active operations" color={BRAND} />
        <KPICard icon={<BusIcon color="#7C3AED" />} label="Total Vehicles" value="70" sub="Across all agencies" color="#7C3AED" />
        <KPICard icon={<RouteIcon color="#059669" />} label="Active Rides" value="24" sub="Right now" color="#059669" />
        <KPICard icon={<UsersIcon color="#2563EB" />} label="Total Users" value="1,284" sub="Registered passengers" color="#2563EB" />
      </div>

      {/* Map */}
      <MapWidget mapTick={mapTick} tooltip={tooltip} setTooltip={setTooltip} />

      {/* Rides table */}
      <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F5F2EE", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>Total Active Rides</h3>
            <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Currently running vehicles</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <SearchBar value={rideSearch} onChange={setRideSearch} placeholder="Search vehicle..." />
            <FilterBtn />
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAF8" }}>
                {["S.No", "Vehicle Name", "Reg. Number", "Seats", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#888", borderBottom: "1px solid #F0EDE8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id} style={{ borderBottom: "1px solid #F8F6F2" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FDFCFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#888" }}>{i + 1}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: BRAND_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BusIcon color={BRAND} size={16} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{v.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#444" }}>{v.reg}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#444" }}>{v.seats}</td>
                  <td style={{ padding: "14px 20px" }}><StatusBadge status={v.status} /></td>
                  <td style={{ padding: "14px 20px" }}>
                    <button style={{ background: BRAND_LIGHT, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: BRAND }}>
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={filtered.length} />
      </div>
    </div>
  );
}

function AgenciesScreen({ search, setSearch, onView, onAdd }) {
  const filtered = AGENCIES.filter(a =>
    a.owner.toLowerCase().includes(search.toLowerCase()) ||
    a.agency.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F5F2EE", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>All Agencies</h3>
            <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{filtered.length} registered agencies</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search agencies..." />
            <button onClick={onAdd} style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, color: "white", border: "none", borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>+</span> Add Agency
            </button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAF8" }}>
                {["S.No", "Agency", "Owner Name", "Phone", "Email", "Vehicles", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#888", borderBottom: "1px solid #F0EDE8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #F8F6F2" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FDFCFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#888" }}>{i + 1}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: BRAND_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: BRAND }}>{a.agency[0]}</div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{a.agency}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#444" }}>{a.owner}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#444" }}>{a.phone}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#444" }}>{a.email}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{a.vehicles}</td>
                  <td style={{ padding: "14px 20px" }}><StatusBadge status={a.status} /></td>
                  <td style={{ padding: "14px 20px" }}>
                    <button onClick={() => onView(a)} style={{ background: BRAND_LIGHT, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: BRAND }}>
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={filtered.length} />
      </div>
    </div>
  );
}

function AddAgencyScreen({ onBack }) {
  const [form, setForm] = useState({ name: "", owner: "", phone: "", whatsapp: "", email: "" });
  const [saved, setSaved] = useState(false);
  const handle = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 13, fontFamily: "inherit", marginBottom: 20, padding: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m7-7-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to Agencies
      </button>
      <div style={{ background: "white", borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, padding: "28px 32px" }}>
          <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add New Agency</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: 0 }}>Register a new transportation agency on the platform</p>
        </div>
        <div style={{ padding: "32px" }}>
          {/* Upload */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <div style={{ width: 100, height: 100, borderRadius: 20, border: "2px dashed #E5E5E5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#FAFAF8", gap: 6 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.background = BRAND_LIGHT; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.background = "#FAFAF8"; }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: 10, color: "#999", textAlign: "center" }}>Upload Logo</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { label: "Agency Name", key: "name", placeholder: "e.g. Fast Bus Co." },
              { label: "Owner Name", key: "owner", placeholder: "e.g. Muhammad Usman" },
              { label: "Phone Number", key: "phone", placeholder: "+92 300 1234567" },
              { label: "WhatsApp Number", key: "whatsapp", placeholder: "+92 300 1234567" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E5E5", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA" }}
                  onFocus={e => e.target.style.borderColor = BRAND}
                  onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Email Address</label>
            <input type="email" placeholder="agency@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E5E5", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA" }}
              onFocus={e => e.target.style.borderColor = BRAND}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <button onClick={handle} style={{ flex: 1, padding: "13px", background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {saved ? "✓ Agency Added!" : "Add Agency"}
            </button>
            <button onClick={onBack} style={{ padding: "13px 24px", background: "white", color: "#666", border: "1.5px solid #E5E5E5", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgencyDetailScreen({ agency, onBack, showAddVehicle, setShowAddVehicle, vehicleSearch, setVehicleSearch }) {
  if (showAddVehicle) return <AddVehicleScreen onBack={() => setShowAddVehicle(false)} />;
  const agencyVehicles = VEHICLES.filter(v => v.agency === agency.agency || VEHICLES.slice(0, agency.vehicles));
  const filtered = agencyVehicles.filter(v =>
    v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    v.reg.toLowerCase().includes(vehicleSearch.toLowerCase())
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 13, fontFamily: "inherit", padding: 0, alignSelf: "flex-start" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m7-7-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to Agencies
      </button>

      {/* Agency Profile Card */}
      <div style={{ background: "white", borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, padding: "32px", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800, color: "white", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{agency.agency[0]}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{agency.agency}</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: "0 0 12px" }}>Transportation Agency · Karachi, Pakistan</p>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 11, fontWeight: 600, borderRadius: 20, padding: "4px 12px" }}>✓ Verified</span>
              <StatusBadge status={agency.status} light />
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "16px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: "white", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{agency.vehicles}</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: "4px 0 0" }}>Total Vehicles</p>
          </div>
        </div>
        <div style={{ padding: "28px 32px", display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[
            { label: "Owner", value: agency.owner, icon: "👤" },
            { label: "Phone", value: agency.phone, icon: "📞" },
            { label: "Email", value: agency.email, icon: "📧" },
            { label: "WhatsApp", value: agency.phone, icon: "💬" },
          ].map(info => (
            <div key={info.label} style={{ minWidth: 160 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#BBB", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>{info.label}</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", margin: 0 }}>{info.value}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 32px 28px", display: "flex", gap: 12 }}>
          <button style={{ padding: "10px 22px", background: BRAND_LIGHT, color: BRAND, border: `1.5px solid ${BRAND}33`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>View All Vehicles</button>
          <button onClick={() => setShowAddVehicle(true)} style={{ padding: "10px 22px", background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>+ Add New Vehicle</button>
        </div>
      </div>

      {/* Vehicle table */}
      <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F5F2EE", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Vehicles ({agencyVehicles.length})</h3>
          <SearchBar value={vehicleSearch} onChange={setVehicleSearch} placeholder="Search vehicles..." />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAF8" }}>
                {["S.No", "Vehicle", "Reg. Number", "Route", "Seats", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#888", borderBottom: "1px solid #F0EDE8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VEHICLES.map((v, i) => (
                <tr key={v.id} style={{ borderBottom: "1px solid #F8F6F2" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FDFCFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#888" }}>{i + 1}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 44, height: 34, borderRadius: 8, background: BRAND_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BusIcon color={BRAND} size={18} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{v.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#444", fontFamily: "monospace" }}>{v.reg}</td>
                  <td style={{ padding: "14px 20px", fontSize: 12, color: "#666" }}>{v.route}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#444" }}>{v.seats}</td>
                  <td style={{ padding: "14px 20px" }}><StatusBadge status={v.status} /></td>
                  <td style={{ padding: "14px 20px" }}>
                    <button style={{ background: BRAND_LIGHT, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: BRAND }}>
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={VEHICLES.length} />
      </div>
    </div>
  );
}

function AddVehicleScreen({ onBack }) {
  const [form, setForm] = useState({ name: "", reg: "", start: "", end: "", seats: "" });
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 13, fontFamily: "inherit", marginBottom: 20, padding: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m7-7-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to Agency
      </button>
      <div style={{ background: "white", borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, padding: "28px 32px" }}>
          <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add New Vehicle</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: 0 }}>Register a new bus or transport vehicle</p>
        </div>
        <div style={{ padding: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {[
              { label: "Vehicle Name", key: "name", placeholder: "e.g. Express 01" },
              { label: "Registration Number", key: "reg", placeholder: "e.g. KHI-2341" },
              { label: "Route Start Location", key: "start", placeholder: "e.g. Saddar" },
              { label: "Route End Location", key: "end", placeholder: "e.g. Gulshan-e-Iqbal" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E5E5", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA" }}
                  onFocus={e => e.target.style.borderColor = BRAND}
                  onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
              </div>
            ))}
          </div>

          {/* Upload zones */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {["Vehicle Image", "Documents (Optional)"].map(label => (
              <div key={label}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{label}</label>
                <div style={{ border: "2px dashed #E5E5E5", borderRadius: 12, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#FAFAF8", gap: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.background = BRAND_LIGHT; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.background = "#FAFAF8"; }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={BRAND} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <p style={{ fontSize: 12, color: "#999", margin: 0, textAlign: "center" }}>Drop files or <span style={{ color: BRAND, fontWeight: 600 }}>browse</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* Map route selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Route Map Selector</label>
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #E5E5E5", height: 180, background: "#F0F4E8", position: "relative", cursor: "crosshair" }}>
              <svg width="100%" height="180" viewBox="0 0 100 50" preserveAspectRatio="none">
                {[10,25,40,55,70,85].map(v => <line key={v} x1={v} y1={0} x2={v} y2={50} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />)}
                {[10,25,40].map(v => <line key={v} x1={0} y1={v} x2={100} y2={v} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />)}
                <path d="M10 35 Q30 20 50 25 Q70 30 90 15" stroke="#D4C9A8" strokeWidth="1.5" fill="none" />
                <path d="M10 35 Q30 20 50 25 Q70 30 90 15" stroke={BRAND} strokeWidth="1.5" fill="none" opacity="0.7" strokeDasharray="4,3" />
                <circle cx="10" cy="35" r="2" fill={BRAND} />
                <circle cx="90" cy="15" r="2" fill="#E65100" />
                <text x="12" y="33" fontSize="3.5" fill="#666">Start</text>
                <text x="82" y="13" fontSize="3.5" fill="#666">End</text>
              </svg>
              <div style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, color: "#888", background: "rgba(255,255,255,0.8)", borderRadius: 4, padding: "2px 6px" }}>Click to set route points</div>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Number of Seats</label>
            <input type="number" placeholder="e.g. 42" value={form.seats} onChange={e => setForm(p => ({ ...p, seats: e.target.value }))}
              style={{ width: 160, padding: "11px 14px", border: "1.5px solid #E5E5E5", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA" }}
              onFocus={e => e.target.style.borderColor = BRAND}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              style={{ flex: 1, padding: "13px", background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {saved ? "✓ Vehicle Added!" : "Add Vehicle"}
            </button>
            <button onClick={onBack} style={{ padding: "13px 24px", background: "white", color: "#666", border: "1.5px solid #E5E5E5", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersScreen({ search, setSearch }) {
  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const colors = ["#FF8C00", "#7C3AED", "#059669", "#2563EB", "#DC2626", "#0891B2"];
  return (
    <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #F5F2EE", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>All Users</h3>
          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{filtered.length} registered users</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAFAF8" }}>
              {["User", "Full Name", "Email Address", "Last Login", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#888", borderBottom: "1px solid #F0EDE8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #F8F6F2" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FDFCFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: colors[i % colors.length] + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: colors[i % colors.length] }}>
                    {u.initials}
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{u.name}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#666" }}>{u.email}</td>
                <td style={{ padding: "14px 20px", fontSize: 12, color: "#999" }}>{u.loginDate}</td>
                <td style={{ padding: "14px 20px" }}><StatusBadge status={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={filtered.length} />
    </div>
  );
}

function ChangePasswordScreen({ pwForm, setPwForm, pwMsg, setPwMsg }) {
  const [showFields, setShowFields] = useState({ current: false, new: false, confirm: false });
  const handle = () => {
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { setPwMsg("error:All fields are required."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg("error:New passwords do not match."); return; }
    if (pwForm.newPw.length < 6) { setPwMsg("error:Password must be at least 6 characters."); return; }
    setPwMsg("success:Password updated successfully!");
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwMsg(""), 3000);
  };
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, padding: "28px 32px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LockIcon color="white" size={22} />
          </div>
          <div>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Change Password</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: 0 }}>Update your admin account password</p>
          </div>
        </div>
        <div style={{ padding: "32px" }}>
          {pwMsg && (
            <div style={{ background: pwMsg.startsWith("error") ? "#FFF0F0" : "#F0FFF4", border: `1px solid ${pwMsg.startsWith("error") ? "#FFB3B3" : "#86EFAC"}`, borderRadius: 10, padding: "12px 16px", color: pwMsg.startsWith("error") ? "#C62828" : "#166534", fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              {pwMsg.startsWith("error") ? "⚠️" : "✓"} {pwMsg.split(":")[1]}
            </div>
          )}

          {[
            { label: "Current Password", key: "current", placeholder: "Enter current password", showKey: "current" },
            { label: "New Password", key: "newPw", placeholder: "Enter new password", showKey: "new" },
            { label: "Confirm New Password", key: "confirm", placeholder: "Confirm new password", showKey: "confirm" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{f.label}</label>
              <div style={{ position: "relative" }}>
                <input type={showFields[f.showKey] ? "text" : "password"} placeholder={f.placeholder} value={pwForm[f.key]}
                  onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "12px 44px 12px 14px", border: "1.5px solid #E5E5E5", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAFA" }}
                  onFocus={e => e.target.style.borderColor = BRAND}
                  onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
                <button onClick={() => setShowFields(p => ({ ...p, [f.showKey]: !p[f.showKey] }))}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
              </div>
            </div>
          ))}

          <div style={{ background: "#FFF8EE", border: "1px solid #FFE0A0", borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 12, color: "#B45309" }}>
            <strong>Password requirements:</strong> Minimum 6 characters, use a mix of letters and numbers for best security.
          </div>

          <button onClick={handle}
            style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

// Shared components
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 12, color: "#BBB" }}>
        <circle cx="11" cy="11" r="8" stroke="#BBB" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" stroke="#BBB" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: "9px 14px 9px 34px", border: "1.5px solid #E5E5E5", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit", background: "#FAFAFA", width: 220 }}
        onFocus={e => e.target.style.borderColor = BRAND}
        onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
    </div>
  );
}

function FilterBtn() {
  return (
    <button style={{ background: "#F5F2EE", border: "1.5px solid #E5E5E5", borderRadius: 10, padding: "9px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666", fontFamily: "inherit" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
      Filter
    </button>
  );
}

function StatusBadge({ status, light }) {
  const active = status === "Active";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600,
      padding: "4px 10px", borderRadius: 20,
      background: light ? (active ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)") : (active ? "#E8F5E9" : "#FFF3E0"),
      color: light ? "white" : (active ? "#2E7D32" : "#E65100"),
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: light ? "white" : (active ? "#4CAF50" : "#FF8C00"), display: "inline-block" }} />
      {status}
    </span>
  );
}

function Pagination({ total }) {
  return (
    <div style={{ padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F5F2EE" }}>
      <span style={{ fontSize: 12, color: "#999" }}>Showing 1–{Math.min(total, 10)} of {total} results</span>
      <div style={{ display: "flex", gap: 6 }}>
        {["‹", "1", "2", "›"].map(p => (
          <button key={p} style={{ width: 30, height: 30, borderRadius: 8, border: p === "1" ? `1.5px solid ${BRAND}` : "1.5px solid #E5E5E5", background: p === "1" ? BRAND_LIGHT : "white", color: p === "1" ? BRAND : "#666", cursor: "pointer", fontSize: 13, fontWeight: p === "1" ? 700 : 400, fontFamily: "inherit" }}>{p}</button>
        ))}
      </div>
    </div>
  );
}

// Icons
function GridIcon({ color = "currentColor", size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" /></svg>;
}
function BuildingIcon({ color = "currentColor", size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M8 11h2m-2 4h2m4-4h2m-2 4h2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function UsersIcon({ color = "currentColor", size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LockIcon({ color = "currentColor", size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="1.8" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function LogoutIcon({ color = "currentColor", size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BusIcon({ color = "currentColor", size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M8 6h8a4 4 0 0 1 4 4v7H4v-7a4 4 0 0 1 4-4z" stroke={color} strokeWidth="1.8" /><path d="M4 13h16M9 17v2M15 17v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" /><circle cx="9" cy="16" r="1" fill={color} /><circle cx="15" cy="16" r="1" fill={color} /></svg>;
}
function EyeIcon({ color = "currentColor", size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color || "currentColor"} strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke={color || "currentColor"} strokeWidth="2" /></svg>;
}
function RouteIcon({ color = "currentColor", size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="6" cy="19" r="3" stroke={color} strokeWidth="1.8" /><circle cx="18" cy="5" r="3" stroke={color} strokeWidth="1.8" /><path d="M6 16V9a3 3 0 0 1 3-3h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
