import { useState, useRef, useEffect } from "react";

const PALETTES = [
  { bg: "#FF6B6B", glow: "#ff6b6b55", icon: "📐", grad: ["#FF6B6B", "#FF8E53"] },
  { bg: "#4ECDC4", glow: "#4ecdc455", icon: "⚛️", grad: ["#4ECDC4", "#44A08D"] },
  { bg: "#A78BFA", glow: "#a78bfa55", icon: "🧬", grad: ["#A78BFA", "#7C3AED"] },
  { bg: "#34D399", glow: "#34d39955", icon: "📖", grad: ["#34D399", "#059669"] },
  { bg: "#FBBF24", glow: "#fbbf2455", icon: "🔬", grad: ["#FBBF24", "#F59E0B"] },
  { bg: "#F472B6", glow: "#f472b655", icon: "🎭", grad: ["#F472B6", "#EC4899"] },
  { bg: "#60A5FA", glow: "#60a5fa55", icon: "🌍", grad: ["#60A5FA", "#3B82F6"] },
  { bg: "#FB923C", glow: "#fb923c55", icon: "💻", grad: ["#FB923C", "#EA580C"] },
];

const fmt = (m) => {
  if (!m) return "0m";
  const h = Math.floor(m / 60), r = m % 60;
  return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${r}m`;
};

const sumMins = (subs) => subs.reduce((a, s) => a + s.hours * 60 + s.minutes, 0);

/* ── Particle canvas burst ── */
function Particles({ id }) {
  const ref = useRef();
  useEffect(() => {
    if (!id) return;
    const c = ref.current; if (!c) return;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const ctx = c.getContext("2d");
    const cx = c.width / 2, cy = c.height * 0.55;
    const cols = ["#6C63FF", "#4ECDC4", "#FF6B6B", "#FBBF24", "#F472B6", "#34D399", "#ffffff", "#A78BFA"];
    const pts = Array.from({ length: 90 }, () => {
      const a = Math.random() * Math.PI * 2, spd = 3 + Math.random() * 9;
      return {
        x: cx, y: cy, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 2,
        life: 1, decay: .012 + Math.random() * .022,
        sz: 3 + Math.random() * 7, col: cols[Math.floor(Math.random() * cols.length)],
        star: Math.random() > .55
      };
    });
    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      pts.forEach(p => {
        if (p.life <= 0) return; alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += .18; p.life -= p.decay;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.col;
        ctx.beginPath();
        if (p.star) {
          const s = p.sz * p.life;
          for (let i = 0; i < 5; i++) {
            const a = (i * Math.PI * 4 / 5) - Math.PI / 2;
            const r = i % 2 === 0 ? s : s * .4;
            ctx[i === 0 ? "moveTo" : "lineTo"](p.x + r * Math.cos(a), p.y + r * Math.sin(a));
          }
          ctx.closePath();
        } else {
          ctx.arc(p.x, p.y, p.sz * p.life * .8, 0, Math.PI * 2);
        }
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (alive) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [id]);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }} />;
}

/* ── Scanline reveal overlay ── */
function Scanline({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none", overflow: "hidden", borderRadius: "inherit" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg,transparent,#6C63FF,#4ECDC4,transparent)",
        animation: "scanMove .75s ease-out forwards",
        boxShadow: "0 0 24px #6C63FFcc, 0 0 48px #4ECDC488"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(108,99,255,0.05) 2px,rgba(108,99,255,0.05) 4px)",
        animation: "fadeAway .9s ease-out forwards"
      }} />
    </div>
  );
}

/* ── Canvas drawing for download ── */
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}

async function buildCanvas({ name, photo, subjects, totalH, totalM }) {
  const W = 480, H = Math.max(620, 200 + subjects.filter(s => s.name.trim()).length * 68);
  const sc = 2;
  const cv = document.createElement("canvas");
  cv.width = W * sc; cv.height = H * sc;
  const ctx = cv.getContext("2d");
  ctx.scale(sc, sc);

  // BG
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d0b1e"); bg.addColorStop(.5, "#0a1628"); bg.addColorStop(1, "#0d1a10");
  rr(ctx, 0, 0, W, H, 24); ctx.fillStyle = bg; ctx.fill();

  // glow blobs
  const blob = (x, y, r, col) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col); g.addColorStop(1, "transparent");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };
  blob(W * .85, 60, 180, "rgba(108,99,255,.2)");
  blob(W * .1, H * .8, 150, "rgba(78,205,196,.14)");

  // border
  rr(ctx, .75, .75, W - 1.5, H - 1.5, 24);
  ctx.strokeStyle = "rgba(108,99,255,.5)"; ctx.lineWidth = 1.5; ctx.stroke();

  // corner marks
  [[0, 0, "24px 0 0 0"], [W, 0, "0 24px 0 0"], [0, H, "0 0 0 24px"], [W, H, "0 0 24px 0"]].forEach(([cx2, cy2]) => {
    const sz = 18, pad = 1;
    const px = cx2 === 0 ? pad : cx2 - sz - pad, py = cy2 === 0 ? pad : cy2 - sz - pad;
    ctx.strokeStyle = "rgba(108,99,255,.7)"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (cx2 === 0 && cy2 === 0) { ctx.moveTo(px, py + sz); ctx.lineTo(px, py); ctx.lineTo(px + sz, py); }
    else if (cx2 === W && cy2 === 0) { ctx.moveTo(px, py); ctx.lineTo(px + sz, py); ctx.lineTo(px + sz, py + sz); }
    else if (cx2 === 0 && cy2 === H) { ctx.moveTo(px, py); ctx.lineTo(px, py + sz); ctx.lineTo(px + sz, py + sz); }
    else { ctx.moveTo(px, py + sz); ctx.lineTo(px + sz, py + sz); ctx.lineTo(px + sz, py); }
    ctx.stroke();
  });

  // grid
  ctx.strokeStyle = "rgba(108,99,255,.04)"; ctx.lineWidth = 1;
  for (let x = 28; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 28; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(0 + W, y); ctx.stroke(); }

  // date
  const d = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  ctx.font = "500 11px sans-serif"; ctx.fillStyle = "rgba(255,255,255,.4)";
  ctx.fillText("📅 " + d, 26, 34);

  // label
  ctx.font = "600 10px sans-serif"; ctx.fillStyle = "rgba(255,255,255,.45)";
  ctx.fillText("TODAY'S TOTAL TIME", 26, 58);

  // big time
  const timeStr = `${totalH}h ${totalM}m`;
  ctx.font = "900 44px sans-serif";
  const tg = ctx.createLinearGradient(26, 65, 280, 105);
  tg.addColorStop(0, "#ffffff"); tg.addColorStop(1, "#a78bfa");
  ctx.fillStyle = tg; ctx.fillText(timeStr, 26, 106);

  // avatar
  const avX = W - 68, avY = 52, avR = 42;
  const ag = ctx.createRadialGradient(avX, avY, avR - 4, avX, avY, avR + 20);
  ag.addColorStop(0, "rgba(108,99,255,.5)"); ag.addColorStop(1, "transparent");
  ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(avX, avY, avR + 18, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(108,99,255,.8)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(avX, avY, avR, 0, Math.PI * 2); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.arc(avX, avY, avR - 2, 0, Math.PI * 2); ctx.clip();
  if (photo) {
    const img = new Image(); img.src = photo;
    await new Promise(res => { img.onload = res; img.onerror = res; });
    ctx.drawImage(img, avX - avR + 2, avY - avR + 2, (avR - 2) * 2, (avR - 2) * 2);
  } else {
    const eg = ctx.createLinearGradient(avX - avR, avY - avR, avX + avR, avY + avR);
    eg.addColorStop(0, "#6C63FF"); eg.addColorStop(1, "#4ECDC4");
    ctx.fillStyle = eg; ctx.fillRect(avX - avR, avY - avR, avR * 2, avR * 2);
    ctx.font = `${avR * .9}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🧑‍🎓", avX, avY);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  ctx.restore();

  // name
  ctx.font = "800 20px sans-serif"; ctx.fillStyle = "#fff";
  ctx.fillText((name || "Student") + " 📚", 26, 148);

  // divider
  const dg = ctx.createLinearGradient(26, 0, W - 26, 0);
  dg.addColorStop(0, "transparent"); dg.addColorStop(.35, "rgba(108,99,255,.6)");
  dg.addColorStop(.65, "rgba(78,205,196,.6)"); dg.addColorStop(1, "transparent");
  ctx.strokeStyle = dg; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(26, 163); ctx.lineTo(W - 26, 163); ctx.stroke();

  // subjects
  const valSubs = subjects.filter(s => s.name.trim());
  const maxM = Math.max(...valSubs.map(s => s.hours * 60 + s.minutes), 1);
  const startY = 182, rowH = 60;
  valSubs.forEach((sub, i) => {
    const pal = PALETTES[i % PALETTES.length];
    const mins = sub.hours * 60 + sub.minutes;
    const pct = mins / maxM;
    const y = startY + i * rowH;

    // dot
    ctx.fillStyle = pal.bg;
    ctx.beginPath(); ctx.arc(30, y + 12, 4, 0, Math.PI * 2); ctx.fill();

    // subject name
    ctx.font = "600 13px sans-serif"; ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.fillText(sub.name, 42, y + 16);

    // time
    ctx.font = "700 13px sans-serif"; ctx.fillStyle = pal.bg;
    ctx.textAlign = "right"; ctx.fillText(fmt(mins), W - 26, y + 16); ctx.textAlign = "left";

    // track
    const bY = y + 22, bH = 7, bW = W - 52;
    rr(ctx, 26, bY, bW, bH, 4); ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.fill();

    // fill
    const fw = Math.max(bW * pct, mins > 0 ? 6 : 0);
    const fg = ctx.createLinearGradient(26, 0, 26 + fw, 0);
    fg.addColorStop(0, pal.grad[0] + "cc"); fg.addColorStop(1, pal.grad[1]);
    rr(ctx, 26, bY, fw, bH, 4); ctx.fillStyle = fg; ctx.fill();

    // glow tip
    if (fw > 8) {
      const eg2 = ctx.createRadialGradient(26 + fw, bY + bH / 2, 0, 26 + fw, bY + bH / 2, 16);
      eg2.addColorStop(0, pal.bg + "66"); eg2.addColorStop(1, "transparent");
      ctx.fillStyle = eg2; ctx.fillRect(26 + fw - 16, bY - 9, 32, bH + 18);
    }
  });

  // footer
  const fY = startY + valSubs.length * rowH + 12;
  ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(26, fY); ctx.lineTo(W - 26, fY); ctx.stroke();
  ctx.font = "600 11px sans-serif"; ctx.fillStyle = "rgba(255,200,0,.8)";
  ctx.fillText("🔥 Keep grinding!", 26, fY + 22);
  ctx.fillStyle = "rgba(108,99,255,.8)"; ctx.textAlign = "right";
  ctx.fillText("StudyCard ✦", W - 26, fY + 22); ctx.textAlign = "left";

  return cv;
}

/* ══════════════════════════════════════════════════════ */
export default function App() {
  const [name, setName] = useState("Hridoy");
  const [photo, setPhoto] = useState(null);
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Math", hours: 3, minutes: 48 },
    { id: 2, name: "Physics", hours: 2, minutes: 12 },
    { id: 3, name: "Biology", hours: 1, minutes: 25 },
    { id: 4, name: "Bangla 1st", hours: 0, minutes: 44 },
  ]);
  const [gen, setGen] = useState(false);
  const [burst, setBurst] = useState(0);
  const [scan, setScan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dlLoading, setDlLoading] = useState(false);
  const fileRef = useRef();
  const nid = useRef(5);

  const total = sumMins(subjects);
  const totalH = Math.floor(total / 60), totalM = total % 60;
  const maxM = Math.max(...subjects.map(s => s.hours * 60 + s.minutes), 1);
  const valid = subjects.filter(s => s.name.trim());

  const addSub = () => setSubjects(p => [...p, { id: nid.current++, name: "", hours: 0, minutes: 0 }]);
  const delSub = (id) => setSubjects(p => p.filter(s => s.id !== id));
  const upd = (id, f, v) => setSubjects(p => p.map(s => s.id === id ? { ...s, [f]: v } : s));

  const onPhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = ev => setPhoto(ev.target.result); r.readAsDataURL(file);
  };

  const generate = () => {
    setLoading(true); setGen(false);
    setTimeout(() => {
      setGen(true); setLoading(false);
      setScan(true); setBurst(b => b + 1);
      setTimeout(() => setScan(false), 950);
    }, 800);
  };

  const download = async () => {
    setDlLoading(true);
    try {
      const cv = await buildCanvas({ name, photo, subjects, totalH, totalM });
      const a = document.createElement("a");
      a.download = `studycard-${(name || "student").toLowerCase().replace(/\s+/g, "-")}.png`;
      a.href = cv.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
    }
    setDlLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080814; }
        @keyframes scanMove { 0% { top: -3px; opacity: 1 } 100% { top: 100%; opacity: .2 } }
        @keyframes fadeAway { 0% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes floatUp { from { opacity: 0; transform: translateY(36px) scale(.94) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 30px #6C63FF44, 0 30px 80px rgba(0,0,0,.7), inset 0 0 0 1px rgba(108,99,255,.2) } 50% { box-shadow: 0 0 60px #6C63FF88, 0 30px 80px rgba(0,0,0,.7), inset 0 0 0 1px rgba(108,99,255,.5) } }
        @keyframes shimmer { 0% { background-position: -300% center } 100% { background-position: 300% center } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(40px) rotate(0deg) } to { transform: rotate(360deg) translateX(40px) rotate(-360deg) } }
        @keyframes orbitB { from { transform: rotate(180deg) translateX(52px) rotate(-180deg) } to { transform: rotate(540deg) translateX(52px) rotate(-540deg) } }
        @keyframes pop { 0% { opacity: 0; transform: scale(.4) } 70% { transform: scale(1.1) } 100% { opacity: 1; transform: scale(1) } }
        @keyframes rowIn { from { opacity: 0; transform: translateX(-16px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes barIn { from { width: 0% } to {} }
        @keyframes countIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes dlPop { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        .pho:hover .pho-ov { opacity: 1 !important; }
        .add-btn:hover { background: rgba(255,255,255,.09) !important; color: #ddd !important; }
        .rm-btn:hover { background: rgba(255,70,70,.3) !important; }
        .gen-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 36px #6C63FFaa !important; }
        .gen-btn:active:not(:disabled) { transform: translateY(0); }
        .dl-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.2); }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      <Particles id={burst} />

      <div style={{
        minHeight: "100vh",
        fontFamily: "'Outfit', sans-serif",
        background: "#080814",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "44px 16px 80px",
        position: "relative",
        overflow: "hidden"
      }}>

        {/* ambient blobs */}
        <div style={{ position: "fixed", top: -100, left: -100, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle,rgba(108,99,255,.13) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: -80, right: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(78,205,196,.1) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", top: "38%", left: "46%", width: 560, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,114,182,.06) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 960, position: "relative", zIndex: 1 }}>

          {/* ── TITLE ── */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 46, marginBottom: 10, filter: "drop-shadow(0 0 22px #6C63FFbb)" }}>📚</div>
            <h1 style={{
              fontSize: "clamp(24px,5vw,38px)",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              background: "linear-gradient(135deg,#fff 15%,#a78bfa 52%,#4ECDC4 85%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 8
            }}>
              Study Card Generator Hriday Sonar
            </h1>
            <p style={{ color: "#444", fontSize: 13, letterSpacing: "2.5px" }}>ট্র্যাক করুন · শেয়ার করুন · অনুপ্রাণিত করুন</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

            {/* ════ FORM ════ */}
            <div style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 22,
              padding: "26px 22px",
              backdropFilter: "blur(20px)"
            }}>

              <h2 style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 9
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#6C63FF", display: "inline-block",
                  boxShadow: "0 0 8px #6C63FFaa"
                }} />
                তথ্য পূরণ করুন
              </h2>

              {/* Name */}
              <label style={L}>তোমার নাম</label>
              <input style={I} value={name} onChange={e => setName(e.target.value)} placeholder="নাম লিখুন..." />

              {/* Photo */}
              <label style={L}>প্রোফাইল ফটো</label>
              <div className="pho" onClick={() => fileRef.current.click()} style={{
                width: 84, height: 84, borderRadius: "50%", cursor: "pointer",
                border: "2px dashed rgba(108,99,255,.45)", position: "relative",
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color .2s"
              }}>
                {photo ? (
                  <img src={photo} alt="p" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{
                    width: "100%", height: "100%", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 38,
                    background: "linear-gradient(135deg,rgba(108,99,255,.15),rgba(78,205,196,.15))"
                  }}>🧑‍🎓</div>
                )}
                <div className="pho-ov" style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,.6)", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", opacity: 0,
                  transition: "opacity .2s", gap: 3
                }}>
                  <span style={{ fontSize: 22 }}>📷</span>
                  <span style={{ fontSize: 10, color: "#ccc" }}>আপলোড</span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
              </div>

              {/* Subjects */}
              <label style={{ ...L, marginTop: 18 }}>বিষয় ও পড়ার সময়</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {subjects.map((s, i) => {
                  const p = PALETTES[i % PALETTES.length];
                  return (
                    <div key={s.id} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: "rgba(255,255,255,.04)", borderRadius: 11, padding: "8px 10px",
                      borderLeft: `3px solid ${p.bg}`
                    }}>
                      <span style={{
                        width: 27, height: 27, borderRadius: 7, background: p.bg + "22",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, flexShrink: 0
                      }}>
                        {p.icon}
                      </span>
                      <input
                        style={{
                          flex: 1, background: "transparent", border: "none", color: "#fff",
                          fontSize: 13, outline: "none", minWidth: 0, fontFamily: "'Outfit',sans-serif"
                        }}
                        value={s.name}
                        onChange={e => upd(s.id, "name", e.target.value)}
                        placeholder={`বিষয় ${i + 1}`}
                      />
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        {[["hours", "h", 23], ["minutes", "m", 59]].map(([f, u, mx]) => (
                          <div key={f} style={{
                            display: "flex", alignItems: "center",
                            background: "rgba(255,255,255,.08)", borderRadius: 6,
                            padding: "2px 6px", gap: 2
                          }}>
                            <input
                              type="number" min="0" max={mx}
                              style={{
                                width: 26, background: "transparent", border: "none", color: "#fff",
                                fontSize: 12, outline: "none", textAlign: "center",
                                fontFamily: "'Outfit',sans-serif"
                              }}
                              value={s[f]}
                              onChange={e => upd(s.id, f, Math.max(0, Math.min(mx, parseInt(e.target.value) || 0)))}
                            />
                            <span style={{ color: "#555", fontSize: 11 }}>{u}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        className="rm-btn"
                        onClick={() => delSub(s.id)}
                        style={{
                          background: "rgba(255,70,70,.12)", border: "none", color: "#ff6b6b",
                          width: 22, height: 22, borderRadius: "50%", cursor: "pointer",
                          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, padding: 0, transition: "background .2s"
                        }}>×</button>
                    </div>
                  );
                })}
              </div>

              <button
                className="add-btn"
                onClick={addSub}
                style={{
                  marginTop: 10, width: "100%", background: "rgba(255,255,255,.04)",
                  border: "1px dashed rgba(255,255,255,.11)", color: "#666",
                  borderRadius: 10, padding: "9px 0", cursor: "pointer", fontSize: 13,
                  transition: "all .2s", fontFamily: "'Outfit',sans-serif"
                }}
              >
                + নতুন বিষয় যোগ করুন
              </button>

              <button
                className="gen-btn"
                onClick={generate}
                disabled={loading}
                style={{
                  marginTop: 14, width: "100%",
                  background: "linear-gradient(135deg,#6C63FF,#8B5CF6,#4ECDC4)",
                  border: "none", borderRadius: 13, padding: "14px 0", color: "#fff",
                  fontWeight: 800, fontSize: 15, cursor: "pointer", letterSpacing: .5,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 28px #6C63FF66", transition: "all .25s",
                  fontFamily: "'Outfit',sans-serif"
                }}
              >
                {loading ? (
                  <span style={{
                    width: 18, height: 18,
                    border: "2px solid rgba(255,255,255,.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    animation: "spin .6s linear infinite",
                    display: "inline-block"
                  }} />
                ) : (
                  <>✨ কার্ড জেনারেট করুন</>
                )}
              </button>
            </div>

            {/* ════ CARD PREVIEW ════ */}
            <div style={{ position: "sticky", top: 24 }}>
              <h2 style={{
                color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 16,
                display: "flex", alignItems: "center", gap: 9
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#4ECDC4", display: "inline-block",
                  boxShadow: "0 0 8px #4ECDC4aa"
                }} />
                কার্ড প্রিভিউ
              </h2>

              <div style={{
                opacity: gen ? 1 : .25,
                filter: gen ? "none" : "blur(3px)",
                animation: gen ? "floatUp .7s cubic-bezier(.23,1.2,.32,1) forwards" : "none",
                transition: "filter .4s",
              }}>
                {/* THE CARD */}
                <div style={{
                  borderRadius: 24, position: "relative", overflow: "hidden",
                  background: "linear-gradient(160deg,#0d0b1e 0%,#091525 50%,#0c1a0d 100%)",
                  animation: gen ? "glowPulse 3.5s ease-in-out infinite" : "none",
                  border: "1px solid rgba(108,99,255,.3)"
                }}>

                  <Scanline active={scan} />

                  {/* grid texture */}
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: "linear-gradient(rgba(108,99,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,.025) 1px,transparent 1px)",
                    backgroundSize: "30px 30px"
                  }} />

                  {/* corner marks */}
                  {[
                    { top: 0, left: 0, st: { borderTop: "2px solid #6C63FFaa", borderLeft: "2px solid #6C63FFaa", borderRadius: "24px 0 0 0" } },
                    { top: 0, right: 0, st: { borderTop: "2px solid #6C63FFaa", borderRight: "2px solid #6C63FFaa", borderRadius: "0 24px 0 0" } },
                    { bottom: 0, left: 0, st: { borderBottom: "2px solid #6C63FFaa", borderLeft: "2px solid #6C63FFaa", borderRadius: "0 0 0 24px" } },
                    { bottom: 0, right: 0, st: { borderBottom: "2px solid #6C63FFaa", borderRight: "2px solid #6C63FFaa", borderRadius: "0 0 24px 0" } },
                  ].map((c, i) => (
                    <div key={i} style={{ position: "absolute", width: 22, height: 22, pointerEvents: "none", ...c, ...c.st }} />
                  ))}

                  {/* ─ HEADER ─ */}
                  <div style={{ padding: "24px 22px 18px", position: "relative" }}>
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "radial-gradient(circle at 82% 12%,rgba(108,99,255,.22) 0%,transparent 52%),radial-gradient(circle at 8% 88%,rgba(78,205,196,.16) 0%,transparent 50%)"
                    }} />
                    {/* star dots */}
                    {[[8, 10], [35, 6], [78, 16], [91, 5], [55, 3]].map(([l, t], i) => (
                      <div key={i} style={{
                        position: "absolute", left: `${l}%`, top: `${t}%`,
                        width: 2, height: 2, background: "rgba(255,255,255,.45)",
                        borderRadius: "50%", pointerEvents: "none"
                      }} />
                    ))}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                      <div>
                        <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11, letterSpacing: .5, marginBottom: 8 }}>
                          📅 {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <div style={{
                          color: "rgba(255,255,255,.4)", fontSize: 10, letterSpacing: "2px",
                          textTransform: "uppercase", marginBottom: 5
                        }}>আজকের মোট সময়</div>
                        <div style={{
                          fontSize: 40, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px",
                          background: "linear-gradient(135deg,#fff 25%,#a78bfa)",
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                          animation: gen ? "countIn .6s ease-out .3s both" : "none"
                        }}>
                          {totalH > 0 && (
                            <>
                              {totalH}
                              <span style={{ fontSize: 19, WebkitTextFillColor: "rgba(255,255,255,.45)" }}>h</span>{" "}
                            </>
                          )}
                          {totalM}
                          <span style={{ fontSize: 19, WebkitTextFillColor: "rgba(255,255,255,.45)" }}>m</span>
                        </div>
                      </div>

                      {/* Avatar + orbit */}
                      <div style={{ position: "relative", width: 74, height: 74, flexShrink: 0 }}>
                        {gen && (
                          <>
                            <div style={{
                              position: "absolute", inset: -10, borderRadius: "50%",
                              border: "1px dashed rgba(108,99,255,.3)", pointerEvents: "none"
                            }} />
                            <div style={{
                              position: "absolute", top: "50%", left: "50%",
                              width: 7, height: 7, marginTop: -3.5, marginLeft: -3.5,
                              borderRadius: "50%", background: "#A78BFA",
                              animation: "orbit 3.2s linear infinite", boxShadow: "0 0 6px #A78BFA"
                            }} />
                            <div style={{
                              position: "absolute", top: "50%", left: "50%",
                              width: 5, height: 5, marginTop: -2.5, marginLeft: -2.5,
                              borderRadius: "50%", background: "#4ECDC4",
                              animation: "orbitB 5s linear infinite", boxShadow: "0 0 6px #4ECDC4"
                            }} />
                          </>
                        )}
                        <div style={{
                          width: 74, height: 74, borderRadius: "50%", overflow: "hidden",
                          border: "2.5px solid rgba(108,99,255,.65)",
                          boxShadow: "0 0 24px rgba(108,99,255,.45)",
                          animation: gen ? "pop .55s cubic-bezier(.23,1.3,.32,1) .1s both" : "none"
                        }}>
                          {photo ? (
                            <img src={photo} alt="av" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{
                              width: "100%", height: "100%", display: "flex", alignItems: "center",
                              justifyContent: "center", fontSize: 40,
                              background: "linear-gradient(135deg,#6C63FF,#8B5CF6,#4ECDC4)"
                            }}>🧑‍🎓</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Name shimmer */}
                    <div style={{
                      marginTop: 14, fontSize: 19, fontWeight: 800, letterSpacing: "-.3px",
                      background: "linear-gradient(90deg,#fff 0%,#a78bfa 40%,#4ECDC4 70%,#fff 100%)",
                      backgroundSize: "250% auto",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      animation: gen ? "shimmer 3.5s linear infinite .6s" : "none",
                      display: "inline-block"
                    }}>
                      {name || "তোমার নাম"} 📚
                    </div>
                  </div>

                  {/* neon divider */}
                  <div style={{
                    height: 1, margin: "0 20px",
                    background: "linear-gradient(90deg,transparent,rgba(108,99,255,.7),rgba(78,205,196,.7),transparent)"
                  }} />

                  {/* ─ SUBJECTS ─ */}
                  <div style={{ padding: "16px 22px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {valid.map((s, i) => {
                      const pal = PALETTES[i % PALETTES.length];
                      const m = s.hours * 60 + s.minutes;
                      const pct = Math.round(m / maxM * 100);
                      return (
                        <div key={s.id} style={{
                          animation: gen ? `rowIn .4s ease-out ${i * .09 + .45}s both` : "none"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                              <span style={{
                                width: 9, height: 9, borderRadius: "50%", background: pal.bg, flexShrink: 0,
                                boxShadow: `0 0 8px ${pal.glow}`
                              }} />
                              <span style={{ color: "rgba(255,255,255,.88)", fontWeight: 700, fontSize: 13 }}>{s.name}</span>
                            </div>
                            <span style={{
                              color: pal.bg, fontWeight: 800, fontSize: 13,
                              textShadow: `0 0 10px ${pal.glow}`
                            }}>{fmt(m)}</span>
                          </div>
                          <div style={{
                            height: 8, background: "rgba(255,255,255,.06)", borderRadius: 99,
                            overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,.4)"
                          }}>
                            <div style={{
                              height: "100%", borderRadius: 99,
                              background: `linear-gradient(90deg,${pal.grad[0]}cc,${pal.grad[1]})`,
                              width: gen ? `${pct}%` : "0%",
                              transition: `width 1.1s cubic-bezier(.23,1.15,.32,1) ${i * .1 + .55}s`,
                              boxShadow: `0 0 14px ${pal.glow}`,
                              minWidth: m > 0 && gen ? 7 : 0
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ─ FOOTER ─ */}
                  <div style={{
                    borderTop: "1px solid rgba(255,255,255,.06)", padding: "12px 22px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "rgba(0,0,0,.25)"
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 7,
                      background: "linear-gradient(135deg,rgba(255,165,0,.18),rgba(255,80,0,.12))",
                      border: "1px solid rgba(255,165,0,.28)", borderRadius: 99, padding: "5px 14px"
                    }}>
                      <span style={{ fontSize: 13 }}>🔥</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#ffa726" }}>Keep grinding!</span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "rgba(108,99,255,.75)",
                      letterSpacing: 1
                    }}>
                      StudyCard ✦
                    </span>
                  </div>
                </div>

                {/* DOWNLOAD BUTTON - ফিক্স করা অংশ */}
                {gen && (
                  <button
                    className="dl-btn"
                    onClick={download}
                    disabled={dlLoading}
                    style={{
                      marginTop: 14, width: "100%",
                      background: "linear-gradient(135deg,#141028,#0d2137)",
                      border: "1px solid rgba(108,99,255,.55)",
                      borderRadius: 13, padding: "13px 0", color: "#fff",
                      fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: .5,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                      boxShadow: "0 4px 20px rgba(0,0,0,.5),inset 0 1px 0 rgba(108,99,255,.2)",
                      transition: "all .25s", fontFamily: "'Outfit',sans-serif",
                      animation: "dlPop .45s cubic-bezier(.23,1.2,.32,1) .3s both"
                    }}
                  >
                    {dlLoading ? (
                      <>
                        <span style={{
                          width: 16, height: 16,
                          border: "2px solid rgba(255,255,255,.25)",
                          borderTop: "2px solid #6C63FF",
                          borderRadius: "50%",
                          animation: "spin .6s linear infinite",
                          display: "inline-block"
                        }} />
                        ডাউনলোড হচ্ছে...
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 20 }}>⬇️</span> কার্ড ডাউনলোড করুন
                      </>
                    )}
                  </button>
                )}
              </div>

              {!gen && (
                <p style={{ color: "#3a3a4a", textAlign: "center", fontSize: 13, marginTop: 18 }}>
                  ← ফর্ম পূরণ করে কার্ড জেনারেট করুন
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const L = {
  display: "block", color: "#4a4a6a", fontSize: 11, fontWeight: 700,
  letterSpacing: "1.4px", textTransform: "uppercase", marginBottom: 7, marginTop: 15
};

const I = {
  width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none",
  fontFamily: "'Outfit',sans-serif"
};