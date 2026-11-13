// Qount brand film (turf owner) — ROUGH CUT of 0–12 s (2026-11-13). Assets in work/qroot/film (local public dir work/qroot).
// Night counter = free Cloudflare AI stills (placeholders until owner footage / licensed clips), ledger = HTML, slot grid = real rebranded app screen.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, continueRender, delayRender, Easing } from "remotion";
import { F, sp } from "../Qd";

const S = (p: string) => staticFile("film/" + p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const INK = "#1F1A12", TUR = "#F2B300", PEN = "#23306E", RED = "#B4261C";
const HAND = "QGalada, 'Galada', cursive";
if (typeof document !== "undefined") {
  const h = delayRender("galada");
  const ff = new FontFace("QGalada", `url(${staticFile("fonts/Galada-Regular.ttf")})`);
  ff.load().then(() => { document.fonts.add(ff); continueRender(h); }).catch(() => continueRender(h));
}

// timing (frames @30)
const T = { phone: 24, owner: 48, ledger: 123, cut: 168, tap: 228, end: 360 };
const CALLER = 46, OWNER = 128, NARR = 186;

const Still: React.FC<{ src: string; from: number; to: number; z0?: number; z1?: number; ox?: string; shake?: boolean }> = ({ src, from, to, z0 = 1.04, z1 = 1.12, ox = "50% 50%", shake }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [from, to], [z0, z1], clamp);
  const sx = shake && f % 16 < 10 ? Math.sin(f * 2.3) * 2.2 : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img src={S(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${sx}px) scale(${z})`, transformOrigin: ox, filter: "saturate(0.9) contrast(1.05)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* handwritten ledger page; the "৮:০০" row is the match-cut anchor */
const ROWS: [string, string, "ok" | "cut" | "ask" | "note"][] = [
  ["৬:০০", "রাকিব ভাই", "ok"], ["৭:০০", "সজীব — মিরপুর এফসি", "cut"], ["৮:০০", "?", "ask"], ["৯:০০", "অফিস টিম (অগ্রিম ২০০)", "note"], ["১০:০০", "শাহিন — ফোন দিবে", "cut"],
];
const ANCHOR = { x: 330, y: 600 }; // where "৮:০০" sits on screen
const Ledger: React.FC = () => {
  const f = useCurrentFrame();
  const flip = interpolate(f, [0, 12], [-70, 0], { ...clamp, easing: ease });
  const zoom = interpolate(f, [T.cut - T.ledger - 14, T.cut - T.ledger], [1, 2.6], { ...clamp, easing: Easing.in(Easing.cubic) });
  const circle = interpolate(f, [26, 44], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#1a140c", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) rotate(${-1.5 + f * 0.01}deg)`, transformOrigin: `${ANCHOR.x}px ${ANCHOR.y}px` }}>
        <div style={{ position: "absolute", left: 160, top: 70, width: 1600, height: 1000, background: "#F1E6CB", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,.6)",
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0 107px, rgba(60,90,170,.28) 107px 109px)", transform: `perspective(1600px) rotateY(${flip}deg)`, transformOrigin: "0 50%" }}>
          <div style={{ position: "absolute", left: 210, top: 0, bottom: 0, width: 3, background: "rgba(180,38,28,.45)" }} />
          <div style={{ position: "absolute", left: 250, top: 40, fontFamily: HAND, fontSize: 64, color: PEN }}>শুক্রবার — ১৩ নভেম্বর</div>
          {ROWS.map(([t, who, k], i) => {
            const y = 160 + i * 150;
            const strike = interpolate(f, [8 + i * 3, 18 + i * 3], [0, 1], clamp);
            return (
              <div key={i} style={{ position: "absolute", left: 60, top: y, width: 1500, height: 120, fontFamily: HAND, color: PEN }}>
                <span style={{ position: "absolute", left: 0, fontSize: 86 }}>{t}</span>
                <span style={{ position: "absolute", left: 260, fontSize: 70, top: 10 }}>{who}</span>
                {k === "cut" && <div style={{ position: "absolute", left: 250, top: 62, height: 7, width: 700 * strike, background: RED, borderRadius: 4, transform: "rotate(-2deg)" }} />}
                {k === "ask" && (
                  <svg style={{ position: "absolute", left: -40, top: -30 }} width={330} height={190}>
                    <ellipse cx={165} cy={95} rx={150} ry={78} fill="none" stroke={RED} strokeWidth={6} strokeDasharray={760} strokeDashoffset={760 * (1 - circle)} />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(90% 80% at 35% 50%, rgba(255,190,90,.10) 0%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* real app slot grid, phone kept straight; enters zoomed into the 8:00 PM chip (match cut) */
const PH = 1000, SW = Math.round(PH * 1080 / 2400), K = SW / 1080;
const CHIP = { x: 720, y: 1530, w: 306, h: 142 }; // in the 1080x2400 screenshot
const Slots: React.FC = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [0, 22], [2.6, 1], { ...clamp, easing: ease });
  const lift = interpolate(f, [T.tap - T.cut + 10, T.tap - T.cut + 34], [1, 1.32], { ...clamp, easing: ease });
  const tapped = f >= T.tap - T.cut;
  const ring = sp(f, 30, T.tap - T.cut, 12);
  const rip = interpolate(f, [T.tap - T.cut, T.tap - T.cut + 16], [0, 1], clamp);
  const cx = (CHIP.x + CHIP.w / 2) * K, cy = (CHIP.y + CHIP.h / 2) * K;
  const pill = sp(f, 30, T.tap - T.cut + 18, 14);
  return (
    <AbsoluteFill style={{ background: "#F8F5EE" }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", left: 1250, top: -300, background: "radial-gradient(circle, #F2B30033 0%, #F2B30000 62%)" }} />
      <div style={{ position: "absolute", left: 640 - SW / 2 - 14, top: 40, width: SW + 28, height: PH + 28, transform: `scale(${out * lift})`, transformOrigin: `${14 + cx}px ${14 + cy}px` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "#1F1A12", boxShadow: "0 40px 90px rgba(31,26,18,.25)" }} />
        <div style={{ position: "absolute", left: 14, top: 14, width: SW, height: PH, borderRadius: 52, overflow: "hidden", background: "#fff" }}>
          <Img src={S("slots.png")} style={{ width: SW, height: PH }} />
          {!tapped && <div style={{ position: "absolute", left: CHIP.x * K, top: CHIP.y * K, width: CHIP.w * K, height: CHIP.h * K, borderRadius: 999, border: "1.5px solid #ECE6D8", background: "#fff",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 600, color: INK }}>
            <span style={{ fontSize: 15 }}>৮:০০ PM</span><span style={{ fontSize: 12, color: "#665C4C" }}>৳২,০০০</span></div>}
          <div style={{ position: "absolute", left: cx - 60 * rip, top: cy - 60 * rip, width: 120 * rip, height: 120 * rip, borderRadius: 99, background: TUR, opacity: tapped ? 0.5 * (1 - rip) : 0 }} />
          {tapped && <div style={{ position: "absolute", left: CHIP.x * K - 6, top: CHIP.y * K - 6, width: CHIP.w * K + 12, height: CHIP.h * K + 12, borderRadius: 999, border: `4px solid ${TUR}`, transform: `scale(${0.8 + 0.2 * ring})`, opacity: ring }} />}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1180, top: 330, opacity: pill, transform: `translateX(${(1 - pill) * 40}px)`, background: "#fff", border: "1.5px solid #ECE6D8", borderRadius: 24, padding: "22px 30px", fontFamily: F, color: INK }}>
        <div style={{ fontSize: 26, color: "#665C4C", fontWeight: 500 }}>আপনার বুকিং</div>
        <div style={{ fontSize: 44, fontWeight: 700 }}>রাত ৮:০০ – ৯:০০</div>
        <div style={{ fontSize: 30, fontWeight: 600 }}>কোর্ট ১ · ৳২,০০০</div>
      </div>
    </AbsoluteFill>
  );
};

const CAPS: [number, number, string, string?][] = [
  [CALLER, CALLER + 84, "ভাই, শুক্রবার রাত আটটা খালি আছে?", "ফোনে গ্রাহক"],
  [OWNER, T.cut - 2, "একটু দাঁড়ান, দেখি…", "টার্ফ মালিক"],
  [NARR, NARR + 44, "কাউন্টে খালি সময় দেখেই"],
  [NARR + 44, T.end, "আপনার গ্রাহক বুক করতে পারেন।"],
];
const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const c = CAPS.find(([a, b]) => f >= a && f < b);
  if (!c) return null;
  const o = interpolate(f - c[0], [0, 5], [0, 1], clamp);
  const light = f >= T.cut;
  return (
    <div style={{ position: "absolute", left: light ? 1080 : 0, right: light ? 40 : 0, bottom: light ? 300 : 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: o }}>
      {c[3] && <div style={{ fontFamily: F, fontWeight: 600, fontSize: 26, color: light ? "#665C4C" : "#F2E7C9" }}>{c[3]}</div>}
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 62, lineHeight: 1.25, color: light ? INK : "#fff", background: light ? "rgba(248,245,238,.94)" : "rgba(20,15,8,.72)", padding: "6px 34px 12px", borderRadius: 20 }}>{c[2]}</div>
    </div>
  );
};

export const Cut12: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={T.phone}><Still src="wide.jpg" from={0} to={T.phone} z0={1.0} z1={1.06} /></Sequence>
      <Sequence from={T.phone} durationInFrames={T.owner - T.phone}><Still src="phone.jpg" from={T.phone} to={T.owner} z0={1.08} z1={1.16} ox="40% 55%" shake /></Sequence>
      <Sequence from={T.owner} durationInFrames={T.ledger - T.owner}><Still src="owner.jpg" from={T.owner} to={T.ledger} z0={1.02} z1={1.12} ox="40% 40%" /></Sequence>
      <Sequence from={T.ledger} durationInFrames={T.cut - T.ledger}><Ledger /></Sequence>
      <Sequence from={T.cut}><Slots /></Sequence>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [T.cut - 1, T.cut, T.cut + 5], [0, 0.55, 0], clamp) }} />
      <Caption />
      <Audio src={S("room.mp3")} volume={(x) => interpolate(x, [0, 10, T.cut - 4, T.cut], [0, 0.35, 0.35, 0], clamp)} />
      <Sequence from={4} durationInFrames={52}><Audio src={S("buzz.mp3")} volume={0.55} /></Sequence>
      <Sequence from={CALLER}><Audio src={S("caller.mp3")} /></Sequence>
      <Sequence from={T.ledger - 2}><Audio src={S("rustle.mp3")} volume={0.5} /></Sequence>
      <Sequence from={OWNER}><Audio src={S("owner.mp3")} /></Sequence>
      <Sequence from={T.cut}><Audio src={S("hit.mp3")} volume={0.45} /></Sequence>
      <Sequence from={T.cut}><Audio src={S("music.mp3")} volume={(x) => interpolate(x, [0, 6, 160, 192], [0.22, 0.16, 0.16, 0.1], clamp)} /></Sequence>
      <Sequence from={NARR}><Audio src={S("narr.mp3")} /></Sequence>
      <Sequence from={T.tap}><Audio src={S("click.mp3")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
