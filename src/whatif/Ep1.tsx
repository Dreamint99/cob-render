// "যদি… ঢাকায় ৭+ মাত্রার ভূমিকম্প হয়?" — ~2:20 sample. Composition is 2560x1440; overlays are
// designed in a 1920x1080 space (<Stage>, scaled ×4/3); 3D shot clips play at full 1440p underneath.
// Every on-screen number comes from work/whatif/research.md (see `source` in script.json).
import "./fonts";
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import script from "../../public/whatif/ep1/script.json";
import capsRaw from "../../public/whatif/ep1/caps.json";
import projRaw from "./plates_proj.json";

const A = (f: string) => staticFile(`whatif/ep1/${f}`);
const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
export const EP1_LEN = Math.ceil(139.9 * FPS); // 4197
const END = 139.9;
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
const Shot: React.FC<{ src: string; dur: number; from?: number; rate?: number; fade?: number; filter?: string; push?: number }> = ({ src, dur, from = 0, rate = 1, fade = 0.3, filter, push = 0 }) => {
  const t = useT();
  const o = fade ? interpolate(t, [0, fade, dur - fade, dur], [0, 1, 1, 0], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <OffthreadVideo src={A(src)} startFrom={from} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter, transform: `scale(${1 + push * (t / dur)})` }} />
    </AbsoluteFill>
  );
};

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
  const a = springAt(f, 1.15, 16), b = springAt(f, 1.9, 16);
  const o = fadeIO(t, 1.1, 5.5, 0.35);
  return (
    <div style={{ position: "absolute", left: 120, top: 150, opacity: o }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.05, opacity: a, transform: `translateY(${(1 - a) * 26}px)` }}>২১ নভেম্বর ২০২৫</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: RED, lineHeight: 1.2, opacity: b, transform: `translateY(${(1 - b) * 26}px)` }}>সকাল ১০:৩৮</div>
    </div>
  );
};
const HookMore: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const a = springAt(f, 19.0, 15);
  return (
    <div style={{ position: "absolute", left: 120, top: 170, opacity: fadeIO(t, 18.9, 24.4, 0.3) }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: MUTED, marginBottom: 8 }}>আবহাওয়া অধিদপ্তরের মতে</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: "#fff", opacity: a, transform: `translateY(${(1 - a) * 26}px)` }}>আর <span style={{ color: RED }}>৫–৭</span> সেকেন্ড…</div>
    </div>
  );
};
const Bangshal: React.FC = () => {
  const t = useT(); const d = 18.6 - 12.0; const lt = t - 12.0;
  const sc = 1.04 + 0.12 * ease(Math.min(1, Math.max(0, lt / d)));
  return (
    <AbsoluteFill style={{ opacity: interpolate(lt, [0, 0.3, d - 0.2, d], [0, 1, 1, 0], clamp), overflow: "hidden" }}>
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
  const a = springAt(f, 24.5, 14), b = springAt(f, 25.3, 16);
  const o = fadeIO(t, 24.4, 28.5, 0.25);
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(4,6,9,.35) 0%, rgba(4,6,9,.82) 70%)" }} />
      <div style={{ position: "relative", fontFamily: HEAD, fontWeight: 800, fontSize: 210, color: "#fff", lineHeight: 1, opacity: a, transform: `scale(${0.92 + 0.08 * a})`, textShadow: "0 6px 40px rgba(0,0,0,.6)" }}>যদি…</div>
      <div style={{ position: "relative", fontFamily: HEAD, fontWeight: 600, fontSize: 54, color: SAND, marginTop: 18, opacity: b, transform: `translateY(${(1 - b) * 20}px)` }}>ঢাকায় ৭+ মাত্রার ভূমিকম্প হয়?</div>
    </AbsoluteFill>
  );
};

// ---------- plates: Bangla labels pinned to the 3D anchors ----------
type Lab = { k: string; text: string; a: number; b: number; kind?: "plate" | "fault" | "city" | "event"; edge?: boolean };
const LABS: Lab[] = [
  { k: "indian", text: "ভারতীয় প্লেট", a: 31.6, b: 47.0, kind: "plate" },
  { k: "burma", text: "বার্মা প্লেট", a: 32.2, b: 47.0, kind: "plate" },
  { k: "eur", text: "ইউরেশীয় প্লেট", a: 32.8, b: 47.0, kind: "plate" },
  { k: "locked", text: "আটকে থাকা ফল্ট", a: 35.4, b: 54.0, kind: "fault" },
  { k: "dhaka", text: "ঢাকা", a: 47.9, b: 75.8, kind: "city" },
  { k: "madhu", text: "মধুপুর ফল্ট", a: 48.9, b: 75.8, kind: "fault" },
  { k: "m1762", text: "১৭৬২ · সেন্ট মার্টিন", a: T1762 - 0.1, b: T1897, kind: "event", edge: true },
  { k: "m1897", text: "১৮৯৭ · শিলং", a: T1897 - 0.1, b: 61.2, kind: "event" },
  { k: "dauki", text: "ডাউকি ফল্ট", a: T1897 + 0.6, b: 61.2, kind: "fault" },
];
const PlateLabels: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const pf = Math.min(1420, Math.max(1, f - 854)); const fr = PROJ[String(pf)];
  if (!fr || t < 28.5 || t > 75.83) return null;
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
// P/S timer: seconds in Dhaka since the P-wave (sim time; rings move 2.55 sim-s per video-s)
const WaveTimer: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const a = P_AT - 0.2, b = 75.8;
  if (t < a - 0.1 || t > b + 0.1) return null;
  const sec = Math.max(0, (t - P_AT) * ((8) / Math.max(0.5, S_AT - P_AT)));
  const isS = t >= S_AT; const s = springAt(f, isS ? S_AT : P_AT, 13);
  return (
    <div style={{ position: "absolute", right: 48, top: 92, opacity: fadeIO(t, a, b, 0.3), textAlign: "right", background: "rgba(6,9,12,.72)", padding: "12px 22px 14px", borderRadius: 10, borderTop: `3px solid ${RED}`, minWidth: 250 }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 22, color: SAND }}>ঢাকায়</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "#fff", lineHeight: 1.05 }}>{bn(String(Math.floor(sec)).padStart(2, "0"))} <span style={{ fontSize: 30 }}>সেকেন্ড</span></div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: isS ? RED : "#ffd27a", transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: "right center" }}>{isS ? "S-ওয়েভ · দুলুনি" : "P-ওয়েভ · ঝাঁকুনি"}</div>
    </div>
  );
};

// "সিমুলেশন · পূর্বাভাস নয়": big statement on s1, then it becomes the corner tag for the whole scenario
const SimTag: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const a = L("s1").start - 0.05, end = 109.0;
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
    <div style={{ position: "absolute", left: 150, top: 300, opacity: Math.min(1, s * 1.4) * (1 - out), transform: `translateY(${(1 - s) * 34 - out * 30}px)` }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: SAND }}>{eyebrow}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 168, color: "#fff", lineHeight: 1.08, marginTop: 4 }}>{value(p)}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 52, color: "#fff", marginTop: 2 }}>{sub}</div>
      {children}
    </div>
  );
};
const Studies: React.FC = () => {
  const t = useT();
  const t1 = L("t1").start, t2 = L("t2").start, t3 = L("t3").start;
  const bar = interpolate(t, [t3 + 1.6, t3 + 2.6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <Stat at={t1 - 0.1} until={t2 - 0.2} eyebrow="সিডিএমপি ২০০৯ · মধুপুর ফল্টে ৭.৫ মাত্রার দৃশ্যপট" value={(p) => <>~{bnInt(72000 * p)}</>} sub="ভবন পুরো ধ্বংস হতে পারে" />
      <Stat at={t2 - 0.1} until={t3 - 0.2} eyebrow="রাজউক ২০২৩ · মধুপুর ফল্টে ৬.৯ মাত্রার দৃশ্যপট" value={(p) => <>~{bn((8.65 * p).toFixed(2))} <span style={{ fontSize: 110 }}>লাখ</span></>} sub="ভবন ঝুঁকিতে" />
      <Stat at={t3 - 0.1} until={109.0} eyebrow="রাজউক · ঢাকা ও গাজীপুর, নভেম্বর ২০২৫" value={(p) => <>{bnInt(3252 * p)} <span style={{ fontSize: 76, color: MUTED }}>/ ২১,০০,০০০</span></>} sub="ভবন ভূমিকম্প-নিরাপত্তায় যাচাই হয়েছে">
        <div style={{ marginTop: 40, width: 1240, opacity: bar }}>
          <div style={{ position: "relative", height: 18, borderRadius: 9, background: "rgba(255,255,255,.16)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(3, 1240 * (3252 / 2100000)) * bar, background: RED }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BODY, fontWeight: 600, fontSize: 26, color: MUTED, marginTop: 10 }}>
            <span><span style={{ color: RED }}>■</span> যাচাই: ০.১৫%-এর কম</span><span>মোট ~২১ লাখ ভবন</span>
          </div>
        </div>
      </Stat>
    </>
  );
};

// ---------- checklist ----------
const ITEMS: { id: string; text: React.ReactNode }[] = [
  { id: "c2", text: "বসুন · ঢাকুন · ধরে থাকুন" },
  { id: "c3", text: "লিফট নয় · জানালা থেকে দূরে" },
  { id: "c4", text: "গ্যাস ও মেইন সুইচ বন্ধ" },
  { id: "c5", text: <><span style={{ color: RED }}>৯৯৯</span> · ফায়ার সার্ভিস <span style={{ color: RED }}>১০২</span></> },
  { id: "c6", text: "রাজউকের অনুমোদন আছে?" },
];
const Checklist: React.FC = () => {
  const t = useT(); const f = useCurrentFrame();
  const q0 = L("c1").start;
  const qa = springAt(f, q0 - 0.1, 15);
  const qm = spring({ frame: f - S(L("c2").start - 0.35), fps: FPS, config: { damping: 18 } });
  const active = ITEMS.reduce((k, it, i) => (t >= L(it.id).start - 0.15 ? i : k), -1);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 40%, ${INK2} 0%, ${INK} 70%)` }}>
      <div style={{ position: "absolute", left: interpolate(qm, [0, 1], [960, 160]), top: interpolate(qm, [0, 1], [470, 150]), transformOrigin: "0 0", transform: `scale(${1.7 - 0.7 * qm}) translate(${-50 * (1 - qm)}%, ${-50 * (1 - qm)}%)`, opacity: qa, whiteSpace: "nowrap", fontFamily: HEAD, fontWeight: 800, fontSize: 60, color: qm > 0.5 ? SAND : "#fff" }}>
        ভূমিকম্পে আপনি কী করবেন?
      </div>
      {ITEMS.map((it, i) => {
        const at = L(it.id).start - 0.15; if (t < at - 0.05) return null;
        const s = springAt(f, at, 15); const on = i === active;
        return (
          <div key={it.id} style={{ position: "absolute", left: 160, top: 290 + i * 112, display: "flex", alignItems: "center", gap: 30, opacity: Math.min(1, s * 1.4) * (on ? 1 : 0.42), transform: `translateX(${(1 - s) * -30}px)` }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, border: `2px solid ${on ? RED : "rgba(255,255,255,.4)"}`, background: on ? RED : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: "#fff" }}>{bn(i + 1)}</div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: on ? 62 : 52, color: "#fff", whiteSpace: "nowrap" }}>{it.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const EndCard: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const a0 = L("c7").start - 0.25;
  const a = springAt(f, a0 + 0.1, 16), b = springAt(f, a0 + 0.7, 16);
  return (
    <AbsoluteFill style={{ background: INK, opacity: interpolate(t, [a0, a0 + 0.4, END - 0.7, END], [0, 1, 1, 0], clamp), justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Img src={staticFile("cob/logo-light.png")} style={{ height: 64, marginBottom: 46, opacity: a * 0.92 }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 84, color: "#fff", opacity: a, transform: `translateY(${(1 - a) * 22}px)` }}>যদি… ঢাকায় ৭+ মাত্রার ভূমিকম্প হয়?</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 46, color: RED, marginTop: 10, opacity: b, transform: `translateY(${(1 - b) * 22}px)` }}>পুরো পর্ব আসছে</div>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 26, color: MUTED, marginTop: 50, opacity: b }}>৩D দৃশ্য সিমুলেশন, পূর্বাভাস নয় · সব তথ্যসূত্র ডেসক্রিপশনে</div>
    </AbsoluteFill>
  );
};

// ---------- audio ----------
const speakAmt = (t: number) => LINES.reduce((m, l) => Math.max(m, interpolate(t, [l.start - 0.45, l.start - 0.1, l.start + l.vdur + 0.15, l.start + l.vdur + 0.6], [0, 1, 1, 0], clamp)), 0);
const Mix: React.FC = () => {
  const vo = LINES.map((l) => <Sequence key={l.id} from={S(l.start)} durationInFrames={S(l.vdur + 1.2)}><Audio src={A(`vo/${l.id}.wav`)} /></Sequence>);
  const sfx = (src: string, at: number, vol: number, dur?: number, fi = 0, fo = 0) => (
    <Sequence key={src + at} from={S(at)} durationInFrames={dur ? S(dur) : undefined}>
      <Audio src={A(`sfx/${src}`)} volume={(fr) => { const t = fr / FPS; return vol * (fi ? Math.min(1, t / fi) : 1) * (fo && dur ? Math.max(0, Math.min(1, (dur - t) / fo)) : 1); }} />
    </Sequence>
  );
  return (
    <>
      {vo}
      <Audio src={A("music/score.mp3")} volume={(fr) => { const t = fr / FPS; return (0.30 - 0.175 * speakAmt(t)) * Math.min(1, t / 1.2) * interpolate(t, [END - 2.5, END], [1, 0], clamp); }} />
      {sfx("scratch.mp3", 0.0, 0.45, 5.4, 0.3, 0.8)}
      {sfx("rumble.mp3", 1.6, 0.3, 3.9, 0.8, 1.2)}
      {sfx("rumble.mp3", 5.5, 0.32, 6.5, 0.4, 1.5)}
      {sfx("scratch.mp3", 18.6, 0.42, 5.8, 0.3, 1.0)}
      {sfx("boom.mp3", 24.4, 0.85)}
      {sfx("whoosh.mp3", 28.2, 0.4)}
      {sfx("jolt.mp3", P_AT - 0.05, 0.75)}
      {sfx("rumble.mp3", P_AT, 0.4, S_AT - P_AT + 0.5, 0.2, 0.5)}
      {sfx("rumble.mp3", S_AT, 0.75, 9.0, 0.3, 2.0)}
      {sfx("debris.mp3", 77.0, 0.4, 3.2, 0, 1.0)}
      {sfx("collapse.mp3", 80.4, 0.65)}
      {sfx("debris.mp3", 81.4, 0.45)}
      {sfx("collapse.mp3", 84.6, 0.5)}
      {sfx("fire.mp3", 83.0, 0.28, 6, 1, 2)}
      {sfx("sirens.mp3", 84.0, 0.3, 7.0, 1.5, 2.5)}
      {sfx("ambience.mp3", 91.0, 0.18, 12, 1.5, 3)}
      {sfx("whoosh.mp3", 108.8, 0.35)}
      {sfx("whoosh.mp3", L("c7").start - 0.4, 0.3)}
    </>
  );
};

export const WhatIfEp1: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* ---- picture (full res) ---- */}
      {t < 5.5 ? <Stage><Seismo mode="real" at={0} /></Stage> : null}
      <Sequence from={S(5.5)} durationInFrames={S(6.5)}><Shot src="shots/aerial.mp4" dur={6.5} filter="saturate(.9)" /></Sequence>
      {t >= 12.0 && t < 18.6 ? <Bangshal /> : null}
      {t >= 18.6 && t < 24.4 ? <Stage><Seismo mode="whatif" at={18.6} /></Stage> : null}
      <Sequence from={S(24.4)} durationInFrames={S(4.1)}><Shot src="shots/orbit.mp4" from={70} dur={4.1} fade={0.25} filter="saturate(.75) brightness(.8)" push={0.04} /></Sequence>
      <Sequence from={855} durationInFrames={1420}><Shot src="shots/plates.mp4" dur={1420 / FPS} fade={0} /></Sequence>
      <Sequence from={2275} durationInFrames={125}><Shot src="shots/laneB.mp4" dur={125 / FPS} rate={121 / 125} fade={0} /></Sequence>
      <Sequence from={2400} durationInFrames={S(11)}><Shot src="shots/orbit.mp4" dur={11} fade={0} /></Sequence>
      <Sequence from={S(91)} durationInFrames={S(18)}><Shot src="shots/top_slow.mp4" dur={18} fade={0.35} filter="brightness(.38) saturate(.55) blur(1px)" push={0.05} /></Sequence>
      {t >= 108.8 ? <Stage><Checklist /></Stage> : null}
      <Vignette />
      {/* ---- overlays (design space) ---- */}
      <Stage>
        {t < 5.6 ? <HookDate /> : null}
        <Tag text="৩D পুনর্নির্মাণ · প্রতীকী" o={fadeIO(t, 5.7, 12.0, 0.3)} color="#7fd0c4" />
        <Fact id="h2" />
        <Bangshal_Overlay />
        {t > 18.5 && t < 24.5 ? <HookMore /> : null}
        {t > 24.3 && t < 28.6 ? <Title /> : null}
        <Note text="স্কেল অনুযায়ী নয় · আনুমানিক অবস্থান" o={fadeIO(t, 29.0, 75.8, 0.4)} />
        <PlateLabels />
        <Fact id="p2" /><Fact id="p3" /><Fact id="p4" /><Fact id="p5" /><Fact id="p6" />
        <WaveTimer />
        <Fact id="s4" /><Fact id="s5" /><Fact id="s6" until={91.0} />
        {t > 90.9 && t < 109.2 ? <Studies /> : null}
        <SimTag />
        {t > L("c7").start - 0.4 ? <EndCard /> : null}
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
  if (t < 11.9 || t > 18.7) return null;
  return (
    <>
      <Place name="বংশাল, পুরান ঢাকা" sub="২১ নভেম্বর ২০২৫-এর ভূমিকম্পে এখানে তিনজন পথচারী মারা যান" a={12.2} b={18.5} />
      <Credit text="প্রতীকী ছবি: বংশাল রোড · Wasiul Bahar / Wikimedia Commons (CC BY-SA 4.0)" o={fadeIO(t, 12.1, 18.6, 0.3)} />
    </>
  );
};
