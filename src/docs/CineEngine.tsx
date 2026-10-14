// "Cine" look for DocEngine films with `style: "cine"` — a classy feature-documentary style:
// 2.39:1 letterbox, long crossfades, slow drift, warm grade + grain, serif Bangla subtitles with no boxes,
// no chapter cards / news bugs. Credits and the AI label sit quietly inside the letterbox bars (still always shown).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";

// brand fonts, loaded before the first frame renders
if (typeof document !== "undefined") {
  const h = delayRender("cine fonts");
  Promise.all([["Galada", "Galada-Regular.ttf"], ["Anek Bangla", "AnekBangla.ttf"], ["Tiro Bangla", "TiroBangla-Regular.ttf"]].map(([n, file]) => {
    const ff = new FontFace(n, `url(${staticFile("fonts/" + file)})`);
    return ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  })).then(() => continueRender(h));
}
import { FxLayer, type Fx } from "./fx";

type AnyShot = { k: string; [x: string]: any };
export type CineShot = { s: AnyShot; from: number; len: number };
const SERIF = '"Tiro Bangla", "Noto Serif Bengali", "Hind Siliguri", serif';
const DISPLAY = '"Galada", "Tiro Bangla", serif';
const SANS = '"Anek Bangla", "Hind Siliguri", sans-serif';
const RED = "#d1102c";
const goldText: React.CSSProperties = { background: "linear-gradient(180deg, #fff3d6 0%, #e9c77d 45%, #b8862f 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
const Ornament: React.FC<{ w?: number; o?: number }> = ({ w = 360, o = 1 }) => (
  <svg width={w} height={22} viewBox="0 0 360 22" style={{ opacity: o, display: "block", margin: "0 auto" }}>
    <line x1="0" y1="11" x2="150" y2="11" stroke="#d8b46a" strokeWidth="1.5" />
    <rect x="171" y="2" width="13" height="13" transform="rotate(45 177.5 8.5)" fill="#d1102c" />
    <circle cx="158" cy="11" r="2.5" fill="#d8b46a" /><circle cx="202" cy="11" r="2.5" fill="#d8b46a" />
    <line x1="210" y1="11" x2="360" y2="11" stroke="#d8b46a" strokeWidth="1.5" />
  </svg>
);
const CREAM = "#f3e8d4", GOLD = "#d8b46a", BAR = 118, XF = 22;
const ease = (t: number) => t * t * (3 - 2 * t);

const Drift: React.FC<{ kb?: string; len: number; children: React.ReactNode }> = ({ kb, len, children }) => {
  const f = useCurrentFrame();
  const p = ease(Math.min(1, Math.max(0, f / Math.max(1, len + XF))));
  const z = kb === "out" ? 1.16 - 0.1 * p : 1.04 + 0.1 * p;
  const x = kb === "left" ? 2.5 - 5 * p : kb === "right" ? -2.5 + 5 * p : 0;
  const y = kb === "up" ? 2 - 4 * p : 0;
  return <AbsoluteFill style={{ transform: `scale(${z}) translate(${x}%, ${y}%)` }}>{children}</AbsoluteFill>;
};

const Subtitle: React.FC<{ text?: string; len: number; delay?: number }> = ({ text, len, delay = 0 }) => {
  const f = useCurrentFrame();
  if (!text || delay > len - 40) return null;
  const o = interpolate(f, [14 + delay, 34 + delay, len - 6, len + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: BAR + 46, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
        <span style={{ width: 6, height: 44, background: RED, borderRadius: 2, boxShadow: "0 0 12px rgba(209,16,44,.6)" }} />
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#fff", textShadow: "0 2px 18px rgba(0,0,0,.9), 0 0 3px rgba(0,0,0,.9)", lineHeight: 1.3 }}>{text}</span>
      </span>
    </div>
  );
};

const Picture: React.FC<{ s: AnyShot; len: number; delay?: number }> = ({ s, len, delay }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Drift kb={s.kb} len={len}>
      {s.k === "clip" ? (
        <OffthreadVideo src={staticFile(s.video)} muted playbackRate={s.rate ?? 1} startFrom={Math.round((s.start ?? 0) * 30)}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: s.zoom ? `scale(${s.zoom})` : undefined }} />
      ) : (
        <Img src={staticFile(s.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "center" }} />
      )}
    </Drift>
    <FxLayer fx={s.fx as Fx | undefined} />
    <Subtitle text={s.cap} len={len} delay={delay} />
  </AbsoluteFill>
);

const TitleWords: React.FC<{ text: string; hl?: string; size: number; delay?: number; font?: string }> = ({ text, hl, size, delay = 0, font = DISPLAY }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: font, fontSize: size, lineHeight: 1.35, textAlign: "center", maxWidth: 1560, padding: "0 40px" }}>
      {text.split(" ").map((w, i) => {
        const o = interpolate(f, [delay + i * 5, delay + i * 5 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const isHl = hl && w.includes(hl);
        return <span key={i} style={{ opacity: o, display: "inline-block", marginRight: "0.26em", transform: `translateY(${(1 - o) * 16}px)`, ...(isHl ? goldText : { color: CREAM }), textShadow: isHl ? undefined : "0 4px 30px rgba(0,0,0,.6)" }}>{w}</span>;
      })}
    </div>
  );
};

const Dark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #2a1210 0%, #120807 45%, #050303 80%)", alignItems: "center", justifyContent: "center" }}>
    <FxLayer fx="embers" />
    {children}
  </AbsoluteFill>
);

const Words: React.FC<{ s: AnyShot }> = ({ s }) => {
  const f = useCurrentFrame();
  const so = interpolate(f, [28, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (s.k === "quote") return (
    <Dark>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 170, color: RED, lineHeight: 0.5, marginBottom: 26, opacity: 0.9 }}>“</div>
      <TitleWords text={s.text} size={74} />
      <div style={{ marginTop: 30, opacity: so }}><Ornament w={300} /></div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 32, color: GOLD, marginTop: 18, opacity: so }}>{s.by}</div>
    </Dark>
  );
  return (
    <Dark>
      <TitleWords text={s.text} hl={s.hl} size={96} />
      <div style={{ marginTop: 26, opacity: so }}><Ornament /></div>
      {s.sub && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 38, color: "rgba(243,232,212,.8)", marginTop: 22, opacity: so }}>{s.sub}</div>}
    </Dark>
  );
};

const Timeline: React.FC<{ s: AnyShot }> = ({ s }) => {
  const f = useCurrentFrame();
  const items = s.items as [string, string][];
  const line = interpolate(f, [6, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Dark>
      {s.title && <div style={{ fontFamily: DISPLAY, fontSize: 70, marginBottom: 70, ...goldText }}>{s.title}</div>}
      <div style={{ position: "relative", width: 1500 }}>
        <div style={{ position: "absolute", top: 98, left: 0, height: 2, width: `${line * 100}%`, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {items.map(([a, b], i) => {
            const o = interpolate(f, [20 + i * 22, 44 + i * 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ width: 440, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, height: 80, ...goldText }}>{a}</div>
                <div style={{ width: 16, height: 16, transform: "rotate(45deg)", background: RED, margin: "6px auto 30px", boxShadow: "0 0 16px rgba(209,16,44,.8)" }} />
                <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 36, color: CREAM, lineHeight: 1.4 }}>{b}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Dark>
  );
};

const Close: React.FC<{ s: AnyShot }> = ({ s }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [36, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lg = interpolate(f, [60, 95], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Dark>
      <TitleWords text={s.text} size={78} />
      <div style={{ marginTop: 40, opacity: o, textAlign: "center" }}>
        <Ornament />
        <Img src={staticFile("cob/logo-round.png")} style={{ width: 230, height: 230, marginTop: 30, transform: `scale(${lg})` }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: CREAM, marginTop: 22 }}>{s.cta}</div>
      </div>
    </Dark>
  );
};

const ShotView: React.FC<{ s: AnyShot; len: number; delay?: number }> = ({ s, len, delay }) => {
  if (s.k === "photo" || s.k === "ai" || s.k === "clip") return <Picture s={s} len={len} delay={delay} />;
  if (s.k === "timeline") return <Timeline s={s} />;
  if (s.k === "close") return <Close s={s} />;
  return <Words s={s} />;
};

const Cross: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, XF, len, len + XF], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

const Bars: React.FC<{ cur?: AnyShot; total: number }> = ({ cur, total }) => {
  const f = useCurrentFrame();
  const credit = cur && (cur.k === "ai" ? "" : cur.credit);
  const isAi = cur && (cur.k === "ai" || (cur.k === "clip" && String(cur.credit).includes("AI")));
  const o = interpolate(f, [100, 130, total - 40, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const small: React.CSSProperties = { position: "absolute", fontFamily: SANS, fontSize: 20, color: "rgba(243,232,212,.6)" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: BAR, background: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: BAR, background: "#000" }} />
      <Img src={staticFile("cob/logo-light.png")} style={{ position: "absolute", top: 34, left: 56, height: 50, opacity: 0.92 * o }} />
      {isAi && f > 100 && <div style={{ ...small, top: 44, right: 60, color: "rgba(216,180,106,.85)" }}>প্রতীকী দৃশ্য · এআই দিয়ে তৈরি</div>}
      {credit && !isAi && f > 100 && <div style={{ ...small, bottom: 46, right: 60 }}>{credit}</div>}
    </AbsoluteFill>
  );
};

// brand sting (0-95) then the film title in Galada gold (96-250)
const Opening: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => {
  const f = useCurrentFrame();
  const black = interpolate(f, [70, 105], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lo = interpolate(f, [6, 26, 70, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ls = interpolate(f, [6, 92], [0.92, 1.04]);
  const sweep = interpolate(f, [20, 60], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const to = interpolate(f, [96, 130, 215, 250], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: black }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: lo }}>
        <div style={{ position: "relative", transform: `scale(${ls})`, overflow: "hidden" }}>
          <Img src={staticFile("cob/logo-light.png")} style={{ width: 760, display: "block" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "18%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)", transform: "skewX(-20deg)" }} />
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,.75)", marginTop: 26 }}>পরিবেশিত</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: to, background: `radial-gradient(ellipse at center, rgba(0,0,0,${0.45 * to}) 0%, rgba(0,0,0,${0.2 * to}) 70%)` }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 230, lineHeight: 1.1, ...goldText, transform: `scale(${1.05 - 0.05 * Math.max(0, (f - 96) / 154)})` }}>{title}</div>
        <div style={{ marginTop: 6 }}><Ornament w={420} /></div>
        {sub && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#fff", marginTop: 16, textShadow: "0 2px 20px rgba(0,0,0,.9)" }}>{sub}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Cine: React.FC<{ film: { id: string; title: string; sub?: string; music?: string; musicVol?: number; paras: unknown[] }; shots: CineShot[]; starts: number[]; total: number }> = ({ film, shots, starts, total }) => {
  const f = useCurrentFrame();
  const cur = shots.find((x) => f >= x.from && f < x.from + x.len)?.s;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {shots.filter((x) => x.s.k !== "chapter").map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.from - XF)} durationInFrames={x.len + XF * 2}>
          <Cross len={x.len}><ShotView s={x.s} len={x.len} delay={Math.max(0, 255 - x.from)} /></Cross>
        </Sequence>
      ))}
      {/* warm grade + vignette + grain */}
      <AbsoluteFill style={{ pointerEvents: "none", background: "linear-gradient(180deg, rgba(255,170,90,.05), rgba(40,20,0,.08))" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.55))" }} />
      <Img src={staticFile(`cob/grain${Math.floor(f / 2) % 4}.png`)} style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.05, pointerEvents: "none" }} />
      <Sequence from={0} durationInFrames={255}><Opening title={film.title} sub={film.sub} /></Sequence>
      <Bars cur={cur} total={total} />
      {film.paras.map((_, i) => (
        <Sequence key={"a" + i} from={starts[i] + 4}><Audio src={staticFile(`docs/${film.id}/vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
      ))}
      <Audio src={staticFile(film.music ?? "gambmusic.mp3")} loop volume={(fr) => (film.musicVol ?? 0.14) * interpolate(fr, [0, 20, total - 90, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
