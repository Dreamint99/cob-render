// "রহস্যময় বাংলাদেশ" — episode 1 sample cut (Barisal Guns). Timeline comes from public/mystery/ep1/timeline.json
// (built by work/mystery/build_timeline.py from the VO lengths and word timings).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";

const S = (p: string) => staticFile(`mystery/ep1/${p}`);
const SERIF = '"Noto Serif Bengali", "Tiro Bangla", serif';
const SANS = '"Anek Bangla", "Hind Siliguri", sans-serif';
const GOLD = "#e9c77d", RED = "#d1102c", AMBER = "#ffc65c", INK = "#0b0f14";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.33, 0, 0.2, 1);

export type Shot = { k: string; from: number; len: number; [x: string]: any };
export type Word = { w: string; s: number; e: number };
export type Cap = { from: number; to: number; words: Word[] };
export type Timeline = { total: number; shots: Shot[]; overlays: Shot[]; caps: Cap[]; audio: { src: string; from: number; len?: number; vol: number; fi?: number; fo?: number; start?: number; duck?: boolean }[]; booms: number[]; vo: { from: number; to: number }[] };

// ---------------- grade & texture ----------------
const GRADES: Record<string, string> = {
  night: "saturate(.75) contrast(1.12) brightness(.82) hue-rotate(-6deg)",
  storm: "saturate(.7) contrast(1.15) brightness(.86)",
  warm: "saturate(.9) contrast(1.08) brightness(.9) sepia(.12)",
  sepia: "sepia(.35) saturate(.85) contrast(1.1) brightness(.9)",
  doc: "contrast(1.05) brightness(.97)",
  none: "none",
};
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <Img src={staticFile(`cob/grain${f % 4}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.16, mixBlendMode: "overlay" }} />
  </AbsoluteFill>;
};
const Vignette: React.FC<{ k?: number }> = ({ k = 0.62 }) => <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 48%, rgba(0,0,0,${k}) 100%)` }} />;
const Tint: React.FC = () => <AbsoluteFill style={{ pointerEvents: "none", background: "linear-gradient(180deg, rgba(20,60,80,.18), rgba(10,30,40,.05) 50%, rgba(80,50,20,.12))", mixBlendMode: "soft-light" }} />;

// small credit line (always shown with real imagery)
const Credit: React.FC<{ t?: string }> = ({ t }) => t ? <div style={{ position: "absolute", right: 46, top: 38, fontFamily: SANS, fontWeight: 500, fontSize: 25, color: "rgba(255,255,255,.72)", textShadow: "0 1px 6px rgba(0,0,0,.9)", maxWidth: 1100, textAlign: "right" }}>{t}</div> : null;

// boom shake: tiny jitter + exposure kick on boom frames
const useShake = (booms: number[], from: number) => {
  const f = useCurrentFrame() + from;
  let dx = 0, dy = 0, br = 0;
  for (const b of booms) {
    const d = f - b;
    if (d >= 0 && d < 14) { const a = Math.exp(-d / 4); dx += (random(`x${b}${d}`) - 0.5) * 9 * a; dy += (random(`y${b}${d}`) - 0.5) * 7 * a; br += 0.13 * a; }
  }
  return { transform: `translate(${dx}px, ${dy}px)`, br };
};

// ---------------- shots ----------------
const Px: React.FC<{ s: Shot; booms: number[] }> = ({ s, booms }) => {
  const f = useCurrentFrame();
  const sh = useShake(booms, s.from);
  const z = interpolate(f, [0, s.len], [s.z0 ?? 1.0, s.z1 ?? 1.04]);
  const g = s.from * 0.37; const hx = Math.sin((f + g) / 41) * 6 + Math.sin((f + g) / 17) * 2, hy = Math.cos((f + g) / 53) * 5 + Math.sin((f + g) / 23) * 1.5;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    <AbsoluteFill style={{ transform: `${sh.transform} translate(${hx}px, ${hy}px) scale(${z * 1.012})`, filter: `${GRADES[s.grade ?? "storm"]} brightness(${1 + sh.br})` }}>
      <OffthreadVideo src={S(s.src)} startFrom={Math.round((s.start ?? 0) * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <Credit t={s.credit} />
  </AbsoluteFill>;
};
const Geo: React.FC<{ s: Shot }> = ({ s }) => <AbsoluteFill style={{ background: "#000" }}>
  <OffthreadVideo src={S(s.src)} startFrom={Math.round((s.start ?? 0) * 30)} muted style={{ width: "100%", height: "100%" }} />
  <Credit t={s.credit} />
</AbsoluteFill>;

// archival page: overview → push into the quoted lines, marker sweeps over them
const Doc: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const Wb = 1500, ratio = s.ratio ?? 1.38, Hb = Wb * ratio;
  const hl: { x0: number; y0: number; x1: number; y1: number; at?: number }[] = s.hl ?? [];
  const foc = s.focus ?? hl[0] ?? { x0: 0.1, y0: 0.1, x1: 0.9, y1: 0.3 };
  const zOver = (H * 0.94) / Hb;
  const zFoc = Math.min(s.maxZ ?? 2.4, (W * (s.fill ?? 0.72)) / ((foc.x1 - foc.x0) * Wb));
  const t = ease(interpolate(f, [0, Math.min(s.len - 6, s.push ?? 34)], [s.startFocus ? 1 : 0, 1], clamp));
  const drift = interpolate(f, [0, s.len], [0, 1]);
  const cx = interpolate(t, [0, 1], [0.5, (foc.x0 + foc.x1) / 2]), cy = interpolate(t, [0, 1], [0.5, (foc.y0 + foc.y1) / 2]) + drift * 0.006;
  const z = interpolate(t, [0, 1], [zOver, zFoc]) * (1 + drift * 0.035);
  const tx = W / 2 - cx * Wb * z, ty = H / 2 - cy * Hb * z;
  const rot = interpolate(f, [0, s.len], [s.rot ?? -0.6, (s.rot ?? -0.6) * 0.4]);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2420 0%, #110e0c 70%)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: Wb, height: Hb, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${z}) rotate(${rot}deg)`, boxShadow: "0 30px 120px rgba(0,0,0,.8)" }}>
      <Img src={S(s.img)} style={{ width: Wb, height: Hb, filter: "sepia(.28) contrast(1.06) brightness(.97)" }} />
      {hl.map((h, i) => {
        const a = (h.at ?? s.hlAt ?? 30) + i * 10;
        const p = ease(interpolate(f, [a, a + 18], [0, 1], clamp));
        return <div key={i} style={{ position: "absolute", left: (h.x0 - 0.005) * Wb, top: (h.y0 - 0.003) * Hb, width: (h.x1 - h.x0 + 0.01) * Wb * p, height: (h.y1 - h.y0 + 0.006) * Hb, background: "rgba(255,190,40,.42)", mixBlendMode: "multiply", borderRadius: 4 }} />;
      })}
    </div>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
    {s.src_label ? <div style={{ position: "absolute", left: 70, top: 60, opacity: interpolate(f, [6, 18], [0, 1], clamp) }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#fff", textShadow: "0 2px 14px #000", background: "rgba(10,10,10,.55)", padding: "10px 22px", borderLeft: `6px solid ${RED}` }}>{s.src_label}</div>
      {s.src_sub ? <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: "rgba(255,255,255,.8)", marginTop: 8, marginLeft: 6, textShadow: "0 2px 10px #000" }}>{s.src_sub}</div> : null}
    </div> : null}
    {s.tr ? <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: interpolate(f, [(s.hlAt ?? 30) + 10, (s.hlAt ?? 30) + 22], [0, 1], clamp) }}>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: "#fff7e6", background: "rgba(12,10,8,.78)", padding: "16px 34px", borderRadius: 6, maxWidth: 1900, textAlign: "center", lineHeight: 1.45 }}>{s.tr}</div>
    </div> : null}
    <Credit t={s.credit} />
  </AbsoluteFill>;
};

// kinetic text on black (or over the shot underneath)
const Kin: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lines: string[] = s.lines;
  return <AbsoluteFill style={{ background: s.bg ?? "#000", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
    {lines.map((l, i) => {
      const sp = spring({ frame: f - i * (s.stagger ?? 9), fps, config: { damping: 16, mass: 0.8 } });
      const out = interpolate(f, [s.len - 8, s.len], [1, 0], clamp);
      const big = i === (s.bigIdx ?? 0);
      return <div key={i} style={{ fontFamily: big ? SERIF : SANS, fontWeight: big ? 800 : 600, fontSize: big ? (s.size ?? 120) : 54, color: big ? (s.color ?? "#fff") : "rgba(255,255,255,.78)", opacity: sp * out, transform: `translateY(${(1 - sp) * 30}px) scale(${interpolate(f, [0, s.len], [1, 1.035])})`, filter: `blur(${(1 - sp) * 8}px)`, textShadow: "0 4px 30px rgba(0,0,0,.8)", lineHeight: 1.3, textAlign: "center", maxWidth: 2100 }}>{l}</div>;
    })}
  </AbsoluteFill>;
};

// series title over the globe/map
const Title: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const word = "রহস্যময় বাংলাদেশ";
  const a = spring({ frame: f, fps, config: { damping: 18 } });
  const sub = interpolate(f, [22, 40], [0, 1], clamp);
  const out = interpolate(f, [s.len - 12, s.len], [1, 0], clamp);
  const sweep = interpolate(f, [8, 60], [-30, 130], clamp);
  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: out }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 60%)" }} />
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 0, color: "rgba(255,255,255,.8)", opacity: sub, marginBottom: 34, textShadow: "0 2px 12px #000" }}>Colours of Bangladesh · পর্ব ১</div>
    <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 800, fontSize: 196, lineHeight: 1.25, opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.12, 1])})`, filter: `blur(${(1 - a) * 14}px)`,
      color: "#efd394", textShadow: `0 0 ${interpolate(sweep, [-30, 50, 130], [0, 40, 12])}px rgba(255,214,140,.55), 0 6px 30px rgba(0,0,0,.85)`, paddingBottom: 10 }}>{word}</div>
    <div style={{ width: interpolate(sub, [0, 1], [0, 900]), height: 3, background: `linear-gradient(90deg, transparent, ${RED}, transparent)`, margin: "4px 0 18px" }} />
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64, color: "#fff", opacity: sub, transform: `translateY(${(1 - sub) * 16}px)`, textShadow: "0 3px 20px #000" }}>যে ১০টি জায়গার ব্যাখ্যা আজও মেলেনি</div>
  </AbsoluteFill>;
};

// case-file chapter card
const Chapter: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 15 } });
  const st = spring({ frame: f - 16, fps, config: { damping: 9, mass: 0.7 } });
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d1a16, #070605 75%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 1500, height: 860, background: "linear-gradient(180deg,#cdb68a,#b89c6c)", borderRadius: 10, boxShadow: "0 40px 140px rgba(0,0,0,.9)", transform: `translateY(${(1 - a) * 120}px) rotate(${-1.4 + (1 - a) * 4}deg)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -64, width: 520, height: 110, background: "#c4a978", borderRadius: "14px 14px 0 0" }} />
      <Img src={S("doc/map_1876.jpg")} style={{ position: "absolute", right: -60, top: 40, width: 760, opacity: 0.32, mixBlendMode: "multiply", transform: "rotate(4deg)" }} />
      <div style={{ position: "absolute", left: 90, top: 90, fontFamily: '"STIX", serif', fontSize: 40, color: "#3b2d1a", letterSpacing: 6 }}>CASE FILE · {s.num ?? "01"}</div>
      <div style={{ position: "absolute", left: 90, top: 170, fontFamily: SERIF, fontWeight: 800, fontSize: s.tsize ?? 150, color: "#22180c", whiteSpace: "nowrap" }}>{s.title ?? "বরিশাল গানস"}</div>
      <div style={{ position: "absolute", left: 96, top: 380, fontFamily: SANS, fontWeight: 600, fontSize: 46, color: "#3b2d1a" }}>{s.sub ?? "বাকেরগঞ্জ জেলা · ১৮৬৫–১৯১৮-এর নথি"}</div>
      <div style={{ position: "absolute", left: 96, top: 450, width: 760, fontFamily: SANS, fontWeight: 500, fontSize: 36, color: "#4a3a22", lineHeight: 1.5 }}>{s.note ?? "দক্ষিণ থেকে আসা কামানের মতো শব্দ। উৎস: অজানা।"}</div>
      <div style={{ position: "absolute", left: 980, top: 560, transform: `rotate(-12deg) scale(${interpolate(st, [0, 1], [2.2, 1])})`, opacity: interpolate(f, [16, 19], [0, 0.92], clamp), border: `8px solid ${RED}`, color: RED, fontFamily: SANS, fontWeight: 800, fontSize: 84, padding: "4px 30px", borderRadius: 8, mixBlendMode: "multiply", whiteSpace: "nowrap" }}>{s.stamp ?? "তদন্ত চলছে"}</div>
    </div>
  </AbsoluteFill>;
};

// places where the guns were heard: BD map with pins and sound rings rising from the sea
const MAPB = { lon0: 87.1875, lat0: 19.311143355064647, lon1: 94.21875, lat1: 27.05912578437406 };
const my = (la: number) => Math.log(Math.tan(Math.PI / 4 + (la * Math.PI) / 360));
const Reach: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  // map image 1536x1843 shown at height 1440*1.35 centred on the delta
  const imW = 1536, imH = 1843, scale = (1440 * 2.6) / imH;
  const P = (lo: number, la: number) => ({ x: ((lo - MAPB.lon0) / (MAPB.lon1 - MAPB.lon0)) * imW * scale, y: (1 - (my(la) - my(MAPB.lat0)) / (my(MAPB.lat1) - my(MAPB.lat0))) * imH * scale });
  const c = P(90.05, 23.05);
  const z = interpolate(f, [0, s.len], [1, 1.08]);
  const ox = 1280 - c.x, oy = 760 - c.y;
  const pts: { n: string; lo: number; la: number; at: number; big?: boolean; side?: string }[] = s.pts;
  const sea = P(89.6, 21.2);
  return <AbsoluteFill style={{ background: "#03060c", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${1280}px ${760}px`, transform: `scale(${z})`, width: 2560, height: 1440 }}>
      <Img src={S("geo/bd_tex.jpg")} style={{ position: "absolute", left: ox, top: oy, width: imW * scale, height: imH * scale, filter: "brightness(.62) saturate(.7)" }} />
      {(s.rings === false ? [] : [0, 1, 2, 3, 4]).map((k) => {
        const ph = ((f + k * 18) % 90) / 90;
        return <div key={k} style={{ position: "absolute", left: ox + sea.x, top: oy + sea.y, width: 0, height: 0 }}>
          <div style={{ position: "absolute", left: -ph * 1100, top: -ph * 1100, width: ph * 2200, height: ph * 2200, borderRadius: "50%", border: `${3 + 3 * (1 - ph)}px solid rgba(255,120,60,${0.55 * (1 - ph)})` }} />
        </div>;
      })}
      {pts.map((p, i) => {
        const q = P(p.lo, p.la); const a = spring({ frame: f - p.at, fps, config: { damping: 12 } });
        return <div key={i} style={{ position: "absolute", left: ox + q.x, top: oy + q.y, transform: `translate(-50%,-50%) scale(${a})`, opacity: a }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: AMBER, boxShadow: `0 0 22px 8px ${AMBER}77`, margin: "0 auto" }} />
          <div style={{ position: "absolute", ...(p.side === "l" ? { right: 34 } : { left: 34 }), top: p.side === "b" ? 22 : -24, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: p.big ? 62 : 46, color: "#fff", textShadow: "0 2px 12px #000, 0 0 3px #000" }}>{p.n}</div>
        </div>;
      })}
    </div>
    {s.chips ? <div style={{ position: "absolute", left: 90, bottom: 250, display: "flex", gap: 18 }}>{(s.chips as { t: string; at: number }[]).map((c2, i) => {
      const a = spring({ frame: f - c2.at, fps, config: { damping: 14 } });
      return <div key={i} style={{ opacity: a, transform: `translateY(${(1 - a) * 20}px)`, fontFamily: SANS, fontWeight: 700, fontSize: 44, color: INK, background: GOLD, padding: "10px 26px", borderRadius: 40 }}>{c2.t}</div>;
    })}</div> : null}
    <Credit t="মানচিত্র: Sentinel-2 cloudless 2016 © EOX (CC BY 4.0) · Natural Earth" />
  </AbsoluteFill>;
};

// triplet visual: three pulses, then a counter to 45
const Triplets: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const beats: number[] = s.beats; // frames (relative) of the three booms
  const cnt = Math.round(interpolate(f, [s.countFrom, s.countFrom + 40], [1, 45], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
  const showCount = f >= s.countFrom;
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #10161c, #020304 75%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ display: "flex", gap: 170, transform: `translateY(${showCount ? -120 : 0}px)` }}>
      {beats.map((b, i) => {
        const d = f - b; const on = d >= 0;
        const pulse = on ? Math.exp(-d / 10) : 0;
        return <div key={i} style={{ position: "relative", width: 150, height: 150 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: on ? AMBER : "rgba(255,255,255,.08)", boxShadow: on ? `0 0 ${60 + pulse * 120}px ${10 + pulse * 30}px rgba(255,170,60,${0.35 + pulse * 0.5})` : "none", transform: `scale(${1 + pulse * 0.25})` }} />
          {on ? <div style={{ position: "absolute", left: 75 - (d * 9), top: 75 - (d * 9), width: d * 18, height: d * 18, borderRadius: "50%", border: `3px solid rgba(255,190,90,${Math.max(0, 1 - d / 30)})` }} /> : null}
        </div>;
      })}
    </div>
    <div style={{ position: "absolute", top: 330, fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "rgba(255,255,255,.8)", opacity: interpolate(f, [beats[2] + 6, beats[2] + 16], [0, 1], clamp) }}>~৩ সেকেন্ড পরপর · সবসময় তিনটা</div>
    {showCount ? <div style={{ position: "absolute", top: 860, display: "flex", alignItems: "baseline", gap: 26, opacity: interpolate(f, [s.countFrom, s.countFrom + 8], [0, 1], clamp) }}>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 230, color: GOLD, fontVariantNumeric: "tabular-nums" }}>{bn(cnt)}</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 70, color: "#fff" }}>বার, টানা</div>
    </div> : null}
    <div style={{ position: "absolute", left: 80, bottom: 240, fontFamily: SANS, fontSize: 30, color: "rgba(255,255,255,.65)" }}>সূত্র: Henry S. Schurr, Nature, ৭ ডিসেম্বর ১৮৯৯</div>
  </AbsoluteFill>;
};

// theory board over a dark shot: each theory appears, then gets struck out
const Theories: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const items: { t: string; why: string; at: number; x: number; q?: boolean }[] = s.items;
  return <AbsoluteFill style={{ background: "rgba(0,0,0,.0)" }}>
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(3,5,8,.92) 0%, rgba(3,5,8,.75) 45%, rgba(3,5,8,.2) 100%)" }} />
    <div style={{ position: "absolute", left: 140, top: 170, fontFamily: SANS, fontWeight: 600, fontSize: 40, color: GOLD, letterSpacing: 0 }}>তত্ত্ব</div>
    {items.map((it, i) => {
      const a = spring({ frame: f - it.at, fps, config: { damping: 15 } });
      const x = interpolate(f, [it.x, it.x + 12], [0, 1], { ...clamp, easing: ease });
      return <div key={i} style={{ position: "absolute", left: 140, top: 250 + i * 240, opacity: a, transform: `translateX(${(1 - a) * -40}px)` }}>
        <div style={{ position: "relative", display: "inline-block", fontFamily: SERIF, fontWeight: 800, fontSize: 92, color: x > 0.5 && !it.q ? "rgba(255,255,255,.55)" : "#fff" }}>
          {it.t}
          <div style={{ position: "absolute", left: -10, top: "54%", height: 9, width: `${x * 104}%`, background: it.q ? "transparent" : RED, borderRadius: 4 }} />
          {it.q ? <span style={{ color: AMBER, marginLeft: 24, opacity: x }}>?</span> : null}
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: "rgba(255,255,255,.75)", opacity: x, marginTop: 2 }}>{it.why}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// citation card (modern source)
const Cite: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 16 } });
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #12202a, #04080b 75%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 1800, padding: "70px 90px", background: "#f4f1ea", borderRadius: 8, boxShadow: "0 30px 120px rgba(0,0,0,.8)", transform: `translateY(${(1 - a) * 60}px) scale(${interpolate(f, [0, s.len], [1, 1.03])})`, opacity: a }}>
      <div style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: 30, color: "#7a1c1c", letterSpacing: 4 }}>{s.journal}</div>
      <div style={{ fontFamily: '"STIX", serif', fontSize: 74, color: "#111", marginTop: 18, lineHeight: 1.15 }}>{s.title}</div>
      <div style={{ fontFamily: "Montserrat", fontSize: 32, color: "#444", marginTop: 16 }}>{s.by}</div>
      <div style={{ marginTop: 40, fontFamily: '"STIX", serif', fontStyle: "italic", fontSize: 54, color: "#222", position: "relative", display: "inline-block" }}>
        <span style={{ position: "absolute", left: -8, right: -8, top: 8, bottom: 2, background: "rgba(255,190,40,.5)", transformOrigin: "left", transform: `scaleX(${interpolate(f, [26, 44], [0, 1], clamp)})` }} />
        <span style={{ position: "relative" }}>{s.quote}</span>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: "#333", marginTop: 26, opacity: interpolate(f, [40, 52], [0, 1], clamp) }}>{s.tr}</div>
    </div>
  </AbsoluteFill>;
};

// outro: case stamp + next file teaser
const Outro: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const st = spring({ frame: f - s.stampAt, fps, config: { damping: 8, mass: 0.6 } });
  const nx = interpolate(f, [s.nextAt, s.nextAt + 20], [0, 1], clamp);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d1a16, #050404 75%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 1500, height: 860, background: "linear-gradient(180deg,#cdb68a,#b89c6c)", borderRadius: 10, boxShadow: "0 40px 140px rgba(0,0,0,.9)", transform: `rotate(-1.4deg) translateX(${nx * -700}px) scale(${1 - nx * 0.25})`, opacity: 1 - nx * 0.6, position: "relative" }}>
      <div style={{ position: "absolute", left: 90, top: 90, fontFamily: '"STIX", serif', fontSize: 40, color: "#3b2d1a", letterSpacing: 6 }}>CASE FILE · 01</div>
      <div style={{ position: "absolute", left: 90, top: 170, fontFamily: SERIF, fontWeight: 800, fontSize: 150, color: "#22180c" }}>বরিশাল গানস</div>
      <div style={{ position: "absolute", left: 96, top: 390, width: 1200, fontFamily: SANS, fontWeight: 500, fontSize: 38, color: "#3b2d1a", lineHeight: 1.6 }}>নথি: এশিয়াটিক সোসাইটি ১৮৬৭–১৮৭০ · বেভারিজ ১৮৭৬ · নেচার ১৮৯৫–১৮৯৯ · জ্যাক ১৯১৮ · হিল ২০১১</div>
      <div style={{ position: "absolute", left: 560, top: 540, transform: `rotate(-9deg) scale(${interpolate(st, [0, 1], [2.6, 1])})`, opacity: f >= s.stampAt ? 0.95 : 0, border: `10px solid ${RED}`, color: RED, fontFamily: SANS, fontWeight: 800, fontSize: 130, padding: "0 46px", borderRadius: 10, mixBlendMode: "multiply" }}>অমীমাংসিত</div>
    </div>
    {nx > 0 ? <div style={{ position: "absolute", right: 170, top: 420, width: 900, opacity: nx, transform: `translateX(${(1 - nx) * 200}px)` }}>
      <div style={{ fontFamily: '"STIX", serif', fontSize: 36, color: "rgba(255,255,255,.6)", letterSpacing: 6 }}>NEXT FILE · 02</div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 130, color: GOLD, lineHeight: 1.2 }}>ভাওয়াল</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#fff", marginTop: 10 }}>মৃত ঘোষণা ১৯০৯ · সন্ন্যাসীর আবির্ভাব ~১৯২১</div>
    </div> : null}
  </AbsoluteFill>;
};

// end board: every case file with its verdict
const Summary: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const items: { t: string; v: string; at: number; c?: string }[] = s.items;
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d1a16, #050404 75%)" }}>
    <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: '"STIX", serif', fontSize: 40, color: "rgba(255,255,255,.6)", letterSpacing: 8 }}>CASE FILES · EPISODE 01</div>
    {items.map((it, i) => {
      const a = spring({ frame: f - it.at, fps, config: { damping: 15 } });
      const st = spring({ frame: f - it.at - 12, fps, config: { damping: 9, mass: 0.6 } });
      const x = 140 + (i % 2) * 1160, y = 220 + Math.floor(i / 2) * 520;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 1100, height: 460, background: "linear-gradient(180deg,#cdb68a,#b89c6c)", borderRadius: 8, boxShadow: "0 30px 90px rgba(0,0,0,.8)", opacity: a, transform: `translateY(${(1 - a) * 80}px) rotate(${(i % 2 ? 1 : -1) * 1.1}deg)` }}>
        <div style={{ position: "absolute", left: 60, top: 50, fontFamily: '"STIX", serif', fontSize: 30, color: "#3b2d1a", letterSpacing: 5 }}>CASE FILE · 0{i + 1}</div>
        <div style={{ position: "absolute", left: 60, top: 100, fontFamily: SERIF, fontWeight: 800, fontSize: 92, color: "#22180c", whiteSpace: "nowrap" }}>{it.t}</div>
        <div style={{ position: "absolute", right: 60, bottom: 50, transform: `rotate(-9deg) scale(${interpolate(st, [0, 1], [2.4, 1])})`, opacity: f >= it.at + 12 ? 0.95 : 0, border: `7px solid ${it.c ?? RED}`, color: it.c ?? RED, fontFamily: SANS, fontWeight: 800, fontSize: 58, padding: "0 30px", borderRadius: 8, mixBlendMode: "multiply", whiteSpace: "nowrap" }}>{it.v}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// comment prompt overlay
const Ask: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 14 } });
  return <AbsoluteFill>
    <div style={{ position: "absolute", left: 120, top: 200, width: 1250, padding: "38px 46px", background: "rgba(8,10,12,.82)", borderLeft: `8px solid ${AMBER}`, borderRadius: 8, opacity: a, transform: `translateX(${(1 - a) * -60}px)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: AMBER }}>কমেন্টে লিখুন</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: "#fff", lineHeight: 1.4, marginTop: 8 }}>{s.q ?? "আপনার এলাকার বয়স্করা কি দক্ষিণ থেকে আসা গুম গুম শব্দের কথা বলেছেন?"}</div>
    </div>
  </AbsoluteFill>;
};

const Chip: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12, s.len - 12, s.len], [0, 1, 1, 0], clamp);
  const pos: React.CSSProperties = s.pos === "center" ? { left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" } : { left: 90, top: s.top ?? 110 };
  return <div style={{ position: "absolute", ...pos, opacity: o }}>
    <div style={{ fontFamily: SANS, fontWeight: s.w ?? 700, fontSize: s.size ?? 46, color: s.color ?? "#fff", background: s.bgc ?? "rgba(0,0,0,.55)", padding: "12px 28px", borderRadius: 8, borderLeft: s.bar ? `6px solid ${s.bar}` : undefined, textShadow: "0 2px 10px #000", transform: `translateY(${(1 - o) * 10}px)` }}>{s.t}</div>
  </div>;
};
const DateCard: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 16 } });
  const o = interpolate(f, [s.len - 10, s.len], [1, 0], clamp);
  return <div style={{ position: "absolute", left: 120, bottom: 300, opacity: a * o }}>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 110, color: "#fff", textShadow: "0 4px 30px rgba(0,0,0,.9)", transform: `translateX(${(1 - a) * -40}px)`, lineHeight: 1.15 }}>{s.t}</div>
    <div style={{ width: interpolate(a, [0, 1], [0, 520]), height: 4, background: RED, margin: "10px 0 12px" }} />
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: "rgba(255,255,255,.85)", textShadow: "0 2px 12px #000" }}>{s.sub}</div>
  </div>;
};

// flash / dip transitions as overlays
const Flash: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: s.c ?? "#fff", opacity: interpolate(f, [0, 2, s.len], [0, s.o ?? 0.7, 0], clamp), mixBlendMode: s.c === "#000" ? "normal" : "screen" }} />;
};
const Fade: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: s.dir === "in" ? interpolate(f, [0, s.len], [1, 0], clamp) : interpolate(f, [0, s.len], [0, 1], clamp) }} />;
};

// warm light leak sweeping across a cut
const Leak: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const p = f / s.len;
  const o = interpolate(p, [0, 0.35, 1], [0, 0.55, 0], clamp);
  const x = interpolate(p, [0, 1], [-20, 120]);
  return <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o, background: `radial-gradient(ellipse 45% 80% at ${x}% 40%, rgba(255,170,80,.9), rgba(255,90,40,.35) 40%, rgba(0,0,0,0) 70%)` }} />;
};
// lens dust: a few soft specks that drift, changing every ~2 s
const Dust: React.FC = () => {
  const f = useCurrentFrame(); const seg = Math.floor(f / 60);
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
    {Array.from({ length: 7 }).map((_, i) => {
      const r = (n: string) => random(`${seg}-${i}-${n}`);
      const a = interpolate(f % 60, [0, 10, 50, 60], [0, 1, 1, 0]) * (0.06 + r("o") * 0.08);
      const sz = 3 + r("s") * 9;
      return <div key={i} style={{ position: "absolute", left: `${r("x") * 100}%`, top: `${r("y") * 100 + (f % 60) * 0.02}%`, width: sz, height: sz, borderRadius: "50%", background: "#fff", opacity: a, filter: `blur(${1 + r("b") * 2}px)` }} />;
    })}
  </AbsoluteFill>;
};

// burned-in subtitles with the spoken word highlighted
const Subs: React.FC<{ caps: Cap[] }> = ({ caps }) => {
  const f = useCurrentFrame();
  const c = caps.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const a = interpolate(f, [c.from, c.from + 4], [0, 1], clamp);
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 92, display: "flex", justifyContent: "center", opacity: a }}>
    <div style={{ maxWidth: 2150, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 70, lineHeight: 1.35, background: "rgba(6,8,10,.62)", padding: "6px 34px 10px", borderRadius: 10, boxShadow: "0 0 40px 18px rgba(6,8,10,.35)", textShadow: "0 3px 14px rgba(0,0,0,.95), 0 0 4px rgba(0,0,0,.9)" }}>
      {c.words.map((w, i) => {
        const on = f >= w.s; const cur = f >= w.s && f < w.e + 2;
        return <span key={i} style={{ color: cur ? AMBER : on ? "#fff" : "rgba(255,255,255,.62)", display: "inline-block", transform: `translateY(${cur ? -3 : 0}px)` }}>{w.w}{i < c.words.length - 1 ? " " : ""}</span>;
      })}
    </div>
  </div>;
};

const SHOTS: Record<string, React.FC<{ s: Shot; booms: number[] }>> = {
  px: Px, geo: ({ s }) => <Geo s={s} />, doc: ({ s }) => <Doc s={s} />, kin: ({ s }) => <Kin s={s} />, title: ({ s }) => <Title s={s} />,
  chapter: ({ s }) => <Chapter s={s} />, reach: ({ s }) => <Reach s={s} />, triplets: ({ s }) => <Triplets s={s} />, theories: ({ s }) => <Theories s={s} />,
  cite: ({ s }) => <Cite s={s} />, summary: ({ s }) => <Summary s={s} />, outro: ({ s }) => <Outro s={s} />, ask: ({ s }) => <Ask s={s} />, chip: ({ s }) => <Chip s={s} />, date: ({ s }) => <DateCard s={s} />,
  flash: ({ s }) => <Flash s={s} />, leak: ({ s }) => <Leak s={s} />, fade: ({ s }) => <Fade s={s} />, black: () => <AbsoluteFill style={{ background: "#000" }} />,
};

const XFade: React.FC<{ s: Shot; children: React.ReactNode }> = ({ s, children }) => {
  const f = useCurrentFrame();
  const o = s.xin ? interpolate(f, [0, s.xin], [0, 1], clamp) : 1;
  const oo = s.xout ? interpolate(f, [s.len - s.xout, s.len], [1, 0], clamp) : 1;
  return <AbsoluteFill style={{ opacity: o * oo }}>{children}</AbsoluteFill>;
};

export const Ep1: React.FC<{ tl: Timeline }> = ({ tl }) => {
  const f = useCurrentFrame();
  const voOn = (fr: number) => tl.vo.some((v) => fr >= v.from - 6 && fr <= v.to + 4);
  return <AbsoluteFill style={{ background: "#000" }}>
    {tl.shots.map((s, i) => <Sequence key={i} from={s.from} durationInFrames={s.len} layout="none">
      <XFade s={s}>{React.createElement(SHOTS[s.k], { s, booms: tl.booms })}</XFade>
    </Sequence>)}
    <Tint />
    <Vignette />
    {tl.overlays.map((s, i) => <Sequence key={`o${i}`} from={s.from} durationInFrames={s.len} layout="none">{React.createElement(SHOTS[s.k], { s, booms: tl.booms })}</Sequence>)}
    <Subs caps={tl.caps} />
    <Dust />
    <Grain />
    {tl.audio.map((a, i) => <Sequence key={`a${i}`} from={a.from} durationInFrames={a.len ?? tl.total - a.from} layout="none">
      <Audio src={S(a.src)} startFrom={a.start ?? 0} volume={(fr) => {
        const len = a.len ?? tl.total - a.from;
        let v = a.vol * interpolate(fr, [0, a.fi ?? 1], [0, 1], clamp) * interpolate(fr, [len - (a.fo ?? 1), len], [1, 0], clamp);
        if (a.duck) { // smooth duck under the narrator (~-12 dB)
          let d = 0; for (let k = -8; k <= 8; k += 4) d += voOn(a.from + fr + k) ? 1 : 0;
          v *= interpolate(d / 5, [0, 1], [1, 0.26]);
        }
        return v;
      }} />
    </Sequence>)}
  </AbsoluteFill>;
};
