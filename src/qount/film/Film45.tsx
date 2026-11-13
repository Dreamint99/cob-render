// Qount brand film — "the turf owner's Friday night" (2026-11-13). Comps QF-H (16:9 45 s), QF-V (9:16 45 s), QF-S (9:16 15 s).
// Footage: Veo Lite 1080p clips (OpenRouter, AI, ~$1.70) + real rebranded Qount screens captured from the LOCAL build (:8790 demo-turf,
// one demo booking: Fri 20 Nov 8:00 PM, তানভীর আহমেদ, TrxID BK7X2P9Q1Z, QT-34VMP). Assets: <public>/film (local public dir work/qroot).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender, Easing } from "remotion";
import { F, sp, Logo, Wordmark } from "../Qd";
import FILM from "./film.json";

const S = (p: string) => staticFile("film/" + p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const INK = "#1F1A12", TUR = "#F2B300", PAPER = "#F8F5EE", GREY = "#665C4C", PEN = "#23306E", RED = "#B4261C";
const HAND = "QGalada, 'Galada', cursive";
if (typeof document !== "undefined") {
  const h = delayRender("galada");
  const ff = new FontFace("QGalada", `url(${staticFile("fonts/Galada-Regular.ttf")})`);
  ff.load().then(() => { document.fonts.add(ff); continueRender(h); }).catch(() => continueRender(h));
}
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };

/* ---------- footage ---------- */
const Clip: React.FC<{ src: string; start?: number; z0?: number; z1?: number; len: number; dim?: number }> = ({ src, start = 0, z0 = 1.02, z1 = 1.08, len, dim = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={S(src)} startFrom={start} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, len], [z0, z1], clamp)})` }} />
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,${dim}) 50%, rgba(0,0,0,${0.35 + dim}) 100%)` }} />
    </AbsoluteFill>
  );
};

/* ---------- phone with real screens (1080x2337 space) ---------- */
type Scr = { src: string; at: number };
type TapT = { x: number; y: number; at: number };
const SH = 2337;
const Phone: React.FC<{ cx: number; cy: number; h: number; screens: Scr[]; taps?: TapT[]; enter?: number; zoom?: { s: number; x: number; y: number }; children?: React.ReactNode; tilt?: number }> = ({ cx, cy, h, screens, taps = [], enter = -99, zoom, children, tilt = 0 }) => {
  const f = useCurrentFrame();
  const bez = Math.round(h * 0.014), sh = h - 2 * bez, sw = Math.round(sh * 1080 / SH), w = sw + 2 * bez, k = sw / 1080;
  const e = sp(f, 30, enter, 16);
  const z = zoom ? zoom.s : 1, ox = zoom ? bez + zoom.x * k : w / 2, oy = zoom ? bez + zoom.y * k : h / 2;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `translateY(${(1 - e) * 120}px) scale(${z}) rotate(${tilt}deg)`, transformOrigin: `${ox}px ${oy}px`, opacity: e }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: h * 0.07, background: INK, boxShadow: "0 40px 90px rgba(31,26,18,.28)" }} />
      <div style={{ position: "absolute", left: bez, top: bez, width: sw, height: sh, borderRadius: h * 0.058, overflow: "hidden", background: "#fff" }}>
        {screens.map((s, i) => <Img key={i} src={S("ui/" + s.src)} style={{ position: "absolute", inset: 0, width: sw, height: sh, opacity: i === 0 ? 1 : interpolate(f, [s.at, s.at + 6], [0, 1], clamp) }} />)}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: SH, transform: `scale(${k})`, transformOrigin: "0 0" }}>
          {taps.map((t, i) => {
            const a = f - t.at; if (a < -12 || a > 30) return null;
            const r = interpolate(a, [0, 18], [40, 170], clamp);
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: t.x - r, top: t.y - r, width: 2 * r, height: 2 * r, borderRadius: 999, background: TUR, opacity: a >= 0 ? interpolate(a, [0, 22], [0.55, 0], clamp) : 0 }} />
                <div style={{ position: "absolute", left: t.x - 48, top: t.y - 48, width: 96, height: 96, borderRadius: 99, border: `8px solid ${TUR}`, background: "rgba(242,179,0,.25)", opacity: interpolate(a, [-12, 0, 20, 30], [0, 1, 1, 0], clamp), transform: `scale(${a >= 0 && a < 6 ? 0.85 : 1})` }} />
              </React.Fragment>
            );
          })}
          {children}
        </div>
      </div>
    </div>
  );
};

/* push banner inside a phone (1080-wide space) */
const Push: React.FC<{ at: number; title: string; body: string }> = ({ at, title, body }) => {
  const f = useCurrentFrame(); const s = sp(f, 30, at, 15);
  return (
    <div style={{ position: "absolute", left: 36, top: 40, width: 1008, borderRadius: 56, background: "#fff", border: "3px solid #ECE6D8", boxShadow: "0 24px 60px rgba(0,0,0,.18)", transform: `translateY(${(1 - s) * -360}px)`, display: "flex", alignItems: "center", gap: 30, padding: "34px 40px" }}>
      <Logo size={96} style={{ borderRadius: 26 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 44, color: INK }}>{title}</span>
        <span style={{ fontFamily: F, fontWeight: 500, fontSize: 38, color: GREY }}>{body}</span>
      </div>
    </div>
  );
};

/* ---------- handwritten ledger (match-cut anchor "৮:০০") ---------- */
const ROWS: [string, string, "ok" | "cut" | "ask" | "note"][] = [["৬:০০", "রাকিব ভাই", "ok"], ["৭:০০", "সজীব — মিরপুর এফসি", "cut"], ["৮:০০", "?", "ask"], ["৯:০০", "অফিস টিম (অগ্রিম ২০০)", "note"], ["১০:০০", "শাহিন — ফোন দিবে", "cut"]];
const Ledger: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame(); const V = useV();
  const { width: W, height: H } = useVideoConfig();
  const flip = interpolate(f, [0, 12], [-70, 0], { ...clamp, easing: ease });
  const zoom = interpolate(f, [len - 14, len], [1, 2.8], { ...clamp, easing: Easing.in(Easing.cubic) });
  const circle = interpolate(f, [18, 34], [0, 1], clamp);
  const sc = V ? 0.66 : 1; const pw = 1600, ph = 1000;
  const left = (W - pw * sc) / 2, top = (H - ph * sc) / 2;
  const ax = left + (60 + 120) * sc, ay = top + (160 + 2 * 150 + 50) * sc;
  return (
    <AbsoluteFill style={{ background: "#1a140c", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${ax}px ${ay}px` }}>
        <div style={{ position: "absolute", left, top, width: pw, height: ph, transform: `scale(${sc}) perspective(1600px) rotateY(${flip}deg) rotate(-1.5deg)`, transformOrigin: "0 0", background: "#F1E6CB", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,.6)",
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0 107px, rgba(60,90,170,.28) 107px 109px)" }}>
          <div style={{ position: "absolute", left: 210, top: 0, bottom: 0, width: 3, background: "rgba(180,38,28,.45)" }} />
          <div style={{ position: "absolute", left: 250, top: 40, fontFamily: HAND, fontSize: 64, color: PEN }}>শুক্রবার — ২০ নভেম্বর</div>
          {ROWS.map(([t, who, k], i) => {
            const strike = interpolate(f, [6 + i * 3, 16 + i * 3], [0, 1], clamp);
            return (
              <div key={i} style={{ position: "absolute", left: 60, top: 160 + i * 150, width: 1500, height: 120, fontFamily: HAND, color: PEN }}>
                <span style={{ position: "absolute", left: 0, fontSize: 86 }}>{t}</span>
                <span style={{ position: "absolute", left: 260, fontSize: 70, top: 10 }}>{who}</span>
                {k === "cut" && <div style={{ position: "absolute", left: 250, top: 62, height: 7, width: 700 * strike, background: RED, borderRadius: 4, transform: "rotate(-2deg)" }} />}
                {k === "ask" && <svg style={{ position: "absolute", left: -40, top: -30 }} width={330} height={190}><ellipse cx={165} cy={95} rx={150} ry={78} fill="none" stroke={RED} strokeWidth={6} strokeDasharray={760} strokeDashoffset={760 * (1 - circle)} /></svg>}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(90% 80% at 35% 50%, rgba(255,190,90,.10) 0%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------- light UI stage ---------- */
const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
    <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", right: -420, top: -480, background: "radial-gradient(circle, #F2B30033 0%, #F2B30000 62%)" }} />
    {children}
  </AbsoluteFill>
);
const Card: React.FC<{ x: number; y: number; at: number; children: React.ReactNode; w?: number }> = ({ x, y, at, children, w }) => {
  const f = useCurrentFrame(); const s = sp(f, 30, at, 14);
  return <div style={{ position: "absolute", left: x, top: y, width: w, opacity: s, transform: `translateY(${(1 - s) * 30}px)`, background: "#fff", border: "1.5px solid #ECE6D8", borderRadius: 24, padding: "22px 30px", fontFamily: F, color: INK }}>{children}</div>;
};

const CHIP8 = { x: 240, y: 1169 }; // 8:00 PM in c1/c2
const REQ = { x: 744, y: 1170 }, APPROVE = { x: 746, y: 1170 };

const SlotsScene: React.FC<{ tap: number; matchCut?: boolean }> = ({ tap, matchCut = true }) => {
  const f = useCurrentFrame(); const V = useV();
  const out = matchCut ? interpolate(f, [0, 22], [2.8, 1], { ...clamp, easing: ease }) : 1;
  const lift = interpolate(f, [tap + 8, tap + 30], [1, V ? 1.1 : 1.16], { ...clamp, easing: ease });
  return (
    <Paper>
      <Phone cx={V ? 600 : 800} cy={V ? 860 : 540} h={V ? 1420 : 1000} screens={[{ src: "c1-slots.png", at: 0 }, { src: "c2-slot-picked.png", at: tap + 2 }]} taps={[{ ...CHIP8, at: tap }]}
        zoom={{ s: out * lift, x: CHIP8.x, y: CHIP8.y }} />
      <Card x={V ? 300 : 1260} y={V ? 1580 : 330} at={tap + 20}>
        <div style={{ fontSize: 26, color: GREY, fontWeight: 500 }}>গ্রাহকের বুকিং</div>
        <div style={{ fontSize: 44, fontWeight: 700 }}>শুক্র ২০ নভে · রাত ৮:০০</div>
        <div style={{ fontSize: 30, fontWeight: 600 }}>কোর্ট A · ৳২,০০০</div>
      </Card>
    </Paper>
  );
};

const ConfirmScene: React.FC<{ req: number; ownerIn: number; approve: number }> = ({ req, ownerIn, approve }) => {
  const V = useV(); const f = useCurrentFrame();
  const fade = V ? interpolate(f, [ownerIn, ownerIn + 12], [1, 0.35], clamp) : 1;
  return (
    <Paper>
      <div style={{ opacity: fade }}>
        <Phone cx={V ? 540 : 560} cy={V ? 820 : 540} h={V ? 1300 : 960} screens={[{ src: "c5-trxid.png", at: 0 }, { src: "c6-sent.png", at: req + 4 }]} taps={[{ ...REQ, at: req }]} tilt={V ? 0 : -2} />
      </div>
      <Phone cx={V ? 540 : 1360} cy={V ? 880 : 540} h={V ? 1300 : 960} enter={ownerIn} screens={[{ src: "o2b-detail-button.png", at: 0 }, { src: "o3-confirmed.png", at: approve + 4 }]} taps={[{ ...APPROVE, at: approve }]} tilt={V ? 0 : 2}>
        <Push at={ownerIn + 8} title="নতুন বুকিং এসেছে" body="তানভীর আহমেদ · শুক্র রাত ৮:০০ · বিকাশ ৳৮০০" />
      </Phone>
      {!V && <>
        <div style={{ position: "absolute", left: 560 - 150, top: 40, width: 300, textAlign: "center", fontFamily: F, fontWeight: 600, fontSize: 28, color: GREY }}>গ্রাহকের ফোন</div>
        <div style={{ position: "absolute", left: 1360 - 150, top: 40, width: 300, textAlign: "center", fontFamily: F, fontWeight: 600, fontSize: 28, color: GREY, opacity: interpolate(f, [ownerIn, ownerIn + 10], [0, 1], clamp) }}>মালিকের ফোন</div>
      </>}
    </Paper>
  );
};

const TicketScene: React.FC = () => {
  const f = useCurrentFrame(); const V = useV();
  const sms = sp(f, 30, 8, 14);
  const qz = interpolate(f, [60, 84], [1, V ? 1.5 : 1.9], { ...clamp, easing: ease });
  return (
    <Paper>
      <Phone cx={V ? 540 : 700} cy={V ? 860 : 540} h={V ? 1380 : 1000} screens={[{ src: "c7-ticket.png", at: 0 }, { src: "c8-ticket-qr.png", at: 58 }]} zoom={{ s: qz, x: 300, y: 300 }} />
      <div style={{ position: "absolute", left: V ? 120 : 1150, top: V ? 1560 : 300, width: V ? 840 : 620, transform: `translateY(${(1 - sms) * 40}px)`, opacity: sms * interpolate(f, [56, 66], [1, V ? 0 : 1], clamp),
        background: "#fff", border: "1.5px solid #ECE6D8", borderRadius: 28, padding: "24px 30px", fontFamily: F, color: INK, boxShadow: "0 24px 60px rgba(31,26,18,.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Logo size={52} style={{ borderRadius: 14 }} /><span style={{ fontWeight: 700, fontSize: 30 }}>GREENFIELD</span><span style={{ marginLeft: "auto", color: GREY, fontSize: 24 }}>SMS · এখন</span></div>
        <div style={{ marginTop: 14, fontSize: 32, lineHeight: 1.45, background: PAPER, borderRadius: "6px 22px 22px 22px", padding: "14px 20px" }}>
          বুকিং কনফার্ম! শুক্র ২০ নভে, রাত ৮:০০, কোর্ট A। টিকেট: <b>QT-34VMP</b>
        </div>
      </div>
    </Paper>
  );
};

const HeroScene: React.FC = () => {
  const f = useCurrentFrame(); const V = useV();
  const z = interpolate(f, [0, 55], [1.0, 1.08], clamp);
  return (
    <Paper>
      <Phone cx={V ? 540 : 960} cy={V ? 900 : 540} h={V ? 1500 : 1000} screens={[{ src: "o5-home-after.png", at: 0 }]} zoom={{ s: z, x: 540, y: 900 }} />
    </Paper>
  );
};

const ListScene: React.FC = () => {
  const V = useV();
  return (
    <Paper>
      <Phone cx={V ? 540 : 960} cy={V ? 900 : 540} h={V ? 1500 : 1000} screens={[{ src: "o4-list.png", at: 0 }]} />
    </Paper>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame(); const V = useV();
  const a = sp(f, 30, 2, 12), b = sp(f, 30, 14, 13), c = sp(f, 30, 26, 12);
  // petals "drawn" one by one (brand motion: a booking confirmed = an alpona drawn)
  const k = V ? 1.15 : 1;
  return (
    <Paper>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 * k, paddingBottom: V ? 120 : 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `scale(${a})` }}>
          <svg width={150 * k} height={150 * k} viewBox="0 0 512 512">
            <rect width="512" height="512" rx="116" fill={TUR} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((r, i) => <ellipse key={r} cx="256" cy="148" rx="46" ry="86" transform={`rotate(${r} 256 256)`} fill={INK} opacity={interpolate(f, [2 + i * 2.2, 6 + i * 2.2], [0, 1], clamp)} />)}
            <circle cx="256" cy="256" r="40" fill={TUR} /><circle cx="256" cy="256" r="18" fill={INK} />
          </svg>
          <Wordmark h={140 * k} />
        </div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 64 * k, color: INK, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, textAlign: "center" }}>আপনার বিজনেস, এখন অটোপাইলটে।</div>
        <div style={{ display: "flex", flexDirection: V ? "column" : "row", alignItems: "center", gap: 22, opacity: c, transform: `scale(${0.9 + 0.1 * c})` }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 50 * k, color: INK, background: TUR, borderRadius: 999, padding: "10px 46px 18px" }}>৩ দিন ফ্রি শুরু করুন</div>
          <div style={{ fontFamily: F, fontWeight: 600, fontSize: 46 * k, color: INK, background: "#fff", border: "2px solid #ECE6D8", borderRadius: 999, padding: "12px 40px 16px" }}>qount.dreamithq.com</div>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

/* ---------- captions ---------- */
type Cap = [number, number, string, string?];
const Captions: React.FC<{ caps: Cap[]; light: (f: number) => boolean }> = ({ caps, light }) => {
  const f = useCurrentFrame(); const V = useV();
  const c = caps.find(([a, b]) => f >= a && f < b);
  if (!c) return null;
  const o = interpolate(f - c[0], [0, 5], [0, 1], clamp);
  const L = light(f);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: V ? 230 : 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: o }}>
      {c[3] && <div style={{ fontFamily: F, fontWeight: 600, fontSize: V ? 34 : 28, color: L ? GREY : "#F2E7C9" }}>{c[3]}</div>}
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 66 : 62, lineHeight: 1.25, textAlign: "center", color: L ? INK : "#fff", background: L ? "rgba(255,255,255,.95)" : "rgba(20,15,8,.72)", border: L ? "1.5px solid #ECE6D8" : "none", padding: "6px 34px 12px", borderRadius: 22 }}>{c[2]}</div>
    </div>
  );
};

const Sfx: React.FC<{ at: number; src: string; v: number; len?: number }> = ({ at, src, v, len }) => <Sequence from={at} durationInFrames={len}><Audio src={S(src)} volume={v} /></Sequence>;
const Voices: React.FC<{ list: [string, number][] }> = ({ list }) => <>{list.map(([n, at]) => <Sequence key={n} from={at}><Audio src={S(n + ".mp3")} /></Sequence>)}</>;

/* ---------- 45 s film ---------- */
export const Film45: React.FC = () => {
  const f = useCurrentFrame();
  const D = FILM.full;
  const LIGHT: [number, number][] = [[168, 750], [1100, 1350]];
  const light = (x: number) => LIGHT.some(([a, b]) => x >= a && x < b);
  const music = (x: number) => interpolate(x, [168, 174, 740, 750, 900, 910, 1180, 1330, 1350], [0.22, 0.12, 0.12, 0.2, 0.2, 0.12, 0.12, 0.2, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={90}><Clip src="counter.mp4" start={24} len={90} /></Sequence>
      <Sequence from={90} durationInFrames={27}><Clip src="ledger.mp4" start={30} len={27} z0={1.05} z1={1.12} /></Sequence>
      <Sequence from={117} durationInFrames={51}><Ledger len={51} /></Sequence>
      <Sequence from={168} durationInFrames={192}><SlotsScene tap={60} /></Sequence>
      <Sequence from={360} durationInFrames={270}><ConfirmScene req={32} ownerIn={55} approve={102} /></Sequence>
      <Sequence from={630} durationInFrames={120}><TicketScene /></Sequence>
      <Sequence from={750} durationInFrames={150}><Clip src="turf.mp4" start={0} len={150} z0={1.0} z1={1.06} /></Sequence>
      <Sequence from={900} durationInFrames={70}><Clip src="salon.mp4" start={10} len={70} /></Sequence>
      <Sequence from={970} durationInFrames={70}><Clip src="chamber.mp4" start={10} len={70} /></Sequence>
      <Sequence from={1040} durationInFrames={60}><Clip src="gaming.mp4" start={10} len={60} /></Sequence>
      <Sequence from={1100} durationInFrames={40}><ListScene /></Sequence>
      <Sequence from={1140} durationInFrames={56}><HeroScene /></Sequence>
      <Sequence from={1196}><EndCard /></Sequence>
      {[168, 360, 630, 750, 1100, 1196].map((t) => <AbsoluteFill key={t} style={{ background: "#fff", opacity: interpolate(f, [t - 1, t, t + 5], [0, t === 168 ? 0.55 : 0.18, 0], clamp) }} />)}
      <Captions caps={D.caps as Cap[]} light={light} />
      <Audio src={S("room.mp3")} volume={(x) => interpolate(x, [0, 10, 160, 168], [0, 0.3, 0.3, 0], clamp)} />
      <Sfx at={4} src="buzz.mp3" v={0.55} len={52} />
      <Sfx at={115} src="rustle.mp3" v={0.5} />
      <Sfx at={168} src="hit.mp3" v={0.45} />
      <Sfx at={228} src="click.mp3" v={0.5} />
      <Sfx at={392} src="click.mp3" v={0.45} />
      <Sfx at={423} src="sms.mp3" v={0.4} />
      <Sfx at={462} src="click.mp3" v={0.6} />
      <Sfx at={640} src="sms.mp3" v={0.55} />
      <Sfx at={748} src="whistle.mp3" v={0.5} len={60} />
      <Sequence from={760} durationInFrames={140}><Audio src={S("crowd.mp3")} volume={(x) => interpolate(x, [0, 20, 60, 90, 140], [0.15, 0.25, 0.25, 0.7, 0.4], clamp)} /></Sequence>
      <Sequence from={168}><Audio src={S("music.mp3")} volume={(x) => music(x + 168)} /></Sequence>
      <Voices list={D.audio as [string, number][]} />
    </AbsoluteFill>
  );
};

/* ---------- 15 s vertical cutdown ---------- */
export const Film15: React.FC = () => {
  const f = useCurrentFrame();
  const D = FILM.short;
  const light = (x: number) => (x >= 90 && x < 316) || x >= 330;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={90}><Clip src="counter.mp4" start={30} len={90} /></Sequence>
      <Sequence from={90} durationInFrames={98}><SlotsScene tap={44} matchCut={false} /></Sequence>
      <Sequence from={188} durationInFrames={128}><ConfirmScene req={10} ownerIn={28} approve={70} /></Sequence>
      <Sequence from={316} durationInFrames={44}><Clip src="turf.mp4" start={54} len={44} /></Sequence>
      <Sequence from={330}><EndCard /></Sequence>
      {[90, 188, 316, 330].map((t) => <AbsoluteFill key={t} style={{ background: "#fff", opacity: interpolate(f, [t - 1, t, t + 5], [0, 0.3, 0], clamp) }} />)}
      <Captions caps={D.caps as Cap[]} light={light} />
      <Sfx at={0} src="buzz.mp3" v={0.5} len={40} />
      <Sfx at={90} src="hit.mp3" v={0.45} />
      <Sfx at={134} src="click.mp3" v={0.5} />
      <Sfx at={258} src="click.mp3" v={0.6} />
      <Sfx at={314} src="whistle.mp3" v={0.45} len={40} />
      <Sequence from={90}><Audio src={S("music.mp3")} volume={(x) => interpolate(x, [0, 6, 330, 360], [0.22, 0.12, 0.12, 0.2], clamp)} /></Sequence>
      <Voices list={D.audio as [string, number][]} />
    </AbsoluteFill>
  );
};
