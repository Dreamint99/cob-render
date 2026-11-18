// AI University — all-courses bundle film (2026-11-16). Bright "magazine / kinetic grid" look:
// warm paper background, ink + royal blue + aiu orange, big Anek Bangla type, course-cover tiles that fly in and lock into a wall,
// one hero spread per big course (Ken Burns photo + issue number + title), scrolling tile ticker, kids phone fan,
// browser + phone (web + app), CTA end card. Spec: src/bundle/spec.json (timed by scripts/bundle_make.py).
// NO prices / money numbers anywhere (owner rule). No letter-spacing on Bangla.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender } from "remotion";

export const K = { paper: "#F4F1EA", paper2: "#EAE4D8", ink: "#011835", blue: "#0050ED", orange: "#FF5A1F", sky: "#CFE0FF", sun: "#FFD24A", white: "#FFFFFF", dim: "#4A5670" };
const BN = "Anek", EN = "Manrope";
if (typeof document !== "undefined") {
  for (const [n, u, w] of [["Anek", "fonts/AnekBangla.ttf", "100 900"], ["Manrope", "fonts/Manrope-800.ttf", "800"], ["Manrope", "fonts/Manrope-700.ttf", "700"]]) {
    const h = delayRender(`font ${n}${w}`);
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: w });
    f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
  }
}
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const sp = (f: number, fps: number, d = 0, cfg: any = { damping: 15, mass: 0.7 }) => spring({ frame: f - d, fps, config: cfg });
const cover = (id: string) => staticFile(`bundle/covers/${id}.jpg`);
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

export const TITLES: Record<string, string> = {
  "air-ticketing": "এয়ার টিকেটিং", "ielts-prep": "বাংলায় IELTS", "spoken-english": "স্পোকেন ইংলিশ", "govt-jobs": "সরকারি চাকরি প্রস্তুতি",
  "office-masterclass": "অফিস মাস্টারক্লাস", "computer-basics": "কম্পিউটার শিক্ষা", "vibe-coding": "ভাইব কোডিং", "arabic-gulf": "গালফের কথ্য আরবি",
  "japanese-work": "কাজের জাপানি", "korean-eps": "কোরিয়ান EPS-TOPIK", driving: "ড্রাইভিং — ৩ডি সিমুলেটর", "family-health": "পরিবারের স্বাস্থ্য",
  "biggan-velki": "কচু বিজ্ঞানী", "fish-feed": "মাছের খাবার", "snake-rescue": "সাপ চেনা ও উদ্ধার",
};
const ALL = Object.keys(TITLES);

export type Scene = { type: string; vo: string; vof: number; [k: string]: any };
export type Spec = { id: string; scenes: Scene[] };
const leadOf = (i: number) => (i === 0 ? 26 : 10);
const tailOf = (s: Scene) => (s.type === "cta" ? 84 : 14);
export const sceneLen = (s: Scene, i: number) => leadOf(i) + (s.vof || 120) + tailOf(s);
export const filmLen = (spec: Spec) => spec.scenes.reduce((n, s, i) => n + sceneLen(s, i), 0);

/* ---------- primitives ---------- */
const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; y?: number }> = ({ at, children, style, y = 40 }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [at, at + 14], [0, 1], { ...clamp, easing: ease });
  return <div style={{ opacity: o, transform: `translateY(${(1 - o) * y}px)`, ...style }}>{children}</div>;
};
// text revealed by a sliding mask (kinetic headline)
const Slab: React.FC<{ at: number; children: React.ReactNode; bg?: string; color?: string; size: number; style?: React.CSSProperties }> = ({ at, children, bg, color = K.ink, size, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = sp(f, fps, at, { damping: 18, mass: 0.6 });
  const bar = interpolate(f, [at, at + 9, at + 18], [0, 1, 1], { ...clamp, easing: ease });
  const barOut = interpolate(f, [at + 9, at + 20], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: "relative", display: "inline-block", overflow: "hidden", padding: bg ? "0.02em 0.32em 0.1em" : "0 0 0.06em", background: bg && barOut > 0 ? bg : "transparent", ...style }}>
      <div style={{ fontFamily: BN, fontWeight: 800, fontSize: size, lineHeight: 1.18, color, transform: `translateY(${(1 - p) * 105}%)`, whiteSpace: "nowrap" }}>{children}</div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${barOut * 100}%`, width: `${(bar - barOut) * 100}%`, background: bg === K.orange ? K.ink : K.orange }} />
    </div>
  );
};
const Chip: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, bg = K.orange, color = K.white, size = 32, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: bg, color, fontFamily: BN, fontWeight: 700, fontSize: size, padding: "6px 22px 9px", borderRadius: 999, lineHeight: 1.2, ...style }}>{children}</div>
);
const Lock: React.FC<{ open: number; size?: number }> = ({ open, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d={`M12 18 V12 a8 8 0 0 1 16 0 V${18 - open * 7}`} fill="none" stroke={K.white} strokeWidth="4" strokeLinecap="round" transform={`translate(${open * 9},${-open * 3})`} />
    <rect x="7" y="17" width="26" height="19" rx="5" fill={K.white} />
    <circle cx="20" cy="26" r="3" fill={open > 0.5 ? K.orange : K.ink} />
  </svg>
);

/* masthead: logo + running label + page segments */
const Masthead: React.FC<{ idx: number; n: number; dark?: boolean; pill?: boolean }> = ({ idx, n, dark, pill }) => (
  <>
    <div style={{ position: "absolute", left: 64, top: 40, height: 46, display: "flex", alignItems: "center", gap: 22, ...(pill ? { background: K.paper, padding: "12px 30px", borderRadius: 999, left: 44, top: 28, boxShadow: "0 8px 24px rgba(1,24,53,.18)" } : {}) }}>
      <Img src={staticFile(dark ? "bundle/logo-dark.png" : "bundle/logo.png")} style={{ height: 46 }} />
      <div style={{ width: 2, height: 30, background: dark ? "rgba(255,255,255,.4)" : "rgba(1,24,53,.25)" }} />
      <div style={{ fontFamily: BN, fontSize: 26, fontWeight: 600, color: dark ? K.white : K.ink }}>সব কোর্স · এক সাবস্ক্রিপশন</div>
    </div>
    <div style={{ position: "absolute", right: 64, top: 58, display: "flex", gap: 6 }}>
      {Array.from({ length: n }).map((_, i) => <div key={i} style={{ width: i === idx ? 44 : 16, height: 8, borderRadius: 4, background: i === idx ? K.orange : dark ? "rgba(255,255,255,.35)" : "rgba(1,24,53,.18)" }} />)}
    </div>
  </>
);

/* ---------- scenes ---------- */
type SP = { s: Scene; lead: number; len: number; idx: number; n: number };

const Wall: React.FC<SP> = ({ s, lead, idx, n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const cols = 5, rows = 3, tw = 392, th = 262, g = 18;
  const gx = (1920 - (cols * tw + (cols - 1) * g)) / 2, gy = (1080 - (rows * th + (rows - 1) * g)) / 2 + 20;
  const unlockAt = lead + s.vof * 0.42;
  const card = sp(f, fps, lead + 8, { damping: 16, mass: 0.8 });
  const zoom = interpolate(f, [0, 70, 200], [1.12, 1.0, 0.97], { ...clamp, easing: ease });
  const dimO = interpolate(f, [lead + 4, lead + 20], [0, 0.42], clamp);
  return (
    <AbsoluteFill style={{ background: K.paper }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {ALL.map((id, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          const d = 2 + ((c * 7 + r * 3) % 15) * 1.3;
          const p = sp(f, fps, d, { damping: 13, mass: 0.6 });
          const ang = rnd(i) * Math.PI * 2, dist = 900 + rnd(i + 9) * 500;
          const x = gx + c * (tw + g), y = gy + r * (th + g);
          const op = interpolate(f, [unlockAt + i * 1.5, unlockAt + i * 1.5 + 10], [0, 1], clamp);
          return (
            <div key={id} style={{ position: "absolute", left: x, top: y, width: tw, height: th, borderRadius: 18, overflow: "hidden", boxShadow: "0 16px 40px rgba(1,24,53,.18)",
              transform: `translate(${Math.cos(ang) * dist * (1 - p)}px, ${Math.sin(ang) * dist * (1 - p)}px) rotate(${(rnd(i + 3) - 0.5) * 50 * (1 - p)}deg) scale(${0.6 + 0.4 * p})` }}>
              <Img src={cover(id)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", right: 12, top: 12, width: 56, height: 56, borderRadius: 16, background: op > 0.5 ? K.orange : "rgba(1,24,53,.72)", display: "grid", placeItems: "center", transform: `scale(${1 + Math.sin(op * Math.PI) * 0.25})` }}>
                <Lock open={op} size={36} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(244,241,234,${dimO})` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * card}) rotate(${(1 - card) * -4}deg)`, opacity: card,
        background: K.blue, padding: "46px 80px 54px", borderRadius: 28, boxShadow: "0 30px 80px rgba(0,30,90,.35)", textAlign: "center", minWidth: 980 }}>
        <Img src={staticFile("bundle/logo-dark.png")} style={{ height: 70, marginBottom: 18 }} />
        <div><Slab at={lead + 14} size={104} color={K.white}>{s.head[0]}</Slab></div>
        <div style={{ marginTop: 14 }}><Slab at={unlockAt} size={104} color={K.white} bg={K.orange}>{s.head[1]}</Slab></div>
      </div>
      <Masthead idx={idx} n={n} />
    </AbsoluteFill>
  );
};

const HeroItem: React.FC<{ it: any; no: number; sub: number; subs: number; flip: boolean; len: number; vo0: number }> = ({ it, no, sub, subs, flip, len, vo0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const PW = 1160;
  const wipe = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const kb = interpolate(f, [0, len], [1.06, 1.2], clamp);
  const pan = interpolate(f, [0, len], [flip ? 30 : -30, flip ? -30 : 30], clamp);
  const numP = sp(f, fps, 4);
  const lineW = interpolate(f, [vo0 + 14, vo0 + 34], [0, 1], { ...clamp, easing: ease });
  const textX = flip ? 90 : PW + 90;
  return (
    <AbsoluteFill style={{ background: K.paper }}>
      {/* photo panel */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: flip ? 1920 - PW : 0, width: PW, overflow: "hidden", clipPath: flip ? `inset(0 0 0 ${(1 - wipe) * 100}%)` : `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
        <Img src={cover(it.id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb}) translateX(${pan}px)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(1,24,53,0) 60%, rgba(1,24,53,.35) 100%)" }} />
      </div>
      {/* colour edge between photo and page */}
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 18, left: flip ? 1920 - PW - 18 : PW, background: K.orange, transform: `scaleY(${wipe})`, transformOrigin: "top" }} />
      {/* page side */}
      <div style={{ position: "absolute", left: textX, top: 170, width: 1920 - PW - 180 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 18 }}>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 190, lineHeight: 0.9, color: K.blue, transform: `translateY(${(1 - numP) * 60}px)`, opacity: numP }}>{bn(String(no).padStart(2, "0"))}</div>
          {subs > 1 && <Rise at={8} style={{ marginBottom: 18 }}><Chip bg={K.ink} size={26}>{bn(sub + 1)}/{bn(subs)}</Chip></Rise>}
        </div>
        <Rise at={10}><Chip>{it.tag}</Chip></Rise>
        <Rise at={16} y={60} style={{ marginTop: 26 }}>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: it.title.length > 18 ? 78 : 94, lineHeight: 1.16, color: K.ink }}>{it.title}</div>
        </Rise>
        <div style={{ height: 10, width: 220 * lineW, background: K.blue, borderRadius: 5, margin: "28px 0 26px" }} />
        <Rise at={vo0 + 18}><div style={{ fontFamily: BN, fontWeight: 500, fontSize: 42, lineHeight: 1.35, color: K.dim }}>{it.line}</div></Rise>
      </div>
      {/* photo caption tile */}
      <Rise at={20} style={{ position: "absolute", bottom: 56, left: flip ? 1920 - PW + 56 : 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,.94)", borderRadius: 16, padding: "12px 24px 14px" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: K.orange }} />
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 30, color: K.ink }}>সাবস্ক্রিপশনে খোলা</div>
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

const Hero: React.FC<SP> = ({ s, lead, len, idx, n }) => {
  const items = s.items as any[]; const k = items.length; const seg = len / k;
  return (
    <AbsoluteFill>
      {items.map((it, i) => (
        <Sequence key={it.id} from={Math.round(i * seg)} durationInFrames={Math.round(seg) + (i === k - 1 ? 0 : 1)}>
          <HeroItem it={it} no={s.no} sub={i} subs={k} flip={(s.no + i) % 2 === 0} len={Math.round(seg)} vo0={i === 0 ? lead : 0} />
        </Sequence>
      ))}
      <Masthead idx={idx} n={n} pill />
    </AbsoluteFill>
  );
};

const Tile: React.FC<{ id: string; w: number }> = ({ id, w }) => (
  <div style={{ width: w, flex: "none", borderRadius: 18, overflow: "hidden", background: K.white, boxShadow: "0 12px 30px rgba(1,24,53,.14)" }}>
    <Img src={cover(id)} style={{ width: w, height: w * 0.56, objectFit: "cover", display: "block" }} />
    <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 28, color: K.ink, padding: "10px 20px 14px", whiteSpace: "nowrap", overflow: "hidden" }}>{TITLES[id]}</div>
  </div>
);
const Ticker: React.FC<SP> = ({ s, lead, idx, n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const rest = ["computer-basics", "vibe-coding", "driving", "family-health", "biggan-velki", "fish-feed", "snake-rescue"];
  const rowsIds = [
    [...rest, ...rest],
    ["fish-feed", "air-ticketing", "snake-rescue", "ielts-prep", "computer-basics", "office-masterclass", "family-health", "korean-eps", "vibe-coding", "govt-jobs", "driving", "biggan-velki", "arabic-gulf", "spoken-english"],
    [...rest.slice(3), ...rest.slice(0, 3), ...rest.slice(3), ...rest.slice(0, 3)],
  ];
  const w = 430, gap = 26;
  const card = sp(f, fps, lead + 6, { damping: 14, mass: 0.7 });
  return (
    <AbsoluteFill style={{ background: K.sky }}>
      <AbsoluteFill style={{ transform: "rotate(-7deg) scale(1.18)", top: -40 }}>
        {rowsIds.map((ids, r) => {
          const dir = r % 2 ? 1 : -1; const speed = 4.2 + r * 0.6;
          const x = (r % 2 ? -1800 : 0) + dir * f * speed;
          return (
            <div key={r} style={{ position: "absolute", top: 60 + r * 345, left: 0, display: "flex", gap, transform: `translateX(${x}px)` }}>
              {ids.map((id, i) => <Tile key={i} id={id} w={w} />)}
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) scale(${card}) rotate(${(1 - card) * 8 - 3}deg)`, background: K.orange, borderRadius: 26, padding: "34px 70px 44px", boxShadow: "0 30px 70px rgba(120,40,0,.35)", textAlign: "center" }}>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 64, color: K.ink, lineHeight: 1.15 }}>{s.head[0]}</div>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 112, color: K.white, lineHeight: 1.15 }}>{s.head[1]}</div>
      </div>
      <Masthead idx={idx} n={n} pill />
    </AbsoluteFill>
  );
};

const Phone: React.FC<{ src: string; w: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ src, w, style, children }) => {
  const h = w * 2.08; const b = w * 0.045;
  return (
    <div style={{ width: w, height: h, borderRadius: w * 0.13, background: "#0B1222", padding: b, boxShadow: "0 30px 70px rgba(1,24,53,.32)", ...style }}>
      <div style={{ width: "100%", height: "100%", borderRadius: w * 0.1, overflow: "hidden", position: "relative", background: "#fff" }}>
        {children || <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />}
        <div style={{ position: "absolute", top: b * 0.9, left: "50%", width: w * 0.26, height: w * 0.065, marginLeft: -w * 0.13, borderRadius: 999, background: "#0B1222" }} />
      </div>
    </div>
  );
};

const Kids: React.FC<SP> = ({ s, lead, idx, n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const shots = ["kids-tap-v1", "kids-bhasha-v1", "kids-paint-v1", "kids-trace-v1", "kids-stickers-v1"];
  const sun = interpolate(f, [0, 300], [0, 40], clamp);
  return (
    <AbsoluteFill style={{ background: "#FFE9A8" }}>
      <div style={{ position: "absolute", left: 1180, top: 140, width: 760, height: 760, borderRadius: "50%", background: K.sun, transform: `rotate(${sun}deg)` }} />
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 1560 - 6, top: 520 - 560, width: 12, height: 160, borderRadius: 6, background: K.sun, transformOrigin: "6px 560px", transform: `rotate(${i * (360 / 14) + sun}deg)`, opacity: 0.55 }} />
      ))}
      <div style={{ position: "absolute", left: 110, top: 250, width: 820 }}>
        <div><Slab at={lead} size={120} color={K.ink}>{s.head[0]}</Slab></div>
        <div style={{ marginTop: 10 }}><Slab at={lead + 10} size={120} color={K.white} bg={K.blue}>{s.head[1]}</Slab></div>
        <Rise at={lead + 34} style={{ marginTop: 40 }}><div style={{ fontFamily: BN, fontWeight: 600, fontSize: 52, color: K.ink }}>খেলতে খেলতে শেখা</div></Rise>
        <Rise at={lead + 46} style={{ marginTop: 30, display: "flex", gap: 16 }}>
          {["অক্ষর", "শব্দ", "অঙ্ক", "রং করা"].map((x) => <Chip key={x} bg={K.white} color={K.ink} size={32}>{x}</Chip>)}
        </Rise>
      </div>
      {shots.map((sh, i) => {
        const p = sp(f, fps, 6 + i * 5, { damping: 12, mass: 0.7 });
        const ang = (i - 2) * 9, x = 1010 + i * 165, y = 230 + Math.abs(i - 2) * 40;
        return <div key={sh} style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - p) * 700}px) rotate(${ang * p}deg)`, zIndex: i === 2 ? 5 : 5 - Math.abs(i - 2) }}>
          <Phone src={staticFile(`bundle/shots/${sh}.jpg`)} w={290} />
        </div>;
      })}
      <Masthead idx={idx} n={n} />
    </AbsoluteFill>
  );
};

const Devices: React.FC<SP> = ({ s, lead, len, idx, n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const bp = sp(f, fps, 2, { damping: 16, mass: 0.8 }); const pp = sp(f, fps, 10, { damping: 16, mass: 0.8 });
  const scroll = interpolate(f, [30, len - 20], [0, 330], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const screens = ["learn", "quiz", "pocket", "kids"]; const per = Math.max(40, (len - 20) / screens.length);
  const si = Math.min(screens.length - 1, Math.floor(f / per)); const sf = f - si * per;
  const slide = interpolate(sf, [0, 12], [1, 0], { ...clamp, easing: ease });
  const grid = ["air-ticketing", "ielts-prep", "spoken-english", "govt-jobs", "office-masterclass", "arabic-gulf", "japanese-work", "korean-eps", "computer-basics", "driving", "vibe-coding", "family-health"];
  const BW = 1140, BH = 690;
  return (
    <AbsoluteFill style={{ background: K.paper }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(1,24,53,.12) 2px, transparent 2px)", backgroundSize: "34px 34px" }} />
      {/* browser */}
      <div style={{ position: "absolute", left: 90, top: 210, width: BW, height: BH, borderRadius: 22, background: K.white, overflow: "hidden", boxShadow: "0 30px 80px rgba(1,24,53,.22)", transform: `translateX(${(1 - bp) * -300}px)`, opacity: bp }}>
        <div style={{ height: 58, background: "#E8ECF3", display: "flex", alignItems: "center", padding: "0 22px", gap: 10 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
          <div style={{ marginLeft: 22, flex: 1, height: 36, borderRadius: 18, background: K.white, display: "flex", alignItems: "center", padding: "0 20px", fontFamily: EN, fontWeight: 700, fontSize: 20, color: "#55607A" }}>aiuniversitybd.com</div>
        </div>
        <div style={{ position: "relative", height: BH - 58, overflow: "hidden", background: "#F7F8FB" }}>
          <div style={{ transform: `translateY(${-scroll}px)` }}>
            <div style={{ height: 76, background: K.ink, display: "flex", alignItems: "center", padding: "0 34px", gap: 30 }}>
              <Img src={staticFile("bundle/logo-dark.png")} style={{ height: 34 }} />
              {["কোর্সসমূহ", "পকেট কোর্স", "কিডস", "ব্লগ"].map((x) => <div key={x} style={{ fontFamily: BN, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.85)" }}>{x}</div>)}
            </div>
            <div style={{ padding: "30px 34px 10px", fontFamily: BN, fontWeight: 800, fontSize: 42, color: K.ink }}>সব কোর্স</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, padding: "8px 34px" }}>
              {grid.map((id, i) => {
                const p = sp(f, fps, 8 + i * 3, { damping: 14, mass: 0.6 });
                return <div key={id} style={{ borderRadius: 14, overflow: "hidden", background: K.white, boxShadow: "0 6px 18px rgba(1,24,53,.1)", transform: `scale(${0.8 + 0.2 * p})`, opacity: p }}>
                  <Img src={cover(id)} style={{ width: "100%", height: 186, objectFit: "cover", display: "block" }} />
                  <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 24, color: K.ink, padding: "10px 16px 6px", whiteSpace: "nowrap", overflow: "hidden" }}>{TITLES[id]}</div>
                  <div style={{ margin: "0 16px 14px", height: 8, borderRadius: 4, background: "#E6EAF2" }}><div style={{ width: `${30 + rnd(i) * 60}%`, height: 8, borderRadius: 4, background: K.blue }} /></div>
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>
      {/* phone */}
      <div style={{ position: "absolute", left: 1370, top: 150, transform: `translateY(${(1 - pp) * 500}px) rotate(${(1 - pp) * 10 + 3}deg)` }}>
        <Phone src="" w={410}>
          <div style={{ position: "absolute", inset: 0 }}>
            {si > 0 && <Img src={staticFile(`bundle/app/${screens[si - 1]}.png`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `translateX(${-(1 - slide) * 100}%)` }} />}
            <Img src={staticFile(`bundle/app/${screens[si]}.png`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `translateX(${si > 0 ? slide * 100 : 0}%)` }} />
          </div>
        </Phone>
      </div>
      <Rise at={lead + 4} style={{ position: "absolute", left: 120, top: 150 }}><Chip bg={K.blue} size={38}>ওয়েবসাইটে</Chip></Rise>
      <Rise at={lead + s.vof * 0.22} style={{ position: "absolute", left: 1400, top: 96 }}><Chip bg={K.orange} size={38}>অ্যান্ড্রয়েড অ্যাপে</Chip></Rise>
      <Rise at={lead + s.vof * 0.1} style={{ position: "absolute", left: 1130, top: 920 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: K.ink, color: K.white, borderRadius: 999, padding: "10px 30px 14px", fontFamily: BN, fontWeight: 700, fontSize: 34 }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={K.sun} strokeWidth="2.6" strokeLinecap="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
          একই অ্যাকাউন্ট
        </div>
      </Rise>
      <Masthead idx={idx} n={n} />
    </AbsoluteFill>
  );
};

const Cta: React.FC<SP> = ({ s, lead, idx, n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lp = sp(f, fps, 4, { damping: 13, mass: 0.8 });
  const url = sp(f, fps, lead + s.vof * 0.7, { damping: 11, mass: 0.7 });
  const row = (y: number, dir: number, off: number) => (
    <div style={{ position: "absolute", top: y, left: 0, display: "flex", gap: 20, transform: `translateX(${off + dir * f * 2.6}px)`, opacity: 0.95 }}>
      {[...ALL, ...ALL].map((id, i) => <Img key={i} src={cover(id)} style={{ width: 300, height: 170, objectFit: "cover", borderRadius: 16, flex: "none" }} />)}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: K.blue }}>
      {row(-60, -1, 0)}
      {row(970, 1, -2600)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <Img src={staticFile("bundle/logo-dark.png")} style={{ height: 150, transform: `scale(${0.6 + 0.4 * lp})`, opacity: lp }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center" }}>
        <Slab at={lead} size={128} color={K.white}>{s.head[0]}</Slab>
      </div>
      <Rise at={lead + 22} style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 18 }}>
        {["সব কোর্স", "ওয়েব + অ্যাপ", "তিন মাস", "বাচ্চাদের কোর্সও"].map((x) => <Chip key={x} bg="rgba(255,255,255,.16)" size={36} style={{ border: "2px solid rgba(255,255,255,.5)" }}>{x}</Chip>)}
      </Rise>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center" }}>
        <div style={{ background: K.orange, borderRadius: 999, padding: "18px 64px 24px", fontFamily: EN, fontWeight: 800, fontSize: 70, color: K.white, transform: `scale(${url})`, boxShadow: "0 20px 50px rgba(0,0,0,.25)" }}>aiuniversitybd.com</div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC<SP>> = { wall: Wall, hero: Hero, ticker: Ticker, kids: Kids, devices: Devices, cta: Cta };

/* wipe between scenes: an orange bar then an ink bar sweep across the cut */
const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [at - 9, at, at + 9], [1920, 0, -1920], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const b = interpolate(f, [at - 6, at + 1, at + 11], [1920, 0, -1920], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  if (f < at - 10 || f > at + 12) return null;
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 0, bottom: 0, left: a, width: 1920, background: K.orange }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, left: b, width: 1920, background: K.ink }} />
  </AbsoluteFill>;
};

export const BundleFilm: React.FC<{ spec: Spec }> = ({ spec }) => {
  const total = filmLen(spec);
  let t = 0;
  const starts = spec.scenes.map((s, i) => { const a = t; t += sceneLen(s, i); return a; });
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: K.paper }}>
      {spec.scenes.map((s, i) => {
        const C = SCENES[s.type]; const len = sceneLen(s, i);
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={len}>
            <C s={s} lead={leadOf(i)} len={len} idx={i} n={spec.scenes.length} />
            <Sequence from={leadOf(i)}><Audio src={staticFile(`bundle/vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
          </Sequence>
        );
      })}
      {starts.slice(1).map((a, i) => <React.Fragment key={i}><Wipe at={a} /><Sequence from={a - 10} durationInFrames={40}><Audio src={staticFile("bundle/sfx/whoosh.mp3")} volume={0.22} /></Sequence></React.Fragment>)}
      <Sequence from={6} durationInFrames={60}><Audio src={staticFile("bundle/sfx/swell.mp3")} volume={0.25} /></Sequence>
      <Sequence from={starts[spec.scenes.length - 1] + 30} durationInFrames={90}><Audio src={staticFile("bundle/sfx/chime.mp3")} volume={0.3} /></Sequence>
      <Audio src={staticFile("bundle/music.mp3")} volume={(fr) => interpolate(fr, [0, 20, total - 60, total - 5], [0, 0.11, 0.11, 0], clamp)} />
    </AbsoluteFill>
  );
};
