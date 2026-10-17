// COB infographic motion reels (1080x1920). One engine, data in reels.json, VO per scene in public/imvo/<id>/NN.mp3
// (work/infomotion/make_vo.py writes durations.json). Everything is kept inside the Shorts/Reels safe area:
// Owner rule (16 Oct 2026): each reel ≤30 s (hook + 2 data scenes + short CTA, VO lines ~6 s) and a 3–5 word
// curiosity title + #Shorts; work/infomotion/make_vo.py flags reels that break it.
// x 60…940 (right 140 px = like/share buttons), y 110…1500 (bottom = title/channel overlay).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BN, bn, clamp } from "../news/NewsKit";
import { RED, INK, MUTE, AMBER, HEAD, T, Grain } from "../investigation/HoneyTrap";
import REELS_JSON from "./reels.json";
import DUR from "./durations.json";

type Num = { v: number; label: string };
type Scene = {
  type: "hook" | "big" | "split" | "bars" | "status" | "tips" | "compare" | "donut" | "cta";
  h: string[]; say: string; v?: number; dec?: number; pre?: string; suf?: string; label?: string; sub?: string; note?: string;
  a?: Num; b?: Num; rows?: (string | number)[][]; unit?: string; items?: string[]; badge?: string;
};
export type IM = { id: string; tag: string; accent: string; tint: string; music: string; img: string; imgNote: string; source: string; scenes: Scene[] };
export const IM_REELS = REELS_JSON as unknown as IM[];

const FPS = 30, PAD = 12, X = 26; // PAD = breath after each VO line, X = crossfade
const D = DUR as Record<string, number>;
const sceneLen = (r: IM, i: number) => Math.ceil((D[`${r.id}/${String(i + 1).padStart(2, "0")}`] || 4) * FPS) + PAD + (i === r.scenes.length - 1 ? 45 : 0);
export const imLen = (r: IM) => r.scenes.reduce((s, _, i) => s + sceneLen(r, i), 0);

const L = 60, W = 880; // safe content box
const fmt = (v: number, dec = 0) => bn(dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN"));
const pop = (f: number, at: number, damping = 14) => spring({ frame: f - at, fps: FPS, config: { damping } });

const Head: React.FC<{ h: string[]; accent: string; top?: number; size?: number }> = ({ h, accent, top = 230, size = 86 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: L, width: W, top }}>
      {h.map((t, i) => {
        const p = pop(f, 2 + i * 6);
        return <div key={i} style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.15, color: i ? accent : "white", textShadow: "0 4px 24px rgba(0,0,0,.85)", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, overflowWrap: "anywhere" }}>{t}</div>;
      })}
    </div>
  );
};
const Note: React.FC<{ t?: string; top: number }> = ({ t, top }) => {
  const f = useCurrentFrame();
  if (!t) return null;
  return <div style={{ position: "absolute", left: L, top, opacity: T(f, 10, 20), fontFamily: BN, fontWeight: 700, fontSize: 34, color: INK, background: AMBER, padding: "4px 18px 8px", borderRadius: 8 }}>{t}</div>;
};
const Counter: React.FC<{ v: number; dec?: number; pre?: string; suf?: string; at: number; size?: number; color: string }> = ({ v, dec, pre = "", suf = "", at, size = 190, color }) => {
  const f = useCurrentFrame();
  const x = T(f, at, at + 45, 0, v);
  const s = 1 + 0.06 * Math.max(0, 1 - Math.abs(f - at - 47) / 8);
  const txt = `${pre}${fmt(x, dec)}${suf}`;
  const fs = Math.min(size, (W * 1.7) / Math.max(4, txt.length)); // shrink long numbers so they never leave the box
  return <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs, lineHeight: 1, color, transform: `scale(${s})`, transformOrigin: "left center", textShadow: `0 0 50px ${color}55`, whiteSpace: "nowrap" }}>{txt}</div>;
};

const Body: React.FC<{ s: Scene; r: IM; len: number }> = ({ s, r, len }) => {
  const f = useCurrentFrame();
  const A = r.accent;
  const box: React.CSSProperties = { position: "absolute", left: L, width: W };
  switch (s.type) {
    case "hook":
    case "big":
      return (
        <>
          <Head h={s.h} accent={A} top={s.type === "hook" ? 250 : 260} size={s.type === "hook" ? 96 : 84} />
          <div style={{ ...box, top: s.type === "hook" ? 610 : 560, opacity: T(f, 8, 16) }}>
            <Counter v={s.v!} dec={s.dec} pre={s.pre} suf={s.suf} at={10} color={s.type === "hook" ? AMBER : A} />
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: "#e6edf0", marginTop: 14 }}>{s.label}</div>
            {s.sub && <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 36, color: MUTE, marginTop: 24, opacity: T(f, 60, 75), borderLeft: `6px solid ${A}`, paddingLeft: 18 }}>{s.sub}</div>}
          </div>
        </>
      );
    case "split": {
      const tot = s.a!.v + s.b!.v, pa = T(f, 40, 80);
      return (
        <>
          <Head h={s.h} accent={A} />
          <div style={{ ...box, top: 420, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[s.a!, s.b!].map((n, i) => {
              const p = pop(f, 8 + i * 14);
              return (
                <div key={i} style={{ background: "rgba(255,255,255,.07)", border: `2px solid ${i ? AMBER : A}66`, borderRadius: 22, padding: "30px 26px", opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
                  <Counter v={n.v} at={10 + i * 14} size={130} color={i ? AMBER : A} />
                  <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 38, color: "white", marginTop: 12, lineHeight: 1.25 }}>{n.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ ...box, top: 830, height: 46, borderRadius: 23, overflow: "hidden", display: "flex", background: "rgba(255,255,255,.08)" }}>
            <div style={{ width: `${(s.a!.v / tot) * 100 * pa}%`, background: A }} />
            <div style={{ width: `${(s.b!.v / tot) * 100 * pa}%`, background: AMBER }} />
          </div>
          <div style={{ ...box, top: 900, fontFamily: BN, fontWeight: 700, fontSize: 38, color: MUTE, opacity: pa }}>মোট {fmt(tot)}</div>
        </>
      );
    }
    case "bars": {
      const rows = s.rows as [string, number][], max = Math.max(...rows.map((x) => x[1]));
      const step = Math.min(14, (len * 0.5) / rows.length), cmp = rows.length > 5;
      return (
        <>
          <Head h={s.h} accent={A} size={80} />
          <Note t={s.note} top={s.h.length > 1 ? 450 : 360} />
          <div style={{ ...box, top: s.h.length > 1 ? 530 : 450 }}>
            {rows.map(([k, v], i) => {
              const p = T(f, 10 + i * step, 40 + i * step);
              const top1 = v === max;
              return (
                <div key={k} style={{ marginBottom: cmp ? 12 : 22, opacity: T(f, 8 + i * step, 14 + i * step) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BN, fontWeight: 700, fontSize: cmp ? 36 : 40, color: "white", marginBottom: 4 }}>
                    <span>{k}</span><span style={{ fontFamily: HEAD, fontWeight: 800, color: top1 ? A : "white" }}>{fmt(v * p, Number.isInteger(v) ? 0 : 2)}{s.unit || ""}</span>
                  </div>
                  <div style={{ height: cmp ? 24 : 30, borderRadius: 15, background: "rgba(255,255,255,.08)" }}>
                    <div style={{ width: `${(v / max) * 100 * p}%`, height: "100%", borderRadius: 15, background: top1 ? `linear-gradient(90deg, ${A}aa, ${A})` : "linear-gradient(90deg,#4f6672,#c9d4da)", boxShadow: top1 ? `0 0 24px ${A}77` : undefined }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    case "status": {
      const C: Record<string, string> = { red: "#ff3b4e", amber: AMBER, green: "#3ee08f" };
      const rows = s.rows as [string, string, string][];
      const step = Math.min(18, (len * 0.55) / rows.length);
      return (
        <>
          <Head h={s.h} accent={A} size={80} />
          <div style={{ ...box, top: 520, display: "flex", flexDirection: "column", gap: 20 }}>
            {rows.map(([k, st, c], i) => {
              const p = pop(f, 10 + i * step, 15);
              const blink = c === "red" ? 0.55 + 0.45 * Math.abs(Math.sin(f / 7)) : 1;
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(255,255,255,.07)", borderRadius: 18, padding: "20px 26px", opacity: p, transform: `translateX(${(1 - p) * 80}px)` }}>
                  <div style={{ width: 30, height: 30, borderRadius: 15, background: C[c], opacity: blink, boxShadow: `0 0 18px ${C[c]}` }} />
                  <div style={{ flex: 1, fontFamily: BN, fontWeight: 700, fontSize: 42, color: "white" }}>{k}</div>
                  <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: INK, background: C[c], padding: "4px 18px 8px", borderRadius: 10 }}>{st}</div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    case "tips": {
      const items = s.items!, step = (len * 0.7) / items.length;
      return (
        <>
          <Head h={s.h} accent={A} size={80} />
          <Note t={s.note} top={s.h.length > 1 ? 450 : 360} />
          <div style={{ ...box, top: s.h.length > 1 ? (s.note ? 530 : 500) : 420, display: "flex", flexDirection: "column", gap: 20 }}>
            {items.map((t, i) => {
              const at = 8 + i * step, p = pop(f, at, 15);
              const on = f >= at && f < at + step;
              return (
                <div key={t} style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, lineHeight: 1.3, color: "white", background: on ? `${A}2e` : "rgba(255,255,255,.07)", borderLeft: `8px solid ${i % 2 ? AMBER : A}`, padding: "18px 24px", borderRadius: 14, opacity: p, transform: `translateX(${(1 - p) * 70}px) scale(${on ? 1.02 : 1})`, transformOrigin: "left center" }}>{t}</div>
              );
            })}
          </div>
        </>
      );
    }
    case "compare": {
      const max = Math.max(s.a!.v, s.b!.v);
      return (
        <>
          <Head h={s.h} accent={A} size={80} />
          <div style={{ ...box, top: 430, height: 560, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 90 }}>
            {[s.a!, s.b!].map((n, i) => {
              const p = T(f, 10 + i * 22, 50 + i * 22);
              return (
                <div key={i} style={{ width: 260, textAlign: "center" }}>
                  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 66, color: i ? A : "white", marginBottom: 12 }}>{s.pre}{fmt(n.v * p, s.dec)}</div>
                  <div style={{ height: 380 * (n.v / max) * p, borderRadius: "18px 18px 0 0", background: i ? `linear-gradient(180deg, ${A}, ${A}55)` : "linear-gradient(180deg,#c9d4da,#4f6672)" }} />
                  <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 38, color: MUTE, marginTop: 12 }}>{n.label}</div>
                </div>
              );
            })}
          </div>
          {s.badge && <div style={{ ...box, top: 1040, textAlign: "center" }}>
            <span style={{ display: "inline-block", fontFamily: HEAD, fontWeight: 800, fontSize: 80, color: INK, background: A, padding: "4px 36px 10px", borderRadius: 20, transform: `scale(${pop(f, 70, 11)})` }}>▲ {s.badge}</span>
          </div>}
        </>
      );
    }
    case "donut": {
      const p = T(f, 10, 60) * (s.v! / 100), R = 230, C2 = 2 * Math.PI * R;
      return (
        <>
          <Head h={s.h} accent={A} size={80} />
          <Note t={s.note} top={360} />
          <div style={{ ...box, top: 460, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 560, height: 560 }}>
              <svg width={560} height={560} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={280} cy={280} r={R} stroke="rgba(255,255,255,.1)" strokeWidth={56} fill="none" />
                <circle cx={280} cy={280} r={R} stroke={A} strokeWidth={56} fill="none" strokeLinecap="round" strokeDasharray={`${C2 * p} ${C2}`} style={{ filter: `drop-shadow(0 0 16px ${A}88)` }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: "white", lineHeight: 1 }}>{fmt(p * 100)}%</div>
                <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 38, color: MUTE, marginTop: 8 }}>{s.label}</div>
              </div>
            </div>
          </div>
        </>
      );
    }
    case "cta": {
      const p = pop(f, 4, 12);
      return (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
          <Img src={staticFile("cob/logo-round.png")} style={{ width: 300, transform: `scale(${p}) rotate(${(1 - p) * -40}deg)` }} />
          <div style={{ width: W, textAlign: "center", marginTop: 40 }}>
            {s.h.map((t, i) => <div key={i} style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 80, lineHeight: 1.15, color: i ? A : "white", opacity: pop(f, 10 + i * 6) }}>{t}</div>)}
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 20, opacity: T(f, 24, 34) }}>
            {["👍 লাইক", "↗ শেয়ার", "🔔 ফলো"].map((t, i) => <span key={t} style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: i === 2 ? INK : "white", background: i === 2 ? AMBER : "rgba(255,255,255,.12)", padding: "10px 26px 14px", borderRadius: 40, transform: `scale(${pop(f, 26 + i * 6, 11)})` }}>{t}</span>)}
          </div>
        </AbsoluteFill>
      );
    }
  }
};

// karaoke-style caption: VO text split into ~4-word chunks, timed by character length
const Caption: React.FC<{ text: string; frames: number; accent: string }> = ({ text, frames, accent }) => {
  const f = useCurrentFrame();
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; ) {
    let c = words[i++];
    while (i < words.length && c.split(" ").length < 4 && !/[।,?!]$/.test(c)) c += " " + words[i++];
    chunks.push(c);
  }
  const tot = chunks.reduce((s, c) => s + c.length + 6, 0);
  let acc = 0, cur = chunks[chunks.length - 1];
  for (const c of chunks) { const d = ((c.length + 6) / tot) * frames; if (f < acc + d) { cur = c; break; } acc += d; }
  const p = spring({ frame: f - acc, fps: FPS, config: { damping: 18 }, durationInFrames: 8 });
  return (
    <div style={{ position: "absolute", left: L, width: W, top: 1236, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 54, lineHeight: 1.3, color: "white", textAlign: "center", background: "rgba(6,10,12,.78)", borderBottom: `5px solid ${accent}`, padding: "8px 26px 14px", borderRadius: 14, transform: `scale(${0.92 + 0.08 * p})`, overflowWrap: "anywhere" }}>{cur.replace(/[।,]$/, "")}</span>
    </div>
  );
};


// free backdrop (no AI photo): drifting accent glows + diagonal light sweep
const FreeBg: React.FC<{ r: IM; f: number }> = ({ r, f }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(700px 700px at ${20 + Math.sin(f / 45) * 10}% ${25 + Math.cos(f / 50) * 8}%, ${r.accent}55, transparent 70%), radial-gradient(800px 800px at ${80 + Math.cos(f / 55) * 10}% ${78 + Math.sin(f / 40) * 6}%, ${r.tint}, transparent 70%)` }} />
    <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${((f * 1.2) % 260) - 60}%, rgba(255,255,255,.06) ${((f * 1.2) % 260) - 45}%, transparent ${((f * 1.2) % 260) - 30}%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(1200px 1400px at 50% 50%, transparent 40%, rgba(0,0,0,.65))" }} />
  </AbsoluteFill>
);
export const InfoMotion: React.FC<{ id: string }> = ({ id }) => {
  const r = IM_REELS.find((x) => x.id === id)!;
  const f = useCurrentFrame();
  const { durationInFrames: DT } = useVideoConfig();
  let at = 0;
  const seqs = r.scenes.map((s, i) => { const len = sceneLen(r, i); const o = { s, i, from: at, len }; at += len; return o; });
  const hookLen = seqs[0].len;
  const imgOp = interpolate(f, [0, hookLen - 10, hookLen + 10], [1, 1, 0.22], clamp);
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      {/* backdrop: AI photo full on the hook, then a faint blurred layer under the graphics */}
      {r.img ? <AbsoluteFill style={{ opacity: imgOp }}>
        <Img src={staticFile(r.img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + f * 0.00025})`, filter: f > hookLen ? "blur(14px)" : undefined }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,9,11,.85) 0%, rgba(5,9,11,.25) 38%, rgba(5,9,11,.55) 62%, rgba(5,9,11,.95) 100%)" }} />
      </AbsoluteFill> : <FreeBg r={r} f={f} />}
      <AbsoluteFill style={{ background: `radial-gradient(900px 1000px at ${50 + Math.sin(f / 60) * 12}% 35%, ${r.tint}, transparent 65%)`, opacity: r.img ? interpolate(f, [hookLen - 10, hookLen + 10], [0.4, 1], clamp) : 1 }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${(f * 0.6) % 60}px)`, opacity: f > hookLen || !r.img ? 1 : 0 }} />
      {seqs.map(({ s, i, from, len }) => (
        <Sequence key={i} from={from} durationInFrames={len + (i < seqs.length - 1 ? X / 2 : 0)}>
          <SceneWrap len={len} last={i === seqs.length - 1}>
            <Body s={s} r={r} len={len} />
            {s.type !== "cta" && <Caption text={s.say} frames={len - PAD} accent={r.accent} />}
          </SceneWrap>
          <Audio src={staticFile(`imvo/${r.id}/${String(i + 1).padStart(2, "0")}.mp3`)} />
          {i > 0 && <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.28} />}
        </Sequence>
      ))}
      {/* header + progress + source, all inside the safe area */}
      <div style={{ position: "absolute", left: L, top: 110, display: "flex", alignItems: "center", gap: 18 }}>
        <Img src={staticFile("cob/logo-round.png")} style={{ height: 86 }} />
        <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: "white", background: RED, padding: "4px 20px 8px", borderRadius: 10 }}>{r.tag}</span>
      </div>
      <div style={{ position: "absolute", left: L, width: W, top: 1478, height: 6, borderRadius: 3, background: "rgba(255,255,255,.15)" }}>
        <div style={{ width: `${(f / DT) * 100}%`, height: "100%", borderRadius: 3, background: r.accent }} />
      </div>
      <div style={{ position: "absolute", left: L, width: W, top: 1426, fontFamily: BN, fontSize: 25, color: "#c3ced3", opacity: f < hookLen ? 1 : 0.85 }}>
        {f < hookLen && r.imgNote ? r.imgNote : `সূত্র: ${r.source}`}
      </div>
      <Grain />
      <Sequence durationInFrames={20}><Audio src={staticFile("sfx/boom.mp3")} volume={0.5} /></Sequence>
      <Audio src={staticFile(r.music)} volume={(x) => interpolate(x, [0, 15, DT - 25, DT], [0, 0.13, 0.13, 0], clamp)} />
    </AbsoluteFill>
  );
};

const SceneWrap: React.FC<{ len: number; last: boolean; children: React.ReactNode }> = ({ len, last, children }) => {
  const f = useCurrentFrame();
  const inn = T(f, 0, 10), out = last ? 1 : interpolate(f, [len - X / 2, len + X / 2], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: Math.min(inn, out), transform: `translateY(${(1 - inn) * 30}px)` }}>{children}</AbsoluteFill>;
};
