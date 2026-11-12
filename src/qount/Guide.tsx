// Qount guide videos (2026-11-12): real screen recordings of a LOCAL build (work/qount/guide/rec.mjs) + step list, highlight rings, VO, subtitles.
// Data: src/qount/guide-data.json (python work/qount/guide/build_data.py). Public dir work/qpub (guide/<g>.mp4, guide/<g>/NN.mp3, fonts, music.mp3).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, ShieldCheck, Globe, Sparkles } from "lucide-react";
import DATA from "./guide-data.json";
import { Logo, Wordmark, Words, F, LAT, INDIGO, INK, MUTED, WHITE, GREEN, GRAD, clamp, sp, lerp, bn } from "./Qd";

type Ev = { t: number; k: string; rect: number[]; dur?: number };
type St = { t: number; title: string; vo: string; dur: number; path: string };
type GD = { id: string; title: string; len: number; steps: St[]; ev: Ev[] };
const G = DATA as unknown as Record<string, GD>;
export const INTRO = 105, OUTRO = 150;
export const guideFrames = (id: string) => INTRO + Math.ceil(G[id].len * 30) + OUTRO;

const SIDE = 400, VX = 420, VW = 1470, BAR = 44, VY = 40;
const VH = Math.round(VW / 1.6);
const K = VW / 1440; // CSS px -> screen px

const Side: React.FC<{ g: GD; tt: number }> = ({ g, tt }) => {
  let cur = 0; g.steps.forEach((s, i) => { if (tt >= s.t) cur = i; });
  const n = g.steps.length, rowH = Math.min(46, 760 / n);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: 1080, padding: "40px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo size={46} /><Wordmark h={36} />
        <span style={{ marginLeft: 6, fontFamily: F, fontWeight: 700, fontSize: 20, color: INK, background: "#F2B300", borderRadius: 99, padding: "2px 12px" }}>গাইড</span></div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 28, lineHeight: 1.3, color: INK }}>{g.title}</div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
        {g.steps.map((s, i) => {
          const done = i < cur, on = i === cur;
          return (
            <div key={i} style={{ height: rowH, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", borderRadius: 14, background: on ? "#1F1A12" : "transparent" }}>
              <div style={{ width: 28, height: 28, borderRadius: 99, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? GREEN : on ? "#F2B300" : "#ECE6D8", fontFamily: F, fontWeight: 800, fontSize: 16, color: on ? INK : MUTED }}>
                {done ? <Check size={18} color="#fff" strokeWidth={3.2} /> : bn(i + 1)}
              </div>
              <span style={{ fontFamily: F, fontWeight: on ? 800 : 600, fontSize: on ? 22 : 20, color: on ? WHITE : done ? INK : MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Rings: React.FC<{ g: GD; tt: number }> = ({ g, tt }) => (
  <>
    {g.ev.map((e, i) => {
      const life = e.k === "hl" ? (e.dur || 1.4) + 0.3 : 0.9;
      const a = tt - e.t; if (a < -0.05 || a > life) return null;
      const o = interpolate(a, [0, 0.15, life - 0.25, life], [0, 1, 1, 0], clamp);
      const pad = 8, [x, y, w, h] = e.rect;
      const pulse = e.k === "hl" ? 1 + 0.03 * Math.sin(a * 7) : interpolate(a, [0, 0.6], [1.25, 1], clamp);
      return (
        <div key={i} style={{ position: "absolute", left: x * K - pad, top: y * K - pad, width: w * K + 2 * pad, height: h * K + 2 * pad, borderRadius: 16, opacity: o,
          border: `4px solid ${e.k === "hl" ? "#F2B300" : "#1F1A12"}`, boxShadow: `0 0 0 6px ${e.k === "hl" ? "rgba(242,179,0,.28)" : "rgba(31,26,18,.22)"}`, transform: `scale(${pulse})` }} />
      );
    })}
  </>
);

/* ---------- tutorial camera: zoom into each highlighted / clicked element, spotlight around it ---------- */
type Cam = { z: number; fx: number; fy: number };
const ID: Cam = { z: 1, fx: VW / 2, fy: VH / 2 };
const smooth = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const mix = (a: Cam, b: Cam, k: number): Cam => ({ z: a.z + (b.z - a.z) * k, fx: a.fx + (b.fx - a.fx) * k, fy: a.fy + (b.fy - a.fy) * k });
type Shot = { start: number; end: number; cam: Cam; e: Ev };
const shotsOf = (g: GD): Shot[] => g.ev.map((e) => {
  const [x, y, w, h] = e.rect; const W = w * K + 140, H = h * K + 140;
  const z = Math.max(1.12, Math.min(1.9, Math.min(VW / W, VH / H) * 0.62));
  return { start: e.t - 0.45, end: e.t + (e.k === "hl" ? (e.dur || 1.4) : 0.9) + 0.5, cam: { z, fx: (x + w / 2) * K, fy: (y + h / 2) * K }, e };
});
const camAt = (S: Shot[], tt: number): { cam: Cam; act: Shot | null; on: number } => {
  let i = -1; for (let k = 0; k < S.length; k++) if (S[k].start <= tt) i = k;
  if (i < 0) return { cam: ID, act: null, on: 0 };
  const s = S[i]; const a = smooth((tt - s.start) / 0.55);
  const prev = i > 0 && S[i - 1].end >= s.start - 0.6 ? S[i - 1].cam : ID;
  let cam = mix(prev, s.cam, a), on = a;
  if (tt > s.end) { const o = smooth((tt - s.end) / 0.7); cam = mix(s.cam, ID, o); on = 1 - o; }
  return { cam, act: s, on };
};
const camTransform = (c: Cam) => {
  let tx = VW / 2 - c.fx * c.z, ty = VH / 2 - c.fy * c.z;
  tx = Math.min(0, Math.max(VW - VW * c.z, tx)); ty = Math.min(0, Math.max(VH - VH * c.z, ty));
  return `translate(${tx}px, ${ty}px) scale(${c.z})`;
};
const Spot: React.FC<{ s: Shot | null; on: number }> = ({ s, on }) => {
  if (!s || on <= 0.02) return null;
  const [x, y, w, h] = s.e.rect, pad = 10;
  return <div style={{ position: "absolute", left: x * K - pad, top: y * K - pad, width: w * K + 2 * pad, height: h * K + 2 * pad, borderRadius: 14, boxShadow: `0 0 0 4000px rgba(31,26,18,${0.42 * on})`, pointerEvents: "none" }} />;
};

const Banner: React.FC<{ g: GD; tt: number }> = ({ g, tt }) => {
  const { fps } = useVideoConfig();
  let cur = 0; g.steps.forEach((s, i) => { if (tt >= s.t) cur = i; });
  const s = g.steps[cur]; const a = (tt - s.t) * fps;
  const e = sp(a, fps, 0, 14);
  return (
    <div style={{ position: "absolute", left: VX + 24, top: VY + BAR + 20, display: "flex", alignItems: "center", gap: 14, padding: "10px 24px 12px 12px", borderRadius: 99, background: "rgba(31,26,18,.9)", boxShadow: "0 14px 34px rgba(31,26,18,.25)",
      transform: `translateX(${(1 - e) * -40}px)`, opacity: interpolate(a, [0, 6], [0, 1], clamp) }}>
      <div style={{ width: 42, height: 42, borderRadius: 99, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 22, color: INK }}>{bn(cur + 1)}</div>
      <span style={{ fontFamily: F, fontWeight: 800, fontSize: 30, color: WHITE }}>{s.title}</span>
    </div>
  );
};

const Caption: React.FC<{ g: GD; tt: number }> = ({ g, tt }) => {
  let out: string | null = null, st = 0;
  for (const s of g.steps) {
    const parts = s.vo.split(/(?<=[।?!—,])\s+/).reduce<string[]>((acc, p) => { const l = acc[acc.length - 1]; if (l && (l + " " + p).length < 46) acc[acc.length - 1] = l + " " + p; else acc.push(p); return acc; }, []);
    const tot = parts.reduce((a, p) => a + p.length, 0); let at = s.t + 0.3;
    for (const p of parts) { const d = (s.dur * p.length) / tot; if (tt >= at && tt < at + d + 0.2) { out = p; st = at; } at += d; }
  }
  if (!out) return null;
  const o = interpolate(tt - st, [0, 0.12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: VX, width: VW, top: VY + BAR + VH - 120, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: 1300, padding: "10px 30px 14px", borderRadius: 18, background: "rgba(31,26,18,.88)", fontFamily: F, fontWeight: 600, fontSize: 40, color: WHITE, textAlign: "center", lineHeight: 1.35 }}>{out}</div>
    </div>
  );
};

const Card: React.FC<{ g: GD; end?: boolean }> = ({ g, end }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = sp(f, fps, 2, 12);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28, background: "#F8F5EE" }}>
      <div style={{ position: "absolute", width: 1200, height: 1200, borderRadius: "50%", left: 1100, top: -400, background: "radial-gradient(circle, #F2B30033 0%, #F2B30000 62%)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 22, transform: `scale(${a})` }}><Logo size={110} /><Wordmark h={100} /></div>
      {!end ? <>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 34, color: INK, background: "#F2B300", borderRadius: 99, padding: "6px 26px", opacity: lerp(f, 10, 20) }}>ধাপে ধাপে গাইড</div>
        <div style={{ maxWidth: 1500 }}><Words text={g.title} size={78} d={14} align="center" /></div>
      </> : <>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 48, color: INK, opacity: lerp(f, 8, 20) }}><span style={{ background: "#F2B300", borderRadius: 999, padding: "4px 30px 10px" }}>৩ দিন ফ্রি শুরু করুন</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 34px", borderRadius: 99, background: WHITE, border: "2px solid #ECE6D8", opacity: lerp(f, 18, 30) }}>
          <Globe size={44} color={INDIGO} /><span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 48, color: INK }}>qount.dreamithq.com</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F, fontWeight: 600, fontSize: 32, color: MUTED, opacity: lerp(f, 28, 40) }}><Sparkles size={30} color={INDIGO} />পাড়ার সব বুকিং, এক জায়গায়</div>
      </>}
    </AbsoluteFill>
  );
};

export const GuideFilm: React.FC<{ id: string }> = ({ id }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: N } = useVideoConfig();
  const g = G[id];
  const tt = (f - INTRO) / fps;
  let cur = 0; g.steps.forEach((s, i) => { if (tt >= s.t) cur = i; });
  const path = g.steps[cur]?.path || "/";
  const recLen = Math.ceil(g.len * fps);
  const shots = React.useMemo(() => shotsOf(g), [g]);
  const cam = camAt(shots, tt);
  return (
    <AbsoluteFill style={{ background: "#F8F5EE" }}>
      <Sequence from={INTRO} durationInFrames={recLen}>
        <AbsoluteFill>
          <Side g={g} tt={tt} />
          <div style={{ position: "absolute", left: VX, top: VY, width: VW, height: BAR + VH, borderRadius: 20, overflow: "hidden", background: WHITE, boxShadow: "0 30px 80px rgba(31,26,18,.18)", border: "1.5px solid #ECE6D8" }}>
            <div style={{ height: BAR, background: "#F3EEE3", display: "flex", alignItems: "center", gap: 9, padding: "0 18px" }}>
              {["#F87171", "#FBBF24", "#34D399"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />)}
              <div style={{ marginLeft: 16, width: 620, height: 30, borderRadius: 99, background: WHITE, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontFamily: LAT, fontWeight: 600, fontSize: 17, color: "#665C4C" }}>
                <ShieldCheck size={16} color={GREEN} />qount.dreamithq.com{path === "/" ? "" : path}</div>
            </div>
            <div style={{ position: "relative", width: VW, height: VH, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: VW, height: VH, transformOrigin: "0 0", transform: camTransform(cam.cam) }}>
                <OffthreadVideo src={staticFile(`qg/${id}.mp4`)} muted style={{ width: VW, height: VH }} />
                <Spot s={cam.act} on={cam.act?.e.k === "hl" ? cam.on : cam.on * 0.6} />
                <Rings g={g} tt={tt} />
              </div>
            </div>
          </div>
          <Banner g={g} tt={tt} />
          <Caption g={g} tt={tt} />
        </AbsoluteFill>
      </Sequence>
      <Sequence durationInFrames={INTRO + 8}><div style={{ opacity: interpolate(f, [INTRO - 8, INTRO + 8], [1, 0], clamp), position: "absolute", inset: 0 }}><Card g={g} /></div></Sequence>
      <Sequence from={INTRO + recLen - 8}><div style={{ opacity: interpolate(f, [INTRO + recLen - 8, INTRO + recLen + 6], [0, 1], clamp), position: "absolute", inset: 0 }}><Card g={g} end /></div></Sequence>
      {g.steps.map((s, i) => (
        <Sequence key={i} from={INTRO + Math.round((s.t + 0.3) * fps)}><Audio src={staticFile(`qg/${id}/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
      ))}
      <Audio src={staticFile("qg/music.mp3")} loop volume={(x) => interpolate(x, [0, 20, INTRO, INTRO + 20, N - OUTRO, N - OUTRO + 20, N - 30, N], [0, 0.14, 0.14, 0.045, 0.045, 0.14, 0.14, 0], clamp)} />
    </AbsoluteFill>
  );
};

export const GuideG1: React.FC = () => <GuideFilm id="g1" />;
export const GuideG2: React.FC = () => <GuideFilm id="g2" />;
export const GuideG3: React.FC = () => <GuideFilm id="g3" />;
