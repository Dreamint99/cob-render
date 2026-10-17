// COB অনুসন্ধানী ফিল্ম (১৫ মিনিট) — "বারে কেন তরুণীরা বেশি যায়?" (17 Oct 2026). Scenes S1–S15 live in BarRaid.tsx.
// Extra facts (credited on screen): Jiahu ~7000 BC (McGovern et al., PNAS 2004), Hajji Firuz ~5400 BC; Mughal alcohol tax, EIC abkari,
// Bengal Excise Act 1909; Carew & Co Darsana 1938, state-owned after 1972 (BSFIC, Banglapedia/Wikipedia); Constitution Art. 18;
// Narcotics Control Act 1990/2018, Alcohol Control Rules 2022; Keru profit > Tk200 cr (Ajker Bangladesh, Sep 2026), NBR import clamp 2021
// (TBS/Dhaka Tribune); legal import 1.05 lakh L in FY2020-21 (DNC via Mathabhanga); BGB Sherpur 321 bottles ~Tk4.81 lakh (BD Pratidin
// 28 Jul 2026); Bogura Feb 2021 18 deaths (Prothom Alo), ≥14 deaths in 14 days incl. private-university students, 6 sellers held
// (BenarNews, Desh Rupantor); BMJ Open 2016 (68 studies, F:M 45%→90%); JAMA 2025 (US women 18–25 binge > men, 2021–23); WHO 2024
// (2.6m deaths 2019, 4.7%, 474k CVD, 401k cancer, 209m dependence); IARC Group 1 since 1988; WHO 2023 "no safe level".
// "তৃষা" is a labelled fictional composite.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { BN, bn, useSp } from "../news/NewsKit";
import { RED, RED2, INK, MUTE, AMBER, HEAD, T, Grain, Bg, Bug, Source, Card } from "./HoneyTrap";
import { GREEN, BLUE, n, S, AiTag, Ken, Head, Count, Stamp, Subs, Person, P, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15 } from "./BarRaid";
import VO from "./barvo.json";
import SCRIPT from "./barscript.json";

const Fiction: React.FC = () => (
  <div style={{ position: "absolute", right: 48, top: 92, fontFamily: BN, fontWeight: 700, fontSize: 22, color: AMBER, border: `2px solid ${AMBER}`, padding: "3px 12px", borderRadius: 6, background: "rgba(0,0,0,.45)" }}>কাল্পনিক উদাহরণ</div>
);
const Lines: React.FC<{ items: React.ReactNode[]; at: number; step: number; x?: number; y?: number; w?: number; size?: number; color?: string }> = ({ items, at, step, x = 90, y = 330, w = 900, size = 40, color = AMBER }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", gap: 18 }}>
    {items.map((t, i) => <Card key={i} delay={at + i * step} style={{ fontSize: size, fontWeight: 700, borderLeft: `6px solid ${color}` }}>{t}</Card>)}
  </div>
);
const Big: React.FC<{ v: number; at: number; label: string; pre?: string; suf?: string; d?: number; color?: string; x?: number; y?: number; size?: number }> = ({ v, at, label, pre, suf, d, color = AMBER, x = 1150, y = 340, size = 190 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: T(f, at - 6, at) }}>
      <Count v={v} at={at} pre={pre} suf={suf} d={d} color={color} size={size} />
      <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: "white", marginTop: 6, maxWidth: 650 }}>{label}</div>
    </div>
  );
};

// ---------- history ----------
const HOrigin: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Ken src="ancient" len={len} dim={0.5} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="মানুষের প্রথম পানীয়" size={64} /></div>
      <div style={{ position: "absolute", left: 90, top: 280 }}>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: MUTE }}>জিয়াহু, চীন</div>
        <Count v={9000} at={20} dur={60} size={200} pre="~" />
        <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: "white" }}> বছর আগে</span>
      </div>
      <div style={{ position: "absolute", left: 90, top: 560, display: "flex", gap: 18 }}>
        {["🌾 চাল", "🍯 মধু", "🍇 ফল"].map((t, i) => <Card key={t} delay={len * 0.3 + i * 15} style={{ fontSize: 40, fontWeight: 700 }}>{t}</Card>)}
        <Card delay={len * 0.3 + 50} style={{ fontSize: 40, fontWeight: 800, color: AMBER }}>= গাঁজন</Card>
      </div>
      <div style={{ position: "absolute", right: 110, top: 300, width: 600, opacity: T(f, len * 0.55, len * 0.62) }}>
        <Card delay={len * 0.55} style={{ borderTop: `5px solid ${RED2}` }}>
          <div style={{ fontFamily: BN, fontSize: 30, color: MUTE }}>হাজি ফিরুজ তেপে, ইরান</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: RED2 }}>৭,৪০০+ বছর</div>
          <div style={{ fontSize: 32 }}>আঙুরের মদের প্রাচীন পাত্র</div>
        </Card>
      </div>
      <AiTag />
      <Source text="ম্যাকগভার্ন ও অন্যান্য, PNAS ২০০৪ · প্রত্নতাত্ত্বিক গবেষণা" />
      {S("sfx/boom.mp3", 20, 0.35)}{S("tick", len * 0.3, 0.3)}{S("sfx/whoosh.mp3", len * 0.55, 0.3)}
    </AbsoluteFill>
  );
};
const HBengal: React.FC<P> = ({ len }) => (
  <AbsoluteFill>
    <Ken src="tari" len={len} dim={0.42} />
    <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>বাংলার <span style={{ color: AMBER }}>তাড়ি</span> থেকে মুঘল কর</>} size={64} /></div>
    <Lines at={len * 0.15} step={len * 0.2} items={["🌴 খেজুর-তালের রস গাঁজিয়ে তাড়ি", "🍚 চালের পানীয়: গ্রাম ও আদিবাসী জীবনে", "👑 মুঘল আমল: মদ উৎপাদনে বিশেষ কর"]} />
    <AiTag />
    <Source text="বাংলাদেশে মদ্যপান বিষয়ক গবেষণা (APJMT) · ইতিহাসবিষয়ক উৎস" />
  </AbsoluteFill>
);
const HBritish: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Ken src="colonial" len={len} dim={0.5} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="ব্রিটিশ আমল: মদ মানে রাজস্ব" size={64} /></div>
      <Lines at={len * 0.1} step={len * 0.22} w={860} items={["ইস্ট ইন্ডিয়া কোম্পানি নেয় আবগারি কর", "মদ হয়ে ওঠে সরকারের আয়ের উৎস", "লাইসেন্স-পারমিট কাঠামো তৈরি"]} />
      <div style={{ position: "absolute", right: 120, top: 330, width: 560, height: 420, background: "#efe9dc", borderRadius: 6, padding: 36, transform: `rotate(2deg) scale(${0.9 + 0.1 * T(f, len * 0.55, len * 0.65)})`, opacity: T(f, len * 0.55, len * 0.65), boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#333", letterSpacing: 2 }}>THE BENGAL</div>
        <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 64, color: "#1b1b1b" }}>EXCISE ACT</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: RED }}>১৯০৯</div>
        <div style={{ fontFamily: BN, fontSize: 26, color: "#444" }}>লাইসেন্স ও পারমিটের ভিত্তি</div>
      </div>
      <AiTag />
      <Source text="নন্দিনী ভট্টাচার্য, ‘The Problem of Alcohol in Colonial India’ (২০১৭) · বেঙ্গল এক্সাইজ অ্যাক্ট ১৯০৯" />
      {S("hit", len * 0.55, 0.45)}
    </AbsoluteFill>
  );
};
const HCarew: React.FC<P> = ({ len }) => (
  <AbsoluteFill>
    <Ken src="factory" len={len} dim={0.45} />
    <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>দর্শনার <span style={{ color: AMBER }}>কেরু</span></>} size={70} /></div>
    <Big v={1938} at={20} label="চুয়াডাঙ্গার দর্শনায় চিনিকল + ডিস্টিলারি" x={90} y={290} size={210} />
    <Lines at={len * 0.45} step={len * 0.15} x={1060} y={320} w={760} items={["১৯৭২: রাষ্ট্রায়ত্ত প্রতিষ্ঠান", "দেশের একমাত্র বৈধ মদ কারখানা", "মালিক: সরকার"]} />
    <AiTag />
    <Source text="কেরু অ্যান্ড কোম্পানি (বিএসএফআইসি) · উইকিপিডিয়া" />
    {S("sfx/boom.mp3", 20, 0.35)}
  </AbsoluteFill>
);
const HConst: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const steps = [{ y: "১৯৯০", t: "মাদকদ্রব্য নিয়ন্ত্রণ আইন" }, { y: "২০১৮", t: "নতুন মাদক নিয়ন্ত্রণ আইন" }, { y: "২০২২", t: "অ্যালকোহল নিয়ন্ত্রণ বিধিমালা" }];
  const hl = T(f, len * 0.12, len * 0.3);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(62,224,143,.14)" />
      <div style={{ position: "absolute", left: 90, top: 300, width: 820, padding: "34px 40px", background: "#efe9dc", borderRadius: 8, transform: "rotate(-1deg)", boxShadow: "0 30px 80px rgba(0,0,0,.6)", opacity: T(f, 6, 18) }}>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 28, color: "#555" }}>গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: "#1b1b1b", marginTop: 6 }}>অনুচ্ছেদ ১৮(১)</div>
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 34, color: "#1b1b1b", marginTop: 14, lineHeight: 1.45 }}>
          চিকিৎসার প্রয়োজন ছাড়া <span style={{ backgroundImage: `linear-gradient(90deg, #ffd25e ${hl * 100}%, transparent ${hl * 100}%)`, padding: "0 6px" }}>মদ ও মাদক পান নিরোধে</span> রাষ্ট্র কার্যকর ব্যবস্থা গ্রহণ করবে
        </div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 300, width: 720, display: "flex", flexDirection: "column", gap: 20 }}>
        {steps.map((s0, i) => (
          <Card key={s0.y} delay={len * 0.38 + i * len * 0.1} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: AMBER }}>{s0.y}</span><span style={{ fontSize: 36, fontWeight: 700 }}>{s0.t}</span>
          </Card>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 210, textAlign: "center", opacity: T(f, len * 0.75, len * 0.82) }}>
        <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 62, color: "white" }}>না পুরো নিষিদ্ধ, না পুরো উন্মুক্ত → <span style={{ color: RED2 }}>ধূসর বাজার</span></span>
      </div>
      <Source text="বাংলাদেশের সংবিধান · মাদকদ্রব্য নিয়ন্ত্রণ আইন ১৯৯০, ২০১৮ · অ্যালকোহল নিয়ন্ত্রণ বিধিমালা ২০২২" />
      {steps.map((_, i) => S("tick", len * 0.38 + i * len * 0.1, 0.35))}
    </AbsoluteFill>
  );
};
const HWorld: React.FC<P> = ({ len }) => {
  const rows = [{ k: "সৌদি আরব", v: "নিষিদ্ধ", c: RED2 }, { k: "কুয়েত", v: "নিষিদ্ধ", c: RED2 }, { k: "গুজরাট, ভারত", v: "১৯৬০ থেকে নিষিদ্ধ", c: AMBER }, { k: "বিহার, ভারত", v: "২০১৬ থেকে নিষিদ্ধ", c: AMBER }, { k: "বাংলাদেশ", v: "পারমিটে সীমিত", c: GREEN }];
  return (
    <AbsoluteFill>
      <Bg tint="rgba(58,160,255,.14)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="অন্য দেশে কী নিয়ম?" size={64} /></div>
      <div style={{ position: "absolute", left: 90, top: 290, width: 1000, display: "flex", flexDirection: "column", gap: 16 }}>
        {rows.map((r, i) => (
          <Card key={r.k} delay={len * 0.08 + i * len * 0.09} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px" }}>
            <span style={{ fontSize: 40, fontWeight: 700 }}>{r.k}</span>
            <span style={{ fontSize: 32, fontWeight: 700, color: INK, background: r.c, padding: "4px 18px", borderRadius: 8 }}>{r.v}</span>
          </Card>
        ))}
      </div>
      <div style={{ position: "absolute", right: 110, top: 360, width: 620 }}>
        <Card delay={len * 0.62} style={{ fontSize: 42, fontWeight: 800, borderLeft: `6px solid ${RED}` }}>চাহিদা আছে, বৈধ পথ নেই → <span style={{ color: RED2 }}>অপরাধ চক্র</span></Card>
      </div>
      <Source text="দেশগুলোর প্রচলিত আইন · গুজরাট প্রহিবিশন অ্যাক্ট · বিহার মদ নিষিদ্ধকরণ আইন ২০১৬" />
      {rows.map((_, i) => S("tick", len * 0.08 + i * len * 0.09, 0.3))}
    </AbsoluteFill>
  );
};

// ---------- supply routes ----------
const ROUTES = ["কেরু (বৈধ)", "আমদানি", "বন্ডেড গুদাম", "সীমান্ত", "ভেজাল"];
const RouteBar: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ position: "absolute", left: 90, right: 90, bottom: 190, display: "flex", gap: 12 }}>
    {ROUTES.map((r, i) => (
      <div key={r} style={{ flex: 1, textAlign: "center", fontFamily: BN, fontWeight: 700, fontSize: 26, padding: "8px 0", borderRadius: 8, color: i === k ? INK : "rgba(255,255,255,.55)", background: i === k ? (i === 4 ? RED2 : AMBER) : "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>{i < 4 ? `পথ ${bn(i + 1)} · ` : "⚠ "}{r}</div>
    ))}
  </div>
);
const SKeru: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const p = T(f, len * 0.55, len * 0.75);
  return (
    <AbsoluteFill>
      <Ken src="factory" len={len} dim={0.7} blur={3} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="মদ আসে চার পথে" size={64} /></div>
      <Lines at={len * 0.15} step={len * 0.15} w={820} items={["২০২১: বিদেশি মদ আমদানিতে এনবিআরের কড়াকড়ি", "কেরুর চাহিদা বাড়ে হু হু করে"]} />
      <div style={{ position: "absolute", right: 120, top: 280, width: 640, height: 480, opacity: T(f, len * 0.5, len * 0.56) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, borderTop: `3px dashed ${AMBER}` }} />
        <div style={{ position: "absolute", right: 0, top: 80, fontFamily: BN, fontWeight: 700, fontSize: 28, color: AMBER }}>৳২০০ কোটি</div>
        <div style={{ position: "absolute", left: 120, bottom: 0, width: 160, height: 380 * p, background: `linear-gradient(0deg, ${GREEN}55, ${GREEN})`, borderRadius: "10px 10px 0 0" }} />
        <div style={{ position: "absolute", left: 90, bottom: 380 * p + 10, fontFamily: HEAD, fontWeight: 800, fontSize: 54, color: GREEN }}>মদে লাভ</div>
        <div style={{ position: "absolute", left: 380, bottom: 0, width: 160, height: 140 * p, background: `linear-gradient(180deg, ${RED2}, ${RED2}55)`, borderRadius: "0 0 10px 10px", transform: "translateY(100%)" }} />
        <div style={{ position: "absolute", left: 360, bottom: 20, fontFamily: HEAD, fontWeight: 800, fontSize: 54, color: RED2 }}>চিনিতে লোকসান</div>
      </div>
      <Stamp text="রেকর্ড মুনাফা" at={len * 0.78} x={1200} y={160} color={GREEN} />
      <RouteBar k={0} />
      <AiTag />
      <Source text="আজকের বাংলাদেশ, ৮ সেপ্টেম্বর ২০২৬ · দ্য বিজনেস স্ট্যান্ডার্ড / ঢাকা ট্রিবিউন" />
      {S("hit", len * 0.78, 0.5)}
    </AbsoluteFill>
  );
};
const SImport: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const q = useSp(len * 0.65, 12);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(58,160,255,.16)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="বৈধ আমদানি: খুবই সামান্য" size={64} /></div>
      <Big v={105000} at={len * 0.2} label="লিটার · এক অর্থবছরে বৈধ আমদানি (২০২০-২১)" x={90} y={320} size={180} color={BLUE} />
      <div style={{ position: "absolute", right: 160, top: 260, textAlign: "center", opacity: q, transform: `scale(${0.6 + 0.4 * q})` }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 420, color: RED2, lineHeight: 1 }}>?</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white" }}>বাকি চাহিদা মেটে কোথা থেকে</div>
      </div>
      <RouteBar k={1} />
      <Source text="মাদকদ্রব্য নিয়ন্ত্রণ অধিদপ্তর (সংবাদমাধ্যমে প্রকাশিত হিসাব)" />
      {S("tick", len * 0.2, 0.35)}{S("hit", len * 0.65, 0.5)}
    </AbsoluteFill>
  );
};
const SBond: React.FC<P> = ({ len }) => (
  <AbsoluteFill>
    <Ken src="warehouse" len={len} dim={0.55} />
    <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="বন্ডেড গুদাম: শুল্কমুক্ত বোতল" size={64} /></div>
    <Lines at={len * 0.15} step={len * 0.18} w={900} items={["কূটনীতিক ও বিশেষ সুবিধাভোগীদের জন্য", "অনুমোদনের বাইরে গোপন গুদামের অভিযোগ", "কাগজে বিক্রি, মাল গুদামে"]} />
    <div style={{ position: "absolute", right: 120, top: 360 }}><Card delay={len * 0.7} style={{ fontSize: 46, fontWeight: 800, borderLeft: `6px solid ${AMBER}` }}>খোলাবাজারে গেলে <span style={{ color: AMBER }}>লাভ বহু গুণ</span></Card></div>
    <RouteBar k={2} />
    <AiTag />
    <Source text="প্রথম আলো · টিবিএস · বাসস, অক্টোবর ২০২৬" />
  </AbsoluteFill>
);
const SBorder: React.FC<P> = ({ len }) => {
  const pins = ["শেরপুর", "ময়মনসিংহ", "সিলেট", "ফেনী"];
  return (
    <AbsoluteFill>
      <Ken src="border" len={len} dim={0.45} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="সীমান্ত দিয়ে চালান" size={64} /></div>
      <div style={{ position: "absolute", left: 90, top: 290, display: "flex", gap: 14 }}>
        {pins.map((p0, i) => <Card key={p0} delay={len * 0.1 + i * 14} style={{ fontSize: 34, fontWeight: 700, padding: "10px 22px" }}>📍 {p0}</Card>)}
      </div>
      <Big v={321} at={len * 0.42} label="বোতল ভারতীয় মদ · শেরপুর সীমান্তে একটি অভিযানে (জুলাই ২০২৬)" x={90} y={440} size={200} color={RED2} />
      <div style={{ position: "absolute", right: 120, top: 470 }}>
        <Card delay={len * 0.62} style={{ fontSize: 40, fontWeight: 700 }}>আনুমানিক দাম <span style={{ color: AMBER }}>৳৪,৮১,০০০</span></Card>
        <div style={{ height: 16 }} />
        <Card delay={len * 0.8} style={{ fontSize: 40, fontWeight: 700, borderLeft: `6px solid ${RED}` }}>মালিক? <span style={{ color: RED2 }}>পলাতক</span></Card>
      </div>
      <RouteBar k={3} />
      <AiTag />
      <Source text="বাংলাদেশ প্রতিদিন, ২৮ জুলাই ২০২৬ · বিজিবির বিভিন্ন অভিযান" />
      {S("hit", len * 0.42, 0.5)}
    </AbsoluteFill>
  );
};
const SFake: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const g = f > len * 0.2 && f < len * 0.5 && f % 9 < 2;
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.28)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>সবচেয়ে ভয়ংকর: <span style={{ color: RED2 }}>ভেজাল মদ</span></>} size={64} /></div>
      <div style={{ position: "absolute", left: 140, top: 300, width: 300, height: 520, transform: g ? "translateX(6px)" : undefined }}>
        <svg width="300" height="520" viewBox="0 0 60 104"><path d="M22 0h16v22c0 6 10 10 10 24v54a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V46c0-14 10-18 10-24z" fill="#2a1d14" stroke="#c98b3a" strokeWidth="1.5" /><rect x="14" y="52" width="32" height="26" rx="2" fill="#efe9dc" /><text x="30" y="63" fontSize="5" textAnchor="middle" fontFamily="Georgia" fill="#333">PREMIUM</text><text x="30" y="71" fontSize="4.2" textAnchor="middle" fontFamily="Georgia" fill="#333">WHISKY</text></svg>
        <div style={{ position: "absolute", left: 40, top: 300, fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: RED2, transform: "rotate(-14deg)", opacity: T(f, len * 0.5, len * 0.58) }}>☠ নকল</div>
      </div>
      <Lines at={len * 0.15} step={len * 0.14} x={600} y={330} w={1150} color={RED2} items={["রেক্টিফায়েড স্পিরিট", "শিল্পকারখানার মিথানল", "নামী ব্র্যান্ডের নকল বোতল"]} />
      <div style={{ position: "absolute", left: 600, top: 720, fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: "white", opacity: T(f, len * 0.75, len * 0.82) }}>দাম কম, লাভ বেশি · মূল্য <span style={{ color: RED2 }}>জীবন</span></div>
      <RouteBar k={4} />
      <div style={{ position: "absolute", left: 140, top: 830, fontFamily: BN, fontSize: 24, color: AMBER }}>প্রতীকী চিত্র</div>
      <Source text="প্রথম আলো · সমকাল" />
      {S("glitch", len * 0.2, 0.35)}
    </AbsoluteFill>
  );
};

// ---------- women & alcohol: world record ----------
const World: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const p = T(f, len * 0.12, len * 0.45);
  const us = len * 0.6;
  return (
    <AbsoluteFill>
      <Bg tint="rgba(255,176,32,.16)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>বিশ্বে এক <span style={{ color: AMBER }}>রেকর্ড পরিবর্তন</span></>} size={64} /></div>
      <div style={{ position: "absolute", left: 90, top: 290, width: 900 }}>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 30, color: MUTE }}>পুরুষের তুলনায় নারীর মদ্যপান · জন্মসাল অনুযায়ী (৬৮টি গবেষণা)</div>
        <svg width="900" height="380" viewBox="0 0 900 380" style={{ marginTop: 10 }}>
          <line x1="40" y1="340" x2="880" y2="340" stroke="#4e636d" strokeWidth="3" />
          <line x1="40" y1="40" x2="880" y2="40" stroke={MUTE} strokeDasharray="8 8" strokeWidth="2" />
          <text x="40" y="30" fill={MUTE} fontSize="22" fontFamily="Hind">১০০% = সমান</text>
          <path d="M60 205 L860 70" stroke={AMBER} strokeWidth="10" strokeLinecap="round" fill="none" strokeDasharray="830" strokeDashoffset={830 * (1 - p)} />
          <circle cx="60" cy="205" r="14" fill={AMBER} /><circle cx="860" cy="70" r={14 * (p > 0.98 ? 1 : 0)} fill={AMBER} />
          <text x="60" y="250" fill="white" fontSize="30" fontFamily="Anek" fontWeight="800">৪৫%</text>
          <text x="770" y="120" fill={AMBER} fontSize="40" fontFamily="Anek" fontWeight="800" opacity={p > 0.98 ? 1 : 0}>~৯০%</text>
          <text x="40" y="372" fill={MUTE} fontSize="24" fontFamily="Hind">১৯০০-এর শুরু</text><text x="700" y="372" fill={MUTE} fontSize="24" fontFamily="Hind">১৯৯০-এর শেষ</text>
        </svg>
      </div>
      <div style={{ position: "absolute", right: 110, top: 300, width: 660, opacity: T(f, us, us + 12) }}>
        <Card delay={us} style={{ borderTop: `5px solid ${RED2}` }}>
          <div style={{ fontSize: 30, color: MUTE }}>যুক্তরাষ্ট্র · ১৮–২৫ বছর · ২০২১–২৩</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, marginTop: 6 }}>একবারে অতিরিক্ত পানে</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: AMBER }}>তরুণী &gt; তরুণ</div>
        </Card>
      </div>
      <Stamp text="ইতিহাসে প্রথম" at={len * 0.85} x={1250} y={680} color={AMBER} />
      <Source text="স্লেড ও অন্যান্য, BMJ Open ২০১৬ · JAMA Network Open, এপ্রিল ২০২৫ (NSDUH)" />
      {S("sfx/whoosh.mp3", len * 0.12, 0.3)}{S("hit", len * 0.85, 0.5)}
    </AbsoluteFill>
  );
};

// ---------- case studies ----------
const CaseFile: React.FC<{ len: number; img: string; date: string; place: string; v: number; vlabel: string; lines: string[]; src: string }> = ({ len, img, date, place, v, vlabel, lines, src }) => {
  const f = useCurrentFrame();
  const s = useSp(8, 14);
  return (
    <AbsoluteFill>
      <Ken src={img} len={len} dim={0.55} />
      <div style={{ position: "absolute", left: 90, top: 160, width: 1000, padding: "34px 40px", background: "rgba(239,233,220,.97)", borderRadius: 8, transform: `rotate(-1.2deg) translateY(${(1 - s) * 100}px)`, opacity: s, boxShadow: "0 40px 90px rgba(0,0,0,.65)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Montserrat", fontWeight: 700, fontSize: 24, color: "#666", letterSpacing: 3 }}><span>CASE FILE</span><span>COB</span></div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, color: "#1b1b1b", marginTop: 8 }}>{place}</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 32, color: "#555" }}>{date}</div>
        <div style={{ height: 3, background: "#1b1b1b", opacity: 0.4, margin: "16px 0" }} />
        {lines.map((l, i) => <div key={l} style={{ fontFamily: BN, fontWeight: 600, fontSize: 34, color: "#1b1b1b", marginTop: 8, opacity: T(f, len * 0.3 + i * len * 0.15, len * 0.3 + i * len * 0.15 + 12) }}>• {l}</div>)}
      </div>
      <div style={{ position: "absolute", right: 130, top: 330, textAlign: "center", opacity: T(f, len * 0.15, len * 0.2) }}>
        <Count v={v} at={len * 0.15} dur={50} size={240} color={RED2} />
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white" }}>{vlabel}</div>
      </div>
      <AiTag />
      <Source text={src} />
      {S("sfx/boom.mp3", len * 0.15, 0.4)}
    </AbsoluteFill>
  );
};
const Case1: React.FC<P> = ({ len }) => <CaseFile len={len} img="family" date="ফেব্রুয়ারি ২০২১" place="বগুড়া" v={18} vlabel="জনের মৃত্যু" lines={["পারিবারিক অনুষ্ঠানে মদ পান", "একে একে অসুস্থ, তারপর মৃত্যু", "রেক্টিফায়েড স্পিরিটে নানা উপাদান মিশিয়ে তৈরি"]} src="প্রথম আলো" />;
const Case2: React.FC<P> = ({ len }) => <CaseFile len={len} img="hospital" date="জানুয়ারি–ফেব্রুয়ারি ২০২১ · ১৪ দিনে" place="ঢাকা ও বগুড়া" v={14} vlabel="জনের মৃত্যু (অন্তত)" lines={["নিহতদের মধ্যে বিশ্ববিদ্যালয়ের শিক্ষার্থীও", "অন্তত ৬ বিক্রেতা আটক", "সূত্রভেদে সংখ্যায় পার্থক্য"]} src="বেনারনিউজ · দেশ রূপান্তর, ২ ফেব্রুয়ারি ২০২১ (পুলিশের বরাতে)" />;
const Methanol: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const chain = [{ k: "মিথানল", c: AMBER }, { k: "লিভার", c: AMBER }, { k: "ফরমিক অ্যাসিড", c: RED2 }, { k: "চোখের স্নায়ু", c: RED2 }, { k: "কিডনি বিকল", c: RED2 }, { k: "মৃত্যু", c: RED }];
  const step = len * 0.11;
  const blur = T(f, len * 0.4, len * 0.6, 0, 14);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.25)" />
      <div style={{ position: "absolute", left: 90, top: 140, filter: `blur(${blur * 0.25}px)` }}><Head text="মিথানল কেন প্রাণঘাতী?" size={64} /></div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 380, display: "flex", alignItems: "center", gap: 10, filter: `blur(${f > len * 0.75 ? 0 : blur * 0.12}px)` }}>
        {chain.map((c, i) => {
          const at = 20 + i * step;
          const s = spring({ frame: f - at, fps: 30, config: { damping: 13 } });
          return (
            <React.Fragment key={c.k}>
              <div style={{ flex: 1, textAlign: "center", padding: "26px 8px", borderRadius: 16, background: "rgba(14,23,28,.92)", border: `2px solid ${c.c}`, opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 38, color: c.c }}>{c.k}</div>
              </div>
              {i < chain.length - 1 && <div style={{ fontSize: 44, color: MUTE, opacity: s }}>→</div>}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: T(f, len * 0.78, len * 0.85) }}>
        <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: "white" }}>প্রথম কয়েক ঘণ্টা <span style={{ color: AMBER }}>বোঝাই যায় না</span></span>
      </div>
      <Source text="সমকাল · চিকিৎসা বিজ্ঞানের প্রতিষ্ঠিত তথ্য" />
      {chain.map((_, i) => S("tick", 20 + i * step, 0.35))}
    </AbsoluteFill>
  );
};
const Case3: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const days = ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র"];
  const wk2 = f > len * 0.4;
  const on = (i: number) => (wk2 ? [1, 3, 5].includes(i) : i === 5);
  const after = len * 0.55;
  return (
    <AbsoluteFill>
      <Ken src="trisha" len={len} dim={0.45} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>‘তৃষা’, <span style={{ color: AMBER }}>২২</span></>} size={70} /></div>
      <div style={{ position: "absolute", left: 90, top: 270, fontFamily: BN, fontWeight: 700, fontSize: 32, color: "white", opacity: T(f, 10, 25) }}>প্রথমবার বারে — শুধু কৌতূহলে · বিল দেন পরিচিত ‘বড় ভাই’</div>
      <div style={{ position: "absolute", left: 90, top: 350, display: "flex", gap: 12, opacity: T(f, len * 0.2, len * 0.26) }}>
        {days.map((d, i) => (
          <div key={d} style={{ width: 104, height: 104, borderRadius: 14, background: on(i) ? RED : "rgba(14,23,28,.85)", border: "1px solid rgba(255,255,255,.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: BN, fontWeight: 700, fontSize: 26, color: "white" }}>
            {d}<span style={{ fontSize: 34 }}>{on(i) ? "🍸" : ""}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 90, top: 480, fontFamily: BN, fontWeight: 700, fontSize: 30, color: AMBER, opacity: T(f, len * 0.2, len * 0.26) }}>{wk2 ? "কয়েক মাস পরে: সপ্তাহে ৩ দিন" : "শুরুতে: সপ্তাহে ১ দিন"}</div>
      <div style={{ position: "absolute", left: 90, top: 560, display: "flex", flexWrap: "wrap", gap: 14, width: 1100 }}>
        {["৬ মাস পরে: মদ ছাড়া ঘুম আসে না", "পরীক্ষায় ফেল", "পরিবারের সঙ্গে দূরত্ব", "যিনি বিল দেন, তার দাবি বাড়ে"].map((t, i) => (
          <div key={t} style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white", background: i === 3 ? "rgba(224,20,43,.55)" : "rgba(14,23,28,.88)", padding: "12px 24px", borderRadius: 30, opacity: T(f, after + i * len * 0.08, after + i * len * 0.08 + 12) }}>{t}</div>
        ))}
      </div>
      <AiTag />
      <Fiction />
      {S("sfx/whoosh.mp3", len * 0.4, 0.3)}
    </AbsoluteFill>
  );
};

// ---------- harms ----------
const BodyMap: React.FC<{ hi: string[]; pulse?: boolean }> = ({ hi, pulse = true }) => {
  const f = useCurrentFrame();
  const a = (k: string) => (hi.includes(k) ? 0.55 + (pulse ? 0.4 * Math.abs(Math.sin(f / 9)) : 0.4) : 0.12);
  return (
    <svg width="460" height="820" viewBox="0 0 100 180" style={{ position: "absolute", right: 140, top: 150 }}>
      <circle cx="50" cy="18" r="13" fill="#1d2a31" stroke="#5c7380" strokeWidth="1" />
      <path d="M30 36 Q50 30 70 36 L76 100 Q50 108 24 100z" fill="#1d2a31" stroke="#5c7380" strokeWidth="1" />
      <path d="M26 100 L32 175 L45 175 L50 112 L55 175 L68 175 L74 100z" fill="#1d2a31" stroke="#5c7380" strokeWidth="1" />
      <path d="M30 38 L16 92 M70 38 L84 92" stroke="#5c7380" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="50" cy="16" rx="9" ry="7" fill={`rgba(164,107,255,${a("brain")})`} />
      <rect x="47" y="30" width="6" height="22" rx="3" fill={`rgba(255,176,32,${a("throat")})`} />
      <circle cx="44" cy="52" r="6" fill={`rgba(255,77,94,${a("heart")})`} />
      <circle cx="38" cy="50" r="5" fill={`rgba(255,95,162,${a("breast")})`} /><circle cx="62" cy="50" r="5" fill={`rgba(255,95,162,${a("breast")})`} />
      <path d="M36 64 Q50 58 62 64 Q58 74 40 72z" fill={`rgba(201,122,58,${a("liver")})`} />
      <ellipse cx="58" cy="72" rx="7" ry="5" fill={`rgba(255,176,32,${a("stomach")})`} />
      <path d="M38 80 Q50 76 62 80 Q62 94 50 96 Q38 94 38 80z" fill={`rgba(255,176,32,${a("gut")})`} />
      <circle cx="50" cy="88" r="7" fill={`rgba(255,95,162,${a("womb")})`} />
    </svg>
  );
};
const HarmWorld: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Ken src="hospital" len={len} dim={0.65} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="মদ শরীরে কী করে?" size={64} /></div>
      <Big v={2600000} at={len * 0.18} label="মানুষের মৃত্যু · শুধু ২০১৯ সালে, মদের কারণে" x={90} y={290} size={170} color={RED2} />
      <div style={{ position: "absolute", left: 90, top: 560, display: "flex", gap: 18, opacity: T(f, len * 0.45, len * 0.5) }}>
        {[{ v: "৪.৭%", k: "বিশ্বের মোট মৃত্যু" }, { v: "৪.৭৪ লাখ", k: "হৃদরোগে" }, { v: "৪ লাখ+", k: "ক্যানসারে" }, { v: "২০ কোটি+", k: "আসক্ত মানুষ" }].map((c, i) => (
          <Card key={c.k} delay={len * 0.45 + i * len * 0.1} style={{ textAlign: "center", minWidth: 300 }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, color: i === 3 ? AMBER : RED2 }}>{c.v}</div>
            <div style={{ fontSize: 30 }}>{c.k}</div>
          </Card>
        ))}
      </div>
      <AiTag />
      <Source text="বিশ্ব স্বাস্থ্য সংস্থা (WHO), ২৫ জুন ২০২৪ — বৈশ্বিক অ্যালকোহল ও স্বাস্থ্য প্রতিবেদন" />
      {S("sfx/boom.mp3", len * 0.18, 0.45)}
    </AbsoluteFill>
  );
};
const OrganScene: React.FC<{ len: number; title: React.ReactNode; hi: string[]; items: string[]; src: string; color?: string; arrows?: boolean }> = ({ len, title, hi, items, src, color = AMBER, arrows }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.18)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={title} size={64} /></div>
      <div style={{ position: "absolute", left: 90, top: 300, width: 1080, display: "flex", flexDirection: "column", gap: arrows ? 6 : 18 }}>
        {items.map((t, i) => {
          const at = len * 0.12 + i * (len * 0.7 / items.length);
          return (
            <React.Fragment key={t}>
              <Card delay={at} style={{ fontSize: 40, fontWeight: 700, borderLeft: `6px solid ${i === items.length - 1 && arrows ? RED2 : color}` }}>{t}</Card>
              {arrows && i < items.length - 1 && <div style={{ fontSize: 40, color: MUTE, paddingLeft: 30, opacity: T(f, at + 10, at + 20) }}>↓</div>}
            </React.Fragment>
          );
        })}
      </div>
      <BodyMap hi={hi} />
      <div style={{ position: "absolute", right: 140, top: 900, fontFamily: BN, fontSize: 22, color: AMBER }}>প্রতীকী চিত্র</div>
      <Source text={src} />
      {items.map((_, i) => S("tick", len * 0.12 + i * (len * 0.7 / items.length), 0.3))}
    </AbsoluteFill>
  );
};
const HarmBrain: React.FC<P> = ({ len }) => <OrganScene len={len} title="মস্তিষ্ক" hi={["brain"]} color="#a46bff" items={["সংকেত চলাচল ধীর: কথা জড়ানো, ভারসাম্য হারানো", "ভুল সিদ্ধান্ত", "নিয়মিত পানে স্মৃতিশক্তি কমে", "বিষণ্ণতা ও উদ্বেগ বাড়ে", "তরুণ বয়সে ক্ষতি আরও গভীর"]} src="NIAAA · NIH" />;
const Addict: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const steps = [1, 1.6, 2.3, 3.1, 4];
  const p = T(f, len * 0.15, len * 0.6);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(164,107,255,.2)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="আসক্তি তৈরি হয় যেভাবে" size={64} /></div>
      <div style={{ position: "absolute", left: 120, top: 320, width: 900, height: 460, display: "flex", alignItems: "flex-end", gap: 40 }}>
        {steps.map((v, i) => {
          const k = Math.min(1, Math.max(0, p * steps.length - i));
          return (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 44, opacity: k }}>{"🍸".repeat(Math.min(3, Math.ceil(v)))}</div>
              <div style={{ height: 90 * v * k, background: `linear-gradient(0deg, #a46bff55, #a46bff)`, borderRadius: "10px 10px 0 0" }} />
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 26, color: MUTE, marginTop: 8 }}>{["শুরু", "", "", "", "কয়েক মাস"][i]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 120, top: 270, fontFamily: BN, fontWeight: 700, fontSize: 30, color: "#a46bff", opacity: T(f, len * 0.15, len * 0.2) }}>একই আনন্দের জন্য লাগে আরও বেশি — টলারেন্স</div>
      <Lines at={len * 0.6} step={len * 0.08} x={1120} y={330} w={700} color={RED2} size={36} items={["কাঁপুনি", "অস্থিরতা", "অনিদ্রা"]} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 200, textAlign: "center", opacity: T(f, len * 0.85, len * 0.9) }}>
        <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 58, color: "white" }}>আনন্দের জন্য নয়, <span style={{ color: RED2 }}>কষ্ট থামাতে</span></span>
      </div>
      <Source text="NIAAA · মাদকাসক্তি বিষয়ক স্নায়ুবিজ্ঞান" />
    </AbsoluteFill>
  );
};
const HarmLiver: React.FC<P> = ({ len }) => <OrganScene len={len} arrows title={<>লিভার: <span style={{ color: AMBER }}>অ্যালকোহল ভাঙার কারখানা</span></>} hi={["liver", "heart", "stomach"]} items={["চর্বি জমা (ফ্যাটি লিভার)", "প্রদাহ (অ্যালকোহলিক হেপাটাইটিস)", "সিরোসিস — আর ফেরানো যায় না"]} src="NIAAA · বিশ্ব স্বাস্থ্য সংস্থা" />;
const HarmCancer: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const cs = ["মুখ", "গলা", "খাদ্যনালি", "লিভার", "অন্ত্র", "স্তন (নারী)"];
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.22)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="ক্যানসার" size={70} color={RED2} /></div>
      <div style={{ position: "absolute", left: 90, top: 270, display: "flex", gap: 20, opacity: T(f, len * 0.1, len * 0.16) }}>
        {[{ k: "অ্যালকোহল", c: RED2 }, { k: "তামাক", c: MUTE }, { k: "অ্যাসবেস্টস", c: MUTE }].map((x) => <Card key={x.k} delay={len * 0.1} style={{ fontSize: 40, fontWeight: 800, color: x.c, border: `2px solid ${x.c}` }}>{x.k}</Card>)}
      </div>
      <div style={{ position: "absolute", left: 90, top: 390, fontFamily: BN, fontWeight: 700, fontSize: 34, color: AMBER, opacity: T(f, len * 0.2, len * 0.26) }}>একই সারিতে: প্রথম শ্রেণির ক্যানসার সৃষ্টিকারী (IARC, ১৯৮৮ থেকে)</div>
      <div style={{ position: "absolute", left: 90, top: 470, width: 1080, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {cs.map((c, i) => <Card key={c} delay={len * 0.5 + i * len * 0.07} style={{ fontSize: 40, fontWeight: 700, borderLeft: `6px solid ${i === 5 ? "#ff5fa2" : RED2}` }}>{c}</Card>)}
      </div>
      <BodyMap hi={["throat", "liver", "gut", "breast"]} />
      <Source text="আন্তর্জাতিক ক্যানসার গবেষণা সংস্থা (IARC) · বিশ্ব স্বাস্থ্য সংস্থা" />
      {S("hit", len * 0.1, 0.45)}
    </AbsoluteFill>
  );
};
const HarmWomen: React.FC<P> = ({ len }) => <OrganScene len={len} title={<>নারীর জন্য <span style={{ color: "#ff5fa2" }}>ঝুঁকি বেশি</span></>} hi={["breast", "womb"]} color="#ff5fa2" items={["অল্প নিয়মিত পানেও স্তন ক্যানসারের ঝুঁকি", "গর্ভাবস্থায়: শিশুর মস্তিষ্ক ও শরীরে আজীবন ক্ষতি", "গর্ভাবস্থায় নিরাপদ কোনো পরিমাণ নেই"]} src="বিশ্ব স্বাস্থ্য সংস্থা · NIAAA" />;
const NoSafe: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const p = T(f, len * 0.15, len * 0.5);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.2)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>নিরাপদ মাত্রা? <span style={{ color: RED2 }}>নেই</span></>} size={70} /></div>
      <div style={{ position: "absolute", left: 120, top: 300, width: 900, height: 420 }}>
        <svg width="900" height="420" viewBox="0 0 900 420">
          <line x1="40" y1="380" x2="880" y2="380" stroke="#4e636d" strokeWidth="3" />
          <path d="M40 370 C 300 330, 600 200, 860 40" stroke={RED2} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000 * (1 - p)} />
          <text x="40" y="412" fill={MUTE} fontSize="26" fontFamily="Hind">১ গ্লাস</text><text x="760" y="412" fill={MUTE} fontSize="26" fontFamily="Hind">বেশি পান</text>
          <text x="560" y="140" fill={RED2} fontSize="34" fontFamily="Anek" fontWeight="800" opacity={p}>ঝুঁকি ↑</text>
        </svg>
      </div>
      <Lines at={len * 0.55} step={len * 0.08} x={1100} y={300} w={720} color={AMBER} size={36} items={["🚗 সড়ক দুর্ঘটনা", "👊 সহিংসতা", "💔 ভাঙা সংসার", "💸 অর্থের অপচয়"]} />
      <Source text="বিশ্ব স্বাস্থ্য সংস্থা (WHO), জানুয়ারি ২০২৩" />
    </AbsoluteFill>
  );
};
const Parents: React.FC<P> = ({ len }) => (
  <AbsoluteFill>
    <Ken src="city" len={len} dim={0.72} blur={4} />
    <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="অভিভাবকদের জন্য" size={64} color={GREEN} /></div>
    <Lines at={len * 0.12} step={len * 0.14} w={1100} color={GREEN} items={["🌙 রাতে কোথায় যায়, কার সঙ্গে মেশে", "💰 হঠাৎ দামি জিনিস বা টাকার উৎস", "🗣️ শাসনের চেয়ে খোলামেলা সম্পর্ক", "📞 বিপদে যেন আপনাকেই প্রথম ফোন করে"]} />
    <AiTag />
  </AbsoluteFill>
);
const Help: React.FC<P> = ({ len }) => {
  const s = useSp(len * 0.6, 12);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(62,224,143,.18)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="লজ্জা নয়, সাহায্য নিন" size={64} /></div>
      <Lines at={len * 0.15} step={len * 0.15} w={1000} color={GREEN} items={["মাদকদ্রব্য নিয়ন্ত্রণ অধিদপ্তরের নিরাময় কেন্দ্র", "সরকারি হাসপাতালের মানসিক স্বাস্থ্য বিভাগ"]} />
      <div style={{ position: "absolute", right: 160, top: 330, textAlign: "center", transform: `scale(${s})` }}>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white" }}>জরুরি প্রয়োজনে</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 260, color: GREEN, lineHeight: 1 }}>৯৯৯</div>
      </div>
      {S("hit", len * 0.6, 0.45)}
    </AbsoluteFill>
  );
};

// ---------- chapter stinger ----------
const CH = 95;
const Chapter: React.FC<{ title: string }> = ({ title }) => {
  const f = useCurrentFrame();
  const [no, name] = title.split(" · ");
  const s = spring({ frame: f - 4, fps: 30, config: { damping: 14 } });
  const w = T(f, 6, 30);
  return (
    <AbsoluteFill style={{ background: INK, justifyContent: "center", alignItems: "center", opacity: interpolate(f, [0, 6, CH - 8, CH], [0, 1, 1, 0]) }}>
      <Bg tint="rgba(224,20,43,.2)" />
      <div style={{ textAlign: "center", transform: `translateY(${(1 - s) * 40}px)`, opacity: s }}>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: AMBER, letterSpacing: 0 }}>{no}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: "white", marginTop: 6 }}>{name}</div>
        <div style={{ height: 6, width: 600 * w, background: RED, margin: "18px auto 0", borderRadius: 4 }} />
      </div>
      <Grain />
      {S("sfx/whoosh.mp3", 2, 0.4)}
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {
  raid: S1, title: S2, timeline: S3, law: S4, gap: S5, h_origin: HOrigin, h_bengal: HBengal, h_british: HBritish, h_carew: HCarew, h_const: HConst, h_world: HWorld,
  s_keru: SKeru, s_import: SImport, s_bond: SBond, s_border: SBorder, s_fake: SFake, money: S6, perception: S7, bd_data: S8, world: World, why: S9, daddy: S10, control: S11,
  brain: S12, case1: Case1, case2: Case2, methanol: Methanol, case3: Case3, harm_world: HarmWorld, harm_brain: HarmBrain, addict: Addict, harm_liver: HarmLiver,
  harm_cancer: HarmCancer, harm_women: HarmWomen, nosafe: NoSafe, picture: S13, parents: Parents, solution: S14, help: Help, close: S15,
};
type Para = { id: string; text: string; ch?: string };
const PARAS = (SCRIPT as { paras: Para[] }).paras;
const DUR = (VO as { dur: Record<string, number> }).dur;
const GAP = 24;
const TL = (() => {
  let at = 0;
  return PARAS.map((p) => {
    const ch = p.ch ? at : -1;
    if (p.ch) at += CH;
    const o = { p, ch, from: at, len: DUR[p.id] };
    at += DUR[p.id] + GAP;
    return o;
  });
})();
export const BARFILM_LEN = TL[TL.length - 1].from + TL[TL.length - 1].len + GAP + 70;

export const BarFilm: React.FC = () => {
  const f = useCurrentFrame();
  const end = BARFILM_LEN - 70;
  const ca = TL.find((t) => t.p.id === "case1")!.ch, cb = TL.find((t) => t.p.id === "picture")!.ch;
  const inCase = (fr: number) => fr > ca && fr < cb;
  const speaking = (fr: number) => TL.some((t) => fr >= t.from + 6 && fr < t.from + 6 + t.len);
  const bugOn = f > TL[2].from && f < TL[TL.length - 1].from && !TL.some((t) => t.ch >= 0 && f >= t.ch && f < t.ch + CH);
  return (
    <AbsoluteFill style={{ background: INK }}>
      {TL.map(({ p, ch, from, len }) => {
        const Sc = MAP[p.id];
        return (
          <React.Fragment key={p.id}>
            {ch >= 0 && <Sequence from={ch} durationInFrames={CH}><Chapter title={p.ch!} /></Sequence>}
            <Sequence from={from} durationInFrames={len + GAP + 10}>
              <AbsoluteFill style={{ opacity: interpolate(f - from, [0, 10, len + GAP, len + GAP + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                <Sc len={len} />
              </AbsoluteFill>
              <Sequence from={6}>
                <Audio src={staticFile(`barinv/vo15/${p.id}.mp3`)} />
                {p.id !== "title" && p.id !== "close" && <Subs text={p.text} len={len} />}
              </Sequence>
            </Sequence>
          </React.Fragment>
        );
      })}
      {bugOn && <Bug />}
      <Grain />
      <Audio src={staticFile("gambmusic.mp3")} loop volume={(fr) => (inCase(fr) ? 0 : 1) * (speaking(fr) ? 0.13 : 0.26) * interpolate(fr, [0, 15, end - 30, end + 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Audio src={staticFile("htmusic.mp3")} loop volume={(fr) => (inCase(fr) ? (speaking(fr) ? 0.12 : 0.22) : 0)} />
    </AbsoluteFill>
  );
};
