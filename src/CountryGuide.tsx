// "<দেশ> যাওয়ার আগে গাইডলাইন" — YouTube guide videos (Serbia / Qatar / Saudi Arabia) built from
// probashibondu.online/guide screenshots + code motion graphics. VO: ElevenLabs v4 (public/guide/vo).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import DUR from "./guide-durations.json";
import VO from "./guide-vo.json";
import LANDPTS from "./land.json";
import DIMS from "./guide-dims.json";
const dim = (f: string) => (DIMS as Record<string, number[]>)[f] ?? [2160, 1000];

const FPS = 30;
const G = (p: string) => staticFile("guide/" + p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const lerp = (f: number, a: number, b: number, x: number, y: number, e = ease) => interpolate(f, [a, b], [x, y], { ...clamp, easing: e });
const bn = (s: string | number) => String(s).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

if (typeof document !== "undefined") {
  for (const [name, file] of [["Hind", "HindSiliguri-Bold.ttf"], ["HindSemi", "HindSiliguri-SemiBold.ttf"], ["Anek", "AnekBangla.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const f = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}
const FONT = "Hind, 'Hind Siliguri', sans-serif";
const SEMI = "HindSemi, Hind, sans-serif";
const INK = "#0B0F0D", CARD = "#141B18", LINE = "rgba(255,255,255,0.10)", GOLD = "#F5B841", RED = "#EF4444", GREEN = "#22C55E", MUTED = "#9AA7A1";

// ---------- country data ----------
type Country = {
  cc: string; name: string; inName: string; statKw: string[]; accent: string; accent2: string; capital: string; code: string; lat: number; lng: number;
  glance: [string, string, string][]; route: { via?: [string, string, number, number][] }; stats: [string, string][];
  first: [string, string][]; rules: [string, string][]; phrasesVo: string; lang: string;
  phrases: [string, string, string][]; // meaning, native, pronunciation
  bounds: [number, number, number, number]; // lonMin, lonMax, latMin, latMax
};
const ARABIC: [string, string, string][] = [
  ["সালাম / হ্যালো", "السلام عليكم", "আসসালামু আলাইকুম"], ["ধন্যবাদ", "شكراً", "শুকরান"], ["হ্যাঁ", "نعم", "নাআম"], ["না", "لا", "লা"],
  ["দাম কত?", "بكم؟", "বিকাম?"], ["আমি বুঝিনি", "ما فهمت", "মা ফাহিমত"], ["সাহায্য করুন", "ساعدني", "সাঈদনি"], ["দয়া করে / শুনুন", "لو سمحت", "লাও সামাহত"],
];
const GULF_RULES: [string, string][] = [
  ["🚫", "মদ, শূকরের মাংস, মাদক বা নিষিদ্ধ ওষুধ সাথে নেবেন না; ওষুধ প্রেসক্রিপশনসহ নিন"],
  ["🌙", "রমজানে দিনের বেলা প্রকাশ্যে খাওয়া-দাওয়া থেকে বিরত থাকুন"],
  ["📷", "অনুমতি ছাড়া কারো, বিশেষ করে নারীদের, ছবি তুলবেন না"],
  ["🛂", "মালিকের কাছে কর্মীর পাসপোর্ট আটকে রাখা আইনে নিষিদ্ধ; সমস্যা হলে দূতাবাসে জানান"],
  ["⚠️", "কাজের জায়গা বদলাতে হলে নিয়ম মেনে করুন; পালিয়ে গেলে অবৈধ"],
  ["❌", "\"ফ্রি ভিসা\" নামে বিক্রি হওয়া ভিসা থেকে সাবধান"],
];
export const COUNTRIES: Record<string, Country> = {
  rs: {
    cc: "rs", name: "সার্বিয়া", inName: "সার্বিয়ায়", statKw: ["দূরত্ব", "বারো", "পিছিয়ে", "শীতে"], accent: "#C6363C", accent2: "#0C4076", capital: "বেলগ্রেড", code: "BEG", lat: 44.79, lng: 20.45, lang: "সার্বিয়ান",
    glance: [["🏛️", "রাজধানী", "বেলগ্রেড"], ["🗣️", "ভাষা", "সার্বিয়ান"], ["💶", "মুদ্রা", "সার্বিয়ান দিনার (RSD)"], ["🛬", "প্রধান বিমানবন্দর", "বেলগ্রেড নিকোলা টেসলা (BEG)"],
      ["✈️", "ঢাকা থেকে ফ্লাইট", "সরাসরি নেই · ১২–১৮ ঘণ্টা"], ["🚨", "জরুরি নম্বর", "পুলিশ ১৯২ · অ্যাম্বুলেন্স ১৯৪"], ["🔌", "বিদ্যুতের প্লাগ", "C / F"], ["📅", "সাপ্তাহিক ছুটি", "শনি–রবি"]],
    route: { via: [["IST", "ইস্তাম্বুল", 41.01, 28.98], ["DXB", "দুবাই", 25.2, 55.27], ["DOH", "দোহা", 25.29, 51.53]] },
    stats: [["৬,৬২১ কিমি", "ঢাকা থেকে দূরত্ব"], ["১২–১৮ ঘণ্টা", "ট্রানজিটসহ যাত্রা"], ["৪ ঘণ্টা পিছিয়ে", "শীতে ৫ ঘণ্টা"], ["শূন্যের নিচে", "শীতের তাপমাত্রা"]],
    first: [["👮", "২৪ ঘণ্টার মধ্যে থাকার ঠিকানা পুলিশে নিবন্ধন — মালিক/বাড়িওয়ালা করেছেন কিনা নিশ্চিত হোন"], ["📄", "কাজ ও থাকার অনুমতিপত্রের কাগজ আর মেয়াদ বুঝে নিন"], ["📱", "পাসপোর্ট দিয়ে সার্বিয়ান সিম নিন"], ["🏢", "কোন বাংলাদেশ দূতাবাস সার্বিয়ার দায়িত্বে, আগেই জেনে নিন"]],
    rules: [["🇪🇺", "সার্বিয়া ইইউ বা শেনজেনের সদস্য নয় — এই ভিসায় শেনজেন দেশে ঢোকা যায় না"], ["⛔", "দালালের কথায় অবৈধভাবে সীমান্ত পার হবেন না — অপরাধ ও প্রাণঘাতী"], ["⏳", "পারমিটের শর্ত ও মেয়াদ জানুন; মেয়াদ পেরোলে অবৈধ"], ["❌", "\"ফ্রি ভিসা\" বা \"ভিসা ছাড়াই ইউরোপে কাজ\" = প্রতারণা"]],
    phrasesVo: "rs/phrases",
    phrases: [["শুভ দিন / হ্যালো", "Добар дан", "দোবার দান"], ["ধন্যবাদ", "Хвала", "হভালা"], ["হ্যাঁ", "Да", "দা"], ["না", "Не", "নে"], ["দাম কত?", "Колико кошта?", "কোলিকো কোশ্তা?"], ["আমি বুঝিনি", "Не разумем", "নে রাজুমেম"], ["সাহায্য করুন!", "Упомоћ!", "উপোমোচ!"], ["মাফ করবেন", "Извините", "ইজভিনিতে"]],
    bounds: [8, 102, 8, 56],
  },
  qa: {
    cc: "qa", name: "কাতার", inName: "কাতারে", statKw: ["দূরত্ব", "সময় লাগে", "পিছিয়ে", "গ্রীষ্মে"], accent: "#8A1538", accent2: "#5C0E26", capital: "দোহা", code: "DOH", lat: 25.29, lng: 51.53, lang: "আরবি",
    glance: [["🏛️", "রাজধানী", "দোহা"], ["🗣️", "ভাষা", "আরবি"], ["💵", "মুদ্রা", "কাতারি রিয়াল (QAR)"], ["🛬", "প্রধান বিমানবন্দর", "হামাদ আন্তর্জাতিক (DOH)"],
      ["✈️", "ঢাকা থেকে ফ্লাইট", "সরাসরি · প্রায় ৫.৫ ঘণ্টা"], ["🚨", "জরুরি নম্বর", "৯৯৯"], ["🔌", "বিদ্যুতের প্লাগ", "G (৩ পিন)"], ["📅", "সাপ্তাহিক ছুটি", "শুক্র–শনি"]],
    route: {},
    stats: [["প্রায় ৪,০০০ কিমি", "ঢাকা থেকে দূরত্ব"], ["৫.৫ ঘণ্টা", "সরাসরি ফ্লাইট"], ["৩ ঘণ্টা পিছিয়ে", "ঢাকার তুলনায়"], ["৪০°+", "গ্রীষ্মের তাপমাত্রা"]],
    first: [["🪪", "মালিক কাতার আইডি (QID) করাবেন — আগে মেডিকেল ও আঙুলের ছাপ"], ["📲", "Metrash2 অ্যাপে আইডি, মেয়াদ ও সরকারি সেবা"], ["📱", "সিম নিতে পাসপোর্ট বা QID লাগবে"], ["🏦", "বেতন ব্যাংকে নিন, চুক্তির সাথে মিলিয়ে দেখুন"], ["🏢", "দোহায় বাংলাদেশ দূতাবাসের নম্বর সেভ রাখুন"]],
    rules: [["🪪", "কাতার আইডি সবসময় সাথে রাখুন"], ...GULF_RULES],
    phrasesVo: "common/arabic", phrases: ARABIC,
    bounds: [40, 100, 5, 40],
  },
  sa: {
    cc: "sa", name: "সৌদি আরব", inName: "সৌদি আরবে", statKw: ["দূরত্ব", "সময় লাগে", "পিছিয়ে", "গ্রীষ্মে"], accent: "#006C35", accent2: "#00451F", capital: "রিয়াদ", code: "RUH", lat: 24.71, lng: 46.68, lang: "আরবি",
    glance: [["🏛️", "রাজধানী", "রিয়াদ"], ["🗣️", "ভাষা", "আরবি"], ["💵", "মুদ্রা", "সৌদি রিয়াল (SAR)"], ["🛬", "প্রধান বিমানবন্দর", "রিয়াদ (RUH) · জেদ্দা (JED) · দাম্মাম (DMM)"],
      ["✈️", "ঢাকা থেকে ফ্লাইট", "সরাসরি · প্রায় ৬ ঘণ্টা"], ["🚨", "জরুরি নম্বর", "৯১১ · পুলিশ ৯৯৯"], ["🔌", "বিদ্যুতের প্লাগ", "G (৩ পিন)"], ["📅", "সাপ্তাহিক ছুটি", "শুক্র–শনি"]],
    route: { via: [["JED", "জেদ্দা", 21.54, 39.17], ["DMM", "দাম্মাম", 26.43, 50.1]] },
    stats: [["প্রায় ৪,৫০০ কিমি", "ঢাকা–রিয়াদ দূরত্ব"], ["৬ ঘণ্টা", "সরাসরি ফ্লাইট"], ["৩ ঘণ্টা পিছিয়ে", "ঢাকার তুলনায়"], ["৪০°+", "গ্রীষ্মের তাপমাত্রা"]],
    first: [["🪪", "মালিক ইকামা (রেসিডেন্স পারমিট) করাবেন — কবে হবে জেনে নিন"], ["📲", "Absher অ্যাপে নিজের তথ্য ও মেয়াদ দেখুন"], ["📱", "সিম নিতে পাসপোর্ট/ইকামা ও আঙুলের ছাপ"], ["🏦", "বেতন ব্যাংক অ্যাকাউন্টে নিন, নগদে নয়"], ["🏢", "রিয়াদে দূতাবাস, জেদ্দায় কনস্যুলেট — নম্বর সেভ রাখুন"]],
    rules: [["🪪", "ইকামা সবসময় সাথে রাখুন; মেয়াদের আগে নবায়নের কথা মালিককে বলুন"], ...GULF_RULES],
    phrasesVo: "common/arabic", phrases: ARABIC,
    bounds: [30, 100, 5, 42],
  },
  md: {
    cc: "md", name: "মলদোভা", inName: "মলদোভায়", statKw: ["দূরত্ব", "বারো", "পিছিয়ে", "শীত খুব"], accent: "#0046AE", accent2: "#CC092F", capital: "কিশিনাউ", code: "RMO", lat: 47.01, lng: 28.86, lang: "রোমানিয়ান",
    glance: [["🏛️", "রাজধানী", "কিশিনাউ"], ["🗣️", "ভাষা", "রোমানিয়ান (রুশও প্রচলিত)"], ["💶", "মুদ্রা", "মলদোভান লিউ (MDL)"], ["🛬", "প্রধান বিমানবন্দর", "কিশিনাউ আন্তর্জাতিক (RMO)"],
      ["✈️", "ঢাকা থেকে ফ্লাইট", "সরাসরি নেই · ১২–১৮ ঘণ্টা"], ["🚨", "জরুরি নম্বর", "১১২"], ["🔌", "বিদ্যুতের প্লাগ", "C / F"], ["📅", "সাপ্তাহিক ছুটি", "শনি–রবি"]],
    route: { via: [["IST", "ইস্তাম্বুল", 41.01, 28.98], ["DXB", "দুবাই", 25.2, 55.27], ["DOH", "দোহা", 25.29, 51.53]] },
    stats: [["প্রায় ৫,৯৭০ কিমি", "ঢাকা থেকে দূরত্ব"], ["১২–১৮ ঘণ্টা", "ট্রানজিটসহ যাত্রা"], ["৩ ঘণ্টা পিছিয়ে", "শীতে ৪ ঘণ্টা"], ["শূন্যের নিচে", "কঠিন শীত"]],
    first: [["🏢", "মাইগ্রেশন অফিসে রেসিডেন্স পারমিটের প্রক্রিয়া শেষ করুন"], ["📄", "থাকার ঠিকানা ও কাজের চুক্তির কপি সাথে রাখুন"], ["🧥", "শীত খুব কঠিন — ভারী জ্যাকেট, গ্লাভস ও বুট নিন"], ["🇧🇩", "কোন বাংলাদেশ দূতাবাস মলদোভার দায়িত্বে, আগেই জেনে নিন"]],
    rules: [["🇪🇺", "মলদোভা ইইউ বা শেনজেনের সদস্য নয় — এই ভিসায় শেনজেন দেশে ঢোকা যায় না"], ["⛔", "দালালের কথায় অবৈধভাবে সীমান্ত পার হবেন না — অপরাধ ও প্রাণঘাতী"], ["⏳", "পারমিটের শর্ত ও মেয়াদ জানুন; মেয়াদ পেরোলে অবৈধ"], ["❌", "\"ফ্রি ভিসা\" বা \"ভিসা ছাড়াই ইউরোপে কাজ\" = প্রতারণা"]],
    phrasesVo: "md/phrases",
    phrases: [["শুভ দিন / হ্যালো", "Bună ziua", "বুনা জিউয়া"], ["ধন্যবাদ", "Mulțumesc", "মুলৎসুমেস্ক"], ["হ্যাঁ", "Da", "দা"], ["না", "Nu", "নু"], ["দাম কত?", "Cât costă?", "কৎ কস্তা?"], ["আমি বুঝিনি", "Nu înțeleg", "নু ইনৎসেলেগ"], ["সাহায্য করুন!", "Ajutor!", "আজুতর!"], ["মাফ করবেন", "Scuzați-mă", "স্কুজাৎসি-মা"]],
    bounds: [8, 102, 8, 58],
  },
  mk: {
    cc: "mk", name: "উত্তর মেসিডোনিয়া", inName: "উত্তর মেসিডোনিয়ায়", statKw: ["দূরত্ব", "বারো", "পিছিয়ে", "শীতে"], accent: "#D20000", accent2: "#8F0000", capital: "স্কোপিয়ে", code: "SKP", lat: 42.0, lng: 21.43, lang: "মেসিডোনিয়ান",
    glance: [["🏛️", "রাজধানী", "স্কোপিয়ে"], ["🗣️", "ভাষা", "মেসিডোনিয়ান (আলবেনীয়ও সরকারি)"], ["💶", "মুদ্রা", "মেসিডোনিয়ান দেনার (MKD)"], ["🛬", "প্রধান বিমানবন্দর", "স্কোপিয়ে আন্তর্জাতিক (SKP)"],
      ["✈️", "ঢাকা থেকে ফ্লাইট", "সরাসরি নেই · ১২–১৮ ঘণ্টা"], ["🚨", "জরুরি নম্বর", "১১২"], ["🔌", "বিদ্যুতের প্লাগ", "C / F"], ["📅", "সাপ্তাহিক ছুটি", "শনি–রবি"]],
    route: { via: [["IST", "ইস্তাম্বুল", 41.01, 28.98], ["DXB", "দুবাই", 25.2, 55.27], ["DOH", "দোহা", 25.29, 51.53]] },
    stats: [["প্রায় ৬,৬০০ কিমি", "ঢাকা থেকে দূরত্ব"], ["১২–১৮ ঘণ্টা", "ট্রানজিটসহ যাত্রা"], ["৪ ঘণ্টা পিছিয়ে", "শীতে ৫ ঘণ্টা"], ["শূন্যের নিচে", "শীতের তাপমাত্রা"]],
    first: [["👮", "সাধারণত ২৪ ঘণ্টার মধ্যে থাকার ঠিকানা পুলিশে নিবন্ধন"], ["📄", "কাজ ও থাকার অনুমতিপত্রের মেয়াদ জেনে রাখুন"], ["🏦", "সিম ও ব্যাংক অ্যাকাউন্টে পাসপোর্ট ও পারমিট লাগবে"], ["🇧🇩", "কোন বাংলাদেশ দূতাবাস উত্তর মেসিডোনিয়ার দায়িত্বে, জেনে নিন"]],
    rules: [["🇪🇺", "উত্তর মেসিডোনিয়া ইইউ বা শেনজেনের সদস্য নয় — এই ভিসায় শেনজেন দেশে ঢোকা যায় না"], ["⛔", "দালালের কথায় অবৈধভাবে সীমান্ত পার হবেন না — অপরাধ ও প্রাণঘাতী"], ["⏳", "পারমিটের শর্ত ও মেয়াদ জানুন; মেয়াদ পেরোলে অবৈধ"], ["❌", "\"ফ্রি ভিসা\" বা \"ভিসা ছাড়াই ইউরোপে কাজ\" = প্রতারণা"]],
    phrasesVo: "mk/phrases",
    phrases: [["শুভ দিন / হ্যালো", "Добар ден", "দোবার দেন"], ["ধন্যবাদ", "Благодарам", "ব্লাগোদারাম"], ["হ্যাঁ", "Да", "দা"], ["না", "Не", "নে"], ["দাম কত?", "Колку чини?", "কলকু চিনি?"], ["আমি বুঝিনি", "Не разбирам", "নে রাজবিরাম"], ["সাহায্য করুন!", "Помош!", "পোমোশ!"], ["মাফ করবেন", "Извинете", "ইজভিনেতে"]],
    bounds: [8, 102, 8, 56],
  },
  pt: {
    cc: "pt", name: "পর্তুগাল", inName: "পর্তুগালে", statKw: ["দূরত্ব", "তেরো", "পিছিয়ে", "শীত তুলনামূলক"], accent: "#046A38", accent2: "#DA291C", capital: "লিসবন", code: "LIS", lat: 38.72, lng: -9.14, lang: "পর্তুগিজ",
    glance: [["🏛️", "রাজধানী", "লিসবন"], ["🗣️", "ভাষা", "পর্তুগিজ"], ["💶", "মুদ্রা", "ইউরো (EUR)"], ["🛬", "প্রধান বিমানবন্দর", "লিসবন উম্বের্তো দেলগাদো (LIS)"],
      ["✈️", "ঢাকা থেকে ফ্লাইট", "মধ্যপ্রাচ্য/ইস্তাম্বুল হয়ে · ১৩–২০ ঘণ্টা"], ["🚨", "জরুরি নম্বর", "১১২"], ["🔌", "বিদ্যুতের প্লাগ", "C / F"], ["📅", "সাপ্তাহিক ছুটি", "শনি–রবি"]],
    route: { via: [["IST", "ইস্তাম্বুল", 41.01, 28.98], ["DXB", "দুবাই", 25.2, 55.27], ["DOH", "দোহা", 25.29, 51.53]] },
    stats: [["প্রায় ৯,১৫০ কিমি", "ঢাকা থেকে দূরত্ব"], ["১৩–২০ ঘণ্টা", "ট্রানজিটসহ যাত্রা"], ["৫ ঘণ্টা পিছিয়ে", "শীতে ৬ ঘণ্টা"], ["নরম শীত", "তবে বৃষ্টি বেশি"]],
    first: [["🔢", "সবার আগে NIF (ট্যাক্স নম্বর) — প্রায় সব কাজে লাগে"], ["🏥", "NISS (সামাজিক নিরাপত্তা) ও SNS (স্বাস্থ্যসেবা) নম্বর নিন"], ["🗂️", "রেসিডেন্স পারমিট AIMA-র মাধ্যমে — অ্যাপয়েন্টমেন্টের খোঁজ রাখুন"], ["🇧🇩", "লিসবনে বাংলাদেশ দূতাবাসের নম্বর সেভ রাখুন"]],
    rules: [["🇪🇺", "পারমিটে শেনজেনে বেড়ানো যায় (১৮০ দিনে ৯০ দিন), কাজ শুধু পর্তুগালে"], ["⏳", "পারমিটের মেয়াদ শেষের আগেই নবায়নের আবেদন"], ["🥩", "ইউরোপে মাংস ও দুধজাত খাবার নিয়ে ঢোকা নিষেধ"], ["🧾", "ট্যাক্স ও সামাজিক নিরাপত্তা নম্বরে বৈধ কাজ; নগদে অবৈধ কাজে সুরক্ষা নেই"], ["🎫", "বাস-ট্রেনে টিকিট কেটে ভ্যালিডেট করুন — নইলে বড় জরিমানা"], ["❌", "\"ফ্রি ভিসা\" বা \"ভিসা ছাড়াই ইউরোপে কাজ\" = প্রতারণা"]],
    phrasesVo: "pt/phrases",
    phrases: [["শুভ সকাল", "Bom dia", "বম দিয়া"], ["ধন্যবাদ", "Obrigado", "ওব্রিগাদু"], ["হ্যাঁ", "Sim", "সিং"], ["না", "Não", "নাউ"], ["দাম কত?", "Quanto custa?", "কুয়ান্তু কুশতা?"], ["আমি বুঝিনি", "Não entendo", "নাউ এন্তেন্দু"], ["সাহায্য করুন!", "Socorro!", "সুকোরু!"], ["দুঃখিত / মাফ করবেন", "Desculpe", "দিশকুলপ"]],
    bounds: [-14, 100, 4, 60],
  },
};

// ---------- timeline ----------
type SceneId = "intro" | "glance" | "flight" | "before" | "dac" | "bp" | "plane" | "arrive" | "first" | "docs" | "rules" | "phrases" | "outro";
const CHAPTERS: Record<SceneId, string> = {
  intro: "", glance: "এক নজরে", flight: "ফ্লাইট ও দূরত্ব", before: "যাত্রার আগে", dac: "ঢাকা বিমানবন্দর", bp: "বোর্ডিং পাস", plane: "বিমানে ও ট্রানজিটে",
  arrive: "পৌঁছে", first: "প্রথম সপ্তাহ", docs: "কাগজপত্রের চেকলিস্ট", rules: "নিয়মকানুন ও সাবধানতা", phrases: "দরকারি কথা", outro: "শেষ কথা",
};
const ORDER: SceneId[] = ["intro", "glance", "flight", "before", "dac", "bp", "plane", "arrive", "first", "docs", "rules", "phrases", "outro"];
const voOf = (c: Country, id: SceneId) =>
  ({ intro: `${c.cc}/intro`, glance: `${c.cc}/glance`, flight: `${c.cc}/flight`, first: `${c.cc}/first`, rules: `${c.cc}/rules`, phrases: c.phrasesVo,
    before: "common/before", dac: "common/dac", bp: "common/bp", plane: "common/plane", arrive: "common/arrive", docs: "common/docs", outro: "common/outro" })[id];
const PAD = 0.9, VO_IN = 12;
export const timeline = (c: Country) => {
  let at = 0;
  return ORDER.map((id) => {
    const vo = voOf(c, id);
    const len = Math.round(((DUR as Record<string, number>)[vo] + PAD) * FPS) + VO_IN + (id === "outro" ? 90 : 0);
    const r = { id, vo, from: at, len };
    at += len;
    return r;
  });
};
export const guideTotal = (cc: string) => { const t = timeline(COUNTRIES[cc]); return t[t.length - 1].from + t[t.length - 1].len; };

// frame (inside scene) at which a keyword is spoken — proportional to its place in the script
const cue = (vo: string, kw: string, fallback = 0) => {
  const t = (VO as { p: string; t: string }[]).find((x) => x.p === vo)!.t;
  const i = t.indexOf(kw);
  return VO_IN + Math.round(((i < 0 ? fallback : i / t.length) * (DUR as Record<string, number>)[vo]) * FPS);
};

// ---------- shared visuals ----------
const useLand = () => LANDPTS as [number, number][];

const Backdrop: React.FC<{ c: Country }> = ({ c }) => {
  const f = useCurrentFrame();
  const x = 20 + Math.sin(f / 120) * 6, y = 85 + Math.cos(f / 140) * 5;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}% -10%, ${c.accent}55 0%, transparent 55%), radial-gradient(circle at ${y}% 120%, #0E7C5A44 0%, transparent 50%), ${INK}` }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px", backgroundPosition: `${f * 0.2}px 0`, maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }} />
    </AbsoluteFill>
  );
};

const FlagSvg: React.FC<{ cc: string; w: number; h: number }> = ({ cc, w, h }) => {
  if (cc === "rs") return (<svg width={w} height={h} viewBox="0 0 9 6" preserveAspectRatio="none"><rect width="9" height="2" fill="#C6363C" /><rect y="2" width="9" height="2" fill="#0C4076" /><rect y="4" width="9" height="2" fill="#fff" /></svg>);
  if (cc === "qa") {
    const pts = ["0,0", "3.5,0"]; for (let i = 0; i < 9; i++) { pts.push(`${4.6},${(i + 0.5) * (11 / 9)}`, `3.5,${(i + 1) * (11 / 9)}`); } pts.push("0,11");
    return (<svg width={w} height={h} viewBox="0 0 28 11" preserveAspectRatio="none"><rect width="28" height="11" fill="#8A1538" /><polygon points={pts.join(" ")} fill="#fff" /></svg>);
  }
  if (cc === "md") return (<svg width={w} height={h} viewBox="0 0 12 6" preserveAspectRatio="none"><rect width="4" height="6" fill="#0046AE" /><rect x="4" width="4" height="6" fill="#FFD200" /><rect x="8" width="4" height="6" fill="#CC092F" />
    <path d="M5.2 2.2 L6 1.6 L6.8 2.2 L6.8 3.6 L6 4.4 L5.2 3.6 Z" fill="#B07E18" /><rect x="5.55" y="2.4" width="0.9" height="1.2" fill="#0046AE" /></svg>);
  if (cc === "mk") return (<svg width={w} height={h} viewBox="-10 -5 20 10" preserveAspectRatio="none"><rect x="-10" y="-5" width="20" height="10" fill="#D20000" />
    {[[-10, -5], [0, -5], [10, -5], [-10, 0], [10, 0], [-10, 5], [0, 5], [10, 5]].map(([x, y], i) => { const a = Math.atan2(y, x), n = 0.9; return <polygon key={i} points={`${Math.cos(a - Math.PI / 2) * n},${Math.sin(a - Math.PI / 2) * n} ${Math.cos(a + Math.PI / 2) * n},${Math.sin(a + Math.PI / 2) * n} ${x},${y}`} fill="#FFE600" />; })}
    <circle r="1.9" fill="#D20000" /><circle r="1.6" fill="#FFE600" /></svg>);
  if (cc === "pt") return (<svg width={w} height={h} viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#DA291C" /><rect width="12" height="20" fill="#046A38" />
    <circle cx="12" cy="10" r="4.6" fill="none" stroke="#FFE900" strokeWidth="1" /><path d="M9.6 7.4 h4.8 v3.6 a2.4 2.4 0 0 1 -4.8 0 Z" fill="#DA291C" stroke="#fff" strokeWidth="0.35" /><path d="M10.6 8.4 h2.8 v2.4 a1.4 1.4 0 0 1 -2.8 0 Z" fill="#fff" /></svg>);
  if (cc === "bd") return (<svg width={w} height={h} viewBox="0 0 10 6"><rect width="10" height="6" fill="#006A4E" /><circle cx="4.5" cy="3" r="2" fill="#F42A41" /></svg>);
  return (
    <svg width={w} height={h} viewBox="0 0 150 100" preserveAspectRatio="none">
      <rect width="150" height="100" fill="#006C35" />
      <text x="75" y="50" textAnchor="middle" fill="#fff" fontSize="13" fontFamily="'Segoe UI', 'Arial'" direction="rtl">لا إله إلا الله محمد رسول الله</text>
      <path d="M38 68 L112 68 L116 64 L116 72 L112 70 L38 70 Z" fill="#fff" />
    </svg>
  );
};

// waving flag made of vertical slices
const WaveFlag: React.FC<{ cc: string; w: number; h: number; amp?: number }> = ({ cc, w, h, amp = 14 }) => {
  const f = useCurrentFrame();
  const N = 36, sw = w / N;
  return (
    <div style={{ position: "relative", width: w, height: h + amp * 2, filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}>
      {new Array(N).fill(0).map((_, i) => {
        const ph = i / N * Math.PI * 2.2 - f / 9;
        const dy = Math.sin(ph) * amp * (0.3 + 0.7 * i / N);
        const shade = 0.5 + 0.5 * Math.cos(ph);
        return (
          <div key={i} style={{ position: "absolute", left: i * sw, top: amp + dy, width: sw + 0.6, height: h, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: -i * sw }}><FlagSvg cc={cc} w={w} h={h} /></div>
            <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.28 * (1 - shade)})` }} />
            <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${0.14 * shade * shade})` }} />
          </div>
        );
      })}
    </div>
  );
};

const Title: React.FC<{ text: string; at?: number; size?: number; color?: string; align?: "left" | "center"; hl?: string; c?: Country }> = ({ text, at = 0, size = 76, color = "#fff", align = "left", hl, c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: FONT, fontSize: size, lineHeight: 1.22, color, display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, justifyContent: align === "center" ? "center" : "flex-start" }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: f - at - i * 3, fps, config: { damping: 15, stiffness: 150 } });
        return <span key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 34}px)`, filter: `blur(${(1 - p) * 6}px)`, color: hl && w.includes(hl) ? GOLD : undefined }}>{w}</span>;
      })}
      {c && <span />}
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px", borderRadius: 999, background: color, color: "#fff", fontFamily: SEMI, fontSize: 28 }}>{children}</span>
);

// screenshot in a browser-like frame; scrolls through a tall capture (CSS px width = img.width/2)
const Shot: React.FC<{ src: string; w: number; h: number; imgW: number; imgH: number; y0?: number; y1?: number; a?: number; b?: number; zoom?: number; x0?: number; style?: React.CSSProperties }> = ({ src, w, h, imgW, imgH, y0 = 0, y1 = 0, a = 0, b = 1, zoom = 1, x0 = 0, style }) => {
  const f = useCurrentFrame();
  const k = (w / imgW) * zoom;
  const y = interpolate(f, [a, b], [y0, y1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ty = Math.min(0, Math.max(h - imgH * k, -y * imgH * k));
  return (
    <div style={{ width: w, borderRadius: 22, overflow: "hidden", background: CARD, boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12)", ...style }}>
      <div style={{ height: 40, background: "#1C2420", display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((x) => <div key={x} style={{ width: 13, height: 13, borderRadius: "50%", background: x }} />)}
        <div style={{ marginLeft: 14, padding: "4px 16px", borderRadius: 8, background: "#0F1513", color: MUTED, fontSize: 18, fontFamily: "Montserrat" }}>🔒 probashibondu.online/guide</div>
      </div>
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden" }}>
        <Img src={G(src)} style={{ position: "absolute", width: imgW * k, left: -x0 * imgW * k, top: ty }} />
      </div>
    </div>
  );
};

const ListItem: React.FC<{ at: number; n?: number; icon?: string; text: string; color: string; done?: boolean; size?: number; active?: boolean }> = ({ at, n, icon, text, color, size = 36, active }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 15 } });
  const tick = spring({ frame: f - at - 8, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 26px", borderRadius: 20, background: active ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.045)", border: `1px solid ${active ? color : LINE}`,
      opacity: p, transform: `translateX(${(1 - p) * 80}px)`, boxShadow: active ? `0 0 30px ${color}55` : "none" }}>
      <div style={{ width: size * 1.6, height: size * 1.6, flexShrink: 0, borderRadius: 14, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "#fff", fontSize: size * 0.85, transform: `scale(${0.6 + 0.4 * tick})` }}>
        {icon ?? (n !== undefined ? bn(n) : "✓")}
      </div>
      <div style={{ fontFamily: SEMI, fontSize: size, color: "#fff", lineHeight: 1.35 }}>{text}</div>
    </div>
  );
};

// ---------- scenes ----------
type SP = { c: Country; len: number; vo: string };

const Intro: React.FC<SP> = ({ c, len }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fl = spring({ frame: f - 2, fps, config: { damping: 18 } });
  const logos = spring({ frame: f - 60, fps, config: { damping: 14 } });
  const shotIn = spring({ frame: f - 150, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 150, transform: `translateX(${(1 - fl) * -500}px) rotate(${-4 * fl}deg)`, opacity: fl }}>
        <WaveFlag cc={c.cc} w={560} h={c.cc === "qa" ? 220 : 373} />
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 200, width: 880 }}>
        <Title text={`${c.name} যাওয়ার আগে`} at={14} size={c.name.length > 12 ? 80 : 96} />
        <div style={{ height: 6 }} />
        <Title text="গাইডলাইন — বিস্তারিত দেখুন" at={30} size={70} hl="বিস্তারিত" />
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 90, display: "flex", alignItems: "center", gap: 36, opacity: logos, transform: `translateY(${(1 - logos) * 40}px)` }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "14px 22px" }}><Img src={staticFile("serbia/probashi-bondhu-logo.png")} style={{ height: 64 }} /></div>
        <div style={{ fontFamily: SEMI, color: MUTED, fontSize: 28 }}>সার্বিক সহযোগিতায়</div>
        <div style={{ background: "#fff", borderRadius: 18, padding: "14px 22px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 64 }} /></div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 170, opacity: shotIn, transform: `perspective(1800px) rotateY(${-14 + 6 * shotIn}deg) translateX(${(1 - shotIn) * 300}px)` }}>
        <Shot src={`${c.cc}/s00.png`} w={760} h={408} imgW={2160} imgH={1160} />
        <div style={{ height: 24 }} />
        <Shot src={`${c.cc}/s02.png`} w={760} h={300} imgW={2160} imgH={dim(`${c.cc}/s02.png`)[1]} y0={0} y1={0.35} a={200} b={len - 40} />
      </div>
    </AbsoluteFill>
  );
};

const Glance: React.FC<SP> = ({ c, vo }) => {
  const keys = ["রাজধানী", "ভাষা", "মুদ্রা", "বিমানবন্দর", "", "জরুরি", "প্লাগ", "ছুটি"];
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: "150px 110px 0" }}>
      <Title text={`এক নজরে ${c.name}`} size={72} hl={c.name.split(" ")[0]} />
      <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
        {c.glance.map(([icon, label, value], i) => {
          const at = keys[i] ? cue(vo, keys[i], i / 8) - 10 : cue(vo, "বিমানবন্দর") + 25;
          const p = spring({ frame: f - at, fps: 30, config: { damping: 14 } });
          const lit = f >= at && f < at + 75;
          return (
            <div key={label} style={{ height: 300, borderRadius: 26, background: lit ? `linear-gradient(160deg, ${c.accent}, ${c.accent2})` : CARD, border: `1px solid ${LINE}`, padding: 30,
              display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: Math.max(0.25, p), transform: `translateY(${(1 - p) * 60}px) scale(${lit ? 1.03 : 1})`, transition: "none" }}>
              <div style={{ fontSize: 60 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: SEMI, fontSize: 26, color: lit ? "#ffffffcc" : MUTED }}>{label}</div>
                <div style={{ fontFamily: FONT, fontSize: value.length > 22 ? 32 : 40, color: "#fff", lineHeight: 1.25, marginTop: 6 }}>{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Flight: React.FC<SP> = ({ c, len, vo }) => {
  const f = useCurrentFrame();
  const land = useLand();
  const [l0, l1, b0, b1] = c.bounds;
  const W = 1150, H = 760;
  const px = (lng: number) => ((lng - l0) / (l1 - l0)) * W, py = (lat: number) => ((b1 - lat) / (b1 - b0)) * H;
  const DAC: [number, number] = [px(90.41), py(23.81)], DST: [number, number] = [px(c.lng), py(c.lat)];
  const via = c.route.via && c.route.via[0][0] === "IST" ? c.route.via[0] : null;
  const legs: [number, number][][] = via ? [[DAC, [px(via[3]), py(via[2])]], [[px(via[3]), py(via[2])], DST]] : [[DAC, DST]];
  const arc = (a: [number, number], b: [number, number]) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.28; return { a, b, m: [mx, my] as [number, number] }; };
  const arcs = legs.map(([a, b]) => arc(a, b));
  const prog = lerp(f, 30, 30 + 150, 0, 1, Easing.inOut(Easing.cubic));
  const at = (t: number) => { const seg = Math.min(arcs.length - 1, Math.floor(t * arcs.length)); const u = t * arcs.length - seg; const { a, b, m } = arcs[seg];
    const x = (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * m[0] + u * u * b[0], y = (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * m[1] + u * u * b[1];
    const dx = 2 * (1 - u) * (m[0] - a[0]) + 2 * u * (b[0] - m[0]), dy = 2 * (1 - u) * (m[1] - a[1]) + 2 * u * (b[1] - m[1]); return { x, y, ang: (Math.atan2(dy, dx) * 180) / Math.PI }; };
  const plane = at(Math.min(0.999, prog));
  const statAt = c.statKw.map((k) => cue(vo, k));
  const Pin: React.FC<{ p: [number, number]; label: string; code: string; big?: boolean; at: number; below?: boolean }> = ({ p, label, code, big, at: a, below }) => {
    const s = spring({ frame: f - a, fps: 30, config: { damping: 10 } });
    return (
      <div style={{ position: "absolute", left: p[0], top: p[1], transform: `translate(-50%,-50%) scale(${s})` }}>
        <div style={{ width: big ? 26 : 16, height: big ? 26 : 16, borderRadius: "50%", background: big ? GOLD : "#fff", boxShadow: `0 0 0 ${8 + 6 * Math.sin(f / 8)}px ${big ? GOLD : "#ffffff"}33` }} />
        <div style={{ position: "absolute", left: below ? -20 : 30, top: below ? 22 : -22, whiteSpace: "nowrap", fontFamily: SEMI, fontSize: big ? 34 : 24, color: "#fff", textShadow: "0 2px 10px #000" }}>{label} <span style={{ fontFamily: "Montserrat", fontSize: big ? 22 : 18, color: MUTED }}>{code}</span></div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 170, width: W, height: H, borderRadius: 30, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: `1px solid ${LINE}` }}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          {land.filter(([la, lo]) => lo >= l0 - 1 && lo <= l1 + 1 && la >= b0 - 1 && la <= b1 + 1).map(([la, lo], i) => <circle key={i} cx={px(lo)} cy={py(la)} r={5.2} fill="#3B4D45" />)}
          {(c.route.via ?? []).filter((v) => v !== via).map((v) => { const p2: [number, number] = [px(v[3]), py(v[2])]; const a1 = arc(DAC, p2), a2 = arc(p2, DST);
            return <g key={v[0]} opacity={lerp(f, 190, 220, 0, 0.5)}><path d={`M${a1.a} Q${a1.m} ${a1.b}`} stroke="#fff" strokeWidth={2} strokeDasharray="6 8" fill="none" /><path d={`M${a2.a} Q${a2.m} ${a2.b}`} stroke="#fff" strokeWidth={2} strokeDasharray="6 8" fill="none" /></g>; })}
          {arcs.map(({ a, b, m }, i) => { const L = 1400; const segP = Math.max(0, Math.min(1, prog * arcs.length - i));
            return <path key={i} d={`M${a} Q${m} ${b}`} stroke={GOLD} strokeWidth={5} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - segP)} strokeLinecap="round" />; })}
        </svg>
        <Pin p={DAC} label="ঢাকা" code="DAC" big at={10} />
        <Pin p={DST} label={c.capital} code={c.code} big at={170} />
        {(c.route.via ?? []).map((v) => <Pin key={v[0]} p={[px(v[3]), py(v[2])]} label={v[1]} code={v[0]} at={v === via ? 100 : 195} below={v[0] === "DXB" || v[0] === "DMM"} />)}
        {prog > 0 && prog < 1 && <div style={{ position: "absolute", left: plane.x, top: plane.y, transform: `translate(-50%,-50%) rotate(${plane.ang + 45}deg)`, fontSize: 52, filter: "drop-shadow(0 0 12px #F5B841)" }}>✈️</div>}
      </div>
      <div style={{ position: "absolute", right: 80, top: 170, width: 560, display: "flex", flexDirection: "column", gap: 22 }}>
        {c.stats.map(([v, l], i) => {
          const p = spring({ frame: f - statAt[i] + 6, fps: 30, config: { damping: 13 } });
          return (
            <div key={l} style={{ padding: "26px 34px", borderRadius: 24, background: CARD, border: `1px solid ${LINE}`, borderLeft: `8px solid ${i === 0 ? GOLD : c.accent}`, opacity: p, transform: `translateX(${(1 - p) * 120}px)` }}>
              <div style={{ fontFamily: FONT, fontSize: 52, color: "#fff", lineHeight: 1.1 }}>{v}</div>
              <div style={{ fontFamily: SEMI, fontSize: 28, color: MUTED, marginTop: 4 }}>{l}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 110, top: 70 + 40, opacity: lerp(f, len - 20, len, 1, 0) }} />
    </AbsoluteFill>
  );
};

const BEFORE: [string, string, string][] = [["🛂", "পাসপোর্টের মেয়াদ কমপক্ষে ৬ মাস", "পাসপোর্টের"], ["✅", "ভিসা আসল কিনা সরকারি ওয়েবসাইটে যাচাই", "ভিসা আসল"], ["💳", "বিএমইটি স্মার্ট কার্ড — না থাকলে ইমিগ্রেশন পার নয়", "বিএমইটি"], ["📝", "লিখিত চাকরির চুক্তি: বেতন, কাজ, সময়, থাকা-খাওয়া", "লিখিত"], ["🧳", "টিকিটের ব্যাগেজ সীমা দেখে ব্যাগ গোছান", "ব্যাগেজ"]];
const Before: React.FC<SP> = ({ c, vo }) => {
  const f = useCurrentFrame();
  const ats = BEFORE.map((b) => cue(vo, b[2]) - 6);
  const active = ats.filter((a) => f >= a).length - 1;
  return (
    <AbsoluteFill style={{ padding: "150px 110px 0", flexDirection: "row", gap: 60 }}>
      <div style={{ flex: 1.25, display: "flex", flexDirection: "column", gap: 20 }}>
        <Title text="যাত্রার আগে নিশ্চিত করুন" size={66} hl="নিশ্চিত" />
        <div style={{ height: 14 }} />
        {BEFORE.map(([icon, t], i) => <ListItem key={i} at={ats[i]} icon={icon} text={t} color={c.accent} active={i === active} size={34} />)}
      </div>
      <div style={{ flex: 1, paddingTop: 20 }}>
        <Shot src={`${c.cc}/s03.png`} w={700} h={760} imgW={2160} imgH={dim(`${c.cc}/s03.png`)[1]} y0={0.085} y1={0.13} a={0} b={500} zoom={1.25} />
      </div>
    </AbsoluteFill>
  );
};

const DAC_STEPS: [string, string, string][] = [["⏰", "ফ্লাইটের ৩–৪ ঘণ্টা আগে বিমানবন্দরে পৌঁছান", "ফ্লাইটের"], ["🚪", "টার্মিনালের দরজায় পাসপোর্ট ও টিকিট দেখান", "টার্মিনালের"], ["🧳", "চেক-ইন: বড় ব্যাগ জমা, বোর্ডিং পাস নিন", "চেক-ইন"],
  ["🛂", "ইমিগ্রেশন: পাসপোর্ট, ভিসা, বোর্ডিং পাস, স্মার্ট কার্ড", "ইমিগ্রেশনে"], ["🔍", "নিরাপত্তা তল্লাশি: হাতব্যাগে ১০০ মিলির বেশি তরল নয়", "নিরাপত্তা"], ["🚶", "বোর্ডিং পাসে লেখা গেটে যান", "শেষে"]];
const Dac: React.FC<SP> = ({ c, vo }) => {
  const f = useCurrentFrame();
  const ats = DAC_STEPS.map((s) => cue(vo, s[2]) - 6);
  const active = Math.max(0, ats.filter((a) => f >= a).length - 1);
  return (
    <AbsoluteFill style={{ padding: "150px 110px 0", flexDirection: "row", gap: 60 }}>
      <div style={{ flex: 1 }}>
        <Title text="ঢাকা বিমানবন্দরে, এই ক্রমে" size={62} hl="ক্রমে" />
        <div style={{ fontFamily: SEMI, color: MUTED, fontSize: 28, marginTop: 6 }}>হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর (DAC)</div>
        <div style={{ marginTop: 30, position: "relative" }}>
          <div style={{ position: "absolute", left: 33, top: 30, bottom: 30, width: 4, background: LINE }} />
          <div style={{ position: "absolute", left: 33, top: 30, width: 4, height: `${(active / 5) * 88}%`, background: GOLD }} />
          {DAC_STEPS.map(([icon, t], i) => {
            const p = spring({ frame: f - ats[i], fps: 30, config: { damping: 14 } });
            const on = i === active;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 14, opacity: 0.3 + 0.7 * p }}>
                <div style={{ width: 70, height: 70, borderRadius: "50%", flexShrink: 0, zIndex: 1, background: i <= active ? (on ? GOLD : c.accent) : CARD, border: `2px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, transform: `scale(${on ? 1.12 : 1})` }}>{icon}</div>
                <div style={{ fontFamily: on ? FONT : SEMI, fontSize: on ? 36 : 30, color: on ? "#fff" : "#cfd8d3" }}>{t}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ width: 640, paddingTop: 30 }}>
        <Shot src={`${c.cc}/s03.png`} w={640} h={780} imgW={2160} imgH={dim(`${c.cc}/s03.png`)[1]} y0={0.215} y1={0.27} a={30} b={600} zoom={1.3} />
      </div>
    </AbsoluteFill>
  );
};

const BoardingPass: React.FC<SP> = ({ c, vo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 16 } });
  const fields = [
    { k: "PASSENGER", v: "UDDIN / RAHIM MR", x: 60, y: 210, w: 560, tip: "নাম পাসপোর্টের সাথে হুবহু মিলতে হবে", kw: "যাত্রীর" },
    { k: "FLIGHT", v: "BG 041", x: 780, y: 210, w: 260, tip: "স্ক্রিনে এই নম্বর খুঁজবেন", kw: "ফ্লাইট নম্বর" },
    { k: "GATE", v: "6", x: 420, y: 340, w: 200, tip: "যে দরজা দিয়ে উঠবেন — বদলাতে পারে", kw: "গেট" },
    { k: "BOARDING", v: "08:15", x: 780, y: 340, w: 260, tip: "গেটে থাকার সময়, ছাড়ার সময় নয়", kw: "বোর্ডিং টাইম" },
    { k: "SEAT", v: "32A", x: 60, y: 470, w: 200, tip: "সংখ্যা = সারি, অক্ষর = জানালা থেকে দূরত্ব", kw: "সিট" },
  ];
  const ats = fields.map((x) => cue(vo, x.kw) - 4);
  const active = ats.filter((a) => f >= a).length - 1;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 70 }}>
      <div style={{ position: "absolute", top: 140, left: 110 }}><Title text="বোর্ডিং পাস বুঝে নিন" size={66} hl="বুঝে" /></div>
      <div style={{ position: "relative", width: 1100, height: 620, borderRadius: 30, background: "#F8FAF9", overflow: "hidden", transform: `perspective(2000px) rotateX(${(1 - p) * 40}deg) translateY(${(1 - p) * 300}px)`, boxShadow: "0 60px 120px rgba(0,0,0,0.6)", marginTop: 80 }}>
        <div style={{ height: 90, background: "#0E5E44", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px", fontFamily: "Montserrat", fontWeight: 800, color: "#fff", fontSize: 30, letterSpacing: 5 }}>
          <span>BOARDING PASS</span><span>ECONOMY</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 60px 0", fontFamily: "Montserrat", fontWeight: 800, fontSize: 84, color: "#0B1F17" }}>
          <span>DAC</span><span style={{ fontSize: 40, color: "#0E5E44" }}>— ✈ —</span><span>{c.code}</span>
        </div>
        {fields.map((x, i) => (
          <div key={x.k} style={{ position: "absolute", left: x.x, top: x.y, width: x.w, padding: "10px 16px", borderRadius: 14, border: `4px solid ${i === active ? RED : "transparent"}`, background: i === active ? "#FEE2E2" : "transparent" }}>
            <div style={{ fontFamily: "Montserrat", fontSize: 20, color: "#5B6B64", letterSpacing: 2 }}>{x.k}</div>
            <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 38, color: "#0B1F17" }}>{x.v}</div>
            <div style={{ position: "absolute", right: -18, top: -18, width: 40, height: 40, borderRadius: "50%", background: RED, color: "#fff", fontFamily: FONT, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${i <= active ? 1 : 0})` }}>{bn(i + 1)}</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 300, top: 470, fontFamily: "Montserrat", fontSize: 20, color: "#5B6B64", padding: "10px 16px" }}>FROM → TO<div style={{ fontWeight: 800, fontSize: 38, color: "#0B1F17" }}>DAC → {c.code}</div></div>
        <div style={{ position: "absolute", right: 60, bottom: 40, display: "flex", gap: 4 }}>{new Array(46).fill(0).map((_, i) => <div key={i} style={{ width: random(`b${i}`) > 0.5 ? 6 : 3, height: 70, background: "#0B1F17" }} />)}</div>
      </div>
      {active >= 0 && (
        <div key={active} style={{ position: "absolute", bottom: 70, padding: "20px 44px", borderRadius: 999, background: RED, color: "#fff", fontFamily: FONT, fontSize: 42, boxShadow: "0 20px 50px rgba(239,68,68,0.45)",
          transform: `scale(${spring({ frame: f - ats[active], fps, config: { damping: 12 } })})` }}>
          {bn(active + 1)} · {fields[active].tip}
        </div>
      )}
    </AbsoluteFill>
  );
};

const Plane: React.FC<SP> = ({ c, vo }) => {
  const f = useCurrentFrame();
  const items: [string, string, string][] = [["💺", "সিটবেল্ট বেঁধে রাখুন", "সিটবেল্ট"], ["🛂", "পাসপোর্ট ও বোর্ডিং পাস নিজের কাছে", "পাসপোর্ট"], ["🔁", "ট্রানজিটে \"Transfer\" সাইন ধরুন — বাইরে নয়", "ট্রানজিট"], ["🖥️", "স্ক্রিনে পরের ফ্লাইটের গেট মিলিয়ে নিন", "স্ক্রিনে"], ["🧑‍💼", "সমস্যা হলে Transfer Desk", "সমস্যা"]];
  const x = lerp(f, 0, 300, -200, 2100, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill style={{ padding: "150px 110px 0" }}>
      <Title text="বিমানে ও ট্রানজিটে" size={66} hl="ট্রানজিটে" />
      <div style={{ position: "absolute", left: x, top: 300 + Math.sin(f / 15) * 12, fontSize: 120, transform: "rotate(45deg)", opacity: 0.9 }}>✈️</div>
      <div style={{ marginTop: 200, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, width: 1500 }}>
        {items.map(([i2, t, kw], i) => <ListItem key={i} at={cue(vo, kw) - 6} icon={i2} text={t} color={c.accent} size={34} />)}
      </div>
    </AbsoluteFill>
  );
};

const Arrive: React.FC<SP> = ({ c, vo }) => {
  const items: [string, string, string][] = [["🛬", "Arrivals / Immigration সাইন ধরে এগোন", "অ্যারাইভাল"], ["📄", "পাসপোর্ট, ভিসা, চাকরির কাগজ দেখান", "পাসপোর্ট"], ["🧳", "বেল্ট থেকে ট্যাগ মিলিয়ে ব্যাগ নিন", "ব্যাগেজ"], ["🤝", "মালিক/এজেন্সির লোকের নাম-নম্বর আগেই জানুন", "বাইরে"], ["🚫", "পাসপোর্ট অপরিচিত কাউকে দেবেন না", "মনে রাখবেন"]];
  return (
    <AbsoluteFill style={{ padding: "150px 110px 0", flexDirection: "row", gap: 60 }}>
      <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 18 }}>
        <Title text={`${c.capital} বিমানবন্দরে পৌঁছে`} size={62} hl="পৌঁছে" />
        <div style={{ height: 10 }} />
        {items.map(([i2, t, kw], i) => <ListItem key={i} at={cue(vo, kw) - 6} icon={i2} text={t} color={i === 4 ? RED : c.accent} size={32} />)}
      </div>
      <div style={{ width: 640, paddingTop: 20 }}>
        <Shot src={`${c.cc}/s03.png`} w={640} h={780} imgW={2160} imgH={dim(`${c.cc}/s03.png`)[1]} y0={0.715} y1={0.76} a={0} b={500} zoom={1.3} />
      </div>
    </AbsoluteFill>
  );
};

const First: React.FC<SP> = ({ c, vo }) => {
  const f = useCurrentFrame();
  const n = c.first.length;
  return (
    <AbsoluteFill style={{ padding: "150px 110px 0" }}>
      <Title text={`প্রথম সপ্তাহে ${c.inName}`} size={66} hl="প্রথম" />
      <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: n > 4 ? "repeat(3, 1fr)" : "repeat(2, 1fr)", gap: 26 }}>
        {c.first.map(([icon, t], i) => {
          const at = VO_IN + Math.round(((i + 0.6) / (n + 0.6)) * (DUR as Record<string, number>)[vo] * FPS * 0.92) - 20;
          const p = spring({ frame: f - at, fps: 30, config: { damping: 13 } });
          return (
            <div key={i} style={{ minHeight: n > 4 ? 300 : 280, borderRadius: 28, padding: 34, background: CARD, border: `1px solid ${LINE}`, borderTop: `8px solid ${c.accent}`, opacity: p, transform: `translateY(${(1 - p) * 80}px) rotate(${(1 - p) * 4}deg)` }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 64 }}>{icon}</span><span style={{ fontFamily: FONT, fontSize: 56, color: "#ffffff22" }}>{bn(String(i + 1).padStart(2, "0"))}</span></div>
              <div style={{ fontFamily: SEMI, fontSize: 34, color: "#fff", lineHeight: 1.4, marginTop: 16 }}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const DOCS = ["পাসপোর্ট (মেয়াদ ৬ মাসের বেশি)", "ভিসা / ওয়ার্ক পারমিট (মূল ও কপি)", "বিএমইটি স্মার্ট কার্ড", "বিমান টিকিট", "চাকরির চুক্তিপত্র", "মেডিকেল রিপোর্ট", "পুলিশ ক্লিয়ারেন্স (যদি চাওয়া হয়)", "পাসপোর্ট সাইজ ছবি (৬–৮ কপি)", "সব কাগজের ফটোকপি ও স্ক্যান", "মালিক, এজেন্সি ও দূতাবাসের নম্বর", "কিছু বৈদেশিক মুদ্রা বা কার্ড", "প্রয়োজনীয় ওষুধ ও প্রেসক্রিপশন"];
const DOC_KW = ["পাসপোর্ট,", "ভিসা বা", "বিএমইটি", "বিমান টিকিট", "চাকরির", "মেডিকেল", "পুলিশ", "ছয় থেকে", "ফটোকপি", "জরুরি ফোন", "বৈদেশিক", "ওষুধ"];
const Docs: React.FC<SP> = ({ c, vo }) => {
  const f = useCurrentFrame();
  const ats = DOC_KW.map((k) => cue(vo, k));
  const done = ats.filter((a) => f >= a).length;
  const ring = lerp(f, ats[0] - 10, ats[11] + 10, 0, 1, Easing.linear);
  return (
    <AbsoluteFill style={{ padding: "150px 110px 0" }}>
      <Title text="কাগজপত্রের চেকলিস্ট" size={66} hl="চেকলিস্ট" />
      <div style={{ display: "flex", gap: 60, marginTop: 40 }}>
        <div style={{ width: 330, height: 330, position: "relative", flexShrink: 0 }}>
          <svg width={330} height={330}><circle cx={165} cy={165} r={140} stroke="#ffffff18" strokeWidth={22} fill="none" />
            <circle cx={165} cy={165} r={140} stroke={done === 12 ? GREEN : GOLD} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={880} strokeDashoffset={880 * (1 - ring)} transform="rotate(-90 165 165)" /></svg>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontFamily: FONT, fontSize: 96, color: "#fff", lineHeight: 1 }}>{bn(done)}/{bn(12)}</div>
            <div style={{ fontFamily: SEMI, fontSize: 30, color: MUTED }}>{done === 12 ? "সব প্রস্তুত ✓" : "প্রস্তুত"}</div>
          </AbsoluteFill>
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 26px" }}>
          {DOCS.map((d, i) => {
            const on = f >= ats[i];
            const p = spring({ frame: f - ats[i], fps: 30, config: { damping: 11, stiffness: 200 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", borderRadius: 16, background: on ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${on ? GREEN + "88" : LINE}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, border: `3px solid ${on ? GREEN : "#ffffff44"}`, background: on ? GREEN : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 900, flexShrink: 0 }}>
                  <span style={{ transform: `scale(${on ? p : 0})` }}>✓</span></div>
                <div style={{ fontFamily: SEMI, fontSize: 29, color: on ? "#fff" : "#a9b6b0" }}>{d}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, bottom: 90, fontFamily: SEMI, fontSize: 28, color: GOLD, opacity: lerp(f, 30, 50, 0, 1) }}>📸 স্ক্রিনশট নিয়ে রাখুন — probashibondu.online/guide-এ টিক দিয়েও রাখা যায়</div>
    </AbsoluteFill>
  );
};

const Rules: React.FC<SP> = ({ c, vo }) => {
  const f = useCurrentFrame();
  const n = c.rules.length;
  const D = (DUR as Record<string, number>)[vo] * FPS;
  return (
    <AbsoluteFill style={{ padding: "140px 110px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 64, transform: `scale(${1 + 0.08 * Math.sin(f / 6)})` }}>⚠️</div>
        <Title text="নিয়মকানুন ও সাবধানতা" size={64} hl="সাবধানতা" />
      </div>
      <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: n > 4 ? "1fr 1fr" : "1fr", gap: 18, width: n > 4 ? 1700 : 1400 }}>
        {c.rules.map(([icon, t], i) => {
          const at = VO_IN + Math.round((i / n) * D * 0.95) + 10;
          const red = /অবৈধ|প্রতারণা|সাবধান|নিষিদ্ধ|অপরাধ/.test(t);
          return <ListItem key={i} at={at} icon={icon} text={t} color={red ? RED : c.accent} size={n > 4 ? 30 : 36} active={f >= at && f < at + D / n} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Phrases: React.FC<SP> = ({ c, vo }) => {
  const f = useCurrentFrame();
  const D = (DUR as Record<string, number>)[vo] * FPS;
  const start = VO_IN + D * 0.16;
  return (
    <AbsoluteFill style={{ padding: "150px 110px 0" }}>
      <Title text={`কাজে লাগবে এমন কিছু কথা · ${c.lang}`} size={60} hl={c.lang} />
      <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
        {c.phrases.map(([m, nat, pr], i) => {
          const at = start + (i / 8) * (D * 0.82);
          const p = spring({ frame: f - (at - 14), fps: 30, config: { damping: 13 } });
          const on = f >= at - 6 && f < at + (D * 0.82) / 8;
          return (
            <div key={i} style={{ height: 300, borderRadius: 26, padding: 28, background: on ? `linear-gradient(160deg, ${c.accent}, ${c.accent2})` : CARD, border: `1px solid ${on ? "#fff6" : LINE}`,
              opacity: Math.max(0.3, p), transform: `scale(${on ? 1.05 : 1}) translateY(${(1 - p) * 40}px)`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontFamily: SEMI, fontSize: 28, color: on ? "#ffffffcc" : MUTED }}>{m} {on && "🔊"}</div>
              <div style={{ fontFamily: c.cc === "rs" ? "'Segoe UI', Arial" : "'Segoe UI', Arial", fontSize: nat.length > 10 ? 40 : 54, color: "#fff", direction: c.phrasesVo === "common/arabic" ? "rtl" : "ltr", textAlign: c.phrasesVo === "common/arabic" ? "right" : "left" }}>{nat}</div>
              <div style={{ fontFamily: FONT, fontSize: 38, color: on ? "#fff" : GOLD }}>{pr}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<SP> = ({ c, vo, len }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const banner = spring({ frame: f - cue(vo, "বৈধ ওয়ার্ক") + 10, fps, config: { damping: 15 } });
  const sub = cue(vo, "সাবস্ক্রাইব");
  const subP = spring({ frame: f - sub + 20, fps, config: { damping: 12 } });
  const clicked = f > sub + 10;
  return (
    <AbsoluteFill style={{ padding: "140px 110px 0" }}>
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1, padding: 36, borderRadius: 28, background: CARD, border: `1px solid ${LINE}`, borderLeft: `8px solid ${GOLD}` }}>
          <div style={{ fontFamily: FONT, fontSize: 44, color: "#fff" }}>⚖️ যাওয়ার আগে নিশ্চিত হোন</div>
          <div style={{ fontFamily: SEMI, fontSize: 30, color: "#cfd8d3", marginTop: 12, lineHeight: 1.5 }}>ভিসা, কাগজপত্র ও আইন সময়ের সাথে বদলায়। দূতাবাস, বিএমইটি (BMET) এবং আপনার নিবন্ধিত এজেন্সি থেকে যাচাই করুন।</div>
        </div>
        <div style={{ width: 620, padding: 36, borderRadius: 28, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, opacity: lerp(f, cue(vo, "পুরো গাইড") - 10, cue(vo, "পুরো গাইড") + 10, 0.2, 1) }}>
          <Img src={staticFile("serbia/probashi-bondhu-logo.png")} style={{ height: 70, alignSelf: "flex-start" }} />
          <div style={{ fontFamily: FONT, fontSize: 36, color: INK }}>পুরো গাইড + PDF 👉</div>
          <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 36, color: "#0E7C5A" }}>probashibondu.online/guide</div>
        </div>
      </div>
      <div style={{ marginTop: 34, display: "flex", justifyContent: "center", opacity: banner, transform: `translateY(${(1 - banner) * 120}px)` }}>
        <Shot src={`${c.cc}/s08.png`} w={1400} h={378} imgW={2160} imgH={584} />
      </div>
      <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30, opacity: subP, transform: `scale(${0.8 + 0.2 * subP})` }}>
        <div style={{ padding: "22px 50px", borderRadius: 16, background: clicked ? "#3F3F46" : "#FF0000", color: "#fff", fontFamily: FONT, fontSize: 44, transform: `scale(${f > sub + 6 && f < sub + 14 ? 0.92 : 1})` }}>{clicked ? "✓ সাবস্ক্রাইবড" : "▶ সাবস্ক্রাইব"}</div>
        <div style={{ padding: "22px 34px", borderRadius: 16, background: "#27272A", color: "#fff", fontSize: 44, transform: `rotate(${clicked ? Math.sin(f / 2) * 12 * Math.max(0, 1 - (f - sub - 10) / 30) : 0}deg)` }}>🔔</div>
        <div style={{ padding: "22px 40px", borderRadius: 16, background: "#27272A", color: "#fff", fontFamily: FONT, fontSize: 40 }}>↗ শেয়ার</div>
      </div>
      {f > len - 110 && (
        <AbsoluteFill style={{ background: INK, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30, opacity: lerp(f, len - 110, len - 90, 0, 1) }}>
          <div style={{ fontFamily: FONT, fontSize: 64, color: "#fff" }}>আপনার যাত্রা নিরাপদ হোক 🤲</div>
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <div style={{ background: "#fff", borderRadius: 18, padding: "14px 22px" }}><Img src={staticFile("serbia/probashi-bondhu-logo.png")} style={{ height: 70 }} /></div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "14px 22px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 70 }} /></div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const VIEWS: Record<SceneId, React.FC<SP>> = { intro: Intro, glance: Glance, flight: Flight, before: Before, dac: Dac, bp: BoardingPass, plane: Plane, arrive: Arrive, first: First, docs: Docs, rules: Rules, phrases: Phrases, outro: Outro };

// ---------- chrome: chapter tag, logo bug, progress ----------
const ChapterTag: React.FC<{ n: number; label: string; c: Country }> = ({ n, label, c }) => {
  const f = useCurrentFrame();
  const p = lerp(f, 4, 20, 0, 1);
  return (
    <div style={{ position: "absolute", left: 110, top: 56, display: "flex", alignItems: "center", gap: 14, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ background: c.accent, color: "#fff", fontFamily: FONT, fontSize: 26, padding: "4px 16px", borderRadius: 10 }}>{bn(String(n).padStart(2, "0"))}</div>
      <div style={{ fontFamily: SEMI, fontSize: 28, color: MUTED }}>{c.name} গাইড · {label}</div>
    </div>
  );
};

const Wipe: React.FC<{ c: Country }> = ({ c }) => {
  const f = useCurrentFrame();
  const x = lerp(f, 0, 16, -30, 130, Easing.inOut(Easing.cubic));
  return <AbsoluteFill style={{ background: `linear-gradient(100deg, transparent ${x - 26}%, ${c.accent} ${x - 10}%, ${GOLD} ${x - 4}%, ${c.accent} ${x + 2}%, transparent ${x + 18}%)`, opacity: 0.85 }} />;
};

export const CountryGuide: React.FC<{ cc: string }> = ({ cc }) => {
  const c = COUNTRIES[cc];
  const T = timeline(c);
  const total = guideTotal(cc);
  const f = useCurrentFrame();
  const voOn = (fr: number) => T.reduce((m, s) => Math.max(m, interpolate(fr, [s.from + VO_IN - 8, s.from + VO_IN, s.from + s.len - 30, s.from + s.len - 10], [0, 1, 1, 0], clamp)), 0);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Backdrop c={c} />
      {T.map((s, i) => {
        const V = VIEWS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.len}>
            <SceneFade len={s.len}><V c={c} len={s.len} vo={s.vo} /></SceneFade>
            {s.id !== "intro" && <ChapterTag n={i} label={CHAPTERS[s.id]} c={c} />}
            <Sequence from={VO_IN}><Audio src={G(`vo/${s.vo}.mp3`)} /></Sequence>
            {i > 0 && <Audio src={staticFile("mohajon/sfx/whoosh.mp3")} volume={0.35} />}
          </Sequence>
        );
      })}
      {T.slice(1).map((s) => <Sequence key={"w" + s.id} from={s.from - 6} durationInFrames={18}><Wipe c={c} /></Sequence>)}
      {/* logo bug */}
      <div style={{ position: "absolute", right: 60, top: 44, background: "#fff", borderRadius: 14, padding: "8px 14px", opacity: f > 60 ? 0.95 : 0, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
        <Img src={staticFile("serbia/dream-logo.png")} style={{ height: 46, display: "block" }} />
      </div>
      {/* progress */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: "#ffffff12" }}>
        <div style={{ width: `${(f / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${c.accent}, ${GOLD})` }} />
        {T.slice(1).map((s) => <div key={s.id} style={{ position: "absolute", left: `${(s.from / total) * 100}%`, top: 0, width: 3, height: 8, background: INK }} />)}
      </div>
      <Audio src={G("bed.mp3")} volume={(fr) => interpolate(fr, [0, 20, total - 60, total], [0, 1, 1, 0], clamp) * (0.28 - 0.17 * voOn(fr))} />
      <Sequence from={0} durationInFrames={90}><Audio src={staticFile("mohajon/sfx/impact.mp3")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

const SceneFade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = lerp(f, len - 10, len, 0, 1, Easing.in(Easing.cubic));
  const i = lerp(f, 0, 12, 0, 1);
  return <AbsoluteFill style={{ opacity: i * (1 - o), transform: `scale(${1.03 - 0.03 * i + 0.05 * o})`, filter: `blur(${o * 8}px)` }}>{children}</AbsoluteFill>;
};

// ---------- YouTube thumbnail (1280x720) ----------
export const GuideThumb: React.FC<{ cc: string }> = ({ cc }) => {
  const c = COUNTRIES[cc];
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, right: -200, top: -200, borderRadius: "50%", background: c.accent, opacity: 0.45, filter: "blur(120px)" }} />
      <div style={{ position: "absolute", right: 40, top: 70, transform: "rotate(6deg)" }}><WaveFlag cc={cc} w={520} h={cc === "qa" ? 204 : 346} amp={10} /></div>
      <div style={{ position: "absolute", left: 50, top: 40, background: RED, color: "#fff", fontFamily: FONT, fontSize: 40, padding: "6px 24px", borderRadius: 12, transform: "rotate(-2deg)" }}>যাওয়ার আগে অবশ্যই দেখুন!</div>
      <div style={{ position: "absolute", left: 50, top: 150, width: 760, fontFamily: FONT, color: "#fff", lineHeight: 1.12, textShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 118 }}>{c.name}</div>
        <div style={{ fontSize: 72 }}>যাওয়ার আগে</div>
        <div style={{ fontSize: 80, color: GOLD }}>গাইডলাইন</div>
        <div style={{ fontSize: 50, marginTop: 10 }}>বিস্তারিত দেখুন 👉</div>
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 40, background: "#fff", borderRadius: 16, padding: "10px 18px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 70, display: "block" }} /></div>
      <div style={{ position: "absolute", right: 40, bottom: 140, display: "flex", gap: 12 }}>
        {["✈️ বিমানবন্দর", "📄 কাগজপত্র", "⚠️ নিয়ম"].map((t) => <span key={t} style={{ background: "#ffffff1a", border: "1px solid #ffffff33", color: "#fff", fontFamily: SEMI, fontSize: 28, padding: "6px 16px", borderRadius: 999 }}>{t}</span>)}
      </div>
    </AbsoluteFill>
  );
};
