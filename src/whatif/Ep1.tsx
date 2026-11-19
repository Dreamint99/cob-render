// "যদি… ঢাকায় ৭+ মাত্রার ভূমিকম্প হয়?" — full episode, 9:30. Composition is 2560x1440; overlays are
// designed in a 1920x1080 space (<Stage>, scaled ×4/3); 3D shot clips play at full 1440p underneath.
// Every on-screen number comes from work/whatif/research.md (see `source` in script.json).
import "./fonts";
import React from "react";
import { getInputProps, AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import script from "../../public/whatif/ep1/script.json";
import capsRaw from "../../public/whatif/ep1/caps.json";
import projRaw from "./plates_proj.json";

const A = (f: string) => staticFile(`whatif/ep1/${f}`);
const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
export const EP1_LEN = 17103; // ceil(570.078 * 30)
const END = 570.078;
const RED = "#e0142b", INK = "#0b1114", INK2 = "#17272f", SAND = "#e9dcc0", MUTED = "#9aa7ad";
const HEAD = "Anek Bangla", BODY = "Hind Siliguri";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

type Line = { id: string; part: string; text: string; onscreen: string; source: string; start: number; vdur: number };
type W = { w: string; s: number; e: number };
type Cap = { id: string; s: number; e: number; words: W[] };
const LINES = (script as { lines: Line[] }).lines;
const L = (id: string) => LINES.find((l) => l.id === id)!;
const CAPS = capsRaw as Cap[];
const PROJ = projRaw as unknown as Record<string, Record<string, [number, number, number]>>;
// time a given word of a VO line is spoken (falls back to the line start)
const wordAt = (id: string, needle: string) => {
  const c = CAPS.find((x) => x.id === id); const w = c?.words.find((x) => x.w.includes(needle));
  return w ? w.s : L(id).start;
};
const P_AT = wordAt("s2", "পি-ওয়েভ"); // P-ring reaches Dhaka on "…সেকেন্ড: পি-ওয়েভ" (~68.5 s)
const S_AT = L("s3").start;            // "আট সেকেন্ড পর আসে এস-ওয়েভ"
const T1762 = wordAt("p6", "সতেরোশো"), T1897 = wordAt("p6", "আঠারোশো");

// ---------- helpers ----------
const BN = "০১২৩৪৫৬৭৮৯";
const bn = (s: string | number) => String(s).replace(/[0-9]/g, (d) => BN[+d]);
const bnInt = (n: number) => { // Indian grouping: 21,00,000
  const s = String(Math.round(n)); if (s.length <= 3) return bn(s);
  const last = s.slice(-3); const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return bn(rest + "," + last);
};
const useT = () => useCurrentFrame() / FPS;
const fadeIO = (t: number, a: number, b: number, d = 0.4) => interpolate(t, [a, a + d, b - d, b], [0, 1, 1, 0], clamp);
const springAt = (f: number, at: number, damping = 15) => spring({ frame: f - S(at), fps: FPS, config: { damping, mass: 0.8 } });

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(1.3333333)", transformOrigin: "0 0" }}>{children}</div>
);

// full-res shot clip (2560x1440), plays inside its own Sequence
const Shot: React.FC<{ src: string; dur: number; from?: number; rate?: number; fade?: number; fadeIn?: number; fadeOut?: number; filter?: string; push?: number }> = ({ src, dur, from = 0, rate = 1, fade = 0.3, fadeIn, fadeOut, filter, push = 0 }) => {
  const t = useT();
  const fi = fadeIn ?? fade, fo = fadeOut ?? fade;
  const o = (fi || fo) ? interpolate(t, [0, Math.max(fi, 0.001), dur - Math.max(fo, 0.001), dur], [fi ? 0 : 1, 1, 1, fo ? 0 : 1], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <OffthreadVideo src={A(src)} startFrom={from} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter, transform: `scale(${1 + push * (t / dur)})` }} />
    </AbsoluteFill>
  );
};
// top/bottom shade so labels and captions stay readable over street footage
const TextShade: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 58%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
);

// ---------- small building blocks (design space) ----------
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile(`cob/grain${f % 4}.png`)})`, backgroundSize: "512px", opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }} />;
};
const Vignette: React.FC<{ v?: number }> = ({ v = 0.55 }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, transparent 50%, rgba(0,0,0,${v}) 100%)`, pointerEvents: "none" }} />;

const Tag: React.FC<{ text: string; o: number; color?: string; top?: number; left?: number }> = ({ text, o, color = RED, top = 34, left = 40 }) => (
  <div style={{ position: "absolute", left, top, opacity: o, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12, background: "rgba(5,8,12,.66)", border: `1.5px solid ${color}`, borderRadius: 8, padding: "7px 16px 9px", fontFamily: BODY, fontWeight: 600, fontSize: 24, color: "#fff" }}>
    <div style={{ width: 9, height: 9, borderRadius: 5, background: color }} />{text}
  </div>
);
const Note: React.FC<{ text: string; o: number }> = ({ text, o }) => (
  <div style={{ position: "absolute", right: 40, top: 38, opacity: 0.85 * o, fontFamily: BODY, fontWeight: 600, fontSize: 21, color: "#d9dee1", textShadow: "0 1px 6px #000" }}>{text}</div>
);
const Credit: React.FC<{ text: string; o: number }> = ({ text, o }) => (
  <div style={{ position: "absolute", right: 40, top: 38, opacity: 0.8 * o, fontFamily: BODY, fontWeight: 600, fontSize: 20, color: "#fff", textShadow: "0 1px 6px #000", maxWidth: 820, textAlign: "right" }}>{text}</div>
);

// key fact (lower-left) + its source right under it
const Fact: React.FC<{ id: string; text?: string; from?: number; until?: number }> = ({ id, text, from, until }) => {
  const t = useT(); const f = useCurrentFrame(); const l = L(id);
  const a = from ?? l.start - 0.1, b = until ?? l.start + l.vdur + 0.7;
  if (t < a - 0.1 || t > b + 0.1) return null;
  const s = springAt(f, a, 15); const o = fadeIO(t, a, b, 0.35);
  return (
    <div style={{ position: "absolute", left: 64, bottom: 236, opacity: o, transform: `translateY(${(1 - s) * 22}px)` }}>
      <div style={{ width: 54 * s, height: 4, background: RED, marginBottom: 14 }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.85)", maxWidth: 1100 }}>{text ?? l.onscreen}</div>
    </div>
  );
};
// every line with a source shows it while it is on screen
const Sources: React.FC = () => {
  const t = useT();
  const l = LINES.find((x) => x.source && t >= x.start - 0.1 && t <= x.start + x.vdur + 0.8);
  if (!l) return null;
  const o = fadeIO(t, l.start - 0.1, l.start + l.vdur + 0.8, 0.3);
  return (
    <div style={{ position: "absolute", left: 64, bottom: 190, opacity: 0.92 * o, fontFamily: BODY, fontWeight: 600, fontSize: 22, color: SAND, textShadow: "0 1px 6px #000", whiteSpace: "nowrap" }}>সূত্র: {l.source}</div>
  );
};

// ---------- captions: script text, word timings from whisper (caps.json) ----------
type Chunk = { s: number; e: number; words: W[] };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const c of CAPS) {
    let cur: W[] = [];
    c.words.forEach((w, i) => {
      cur.push(w);
      const brk = /[।?,!:]$/.test(w.w) && cur.length >= 3;
      if (brk || cur.length >= 7 || i === c.words.length - 1) { out.push({ s: cur[0].s, e: cur[cur.length - 1].e, words: cur }); cur = []; }
    });
  }
  return out;
})();
const Captions: React.FC = () => {
  const t = useT();
  const i = CHUNKS.findIndex((c, k) => t >= c.s - 0.08 && t < Math.min(c.e + 0.35, (CHUNKS[k + 1]?.s ?? 1e9) - 0.04));
  if (i < 0) return null;
  const c = CHUNKS[i];
  const o = interpolate(t, [c.s - 0.08, c.s + 0.08], [0, 1], clamp) * interpolate(t, [c.e + 0.2, c.e + 0.35], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: 1480, textAlign: "center", padding: "6px 24px 10px", borderRadius: 10, background: "rgba(0,0,0,.38)", fontFamily: BODY, fontWeight: 700, fontSize: 42, lineHeight: 1.35, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>
        {c.words.map((w, k) => {
          const on = t >= w.s && t < w.e + 0.06; const past = t >= w.e;
          return <span key={k} style={{ color: on ? "#ffd27a" : past ? "#fff" : "rgba(255,255,255,.62)" }}>{w.w}{k < c.words.length - 1 ? " " : ""}</span>;
        })}
      </div>
    </div>
  );
};

// ---------- seismograph (illustrative) ----------
const hashN = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const wiggle = (tau: number) => {
  // band-limited noise from a few incommensurate sines + per-cycle random amplitude
  let v = 0;
  const fr = [7.3, 11.9, 17.7, 23.1, 31.3];
  fr.forEach((f, i) => { v += Math.sin(tau * f * 2 * Math.PI + i * 1.7) * (0.6 + 0.4 * hashN(Math.floor(tau * f) + i * 97)); });
  return v / fr.length;
};
const Seismo: React.FC<{ mode: "real" | "whatif"; at: number }> = ({ mode, at }) => {
  const t = useT() - at;
  const penX = 1460, speed = 260, y0 = 640;
  const envReal = (tau: number) => mode === "real"
    ? 0.05 + interpolate(tau, [1.4, 2.4, 3.6, 5.6], [0, 1, 0.75, 0.25], clamp) // the 2025 tremor
    : 0.05 + interpolate(tau, [-2, 0.6, 2.2], [0.7, 0.55, 0], clamp);        // it fades out…
  const envGhost = (tau: number) => interpolate(tau, [0.6, 1.4, 5.6], [0, 0.95, 1], clamp); // …what if it kept going
  const pts = (env: (x: number) => number, amp: number, from = 0) => {
    const p: string[] = [];
    for (let x = from; x <= penX; x += 3) { const tau = t - (penX - x) / speed; p.push(`${x},${(y0 + wiggle(tau) * env(tau) * amp).toFixed(1)}`); }
    return p.join(" ");
  };
  const headY = y0 + wiggle(t) * envReal(t) * 190;
  const ghostOn = mode === "whatif";
  const ghostFrom = Math.max(0, penX - (t - 0.6) * speed);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, ${INK2} 0%, ${INK} 75%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 25 }, (_, i) => { const x = ((i * 80 - (t * speed) % 80) + 2000) % 2000; return <line key={i} x1={x} y1={380} x2={x} y2={900} stroke="rgba(255,255,255,.05)" strokeWidth={1} />; })}
        {[440, 540, 640, 740, 840].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="rgba(255,255,255,.05)" strokeWidth={1} />)}
        <polyline points={pts(envReal, 190)} fill="none" stroke="#e8edef" strokeWidth={2.2} strokeLinejoin="round" opacity={ghostOn ? 0.55 : 0.95} />
        {ghostOn && t > 0.6 ? <polyline points={pts(envGhost, 190, ghostFrom)} fill="none" stroke={RED} strokeWidth={2.4} strokeLinejoin="round" opacity={0.95} /> : null}
        <line x1={penX} y1={380} x2={penX} y2={900} stroke="rgba(255,255,255,.12)" strokeWidth={1} />
        <circle cx={penX} cy={ghostOn && t > 0.6 ? y0 + wiggle(t) * envGhost(t) * 190 : headY} r={6} fill={RED} />
      </svg>
      <div style={{ position: "absolute", right: 64, top: 920, fontFamily: BODY, fontWeight: 600, fontSize: 20, color: MUTED }}>প্রতীকী সিসমোগ্রাম</div>
    </AbsoluteFill>
  );
};

// ---------- hook ----------
const HookDate: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const a = springAt(f, L("h1").start, 16), b = springAt(f, L("h1").start + 0.7, 16);
  const o = fadeIO(t, L("h1").start - 0.1, 5.5, 0.35);
  return (
    <div style={{ position: "absolute", left: 120, top: 150, opacity: o }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, opacity: a, transform: `translateY(${(1 - a) * 26}px)` }}>২১ নভেম্বর ২০২৫</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: RED, lineHeight: 1.2, opacity: b, transform: `translateY(${(1 - b) * 26}px)` }}>সকাল ১০:৩৮</div>
    </div>
  );
};
const HookMore: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const a0 = L("h4").start;
  const a = springAt(f, a0 + 0.15, 15);
  return (
    <div style={{ position: "absolute", left: 120, top: 170, opacity: fadeIO(t, a0, L("h5").start, 0.3) }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: MUTED, marginBottom: 8 }}>আবহাওয়া অধিদপ্তরের মতে</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: "#fff", opacity: a, transform: `translateY(${(1 - a) * 26}px)` }}>আর <span style={{ color: RED }}>৫–৭</span> সেকেন্ড…</div>
    </div>
  );
};
const Bangshal: React.FC = () => {
  const t = useT();
  const a = L("h3").start, b = L("h4").start;
  const d = b - a; const lt = t - a;
  const sc = 1.04 + 0.12 * ease(Math.min(1, Math.max(0, lt / d)));
  return (
    <AbsoluteFill style={{ opacity: interpolate(lt, [0, 0.3, d - 0.25, d], [0, 1, 1, 0], clamp), overflow: "hidden" }}>
      <Img src={A("photos/bangshal.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc})`, transformOrigin: "62% 30%", filter: "saturate(.78) contrast(1.04) brightness(.86)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 58%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
const Place: React.FC<{ name: string; sub?: string; a: number; b: number }> = ({ name, sub, a, b }) => {
  const t = useT(); const o = fadeIO(t, a, b, 0.4);
  return (
    <div style={{ position: "absolute", left: 64, top: 74, opacity: o, transform: `translateX(${(1 - Math.min(1, (t - a) / 0.5)) * -20}px)` }}>
      <div style={{ width: 54, height: 4, background: RED, marginBottom: 12 }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "#fff", lineHeight: 1.1, textShadow: "0 3px 16px rgba(0,0,0,.8)" }}>{name}</div>
      {sub ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: SAND, textShadow: "0 2px 10px #000" }}>{sub}</div> : null}
    </div>
  );
};
const Title: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const a0 = L("h5").start;
  const a = springAt(f, a0 + 0.1, 14), b = springAt(f, a0 + 0.9, 16);
  const o = fadeIO(t, a0, L("p2").start, 0.25);
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(4,6,9,.35) 0%, rgba(4,6,9,.82) 70%)" }} />
      <div style={{ position: "relative", fontFamily: HEAD, fontWeight: 800, fontSize: 210, color: "#fff", lineHeight: 1, opacity: a, transform: `scale(${0.92 + 0.08 * a})`, textShadow: "0 6px 40px rgba(0,0,0,.6)" }}>যদি…</div>
      <div style={{ position: "relative", fontFamily: HEAD, fontWeight: 600, fontSize: 54, color: SAND, marginTop: 18, opacity: b, transform: `translateY(${(1 - b) * 20}px)` }}>ঢাকায় ৭+ মাত্রার ভূমিকম্প হয়?</div>
    </AbsoluteFill>
  );
};

// ---------- plates: Bangla labels pinned to the 3D anchors ----------
const PLATES_T0 = L("p2").start;
const PLATES_T1 = L("s1").start;
const PLATES_SRC_FRAMES = 1420;
type Lab = { k: string; text: string; a: number; b: number; kind?: "plate" | "fault" | "city" | "event"; edge?: boolean };
const LABS: Lab[] = [
  { k: "indian", text: "ভারতীয় প্লেট", a: L("p2").start, b: L("p5").start, kind: "plate" },
  { k: "burma", text: "বার্মা প্লেট", a: L("p2").start + 0.4, b: L("p5").start, kind: "plate" },
  { k: "eur", text: "ইউরেশীয় প্লেট", a: L("p2").start + 0.8, b: L("p5").start, kind: "plate" },
  { k: "locked", text: "আটকে থাকা ফল্ট", a: L("p3").start, b: L("p5").start, kind: "fault" },
  { k: "dhaka", text: "ঢাকা", a: L("p3b").start, b: L("p8").start + L("p8").vdur, kind: "city" },
  { k: "madhu", text: "মধুপুর ফল্ট", a: L("p5").start, b: L("p8").start + L("p8").vdur, kind: "fault" },
  { k: "dauki", text: "ডাউকি ফল্ট", a: L("p5b").start, b: L("p7").start + L("p7").vdur, kind: "fault" },
  { k: "m1762", text: "১৭৬২ · সেন্ট মার্টিন", a: T1762 - 0.1, b: L("p7").start, kind: "event", edge: true },
  { k: "m1897", text: "১৮৯৭ · শিলং", a: T1897 - 0.1, b: L("p8").start + L("p8").vdur, kind: "event" },
];
const PlateLabels: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const pf = Math.min(PLATES_SRC_FRAMES, Math.max(1, Math.round((t - PLATES_T0) / (PLATES_T1 - PLATES_T0) * PLATES_SRC_FRAMES)));
  const fr = PROJ[String(pf)];
  if (!fr || t < PLATES_T0 || t > PLATES_T1) return null;
  return (
    <>
      {LABS.map((l) => {
        if (t < l.a - 0.1 || t > l.b + 0.1) return null;
        const p = fr[l.k]; if (!p || p[2] <= 0) return null;
        let [x, y] = p; let arrow = "";
        if (l.edge && y > 0.9) { y = 0.86; arrow = " ↓"; }
        const edge = Math.min(1, Math.max(0, Math.min(x - 0.03, 0.97 - x, y - 0.05, 0.9 - y) / 0.04));
        const o = fadeIO(t, l.a, l.b, 0.35) * edge; if (o <= 0.01) return null;
        const X = x * 1920, Y = y * 1080;
        const plate = l.kind === "plate";
        const col = l.kind === "fault" ? "#ff5a4f" : l.kind === "event" ? "#ffd27a" : "#fff";
        const s = springAt(f, l.a, 16);
        if (plate) return (
          <div key={l.k} style={{ position: "absolute", left: X, top: Y, transform: `translate(-50%,-50%) translateY(${(1 - s) * 12}px)`, opacity: o, fontFamily: HEAD, fontWeight: 600, fontSize: 36, color: "#fff", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,.9), 0 0 2px #000" }}>{l.text}</div>
        );
        return (
          <div key={l.k} style={{ position: "absolute", left: X, top: Y, opacity: o }}>
            <div style={{ position: "absolute", left: -6, top: -6, width: 12, height: 12, borderRadius: 6, background: col, boxShadow: "0 0 0 3px rgba(0,0,0,.45)", transform: `scale(${s})` }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 46 * s, height: 1.5, background: col, transform: "rotate(-32deg)", transformOrigin: "0 0", opacity: arrow ? 0 : 0.9 }} />
            <div style={{ position: "absolute", left: arrow ? 14 : 40, top: arrow ? -18 : -56, whiteSpace: "nowrap", fontFamily: BODY, fontWeight: 700, fontSize: l.kind === "city" ? 34 : 28, color: col === "#fff" ? "#fff" : col, textShadow: "0 2px 10px rgba(0,0,0,.95), 0 0 2px #000", opacity: s }}>{l.text}{arrow}</div>
          </div>
        );
      })}
    </>
  );
};
const WaveTimer: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const a = P_AT - 0.2, b = L("s6").start + L("s6").vdur + 0.4;
  if (t < a - 0.1 || t > b + 0.1) return null;
  const sec = Math.max(0, (t - P_AT) * (8 / Math.max(0.5, S_AT - P_AT)));
  const isS = t >= S_AT; const s = springAt(f, isS ? S_AT : P_AT, 13);
  return (
    <div style={{ position: "absolute", right: 48, top: 92, opacity: fadeIO(t, a, b, 0.3), textAlign: "right", background: "rgba(6,9,12,.72)", padding: "12px 22px 14px", borderRadius: 10, borderTop: `3px solid ${RED}`, minWidth: 250 }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 22, color: SAND }}>ঢাকায়</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "#fff", lineHeight: 1.05 }}>{bn(String(Math.floor(sec)).padStart(2, "0"))} <span style={{ fontSize: 30 }}>সেকেন্ড</span></div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: isS ? RED : "#ffd27a", transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: "right center" }}>{isS ? "S-ওয়েভ · দুলুনি" : "P-ওয়েভ · ঝাঁকুনি"}</div>
    </div>
  );
};

// "সিমুলেশন · পূর্বাভাস নয়": big statement on s1, then the corner tag through the sim sections
const SimTag: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const a = L("s1").start - 0.05, end = L("c2").start - 0.15;
  if (t < a || t > end + 0.1) return null;
  const pop = springAt(f, a, 15);
  const p = spring({ frame: f - S(a + 3.1), fps: FPS, config: { damping: 18, mass: 0.9 } });
  const sc = 2.4 - 1.4 * p;
  const left = interpolate(p, [0, 1], [960, 40]), top = interpolate(p, [0, 1], [520, 34]);
  const o = Math.min(1, pop * 1.3) * interpolate(t, [end - 0.4, end], [1, 0], clamp);
  return (
    <>
      <AbsoluteFill style={{ background: "rgba(3,5,8,.45)", opacity: (1 - p) * pop }} />
      <div style={{ position: "absolute", left, top, opacity: o, transformOrigin: "0 0", transform: `scale(${sc * (0.94 + 0.06 * pop)}) translate(${-50 * (1 - p)}%, ${-50 * (1 - p)}%)`, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12, background: "rgba(5,8,12,.7)", border: `1.5px solid ${RED}`, borderRadius: 8, padding: "7px 16px 9px", fontFamily: BODY, fontWeight: 600, fontSize: 24, color: "#fff" }}>
        <div style={{ width: 9, height: 9, borderRadius: 5, background: RED }} />সিমুলেশন · পূর্বাভাস নয়
      </div>
    </>
  );
};

// ---------- studies (over the darkened top shot) ----------
const Stat: React.FC<{ at: number; until: number; eyebrow: string; value: (p: number) => React.ReactNode; sub: string; children?: React.ReactNode }> = ({ at, until, eyebrow, value, sub, children }) => {
  const t = useT(); const f = useCurrentFrame();
  if (t < at - 0.1 || t > until + 0.1) return null;
  const s = springAt(f, at, 15); const out = interpolate(t, [until - 0.45, until], [0, 1], clamp);
  const p = interpolate(t, [at + 0.15, at + 1.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 150, top: 260, opacity: Math.min(1, s * 1.4) * (1 - out), transform: `translateY(${(1 - s) * 34 - out * 30}px)` }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: SAND }}>{eyebrow}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1.08, marginTop: 4 }}>{value(p)}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 48, color: "#fff", marginTop: 2 }}>{sub}</div>
      {children}
    </div>
  );
};
const Studies: React.FC = () => {
  const t = useT();
  const t1 = L("t1").start, t2 = L("t2").start, t3 = L("t3").start, t4 = L("t4").start, t5 = L("t5").start, t6 = L("t6").start;
  const tEnd = L("a1").start;
  const bar = interpolate(t, [t5 + 1.4, t5 + 2.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <Stat at={t1 - 0.1} until={t2 - 0.2} eyebrow="সিডিএমপি ২০০৯ · মধুপুর ফল্টে ৭.৫ মাত্রার দৃশ্যপট" value={(p) => <>~{bnInt(72000 * p)}</>} sub="ভবন পুরো ধ্বংস হতে পারে" />
      <Stat at={t2 - 0.1} until={t3 - 0.2} eyebrow="সিডিএমপি ২০০৯ · একই দৃশ্যপট" value={(p) => <>~{bnInt(131000 * p)}</>} sub="মৃত্যু · হাসপাতালে আরও ~৩৩,০০০" />
      <Stat at={t3 - 0.1} until={t4 - 0.2} eyebrow="রাজউক · মধুপুর ফল্টে ৬.৯ মাত্রা (এটা ৭+ নয়)" value={() => <>~{bn("8.65")}–{bn("13.9")} <span style={{ fontSize: 90 }}>লাখ</span></>} sub="ভবন ধসে বা ভারী ক্ষতিতে · ৪০–৬৫%" />
      <Stat at={t4 - 0.1} until={t5 - 0.2} eyebrow="রাজউক ইউআরপি · দিনের বেলা, একই ৬.৯ দৃশ্যপট" value={() => <>~{bn("2.1")} <span style={{ fontSize: 90 }}>লাখ</span></>} sub="মৃত্যু · আহত ~২.২৯ লাখ · ক্ষতি US$২৫ বিলিয়ন" />
      <Stat at={t5 - 0.1} until={t6 - 0.2} eyebrow="রাজউক · ঢাকা ও গাজীপুর, নভেম্বর ২০২৫" value={(p) => <>{bnInt(3252 * p)} <span style={{ fontSize: 70, color: MUTED }}>/ ২১,০০,০০০</span></>} sub="ভবন ভূমিকম্প-নিরাপত্তায় যাচাই হয়েছে">
        <div style={{ marginTop: 32, width: 1240, opacity: bar }}>
          <div style={{ position: "relative", height: 18, borderRadius: 9, background: "rgba(255,255,255,.16)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(3, 1240 * (3252 / 2100000)) * bar, background: RED }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BODY, fontWeight: 600, fontSize: 26, color: MUTED, marginTop: 10 }}>
            <span><span style={{ color: RED }}>■</span> যাচাই: ০.১৫%-এর কম</span><span>মোট ~২১ লাখ ভবন</span>
          </div>
        </div>
      </Stat>
      <Stat at={t6 - 0.1} until={tEnd - 0.2} eyebrow="যাচাই করা ৩,২৫২ ভবনের মধ্যে" value={() => <>{bn(42)} <span style={{ fontSize: 70, color: MUTED }}>/ {bn(187)}</span></>} sub="ভাঙার সুপারিশ · মেরামতের সুপারিশ" />
    </>
  );
};

// ---------- access GFX ----------
const Clearance4: React.FC = () => {
  const t = useT(); const a = L("e2").start, b = L("e3").start;
  if (t < a - 0.1 || t > b + 0.05) return null;
  const o = fadeIO(t, a, b, 0.3);
  const w = interpolate(t, [a + 0.2, a + 1.1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 120, top: 220, opacity: o, width: 1400 }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: SAND, marginBottom: 18 }}>ফায়ার সার্ভিস · ন্যূনতম প্রস্থ</div>
      <div style={{ height: 54, width: 1100 * w, background: RED, borderRadius: 8, display: "flex", alignItems: "center", paddingLeft: 22, fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: "#fff" }}>৪ মিটার</div>
      <div style={{ marginTop: 14, fontFamily: HEAD, fontWeight: 700, fontSize: 40, color: "#fff", textShadow: "0 3px 14px #000" }}>উদ্ধার গাড়ি ঢুকতে হলে রাস্তা অন্তত এতটা চওড়া</div>
    </div>
  );
};
const AccessBars: React.FC = () => {
  const t = useT(); const a = L("e3").start, b = L("e4").start;
  if (t < a - 0.1 || t > b + 0.05) return null;
  const rows = [
    { name: "পুরান ঢাকা", pct: 63.3, at: a },
    { name: "ধানমন্ডি", pct: 43.0, at: L("e3b").start },
    { name: "গুলশান", pct: 30.5, at: a + 1.6 },
    { name: "উত্তরা", pct: 4.4, at: a + 2.2 },
  ];
  const o = fadeIO(t, a, b, 0.3);
  return (
    <div style={{ position: "absolute", left: 120, top: 200, opacity: o, width: 1480 }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: SAND, marginBottom: 22 }}>রাস্তা ৪ মিটারের চিকন · ইসলাম ও অন্যান্য, জেসিই-আইইবি ২০১৯</div>
      {rows.map((r) => {
        if (t < r.at - 0.05) return null;
        const p = interpolate(t, [r.at, r.at + 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 22, opacity: Math.min(1, p * 1.4) }}>
            <div style={{ width: 260, fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: "#fff", textAlign: "right" }}>{r.name}</div>
            <div style={{ flex: 1, height: 28, borderRadius: 8, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
              <div style={{ width: `${r.pct * p}%`, height: "100%", background: r.pct > 40 ? RED : "#d98a3a" }} />
            </div>
            <div style={{ width: 160, fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: "#fff" }}>{bn(r.pct.toFixed(1))}%</div>
          </div>
        );
      })}
    </div>
  );
};
const HospGfx: React.FC = () => {
  const t = useT();
  const a = L("e5").start, b = L("e8").start;
  if (t < a - 0.1 || t > b + 0.05) return null;
  const items: { at: number; until: number; n: string; label: string }[] = [
    { at: a, until: L("e5b").start, n: "১০", label: "বড় হাসপাতাল · পুরো ক্ষতি" },
    { at: a + 2.2, until: L("e5b").start, n: "২৪১", label: "হাসপাতাল-ক্লিনিক · আংশিক" },
    { at: a + 4.0, until: L("e5b").start, n: "৪", label: "ফায়ার স্টেশন · আংশিক" },
    { at: L("e5b").start, until: L("e6").start, n: "৯০", label: "স্কুল · পুরো ক্ষতি" },
    { at: L("e6").start, until: b, n: "২৪,২৪২", label: "শয্যা · চাহিদার ৪১%, প্রথম দিন" },
  ];
  return (
    <>
      {items.map((it) => {
        if (t < it.at - 0.1 || t > it.until + 0.05) return null;
        const o = fadeIO(t, it.at, it.until, 0.3);
        return (
          <div key={it.label + it.at} style={{ position: "absolute", left: 140, top: 280, opacity: o }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 160, color: "#fff", lineHeight: 1 }}>{it.n}</div>
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 48, color: SAND, marginTop: 8 }}>{it.label}</div>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 26, color: MUTED, marginTop: 10 }}>সিডিএমপি ২০০৯ · দৃশ্যপট, পূর্বাভাস নয়</div>
          </div>
        );
      })}
    </>
  );
};

// Area-risk typography (3D labels were removed from the Blender scene)
const AreaLegend: React.FC = () => {
  const t = useT(); const a = L("a1").start, b = L("a3").start;
  if (t < a - 0.1 || t > b + 0.05) return null;
  const rows = [
    { c: "#c45a32", name: "পুরান ঢাকা", sub: "চিকন রাস্তা · সফট-স্টোরি", at: a },
    { c: "#2a7a8c", name: "টাওয়ার এলাকা", sub: "শক্ত মাটি · দীর্ঘ দোলন", at: L("a2").start },
    { c: "#b08a2a", name: "ভরাট জমি", sub: "তরল হওয়ার আশঙ্কা", at: L("a2").start + 3.2 },
  ];
  const o = fadeIO(t, a, b, 0.35);
  return (
    <div style={{ position: "absolute", left: 64, top: 120, opacity: o }}>
      {rows.map((r) => {
        if (t < r.at - 0.05) return null;
        const s = interpolate(t, [r.at, r.at + 0.5], [0, 1], clamp);
        return (
          <div key={r.name} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 22, opacity: s, transform: `translateX(${(1 - s) * -16}px)` }}>
            <div style={{ width: 28, height: 28, borderRadius: 4, background: r.c, marginTop: 8 }} />
            <div>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: "#fff", lineHeight: 1.1, textShadow: "0 2px 12px #000" }}>{r.name}</div>
              <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 24, color: SAND }}>{r.sub}</div>
            </div>
          </div>
        );
      })}
      {t >= L("a2b").start ? (
        <div style={{ marginTop: 18, fontFamily: HEAD, fontWeight: 700, fontSize: 32, color: "#8fd0c8", textShadow: "0 2px 10px #000", opacity: fadeIO(t, L("a2b").start, b, 0.3) }}>
          বুড়িগঙ্গা বেল্ট · বালু বেল্ট
        </div>
      ) : null}
    </div>
  );
};

// ---------- checklist ----------
const ITEMS: { id: string; text: React.ReactNode }[] = [
  { id: "c2", text: "বসুন · ঢাকুন · ধরে থাকুন" },
  { id: "c8", text: "নিচতলায় খোলা জায়গা · লিফট নয়" },
  { id: "c4", text: "গ্যাস ও মেইন সুইচ বন্ধ" },
  { id: "c9", text: "টর্চ · হেলমেট · ওষুধ · বাঁশি" },
  { id: "c11", text: "গাড়িতে · ফ্লাইওভার থেকে দূরে" },
  { id: "c5", text: <><span style={{ color: RED }}>৯৯৯</span> · ফায়ার সার্ভিস <span style={{ color: RED }}>১০২</span></> },
];
const Checklist: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const q0 = L("c2").start;
  const qa = springAt(f, q0 - 0.15, 15);
  const qm = spring({ frame: f - S(q0 - 0.2), fps: FPS, config: { damping: 18 } });
  const active = ITEMS.reduce((k, it, i) => (t >= L(it.id).start - 0.15 ? i : k), -1);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 40%, ${INK2} 0%, ${INK} 70%)` }}>
      <div style={{ position: "absolute", left: interpolate(qm, [0, 1], [960, 120]), top: interpolate(qm, [0, 1], [470, 110]), transformOrigin: "0 0", transform: `scale(${1.7 - 0.7 * qm}) translate(${-50 * (1 - qm)}%, ${-50 * (1 - qm)}%)`, opacity: qa, whiteSpace: "nowrap", fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: qm > 0.5 ? SAND : "#fff" }}>
        ভূমিকম্পে আপনি কী করবেন?
      </div>
      {ITEMS.map((it, i) => {
        const at = L(it.id).start - 0.15; if (t < at - 0.05) return null;
        const s = springAt(f, at, 15); const on = i === active;
        return (
          <div key={it.id} style={{ position: "absolute", left: 120, top: 210 + i * 96, display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, s * 1.4) * (on ? 1 : 0.42), transform: `translateX(${(1 - s) * -30}px)` }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, border: `2px solid ${on ? RED : "rgba(255,255,255,.4)"}`, background: on ? RED : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 28, color: "#fff" }}>{bn(i + 1)}</div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: on ? 52 : 44, color: "#fff", whiteSpace: "nowrap" }}>{it.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const EndCard: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const a0 = L("c10").start - 0.15;
  const a = springAt(f, a0 + 0.1, 16), b = springAt(f, a0 + 0.7, 16);
  return (
    <AbsoluteFill style={{ background: INK, opacity: interpolate(t, [a0, a0 + 0.4, END - 0.5, END], [0, 1, 1, 0], clamp), justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Img src={staticFile("cob/logo-light.png")} style={{ height: 64, marginBottom: 40, opacity: a * 0.92 }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 72, color: "#fff", opacity: a, transform: `translateY(${(1 - a) * 22}px)`, textAlign: "center", padding: "0 80px" }}>যদি… ঢাকায় ৭+ মাত্রার ভূমিকম্প হয়?</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: RED, marginTop: 16, opacity: b, transform: `translateY(${(1 - b) * 22}px)` }}>৯৯৯ · ফায়ার সার্ভিস ১০২</div>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 26, color: MUTED, marginTop: 44, opacity: b, textAlign: "center", lineHeight: 1.5 }}>
        ৩D দৃশ্য সিমুলেশন, পূর্বাভাস নয় · সব তথ্যসূত্র ডেসক্রিপশনে<br />
        সঙ্গীত: Corrupt Data Stream — Tsorthan Grove · CC0 1.0
      </div>
    </AbsoluteFill>
  );
};

// ---------- audio ----------
const speakAmt = (t: number) => LINES.reduce((m, l) => Math.max(m, interpolate(t, [l.start - 0.45, l.start - 0.1, l.start + l.vdur + 0.15, l.start + l.vdur + 0.6], [0, 1, 1, 0], clamp)), 0);
const BED = 0.45;
const Mix: React.FC = () => {
  if ((getInputProps() as { silent?: boolean }).silent) return null;
  const vo = LINES.map((l) => <Sequence key={l.id} from={S(l.start)} durationInFrames={S(l.vdur + 1.2)}><Audio src={A(`vo/${l.id}.wav`)} /></Sequence>);
  const sfx = (src: string, at: number, vol: number, dur?: number, fi = 0, fo = 0) => (
    <Sequence key={src + at} from={S(at)} durationInFrames={dur ? S(dur) : undefined}>
      <Audio src={A(`sfx/${src}`)} volume={(fr) => { const t = fr / FPS; const T = t + at; return BED * vol * (1 - 0.45 * speakAmt(T)) * (fi ? Math.min(1, t / fi) : 1) * (fo && dur ? Math.max(0, Math.min(1, (dur - t) / fo)) : 1); }} />
    </Sequence>
  );
  const stem = (getInputProps() as { stem?: string }).stem;
  if (stem === "vo") return <>{vo}</>;
  return (
    <>
      {stem === "bed" ? null : vo}
      <Audio src={A("music/bed.mp3")} volume={(fr) => { const t = fr / FPS; return (0.13 - 0.095 * speakAmt(t)) * Math.min(1, t / 1.2) * interpolate(t, [END - 2.5, END], [1, 0], clamp); }} />
      {sfx("scratch.mp3", 0.0, 0.45, 5.4, 0.3, 0.8)}
      {sfx("rumble.mp3", 1.6, 0.3, 3.9, 0.8, 1.2)}
      {sfx("rumble.mp3", 5.5, 0.32, 6.5, 0.4, 1.5)}
      {sfx("scratch.mp3", L("h4").start, 0.42, 5.8, 0.3, 1.0)}
      {sfx("boom.mp3", L("h5").start, 0.85)}
      {sfx("whoosh.mp3", L("p2").start - 0.9, 0.4)}
      {sfx("jolt.mp3", P_AT - 0.05, 0.75)}
      {sfx("rumble.mp3", P_AT, 0.4, S_AT - P_AT + 0.5, 0.2, 0.5)}
      {sfx("rumble.mp3", S_AT, 0.75, 12.0, 0.3, 2.0)}
      {sfx("rumble.mp3", L("w2").start, 0.4, 20, 0.8, 2.5)}
      {sfx("rumble.mp3", L("q3").start, 0.55, 14, 0.6, 2.0)}
      {sfx("debris.mp3", L("q3b").start, 0.4, 4.0, 0, 1.0)}
      {sfx("collapse.mp3", L("q3b").start + 2.0, 0.55)}
      {sfx("sirens.mp3", L("e1").start, 0.32, 16, 1.2, 2.5)}
      {sfx("fire.mp3", L("e4").start, 0.28, 12, 1, 2)}
      {sfx("debris.mp3", L("e4").start + 1.0, 0.4, 3.2, 0, 1.0)}
      {sfx("ambience.mp3", L("t1").start, 0.18, 50, 1.5, 3)}
      {sfx("whoosh.mp3", L("c2").start - 0.3, 0.35)}
      {sfx("whoosh.mp3", L("c10").start - 0.3, 0.3)}
    </>
  );
};

const CLIP8 = 8; // GHA blender shots are 240 frames @ 30 fps
const SeqShot: React.FC<{ at: number; until: number; src: string; from?: number; rate?: number; fade?: number; fadeIn?: number; fadeOut?: number; filter?: string; push?: number; shade?: boolean; stretch?: boolean }> = ({ at, until, src, from = 0, rate, fade, fadeIn, fadeOut, filter, push, shade, stretch }) => {
  const dur = until - at;
  const r = rate ?? (stretch ? CLIP8 / Math.max(0.5, dur) : 1);
  return (
    <Sequence from={S(at)} durationInFrames={Math.max(1, S(dur))}>
      <Shot src={src} dur={dur} from={from} rate={r} fade={fade} fadeIn={fadeIn} fadeOut={fadeOut} filter={filter} push={push} />
      {shade ? <TextShade /> : null}
    </Sequence>
  );
};

export const WhatIfEp1: React.FC = () => {
  const t = useT();
  const p2 = L("p2").start, s1 = L("s1").start, w1 = L("w1").start, q1 = L("q1").start, e1 = L("e1").start, t1 = L("t1").start, a1 = L("a1").start, a3 = L("a3").start, c2 = L("c2").start, c10 = L("c10").start;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* ---- picture (full res) ---- */}
      {t < 5.5 ? <Stage><Seismo mode="real" at={0} /></Stage> : null}
      <SeqShot at={5.5} until={L("h2b").start} src="shots/aerial.mp4" filter="saturate(.9)" />
      <SeqShot at={L("h2b").start} until={L("h3").start} src="shots/olddhaka_shankhari_lane.mp4" fadeIn={0.3} fadeOut={0.2} shade />
      {t >= L("h3").start && t < L("h4").start ? <Bangshal /> : null}
      {t >= L("h4").start && t < L("h5").start ? <Stage><Seismo mode="whatif" at={L("h4").start} /></Stage> : null}
      <SeqShot at={L("h5").start} until={p2} src="shots/orbit.mp4" from={70} fade={0.25} filter="saturate(.75) brightness(.8)" push={0.04} />
      <SeqShot at={p2} until={s1} src="shots/plates.mp4" fade={0} rate={PLATES_SRC_FRAMES / (FPS * (s1 - p2))} />
      <SeqShot at={s1} until={L("s4").start} src="shots/orbit.mp4" fade={0.3} filter="saturate(.85) brightness(.9)" />
      <SeqShot at={L("s4").start} until={L("s5").start} src="shots/olddhaka_market_alley.mp4" fade={0.25} shade />
      <SeqShot at={L("s5").start} until={L("s6").start} src="shots/laneB.mp4" fade={0.2} shade />
      <SeqShot at={L("s6").start} until={w1} src="shots/gulshan_sway.mp4" stretch fade={0.25} shade />
      <SeqShot at={w1} until={L("w2").start} src="shots/area_risk_map.mp4" stretch fade={0.25} />
      <SeqShot at={L("w2").start} until={L("w3").start} src="shots/gulshan_sway.mp4" stretch shade />
      <SeqShot at={L("w3").start} until={L("w4").start} src="shots/mirpur_sway.mp4" stretch shade />
      <SeqShot at={L("w4").start} until={q1} src="shots/gulshan_sway.mp4" stretch shade />
      <SeqShot at={q1} until={L("q2").start} src="shots/area_risk_map.mp4" stretch fade={0.25} />
      <SeqShot at={L("q2").start} until={L("q4").start} src="shots/liquefaction.mp4" stretch shade />
      <SeqShot at={L("q4").start} until={L("q5").start} src="shots/area_risk_map.mp4" stretch />
      <SeqShot at={L("q5").start} until={e1} src="shots/liquefaction.mp4" stretch shade />
      <SeqShot at={e1} until={L("e5").start} src="shots/access_blocked.mp4" stretch shade />
      <SeqShot at={L("e5").start} until={L("e8").start} src="shots/access_blocked.mp4" stretch filter="brightness(.45) saturate(.7)" />
      <SeqShot at={L("e8").start} until={L("e7").start} src="shots/access_blocked.mp4" stretch shade />
      <SeqShot at={L("e7").start} until={t1} src="shots/top.mp4" fade={0.3} filter="brightness(.7) saturate(.8)" push={0.05} />
      <SeqShot at={t1} until={a1} src="shots/top_slow.mp4" fade={0.35} filter="brightness(.38) saturate(.55) blur(1px)" push={0.05} />
      <SeqShot at={a1} until={a3} src="shots/area_risk_map.mp4" stretch fade={0.3} />
      <SeqShot at={a3} until={c2} src="shots/home_check.mp4" stretch shade />
      {t >= c2 && t < c10 - 0.15 ? <Stage><Checklist /></Stage> : null}
      {t >= c10 - 0.15 ? <Stage><EndCard /></Stage> : null}
      <Vignette />
      {/* ---- overlays (design space) ---- */}
      <Stage>
        {t < 5.6 ? <HookDate /> : null}
        <Tag text="৩D পুনর্নির্মাণ · প্রতীকী" o={fadeIO(t, 5.7, L("h2b").start, 0.3)} color="#7fd0c4" />
        <Fact id="h2" />
        <Bangshal_Overlay />
        {t > L("h4").start && t < L("h5").start ? <HookMore /> : null}
        {t > L("h5").start && t < p2 ? <Title /> : null}
        <Note text="স্কেল অনুযায়ী নয় · আনুমানিক অবস্থান" o={fadeIO(t, p2, s1, 0.4)} />
        <PlateLabels />
        <Fact id="p2" /><Fact id="p3" /><Fact id="p3b" /><Fact id="p4" /><Fact id="p5" /><Fact id="p5b" /><Fact id="p6" /><Fact id="p7" /><Fact id="p8" />
        <WaveTimer />
        <Fact id="s4" /><Fact id="s5" /><Fact id="s6" until={w1} />
        <Tag text="মিরপুর · OSM ভিত্তিক সিমুলেশন" o={fadeIO(t, L("w3").start, L("w4").start, 0.3)} color="#7fd0c4" />
        <Fact id="w1" /><Fact id="w2" /><Fact id="w2b" /><Fact id="w3" /><Fact id="w4" /><Fact id="w5" /><Fact id="w5b" />
        <Fact id="q1" /><Fact id="q2" /><Fact id="q3" /><Fact id="q3b" /><Fact id="q4" /><Fact id="q4b" /><Fact id="q5" /><Fact id="q5b" /><Fact id="q6" /><Fact id="q8" />
        <Clearance4 />
        <AccessBars />
        <HospGfx />
        <Fact id="e1" /><Fact id="e2" /><Fact id="e4" /><Fact id="e8" /><Fact id="e7" />
        {t >= t1 && t < a1 ? <Studies /> : null}
        <AreaLegend />
        <Fact id="a1" /><Fact id="a1b" /><Fact id="a2" /><Fact id="a2b" />
        <Fact id="a3" /><Fact id="a4" /><Fact id="a5" /><Fact id="a5b" /><Fact id="a5c" /><Fact id="a6" /><Fact id="a7" />
        <SimTag />
        <Sources />
        <Captions />
      </Stage>
      <Grain />
      <Mix />
    </AbsoluteFill>
  );
};
const Bangshal_Overlay: React.FC = () => {
  const t = useT();
  const a = L("h3").start, b = L("h4").start;
  if (t < a || t > b) return null;
  return (
    <>
      <Place name="বংশাল, পুরান ঢাকা" sub="২১ নভেম্বর ২০২৫-এর ভূমিকম্পে এখানে তিনজন পথচারী মারা যান" a={a + 0.1} b={b - 0.1} />
      <Credit text="প্রতীকী দৃশ্য: পুরান ঢাকা" o={fadeIO(t, a + 0.1, b, 0.3)} />
    </>
  );
};
