// Vertical (1080x1920) COB data reels — one template, many configs. VO in public/drvo/NN.mp3.
// Facts (sourced on screen): ASK via Ittefaq (mob deaths 2025); Jatri Kalyan Samity & Road Safety Foundation (road 2025);
// Bangladesh Bank via RisingBD (NPL Mar 2026); White Paper committee & GFI (money laundering); DGHS via Dhaka Tribune
// (dengue); CAPS, IQAir via bdnews24, Prothom Alo (air).
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BN, bn, clamp } from "../news/NewsKit";
import { RED, RED2, INK, MUTE, AMBER, HEAD, T, Grain } from "./HoneyTrap";

export type DR = {
  id: string; vo: string; dur: number; tag: string; hook: [string, string]; accent: string; tint: string;
  big: { v: number; dec?: number; pre?: string; suf?: string; label: string; color?: string };
  bars?: { title: string; rows: [string, number][]; unit?: string };
  facts: string[]; source: string; cta: string;
};
const fmt = (v: number, dec = 0) => bn(dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN"));

export const DataReel: React.FC<{ r: DR }> = ({ r }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const voEnd = D - 45;
  const tBars = 0.33 * voEnd, step = r.facts.length ? (voEnd * 0.62) / r.facts.length : 0;
  const hook = spring({ frame: f - 4, fps: 30, config: { damping: 14 } });
  const end = T(f, voEnd, voEnd + 18);
  const max = r.bars ? Math.max(...r.bars.rows.map((x) => x[1])) : 1;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 1100px at ${50 + Math.sin(f / 70) * 10}% 30%, ${r.tint}, transparent 62%), linear-gradient(170deg,#14222a,${INK} 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "72px 72px", transform: `translateY(${(f * 0.5) % 72}px)` }} />
      {/* header */}
      <div style={{ position: "absolute", left: 60, top: 80, display: "flex", alignItems: "center", gap: 20 }}>
        <Img src={staticFile("cob/logo-round.png")} style={{ height: 100 }} />
        <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white", background: RED, padding: "6px 22px 10px", borderRadius: 10 }}>{r.tag}</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 230, fontFamily: HEAD, fontWeight: 800, fontSize: 84, lineHeight: 1.12, color: "white", opacity: hook, transform: `translateY(${(1 - hook) * 50}px)` }}>{r.hook[0]}<br /><span style={{ color: r.accent }}>{r.hook[1]}</span></div>
      {/* big number */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 560, opacity: T(f, 20, 40) }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 210, lineHeight: 1, color: r.big.color || AMBER, fontVariantNumeric: "tabular-nums", textShadow: "0 0 60px rgba(255,176,32,.25)" }}>{r.big.pre || ""}{fmt(T(f, 25, 25 + 60, 0, r.big.v), r.big.dec)}{r.big.suf || ""}</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: "#d8e0e4", marginTop: 8 }}>{r.big.label}</div>
      </div>
      {/* bars or facts */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 900 }}>
        {r.bars && (
          <div style={{ opacity: T(f, tBars - 10, tBars + 10) }}>
            <div style={{ fontFamily: BN, fontSize: 34, color: MUTE, marginBottom: 14 }}>{r.bars.title}</div>
            {r.bars.rows.map(([k, v], i) => {
              const p = T(f, tBars + i * 12, tBars + i * 12 + 30);
              return (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "260px 1fr 150px", alignItems: "center", gap: 18, marginBottom: 16 }}>
                  <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white" }}>{k}</span>
                  <div style={{ height: 34, borderRadius: 17, background: "rgba(255,255,255,.08)" }}><div style={{ width: `${(v / max) * 100 * p}%`, height: "100%", borderRadius: 17, background: v === max ? `linear-gradient(90deg, ${RED}, ${RED2})` : "linear-gradient(90deg,#5f7682,#cfd8dd)" }} /></div>
                  <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: "white", textAlign: "right" }}>{fmt(v * p, Number.isInteger(v) ? 0 : 1)}{r.bars!.unit || ""}</span>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: r.bars ? 30 : 0 }}>
          {r.facts.map((t, i) => {
            const at = (r.bars ? voEnd * 0.6 : voEnd * 0.3) + i * (r.bars ? step * 0.5 : step);
            const p = spring({ frame: f - at, fps: 30, config: { damping: 15 } });
            return <div key={t} style={{ fontFamily: BN, fontWeight: 700, fontSize: 42, lineHeight: 1.3, color: "white", background: "rgba(255,255,255,.07)", borderLeft: `8px solid ${i % 2 ? AMBER : RED}`, padding: "18px 24px", borderRadius: 12, opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>{t}</div>;
          })}
        </div>
      </div>
      {/* footer */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 250, fontFamily: BN, fontSize: 28, color: MUTE }}>সূত্র: {r.source}</div>
      <AbsoluteFill style={{ background: `rgba(11,17,20,${0.92 * end})`, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ opacity: end, transform: `scale(${0.9 + end * 0.1})` }}>
          <Img src={staticFile("cob/logo-round.png")} style={{ width: 300 }} />
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "white", marginTop: 30, padding: "0 60px" }}>{r.cta}</div>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: AMBER, marginTop: 20 }}>ফলো করুন · @coloursofbangladesh</div>
        </div>
      </AbsoluteFill>
      <Grain />
      <Audio src={staticFile(r.vo)} />
      <Audio src={staticFile("cfmusic.mp3")} volume={(x) => interpolate(x, [0, 10, D - 20, D], [0, 0.17, 0.17, 0], clamp)} />
    </AbsoluteFill>
  );
};

const len = (s: number) => Math.ceil(s * 30) + 50;
export const REELS: DR[] = [
  { id: "ReelMob", vo: "drvo/01.mp3", dur: len(18.72), tag: "ডেটা", tint: "rgba(224,20,43,.35)", hook: ["গণপিটুনিতে এক বছরে", "১৯৭ মৃত্যু"], accent: RED2,
    big: { v: 197, label: "জন নিহত, ২০২৫ (আগের বছর ১২৮)", color: RED2 },
    bars: { title: "সবচেয়ে বেশি যেখানে", rows: [["ঢাকা", 27], ["গাজীপুর", 17], ["নারায়ণগঞ্জ", 11], ["চট্টগ্রাম", 9], ["কুমিল্লা", 8]] },
    facts: ["আইন হাতে তুলে নেবেন না"], source: "আইন ও সালিশ কেন্দ্র (আসক), ইত্তেফাক", cta: "মব নয়, আইনের শাসন" },
  { id: "ReelRoad", vo: "drvo/02.mp3", dur: len(19.12), tag: "ডেটা", tint: "rgba(255,120,40,.3)", hook: ["সড়কে প্রতিদিন", "প্রায় ২৫ মৃত্যু"], accent: AMBER,
    big: { v: 9111, label: "জন নিহত, ২০২৫ (যাত্রী কল্যাণ সমিতি)" },
    facts: ["মোট মৃত্যুর ৩৬% মোটরসাইকেলে", "নিহত শিশু ৫৯১ জন", "হেলমেট পরুন, নিরাপদে চলুন"], source: "যাত্রী কল্যাণ সমিতি, রোড সেফটি ফাউন্ডেশন", cta: "একটি দুর্ঘটনা, সারাজীবনের কান্না" },
  { id: "ReelLoan", vo: "drvo/03.mp3", dur: len(16.0), tag: "অর্থনীতি", tint: "rgba(90,140,190,.3)", hook: ["১০০ টাকা ঋণের", "৩৩ টাকাই খেলাপি"], accent: AMBER,
    big: { v: 32.7, dec: 1, suf: "%", label: "খেলাপি ঋণের হার, মার্চ ২০২৬" },
    bars: { title: "খেলাপি ঋণের হার", rows: [["মার্চ ২০২৫", 24.6], ["মার্চ ২০২৬", 32.7], ["কুটির শিল্প", 52.8]], unit: "%" },
    facts: [], source: "বাংলাদেশ ব্যাংক, রাইজিংবিডি", cta: "আপনার ব্যাংক কতটা নিরাপদ?" },
  { id: "ReelLaunder", vo: "drvo/04.mp3", dur: len(19.2), tag: "অর্থনীতি", tint: "rgba(40,180,120,.22)", hook: ["১৫ বছরে পাচার", "২৩৪ বিলিয়ন ডলার"], accent: "#5be0a0",
    big: { v: 16, pre: "$", label: "বিলিয়ন ডলার, বছরে গড়ে (শ্বেতপত্র কমিটি, ২০০৯–২০২৩)", color: "#5be0a0" },
    facts: ["জিএফআই: শুধু আমদানি-রপ্তানির কারচুপিতে ১০ বছরে ৬৮.৩ বিলিয়ন ডলার", "প্রধান পথ: ট্রেড মিসইনভয়েসিং"], source: "শ্বেতপত্র কমিটি (২০২৪), জিএফআই (মার্চ ২০২৬)", cta: "দেশের টাকা দেশে থাকুক" },
  { id: "ReelDengue", vo: "drvo/05.mp3", dur: len(17.36), tag: "স্বাস্থ্য", tint: "rgba(224,20,43,.25)", hook: ["ডেঙ্গু: এক বছরে", "লাখের বেশি রোগী"], accent: RED2,
    big: { v: 102861, label: "জন হাসপাতালে, ২০২৫ · মৃত্যু ৪১৩" },
    facts: ["২০২৬ (আগস্ট পর্যন্ত): আক্রান্ত ২০,৭২৭", "জমা পানি ফেলুন, মশারি টানান", "জ্বর হলে দেরি না করে পরীক্ষা"], source: "স্বাস্থ্য অধিদপ্তর, ঢাকা ট্রিবিউন", cta: "সচেতন থাকুন, সুস্থ থাকুন" },
  { id: "ReelAir", vo: "drvo/06.mp3", dur: len(18.0), tag: "পরিবেশ", tint: "rgba(160,160,160,.25)", hook: ["৯ বছরে মাত্র", "৩১ দিন নির্মল বাতাস"], accent: AMBER,
    big: { v: 31, label: "দিন, ঢাকা (ক্যাপসের বিশ্লেষণ)" },
    facts: ["বায়ুদূষণে বিশ্বে দ্বিতীয় বাংলাদেশ (আইকিউএয়ার)", "গড় আয়ু কমছে প্রায় ৬.৮ বছর", "বাইরে বের হলে মাস্ক পরুন"], source: "ক্যাপস, আইকিউএয়ার, প্রথম আলো", cta: "নিঃশ্বাস নিন, কিন্তু সাবধানে" },
];
