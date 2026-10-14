// "কাতার থেকে ইউরোপ ২০২৬" — Pexels stock footage + motion graphics + VO (ElevenLabs v4, Shahriar).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import DATA from "./qe-data.json";
import LANDPTS from "./land.json";

const FPS = 30, PAD = 0.7, LEAD = 10;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FONT = "Hind, 'Hind Siliguri', sans-serif";
const SEMI = "HindSemi, Hind, sans-serif";
const INK = "#0B0F0D", GOLD = "#F5B841", GREEN = "#22C55E", RED = "#EF4444", AMBER = "#F59E0B", MAROON = "#8A1538";
const S = (p: string) => staticFile("qe/" + p);
const lerp = (f: number, a: number, b: number, x: number, y: number) => interpolate(f, [a, b], [x, y], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
type Seg = { p: string; t: string; dur: number };
const SEGS = DATA as Seg[];

if (typeof document !== "undefined") {
  for (const [name, file] of [["Hind", "HindSiliguri-Bold.ttf"], ["HindSemi", "HindSiliguri-SemiBold.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const f = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}

export const timelineQE = () => { let at = 0; return SEGS.map((s) => { const len = Math.round((s.dur + PAD) * FPS) + LEAD + (s.p === "outro" ? 75 : 0); const r = { ...s, from: at, len }; at += len; return r; }); };
export const QE_TOTAL = (() => { const t = timelineQE(); return t[t.length - 1].from + t[t.length - 1].len; })();
const cue = (p: string, kw: string, fb = 0) => { const s = SEGS.find((x) => x.p === p)!; const i = s.t.indexOf(kw); return LEAD + Math.round(((i < 0 ? fb : i / s.t.length) * s.dur) * FPS); };

// ---------- flags ----------
export const Flag: React.FC<{ cc: string; w: number }> = ({ cc, w }) => {
  const h = w * 2 / 3;
  const box = (c: React.ReactNode, vb = "0 0 30 20") => <svg width={w} height={h} viewBox={vb} preserveAspectRatio="none" style={{ borderRadius: w * 0.06, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "block" }}>{c}</svg>;
  if (cc === "qa") { const pts = ["0,0", "11,0"]; for (let i = 0; i < 9; i++) pts.push(`14,${(i + 0.5) * 20 / 9}`, `11,${(i + 1) * 20 / 9}`); pts.push("0,20"); return box(<><rect width="30" height="20" fill={MAROON} /><polygon points={pts.join(" ")} fill="#fff" /></>); }
  if (cc === "rs") return box(<><rect width="30" height="7" fill="#C6363C" /><rect y="6.6" width="30" height="7" fill="#0C4076" /><rect y="13.3" width="30" height="6.7" fill="#fff" /></>);
  if (cc === "ba") return box(<><rect width="30" height="20" fill="#002395" /><polygon points="8,0 22,0 22,20" fill="#FECB00" />{new Array(9).fill(0).map((_, i) => <circle key={i} cx={6 + i * 1.75} cy={i * 2.3 + 0.8} r="0.7" fill="#fff" />)}</>);
  if (cc === "mk") return box(<><rect x="-10" y="-5" width="20" height="10" fill="#D20000" />{[[-10, -5], [0, -5], [10, -5], [-10, 0], [10, 0], [-10, 5], [0, 5], [10, 5]].map(([x, y], i) => { const a = Math.atan2(y, x), n = 0.9; return <polygon key={i} points={`${Math.cos(a - Math.PI / 2) * n},${Math.sin(a - Math.PI / 2) * n} ${Math.cos(a + Math.PI / 2) * n},${Math.sin(a + Math.PI / 2) * n} ${x},${y}`} fill="#FFE600" />; })}<circle r="1.9" fill="#D20000" /><circle r="1.6" fill="#FFE600" /></>, "-10 -5 20 10");
  if (cc === "bg") return box(<><rect width="30" height="7" fill="#fff" /><rect y="6.6" width="30" height="7" fill="#00966E" /><rect y="13.3" width="30" height="6.7" fill="#D62612" /></>);
  if (cc === "gr") return box(<>{new Array(9).fill(0).map((_, i) => <rect key={i} y={i * 20 / 9} width="30" height={20 / 9 + 0.05} fill={i % 2 ? "#fff" : "#0D5EAF"} />)}<rect width={20 / 9 * 5} height={20 / 9 * 5} fill="#0D5EAF" /><rect x={20 / 9 * 2} width={20 / 9} height={20 / 9 * 5} fill="#fff" /><rect y={20 / 9 * 2} width={20 / 9 * 5} height={20 / 9} fill="#fff" /></>);
  if (cc === "pt") return box(<><rect width="30" height="20" fill="#DA291C" /><rect width="12" height="20" fill="#046A38" /><circle cx="12" cy="10" r="4.6" fill="none" stroke="#FFE900" strokeWidth="1" /><path d="M9.6 7.4 h4.8 v3.6 a2.4 2.4 0 0 1 -4.8 0 Z" fill="#DA291C" stroke="#fff" strokeWidth="0.35" /></>);
  if (cc === "md") return box(<><rect width="10" height="20" fill="#0046AE" /><rect x="10" width="10" height="20" fill="#FFD200" /><rect x="20" width="10" height="20" fill="#CC092F" /></>);
  if (cc === "de") return box(<><rect width="30" height="7" fill="#000" /><rect y="6.6" width="30" height="7" fill="#DD0000" /><rect y="13.3" width="30" height="6.7" fill="#FFCE00" /></>);
  if (cc === "pl") return box(<><rect width="30" height="10" fill="#fff" /><rect y="10" width="30" height="10" fill="#DC143C" /></>);
  if (cc === "ro") return box(<><rect width="10" height="20" fill="#002B7F" /><rect x="10" width="10" height="20" fill="#FCD116" /><rect x="20" width="10" height="20" fill="#CE1126" /></>);
  if (cc === "hu") return box(<><rect width="30" height="7" fill="#CE2939" /><rect y="6.6" width="30" height="7" fill="#fff" /><rect y="13.3" width="30" height="6.7" fill="#477050" /></>);
  if (cc === "lt") return box(<><rect width="30" height="7" fill="#FDB913" /><rect y="6.6" width="30" height="7" fill="#006A44" /><rect y="13.3" width="30" height="6.7" fill="#C1272D" /></>);
  if (cc === "sa") return box(<><rect width="30" height="20" fill="#006C35" /><text x="15" y="9.5" fontSize="2.6" textAnchor="middle" fill="#fff" fontFamily="'Segoe UI', Arial">لا إله إلا الله محمد رسول الله</text><path d="M8 13 L22 13 L23 12.3 L23 13.7 L22 13.4 L8 13.4 Z" fill="#fff" /></>);
  // EU
  return box(<><rect width="30" height="20" fill="#003399" />{new Array(12).fill(0).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <text key={i} x={15 + Math.cos(a) * 6} y={10 + Math.sin(a) * 6 + 0.9} fontSize="2.6" textAnchor="middle" fill="#FFCC00">★</text>; })}</>);
};

// ---------- building blocks ----------
const Stock: React.FC<{ src: string; dim?: number; zoom?: [number, number]; len?: number; blur?: number }> = ({ src, dim = 0.45, zoom = [1.05, 1.15], len = 300, blur = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={S(`stock/${src}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, len], zoom, clamp)})`, filter: `blur(${blur}px) saturate(1.1)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(11,15,13,${dim * 0.7}) 0%, rgba(11,15,13,${dim}) 50%, rgba(11,15,13,${Math.min(0.95, dim + 0.35)}) 100%)` }} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ text: string; at?: number; size?: number; hl?: string[]; align?: "center" | "left" }> = ({ text, at = 0, size = 76, hl = [], align = "left" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, justifyContent: align === "center" ? "center" : "flex-start", fontFamily: FONT, fontSize: size, lineHeight: 1.2, color: "#fff", textShadow: "0 6px 26px rgba(0,0,0,0.6)" }}>
      {text.split(" ").map((w, i) => { const p = spring({ frame: f - at - i * 3, fps, config: { damping: 15, stiffness: 150 } });
        return <span key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 36}px)`, filter: `blur(${(1 - p) * 6}px)`, color: hl.some((h) => w.includes(h)) ? GOLD : undefined }}>{w}</span>; })}
    </div>
  );
};

const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 160 } });
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>;
};

const Badge: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = 34 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${size * 0.25}px ${size * 0.7}px`, borderRadius: 999, background: color, color: "#fff", fontFamily: FONT, fontSize: size, boxShadow: `0 10px 30px ${color}66` }}>{children}</span>
);

const Caption: React.FC<{ text: string; len: number }> = ({ text, len }) => {
  const f = useCurrentFrame();
  const parts = text.split(/(?<=[।?!])\s+|\s+—\s+/).filter(Boolean);
  const total = parts.reduce((a, p) => a + p.length, 0), speak = len - LEAD - PAD * FPS;
  let acc = 0;
  const spans = parts.map((p) => { const a = LEAD + (acc / total) * speak; acc += p.length; return { p, a, b: LEAD + (acc / total) * speak }; });
  const cur = spans.find((s) => f >= s.a && f < s.b + 6);
  if (!cur) return null;
  const o = interpolate(f, [cur.a, cur.a + 5], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", bottom: 48, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: 1500, padding: "12px 28px", borderRadius: 16, background: "rgba(0,0,0,0.62)", fontFamily: SEMI, fontSize: 38, color: "#fff", textAlign: "center", lineHeight: 1.35 }}>{cur.p}</div>
    </div>
  );
};

// ---------- scenes ----------
type SP = { len: number; p: string };

const Hook: React.FC<SP> = ({ len, p }) => {
  const f = useCurrentFrame();
  const cut = cue(p, "দুই হাজার");
  const fl = spring({ frame: f - 20, fps: 30, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      {f < cut ? <Stock src="doha_skyline" dim={0.4} len={cut} /> : <Sequence from={cut}><Stock src="plane_takeoff" dim={0.45} len={len - cut} /></Sequence>}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, transform: `scale(${fl})` }}>
          <Flag cc="qa" w={210} />
          <div style={{ width: 260, height: 6, background: `repeating-linear-gradient(90deg, ${GOLD} 0 18px, transparent 18px 32px)`, position: "relative" }}>
            <div style={{ position: "absolute", left: `${lerp(f, 30, 90, 0, 85)}%`, top: -34, fontSize: 60 }}>✈️</div>
          </div>
          <Flag cc="eu" w={210} />
        </div>
        <Title text="কাতার থেকে ইউরোপ" at={12} size={130} align="center" hl={["ইউরোপ"]} />
        <Pop at={40}><Badge color={RED} size={46}>২০২৬ — কোন দেশের ভিসা হচ্ছে?</Badge></Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ROUTES = [["🏖️", "টুরিস্ট / শেনজেন", "স্বল্প সময়ের ভ্রমণ", "এক"], ["🎓", "স্টুডেন্ট ভিসা", "ইউরোপে পড়াশোনা", "দুই"], ["💼", "ওয়ার্ক পারমিট", "কাজ নিয়ে বৈধভাবে থাকা", "আর তিন"]];
const Routes: React.FC<SP> = ({ len, p }) => {
  const f = useCurrentFrame();
  const best = cue(p, "সবচেয়ে বাস্তব");
  return (
    <AbsoluteFill>
      <Stock src="europe_city" dim={0.7} blur={4} len={len} />
      <AbsoluteFill style={{ padding: "120px 120px 0" }}>
        <Title text="কাতার থেকে ইউরোপের ৩টি পথ" size={72} hl={["৩টি"]} />
        <div style={{ display: "flex", gap: 36, marginTop: 70 }}>
          {ROUTES.map(([e, h, s, kw], i) => {
            const isBest = i === 2 && f >= best;
            return (
              <Pop key={i} at={cue(p, kw) - 4} style={{ flex: 1 }}>
                <div style={{ height: 470, borderRadius: 32, padding: 40, background: isBest ? `linear-gradient(160deg, ${GREEN}, #0E5E44)` : "rgba(20,27,24,0.88)", border: `2px solid ${isBest ? "#fff" : "rgba(255,255,255,0.12)"}`,
                  transform: `scale(${isBest ? 1.06 : 1})`, boxShadow: isBest ? `0 0 60px ${GREEN}88` : "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 110 }}>{e}</div>
                  <div><div style={{ fontFamily: FONT, fontSize: 52, color: "#fff" }}>{h}</div><div style={{ fontFamily: SEMI, fontSize: 32, color: "#ffffffbb", marginTop: 8 }}>{s}</div></div>
                  {isBest && <Badge color="#0B0F0D" size={30}>✅ সবচেয়ে বাস্তব পথ</Badge>}
                </div>
              </Pop>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Europe map with status pins
const EU_B = [-12, 34, 30, 62]; // lonMin, lonMax, latMin, latMax
const MapEU: React.FC<{ pins: { cc: string; lat: number; lng: number; label: string; color: string; icon: string; at: number }[]; dimAll?: number; w?: number; h?: number }> = ({ pins, dimAll = 0, w = 1100, h = 820 }) => {
  const f = useCurrentFrame();
  const [l0, l1, b0, b1] = EU_B;
  const px = (lng: number) => ((lng - l0) / (l1 - l0)) * w, py = (lat: number) => ((b1 - lat) / (b1 - b0)) * h;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <svg width={w} height={h} style={{ position: "absolute" }}>
        {(LANDPTS as [number, number][]).filter(([la, lo]) => lo >= l0 && lo <= l1 && la >= b0 && la <= b1).map(([la, lo], i) =>
          <circle key={i} cx={px(lo)} cy={py(la)} r={9} fill={dimAll > 0 ? `rgba(239,68,68,${0.15 + 0.35 * dimAll})` : "#2F3D37"} />)}
      </svg>
      {pins.map((pn) => {
        const s = spring({ frame: f - pn.at, fps: 30, config: { damping: 10 } });
        return (
          <div key={pn.cc} style={{ position: "absolute", left: px(pn.lng), top: py(pn.lat), transform: `translate(-50%,-50%) scale(${s})` }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: pn.color, boxShadow: `0 0 0 ${10 + 6 * Math.sin(f / 7)}px ${pn.color}44` }} />
            <div style={{ position: "absolute", left: 40, top: -34, display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap", padding: "8px 16px", borderRadius: 14, background: "rgba(11,15,13,0.9)", border: `2px solid ${pn.color}` }}>
              <Flag cc={pn.cc} w={54} />
              <span style={{ fontFamily: FONT, fontSize: 30, color: "#fff" }}>{pn.icon} {pn.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Schengen: React.FC<SP> = ({ len, p }) => {
  const f = useCurrentFrame();
  const hard = cue(p, "শেনজেন দেশগুলোর"), bg = cue(p, "বুলগেরিয়া"), gr = cue(p, "গ্রিসের"), pt = cue(p, "পর্তুগালের");
  const clip = f >= pt ? "lisbon" : f >= gr ? "athens" : f >= bg ? "sofia_aerial" : "europe_city";
  return (
    <AbsoluteFill style={{ background: INK }}>
      <div style={{ position: "absolute", right: 0, top: 0, width: 760, height: 1080, opacity: 0.9 }}>
        <Sequence key={clip} from={0}><Stock src={clip} dim={0.35} len={300} /></Sequence>
        <AbsoluteFill style={{ background: `linear-gradient(90deg, ${INK} 0%, transparent 40%)` }} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 70 }}>
        <Title text="শেনজেন ভিসা: এখনকার অবস্থা" size={64} hl={["এখনকার"]} />
        <Pop at={hard} style={{ marginTop: 14 }}><Badge color={RED} size={36}>❌ কাতার থেকে খুবই কঠিন — নেই বললেই চলে</Badge></Pop>
      </div>
      <div style={{ position: "absolute", left: 60, top: 250 }}>
        <MapEU dimAll={lerp(f, hard, hard + 20, 0, 1)} w={1050} h={790} pins={[
          { cc: "bg", lat: 42.7, lng: 23.3, label: "বুলগেরিয়া: রেশিও ভালো", color: GREEN, icon: "✅", at: bg },
          { cc: "gr", lat: 38.0, lng: 23.7, label: "গ্রিস: অ্যাপয়েন্টমেন্ট নেই", color: RED, icon: "⛔", at: gr },
          { cc: "pt", lat: 39.5, lng: -8.2, label: "পর্তুগাল: অ্যাপয়েন্টমেন্ট সমস্যা", color: AMBER, icon: "⚠️", at: pt },
        ]} />
      </div>
    </AbsoluteFill>
  );
};

const NON = [["rs", "সার্বিয়া", "belgrade", "সার্বিয়া"], ["ba", "বসনিয়া", "sarajevo_bridge", "বসনিয়া"], ["mk", "উত্তর মেসিডোনিয়া", "skopje_bridge", "উত্তর মেসিডোনিয়া"]];
const NonSchengen: React.FC<SP> = ({ len, p }) => {
  const f = useCurrentFrame();
  const ats = NON.map((n) => cue(p, n[3]) - 6);
  const warn = cue(p, "তবে একটা কথা");
  const idx = Math.max(0, ats.filter((a) => f >= a).length - 1);
  const showWarn = f >= warn;
  return (
    <AbsoluteFill>
      <Sequence key={idx} from={0}><Stock src={NON[idx][2]} dim={showWarn ? 0.75 : 0.35} len={260} /></Sequence>
      <div style={{ position: "absolute", left: 100, top: 80 }}>
        <Title text="ভিসা হচ্ছে কোথায়?" size={70} hl={["কোথায়?"]} />
        <Pop at={8} style={{ marginTop: 10 }}><Badge color={GREEN} size={34}>✅ নন-শেনজেন দেশ — ভালো যাচ্ছে</Badge></Pop>
      </div>
      <div style={{ position: "absolute", left: 100, bottom: 170, display: "flex", gap: 26 }}>
        {NON.map(([cc, name], i) => {
          const on = i === idx && !showWarn;
          return (
            <Pop key={cc} at={ats[i]}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 28px", borderRadius: 22, background: on ? "rgba(34,197,94,0.92)" : "rgba(11,15,13,0.85)", border: `2px solid ${on ? "#fff" : GREEN}`, transform: `scale(${on ? 1.08 : 1})` }}>
                <Flag cc={cc} w={78} /><span style={{ fontFamily: FONT, fontSize: 40, color: "#fff" }}>{name}</span><span style={{ fontSize: 36 }}>✅</span>
              </div>
            </Pop>
          );
        })}
      </div>
      {showWarn && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
          <Pop at={warn}>
            <div style={{ width: 1300, padding: "40px 50px", borderRadius: 30, background: "rgba(11,15,13,0.94)", border: `3px solid ${AMBER}`, textAlign: "center" }}>
              <div style={{ fontSize: 80 }}>⚠️</div>
              <div style={{ fontFamily: FONT, fontSize: 54, color: "#fff", lineHeight: 1.3 }}>এই ভিসায় শেনজেন দেশে ঢোকা যায় না</div>
              <div style={{ fontFamily: SEMI, fontSize: 36, color: GOLD, marginTop: 10 }}>যে দেশের পারমিট — সেই দেশেই বৈধভাবে কাজ</div>
            </div>
          </Pop>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const DOCS = [["📄", "চাকরির অফার লেটার", "অফার লেটার"], ["🧰", "কাজের অভিজ্ঞতার প্রমাণ", "অভিজ্ঞতার"], ["🛂", "বৈধ পাসপোর্ট (৬ মাস+)", "পাসপোর্ট"], ["🩺", "মেডিকেল রিপোর্ট", "মেডিকেল"], ["🪪", "কাতার আইডি / রেসিডেন্সি প্রমাণ", "কাতার আইডি"]];
const Docs: React.FC<SP> = ({ len, p }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: INK }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 1080 }}><Stock src="boarding_pass" dim={0.3} len={len} /><AbsoluteFill style={{ background: `linear-gradient(270deg, ${INK} 0%, transparent 45%)` }} /></div>
      <div style={{ position: "absolute", left: 780, top: 110, width: 1040 }}>
        <Title text="ওয়ার্ক পারমিটে যা লাগে" size={66} hl={["যা"]} />
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
          {DOCS.map(([e, t, kw], i) => {
            const at = cue(p, kw) - 6, on = f >= at;
            return (
              <Pop key={i} at={at}>
                <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 28px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `1px solid ${on ? GREEN : "rgba(255,255,255,0.1)"}` }}>
                  <span style={{ fontSize: 50 }}>{e}</span><span style={{ fontFamily: SEMI, fontSize: 40, color: "#fff", flex: 1 }}>{t}</span>
                  <span style={{ width: 52, height: 52, borderRadius: 12, background: GREEN, color: "#fff", fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
                </div>
              </Pop>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const STEPS = [["💼", "চাকরির অফার", "চাকরির অফার"], ["🏢", "নিয়োগকর্তা পারমিট আবেদন করেন", "নিয়োগকর্তা আপনার"], ["🏛️", "দূতাবাসে ভিসার আবেদন", "দূতাবাসে"], ["✈️", "ভিসা হাতে — ইউরোপের পথে", "সবশেষে"]];
const Process: React.FC<SP> = ({ len, p }) => {
  const f = useCurrentFrame();
  const ats = STEPS.map((s) => cue(p, s[2]) - 6);
  const active = Math.max(0, ats.filter((a) => f >= a).length - 1);
  return (
    <AbsoluteFill>
      <Stock src={active >= 3 ? "plane_wing" : active >= 2 ? "passports" : "signing"} dim={0.62} len={len} />
      <AbsoluteFill style={{ padding: "120px 110px 0" }}>
        <Title text="প্রক্রিয়া, ধাপে ধাপে" size={72} hl={["ধাপে"]} />
        <div style={{ position: "relative", marginTop: 130, display: "flex", justifyContent: "space-between" }}>
          <div style={{ position: "absolute", left: 110, right: 110, top: 75, height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 4 }} />
          <div style={{ position: "absolute", left: 110, top: 75, height: 8, width: `${(active / 3) * 81}%`, background: GOLD, borderRadius: 4 }} />
          {STEPS.map(([e, t], i) => {
            const on = i <= active;
            return (
              <Pop key={i} at={ats[i]} style={{ width: 380, textAlign: "center", zIndex: 1 }}>
                <div style={{ width: 160, height: 160, margin: "0 auto", borderRadius: "50%", background: on ? (i === active ? GOLD : GREEN) : "rgba(20,27,24,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, border: "4px solid #fff", transform: `scale(${i === active ? 1.12 : 1})` }}>{e}</div>
                <div style={{ fontFamily: FONT, fontSize: 30, color: GOLD, marginTop: 20 }}>ধাপ {"১২৩৪"[i]}</div>
                <div style={{ fontFamily: FONT, fontSize: 40, color: "#fff", lineHeight: 1.25, marginTop: 6 }}>{t}</div>
              </Pop>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [["⛔", "দালালের কথায় অবৈধ সীমান্ত পার — প্রাণঘাতী", "অবৈধ পথে", RED], ["🔍", "সব কাগজ আসল কিনা যাচাই করুন", "সব কাগজ", AMBER], ["🏢", "সত্যিকারের অফিস আছে এমন এজেন্সি", "এজেন্সি", GREEN], ["🧾", "প্রতিটা টাকার লিখিত রসিদ নিন", "রসিদ", GREEN]];
const Tips: React.FC<SP> = ({ len, p }) => (
  <AbsoluteFill>
    <Stock src="airport" dim={0.7} len={len} />
    <AbsoluteFill style={{ padding: "120px 140px 0" }}>
      <Title text="⚠️ জরুরি সতর্কতা" size={72} hl={["সতর্কতা"]} />
      <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {TIPS.map(([e, t, kw, c], i) => (
          <Pop key={i} at={cue(p, kw) - 6}>
            <div style={{ height: 230, borderRadius: 28, padding: 34, background: "rgba(11,15,13,0.88)", borderLeft: `12px solid ${c}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: 70 }}>{e}</span><span style={{ fontFamily: FONT, fontSize: 42, color: "#fff", lineHeight: 1.3 }}>{t}</span>
            </div>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

const ROUTE_CC = [["rs", "সার্বিয়া"], ["ba", "বসনিয়া"], ["gr", "গ্রিস"], ["pt", "পর্তুগাল"], ["md", "মলদোভা"], ["bg", "বুলগেরিয়া"]];
const FEATURES = [["🏢", "সিলেট ও দোহায় ২টি আসল অফিস", "সিলেট আর দোহায়"], ["📲", "অ্যাপ ও ওয়েবসাইটে লাইভ ফাইল ট্র্যাকিং", "লাইভ"], ["🧾", "প্রতিটা পেমেন্টের লিখিত রসিদ", "লিখিত রসিদ"]];
const Dream: React.FC<SP> = ({ len, p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = cue(p, "নো ভিসা");
  const stamp = spring({ frame: f - stampAt, fps, config: { damping: 9, stiffness: 220 } });
  const routesAt = cue(p, "সার্বিয়া");
  return (
    <AbsoluteFill>
      <Stock src={f < cue(p, "লাইভ") ? "signing" : "boarding_pass"} dim={0.72} len={len} />
      <AbsoluteFill style={{ padding: "90px 110px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Pop at={4}><div style={{ background: "#fff", borderRadius: 24, padding: "18px 26px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 110, display: "block" }} /></div></Pop>
          <div style={{ transform: `scale(${2.4 - 1.4 * stamp}) rotate(${-8 * stamp}deg)`, opacity: Math.min(1, stamp * 2), padding: "16px 34px", border: `8px solid ${RED}`, borderRadius: 18, color: RED, fontFamily: "Montserrat", fontWeight: 900, fontSize: 64, letterSpacing: 3, background: "rgba(255,255,255,0.95)" }}>
            NO VISA, NO PAYMENT
          </div>
        </div>
        <Pop at={stampAt + 20} style={{ marginTop: 22 }}><div style={{ fontFamily: FONT, fontSize: 50, color: GOLD }}>ভিসা হাতে পেলে তবেই টাকা ✅</div></Pop>
        <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
          {FEATURES.map(([e, t, kw], i) => (
            <Pop key={i} at={cue(p, kw) - 6} style={{ flex: 1 }}>
              <div style={{ height: 200, borderRadius: 26, padding: 28, background: "rgba(11,15,13,0.88)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontSize: 60 }}>{e}</span><span style={{ fontFamily: FONT, fontSize: 36, color: "#fff", lineHeight: 1.3 }}>{t}</span>
              </div>
            </Pop>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
          {ROUTE_CC.map(([cc, n], i) => (
            <Pop key={cc} at={routesAt + i * 8}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)" }}>
                <Flag cc={cc} w={48} /><span style={{ fontFamily: FONT, fontSize: 32, color: "#fff" }}>{n}</span>
              </div>
            </Pop>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Outro: React.FC<SP> = ({ len, p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sub = cue(p, "সাবস্ক্রাইব");
  const clicked = f > sub + 10;
  return (
    <AbsoluteFill>
      <Stock src="doha_dhows" dim={0.7} len={len} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <Pop at={4}><div style={{ background: "#fff", borderRadius: 24, padding: "16px 26px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 100, display: "block" }} /></div></Pop>
        <Pop at={14}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 50px", borderRadius: 999, background: "#25D366", boxShadow: "0 20px 60px rgba(37,211,102,0.5)", transform: `scale(${1 + 0.03 * Math.sin(f / 6)})` }}>
            <span style={{ fontSize: 60 }}>💬</span>
            <span style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 64, color: "#fff" }}>+974 7138 2220</span>
          </div>
        </Pop>
        <Pop at={24}><div style={{ fontFamily: SEMI, fontSize: 38, color: "#fff" }}>WhatsApp · dreamintcs.com · সিলেট ও দোহা অফিস</div></Pop>
        <Pop at={sub - 20}>
          <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
            <div style={{ padding: "20px 48px", borderRadius: 14, background: clicked ? "#3F3F46" : "#FF0000", color: "#fff", fontFamily: FONT, fontSize: 44, transform: `scale(${f > sub + 4 && f < sub + 12 ? 0.92 : 1})` }}>{clicked ? "✓ সাবস্ক্রাইবড" : "▶ সাবস্ক্রাইব"}</div>
            <div style={{ padding: "20px 32px", borderRadius: 14, background: "#27272A", fontSize: 44, transform: `rotate(${clicked ? Math.sin(f / 2) * 12 * Math.max(0, 1 - (f - sub - 10) / 30) : 0}deg)` }}>🔔</div>
          </div>
        </Pop>
        <Pop at={len - 90}><div style={{ fontFamily: FONT, fontSize: 50, color: GOLD, marginTop: 10 }}>বৈধ পথে যান, নিরাপদে থাকুন 🤲</div></Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const VIEWS: Record<string, React.FC<SP>> = { hook: Hook, routes: Routes, schengen: Schengen, nonschengen: NonSchengen, docs: Docs, process: Process, tips: Tips, dream: Dream, outro: Outro };

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [len - 8, len], [0, 1], clamp), i = interpolate(f, [0, 10], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: i * (1 - o), transform: `scale(${1.02 - 0.02 * i + 0.04 * o})` }}>{children}</AbsoluteFill>;
};

export const QatarEurope: React.FC = () => {
  const T = timelineQE();
  const f = useCurrentFrame();
  const voOn = (fr: number) => T.reduce((m, s) => Math.max(m, interpolate(fr, [s.from + LEAD - 6, s.from + LEAD, s.from + s.len - 25, s.from + s.len - 8], [0, 1, 1, 0], clamp)), 0);
  return (
    <AbsoluteFill style={{ background: INK }}>
      {T.map((s, i) => { const V = VIEWS[s.p]; return (
        <Sequence key={s.p} from={s.from} durationInFrames={s.len}>
          <Fade len={s.len}><V len={s.len} p={s.p} /></Fade>
          <Caption text={s.t} len={s.len} />
          <Sequence from={LEAD}><Audio src={S(`vo/${s.p}.mp3`)} /></Sequence>
          {i > 0 && <Audio src={staticFile("mohajon/sfx/whoosh.mp3")} volume={0.35} />}
          {i === 0 && <Audio src={staticFile("mohajon/sfx/impact.mp3")} volume={0.5} />}
        </Sequence>); })}
      {T.slice(1).map((s) => <Sequence key={"fl" + s.p} from={s.from - 3} durationInFrames={8}><AbsoluteFill style={{ background: "#fff", opacity: 0.25 }} /></Sequence>)}
      {f > 90 && <div style={{ position: "absolute", right: 50, top: 40, background: "#fff", borderRadius: 12, padding: "6px 12px", opacity: 0.92 }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 42, display: "block" }} /></div>}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${(f / QE_TOTAL) * 100}%`, background: `linear-gradient(90deg, ${MAROON}, ${GOLD})` }} />
      <Audio src={staticFile("guide/bed.mp3")} volume={(fr) => interpolate(fr, [0, 20, QE_TOTAL - 60, QE_TOTAL], [0, 1, 1, 0], clamp) * (0.3 - 0.19 * voOn(fr))} />
    </AbsoluteFill>
  );
};

export const QEThumb: React.FC = () => (
  <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
    <Img src={S("thumb-bg.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(90deg, ${INK}ee 0%, ${INK}99 50%, transparent 85%)` }} />
    <div style={{ position: "absolute", left: 50, top: 40, background: RED, color: "#fff", fontFamily: FONT, fontSize: 42, padding: "6px 22px", borderRadius: 12, transform: "rotate(-2deg)" }}>২০২৬ আপডেট</div>
    <div style={{ position: "absolute", left: 50, top: 130, fontFamily: FONT, color: "#fff", lineHeight: 1.08, textShadow: "0 6px 20px rgba(0,0,0,0.7)" }}>
      <div style={{ fontSize: 100 }}>কাতার থেকে</div>
      <div style={{ fontSize: 132, color: GOLD }}>ইউরোপ</div>
      <div style={{ fontSize: 50, marginTop: 6 }}>কোন দেশের ভিসা হচ্ছে?</div>
    </div>
    <div style={{ position: "absolute", left: 50, bottom: 50, display: "flex", gap: 12 }}>
      {[["rs", "✅"], ["ba", "✅"], ["mk", "✅"], ["bg", "✅"], ["gr", "⛔"]].map(([cc, s]) => <div key={cc} style={{ position: "relative" }}><Flag cc={cc} w={96} /><span style={{ position: "absolute", right: -10, bottom: -12, fontSize: 36 }}>{s}</span></div>)}
    </div>
    <div style={{ position: "absolute", right: 40, bottom: 40, background: "#fff", borderRadius: 16, padding: "10px 18px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 64, display: "block" }} /></div>
  </AbsoluteFill>
);
