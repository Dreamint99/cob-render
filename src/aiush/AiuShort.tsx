// AI University — YouTube Shorts (1080x1920) cut from lesson videos + feature images (1280x720).
// Own entry (src/aiush/index.ts) so src/Root.tsx stays untouched. Batch: node work/aiu-yt/render_batch.mjs
// Props come from work/aiu-yt/make_shorts.py / thumbs.py (clip + exact captions from the lesson spec).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender } from "remotion";

const NAVY = "#011835", BLUE = "#0050ed", GOLD = "#FFD23F";
const BN = "Anek", EN = "Montserrat";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

if (typeof document !== "undefined") {
  const h = delayRender("fonts");
  Promise.all([["Anek", "fonts/AnekBangla.ttf"], ["Montserrat", "fonts/Montserrat.ttf"]].map(([n, u]) => {
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    return f.load().then(() => document.fonts.add(f));
  })).catch(() => {}).finally(() => continueRender(h));
}

export type Cap = { t: string; from: number; to: number };
export type ShortProps = { clip: string; dur: number; hook: string; title: string; chip: string; accent: string; caps: Cap[] };
export type ThumbProps = { frame: string; badge: string; title: string; course: string; chip: string; accent: string };

const Glow: React.FC<{ x: number; y: number; r: number; c: string; o?: number }> = ({ x, y, r, c, o = 0.55 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${c} 0%, transparent 68%)`, opacity: o }} />
);

const Backdrop: React.FC<{ accent: string; f?: number }> = ({ accent, f = 0 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(170deg, ${NAVY} 0%, #03204d 55%, ${NAVY} 100%)`, overflow: "hidden" }}>
    <Glow x={900 + Math.sin(f / 70) * 60} y={380} r={520} c={BLUE} o={0.5} />
    <Glow x={150 + Math.cos(f / 80) * 50} y={1500} r={560} c={accent} o={0.22} />
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.09) 2px, transparent 2px)", backgroundSize: "44px 44px" }} />
  </AbsoluteFill>
);

/* ---------------- Short ---------------- */
export const AiuShort: React.FC<ShortProps> = ({ clip, dur, hook, title, chip, accent, caps }) => {
  const f = useCurrentFrame(), { fps, durationInFrames: N } = useVideoConfig();
  const t = f / fps;
  const inA = spring({ frame: f, fps, config: { damping: 18, mass: 0.7 } });
  const inB = spring({ frame: f - 6, fps, config: { damping: 18, mass: 0.7 } });
  const card = spring({ frame: f - 3, fps, config: { damping: 20 } });
  const endAt = N - 75, end = interpolate(f, [endAt, endAt + 14], [0, 1], { ...clamp, easing: ease });
  const cap = caps.find((c) => t >= c.from && t < c.to + 0.15);
  const words = cap ? cap.t.split(/\s+/) : [];
  const done = cap ? Math.floor(words.length * Math.min(1, (t - cap.from) / Math.max(0.3, cap.to - cap.from)) + 0.6) : 0;
  return (
    <AbsoluteFill style={{ fontFamily: BN }}>
      <Backdrop accent={accent} f={f} />
      {/* brand + chip */}
      <Img src={staticFile("brand/logo-dark.png")} style={{ position: "absolute", top: 104, left: "50%", height: 86, transform: `translateX(-50%) scale(${0.9 + 0.1 * inA})`, opacity: inA }} />
      <div style={{ position: "absolute", top: 212, width: "100%", textAlign: "center", opacity: inA }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,.1)", border: `2px solid ${accent}`, color: "#fff", fontSize: 34, fontWeight: 600, padding: "8px 26px 4px", borderRadius: 50 }}>
          <span style={{ color: accent }}>●</span> এআই প্রশিক্ষক · {chip}
        </span>
      </div>
      {/* hook */}
      <div style={{ position: "absolute", top: 300, left: 70, right: 70, textAlign: "center" }}>
        <div style={{ fontSize: 58, fontWeight: 700, color: "#cfe0ff", opacity: inA, transform: `translateY(${(1 - inA) * 30}px)` }}>{hook}</div>
        <div style={{ fontSize: title.length > 26 ? 76 : 88, fontWeight: 800, lineHeight: 1.15, color: GOLD, marginTop: 8, opacity: inB, transform: `translateY(${(1 - inB) * 40}px)`, textShadow: "0 6px 30px rgba(0,0,0,.45)" }}>{title}</div>
      </div>
      {/* video card */}
      <div style={{ position: "absolute", top: 640, left: 40, width: 1000, height: 562, borderRadius: 34, overflow: "hidden", border: "4px solid rgba(255,255,255,.18)",
        boxShadow: `0 40px 90px rgba(0,0,0,.55), 0 0 0 10px ${accent}22`, transform: `translateY(${(1 - card) * 80}px) scale(${0.94 + 0.06 * card})`, opacity: card, background: "#fff" }}>
        <OffthreadVideo src={staticFile(clip)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.03 * (f / N)})` }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / N) * 100}%`, background: accent }} />
      </div>
      {/* captions: word-by-word highlight */}
      <div style={{ position: "absolute", top: 1250, left: 60, right: 60, height: 190, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        {cap && (
          <div style={{ textAlign: "center", fontSize: words.join(" ").length > 40 ? 54 : 62, fontWeight: 700, lineHeight: 1.32, color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,.6)" }}>
            {words.map((w, i) => (
              <span key={i} style={{ color: i < done ? GOLD : "#fff", marginRight: 14, display: "inline-block" }}>{w}</span>
            ))}
          </div>
        )}
      </div>
      {/* CTA strip */}
      <div style={{ position: "absolute", top: 1440, width: "100%", textAlign: "center", opacity: 1 - end }}>
        <span style={{ display: "inline-block", background: BLUE, color: "#fff", fontSize: 38, fontWeight: 700, padding: "12px 34px 8px", borderRadius: 60, boxShadow: `0 10px 40px ${BLUE}88` }}>
          ▶ পুরো কোর্স: <span style={{ fontFamily: EN, fontWeight: 700 }}>aiuniversitybd.com</span>
        </span>
      </div>
      {/* end card */}
      {end > 0 && (
        <AbsoluteFill style={{ opacity: end }}>
          <Backdrop accent={accent} f={f} />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, transform: `scale(${0.9 + 0.1 * end})` }}>
            <Img src={staticFile("brand/logo-dark.png")} style={{ height: 170 }} />
            <div style={{ fontSize: 86, fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: 1.2 }}>পুরো কোর্সটি<br /><span style={{ color: GOLD }}>ফ্রিতে শুরু করুন</span></div>
            <div style={{ background: "#fff", color: NAVY, fontFamily: EN, fontWeight: 800, fontSize: 58, padding: "18px 44px", borderRadius: 24 }}>aiuniversitybd.com</div>
            <div style={{ fontSize: 40, color: "#cfe0ff", fontWeight: 600 }}>লিংক ডেসক্রিপশনে 👇</div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- Fast path: designed frame as stills, video + karaoke captions laid on by ffmpeg ----------------
   layer "base" = everything behind the video; "mask" = same picture with a transparent rounded hole + card border,
   laid OVER the video so the corners are round. Card geometry must match make_shorts.py CARD. */
export const CARD = { x: 40, y: 620, w: 1000, h: 600, r: 34 };
export type FrameProps = { layer: "base" | "mask"; hook: string; title: string; chip: string; accent: string };
export const AiuFrame: React.FC<FrameProps> = ({ layer, hook, title, chip, accent }) => {
  const C = CARD;
  const scene = (
    <AbsoluteFill style={{ fontFamily: BN }}>
      <Backdrop accent={accent} />
      <Img src={staticFile("brand/logo-dark.png")} style={{ position: "absolute", top: 100, left: "50%", height: 84, transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", top: 204, width: "100%", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,.1)", border: `2px solid ${accent}`, color: "#fff", fontSize: 34, fontWeight: 600, padding: "8px 26px 4px", borderRadius: 50 }}>
          <span style={{ color: accent }}>●</span> এআই প্রশিক্ষক · {chip}
        </span>
      </div>
      <div style={{ position: "absolute", top: 290, left: 60, right: 60, height: 290, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#cfe0ff" }}>{hook}</div>
        <div style={{ fontSize: title.length > 30 ? 70 : title.length > 20 ? 80 : 92, fontWeight: 800, lineHeight: 1.12, color: GOLD, marginTop: 6, textShadow: "0 6px 30px rgba(0,0,0,.45)" }}>{title}</div>
      </div>
      <div style={{ position: "absolute", top: 1500, width: "100%", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: BLUE, color: "#fff", fontSize: 38, fontWeight: 700, padding: "12px 34px 8px", borderRadius: 60, boxShadow: `0 10px 40px ${BLUE}88` }}>
          ▶ পুরো কোর্স: <span style={{ fontFamily: EN, fontWeight: 700 }}>aiuniversitybd.com</span>
        </span>
      </div>
    </AbsoluteFill>
  );
  if (layer === "base")
    return <AbsoluteFill>{scene}<div style={{ position: "absolute", left: C.x, top: C.y, width: C.w, height: C.h, borderRadius: C.r, boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 0 12px ${accent}33` }} /></AbsoluteFill>;
  // mask: scene with a hole (CSS mask), plus the card border on top
  const hole = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1920'><path fill-rule='evenodd' fill='black' d='M0 0H1080V1920H0Z M${C.x + C.r} ${C.y}H${C.x + C.w - C.r}A${C.r} ${C.r} 0 0 1 ${C.x + C.w} ${C.y + C.r}V${C.y + C.h - C.r}A${C.r} ${C.r} 0 0 1 ${C.x + C.w - C.r} ${C.y + C.h}H${C.x + C.r}A${C.r} ${C.r} 0 0 1 ${C.x} ${C.y + C.h - C.r}V${C.y + C.r}A${C.r} ${C.r} 0 0 1 ${C.x + C.r} ${C.y}Z'/></svg>")`;
  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <AbsoluteFill style={{ WebkitMaskImage: hole, maskImage: hole }}>{scene}</AbsoluteFill>
      <div style={{ position: "absolute", left: C.x, top: C.y, width: C.w, height: C.h, borderRadius: C.r, border: "4px solid rgba(255,255,255,.22)", boxSizing: "border-box" }} />
    </AbsoluteFill>
  );
};

/* end card (2.5 s, rendered once as a video with alpha-free navy background) */
export const AiuEnd: React.FC = () => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 16 } }), b = spring({ frame: f - 8, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ fontFamily: BN }}>
      <Backdrop accent={BLUE} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <Img src={staticFile("brand/logo-dark.png")} style={{ height: 170, transform: `scale(${0.6 + 0.4 * a})`, opacity: a }} />
        <div style={{ fontSize: 86, fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: 1.2, opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>পুরো কোর্সটি<br /><span style={{ color: GOLD }}>ফ্রিতে শুরু করুন</span></div>
        <div style={{ background: "#fff", color: NAVY, fontFamily: EN, fontWeight: 800, fontSize: 58, padding: "18px 44px", borderRadius: 24, transform: `scale(${0.8 + 0.2 * b})`, opacity: b }}>aiuniversitybd.com</div>
        <div style={{ fontSize: 40, color: "#cfe0ff", fontWeight: 600, opacity: b }}>লিংক ডেসক্রিপশনে 👇</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Feature image / thumbnail ---------------- */
export const AiuThumb: React.FC<ThumbProps> = ({ frame, badge, title, course, chip, accent }) => {
  const ws = title.split(/\s+/);
  const last = ws.length > 1 ? ws.pop() : "";
  const len = title.length;
  const size = len <= 12 ? 104 : len <= 20 ? 90 : len <= 30 ? 76 : 64;
  return (
    <AbsoluteFill style={{ fontFamily: BN }}>
      <AbsoluteFill style={{ background: `linear-gradient(120deg, ${NAVY} 0%, #032a66 70%, ${BLUE} 130%)`, overflow: "hidden" }}>
        <Glow x={1050} y={330} r={480} c={accent} o={0.45} />
        <Glow x={250} y={650} r={380} c={BLUE} o={0.35} />
        <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.08) 2px, transparent 2px)", backgroundSize: "36px 36px" }} />
      </AbsoluteFill>
      {/* tilted video card */}
      <div style={{ position: "absolute", right: -40, top: 150, width: 640, height: 360, borderRadius: 26, overflow: "hidden", transform: "rotate(-5deg)",
        border: "7px solid #fff", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <Img src={staticFile(frame)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", right: 36, top: 34, background: "rgba(1,24,53,.85)", border: "2px solid rgba(255,255,255,.35)", color: "#fff", fontSize: 26, fontWeight: 600, padding: "6px 18px 2px", borderRadius: 30 }}>এআই প্রশিক্ষক</div>
      <Img src={staticFile("brand/logo-dark.png")} style={{ position: "absolute", left: 56, top: 38, height: 78 }} />
      <div style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 560, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
        <div><span style={{ background: accent, color: NAVY, fontSize: 32, fontWeight: 800, padding: "6px 20px 0", borderRadius: 10 }}>{badge}</span></div>
        <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.32, color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,.5)" }}>
          {ws.join(" ")}{" "}{last && <span style={{ color: GOLD }}>{last}</span>}
        </div>
        <div><span style={{ background: BLUE, color: "#fff", fontSize: 30, fontWeight: 800, padding: "8px 24px 2px", borderRadius: 40, boxShadow: `0 8px 30px ${BLUE}aa` }}>{chip}</span></div>
      </div>
    </AbsoluteFill>
  );
};

/* channel banner 2560x1440 — everything important inside the 1546x423 centre safe area */
export const AiuBanner: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: BN }}>
    <AbsoluteFill style={{ background: `linear-gradient(115deg, ${NAVY} 0%, #032a66 60%, ${BLUE} 120%)`, overflow: "hidden" }}>
      <Glow x={1900} y={500} r={900} c={BLUE} o={0.55} />
      <Glow x={500} y={1000} r={700} c="#22c55e" o={0.18} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.08) 3px, transparent 3px)", backgroundSize: "60px 60px" }} />
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 507, top: 508, width: 1546, height: 423, display: "flex", alignItems: "center", gap: 70 }}>
      <Img src={staticFile("brand/logo-dark.png")} style={{ height: 250 }} />
      <div style={{ borderLeft: "4px solid rgba(255,255,255,.25)", paddingLeft: 60 }}>
        <div style={{ fontSize: 76, fontWeight: 800, color: "#fff", lineHeight: 1.15, whiteSpace: "nowrap" }}>বাংলায় শিখুন, <span style={{ color: GOLD }}>ধাপে ধাপে</span></div>
        <div style={{ fontSize: 37, fontWeight: 600, color: "#cfe0ff", marginTop: 14, whiteSpace: "nowrap" }}>কম্পিউটার · IELTS · এয়ার টিকেটিং · স্পোকেন ইংলিশ · কিডস</div>
        <div style={{ display: "inline-block", marginTop: 26, background: "#fff", color: NAVY, fontFamily: EN, fontWeight: 800, fontSize: 46, padding: "10px 34px", borderRadius: 18 }}>aiuniversitybd.com</div>
      </div>
    </div>
  </AbsoluteFill>
);
