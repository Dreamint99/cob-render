// "বাংলায় IELTS" mega promo — dark cinematic brand film built from the real course: screen recordings of the site
// (public/ielts-promo/rec/*.mp4, recorded with puppeteer), module images, a lesson-video excerpt. Spec: src/ielts/promo.json
// (timed by scripts/ielts_make.py --promo). Scene types: hook · reveal · screen · lessonvid · why · modules · honest · cta
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender } from "remotion";
import { Headphones, PenLine, Mic, BookOpen, Bot, Languages, Smartphone, Gift, ShieldCheck, Sparkles, CalendarCheck, CircleCheck, Wallet, Clock, HelpCircle, Share2, Award, Target } from "lucide-react";

const C = { navy: "#011835", navy2: "#0D2A5E", ink: "#F1F5FF", mute: "#9FB0D6", brand: "#0050ED", brand2: "#38BDF8", gold: "#F5C451", green: "#3DDC97", red: "#FF6B6B", line: "rgba(255,255,255,.12)" };
const BN = "Anek", EN = "Montserrat";
if (typeof document !== "undefined") {
  for (const [n, u] of [["Anek", "fonts/AnekBangla.ttf"], ["Montserrat", "fonts/Montserrat.ttf"]]) {
    const h = delayRender(`font ${n}`);
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
  }
}
const ICONS: Record<string, React.FC<any>> = { headphones: Headphones, "pen-line": PenLine, mic: Mic, "book-open": BookOpen, bot: Bot, languages: Languages, smartphone: Smartphone, gift: Gift, shield: ShieldCheck, sparkles: Sparkles, calendar: CalendarCheck, wallet: Wallet, clock: Clock, help: HelpCircle, share: Share2, award: Award, target: Target };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const ent = (f: number, fps: number, d: number, dur = 26) => spring({ frame: f - d, fps, config: { damping: 200 }, durationInFrames: dur });
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 13, mass: 0.7 } });

export type PScene = { type: string; vo: string; frames: number; clip?: string; clipFrames?: number; [k: string]: any };
export type PSpec = { id: string; scenes: PScene[] };
const LEAD = 10, TAIL = 14, GAP = 10;
const clipLen = (s: PScene) => (s.clipFrames ? s.clipFrames + GAP : 0);
const sceneLen = (s: PScene) => LEAD + clipLen(s) + (s.frames || 60) + TAIL;
export const promoLen = (spec: PSpec) => spec.scenes.reduce((n, s) => n + sceneLen(s), 0) + 20;
type P = { s: PScene; len: number };
const v = (p: P, x: number) => LEAD + clipLen(p.s) + p.s.frames * x;

const Rise: React.FC<{ d: number; children: React.ReactNode; style?: React.CSSProperties; y?: number }> = ({ d, children, style, y = 46 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = ent(f, fps, d);
  return <div style={{ opacity: s, transform: `translateY(${(1 - s) * y}px)`, ...style }}>{children}</div>;
};
const Big: React.FC<{ d: number; size: number; children: React.ReactNode; color?: string; align?: "left" | "center" }> = ({ d, size, children, color = C.ink, align = "left" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = ent(f, fps, d, 30);
  return <div style={{ overflow: "hidden", paddingTop: size * 0.18, paddingBottom: size * 0.24, marginTop: -size * 0.18, marginBottom: -size * 0.24, textAlign: align }}><div style={{ fontFamily: BN, fontSize: size, fontWeight: 800, color, lineHeight: 1.2, transform: `translateY(${(1 - s) * 110}%)` }}>{children}</div></div>;
};
const Grad: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ background: `linear-gradient(90deg, ${C.brand2}, #7DD3FC, ${C.gold})`, WebkitBackgroundClip: "text", color: "transparent" }}>{children}</span>;
const Chip: React.FC<{ icon: string; t: string; d: number; color?: string }> = ({ icon, t, d, color = C.brand2 }) => {
  const I = ICONS[icon] || Sparkles;
  return <Rise d={d} y={24}><div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 999, background: "rgba(255,255,255,.08)", border: `1px solid ${C.line}`, fontFamily: BN, fontSize: 32, fontWeight: 700, color: C.ink }}><I size={32} color={color} />{t}</div></Rise>;
};

/* ---------- browser frame with a screen recording ---------- */
const Browser: React.FC<{ src: string; url: string; from: number; rate: number; zoom?: [number, number, number]; w: number }> = ({ src, url, from, rate, zoom, w }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const h = Math.round((w * 810) / 1440);
  const z = zoom ? interpolate(f, [0, durationInFrames], [1, zoom[0]], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 1;
  return (
    <div style={{ width: w, borderRadius: 18, overflow: "hidden", background: "#0B1430", boxShadow: "0 50px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08)" }}>
      <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: "#111C3A" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
        <div style={{ marginLeft: 18, flex: 1, height: 30, borderRadius: 8, background: "rgba(255,255,255,.07)", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: EN, fontSize: 16, color: C.mute }}>🔒 {url}</div>
      </div>
      <div style={{ width: w, height: h, overflow: "hidden", position: "relative", background: "#fff" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", transform: `scale(${z})`, transformOrigin: zoom ? `${zoom[1] * 100}% ${zoom[2] * 100}%` : "50% 50%" }} />
      </div>
    </div>
  );
};

/* ---------- scenes ---------- */
const SHook: React.FC<P> = (p) => {
  const { s } = p; const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1.12 - f * 0.0004})` }}><Img src={staticFile("ielts-promo/img/m0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} /></AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.navy} 30%, rgba(1,24,53,.55) 70%, rgba(1,24,53,.3))` }} />
      <div style={{ position: "absolute", left: 140, top: 230, width: 1300 }}>
        <Big d={6} size={96}>{s.l1}</Big>
        <div style={{ marginTop: 18 }}><Big d={v(p, 0.25)} size={96}><Grad>{s.l2}</Grad></Big></div>
        <div style={{ display: "flex", gap: 18, marginTop: 60, flexWrap: "wrap" }}>
          {s.pains.map((x: any, i: number) => <Chip key={i} icon={x.icon} t={x.t} d={v(p, 0.45 + i * 0.13)} color={C.red} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SReveal: React.FC<P> = (p) => {
  const { s } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig(); const k = ent(f, fps, 4, 40);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 1000, opacity: k, transform: `scale(${1.08 - 0.08 * k})` }}>
        <Img src={staticFile("ielts-promo/img/cover.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.navy}, rgba(1,24,53,.2) 45%, transparent)` }} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 200, width: 1000 }}>
        <Rise d={4}><Img src={staticFile("brand/logo-dark.png")} style={{ height: 70 }} /></Rise>
        <div style={{ marginTop: 40 }}><Big d={12} size={110}>বাংলায় <Grad>IELTS</Grad></Big></div>
        <div style={{ marginTop: 6 }}><Big d={22} size={64} color={C.mute}>IELTS শিখুন ফ্রি</Big></div>
        <div style={{ display: "flex", gap: 16, marginTop: 50, flexWrap: "wrap", width: 860 }}>
          {s.badges.map((b: any, i: number) => <Chip key={i} icon={b.icon} t={b.t} d={v(p, 0.3 + i * 0.12)} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SScreen: React.FC<P> = (p) => {
  const { s } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const I = ICONS[s.icon] || Sparkles; const k = ent(f, fps, 2, 34);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 150, width: 560 }}>
        <Rise d={4}><div style={{ width: 92, height: 92, borderRadius: 26, background: `linear-gradient(135deg, ${C.brand}, ${C.brand2})`, display: "grid", placeItems: "center", boxShadow: `0 20px 50px ${C.brand}66` }}><I size={50} color="#fff" /></div></Rise>
        <div style={{ marginTop: 34 }}><Big d={10} size={62}>{s.head}</Big></div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
          {s.pts.map((t: string, i: number) => (
            <Rise key={i} d={v(p, 0.12 + i * 0.2)} y={20} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <CircleCheck size={34} color={C.green} style={{ flex: "none", marginTop: 4 }} /><span style={{ fontFamily: BN, fontSize: 33, color: C.ink, lineHeight: 1.4 }}>{t}</span>
            </Rise>
          ))}
        </div>
        {s.note && <Rise d={v(p, 0.7)} style={{ marginTop: 26, fontFamily: BN, fontSize: 25, color: C.mute }}>{s.note}</Rise>}
      </div>
      <div style={{ position: "absolute", left: 720, top: 160, opacity: k, transform: `translateX(${(1 - k) * 120}px) perspective(2000px) rotateY(${(1 - k) * -12}deg)` }}>
        <Browser src={s.rec} url={s.url} from={s.from || 0} rate={s.rate || 1} zoom={s.zoom} w={1100} />
      </div>
    </AbsoluteFill>
  );
};

const SLessonVid: React.FC<P> = (p) => {
  const { s } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig(); const k = ent(f, fps, 2, 34);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}><Big d={4} size={62} align="center">{s.head}</Big></div>
      <div style={{ position: "absolute", left: 360, top: 250, width: 1200, opacity: k, transform: `scale(${0.92 + 0.08 * k})`, borderRadius: 24, overflow: "hidden", boxShadow: "0 50px 120px rgba(0,0,0,.55)", border: `2px solid ${C.line}` }}>
        <OffthreadVideo src={staticFile(s.src)} startFrom={Math.round((s.from || 0) * 30)} muted style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", gap: 18 }}>
        {s.chips.map((c: any, i: number) => <Chip key={i} icon={c.icon} t={c.t} d={v(p, 0.2 + i * 0.15)} />)}
      </div>
    </AbsoluteFill>
  );
};

const SWhy: React.FC<P> = (p) => {
  const { s } = p; const n = s.items.length;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 120 }}><Big d={4} size={70}>{s.head[0]}<Grad>{s.head[1]}</Grad></Big></div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 290, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
        {s.items.map((it: any, i: number) => {
          const I = ICONS[it.icon] || Sparkles;
          return (
            <Rise key={i} d={v(p, 0.04 + (i / n) * 0.82)} y={36}>
              <div style={{ height: 300, padding: "32px 30px", borderRadius: 26, background: "linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.03))", border: `1px solid ${C.line}` }}>
                <div style={{ width: 76, height: 76, borderRadius: 22, background: `linear-gradient(135deg, ${C.brand}, ${C.brand2})`, display: "grid", placeItems: "center" }}><I size={42} color="#fff" /></div>
                <div style={{ fontFamily: BN, fontSize: 38, fontWeight: 800, color: C.ink, marginTop: 22, lineHeight: 1.25 }}>{it.t}</div>
                <div style={{ fontFamily: BN, fontSize: 27, color: C.mute, marginTop: 10, lineHeight: 1.4 }}>{it.s}</div>
              </div>
            </Rise>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SModules: React.FC<P> = (p) => {
  const { s } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 110 }}><Big d={4} size={66}>{s.head[0]}<Grad>{s.head[1]}</Grad></Big></div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 250, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
        {s.items.map((t: string, i: number) => {
          const d = v(p, 0.05 + i * 0.085); const k = pop(f, fps, d);
          return (
            <div key={i} style={{ position: "relative", height: 200, borderRadius: 22, overflow: "hidden", opacity: Math.min(1, k * 1.3), transform: `scale(${0.85 + 0.15 * k})`, border: `1px solid ${C.line}` }}>
              <Img src={staticFile(`ielts-promo/img/m${i}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(1,24,53,.92), rgba(1,24,53,.1) 70%)" }} />
              <div style={{ position: "absolute", left: 22, bottom: 18, right: 22, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: C.brand, display: "grid", placeItems: "center", fontFamily: BN, fontSize: 26, fontWeight: 800, color: "#fff", flex: "none" }}>{"০১২৩৪৫৬৭৮৯"[i + 1] || "১০"}</div>
                <span style={{ fontFamily: BN, fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{t}</span>
              </div>
            </div>
          );
        })}
      </div>
      {s.note && <Rise d={v(p, 0.85)} style={{ position: "absolute", left: 0, right: 0, top: 912, textAlign: "center", fontFamily: BN, fontSize: 27, color: C.mute }}>{s.note}</Rise>}
    </AbsoluteFill>
  );
};

const SHonest: React.FC<P> = (p) => {
  const { s } = p;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Rise d={4}><ShieldCheck size={110} color={C.gold} strokeWidth={1.6} /></Rise>
      <div style={{ marginTop: 30, width: 1500 }}><Big d={10} size={66} align="center">{s.head}</Big></div>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        {s.pts.map((t: string, i: number) => <Rise key={i} d={v(p, 0.25 + i * 0.2)} y={20}><span style={{ fontFamily: BN, fontSize: 32, color: C.mute }}>{t}</span></Rise>)}
      </div>
    </AbsoluteFill>
  );
};

const SCta: React.FC<P> = (p) => {
  const { s } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig(); const k = pop(f, fps, 6);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <AbsoluteFill style={{ opacity: 0.22 }}><Img src={staticFile("ielts-promo/img/cover.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(900px 600px at 50% 45%, rgba(0,80,237,.35), ${C.navy} 75%)` }} />
      <div style={{ position: "absolute", top: 150 }}><Rise d={2}><Img src={staticFile("brand/logo-dark.png")} style={{ height: 84 }} /></Rise></div>
      <div style={{ position: "absolute", top: 300, width: 1600 }}><Big d={8} size={100} align="center">{s.l1} <Grad>{s.l2}</Grad></Big></div>
      <div style={{ position: "absolute", top: 520, transform: `scale(${k})`, display: "flex", alignItems: "center", gap: 18, padding: "26px 52px", borderRadius: 999, background: `linear-gradient(90deg, ${C.brand}, ${C.brand2})`, boxShadow: `0 24px 70px ${C.brand}88`, fontFamily: BN, fontSize: 46, fontWeight: 800, color: "#fff" }}><Sparkles size={44} /> {s.button}</div>
      <Rise d={v(p, 0.3)} style={{ position: "absolute", top: 690 }}><div style={{ fontFamily: EN, fontSize: 40, fontWeight: 700, color: C.ink, padding: "14px 30px", borderRadius: 16, background: "rgba(255,255,255,.08)", border: `1px solid ${C.line}` }}>{s.url}</div></Rise>
      <Rise d={v(p, 0.5)} style={{ position: "absolute", top: 820, display: "flex", alignItems: "center", gap: 14, fontFamily: BN, fontSize: 34, color: C.gold, fontWeight: 700 }}><Share2 size={34} /> {s.share}</Rise>
      <Rise d={v(p, 0.65)} style={{ position: "absolute", top: 905, fontFamily: BN, fontSize: 22, color: C.mute, textAlign: "center", width: 1600 }}>{s.fine}</Rise>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<any>> = { hook: SHook, reveal: SReveal, screen: SScreen, lessonvid: SLessonVid, why: SWhy, modules: SModules, honest: SHonest, cta: SCta };

const subChunks = (spec: PSpec, starts: number[]) => spec.scenes.flatMap((s, i) => {
  const parts = s.vo.split(/(?<=[।?!,—])\s+/).reduce<string[]>((a, x) => { if (a.length && (a[a.length - 1].length < 24 || x.length < 10)) a[a.length - 1] += " " + x; else a.push(x); return a; }, []);
  const total = parts.reduce((n, x) => n + x.length, 0); let acc = 0; const b = starts[i] + LEAD + clipLen(s);
  return parts.map((x) => { const from = b + (s.frames * acc) / total; acc += x.length; return { s: x, from, to: b + (s.frames * acc) / total }; });
});

export const IeltsPromo: React.FC<{ spec: PSpec }> = ({ spec }) => {
  const f = useCurrentFrame();
  const lens = spec.scenes.map(sceneLen);
  const starts = lens.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + lens[i - 1] : 10], []);
  const total = promoLen(spec);
  const chunks = subChunks(spec, starts);
  const cur = chunks.find((x) => f >= x.from && f < x.to + 4);
  const busy = (fr: number) => spec.scenes.some((s, i) => fr >= starts[i] + LEAD - 6 && fr <= starts[i] + LEAD + clipLen(s) + s.frames + 4);
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <AbsoluteFill style={{ background: `radial-gradient(1200px 700px at 80% -10%, ${C.brand}40, transparent 70%), radial-gradient(900px 600px at -10% 110%, ${C.brand2}26, transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`, backgroundSize: "80px 80px", opacity: 0.25, maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)" }} />
      {spec.scenes.map((s, i) => {
        const S = MAP[s.type]; const len = lens[i];
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={len}>
            <Fade len={len}><S s={s} len={len} /></Fade>
            {s.clip && <Sequence from={LEAD}><Audio src={staticFile(`ielts-promo/${s.clip}`)} /></Sequence>}
            <Sequence from={LEAD + clipLen(s)}><Audio src={staticFile(`ielts-promo/vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
            <Sequence from={0}><Audio src={staticFile(`aiu2/${i === 0 ? "swell" : s.type === "cta" ? "chime" : "whoosh"}.mp3`)} volume={0.35} /></Sequence>
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", right: 36, top: 30, display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 30, background: "rgba(255,255,255,.08)", border: `1px solid ${C.line}`, fontFamily: BN, fontSize: 20, color: C.mute }}><Bot size={20} color={C.brand2} /> এআই কণ্ঠ</div>
      {cur && <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", justifyContent: "center", opacity: interpolate(f, [cur.from, cur.from + 5, cur.to, cur.to + 4], [0, 1, 1, 0], clamp) }}><div style={{ maxWidth: 1500, padding: "10px 28px 14px", borderRadius: 14, background: "rgba(0,0,0,.6)", fontFamily: BN, fontSize: 36, fontWeight: 500, color: "#fff", textAlign: "center", lineHeight: 1.35 }}>{cur.s.replace(/[।,]$/, "")}</div></div>}
      <Audio src={staticFile("aiu2/music.mp3")} volume={(fr) => (busy(fr) ? 0.07 : 0.2) * interpolate(fr, [0, 30, total - 60, total], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease }), interpolate(f, [len - 10, len], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
