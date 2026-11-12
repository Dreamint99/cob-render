// Language story ads (owner 2026-11-12): Japanese, English, Arabic — "story build, why learn, what is in the course, what is special in the
// app, everything" in a NEW cinematic style: full-bleed illustrated scenes with camera moves, light leaks, film grain, kinetic type,
// glass dialogue cards, a 3D phone over a blurred scene, zoom-through transitions. No paid images: Cloudflare free art (l-*), art reused
// from the GDS story, real app screens, lesson clips from the older promos. VO: lang_lines.json → work/applaunch/make_lang_vo.py.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DURS from "./lang_durs.json";
import LINES from "./lang_lines.json";
import SDURS from "./story_durs.json";
import { BLUE, BLUE2, GOLD, ORANGE, MINT, RED, TXT, HEAD, BODY, LAT, GOLDG, S, clamp, lerp, useMode, pick, useIn, Phone, PlayBadge, PlayLogo } from "./Launch";

const FPS = 30, OVER = 8, GAP = 7;
if (typeof document !== "undefined") {
  for (const [n, f] of [["Noto Sans JP", "NotoSansJP.ttf"], ["Noto Naskh Arabic", "NotoNaskhArabic.ttf"]]) {
    const ff = new FontFace(n, `url(${staticFile("fonts/" + f)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}
type Lang = "ja" | "en" | "ar";
const D = DURS as Record<string, number>;
const LN = LINES as unknown as Record<Lang, Record<string, [string, string]>>;

/* ───────── per-language content ───────── */
type Dlg = { id: string; who: string; fg: string; pr: string; bn: string; rtl?: boolean };
type Scene =
  | { k: "dialog"; art: string; d: Dlg; title: string }
  | { k: "worried"; title: string; line: string }
  | { k: "facts"; line: string; bg: string; facts: { big: string; label: string; src: string }[] }
  | { k: "pain"; line: string; bg: string; items: [string, string][] }
  | { k: "bridge"; line: string; bg: string; pairs: [string, string][] }
  | { k: "problem"; line: string; title: string }
  | { k: "reveal"; line: string; title: string }
  | { k: "road"; line: string; bg: string; title: string; stats: [string, string][]; steps: string[] }
  | { k: "app"; line: string; bg: string; title: string; screens: string[]; bullets: string[] }
  | { k: "clips"; line: string; title: string; clips: [string, string][]; guru: [string, string] }
  | { k: "turn"; art: string; lines: Dlg[]; title: string }
  | { k: "subs"; line: string; bg: string; course: string; others: string[] }
  | { k: "offer"; bg: string }
  | { k: "cta"; line: string; bg: string; title: string };

const ALL = ["এয়ার টিকেটিং (GDS)", "IELTS প্রস্তুতি", "স্পোকেন ইংলিশ", "জাপানি", "কোরিয়ান (EPS)", "গালফের আরবি", "কম্পিউটার শিক্ষা", "ড্রাইভিং", "ভাইব কোডিং", "পারিবারিক স্বাস্থ্য", "মাছের খাদ্য", "সাপ উদ্ধার", "বিজ্ঞানের ভেলকি"];
const JA_BOSS: Dlg = { id: "h1", who: "সুপারভাইজার", fg: "はじめまして。お名前は？", pr: "হাজিমেমাশিতে। ও-নামায়ে ওয়া?", bn: "পরিচয় হয়ে ভালো লাগল। আপনার নাম কী?" };
const EN_Q: Dlg = { id: "h1", who: "ইন্টারভিউয়ার", fg: "So, tell me a little about yourself.", pr: "", bn: "নিজের সম্পর্কে একটু বলুন তো।" };
const AR_BOSS: Dlg = { id: "h1", who: "সুপারভাইজার", fg: "يَا رَفِيع، جِيب العِدَّة بِسُرْعَة، لَوْ سَمَحْت.", pr: "ইয়া রাফি, জীবিল-ইদ্দা বি-সুরআ, লাও সামাহ্‌ত।", bn: "রাফি, তাড়াতাড়ি যন্ত্রপাতি আনো, প্লিজ।", rtl: true };

export const SPECS: Record<Lang, Scene[]> = {
  ja: [
    { k: "dialog", art: "l-ja-boss", d: JA_BOSS, title: "জাপানে কাজের প্রথম দিন" },
    { k: "worried", title: "কিছুই বুঝলেন না?", line: "h2" },
    { k: "facts", line: "h3", bg: "l-ja-dream", facts: [
      { big: "৮.২ লাখ", label: "৫ বছরে বিদেশি দক্ষ কর্মী নেওয়ার পরিকল্পনা (২০২৪ থেকে)", src: "সূত্র: জাপান সরকার · ইমিগ্রেশন সার্ভিসেস এজেন্সি, মার্চ ২০২৪" },
      { big: "২০১৯", label: "বাংলাদেশ–জাপান দক্ষ কর্মী সহযোগিতা স্মারক", src: "সূত্র: জাপানের পররাষ্ট্র মন্ত্রণালয় · দ্য ডেইলি স্টার, ২৭ আগস্ট ২০১৯" },
      { big: "JFT / JLPT N4", label: "স্পেসিফায়েড স্কিলড ওয়ার্কার ভিসায় জাপানি ভাষার পরীক্ষা", src: "সূত্র: জাপান সরকার · ইমিগ্রেশন সার্ভিসেস এজেন্সি" }] },
    { k: "problem", line: "h4", title: "কিন্তু শিখবেন কোথায়?" },
    { k: "reveal", line: "h5", title: "বাংলায় জাপানি, নিজের ফোনে" },
    { k: "road", line: "h6", bg: "l-ja-dream", title: "৬টি ধাপে পুরো কোর্স", stats: [["৩৭", "বাংলা পাঠ"], ["৬", "ধাপ"], ["N5", "লক্ষ্য"]],
      steps: ["কানা ও প্রথম কথা", "কাতাকানা, সংখ্যা, সময়", "কাঞ্জি ও মূল গ্রামার", "কাজ ও নিরাপত্তা", "জীবনযাপন", "জাপানে প্রথম দিন + পরীক্ষা"] },
    { k: "app", line: "h7", bg: "l-ja-boss", title: "অ্যাপে আঙুলে লিখে শিখুন", screens: ["62-write-kana", "63-write-kanji-order", "71-langkit-ja-phrases", "72-langkit-ja-numbers", "58-speed"],
      bullets: ["হিরাগানা · কাতাকানা · কাঞ্জি লেখা", "দরকারি বাক্য ও সংখ্যা শুনে শেখা", "কার্ড রিভিশন", "৬০ সেকেন্ডের স্পিড রাউন্ড"] },
    { k: "clips", line: "h8", title: "প্রতিটা পাঠ গল্পের মতো", clips: [["ja-hook", "গল্প দিয়ে শুরু"], ["ja-speak", "শুনুন, নিজে বলুন"], ["ja-role", "কাজের রোলপ্লে"], ["ja-boss", "বস চ্যালেঞ্জ"]], guru: ["ja-sensei", "এআই সেনসেই · ২৪/৭"] },
    { k: "turn", art: "l-ja-dream", title: "এবার আপনি জাপানি জানেন", lines: [
      { id: "t2", who: "সুপারভাইজার", fg: "はじめまして。お名前は？", pr: "হাজিমেমাশিতে। ও-নামায়ে ওয়া?", bn: "আপনার নাম কী?" },
      { id: "t3", who: "আপনি", fg: "はじめまして。ラフィです。よろしくおねがいします。", pr: "হাজিমেমাশিতে। রাফি দেস। ইয়োরোশিকু ওনেগাইশিমাস।", bn: "আমি রাফি। আপনার সাথে কাজ করতে পেরে ভালো লাগবে।" },
      { id: "t4", who: "সুপারভাইজার", fg: "いいですね！よろしく！", pr: "ইই দেস নে! ইয়োরোশিকু!", bn: "চমৎকার! স্বাগতম!" }] },
    { k: "subs", line: "h10", bg: "l-ja-dream", course: "🇯🇵 জাপানি ভাষা কোর্স", others: ALL.filter((c) => c !== "জাপানি") },
    { k: "offer", bg: "l-ja-dream" },
    { k: "cta", line: "h12", bg: "l-ja-dream", title: "জাপানের পথে প্রথম কথাটা আপনিই বলবেন" },
  ],
  en: [
    { k: "dialog", art: "l-en-interview", d: EN_Q, title: "চাকরির ইন্টারভিউ" },
    { k: "worried", title: "উত্তর জানেন, কিন্তু বলতে পারছেন না?", line: "h2" },
    { k: "facts", line: "h3", bg: "l-en-dream", facts: [
      { big: "১৫০ কোটি", label: "মানুষ ইংরেজি বলেন, দুনিয়ার সবচেয়ে বেশি বলা ভাষা", src: "সূত্র: Ethnologue, ২০২৩" },
      { big: "১৩ লাখ+", label: "বাংলাদেশি ২০২৩-এ কাজে বিদেশ গেছেন, ইংরেজি জানলে সুযোগ বেশি", src: "সূত্র: BMET · ঢাকা ট্রিবিউন, ২০২৪" },
      { big: "IELTS", label: "বিদেশে পড়া আর অনেক ভিসায় ইংরেজির পরীক্ষা", src: "সূত্র: ব্রিটিশ কাউন্সিল · IDP · UKVI" }] },
    { k: "problem", line: "h4", title: "প্র্যাকটিস করবেন কার সাথে?" },
    { k: "reveal", line: "h5", title: "বাংলায় বুঝে ইংরেজি, নিজের ফোনে" },
    { k: "road", line: "h6", bg: "l-en-dream", title: "লেভেল ০ থেকে ৫ + IELTS", stats: [["১০৭", "স্পোকেন পাঠ"], ["৮০", "IELTS পাঠ"], ["৬", "লেভেল"]],
      steps: ["লেভেল ০ · শুরু ও নিজের কথা", "লেভেল ১ · আমার দিন", "লেভেল ২ · অতীত ও ভবিষ্যৎ", "লেভেল ৩ · কাজের জায়গার ইংরেজি", "লেভেল ৪ · নেটিভদের কথা বোঝা", "লেভেল ৫ · পাবলিক স্পিকিং", "IELTS · Listening থেকে Speaking"] },
    { k: "app", line: "h7", bg: "l-en-interview", title: "এআই পার্টনারের সাথে কথা বলুন", screens: ["59-partner", "60-partner-call", "54-cards-home"],
      bullets: ["ফোনের মতো ইংরেজিতে কথা", "দোকান · অফিস · এয়ারপোর্ট · ইন্টারভিউ", "কল শেষে বাক্য কার্ডে জমা"] },
    { k: "app", line: "h8", bg: "l-en-dream", title: "শব্দ, শোনা, লেখা: সব এক অ্যাপে", screens: ["55-card-front", "61-word-sheet", "74-dictation", "61-scan-translate"],
      bullets: ["কার্ড: দেখুন, শুনুন, বলুন", "শব্দে ট্যাপ = বাংলা অর্থ, অফলাইনেও", "ডিক্টেশন: শুনে লিখুন", "ক্যামেরায় ছবি = বাংলায় মানে"] },
    { k: "app", line: "h9", bg: "l-en-dream", title: "IELTS মক টেস্ট + এআই ফিডব্যাক", screens: ["73-mock-home", "70-mock-report", "72-mock-report-writing"],
      bullets: ["পুরো মক টেস্ট, ব্যান্ড স্কোর", "রাইটিং ও স্পিকিংয়ে এআই ফিডব্যাক"] },
    { k: "turn", art: "l-en-dream", title: "এবার আপনি তৈরি", lines: [
      { id: "t2", who: "ইন্টারভিউয়ার", fg: "So, tell me a little about yourself.", pr: "", bn: "নিজের সম্পর্কে একটু বলুন।" },
      { id: "t3", who: "আপনি", fg: "Sure! I'm Rafi. I have three years of experience in sales, and I really enjoy working with people.", pr: "", bn: "আমি রাফি। সেলসে তিন বছরের অভিজ্ঞতা, মানুষের সাথে কাজ করতে ভালোবাসি।" },
      { id: "t4", who: "ইন্টারভিউয়ার", fg: "Great! That's exactly what we're looking for.", pr: "", bn: "চমৎকার! আমরা ঠিক এমন কাউকেই খুঁজছি।" }] },
    { k: "subs", line: "h10", bg: "l-en-dream", course: "🇬🇧 স্পোকেন ইংলিশ + IELTS", others: ALL.filter((c) => c !== "স্পোকেন ইংলিশ" && c !== "IELTS প্রস্তুতি") },
    { k: "offer", bg: "l-en-dream" },
    { k: "cta", line: "h12", bg: "l-en-dream", title: "পরের ইন্টারভিউতে উত্তরটা আপনিই দেবেন" },
  ],
  ar: [
    { k: "dialog", art: "l-ar-site", d: AR_BOSS, title: "সৌদির কাজের সাইটে প্রথম দিন" },
    { k: "worried", title: "কিছুই বুঝলেন না?", line: "h2" },
    { k: "pain", line: "h3", bg: "l-ar-site", items: [["দোকানে দাম", "بِكَم هَذَا؟"], ["ট্যাক্সিতে ঠিকানা", "وَدِّنِي هِنَا"], ["ক্লিনিকে ব্যথা", "عِنْدِي وَجَع"], ["বেতনের কথা", "الرَّاتِب"]] },
    { k: "bridge", line: "h4", bg: "l-ar-dream", pairs: [["কলম", "قَلَم"], ["কিতাব", "كِتَاب"], ["হিসাব", "حِسَاب"], ["দুনিয়া", "دُنْيَا"]] },
    { k: "reveal", line: "h5", title: "বাংলায় গালফের কথ্য আরবি" },
    { k: "road", line: "h6", bg: "l-ar-dream", title: "৮টি ধাপে পুরো কোর্স", stats: [["৩৯", "বাংলা পাঠ"], ["৮", "ধাপ"], ["সৌদি", "কণ্ঠ"]],
      steps: ["প্রথম দিনের ভাষা", "সংখ্যা, সময় ও জায়গা", "দোকান ও খাবার", "কাজের নির্দেশ ও নিরাপত্তা", "বেতন, চুক্তি ও কাগজ", "ফোন, ডাটা ও ব্যাংক", "স্বাস্থ্য ও জরুরি", "অধিকার ও আত্মবিশ্বাস"] },
    { k: "app", line: "h7", bg: "l-ar-site", title: "অ্যাপে আঙুলে আরবি হরফ", screens: ["66-write-arabic", "70-langkit-ar-alphabet", "71-langkit-ar-phrases", "72-langkit-ar-numbers", "75-cards-ar-rtl"],
      bullets: ["আরবি হরফ আঙুলে লেখা", "দরকারি বাক্য ও সংখ্যা শুনে শেখা", "কার্ড রিভিশন", "স্পিড রাউন্ড"] },
    { k: "clips", line: "h8", title: "নেটিভ সৌদি কণ্ঠ, বাংলায় উচ্চারণ", clips: [["ar-lesson1", "শুনুন, নিজে বলুন"]], guru: ["en-guru", "এআই উস্তাদ · ২৪/৭"] },
    { k: "turn", art: "l-ar-dream", title: "এবার আপনি আরবি জানেন", lines: [
      { id: "t2", who: "সুপারভাইজার", fg: "يَا رَفِيع، جِيب العِدَّة بِسُرْعَة، لَوْ سَمَحْت.", pr: "ইয়া রাফি, জীবিল-ইদ্দা বি-সুরআ, লাও সামাহ্‌ত।", bn: "রাফি, তাড়াতাড়ি যন্ত্রপাতি আনো, প্লিজ।", rtl: true },
      { id: "t3", who: "আপনি", fg: "إِنْ شَاءَ الله، الْحِين أَجِيبْهَا!", pr: "ইনশাআল্লাহ, ইল-হীন আজীবহা!", bn: "ইনশাআল্লাহ, এখনই আনছি!", rtl: true },
      { id: "t4", who: "সুপারভাইজার", fg: "زَيْن! يَعْطِيك الْعَافِيَة.", pr: "যেইন! ইয়া'তীকিল-আফিয়া।", bn: "ভালো! আল্লাহ তোমাকে সুস্থ রাখুন।", rtl: true }] },
    { k: "subs", line: "h10", bg: "l-ar-dream", course: "🇸🇦 গালফের আরবি কোর্স", others: ALL.filter((c) => c !== "গালফের আরবি") },
    { k: "offer", bg: "l-ar-dream" },
    { k: "cta", line: "h12", bg: "l-ar-dream", title: "পরের বার উত্তরটা আপনিই দেবেন" },
  ],
};

/* ───────── timeline ───────── */
const linesOf = (sc: Scene): string[] =>
  sc.k === "dialog" ? [sc.d.id] : sc.k === "turn" ? ["t1", ...sc.lines.map((l) => l.id)] : sc.k === "offer" ? ["OFFER"] : [sc.line];
const durOf = (lang: Lang, id: string) => (id === "OFFER" ? (SDURS as Record<string, number>).s13 : D[`${lang}-${id}`]);
const audioOf = (lang: Lang, id: string) => (id === "OFFER" ? "vo/story-s13.mp3" : `vo/${lang}-${id}.mp3`);
const EXTRA: Partial<Record<Scene["k"], number>> = { dialog: 30, worried: 6, cta: 70, offer: 20, turn: 10 };
const timeline = (lang: Lang) => {
  let at = 0;
  return SPECS[lang].map((sc, i) => {
    const lead = i === 0 ? 24 : 8;
    let t = lead;
    const parts = linesOf(sc).map((id) => { const p = { id, at: t, dur: Math.round(durOf(lang, id) * FPS) }; t += p.dur + GAP; return p; });
    const len = t + 6 + (EXTRA[sc.k] ?? 0);
    const it = { sc, from: at, len, parts }; at += len - OVER; return it;
  });
};
export const langTotal = (lang: Lang) => { const t = timeline(lang); const l = t[t.length - 1]; return l.from + l.len; };

/* ───────── cinematic building blocks ───────── */
const Bg: React.FC<{ src: string; len: number; blur?: number; dim?: number; z0?: number; z1?: number; ox?: number; oy?: number; pan?: number }> =
  ({ src, len, blur = 0, dim = 0.15, z0 = 1.06, z1 = 1.2, ox = 50, oy = 45, pan = 3 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, len], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#020617" }}>
      <Img src={S(`art/${src}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: `${ox}% ${oy}%`,
        transform: `scale(${z0 + (z1 - z0) * t}) translateX(${(t - 0.5) * pan}%)`, filter: `blur(${blur}px) saturate(1.1) contrast(1.05)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(2,6,23,${0.55 + dim}) 0%, rgba(2,6,23,${dim}) 32%, rgba(2,6,23,${dim}) 58%, rgba(2,6,23,${0.7 + dim}) 100%)` }} />
    </AbsoluteFill>
  );
};
const Leak: React.FC<{ hue?: string }> = ({ hue = ORANGE }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const x = W * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(f / 70))), y = H * (0.15 + 0.2 * Math.cos(f / 90));
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", background: `radial-gradient(circle at ${x}px ${y}px, ${hue}55, transparent ${Math.max(W, H) * 0.35}px)` }} />;
};
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", opacity: 0.07 }}><Img src={S(`fx/grain${Math.floor(f / 2) % 4}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
};

const useL = () => {
  const m = useMode();
  return { m, top: pick(m, 250, 50, 110), side: pick(m, 60, 50, 110), ts: pick(m, 84, 66, 80), sub: pick(m, 1440, 1060, 840), w: pick(m, 960, 980, 900) };
};
// kinetic headline: words rise out of a mask
const Kin: React.FC<{ text: string; hot?: string[]; delay?: number; size?: number; top?: number; center?: boolean }> = ({ text, hot = [], delay = 4, size, top, center }) => {
  const f = useCurrentFrame();
  const L = useL();
  const al = center ?? L.m !== "h";
  return (
    <div style={{ position: "absolute", top: top ?? L.top, left: L.side, width: L.m === "h" ? L.w : undefined, right: L.m === "h" ? undefined : L.side, textAlign: al ? "center" : "left",
      fontFamily: HEAD, fontWeight: 800, fontSize: size ?? L.ts, lineHeight: 1.18, color: TXT, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
      {text.split(" ").map((w, i) => {
        const k = spring({ frame: f - delay - i * 3, fps: FPS, config: { damping: 14, mass: 0.6 } });
        return <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.24em", paddingBottom: "0.1em" }}>
          <span style={{ display: "inline-block", transform: `translateY(${(1 - k) * 110}%)`, ...(hot.some((h) => w.includes(h)) ? { background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}) }}>{w}</span></span>;
      })}
    </div>
  );
};
// karaoke narration subtitle
const Sub: React.FC<{ lang: Lang; id: string; at: number; dur: number }> = ({ lang, id, at, dur }) => {
  const f = useCurrentFrame() - at;
  const L = useL();
  if (f < 0 || f > dur + 12 || !LN[lang][id] || LN[lang][id][0] !== "N") return null;
  const words = LN[lang][id][1].split(" ");
  const n = Math.ceil(interpolate(f, [0, dur * 0.95], [0, words.length], clamp));
  const start = Math.max(0, Math.min(words.length - 11, n - 7));
  const fs = pick(L.m, 42, 34, 34);
  return (
    <div style={{ position: "absolute", top: L.sub, left: L.side, right: L.m === "h" ? undefined : L.side, width: L.m === "h" ? 860 : undefined, textAlign: L.m === "h" ? "left" : "center", fontFamily: BODY, fontWeight: 700, fontSize: fs, lineHeight: 1.45, color: "#fff", opacity: lerp(f, dur + 4, dur + 12, 1, 0) }}>
      <span style={{ background: "rgba(2,6,23,0.6)", padding: "8px 16px", borderRadius: 14, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", backdropFilter: "blur(6px)" }}>
        {words.slice(start, start + 11).map((w, i) => { const j = start + i; return <span key={j} style={{ opacity: j < n ? 1 : 0.4, color: j === n - 1 ? GOLD : "#fff" }}>{w} </span>; })}
      </span>
    </div>
  );
};
// glass dialogue card: foreign line + Bangla pronunciation + meaning
const DlgCard: React.FC<{ d: Dlg; at: number; side: "l" | "r"; y: number }> = ({ d, at, side, y }) => {
  const f = useCurrentFrame();
  const L = useL();
  const k = spring({ frame: f - at, fps: FPS, config: { damping: 13, mass: 0.6 } });
  const fs = pick(L.m, 40, 32, 36);
  const me = d.who === "আপনি";
  const w = pick(L.m, 860, 820, 820);
  const x = L.m === "h" ? (side === "l" ? 110 : 1920 - 110 - w) : (1080 - w) / 2 + (side === "l" ? -30 : 30);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: `${fs * 0.6}px ${fs * 0.8}px`, borderRadius: 30, background: me ? "rgba(37,99,235,0.72)" : "rgba(15,23,42,0.62)",
      border: `2px solid ${me ? BLUE2 : "rgba(255,255,255,0.25)"}`, backdropFilter: "blur(14px)", boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
      transform: `translateY(${(1 - k) * 60}px) scale(${0.9 + 0.1 * k})`, opacity: Math.min(1, k * 1.5), transformOrigin: side === "l" ? "0% 100%" : "100% 100%" }}>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.55, color: me ? "#BFDBFE" : MINT, marginBottom: 6 }}>{me ? "🙋 আপনি" : `🗣️ ${d.who}`}</div>
      <div style={{ fontFamily: d.rtl ? "'Noto Naskh Arabic', 'Segoe UI', sans-serif" : "'Noto Sans JP', 'Segoe UI', Poppins, sans-serif", fontWeight: 700, fontSize: fs * (d.rtl ? 1.05 : 0.95), color: "#fff", direction: d.rtl ? "rtl" : "ltr", lineHeight: 1.35 }}>{d.fg}</div>
      {d.pr ? <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.62, color: GOLD, marginTop: 6 }}>{d.pr}</div> : null}
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.62, color: "#E2E8F0", marginTop: 4 }}>{d.bn}</div>
    </div>
  );
};

/* ───────── scenes ───────── */
type P = { lang: Lang; len: number; parts: { id: string; at: number; dur: number }[] };

const DialogS: React.FC<P & { sc: Extract<Scene, { k: "dialog" }> }> = ({ sc, len, parts }) => {
  const L = useL();
  return (
    <AbsoluteFill>
      <Bg src={sc.art} len={len} z0={1.0} z1={1.22} dim={0.05} />
      <Leak hue={ORANGE} />
      <Kin text={sc.title} delay={2} size={L.ts * 0.8} />
      <DlgCard d={sc.d} at={parts[0].at - 4} side="l" y={pick(L.m, 1180, 820, 640)} />
    </AbsoluteFill>
  );
};

const WorriedS: React.FC<P & { sc: Extract<Scene, { k: "worried" }> }> = ({ sc, len }) => {
  const f = useCurrentFrame();
  const L = useL();
  return (
    <AbsoluteFill>
      <Bg src="a02-worried" len={len} z0={1.25} z1={1.05} oy={30} dim={0.1} />
      <Leak hue="#7C3AED" />
      <Kin text={sc.title} hot={["কিছুই", "বলতে"]} />
      {[0, 1, 2].map((i) => { const k = useIn(8 + i * 6, 8); return <div key={i} style={{ position: "absolute", left: `${[14, 78, 84][i]}%`, top: `${[34, 30, 52][i]}%`, fontFamily: LAT, fontWeight: 900, fontSize: pick(L.m, 140, 110, 130),
        color: i % 2 ? GOLD : "#fff", transform: `scale(${k}) translateY(${Math.sin((f + i * 20) / 8) * 14}px) rotate(${(i % 2 ? 1 : -1) * 12}deg)`, textShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>?</div>; })}
    </AbsoluteFill>
  );
};

const FactsS: React.FC<P & { sc: Extract<Scene, { k: "facts" }> }> = ({ sc, len, parts }) => {
  const f = useCurrentFrame();
  const L = useL();
  const p = parts[0];
  const per = (p.dur - 40) / sc.facts.length;
  const i = Math.max(0, Math.min(sc.facts.length - 1, Math.floor((f - p.at - 40) / per)));
  const local = f - p.at - 40 - i * per;
  const k = spring({ frame: local, fps: FPS, config: { damping: 13, mass: 0.6 } });
  const fc = sc.facts[i];
  return (
    <AbsoluteFill>
      <Bg src={sc.bg} len={len} blur={10} dim={0.3} />
      <Leak hue={BLUE} />
      <Kin text="কেন শিখবেন?" hot={["কেন"]} />
      {f > p.at + 30 ? (
        <div style={{ position: "absolute", left: L.side, right: L.side, top: pick(L.m, 560, 330, 330), textAlign: L.m === "h" ? "left" : "center" }}>
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: pick(L.m, 34, 28, 30), color: GOLD, letterSpacing: 2 }}>{String(i + 1).padStart(2, "0")} / {String(sc.facts.length).padStart(2, "0")}</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 190, 140, 170), lineHeight: 1.05, background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: L.m === "h" ? "0% 50%" : "50% 50%", opacity: k, filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.5))" }}>{fc.big}</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 54, 42, 50), color: TXT, lineHeight: 1.25, marginTop: 10, opacity: lerp(local, 6, 18), transform: `translateY(${(1 - lerp(local, 6, 18)) * 30}px)` }}>{fc.label}</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: pick(L.m, 26, 22, 24), color: "#94A3B8", marginTop: 16, opacity: lerp(local, 14, 26) }}>{fc.src}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const PainS: React.FC<P & { sc: Extract<Scene, { k: "pain" }> }> = ({ sc, len, parts }) => {
  const L = useL();
  const p = parts[0];
  const fs = pick(L.m, 40, 32, 36);
  return (
    <AbsoluteFill>
      <Bg src={sc.bg} len={len} blur={8} dim={0.3} />
      <Kin text="প্রবাসে প্রতিদিন আটকে যাওয়া" hot={["আটকে"]} />
      <div style={{ position: "absolute", left: L.side, right: L.side, top: pick(L.m, 560, 300, 330), display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {sc.items.map(([bn, ar], i) => { const k = useIn(p.at + 4 + i * Math.round(p.dur / 5), 12); return (
          <div key={bn} style={{ padding: fs * 0.7, borderRadius: 28, background: "rgba(15,23,42,0.6)", border: "2px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", textAlign: "center", transform: `scale(${0.8 + 0.2 * k})`, opacity: k }}>
            <div style={{ fontFamily: "'Noto Naskh Arabic', sans-serif", fontWeight: 700, fontSize: fs * 1.2, color: GOLD, direction: "rtl" }}>{ar}</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT, marginTop: 8 }}>{bn}</div>
            <div style={{ fontSize: fs * 0.9, marginTop: 6, color: RED }}>✕ বুঝি না</div>
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};

const BridgeS: React.FC<P & { sc: Extract<Scene, { k: "bridge" }> }> = ({ sc, len, parts }) => {
  const f = useCurrentFrame();
  const L = useL();
  const p = parts[0];
  const fs = pick(L.m, 64, 50, 58);
  return (
    <AbsoluteFill>
      <Bg src={sc.bg} len={len} blur={9} dim={0.3} />
      <Leak hue={GOLD} />
      <Kin text="আপনি আগে থেকেই আরবি জানেন!" hot={["আরবি", "জানেন!"]} />
      <div style={{ position: "absolute", left: L.side, right: L.side, top: pick(L.m, 600, 320, 340), display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
        {sc.pairs.map(([bn, ar], i) => { const a = p.at + 30 + i * 26; const k = useIn(a, 12); const flip = lerp(f, a + 14, a + 26); return (
          <div key={bn} style={{ display: "flex", alignItems: "center", gap: 30, opacity: k, transform: `translateX(${(1 - k) * (i % 2 ? 120 : -120)}px)` }}>
            <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs, color: TXT, minWidth: fs * 3.4, textAlign: "right" }}>{bn}</span>
            <span style={{ fontFamily: LAT, fontSize: fs * 0.7, color: GOLD, opacity: flip }}>=</span>
            <span style={{ fontFamily: "'Noto Naskh Arabic', sans-serif", fontWeight: 700, fontSize: fs * 1.1, color: GOLD, minWidth: fs * 3, opacity: flip, transform: `scale(${0.6 + 0.4 * flip})` }}>{ar}</span>
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};

const ProblemS: React.FC<P & { sc: Extract<Scene, { k: "problem" }> }> = ({ sc, len }) => (
  <AbsoluteFill>
    <Bg src="a08-problem" len={len} z0={1.25} z1={1.05} dim={0.12} />
    <AbsoluteFill style={{ background: "rgba(30,0,0,0.18)", mixBlendMode: "multiply" }} />
    <Kin text={sc.title} hot={["কোথায়?", "কার"]} />
  </AbsoluteFill>
);

const RevealS: React.FC<P & { sc: Extract<Scene, { k: "reveal" }> }> = ({ sc, len }) => {
  const f = useCurrentFrame();
  const L = useL();
  const b = useIn(Math.round(len * 0.4), 10);
  const flash = lerp(f, 0, 10, 0.8, 0);
  return (
    <AbsoluteFill>
      <Bg src="a09-reveal" len={len} z0={1.3} z1={1.05} oy={50} dim={0.05} />
      <Leak hue={GOLD} />
      <Kin text={sc.title} hot={["ফোনে", "জাপানি,", "ইংরেজি,", "আরবি"]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(L.m, 1180, 1000, 640), display: "flex", justifyContent: "center", alignItems: "center", gap: 20, transform: `scale(${b})` }}>
        <Img src={S("icon.png")} style={{ width: 120, height: 120, borderRadius: 28, boxShadow: `0 0 50px ${BLUE}` }} />
        <PlayBadge h={pick(L.m, 110, 96, 100)} />
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const RoadS: React.FC<P & { sc: Extract<Scene, { k: "road" }> }> = ({ sc, len, parts }) => {
  const f = useCurrentFrame();
  const L = useL();
  const p = parts[0];
  const n = sc.steps.length;
  const per = (p.dur - 50) / n;
  const fs = pick(L.m, 38, 28, 32);
  const top = pick(L.m, 600, 330, 340), rowH = pick(L.m, 96, 86, 64);
  const lineK = lerp(f, p.at + 40, p.at + 40 + per * n);
  return (
    <AbsoluteFill>
      <Bg src={sc.bg} len={len} blur={12} dim={0.35} />
      <Leak hue={BLUE} />
      <Kin text={sc.title} hot={sc.title.split(" ").slice(0, 1)} />
      <div style={{ position: "absolute", left: L.side, right: L.side, top: top - 120, display: "flex", justifyContent: L.m === "h" ? "flex-start" : "center", gap: 16 }}>
        {sc.stats.map(([a, b], i) => { const k = useIn(10 + i * 5, 12); return <div key={b} style={{ padding: "10px 24px", borderRadius: 20, background: "rgba(15,23,42,0.55)", border: `2px solid ${GOLD}66`, backdropFilter: "blur(10px)", textAlign: "center", transform: `scale(${k})` }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs * 1.3, color: GOLD, lineHeight: 1 }}>{a}</div><div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.6, color: "#CBD5E1" }}>{b}</div></div>; })}
      </div>
      <div style={{ position: "absolute", left: L.m === "h" ? L.side + 30 : 160, top, width: 6, height: rowH * n * lineK, borderRadius: 6, background: `linear-gradient(${GOLD}, ${ORANGE})` }} />
      {sc.steps.map((s, i) => {
        const a = p.at + 40 + i * per;
        const on = f >= a;
        const k = spring({ frame: f - a, fps: FPS, config: { damping: 13, mass: 0.6 } });
        const cur = on && f < a + per;
        return <div key={s} style={{ position: "absolute", left: L.m === "h" ? L.side + 10 : 140, top: top + i * rowH - 4, display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 46, height: 46, borderRadius: 50, background: on ? GOLD : "rgba(51,65,85,0.8)", border: "4px solid rgba(2,6,23,0.8)", color: "#1E1B4B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 22,
            transform: `scale(${on ? 0.8 + 0.3 * Math.min(1.2, k) : 0.8})`, boxShadow: cur ? `0 0 30px ${GOLD}` : undefined }}>{"১২৩৪৫৬৭৮৯"[i]}</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: cur ? fs * 1.08 : fs, color: on ? TXT : "rgba(226,232,240,0.45)", textShadow: "0 4px 20px rgba(0,0,0,0.7)", transform: `translateX(${on ? (1 - Math.min(1, k)) * 40 : 0}px)` }}>{s}</div>
        </div>;
      })}
    </AbsoluteFill>
  );
};

const AppS: React.FC<P & { sc: Extract<Scene, { k: "app" }> }> = ({ sc, len, parts }) => {
  const f = useCurrentFrame();
  const L = useL();
  const p = parts[0];
  const pw = pick(L.m, 360, 300, 380);
  const fs = pick(L.m, 36, 28, 32);
  const per = Math.max(1, (p.dur + 10) / sc.bullets.length);
  return (
    <AbsoluteFill>
      <Bg src={sc.bg} len={len} blur={16} dim={0.3} z0={1.1} z1={1.2} />
      <Leak hue={BLUE2} />
      <Kin text={sc.title} hot={sc.title.split(" ").slice(-2)} size={L.ts * 0.85} />
      <div style={{ position: "absolute", left: L.m === "h" ? 1920 - pw - 300 : L.m === "f" ? 60 : (1080 - pw) / 2, top: pick(L.m, 470, 300, 80) }}>
        <Phone w={pw} screens={sc.screens.map((s) => ({ img: s }))} len={len} delay={6} tilt={L.m === "v" ? 0 : -10} />
      </div>
      <div style={{ position: "absolute", left: L.m === "h" ? L.side : L.m === "f" ? 420 : L.side, right: L.m === "h" ? undefined : L.side, width: L.m === "h" ? 860 : undefined,
        top: pick(L.m, 1300, 360, 420), display: "flex", flexDirection: L.m === "v" ? "row" : "column", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {sc.bullets.map((b, i) => { const k = useIn(p.at + i * per, 12); return (
          <div key={b} style={{ padding: `${fs * 0.35}px ${fs * 0.6}px`, borderRadius: 18, background: "rgba(15,23,42,0.6)", border: `2px solid ${MINT}66`, backdropFilter: "blur(10px)",
            fontFamily: BODY, fontWeight: 700, fontSize: L.m === "v" ? fs * 0.8 : fs, color: TXT, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}><span style={{ color: MINT }}>✓ </span>{b}</div>); })}
      </div>
      {L.m === "v" ? null : null}
      {f < 0 ? null : null}
    </AbsoluteFill>
  );
};

const ClipsS: React.FC<P & { sc: Extract<Scene, { k: "clips" }> }> = ({ sc, len }) => {
  const f = useCurrentFrame();
  const L = useL();
  const guruAt = Math.round(len * 0.72);
  const per = guruAt / sc.clips.length;
  const i = Math.min(sc.clips.length - 1, Math.floor(f / per));
  const lf = f - i * per;
  const g = useIn(guruAt, 12);
  const [clip, label] = sc.clips[i];
  return (
    <AbsoluteFill style={{ background: "#020617" }}>
      <AbsoluteFill style={{ filter: f >= guruAt ? `blur(${g * 14}px)` : undefined }}>
        <Sequence from={Math.round(i * per)} layout="none" key={clip}>
          <AbsoluteFill style={{ transform: "scale(1.3)", filter: "blur(28px) brightness(0.55)" }}><OffthreadVideo src={S(`clips/${clip}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
          <div style={{ position: "absolute", left: L.m === "h" ? 260 : 30, right: L.m === "h" ? 260 : 30, top: "50%", aspectRatio: "16 / 9", transform: `translateY(-50%) perspective(1600px) rotateX(${Math.sin(lf / 40) * 2}deg) scale(${1 + lf * 0.0008})`,
            borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 3px rgba(255,255,255,0.15)" }}>
            <OffthreadVideo src={S(`clips/${clip}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,6,23,0.75), rgba(2,6,23,0.05) 35%, rgba(2,6,23,0.05) 60%, rgba(2,6,23,0.8))" }} />
      <Kin text={sc.title} hot={sc.title.split(" ").slice(-2)} size={L.ts * 0.8} />
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(L.m, 1240, 1080, 940), textAlign: "center", opacity: f >= guruAt ? 0 : 1 }}>
        <span key={label} style={{ display: "inline-block", padding: "14px 30px", borderRadius: 40, background: `linear-gradient(90deg, ${BLUE}, #1E40AF)`, fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 48, 40, 44), color: "#fff",
          transform: `scale(${spring({ frame: lf, fps: FPS, config: { damping: 12 } })})` }}>{label}</span>
      </div>
      {f >= guruAt ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, transform: `scale(${0.7 + 0.3 * g})`, opacity: g }}>
          <Img src={S(`art/${sc.guru[0]}.jpg`)} style={{ width: pick(L.m, 360, 300, 320), height: pick(L.m, 360, 300, 320), borderRadius: 400, objectFit: "cover", border: `6px solid ${GOLD}`, boxShadow: `0 0 80px ${GOLD}88` }} />
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 64, 52, 58), color: TXT, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>{sc.guru[1]}</div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

const TurnS: React.FC<P & { sc: Extract<Scene, { k: "turn" }> }> = ({ sc, len, parts }) => {
  const L = useL();
  const ys = pick(L.m, [560, 860, 1190], [300, 560, 820], [300, 520, 740]);
  return (
    <AbsoluteFill>
      <Bg src={sc.art} len={len} z0={1.0} z1={1.18} dim={0.15} />
      <Leak hue={GOLD} />
      <Kin text={sc.title} hot={sc.title.split(" ").slice(1, 2)} size={L.ts * 0.85} />
      {sc.lines.map((d, i) => <DlgCard key={d.id} d={d} at={parts[i + 1].at - 4} side={d.who === "আপনি" ? "r" : "l"} y={ys[i]} />)}
    </AbsoluteFill>
  );
};

const SubsS: React.FC<P & { sc: Extract<Scene, { k: "subs" }> }> = ({ sc, len }) => {
  const f = useCurrentFrame();
  const L = useL();
  const fs = pick(L.m, 32, 26, 28);
  const a = useIn(4, 10, 0.7), g = useIn(26, 9, 0.6);
  return (
    <AbsoluteFill>
      <Bg src={sc.bg} len={len} blur={14} dim={0.35} />
      <Leak hue={GOLD} />
      <Kin text="অ্যাপ লঞ্চিং উপলক্ষে" hot={["লঞ্চিং"]} size={L.ts * 0.75} />
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(L.m, 420, 170, 220), textAlign: "center", transform: `scale(${a})` }}>
        <span style={{ display: "inline-block", padding: "14px 34px", borderRadius: 30, background: "rgba(37,99,235,0.75)", border: `3px solid ${BLUE2}`, backdropFilter: "blur(10px)", fontFamily: HEAD, fontWeight: 800, fontSize: fs * 1.4, color: "#fff" }}>{sc.course} নিলে</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(L.m, 540, 270, 320), textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 104, 80, 96), lineHeight: 1.1,
        background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", transform: `scale(${0.4 + 0.6 * g}) rotate(${(1 - g) * -8}deg)`, opacity: g, filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.6))" }}>সাথে সব কোর্স ফ্রি!</div>
      <div style={{ position: "absolute", left: L.side, right: L.side, top: pick(L.m, 780, 440, 480), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {sc.others.map((c, i) => { const k = spring({ frame: f - 44 - i * 4, fps: FPS, config: { damping: 13, mass: 0.6 } }); return (
          <div key={c} style={{ padding: `${fs * 0.36}px ${fs * 0.65}px`, borderRadius: 16, background: "rgba(15,23,42,0.6)", border: `2px solid ${MINT}77`, backdropFilter: "blur(8px)", fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT,
            transform: `translateY(${(1 - k) * -300}px) rotate(${(1 - k) * (i % 2 ? 20 : -20)}deg)`, opacity: Math.min(1, k * 1.5) }}><span style={{ color: MINT }}>+ </span>{c}</div>); })}
      </div>
    </AbsoluteFill>
  );
};

const OfferS: React.FC<P & { sc: Extract<Scene, { k: "offer" }> }> = ({ sc, len }) => {
  const f = useCurrentFrame();
  const L = useL();
  const a = useIn(2, 10), p = useIn(16, 8, 0.7), d = useIn(40, 12), g = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Bg src={sc.bg} len={len} blur={18} dim={0.45} />
      <Leak hue={ORANGE} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: pick(L.m, 26, 16, 16), paddingBottom: pick(L.m, 140, 0, 0) }}>
        <div style={{ padding: "12px 34px", borderRadius: 60, background: `linear-gradient(90deg, ${RED}, ${ORANGE})`, fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 44, 38, 40), color: "#fff", transform: `scale(${a})`, boxShadow: `0 0 ${30 + 30 * g}px ${RED}77` }}>🚀 অ্যাপ লঞ্চিং স্পেশাল</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 70, 58, 62), color: TXT, opacity: a }}>৩ মাসের মেম্বারশিপ</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 100, 84, 90), color: "#CBD5E1", opacity: p }}>মাত্র</span>
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 290, 240, 250), lineHeight: 1, background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", display: "inline-block", transform: `scale(${0.4 + 0.6 * p})`, filter: `drop-shadow(0 0 ${30 + 40 * g}px ${GOLD}66)` }}>৳৯৯৯</span>
        </div>
        <div style={{ padding: "14px 30px", borderRadius: 24, background: "rgba(15,23,42,0.6)", border: `2px solid ${GOLD}88`, backdropFilter: "blur(10px)", fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 46, 38, 42), color: TXT, opacity: d, transform: `translateY(${(1 - d) * 30}px)` }}>📅 ৩০ নভেম্বর ২০২৬ পর্যন্ত</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: BODY, fontWeight: 700, fontSize: pick(L.m, 30, 26, 28), color: "#E2E8F0", opacity: lerp(f, 60, 74), padding: "0 50px", textAlign: "center" }}><PlayLogo s={28} /> শুধু Google Play অ্যাপের ভেতরে পেমেন্টে</div>
        <div style={{ fontFamily: BODY, fontSize: pick(L.m, 24, 21, 22), color: "#94A3B8", opacity: lerp(f, 70, 84), padding: "0 60px", textAlign: "center" }}>নতুন সাবস্ক্রাইবারদের জন্য প্রথম ৩ মাস · এরপর নিয়মিত দামে নবায়ন, যেকোনো সময় বাতিল করা যায়</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CtaS: React.FC<P & { sc: Extract<Scene, { k: "cta" }> }> = ({ sc, len }) => {
  const f = useCurrentFrame();
  const L = useL();
  const i = useIn(Math.round(len * 0.25), 11), b = useIn(Math.round(len * 0.3), 10);
  const g = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Bg src={sc.bg} len={len} z0={1.0} z1={1.15} dim={0.25} />
      <AbsoluteFill style={{ background: `rgba(2,6,23,${0.55 * i})` }} />
      <Leak hue={BLUE} />
      <Kin text={sc.title} hot={["আপনিই"]} size={L.ts * 0.85} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, paddingTop: pick(L.m, 200, 120, 120) }}>
        <Img src={S("icon.png")} style={{ width: pick(L.m, 200, 150, 160), height: pick(L.m, 200, 150, 160), borderRadius: 44, transform: `scale(${i})`, boxShadow: `0 0 ${50 + 40 * g}px ${BLUE}AA` }} />
        <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: pick(L.m, 50, 42, 46), color: TXT, opacity: i }}>AI University: Online Courses</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(L.m, 84, 70, 76), background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", opacity: b }}>এখনই ডাউনলোড করুন</div>
        <div style={{ transform: `scale(${(0.7 + 0.3 * b) * (1 + 0.025 * Math.sin(f / 5))})` }}><PlayBadge h={pick(L.m, 120, 100, 110)} /></div>
        <div style={{ fontFamily: LAT, fontWeight: 600, fontSize: pick(L.m, 25, 22, 24), color: "#BFDBFE", opacity: lerp(f, len * 0.45, len * 0.55), padding: "8px 20px", borderRadius: 12, background: "rgba(15,23,42,0.6)" }}>play.google.com/store/apps/details?id=bd.aiuniversity.app</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Render: React.FC<P & { sc: Scene }> = (p) => {
  const sc = p.sc;
  switch (sc.k) {
    case "dialog": return <DialogS {...p} sc={sc} />;
    case "worried": return <WorriedS {...p} sc={sc} />;
    case "facts": return <FactsS {...p} sc={sc} />;
    case "pain": return <PainS {...p} sc={sc} />;
    case "bridge": return <BridgeS {...p} sc={sc} />;
    case "problem": return <ProblemS {...p} sc={sc} />;
    case "reveal": return <RevealS {...p} sc={sc} />;
    case "road": return <RoadS {...p} sc={sc} />;
    case "app": return <AppS {...p} sc={sc} />;
    case "clips": return <ClipsS {...p} sc={sc} />;
    case "turn": return <TurnS {...p} sc={sc} />;
    case "subs": return <SubsS {...p} sc={sc} />;
    case "offer": return <OfferS {...p} sc={sc} />;
    case "cta": return <CtaS {...p} sc={sc} />;
  }
};
const SFX: Partial<Record<Scene["k"], string>> = { worried: "boom", facts: "whoosh", pain: "whoosh", bridge: "shimmer", problem: "boom", reveal: "shimmer", road: "whoosh", app: "whoosh", clips: "whoosh", turn: "whoosh", subs: "shimmer", offer: "boom", cta: "riser" };

// zoom-through transition: each scene pushes in from 1.18 with blur, leaves by pushing past the camera
const Wrap: React.FC<{ len: number; first: boolean; children: React.ReactNode }> = ({ len, first, children }) => {
  const f = useCurrentFrame();
  const i = first ? 1 : interpolate(f, [0, OVER + 2], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const o = interpolate(f, [len - OVER, len], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: Math.min(i, 1 - o * 0.9), transform: `scale(${1.18 - 0.18 * i + 0.25 * o})`, filter: `blur(${(1 - i) * 18 + o * 16}px)` }}>{children}</AbsoluteFill>;
};

export const LangStory: React.FC<{ lang: Lang }> = ({ lang }) => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const tl = timeline(lang);
  const music = Math.min(lerp(f, 0, 30, 0.04, 0.15), lerp(f, durationInFrames - 50, durationInFrames, 0.15, 0));
  return (
    <AbsoluteFill style={{ background: "#020617" }}>
      <Audio src={S("music.mp3")} volume={() => music} />
      {tl.map(({ sc, from, len, parts }, i) => (
        <Sequence key={i} from={from} durationInFrames={len}>
          <Wrap len={len} first={i === 0}><Render sc={sc} lang={lang} len={len} parts={parts} /></Wrap>
          {parts.map((p) => <React.Fragment key={p.id}><Sub lang={lang} id={p.id} at={p.at} dur={p.dur} /><Sequence from={p.at}><Audio src={S(audioOf(lang, p.id))} /></Sequence></React.Fragment>)}
          {SFX[sc.k] ? <Audio src={S(`sfx/${SFX[sc.k]}.mp3`)} volume={0.18} /> : null}
        </Sequence>
      ))}
      <Grain />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5))" }} />
    </AbsoluteFill>
  );
};
