// "লিবিয়া হয়ে ইউরোপ: মানব পাচারের মরণপথ" — full episode (ep1). Designed at 1920x1080, rendered ×4/3 to 1440p.
// Timeline is data-driven: VO schedule = ep1/timing.json, graphics cue on script words (ep1/cues.json), B-roll slots = ep1/broll.json.
// Every number on screen comes from work/libya/research.md (source chip under each card).
import "./fonts";
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import timing from "./ep1/timing.json";
import caps from "./ep1/caps.json";
import cuesJson from "./ep1/cues.json";
import broll from "./ep1/broll.json";
import map from "./ep1/libya_map.json";
import { bn, bnInt } from "./Geo3D";
import { ColdOpen, Title, Hook, Grain, Vignette } from "./Ep0";

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const E0 = (f: string) => staticFile(`libya/ep0/${f}`);
const E1 = (f: string) => staticFile(`libya/ep1/${f}`);
export const EP1_LEN = S(timing.total);
const RED = "#e0142b", GOLD = "#ffcf6b", SAND = "#ead9b4", SKY = "#9fd3ff", MINT = "#7fd0a8", REC = "#c59bff";
const HEAD = "Anek Bangla", BODY = "Hind Siliguri";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useT = () => useCurrentFrame() / FPS;
const RecTag: React.FC<{ text: string; o: number }> = ({ text, o }) => (
  <div style={{ position: "absolute", right: 40, top: 34, opacity: o, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12, background: "rgba(5,8,12,.72)", border: `1.5px solid ${"#c59bff"}`, borderRadius: 8, padding: "8px 18px 10px", fontFamily: "Hind Siliguri", fontWeight: 600, fontSize: 26, color: "#fff" }}>
    <div style={{ width: 10, height: 10, borderRadius: 5, background: "#c59bff", boxShadow: "0 0 10px #c59bff" }} />{text}
  </div>
);
const fadeIO = (t: number, a: number, b: number, d = 0.4) => (b - a < 2 * d ? 0 : interpolate(t, [a, a + d, b - d, b], [0, 1, 1, 0], clamp));

// ---------- timing helpers ----------
const VO = timing.vo as { id: string; at: number; len: number }[];
const P = Object.fromEntries(VO.map((v) => [v.id, v])) as Record<string, { id: string; at: number; len: number }>;
const end = (id: string) => P[id].at + P[id].len;
const CUES = cuesJson as Record<string, { w: string; s: number }[]>;
/** absolute time of the n-th script word in part `id` that starts with `w` (falls back to the part start) */
const cue = (id: string, w: string, n = 0, off = 0) => {
  const hits = (CUES[id] || []).filter((c) => c.w.startsWith(w));
  return (hits[Math.min(n, hits.length - 1)]?.s ?? P[id].at) + off;
};
type Win = { a: number; b: number };
/** consecutive beats: each one ends where the next starts */
const beats = <T extends { a: number }>(xs: T[], last: number): (T & Win)[] => xs.map((x, i) => ({ ...x, b: i < xs.length - 1 ? xs[i + 1].a - 0.15 : last }));
const speaking = (t: number) => VO.some((v) => t >= v.at - 0.25 && t <= v.at + v.len + 0.15);

// ---------- backgrounds ----------
const LEN: Record<string, number> = {
  "ep0/clips/globe.mp4": 28.7, "ep0/clips/med.mp4": 8, "ep0/clips/sea_open.mp4": 14, "ep0/clips/sea_boat.mp4": 5, "ep0/px/dhaka_airport.mp4": 6, "ep0/px/graveyard_ledger.mp4": 10,
  "ep0/px/rescue.mp4": 9, "ep0/px/room.mp4": 8, "ep0/px/seawatch.mp4": 11, "ep0/px/tripoli_night.mp4": 5,
  "ep1/px/seawatch1.mp4": 12, "ep1/px/seawatch3.mp4": 12, "ep1/px/dhaka_emirates.mp4": 10, "ep1/px/lampedusa.mp4": 12, "ep1/px/room_slow.mp4": 14,
  "ep1/px/tripoli_sunset.mp4": 12, "ep1/px/madaripur_slow.mp4": 14, "ep1/px/dubai_slow.mp4": 12,
};
type BgItem = Win & { src: string; filter?: string; credit?: string; rec?: boolean };
const BgClip: React.FC<{ it: BgItem }> = ({ it }) => {
  const t = useT(); const dur = it.b - it.a; const L = LEN[it.src] ?? dur;
  const rate = Math.max(0.35, Math.min(1, (L - 0.1) / dur));
  const o = interpolate(t, [0, 0.6, dur - 0.6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <OffthreadVideo src={staticFile(`libya/${it.src}`)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.03 * (t / dur)})`, filter: it.filter ?? "saturate(.75) brightness(.55)" }} />
      <Vignette v={0.6} />
      {it.credit ? <div style={{ position: "absolute", right: 34, top: 30, opacity: 0.75 * o, fontFamily: BODY, fontWeight: 600, fontSize: 20, color: "#fff", textShadow: "0 1px 6px #000", maxWidth: 820, textAlign: "right" }}>{it.credit}</div> : null}
      {it.rec ? <RecTag text="পুনর্নির্মিত দৃশ্য · প্রতীকী ছবি" o={o} /> : null}
    </AbsoluteFill>
  );
};
const DIM = "saturate(.5) brightness(.3)";
const C = {
  mdp: "মাদারীপুরে সূর্যাস্ত · ছবি: S.M.M. Musabbir Uddin / Wikimedia Commons (CC BY-SA 4.0)",
  dhaka: "ঢাকা বিমানবন্দর · ছবি: Tarunsamanta / Wikimedia Commons (CC BY-SA 4.0)",
  emir: "ঢাকা বিমানবন্দর · ছবি: Md Shaifuzzaman Ayon / Wikimedia Commons (CC BY-SA 4.0)",
  dubai: "দুবাই আন্তর্জাতিক বিমানবন্দর · ছবি: EditQ / Wikimedia Commons (CC0)",
  tripS: "ত্রিপোলির উপকূল · ছবি: Tarek Siala / Wikimedia Commons (CC BY 2.0)",
  tripN: "রাতের ত্রিপোলি, মহাকাশ স্টেশন থেকে · ছবি: NASA (পাবলিক ডোমেইন)",
  sw1: "উদ্ধারকারী জাহাজ Sea-Watch · ছবি: Ruben Neugebauer / Sea-Watch.org / Wikimedia Commons (CC BY-SA 4.0)",
  sw3: "Sea-Watch 3 · ছবি: Chris Grodotzki / Sea-Watch.org / Wikimedia Commons (CC BY-SA 4.0)",
  sw: "Sea-Watch 2 · ছবি: Fabian Melber / Sea-Watch.org / Wikimedia Commons (CC BY-SA 4.0)",
  usn: "ভূমধ্যসাগরে উদ্ধার অভিযান · ছবি: U.S. Navy / Wikimedia Commons (পাবলিক ডোমেইন)",
  lmp: "লাম্পেদুসা বন্দর · ছবি: Wjkxy / Wikimedia Commons (CC BY-SA 4.0)",
  ec: "লাম্পেদুসায় পড়ে থাকা নৌকা · ছবি: European Commission / Wikimedia Commons (CC BY 4.0)",
  map: "মানচিত্র: NASA Blue Marble · Natural Earth",
  med: "মানচিত্র: Sentinel-2 cloudless (EOX, CC BY 4.0) · উচ্চতা: AWS Terrain Tiles",
};
const BG: BgItem[] = [
  { src: "ep0/clips/sea_boat.mp4", a: P.label.at - 0.8, b: end("label") + 0.8, filter: "saturate(.6) brightness(.35)" },
  { src: "ep1/px/dhaka_emirates.mp4", a: cue("village", "ছোট", 1, -0.5), b: end("village") + 0.6, credit: C.emir },
  { src: "ep1/px/dubai_slow.mp4", a: cue("why", "আবার", 0, -0.4), b: end("why") + 0.4, credit: C.dubai },
  { src: "ep0/clips/globe.mp4", a: P.route.at - 0.3, b: P.route.at + 28.4, filter: "none", credit: C.map },
  { src: "ep1/px/dubai_slow.mp4", a: cue("route", "এখন", 1, -0.4), b: end("route") + 0.6, credit: C.dubai },
  { src: "ep1/px/tripoli_sunset.mp4", a: cue("benghazi", "জিম্মায়", 0, -1.2), b: cue("benghazi", "সেখান", 1, 0.3), credit: C.tripS },
  { src: "ep0/px/tripoli_night.mp4", a: cue("benghazi", "ইনফোমাইগ্রেন্টসকে", 0, -0.3), b: cue("benghazi", "আরেকজন", 0, -0.2), credit: C.tripN },
  { src: "ep0/px/room.mp4", a: cue("benghazi", "আরেকজন", 0, -0.2), b: end("benghazi") + 0.8, filter: DIM, rec: true },
  { src: "ep1/px/room_slow.mp4", a: P.gameghor.at - 0.4, b: cue("gameghor", "ডেইলি", 0, -0.2), rec: true },
  { src: "ep0/px/room.mp4", a: 413.3, b: cue("gameghor", "এরপর", 0, -0.3), rec: true },
  { src: "ep0/clips/med.mp4", a: P.sea.at - 0.4, b: cue("sea", "কিন্তু", 0, -2.7), filter: "none", credit: C.med },
  { src: "ep0/clips/sea_open.mp4", a: cue("sea", "কিন্তু", 0, -2.7), b: cue("sea", "বাস্তবে", 0, -0.3), filter: "saturate(.7) brightness(.5)" },
  { src: "ep1/px/seawatch3.mp4", a: cue("sea", "মিক্সড", 1, -0.3), b: cue("sea", "আবার", 0, -0.3), credit: C.sw3 },
  { src: "ep0/px/seawatch.mp4", a: cue("sea", "ফেরত", 3, -0.3), b: end("sea") + 0.6, credit: C.sw },
  { src: "ep1/px/seawatch1.mp4", a: P.wrecks.at - 0.4, b: cue("wrecks", "দ্বিতীয়", 0, -2.2), credit: C.sw1 },
  { src: "ep0/clips/sea_open.mp4", a: cue("wrecks", "দ্বিতীয়", 0, -2.2), b: cue("wrecks", "তৃতীয়", 0, -0.3), filter: "saturate(.6) brightness(.42)" },
  { src: "ep0/clips/sea_open.mp4", a: cue("wrecks", "তৃতীয়", 0, 6.8), b: end("wrecks") + 0.6, filter: "saturate(.6) brightness(.42)" },
  { src: "ep1/px/lampedusa.mp4", a: P.number.at - 0.4, b: cue("number", "এত", 0, -0.3), credit: C.lmp },
  { src: "ep0/px/graveyard_ledger.mp4", a: cue("money", "চুয়াডাঙ্গার", 0, -0.3), b: cue("money", "আর", 1, -0.3), filter: "saturate(.5) brightness(.4)", credit: C.ec },
  { src: "ep0/px/dhaka_airport.mp4", a: cue("return", "আইওএম-এর", 0, -0.4), b: cue("return", "বেনগাজি", 0, 0), credit: C.dhaka },
  { src: "ep1/px/dhaka_emirates.mp4", a: cue("return", "বেনগাজি", 0, 0), b: cue("return", "ব্র্যাকের", 0, -0.3), credit: C.emir },
  // dim beds under the long card stretches (so no section sits on a flat background for long)
  { src: "ep1/px/madaripur_slow.mp4", a: 176.0, b: cue("dalal", "মিক্সড", 0, -0.2), filter: DIM, credit: C.mdp },
  { src: "ep1/px/dhaka_emirates.mp4", a: cue("dalal", "মিক্সড", 0, -0.2), b: 218.8, filter: DIM, credit: C.emir },
  { src: "ep1/px/room_slow.mp4", a: 440.0, b: cue("gameghor", "অপহরণ", 0, -0.3), filter: DIM, rec: true },
  { src: "ep0/px/room.mp4", a: cue("gameghor", "অপহরণ", 0, -0.3), b: cue("gameghor", "মিক্সড", 0, -0.2), filter: DIM, rec: true },
  { src: "ep0/px/tripoli_night.mp4", a: cue("gameghor", "মিক্সড", 0, -0.2), b: end("gameghor") + 0.6, filter: DIM, credit: C.tripN },
  { src: "ep1/px/tripoli_sunset.mp4", a: P.brac.at - 0.4, b: cue("brac", "মুক্তিপণের", 0, -0.2), filter: DIM, credit: C.tripS },
  { src: "ep0/px/tripoli_night.mp4", a: cue("brac", "মুক্তিপণের", 0, -0.2), b: cue("brac", "মুক্তিপণের", 0, 13.6), filter: DIM, credit: C.tripN },
  { src: "ep1/px/lampedusa.mp4", a: cue("number", "এত", 0, -0.3), b: cue("number", "এর", 0, -0.2), filter: DIM, credit: C.lmp },
  { src: "ep1/px/seawatch1.mp4", a: cue("number", "এর", 0, -0.2), b: end("number") + 0.6, filter: DIM, credit: C.sw1 },
  { src: "ep0/clips/sea_open.mp4", a: P.money.at - 0.4, b: cue("money", "চুয়াডাঙ্গার", 0, -0.3), filter: DIM },
  { src: "ep1/px/madaripur_slow.mp4", a: cue("money", "আর", 1, -0.3), b: cue("money", "আর", 3, -0.3), filter: DIM, credit: C.mdp },
  { src: "ep1/px/dhaka_emirates.mp4", a: cue("money", "আর", 3, -0.3), b: end("money"), filter: DIM, credit: C.emir },
  { src: "ep1/px/dhaka_emirates.mp4", a: P.legal.at - 0.4, b: cue("legal", "তবে", 0, -0.2), filter: DIM, credit: C.emir },
  { src: "ep0/px/dhaka_airport.mp4", a: cue("legal", "তবে", 0, -0.2), b: 1016.2, filter: DIM, credit: C.dhaka },
  { src: "ep1/px/madaripur_slow.mp4", a: 1024.0, b: end("legal") + 0.6, filter: DIM, credit: C.mdp },
  { src: "ep1/px/dubai_slow.mp4", a: P.check.at - 0.4, b: cue("check", "তিন", 1, -0.3), filter: DIM, credit: C.dubai },
  { src: "ep1/px/madaripur_slow.mp4", a: cue("check", "তিন", 1, -0.3), b: end("check") + 0.6, filter: DIM, credit: C.mdp },
  { src: "ep0/px/seawatch.mp4", a: P.close.at - 0.5, b: timing.endCard, filter: "saturate(.5) brightness(.3)", credit: C.sw },
];

// AI B-roll slots (missing files fall back to the parallax/map background)
type Slot = { id: string; start_s: number; dur_s: number; type: string; ready: boolean };
const BrollSlot: React.FC<{ s: Slot }> = ({ s }) => {
  const t = useT(); const d = s.dur_s; const o = interpolate(t, [0, 0.5, d - 0.5, d], [0, 1, 1, 0], clamp);
  if (!s.ready) return null;
  const src = E1(`broll/${s.id}.${s.type === "video" ? "mp4" : "jpg"}`);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {s.type === "video"
        ? <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.8) brightness(.8)" }} />
        : <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.06 * (t / d)})`, filter: "saturate(.8) brightness(.8)" }} />}
      <Vignette v={0.55} />
      <RecTag text="পুনর্নির্মিত দৃশ্য · এআই দিয়ে তৈরি" o={o} />
    </AbsoluteFill>
  );
};

// ---------- overlay building blocks ----------
const Src: React.FC<{ text: string; o: number }> = ({ text, o }) => (
  <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 22, color: "#aab3b8", marginTop: 14, opacity: o }}>সূত্র: {text}</div>
);
const useIn = (a: number, delay = 0) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - S(a + delay), fps, config: { damping: 16, mass: 0.8 } }); };
/** big number card */
const Stat: React.FC<Win & { big: string; label: string; src: string; color?: string; x?: number; y?: number; sub?: string }> = ({ a, b, big, label, src, color = "#fff", x = 120, y = 250, sub }) => {
  const t = useT(); const s = useIn(a); const o = fadeIO(t, a, b, 0.35) * Math.min(1, s * 1.3);
  if (t < a || t > b) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - s) * 30}px)`, maxWidth: 1250 }}>
      <div style={{ width: 54, height: 4, background: RED, marginBottom: 18 }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, lineHeight: 1.02, color, textShadow: "0 4px 24px rgba(0,0,0,.6)" }}>{big}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 48, lineHeight: 1.25, color: "#fff", marginTop: 8, textShadow: "0 2px 12px rgba(0,0,0,.7)" }}>{label}</div>
      {sub ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: SAND, marginTop: 8 }}>{sub}</div> : null}
      <Src text={src} o={1} />
    </div>
  );
};
/** statement card (no big number) */
const Line: React.FC<Win & { kicker?: string; text: string; src?: string; color?: string; x?: number; y?: number; w?: number; quote?: boolean; center?: boolean }> = ({ a, b, kicker, text, src, color = "#fff", x = 120, y = 300, w = 1200, quote, center }) => {
  const t = useT(); const s = useIn(a); if (t < a || t > b) return null;
  const o = fadeIO(t, a, b, 0.35) * Math.min(1, s * 1.3);
  const st: React.CSSProperties = center ? { position: "absolute", left: 0, right: 0, top: y, textAlign: "center" } : { position: "absolute", left: x, top: y, width: w };
  return (
    <div style={{ ...st, opacity: o, transform: `translateY(${(1 - s) * 26}px)` }}>
      {kicker ? <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, color: GOLD, marginBottom: 10 }}>{kicker}</div> : null}
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: quote ? 72 : 66, lineHeight: 1.22, color, textShadow: "0 3px 18px rgba(0,0,0,.7)" }}>{quote ? "“" : ""}{text}{quote ? "”" : ""}</div>
      {src ? <Src text={src} o={1} /> : null}
    </div>
  );
};
/** stacked line items that appear one by one */
const Items: React.FC<Win & { title?: string; items: { at: number; l: string; v?: string; c?: string; strike?: string }[]; src: string; x?: number; y?: number; w?: number }> = ({ a, b, title, items, src, x = 120, y = 210, w = 1100 }) => {
  const t = useT(); const f = useCurrentFrame(); const { fps } = useVideoConfig(); if (t < a || t > b) return null;
  const o = fadeIO(t, a, b, 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o }}>
      {title ? <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, color: SAND, marginBottom: 8 }}>{title}</div> : null}
      {items.map((it, i) => {
        const s = spring({ frame: f - S(it.at), fps, config: { damping: 15, mass: 0.8 } }); if (t < it.at) return null;
        return (
          <div key={i} style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 24}px)`, background: "rgba(8,12,16,.84)", borderLeft: `6px solid ${it.c ?? GOLD}`, borderRadius: 10, padding: "14px 26px 16px", marginTop: 14, boxShadow: "0 12px 40px rgba(0,0,0,.4)" }}>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: it.v ? 30 : 36, color: it.v ? SAND : "#fff", lineHeight: 1.3 }}>{it.l}</div>
            {it.v ? <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              {it.strike ? <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 40, color: "#8d949b", textDecoration: "line-through", textDecorationColor: RED }}>{it.strike}</div> : null}
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 62, color: it.c ?? GOLD, lineHeight: 1.1 }}>{it.v}</div>
            </div> : null}
          </div>
        );
      })}
      <Src text={src} o={1} />
    </div>
  );
};
/** horizontal bars */
const Bars: React.FC<Win & { title: string; sub?: string; rows: { l: string; v: number; txt: string; at: number; c?: string }[]; max: number; src: string; unit?: string }> = ({ a, b, title, sub, rows, max, src }) => {
  const t = useT(); const f = useCurrentFrame(); const { fps } = useVideoConfig(); if (t < a || t > b) return null;
  const o = fadeIO(t, a, b, 0.35);
  return (
    <div style={{ position: "absolute", left: 120, top: 190, width: 1600, opacity: o }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 58, color: "#fff" }}>{title}</div>
      {sub ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: SAND, marginBottom: 14 }}>{sub}</div> : null}
      {rows.map((r, i) => {
        const s = spring({ frame: f - S(r.at), fps, config: { damping: 16 } }); const on = t >= r.at;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", marginTop: 18, opacity: on ? Math.min(1, s * 1.5) : 0.18 }}>
            <div style={{ width: 520, fontFamily: BODY, fontWeight: 700, fontSize: 32, color: "#fff", lineHeight: 1.2 }}>{r.l}</div>
            <div style={{ height: 50, width: Math.max(6, 820 * (r.v / max) * (on ? s : 0)), background: r.c ?? RED, borderRadius: 6 }} />
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: "#fff", marginLeft: 18, opacity: on ? 1 : 0 }}>{r.txt}</div>
          </div>
        );
      })}
      <Src text={src} o={1} />
    </div>
  );
};
const Place: React.FC<Win & { name: string; sub?: string }> = ({ a, b, name, sub }) => {
  const t = useT(); const o = fadeIO(t, a, b, 0.5); if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 64, top: 70, opacity: o, transform: `translateX(${(1 - o) * -24}px)` }}>
      <div style={{ width: 54, height: 4, background: RED, marginBottom: 12 }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "#fff", lineHeight: 1.1, textShadow: "0 3px 16px rgba(0,0,0,.8)" }}>{name}</div>
      {sub ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: SAND, textShadow: "0 2px 10px #000" }}>{sub}</div> : null}
    </div>
  );
};
const Chapter: React.FC<{ n: number; title: string; at: number }> = ({ n, title, at }) => {
  const t = useT(); const a = at, b = at + 3.2; if (t < a || t > b) return null;
  const o = fadeIO(t, a, b, 0.45); const w = interpolate(t, [a + 0.2, a + 1.2], [0, 160], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "#05080b", opacity: o, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: SAND, letterSpacing: 2 }}>অধ্যায় {bn(n)}</div>
      <div style={{ width: w, height: 4, background: RED, margin: "22px 0 26px" }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 120, color: "#fff" }}>{title}</div>
    </AbsoluteFill>
  );
};

// running family ledger (Daily Star, 26 Sep 2026): broker 5.7 → son's ransom +10 → father's ransom +10 → boat +5 = 30.7 lakh
const LEDGER = [{ at: cue("village", "পাঁচ"), v: 5.7 }, { at: cue("gameghor", "দশ", 0), v: 15.7 }, { at: cue("gameghor", "দশ", 2), v: 25.7 }, { at: cue("sea", "পাঁচ"), v: 30.7 }];
const LEDGER_ON: Win[] = [{ a: LEDGER[0].at, b: cue("village", "ছোট", 1, -0.6) }, { a: cue("gameghor", "মুক্তিপণ"), b: end("gameghor") + 0.5 }, { a: P.sea.at + 1, b: cue("sea", "কিন্তু", 0, -0.3) }];
const Ledger: React.FC = () => {
  const t = useT(); const w = LEDGER_ON.find((x) => t >= x.a && t <= x.b); if (!w) return null;
  let v = 0, last = LEDGER[0].at; for (const s of LEDGER) if (t >= s.at) { v = s.v; last = s.at; }
  const prev = LEDGER.filter((s) => s.at < last).slice(-1)[0]?.v ?? 0;
  const shown = interpolate(t, [last, last + 0.9], [prev, v], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pulse = interpolate(t, [last, last + 0.25, last + 0.9], [1, 1.08, 1], clamp);
  return (
    <div style={{ position: "absolute", right: 46, top: 96, opacity: fadeIO(t, w.a, w.b, 0.5), textAlign: "right", background: "rgba(6,9,12,.8)", padding: "12px 22px 14px", borderRadius: 10, borderTop: `3px solid ${RED}` }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 22, color: SAND }}>চুয়াডাঙ্গার পরিবারের খরচ (রিপোর্ট অনুযায়ী)</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: "#fff", transform: `scale(${pulse})`, transformOrigin: "right center" }}>৳{bn(shown.toFixed(1))} লাখ</div>
    </div>
  );
};

// ---------- Libya map (Natural Earth outlines) ----------
type MapMode = { a: number; b: number; split?: boolean; chain?: { at: number; from: string; to: string }[]; pins?: { at: number; k: string; t: string; side?: "l" | "r" }[]; sea?: boolean };
const LibyaMap: React.FC<{ m: MapMode }> = ({ m }) => {
  const t = useT(); if (t < m.a || t > m.b) return null;
  const o = fadeIO(t, m.a, m.b, 0.5); const pt = map.pts as Record<string, number[]>; const sh = map.shapes as Record<string, string>;
  const zoom = interpolate(t, [m.a, m.b], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(ellipse at 60% 40%, #0f1c24 0%, #05080b 75%)" }}>
      <svg viewBox={`0 0 ${map.W} ${map.H}`} style={{ position: "absolute", right: 80, top: 70, height: 900, transform: `scale(${zoom})`, transformOrigin: "60% 40%" }}>
        <defs><clipPath id="west"><rect x="0" y="0" width={(17.8 - 7) / 21 * map.W} height={map.H} /></clipPath><clipPath id="east"><rect x={(17.8 - 7) / 21 * map.W} y="0" width={map.W} height={map.H} /></clipPath></defs>
        {Object.entries(sh).filter(([k]) => k !== "Libya").map(([k, d]) => <path key={k} d={d} fill="#16232b" stroke="#2d3f49" strokeWidth={1.5} />)}
        <path d={sh.Libya} fill="#2a2620" stroke={SAND} strokeWidth={2.5} />
        {m.split ? <>
          <path d={sh.Libya} fill={SKY} opacity={0.22 * interpolate(t, [m.a + 0.8, m.a + 1.6], [0, 1], clamp)} clipPath="url(#west)" />
          <path d={sh.Libya} fill={GOLD} opacity={0.22 * interpolate(t, [m.a + 1.8, m.a + 2.6], [0, 1], clamp)} clipPath="url(#east)" />
        </> : null}
        {(m.chain || []).map((c, i) => {
          const p = interpolate(t, [c.at, c.at + 1.6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }); if (p <= 0) return null;
          const [x1, y1] = pt[c.from], [x2, y2] = pt[c.to]; const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 60;
          const len = 1400;
          return <path key={i} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={RED} strokeWidth={5} strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />;
        })}
        {(m.pins || []).map((p, i) => {
          const s = interpolate(t, [p.at, p.at + 0.5], [0, 1], clamp); if (s <= 0) return null; const [x, y] = pt[p.k];
          return <g key={i} opacity={s}>
            <circle cx={x} cy={y} r={9} fill={GOLD} /><circle cx={x} cy={y} r={9 + 18 * ((t * 0.8) % 1)} fill="none" stroke={GOLD} opacity={1 - ((t * 0.8) % 1)} />
            <text x={p.side === "l" ? x - 18 : x + 18} y={y - 14} textAnchor={p.side === "l" ? "end" : "start"} fontFamily={BODY} fontWeight={700} fontSize={30} fill="#fff" style={{ paintOrder: "stroke", stroke: "#05080b", strokeWidth: 6 }}>{p.t}</text>
          </g>;
        })}
      </svg>
      <div style={{ position: "absolute", right: 34, top: 30, fontFamily: BODY, fontWeight: 600, fontSize: 20, color: "#8d979d" }}>মানচিত্র: Natural Earth</div>
    </AbsoluteFill>
  );
};

// ---------- scene overlays (absolute time) ----------
const LabelCard: React.FC = () => {
  const t = useT(); const a = P.label.at - 0.3, b = end("label") + 0.5; if (t < a || t > b) return null; const o = fadeIO(t, a, b, 0.5);
  return (
    <AbsoluteFill style={{ opacity: o, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: MINT }}>শুরুর ভয়েস মেসেজটি</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: "#fff", margin: "6px 0 14px" }}>পুনর্নির্মিত দৃশ্য</div>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 34, color: SAND, opacity: interpolate(t, [cue("label", "কিন্তু"), cue("label", "কিন্তু") + 0.6], [0, 1], clamp) }}>কারো আসল অডিও নয় · কিন্তু গল্পগুলো আসল, রিপোর্ট করা</div>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 24, color: "#8d979d", marginTop: 40 }}>সূত্র: দ্য ডেইলি স্টার · আইওএম · ব্র্যাক · মিক্সড মাইগ্রেশন সেন্টার · ইউএনএইচসিআর · টিবিএস</div>
    </AbsoluteFill>
  );
};
const FbPost: React.FC<Win> = ({ a, b }) => {
  const t = useT(); const s = useIn(a); if (t < a || t > b) return null; const o = fadeIO(t, a, b, 0.4);
  return (
    <div style={{ position: "absolute", right: 180, top: 140, width: 620, opacity: o * Math.min(1, s * 1.3), transform: `translateY(${(1 - s) * 40}px) rotate(-1.5deg)` }}>
      <div style={{ background: "#f4f5f7", borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px" }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: "#c9ced6" }} />
          <div><div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26, color: "#1c1e21" }}>ইউরোপ যাত্রা সার্ভিস</div><div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 19, color: "#65676b" }}>স্পনসরড · ২ ঘণ্টা আগে</div></div>
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: "#1c1e21", padding: "0 22px 14px", lineHeight: 1.35 }}>ইতালি যেতে চান? ভাইয়েরা পৌঁছে গেছে ✅ সহজ কিস্তি, দ্রুত ফ্লাইট</div>
        <div style={{ height: 300, background: "linear-gradient(160deg, #6aa6c8 0%, #d9b98a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BODY, fontWeight: 700, fontSize: 30, color: "rgba(255,255,255,.85)" }}>হাসিমুখের ছবি</div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 0", fontFamily: BODY, fontWeight: 700, fontSize: 22, color: "#65676b" }}><span>লাইক</span><span>কমেন্ট</span><span>শেয়ার</span></div>
      </div>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 22, color: REC, marginTop: 14 }}>প্রতীকী নমুনা · আসল বিজ্ঞাপন নয় · ধরন: মিক্সড মাইগ্রেশন সেন্টার রিপোর্ট</div>
    </div>
  );
};
const FakeDoc: React.FC<Win> = ({ a, b }) => {
  const t = useT(); const s = useIn(a); const frame = useCurrentFrame();
  const st = spring({ frame: frame - S(a + 1.4), fps: FPS, config: { damping: 10 } });
  if (t < a || t > b) return null; const o = fadeIO(t, a, b, 0.4);
  return (
    <div style={{ position: "absolute", right: 220, top: 150, width: 560, height: 720, opacity: o * Math.min(1, s * 1.3), transform: `translateY(${(1 - s) * 40}px) rotate(2deg)`, background: "#efe9dc", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,.6)", padding: 40 }}>
      <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 30, color: "#2b3a4a" }}>DECRETO FLUSSI</div>
      <div style={{ fontFamily: "Montserrat", fontWeight: 600, fontSize: 20, color: "#6b7785", marginTop: 4 }}>Contratto di lavoro · Offerta</div>
      {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: 12, borderRadius: 6, background: "#d4ccbb", marginTop: 26, width: `${60 + ((i * 37) % 40)}%` }} />)}
      <div style={{ position: "absolute", right: 40, bottom: 90, transform: `rotate(-14deg) scale(${1.6 - 0.6 * st})`, opacity: Math.min(1, st * 1.5), border: `6px solid ${RED}`, borderRadius: 10, padding: "6px 26px", fontFamily: HEAD, fontWeight: 800, fontSize: 76, color: RED }}>ভুয়া</div>
      <div style={{ position: "absolute", left: 0, bottom: -44, fontFamily: BODY, fontWeight: 600, fontSize: 22, color: REC }}>প্রতীকী নমুনা</div>
    </div>
  );
};
const Steps: React.FC<Win & { steps: { at: number; t: string }[]; src: string }> = ({ a, b, steps, src }) => {
  const t = useT(); if (t < a || t > b) return null; const o = fadeIO(t, a, b, 0.4);
  return (
    <div style={{ position: "absolute", left: 90, top: 200, width: 640, opacity: o }}>
      {steps.map((s, i) => {
        const p = interpolate(t, [s.at, s.at + 0.5], [0, 1], clamp);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 22, opacity: 0.2 + 0.8 * p, transform: `translateX(${(1 - p) * -20}px)` }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: i === steps.length - 1 ? RED : "rgba(255,255,255,.12)", border: `2px solid ${i === steps.length - 1 ? RED : GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 28, color: "#fff" }}>{bn(i + 1)}</div>
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 40, color: "#fff", lineHeight: 1.2 }}>{s.t}</div>
          </div>
        );
      })}
      <Src text={src} o={1} />
    </div>
  );
};
const Wreck: React.FC<Win & { date: string; route: string; facts: string[]; at?: number[]; src: string }> = ({ a, b, date, route, facts, at, src }) => {
  const t = useT(); const s = useIn(a); if (t < a || t > b) return null; const o = fadeIO(t, a, b, 0.4);
  return (
    <div style={{ position: "absolute", left: 120, top: 220, width: 1300, opacity: o * Math.min(1, s * 1.3), transform: `translateY(${(1 - s) * 26}px)` }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 96, color: "#fff" }}>{date}</div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38, color: GOLD, marginBottom: 18 }}>{route}</div>
      {facts.map((f, i) => {
        const f0 = at ? at[i] : a + 1.2 + i * 2.2; const p = interpolate(t, [f0, f0 + 0.5], [0, 1], clamp);
        return <div key={i} style={{ fontFamily: BODY, fontWeight: 600, fontSize: 38, color: "#fff", marginTop: 12, opacity: p, borderLeft: `4px solid ${i === facts.length - 1 ? RED : "rgba(255,255,255,.3)"}`, paddingLeft: 20 }}>{f}</div>;
      })}
      <Src text={src} o={1} />
    </div>
  );
};
const Counter: React.FC<Win & { v: number; pre: string; post: string; src: string }> = ({ a, b, v, pre, post, src }) => {
  const t = useT(); if (t < a || t > b) return null; const o = fadeIO(t, a, b, 0.4);
  const n = interpolate(t, [a + 0.3, a + 4.3], [0, v], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o, background: "rgba(5,8,11,.72)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 40, color: SAND }}>{pre}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 250, color: "#fff", lineHeight: 1.05 }}>{bnInt(n)}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 56, color: RED }}>{post}</div>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 24, color: "#aab3b8", marginTop: 30 }}>সূত্র: {src}</div>
    </AbsoluteFill>
  );
};
const Checklist: React.FC<Win> = ({ a, b }) => {
  const t = useT(); if (t < a || t > b) return null; const o = fadeIO(t, a, b, 0.4);
  const rows = [
    { at: cue("check", "এক"), h: "এজেন্সির লাইসেন্স মিলিয়ে নিন", s: "oep.gov.bd/agencies · আরএল নম্বর · Active কি না", c: MINT },
    { at: cue("check", "দুই"), h: "বিএমইটির বহির্গমন ছাড়পত্র ছাড়া নয়", s: "oc.bmet.gov.bd", c: MINT },
    { at: cue("check", "তিন", 1), h: "“লিবিয়া হয়ে ইতালি” = লাল সংকেত", s: "দুবাই বা মিশর ঘুরিয়ে লিবিয়া — সবচেয়ে বড় বিপদ", c: RED },
  ];
  return (
    <div style={{ position: "absolute", left: 140, top: 180, width: 1500, opacity: o }}>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: GOLD }}>টাকা দেওয়ার আগে</div>
      {rows.map((r, i) => {
        const p = interpolate(t, [r.at, r.at + 0.5], [0, 1], clamp);
        return (
          <div key={i} style={{ display: "flex", gap: 30, alignItems: "flex-start", marginTop: 36, opacity: 0.15 + 0.85 * p }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, border: `3px solid ${r.c}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: r.c }}>{p > 0.5 ? (r.c === RED ? "!" : "✓") : ""}</div>
            <div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, color: "#fff" }}>{r.h}</div><div style={{ fontFamily: "Montserrat, " + BODY, fontWeight: 600, fontSize: 32, color: SKY }}>{r.s}</div></div>
          </div>
        );
      })}
    </div>
  );
};
const Hotline: React.FC = () => {
  const t = useT(); const a = P.close.at - 0.3, b = timing.endCard; if (t < a || t > b) return null; const o = fadeIO(t, a, b, 0.5);
  const s2 = interpolate(t, [cue("close", "প্রবাসী", 0), cue("close", "প্রবাসী", 0) + 0.6], [0, 1], clamp);
  const echo = interpolate(t, [cue("close", "শুরুর"), cue("close", "শুরুর") + 0.6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 140, top: 160, right: 140, opacity: 1 - echo }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: GOLD }}>বিদেশ যাওয়ার আগে</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "#fff", marginTop: 4 }}>কাগজ যাচাই করুন বিএমইটিতে</div>
        <div style={{ fontFamily: "Montserrat", fontWeight: 600, fontSize: 32, color: SKY, marginTop: 4 }}>bmet.gov.bd</div>
        <div style={{ display: "flex", gap: 60, marginTop: 70, opacity: s2 }}>
          <div><div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, color: SAND }}>প্রবাসবন্ধু কল সেন্টার · দেশ থেকে (টোল-ফ্রি, ২৪ ঘণ্টা)</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1.05 }}>১৬১৩৫</div></div>
          <div style={{ borderLeft: "2px solid rgba(255,255,255,.2)", paddingLeft: 60 }}><div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, color: SAND }}>বিদেশ থেকে</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 76, color: "#fff", lineHeight: 1.5 }}>+৮৮০ ৯৬১০ ১০২০৩০</div></div>
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 22, color: "#aab3b8", marginTop: 24 }}>সূত্র: ওয়েজ আর্নার্স কল্যাণ বোর্ড (portal.wewb.gov.bd), ১৮ নভেম্বর ২০২৬ দেখা</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: echo }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(22,30,36,.82)", borderRadius: 40, padding: "18px 34px 18px 22px", border: "1px solid rgba(255,255,255,.12)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "#2e3a42" }} />
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: "#cfd6da" }}>“পৌঁছাতে পারলে… কল দেব।”</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const EndCard: React.FC = () => {
  const t = useT(); const a = timing.endCard, b = timing.total; if (t < a) return null; const o = interpolate(t, [a, a + 0.6, b - 0.8, b], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#05080b", opacity: o, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Img src={staticFile("cob/logo-light.png")} style={{ height: 70, marginBottom: 40 }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 86, color: "#fff" }}>লিবিয়া হয়ে ইউরোপ</div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: RED, marginTop: 6 }}>মানব পাচারের মরণপথ</div>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: "#a9b2b7", marginTop: 40 }}>সব তথ্যসূত্র ডেসক্রিপশনে · পুনর্নির্মিত দৃশ্যগুলো এআই দিয়ে তৈরি</div>
    </AbsoluteFill>
  );
};

const DS = "দ্য ডেইলি স্টার, ২৬ সেপ্টেম্বর ২০২৬";
const MMC = "মিক্সড মাইগ্রেশন সেন্টার রিপোর্ট, মার্চ ২০২৬ (ইনফোমাইগ্রেন্টস)";
const Overlays: React.FC = () => (
  <>
    <LabelCard />
    {/* village */}
    <Place a={P.village.at} b={P.village.at + 8} name="চুয়াডাঙ্গা · আলমডাঙ্গা" sub="একটি পরিবারের ঘটনা · নাম প্রকাশ করা হলো না" />
    <Items a={cue("village", "সে")} b={cue("village", "সব", 0, -0.2)} title="দালালের হিসাব" src={DS} items={[
      { at: cue("village", "সে"), l: "প্রতিশ্রুতি: ইতালিতে চাকরি", v: `মাসে ৳${bnInt(180000)}`, c: SKY },
      { at: cue("village", "দালাল", 2), l: "দালালের দাবি → পরিবার দিল (এনজিও আর মহাজনের কাছে ধার করে)", v: `৳${bnInt(570000)}`, strike: `৳${bnInt(1000000)}` },
    ]} />
    <Line a={cue("village", "কিন্তু", 1)} b={end("village") + 0.4} text="সে কি ইতালিতে পৌঁছাতে পেরেছিল?" center y={420} />
    {timing.chapters.map((c) => <Chapter key={c.id} n={c.n} title={c.title} at={c.at} />)}
    {/* why */}
    {beats([
      { a: cue("why", "ইনফোমাইগ্রেন্টসের"), el: "s1" }, { a: cue("why", "মিক্সড"), el: "s2" }, { a: cue("why", "দেশে"), el: "s3" }, { a: cue("why", "দ্য"), el: "s4" }, { a: cue("why", "শুধু"), el: "s5" },
      { a: cue("why", "তাছাড়া"), el: "s6" }, { a: cue("why", "তাই"), el: "s7" },
    ], cue("why", "আবার", 0, -0.3)).map((x) => {
      const w = { a: x.a, b: x.b, key: x.el };
      if (x.el === "s1") return <Stat {...w} big="~৫ লাখ" label="বাংলাদেশি প্রতি বছর কাজ নিয়ে বিদেশ যান" src="ইনফোমাইগ্রেন্টস, ১৯ মার্চ ২০২৬" />;
      if (x.el === "s2") return <Stat {...w} big="১৮–২৯" label="বছর — লিবিয়ার পথে যাওয়া বেশিরভাগের বয়স" sub="উত্তরদাতারা সবাই পুরুষ" src={MMC} />;
      if (x.el === "s3") return <Line {...w} kicker="ঠেলে দেয়" text="বেকারত্ব · চড়া খরচ · ঋণের বোঝা" src={MMC} />;
      if (x.el === "s4") return <Stat {...w} big="~২,১৭,০০০" label="বাংলাদেশি বৈধভাবে থাকেন ইতালিতে" src="টিবিএস, ৩ নভেম্বর ২০২৬" />;
      if (x.el === "s5") return <Stat {...w} big="$১.৭ বিলিয়ন" label="ইতালি থেকে রেমিট্যান্স, ২০২৫" src="টিবিএস, ৩ নভেম্বর ২০২৬" color={GOLD} />;
      if (x.el === "s6") return <Line {...w} kicker="টানে" text="গন্তব্য ইউরোপ হলে ধার পাওয়াও সহজ" src={MMC} />;
      return <Line {...w} text="পুরো পরিবারের একটা সিদ্ধান্ত" src={MMC} />;
    })}
    <Line a={cue("why", "আবার")} b={end("why") + 0.3} kicker="উপসাগরে কাজ না পেলে" text="দালাল বেচে: “পরের ধাপ লিবিয়া”" src={MMC} />
    {/* dalal */}
    <FbPost a={cue("dalal", "ফেসবুক")} b={cue("dalal", "আর", 0, -0.2)} />
    <Line a={cue("dalal", "ফেসবুক")} b={cue("dalal", "আর", 0, -0.2)} kicker="কৌশল ১" text="ফেসবুকে হাসিমুখের বিজ্ঞাপন" x={120} y={380} w={800} src={MMC} />
    <Line a={cue("dalal", "আর")} b={cue("dalal", "মিক্সড", 0, -0.2)} kicker="কৌশল ২ · চেনা দালালের কথা" text="আমার নিজের ছেলেই তো ইতালিতে আছে" quote src={MMC} />
    <Stat a={cue("dalal", "মিক্সড")} b={cue("dalal", "আরেকটা", 0, -0.2)} big="১ সপ্তাহ – ১ মাস" label="দালালের সাথে কথা থেকে রওনা — ভাবার সময় নেই" src={MMC} />
    <Line a={cue("dalal", "আরেকটা")} b={cue("dalal", "ভুয়া", 0, -0.4)} kicker="কৌশল ৩" text="ইতালির বৈধ কর্মী-কোটা “ডেক্রেতো ফ্লুসি”-র নাম" x={120} y={340} w={900} src={MMC} />
    <FakeDoc a={cue("dalal", "ভুয়া", 0, 5.7)} b={cue("dalal", "মিক্সড", 1, -0.2)} />
    <Line a={cue("dalal", "ভুয়া", 0, 5.7)} b={cue("dalal", "মিক্সড", 1, -0.2)} text="ভুয়া চাকরির কাগজের আড়ালে বিক্রি হয় পাচারের পথ" x={120} y={360} w={820} src={MMC} />
    <Line a={cue("dalal", "মিক্সড", 1)} b={end("dalal") + 0.3} text="পাচারকারীর কাছে বাংলাদেশিরা “সোনা”" src={`${MMC} — কারণ পরিবার টাকা জোগাড় করবেই`} />
    {/* route */}
    <LibyaMap m={{ a: cue("route", "দুই", 1, -1.2), b: cue("route", "গবেষকরা", 0, -4.7), split: true, pins: [{ at: cue("route", "পশ্চিম"), k: "tripoli", t: "ত্রিপোলি", side: "l" }, { at: cue("route", "আর", 1), k: "benghazi", t: "বেনগাজি" }] }} />
    <Items a={cue("route", "দুই", 1, -1.2)} b={cue("route", "মিক্সড", 1, -0.2)} x={110} y={230} w={720} title="লিবিয়া, ২০১১ থেকে দুই ভাগ" src="ইনফোমাইগ্রেন্টস / মিক্সড মাইগ্রেশন সেন্টার" items={[
      { at: cue("route", "পশ্চিম"), l: "পশ্চিম · ত্রিপোলি: জাতিসংঘ-স্বীকৃত সরকার", c: SKY }, { at: cue("route", "আর", 1), l: "পূর্ব · বেনগাজি: খলিফা হাফতারের বাহিনী", c: GOLD },
    ]} />
    <Items a={cue("route", "মিক্সড", 1)} b={cue("route", "এখন", 1, -0.4)} x={110} y={230} w={720} src={MMC} items={[
      { at: cue("route", "মিক্সড", 1), l: "২০২০ থেকে পূর্ব লিবিয়া", v: "টাকা দিলে ভিসা", c: GOLD }, { at: cue("route", "গবেষকরা"), l: "আধা-বৈধ প্রবেশপথ — পুরো করিডোরের “মেরুদণ্ড”", c: RED },
    ]} />
    <Line a={cue("route", "এখন", 1)} b={end("route") + 0.3} kicker="এখন যাত্রা" text="তুরস্ক বা উপসাগর হয়ে বেনগাজি" src={MMC} />
    {/* benghazi */}
    <LibyaMap m={{ a: P.benghazi.at - 0.3, b: 351.0, chain: [{ at: cue("benghazi", "এরপরই", 0, -0.2), from: "benghazi", to: "sabha" }], pins: [{ at: P.benghazi.at + 0.5, k: "benghazi", t: "বেনগাজি বিমানবন্দর" }, { at: cue("benghazi", "এরপরই", 0, 1.2), k: "sabha", t: "দক্ষিণে", side: "l" }] }} />
    <LibyaMap m={{ a: cue("benghazi", "সেখান", 1, -0.3), b: cue("benghazi", "ইনফোমাইগ্রেন্টসকে", 0, -0.3), chain: [{ at: cue("benghazi", "ত্রিপোলি"), from: "sabha", to: "tripoli" }], pins: [{ at: cue("benghazi", "সেখান", 1), k: "sabha", t: "দক্ষিণ", side: "l" }, { at: cue("benghazi", "উপকূলের"), k: "tripoli", t: "ত্রিপোলি · পশ্চিম উপকূল", side: "l" }] }} />
    <Steps a={P.benghazi.at} b={cue("benghazi", "সেখান", 1, -0.4)} src={MMC} steps={[
      { at: cue("benghazi", "পিকআপ"), t: "বিমানবন্দরে লিবিয়ান ড্রাইভার" }, { at: cue("benghazi", "সেফ"), t: "“সেফ হাউস”, বাংলাদেশি সহযোগী" }, { at: cue("benghazi", "হাতবদল"), t: "হাতবদল: লিবিয়ান চক্র" },
      { at: cue("benghazi", "পাসপোর্ট"), t: "পাসপোর্ট কেড়ে নেওয়া" }, { at: cue("benghazi", "চোরাচালান"), t: "চোরাচালান → মানবপাচার" },
    ]} />
    <Items a={cue("benghazi", "ইনফোমাইগ্রেন্টসকে")} b={end("benghazi") + 0.4} title="দুজনের অভিজ্ঞতা" src="ইনফোমাইগ্রেন্টস, ১৯ মার্চ ২০২৬" items={[
      { at: cue("benghazi", "ইনফোমাইগ্রেন্টসকে"), l: "আরও ~৩০ জনের সাথে এক ঘরে", v: "দেড় মাস", c: GOLD }, { at: cue("benghazi", "আরেকজন"), l: "লিবিয়ায় — তার ৫ মাস বিনা বেতনে কাজ, বেতন চাইলে মার", v: "১০ মাস", c: RED },
    ]} />
    {/* game ghor */}
    <Place a={P.gameghor.at + 1} b={cue("gameghor", "ডেইলি", 0, -0.3)} name="“গেম ঘর”" sub="ত্রিপোলির পথে, আটকে রাখার ঘর" />
    <Items a={cue("gameghor", "মুক্তিপণ")} b={cue("gameghor", "পরিবারটি", 0, -0.2)} src={DS} items={[
      { at: cue("gameghor", "মুক্তিপণ"), l: "ছোট ভাইয়ের মুক্তিপণ — নির্যাতনের ভিডিও পাঠিয়ে", v: `৳${bnInt(2000000)} চাওয়া`, c: RED },
      { at: cue("gameghor", "দশ", 0), l: "জমি বেচে আর ধার করে দেওয়া হয়", v: `৳${bnInt(1000000)}`, c: GOLD },
    ]} />
    <Items a={cue("gameghor", "পরিবারটি")} b={cue("gameghor", "মিক্সড", 0, -0.2)} title="মামলার কথা বলতেই" src={DS} items={[
      { at: cue("gameghor", "অপহরণ"), l: "লিবিয়ায় ১১ বছরের বেশি কাজ করা বাবাকে অপহরণ", c: RED }, { at: cue("gameghor", "দশ", 2), l: "আবার জমি বেচে মুক্তিপণ", v: `৳${bnInt(1000000)}`, c: GOLD },
      { at: cue("gameghor", "অবশেষে"), l: "৫ ডিসেম্বর ২০২৫ — বাবা দেশে ফেরেন", c: MINT },
    ]} />
    <Line a={cue("gameghor", "মিক্সড")} b={end("gameghor") + 0.3} kicker="অনেক সময়" text="সাজানো অপহরণ — দফায় দফায় টাকা আদায়" src={MMC} />
    {/* brac */}
    <Bars a={P.brac.at} b={cue("brac", "মুক্তিপণের", 0, -0.2)} title="লিবিয়া-ফেরত বাংলাদেশিদের অভিজ্ঞতা" sub="ব্র্যাকের গবেষণা" max={100} src="ব্র্যাক, দ্য ডেইলি স্টারে প্রকাশিত, ২৬ সেপ্টেম্বর ২০২৬" rows={[
      { l: "প্রতিশ্রুত কাজ পাননি", v: 75, txt: "৭৫%", at: cue("brac", "পঁচাত্তর") }, { l: "ক্যাম্পে আটকে ছিলেন", v: 93, txt: "৯৩%", at: cue("brac", "তিরানব্বই") },
      { l: "শারীরিক নির্যাতনের শিকার", v: 79, txt: "৭৯%", at: cue("brac", "উনআশি") }, { l: "চলাফেরার স্বাধীনতা ছিল না", v: 69, txt: "৬৯%", at: cue("brac", "উনসত্তর") },
    ]} />
    <Wreck a={cue("brac", "মুক্তিপণের")} b={end("brac") + 0.4} date="মিজদাহ, মে ২০২০" at={[cue("brac", "পাচারকারীরা"), cue("brac", "তাদের", 1), cue("brac", "ঘটনার")]} route="লিবিয়া" facts={["৩০ জন অভিবাসীকে গুলি করে হত্যা", "তাদের ২৬ জন বাংলাদেশি", "পরিবারপ্রতি ~১০ লাখ টাকা মুক্তিপণ চাওয়া হয়েছিল"]} src="দ্য ডেইলি স্টার, ৩০ মে ২০২০" />
    {/* sea */}
    <Stat a={P.sea.at + 0.6} b={cue("sea", "ডেইলি", 0, -0.2)} big="~৩০০ কিমি" label="জুওয়ারা থেকে লাম্পেদুসা" src="স্থানাঙ্ক থেকে হিসাব (গ্রেট-সার্কেল)" x={120} y={560} />
    <Line a={cue("sea", "ডেইলি")} b={cue("sea", "কিন্তু", 0, -0.2)} kicker="চুয়াডাঙ্গার ছোট ভাই" text="আরেক চক্রকে ৳৫ লাখ · ২০২৩-এর শেষে ইতালি" src={DS} x={120} y={560} />
    <Items a={cue("sea", "মিক্সড")} b={cue("sea", "বাস্তবে", 0, -0.4)} title="দালালের কথা" src={MMC} items={[
      { at: cue("sea", "মিক্সড"), l: "“বড় জাহাজে তোলা হবে”", c: SKY }, { at: cue("sea", "আরও", 1), l: "“ইতালির নৌবাহিনী এসে তুলে নেবে”", c: SKY }, { at: cue("sea", "কথাটা"), l: "সত্যি নয়", c: RED },
    ]} />
    <Line a={cue("sea", "মিক্সড", 1)} b={cue("sea", "আবার", 0, -0.3)} kicker="একজনের নৌকা" text="~১৩২ জন · তেল ফুরিয়ে ভাসছিল · তেলের ট্যাংকার উদ্ধার করে" src="ইনফোমাইগ্রেন্টস, ১৯ মার্চ ২০২৬" />
    <Bars a={cue("sea", "আবার")} b={cue("sea", "অথচ", 0, -0.2)} title="সাগর থেকে ধরে লিবিয়ায় ফেরত" sub="মধ্য-ভূমধ্যসাগরীয় পথ" max={27116} src="আইওএম লিবিয়া মেরিটাইম আপডেট (১৩ জুন ২০২৬) · লিবিয়া রিভিউ, ১৯ সেপ্টেম্বর ২০২৬" rows={[
      { l: "২০২৫ (সারা বছর)", v: 27116, txt: "২৭,১১৬", at: cue("sea", "সাতাশ") }, { l: "২০২৬ (সেপ্টেম্বরের মাঝামাঝি পর্যন্ত)", v: 17067, txt: "১৭,০৬৭", at: cue("sea", "সতেরো") },
    ]} />
    <Line a={cue("sea", "অথচ")} b={cue("sea", "ফেরত", 3, -0.3)} kicker="আইওএম" text="লিবিয়া নিরাপদ বন্দর নয়" quote src="আইওএম লিবিয়া মেরিটাইম আপডেট, ১৩ জুন ২০২৬" />
    <Line a={cue("sea", "ফেরত", 3)} b={end("sea") + 0.3} kicker="অক্টোবরে দেশে ফেরা একটি দল" text="৩৬ জন সাগরে ধরা পড়ার পর তাজুরা আটককেন্দ্রে" src="টিবিএস, ২৬ অক্টোবর ২০২৬" />
    {/* wrecks */}
    <Wreck a={cue("wrecks", "প্রথম")} b={cue("wrecks", "দ্বিতীয়", 0, -0.3)} date="২১ মার্চ ২০২৬" at={[cue("wrecks", "দালালরা"), cue("wrecks", "নৌকাটা"), cue("wrecks", "আঠারোজন")]} route="তোবরুক → গ্রিস" facts={["বড় নৌকার কথা দিয়ে ছোট নৌকা, স্যাটেলাইট ফোন বা জিপিএস নেই", "পথ হারিয়ে ~৬ দিন ভেসে ছিল, খাবার-পানি ছাড়া", "৩৮ জন বাংলাদেশির ১৮ জন আর ফেরেননি"]} src="দ্য ডেইলি স্টার, ২৯ মার্চ ও ১৭ আগস্ট ২০২৬" />
    <Wreck a={cue("wrecks", "দ্বিতীয়")} b={cue("wrecks", "তৃতীয়", 0, -0.3)} date="এপ্রিল ২০২৬" at={[cue("wrecks", "একশোর"), cue("wrecks", "কয়েক"), cue("wrecks", "বত্রিশজনকে")]} route="তাজুরা → (লাম্পেদুসা)" facts={["১০০-র বেশি যাত্রী, উত্তাল সাগর", "কয়েক ঘণ্টায় নৌকা উল্টে যায়", "৩২ জন উদ্ধার · ৭০-এর বেশি নিখোঁজ"]} src="দ্য ডেইলি স্টার · ইউরোনিউজ, ৫ এপ্রিল ২০২৬" />
    <Wreck a={cue("wrecks", "তৃতীয়", 0, 6.8)} b={end("wrecks") + 0.4} date="৩–১৩ আগস্ট ২০২৬" at={[cue("wrecks", "তৃতীয়", 0, 7.3), cue("wrecks", "তেল"), cue("wrecks", "নয়জন")]} route="লিবিয়া → গ্রিস, পৌঁছায় মিশরের উপকূলে" facts={["২৫ জনের রাবারের নৌকায় ৪২ জন (৩৮ জন বাংলাদেশি)", "তেল শেষ, ~১১ দিন ভেসে থাকা", "৯ জন বাংলাদেশি মারা যান · ২৯ জন উদ্ধার"]} src="দ্য ডেইলি স্টার, ১৭ আগস্ট ২০২৬" />
    {/* number */}
    <Counter a={cue("number", "আইওএম-এর")} b={cue("number", "এত", 0, -0.2)} v={26964} pre="২০১৪ থেকে মধ্য-ভূমধ্যসাগরের পথে মারা গেছেন অন্তত" post="জন — বিশ্বের সবচেয়ে প্রাণঘাতী অভিবাসন পথ" src="আইওএম মিসিং মাইগ্র্যান্টস প্রজেক্ট, ১৮ নভেম্বর ২০২৬ দেখা" />
    <Bars a={cue("number", "এত")} b={cue("number", "ব্র্যাকের", 0, -0.2)} title="ইতালিতে সাগরপথে আসা মানুষ, ২০২৬" sub="জাতীয়তা অনুযায়ী · ১ জানুয়ারি – ৩০ সেপ্টেম্বর" max={5757} src="ইউএনএইচসিআর অপারেশনাল ডেটা পোর্টাল, ইতালি (ইতালি সরকারের তথ্য)" rows={[
      { l: "বাংলাদেশ (২৫.১%)", v: 5757, txt: "৫,৭৫৭", at: cue("number", "বাংলাদেশ"), c: RED }, { l: "আলজেরিয়া", v: 2759, txt: "২,৭৫৯", at: cue("number", "জাতিসংঘের", 0, 0.4), c: "rgba(255,255,255,.35)" },
      { l: "সোমালিয়া", v: 2688, txt: "২,৬৮৮", at: cue("number", "জাতিসংঘের", 0, 0.8), c: "rgba(255,255,255,.35)" }, { l: "সুদান", v: 1753, txt: "১,৭৫৩", at: cue("number", "জাতিসংঘের", 0, 1.2), c: "rgba(255,255,255,.35)" },
    ]} />
    <Stat a={cue("number", "ব্র্যাকের")} b={end("number") + 0.4} big="~১,১০,০০০" label="বাংলাদেশি এই পথে ইউরোপে, ২০০৯ – জুন ২০২৬" src="ফ্রন্টেক্সের তথ্য, ব্র্যাকের সূত্রে দ্য ডেইলি স্টার, ২৬ সেপ্টেম্বর ২০২৬" />
    {/* money */}
    <Items a={P.money.at} b={cue("money", "চুয়াডাঙ্গার", 0, -0.3)} title="জনপ্রতি খরচ (মার্কিন ডলার)" src={MMC} items={[
      { at: cue("money", "মিক্সড"), l: "পুরো প্যাকেজ", v: "$১০,০০০–১৪,০০০", c: GOLD }, { at: cue("money", "কিন্তু"), l: "লিবিয়ার ভেতরে চাঁদাবাজি আর বাড়তি খরচ মিলিয়ে", v: "$১৫,০০০–১৭,০০০", c: RED },
      { at: cue("money", "তাদের"), l: "এই পথের ব্যবসা, বছরে", v: "$১৬–১৯ কোটি", c: SKY },
    ]} />
    <Bars a={cue("money", "চুয়াডাঙ্গার")} b={cue("money", "অর্থাৎ", 0, -0.2)} title="চুয়াডাঙ্গার একটি পরিবার — মোট যা গেছে" sub="নাম প্রকাশ করা হলো না" max={10} src={DS} rows={[
      { l: "দালালকে প্রথম কিস্তি", v: 5.7, txt: "৳৫.৭ লাখ", at: cue("money", "শুরুতে"), c: GOLD }, { l: "ছোট ভাইয়ের মুক্তিপণ", v: 10, txt: "৳১০ লাখ", at: cue("money", "ত্রিপোলির"), c: RED },
      { l: "নৌকায় জায়গা, আরেক চক্রকে", v: 5, txt: "৳৫ লাখ", at: cue("money", "সাগর"), c: SKY }, { l: "বাবার মুক্তিপণ", v: 10, txt: "৳১০ লাখ", at: cue("money", "বাবার"), c: "#ff7a6e" },
    ]} />
    <Stat a={cue("money", "অর্থাৎ")} b={cue("money", "আর", 3, -0.3)} big="৳৩০.৭ লাখ" label="মোট — চুয়াডাঙ্গার একটি পরিবার" sub="এখনও মাসে ১–১.৫ লাখ টাকা কিস্তি" src={DS} color={GOLD} />
    <Bars a={cue("money", "আর", 3)} b={cue("money", "চুয়াডাঙ্গার", 1, -0.2)} title="বিচারের অবস্থা" sub="মানবপাচার মামলা · স্বরাষ্ট্র মন্ত্রণালয়ের তথ্য" max={5284} src="ব্র্যাক, দ্য ডেইলি স্টারে প্রকাশিত, ২৬ সেপ্টেম্বর ২০২৬" rows={[
      { l: "ঝুলে আছে (মে ২০২৬ পর্যন্ত)", v: 5284, txt: "৫,২৮৪", at: cue("money", "পাঁচ", 2) }, { l: "নিষ্পত্তি (জানুয়ারি–মে ২০২৬)", v: 17, txt: "১৭", at: cue("money", "বছরের"), c: MINT },
    ]} />
    <Line a={cue("money", "চুয়াডাঙ্গার", 1)} b={end("money") + 0.3} kicker="এই পরিবারের মামলা (১৯ জুলাই ২০২৫)" text="সিআইডি: চারজনের বিরুদ্ধে অভিযোগের সত্যতা মিলেছে" src={DS} />
    {/* return */}
    <Items a={cue("return", "আইওএম-এর")} b={cue("return", "ব্র্যাকের", 0, -0.2)} title="আইওএম-এর স্বেচ্ছায় ফেরার ফ্লাইট, ২০২৬" src="লিবিয়া রিভিউ (১ জুলাই) · টিবিএস (১ সেপ্টেম্বর, ২৬ ও ২৯ অক্টোবর ২০২৬)" items={[
      { at: cue("return", "বেনগাজি"), l: "জুলাই · বেনগাজি — ১৭৩ জন", c: MINT }, { at: cue("return", "ত্রিপোলি"), l: "১ সেপ্টেম্বর · তাজুরা আটককেন্দ্র, ত্রিপোলি — ১৭৪ জন", c: MINT },
      { at: cue("return", "ত্রিপোলি", 0, 0.7), l: "২৭ অক্টোবর · ত্রিপোলি — ১৭৪ জন", c: MINT }, { at: cue("return", "মিসরাতা"), l: "২৯ অক্টোবর · মিসরাতা — ১৭২ জন", c: MINT },
    ]} />
    <Stat a={cue("return", "ব্র্যাকের")} b={cue("return", "কিন্তু", 0, -0.3)} big="~১৫,০০০" label="বাংলাদেশি লিবিয়া থেকে ফিরেছেন, গত ছয় বছরে" src={DS + " (ব্র্যাক)"} />
    <Line a={cue("return", "কিন্তু", 0, 6.2)} b={end("return") + 0.3} text="ফেরা মানে শেষ নয় — ধার থেকে যায়" center y={420} />
    {/* legal */}
    <Bars a={P.legal.at} b={cue("legal", "তবে", 0, -0.2)} title="ইতালির বৈধ কর্মী-কোটা · ডেক্রেতো ফ্লুসি" sub="মোট ৪,৯৭,৫৫০ জন · বাংলাদেশের জন্য সংরক্ষিত কোটা আছে" max={166850} src="টিবিএস, ৩ নভেম্বর ২০২৬" rows={[
      { l: "২০২৬", v: 164850, txt: "১,৬৪,৮৫০", at: cue("legal", "টিবিএস-এর"), c: MINT }, { l: "২০২৭", v: 165850, txt: "১,৬৫,৮৫০", at: cue("legal", "টিবিএস-এর", 0, 0.5), c: MINT },
      { l: "২০২৮", v: 166850, txt: "১,৬৬,৮৫০", at: cue("legal", "টিবিএস-এর", 0, 1.0), c: MINT },
    ]} />
    <Items a={cue("legal", "তবে")} b={cue("legal", "আর্টিকেল", 0, -0.5)} title="দুটি কথা পরিষ্কার" src="টিবিএস, ৩ নভেম্বর ২০২৬ (ঢাকায় ইতালীয় দূতাবাসের সেমিনার)" items={[
      { at: cue("legal", "এক"), l: "নুল্লা ওস্তা = মালিকের কর্মী নেওয়ার অনুমতি · ঢোকার অনুমতি নয় · ভিসা দেয় দূতাবাস", c: SKY },
    ]} />
    <Items a={cue("legal", "আর্টিকেল", 0, 5.7)} b={cue("legal", "আর", 1, -0.3)} src="টিবিএস, ৩ নভেম্বর ২০২৬" items={[
      { at: cue("legal", "আর্টিকেল", 0, 5.7), l: "আর্টিকেল ২৩: দেশেই ভাষা + নাগরিক + কাজের প্রশিক্ষণ · খরচ মালিকের · কোটার বাইরে", c: MINT },
      { at: cue("legal", "বাংলাদেশে", 1), l: "ইতালির রাষ্ট্রদূত: দালালকে টাকা দিলে ভিসা নয়", c: RED },
    ]} />
    <Stat a={cue("legal", "আর", 1)} b={end("legal") + 0.3} big="৳৩ লাখ" label="পর্যন্ত জামানত ছাড়া অভিবাসন ঋণ · প্রবাসী কল্যাণ ব্যাংক" src="pkb.gov.bd (অভিবাসন ঋণ পাতা)" color={MINT} />
    {/* check */}
    <Checklist a={P.check.at} b={cue("check", "চুয়াডাঙ্গার", 0, -0.3)} />
    <Line a={cue("check", "চুয়াডাঙ্গার")} b={end("check") + 0.4} kicker="চুয়াডাঙ্গার পরিবারের বড় ভাই" text="পরিবারটা পুরোপুরি ভেঙে গেছে" quote src={DS} y={330} />
    <Hotline />
    <EndCard />
  </>
);

// ---------- captions ----------
type Cap = { s: number; e: number; words: { w: string; s: number; e: number }[]; vn?: boolean };
const Captions: React.FC = () => {
  const t = useT(); const c = (caps as Cap[]).find((x) => t >= x.s - 0.05 && t <= x.e + 0.25); if (!c) return null;
  const o = interpolate(t, [c.s - 0.05, c.s + 0.12, c.e + 0.1, c.e + 0.25], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: 1500, textAlign: "center", padding: "8px 26px 12px", borderRadius: 10, background: "rgba(0,0,0,.42)", fontFamily: BODY, fontWeight: 700, fontSize: 44, lineHeight: 1.35, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>
        {c.vn ? <span style={{ color: SAND }}>“</span> : null}
        {c.words.map((w, i) => { const on = t >= w.s && t < w.e + 0.08; const past = t >= w.e; return <span key={i} style={{ color: on ? GOLD : past ? "#fff" : "rgba(255,255,255,.62)" }}>{w.w}{i < c.words.length - 1 ? " " : ""}</span>; })}
        {c.vn ? <span style={{ color: SAND }}>”</span> : null}
      </div>
    </div>
  );
};

// ---------- audio ----------
const Mix: React.FC = () => {
  const sfx = (src: string, at: number, vol: number, dur?: number, fi = 0, fo = 0) => (
    <Sequence key={src + at} from={S(at)} durationInFrames={dur ? S(dur) : undefined}>
      <Audio src={E0(`sfx/${src}`)} volume={(f) => { const t = f / FPS; return vol * (fi ? Math.min(1, t / fi) : 1) * (fo && dur ? Math.min(1, (dur - t) / fo) : 1); }} />
    </Sequence>
  );
  const T = timing.total;
  return (
    <>
      {VO.map((v) => <Sequence key={v.id} from={S(v.at)} durationInFrames={S(v.len + 0.5)}><Audio src={E1(`vo/${v.id}.mp3`)} volume={v.id === "voicenote" ? 0.9 : 1} /></Sequence>)}
      <Sequence from={S(11.6)}>
        <Audio src={E0("sfx/score.mp3")} loop volume={(f) => { const t = f / FPS + 11.6; const base = speaking(t) ? 0.065 : 0.15; /* ~6 dB lower than 0.13/0.3 so VO sits clearly above the bed */ return base * Math.min(1, (t - 11.6) / 1.5) * interpolate(t, [T - 4, T], [1, 0], clamp); }} />
      </Sequence>
      {sfx("sea.mp3", 0, 0.55, 13.0, 1.2, 1.6)}{sfx("engine.mp3", 0.2, 0.32, 12.0, 1.5, 1.4)}{sfx("wind.mp3", 0, 0.28, 12.6, 1, 1.5)}
      {sfx("boom.mp3", 11.7, 0.9)}{sfx("whoosh.mp3", 16.5, 0.5)}{sfx("whoosh.mp3", 29.5, 0.45)}
      {timing.chapters.map((c) => sfx("whoosh.mp3", c.at, 0.4))}
      {sfx("door.mp3", P.gameghor.at - 0.2, 0.7)}
      {sfx("sea.mp3", P.sea.at - 0.4, 0.28, 30, 1.5, 2)}{sfx("sea.mp3", P.wrecks.at - 0.4, 0.22, 30, 1.5, 2)}
      {sfx("boom.mp3", cue("number", "আইওএম-এর"), 0.8)}
    </>
  );
};

export const LibyaEp1: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #101b22 0%, #05080b 72%)" }}>
    <Sequence from={0} durationInFrames={S(11.8)}><ColdOpen /></Sequence>
    <Sequence from={S(11.8)} durationInFrames={S(5.0)}><Title /></Sequence>
    <Sequence from={S(16.8)} durationInFrames={S(13.0)}><Hook phoneAt={cue("hook", "তারপর") - 16.8} offAt={cue("hook", "ফোন") - 16.8} q1At={cue("hook", "কোন") - 16.8} q2At={cue("hook", "কত") - 16.8} /></Sequence>
    {BG.map((it, i) => <Sequence key={"bg" + i} from={S(it.a)} durationInFrames={Math.max(1, S(it.b - it.a))}><BgClip it={it} /></Sequence>)}
    {(broll as Slot[]).map((s) => <Sequence key={s.id} from={S(s.start_s)} durationInFrames={S(s.dur_s)}><BrollSlot s={s} /></Sequence>)}
    <Overlays />
    <Ledger />
    <Captions />
    <Grain />
    <Mix />
  </AbsoluteFill>
);
