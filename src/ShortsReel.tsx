// 9:16 YouTube Shorts for the Dream International channel — kinetic cards + word-highlight captions.
// Data/VO: work/shorts/shorts.json → work/shorts/tts.py → src/shorts-data.json + public/shorts/<id>/<n>.mp3
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import DATA from "./shorts-data.json";

type Beat = { vo: string; emoji: string; head: string; sub: string; cta?: boolean; dur: number; bg?: string };
type Short = { id: string; accent: string; hook: string; hookEmoji: string; title: string; beats: Beat[] };
const SH = DATA as Short[];
const FPS = 30, GAP = 5, LEAD = 6;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FONT = "Hind, 'Hind Siliguri', sans-serif";
const SEMI = "HindSemi, Hind, sans-serif";
const GOLD = "#FFD43B";

if (typeof document !== "undefined") {
  for (const [name, file] of [["Hind", "HindSiliguri-Bold.ttf"], ["HindSemi", "HindSiliguri-SemiBold.ttf"]]) {
    const f = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}

const plan = (s: Short) => { let at = LEAD; return s.beats.map((b) => { const len = Math.round(b.dur * FPS) + GAP; const r = { ...b, from: at, len }; at += len; return r; }); };
export const shortTotal = (id: string) => { const p = plan(SH.find((s) => s.id === id)!); const l = p[p.length - 1]; return l.from + l.len + 24; };
export const SHORT_IDS = SH.map((s) => s.id);

const Bg: React.FC<{ accent: string }> = ({ accent }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${30 + Math.sin(f / 50) * 6}%, ${accent}66 0%, transparent 55%), radial-gradient(circle at 50% 110%, #0E7C5A55 0%, transparent 50%), #0A0C0B` }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 2px, transparent 2px)", backgroundSize: "36px 36px", backgroundPosition: `0 ${f * 0.6}px` }} />
      {new Array(18).fill(0).map((_, i) => {
        const x = random(`x${i}`) * 1080, sp = 0.5 + random(`s${i}`);
        const y = 1920 - ((random(`y${i}`) * 2100 + f * sp * 3) % 2100);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.25 }} />;
      })}
    </AbsoluteFill>
  );
};

const Card: React.FC<{ b: Beat; i: number; n: number; accent: string; len: number }> = ({ b, i, n, accent, len }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 11, stiffness: 170 } });
  const emo = spring({ frame: f - 4, fps, config: { damping: 7, stiffness: 200 } });
  const out = interpolate(f, [len - 6, len], [0, 1], clamp);
  const danger = /❌|⛔|⚠️/.test(b.emoji);
  const shake = danger && f < 12 ? (random(`sh${f}`) - 0.5) * 24 * (1 - f / 12) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260, transform: `translateX(${out * -700 + shake}px) rotate(${out * -6}deg)`, opacity: 1 - out }}>
      <div style={{ fontSize: 230, transform: `scale(${emo}) rotate(${(1 - emo) * -30 + Math.sin(f / 10) * 3}deg)`, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}>{b.emoji}</div>
      <div style={{ marginTop: 30, width: 960, padding: "40px 46px", borderRadius: 44, background: b.cta ? `linear-gradient(150deg, ${accent}, #111)` : "rgba(255,255,255,0.96)", boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 0 0 6px ${accent}`,
        transform: `scale(${0.7 + 0.3 * p}) translateY(${(1 - p) * 160}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontSize: b.head.length > 22 ? 70 : 84, lineHeight: 1.18, color: b.cta ? "#fff" : "#0A0C0B" }}>{b.head}</div>
        <div style={{ fontFamily: SEMI, fontSize: 46, lineHeight: 1.3, marginTop: 16, color: b.cta ? "#ffffffdd" : danger ? "#DC2626" : "#3F4A45" }}>{b.sub}</div>
      </div>
      {b.cta && <Subscribe />}
      {!b.cta && i > 0 && <div style={{ position: "absolute", top: 520, right: 70, fontFamily: FONT, fontSize: 44, color: "#ffffff66" }}>{i}/{n - 2}</div>}
    </AbsoluteFill>
  );
};

const Subscribe: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - 12, fps, config: { damping: 10 } });
  const clicked = f > 40;
  return (
    <div style={{ marginTop: 50, display: "flex", gap: 24, transform: `scale(${p})` }}>
      <div style={{ padding: "26px 56px", borderRadius: 999, background: clicked ? "#3F3F46" : "#FF0000", color: "#fff", fontFamily: FONT, fontSize: 54, transform: `scale(${f > 34 && f < 42 ? 0.9 : 1})` }}>{clicked ? "✓ সাবস্ক্রাইবড" : "সাবস্ক্রাইব"}</div>
      <div style={{ padding: "26px 34px", borderRadius: 999, background: "#27272A", fontSize: 54, transform: `rotate(${clicked ? Math.sin(f / 2) * 14 * Math.max(0, 1 - (f - 40) / 30) : 0}deg)` }}>🔔</div>
    </div>
  );
};

// word-by-word caption, current word highlighted (timing ∝ characters)
const Caption: React.FC<{ text: string; len: number }> = ({ text, len }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const total = text.length, speak = len - GAP;
  let acc = 0;
  const starts = words.map((w) => { const s = (acc / total) * speak; acc += w.length + 1; return s; });
  const cur = starts.filter((s) => f >= s).length - 1;
  // show a window of ~7 words around the current one
  const from = Math.max(0, Math.min(cur - 2, words.length - 7)), to = Math.min(words.length, from + 7);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1480, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 18px" }}>
      {words.slice(from, to).map((w, k) => {
        const idx = from + k, on = idx === cur, said = idx < cur;
        return <span key={idx} style={{ fontFamily: FONT, fontSize: 62, color: on ? "#0A0C0B" : said ? "#fff" : "#ffffff88", background: on ? GOLD : "transparent", borderRadius: 14, padding: "0 10px",
          transform: `scale(${on ? 1.1 : 1})`, WebkitTextStroke: on ? "0" : "1px #000", textShadow: on ? "none" : "0 4px 14px #000" }}>{w}</span>;
      })}
    </div>
  );
};

export const ShortsReel: React.FC<{ id: string }> = ({ id }) => {
  const s = SH.find((x) => x.id === id)!;
  const P = plan(s);
  const total = shortTotal(id);
  const f = useCurrentFrame();
  const curBeat = P.filter((b) => f >= b.from).length - 1;
  const zoom = 1 + 0.04 * Math.exp(-Math.max(0, f - (P[Math.max(0, curBeat)]?.from ?? 0)) / 6);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Bg accent={s.accent} />
        {P.map((b, i) => (
          <Sequence key={i} from={b.from} durationInFrames={b.len}>
            {b.bg && <AbsoluteFill style={{ overflow: "hidden" }}>
              <OffthreadVideo src={staticFile(`qe/stock/${b.bg}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.08)" }} />
              <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,12,11,0.55) 0%, rgba(10,12,11,0.35) 45%, rgba(10,12,11,0.9) 100%)" }} />
            </AbsoluteFill>}
            <Card b={b} i={i} n={P.length} accent={s.accent} len={b.len} />
            <Caption text={b.vo} len={b.len} />
            <Audio src={staticFile(`shorts/${id}/${i}.mp3`)} />
            <Audio src={staticFile(i === 0 ? "mohajon/sfx/impact.mp3" : "mohajon/sfx/pop.mp3")} volume={i === 0 ? 0.5 : 0.45} />
            {i > 0 && <Audio src={staticFile("mohajon/sfx/whoosh.mp3")} volume={0.3} />}
          </Sequence>
        ))}
      </AbsoluteFill>
      {/* story progress */}
      <div style={{ position: "absolute", top: 40, left: 40, right: 40, display: "flex", gap: 8 }}>
        {P.map((b, i) => (
          <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: "#ffffff33", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${interpolate(f, [b.from, b.from + b.len], [0, 100], clamp)}%`, background: "#fff" }} />
          </div>
        ))}
      </div>
      {/* brand + pinned hook */}
      <div style={{ position: "absolute", top: 80, left: 40, right: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "8px 14px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 52, display: "block" }} /></div>
        <div style={{ fontFamily: SEMI, fontSize: 32, color: "#fff", background: "#ffffff1f", padding: "8px 20px", borderRadius: 999 }}>প্রবাসী গাইড ✈️</div>
      </div>
      <div style={{ position: "absolute", top: 200, left: 50, right: 50, textAlign: "center", fontFamily: FONT, color: "#fff", lineHeight: 1.15,
        fontSize: curBeat <= 0 ? 78 : 46, transition: "none", textShadow: "0 6px 24px rgba(0,0,0,0.7)",
        transform: `scale(${curBeat <= 0 ? 1 + 0.03 * Math.sin(f / 4) : 1})` }}>
        <span style={{ background: curBeat <= 0 ? s.accent : "transparent", padding: "4px 18px", borderRadius: 16, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{s.hook} {s.hookEmoji}</span>
      </div>
      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 34, color: "#ffffffaa" }}>probashibondu.online</div>
      <Audio src={staticFile("guide/bed.mp3")} volume={(fr) => interpolate(fr, [0, 10, total - 20, total], [0, 0.16, 0.16, 0], clamp)} />
    </AbsoluteFill>
  );
};
