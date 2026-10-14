// Colours of Bangladesh — ডেটা অনুসন্ধান: "প্রবাসীর কফিন" (12 Oct 2026).
// Data: Wage Earners' Welfare Board via Prothom Alo (6 Oct 2026: Jan–Sep 2026 = 4,060 bodies, causes, aid, heat research,
// Cambodia case) and The Daily Star Bangla (24 Jan 2025: yearly series 2021–24, 1993–2024 total, 2016–22 by country);
// remittance FY26 $35.5bn: The Daily Star. No photos of the deceased are used.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BN, bn, clamp, useSp, Sfx } from "../news/NewsKit";
import { RED, RED2, INK, MUTE, AMBER, HEAD, T, Grain, Bg, Bug, Label, Source, Money, Card, Fade } from "./HoneyTrap";

const BLUE = "rgba(90,140,190,.20)", PALE = "#cfd8dd";
const fmt = (n: number) => bn(Math.round(n).toLocaleString("en-IN"));
const Coffin: React.FC<{ w?: number; color?: string }> = ({ w = 40, color = "#d9dee1" }) => (
  <svg width={w} height={w * 2} viewBox="0 0 20 40"><path d="M6 0h8l5 10-3 30H4L1 10z" fill={color} /><path d="M10 6v12M6 10h8" stroke={INK} strokeWidth={1.6} /></svg>
);

// 4,060 coffins filling a grid
const C1: React.FC = () => {
  const f = useCurrentFrame();
  const N = 4060, cols = 70, cw = 13, ch = 14, fill = Math.floor(T(f, 10, 250, 0, N));
  return (
    <AbsoluteFill>
      <Bg tint={BLUE} />
      <svg style={{ position: "absolute", left: 90, top: 140 }} width={cols * cw} height={Math.ceil(N / cols) * ch} viewBox={`0 0 ${cols * cw} ${Math.ceil(N / cols) * ch}`}>
        {Array.from({ length: fill }, (_, i) => <rect key={i} x={(i % cols) * cw + 2.5} y={Math.floor(i / cols) * ch + 2} width={cw - 5} height={ch - 4} rx={2} fill={i === fill - 1 ? RED2 : "rgba(217,222,225,.85)"} />)}
      </svg>
      <div style={{ position: "absolute", left: 1110, top: 260, right: 90 }}>
        <div style={{ fontFamily: BN, fontSize: 38, color: MUTE }}>জানুয়ারি–সেপ্টেম্বর ২০২৬</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 190, color: "white", lineHeight: 1 }}>{fmt(fill)}</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 52, color: PALE }}>প্রবাসীর মরদেহ</div>
        <div style={{ marginTop: 34, fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: RED2, opacity: T(f, 250, 275) }}>দিনে গড়ে ১৪টির বেশি</div>
      </div>
      <Source text="ওয়েজ আর্নার্স কল্যাণ বোর্ড, প্রথম আলো (৬ অক্টোবর ২০২৬)" />
    </AbsoluteFill>
  );
};
const C2: React.FC = () => {
  const f = useCurrentFrame();
  const a = T(f, 0, 35);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(90,140,190,.28)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}><Coffin w={70} /></div>
        <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 28, letterSpacing: 12, color: RED2, marginTop: 24, opacity: a }}>COLOURS OF BANGLADESH · DATA INVESTIGATION</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 180, color: "white", lineHeight: 1.05, marginTop: 10, opacity: a }}>প্রবাসীর কফিন</div>
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 44, color: PALE, marginTop: 14, opacity: T(f, 50, 80) }}>যাঁরা গিয়েছিলেন হাসি ফোটাতে, ফিরছেন কফিনে</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const YEARS: [string, number, boolean?][] = [["২০১৯", 3651], ["২০২০", 3140], ["২০২১", 3818], ["২০২২", 3904], ["২০২৩", 4552], ["২০২৪", 4813], ["২০২৬*", 4060, true]];
const C3: React.FC = () => {
  const f = useCurrentFrame();
  const max = 4813, H = 520;
  return (
    <AbsoluteFill>
      <Bg tint={BLUE} />
      <Label title="প্রতিবছর বাড়ছে মরদেহ" />
      <div style={{ position: "absolute", left: 160, right: 160, top: 300, height: H + 120, display: "flex", alignItems: "flex-end", gap: 34 }}>
        {YEARS.map(([y, v, part], i) => {
          const at = 20 + i * 45, p = T(f, at, at + 40), rec = v === max;
          return (
            <div key={y} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: rec ? RED2 : "white", opacity: p }}>{fmt(v * p)}</div>
              <div style={{ width: "100%", height: (v / max) * H * p, borderRadius: "10px 10px 0 0", background: part ? "repeating-linear-gradient(45deg, rgba(255,176,32,.85) 0 10px, rgba(255,176,32,.55) 10px 20px)" : rec ? `linear-gradient(180deg, ${RED2}, ${RED})` : "linear-gradient(180deg,#cfd8dd,#7d8f99)", boxShadow: rec ? "0 0 50px rgba(224,20,43,.45)" : "none" }} />
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white" }}>{y}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 160, bottom: 52, fontFamily: BN, fontSize: 24, color: MUTE }}>* ২০২৬: জানুয়ারি–সেপ্টেম্বর (৯ মাস) · ২০২৫ সালের পূর্ণ হিসাব প্রকাশিত সূত্রে পাওয়া যায়নি</div>
      <Source text="ওয়েজ আর্নার্স কল্যাণ বোর্ড; প্রথম আলো, ডেইলি স্টার" />
    </AbsoluteFill>
  );
};
const C4: React.FC = () => {
  const f = useCurrentFrame();
  const rows = 6, per = 22;
  return (
    <AbsoluteFill>
      <Bg tint={BLUE} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: BN, fontSize: 40, color: MUTE }}>১৯৯৩ – ২০২৪</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 220, color: "white", lineHeight: 1 }}>{fmt(T(f, 10, 120, 0, 56769))}</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 56, color: PALE }}>মরদেহ ফিরেছে দেশে</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${per}, 1fr)`, gap: 10, marginTop: 40 }}>
          {Array.from({ length: rows * per }, (_, i) => <div key={i} style={{ opacity: T(f, 120 + i * 1.2, 140 + i * 1.2) }}><Coffin w={22} color={i % 37 === 5 ? RED2 : "rgba(217,222,225,.7)"} /></div>)}
        </div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: AMBER, marginTop: 34, opacity: T(f, 260, 290) }}>৫৬ হাজারেরও বেশি পরিবারের অপেক্ষা শেষ হয়েছে কফিনে</div>
      </AbsoluteFill>
      <Source text="ওয়েজ আর্নার্স কল্যাণ বোর্ড, ডেইলি স্টার (২৪ জানুয়ারি ২০২৫)" />
    </AbsoluteFill>
  );
};
const Donut: React.FC<{ pct: number; at: number; size?: number; color?: string; label: string; sub: string }> = ({ pct, at, size = 420, color = RED, label, sub }) => {
  const f = useCurrentFrame();
  const r = 42, c = 2 * Math.PI * r, p = T(f, at, at + 50) * pct;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={12} />
        <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={12} strokeDasharray={`${(p / 100) * c} ${c}`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size * 0.22, color: "white", lineHeight: 1 }}>{bn(Math.round(p))}%{label.endsWith("+") ? "+" : ""}</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: size * 0.075, color: PALE, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};
const C5: React.FC = () => {
  const f = useCurrentFrame();
  const bars: [string, number][] = [["সৌদি আরব", 5666], ["সংযুক্ত আরব আমিরাত", 1913], ["ওমান", 1893]];
  return (
    <AbsoluteFill>
      <Bg tint={BLUE} />
      <Label title="কোথা থেকে আসছে কফিন" />
      <div style={{ position: "absolute", left: 140, top: 300 }}>
        <Donut pct={70} at={60} label="+" sub="মধ্যপ্রাচ্য থেকে" />
        <Card delay={20} style={{ marginTop: 26, width: 520 }}><div style={{ fontSize: 26, color: MUTE }}>২০২৬ (৯ মাস), শুধু সৌদি আরবে</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 56, whiteSpace: "nowrap" }}>প্রায় ২,০০০ জন</div></Card>
      </div>
      <div style={{ position: "absolute", left: 760, right: 140, top: 330 }}>
        <div style={{ fontFamily: BN, fontSize: 30, color: MUTE, marginBottom: 20 }}>জুলাই ২০১৬ – জুন ২০২২, শীর্ষ তিন দেশ</div>
        {bars.map(([k, v], i) => {
          const p = T(f, 150 + i * 30, 200 + i * 30);
          return (
            <div key={k} style={{ marginBottom: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white" }}><span>{k}</span><span>{fmt(v * p)}</span></div>
              <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,.08)", marginTop: 8 }}><div style={{ width: `${(v / 5666) * 100 * p}%`, height: "100%", borderRadius: 13, background: i === 0 ? `linear-gradient(90deg, ${RED}, ${RED2})` : "linear-gradient(90deg,#7d8f99,#cfd8dd)" }} /></div>
            </div>
          );
        })}
        <Card delay={290} style={{ display: "inline-block", marginTop: 10 }}><span style={{ fontSize: 36, fontWeight: 700 }}>দ্বিতীয় সর্বোচ্চ: মালয়েশিয়া</span></Card>
      </div>
      <Source text="প্রথম আলো (৬ অক্টো ২০২৬), ডেইলি স্টার (২৪ জানু ২০২৫)" />
    </AbsoluteFill>
  );
};
const C6: React.FC = () => {
  const causes = ["সড়ক দুর্ঘটনা", "কর্মস্থলে দুর্ঘটনা", "আগুনে পোড়া", "ভবন থেকে পড়ে যাওয়া", "বিদ্যুতায়িত হওয়া"];
  return (
    <AbsoluteFill>
      <Bg tint={BLUE} />
      <Label title="কাগজে মৃত্যুর কারণ" />
      <div style={{ position: "absolute", left: 160, top: 300 }}><Donut pct={66} at={20} color="#7d8f99" label="" sub="‘স্বাভাবিক মৃত্যু’" /></div>
      <div style={{ position: "absolute", left: 760, top: 310, right: 140 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: RED2 }}>বাকি ৩৪%</div>
        <div style={{ fontFamily: BN, fontSize: 32, color: MUTE, marginBottom: 18 }}>দুর্ঘটনাসহ অন্যান্য কারণ (২০২৬, প্রথম ৯ মাস)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>{causes.map((c, i) => <Card key={c} delay={150 + i * 28} style={{ fontSize: 36, fontWeight: 700, padding: "14px 24px" }}>{c}</Card>)}</div>
      </div>
      <Source text="প্রথম আলো, ৬ অক্টোবর ২০২৬" />
    </AbsoluteFill>
  );
};
const C7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.18)" />
      <div style={{ position: "absolute", left: 140, top: 200, right: 140 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 84, color: "white", lineHeight: 1.2, opacity: T(f, 5, 30) }}>২৫–৩০ বছরের তরুণের<br />‘স্বাভাবিক মৃত্যু’ <span style={{ color: RED2 }}>কতটা স্বাভাবিক?</span></div>
        <div style={{ display: "flex", gap: 40, marginTop: 60, alignItems: "stretch" }}>
          <div style={{ flex: 1, background: "#f2efe8", color: INK, borderRadius: 10, padding: "30px 36px", fontFamily: BN, transform: `rotate(-1.5deg) translateY(${(1 - useSp(110)) * 60}px)`, opacity: useSp(110), boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
            <div style={{ fontSize: 26, color: "#6b6f78", letterSpacing: 0 }}>মৃত্যুসনদ</div>
            <div style={{ fontSize: 30, marginTop: 10 }}>মৃত্যুর কারণ:</div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64 }}>হার্ট অ্যাটাক</div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 52, color: AMBER, border: `5px solid ${AMBER}`, borderRadius: 12, padding: "16px 30px", transform: `rotate(-4deg) scale(${T(f, 280, 300, 1.5, 1)})`, opacity: T(f, 280, 295) }}>কারণ যাচাই হয় না</div>
          </div>
        </div>
      </div>
      <Source text="ডেইলি স্টার (অধিকারকর্মীর বক্তব্য), প্রথম আলো" />
    </AbsoluteFill>
  );
};
const C8: React.FC = () => {
  const f = useCurrentFrame();
  const heat = T(f, 20, 160);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(255,120,40,.22)" />
      <Label title="মরুর তাপে নির্মাণকাজ" />
      <div style={{ position: "absolute", left: 200, top: 290, width: 90, height: 560, borderRadius: 45, background: "rgba(255,255,255,.08)", border: "3px solid rgba(255,255,255,.2)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${20 + heat * 78}%`, background: "linear-gradient(0deg,#ff4d1a,#ffb020)", boxShadow: "0 0 60px rgba(255,90,30,.6)" }} />
      </div>
      <div style={{ position: "absolute", left: 360, top: 300, right: 140, display: "flex", flexDirection: "column", gap: 20 }}>
        {["কিডনির ক্ষতি", "মস্তিষ্কের ক্ষতি", "হৃদ্‌রোগ, ডায়াবেটিস জটিল হয়"].map((t, i) => <Card key={t} delay={60 + i * 40} style={{ fontSize: 44, fontWeight: 700, width: 640 }}>{t}</Card>)}
        <div style={{ fontFamily: BN, fontSize: 34, color: AMBER, opacity: T(f, 200, 230) }}>জলবায়ু পরিবর্তনে তাপ আরও বাড়ছে</div>
      </div>
      <div style={{ position: "absolute", right: 140, top: 330, width: 520, opacity: T(f, 330, 360) }}>
        <Card delay={330} style={{ textAlign: "center", border: `2px solid ${RED}` }}>
          <div style={{ fontSize: 32, color: MUTE }}>বিদেশে যাওয়ার আগে প্রশিক্ষণ</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 130, color: RED2, lineHeight: 1 }}>৩ দিন</div>
        </Card>
      </div>
      <Source text="প্রথম আলো, ৬ অক্টোবর ২০২৬" />
    </AbsoluteFill>
  );
};
const C9: React.FC = () => {
  const f = useCurrentFrame();
  const p = T(f, 90, 300);
  return (
    <AbsoluteFill>
      <Bg tint={BLUE} />
      <Label title="ফিরতেও দেড় বছর" />
      <div style={{ position: "absolute", left: 160, right: 160, top: 470 }}>
        <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,.1)" }}><div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 7, background: `linear-gradient(90deg, ${RED}, ${AMBER})` }} /></div>
        <div style={{ position: "absolute", left: 0, top: -170 }}><Card delay={20}><div style={{ fontSize: 28, color: MUTE }}>কম্বোডিয়া, কর্মস্থলে মৃত্যু</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52 }}>১২ এপ্রিল ২০২৫</div></Card></div>
        <div style={{ position: "absolute", right: 0, top: 50, opacity: T(f, 290, 310) }}><Card delay={290}><div style={{ fontSize: 28, color: MUTE }}>মরদেহ দেশে পৌঁছায়</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52 }}>২৭ সেপ্টেম্বর ২০২৬</div></Card></div>
        <div style={{ position: "absolute", left: `${p * 100}%`, top: -30, transform: "translateX(-50%)" }}><Coffin w={36} color={AMBER} /></div>
        <div style={{ textAlign: "center", marginTop: 110, fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "white" }}>{bn(Math.round(p * 17.5))} মাস</div>
      </div>
      <div style={{ position: "absolute", left: 160, bottom: 140, fontFamily: BN, fontWeight: 700, fontSize: 40, color: RED2, opacity: T(f, 320, 345) }}>কম্বোডিয়ায় বাংলাদেশের দূতাবাস নেই</div>
      <Source text="প্রথম আলো, ৬ অক্টোবর ২০২৬" />
    </AbsoluteFill>
  );
};
const C10: React.FC = () => (
  <AbsoluteFill>
    <Bg tint={BLUE} />
    <Label title="একটি জীবনের দাম?" />
    <div style={{ position: "absolute", left: 160, right: 160, top: 320, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
      <Card delay={20}><div style={{ fontSize: 32, color: MUTE }}>দাফন খরচ, প্রতিটি মরদেহ</div><Money at={25} dur={50} to={35000} size={100} /></Card>
      <Card delay={90}><div style={{ fontSize: 32, color: MUTE }}>পরিবারকে আর্থিক অনুদান</div><Money at={95} dur={50} to={300000} size={100} /></Card>
      <Card delay={220} style={{ gridColumn: "1 / -1", textAlign: "center" }}><div style={{ fontSize: 32, color: MUTE }}>২০২৬, প্রথম ছয় মাসে শুধু অনুদান</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: "white" }}>৬১.৫৬ কোটি টাকা</div></Card>
    </div>
    <Source text="ওয়েজ আর্নার্স কল্যাণ বোর্ড, প্রথম আলো" />
  </AbsoluteFill>
);
const C11: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tint="rgba(40,180,120,.16)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontFamily: BN, fontSize: 40, color: MUTE }}>অথচ তাঁদের পাঠানো টাকায়, অর্থবছর ২০২৫–২৬</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 230, color: "#5be0a0", lineHeight: 1.05 }}>${bn(T(f, 10, 90, 0, 35.5).toFixed(1))}<span style={{ fontSize: 110 }}> বিলিয়ন</span></div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 56, color: "white" }}>রেকর্ড রেমিট্যান্স</div>
      </AbsoluteFill>
      <Source text="বাংলাদেশ ব্যাংক, ডেইলি স্টার" />
    </AbsoluteFill>
  );
};
const C12: React.FC = () => (
  <AbsoluteFill>
    <Bg tint={BLUE} />
    <div style={{ position: "absolute", left: 160, right: 160, top: 210, display: "flex", flexDirection: "column", gap: 34 }}>
      <Card delay={10} style={{ borderLeft: `8px solid ${RED}`, padding: "30px 40px" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64 }}>“প্রতিবছর মৃত্যু বাড়ছে।”</div>
        <div style={{ fontSize: 34, color: PALE, marginTop: 8 }}>প্রতিটি মৃত্যুর কারণ খতিয়ে দেখার দাবি</div>
        <div style={{ fontSize: 30, color: MUTE, marginTop: 12 }}>— শরিফুল হাসান, প্রধান, ব্র্যাক অভিবাসন কর্মসূচি</div>
      </Card>
      <Card delay={220} style={{ borderLeft: `8px solid ${AMBER}`, padding: "30px 40px" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52 }}>মৃত্যুর কারণ যাচাইয়ে করণীয় ঠিক করা হবে</div>
        <div style={{ fontSize: 30, color: MUTE, marginTop: 12 }}>— প্রবাসীকল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রী</div>
      </Card>
    </div>
    <Source text="প্রথম আলো, ৬ অক্টোবর ২০২৬" />
  </AbsoluteFill>
);
const C13: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 12);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(90,140,190,.25)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: BN, color: "white", textAlign: "center" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 76, opacity: T(f, 0, 25) }}>প্রতিটি কফিন একটি পরিবারের গল্প</div>
        <Img src={staticFile("cob/logo-light.png")} style={{ width: 700, marginTop: 50, transform: `scale(${s})` }} />
        <div style={{ marginTop: 34, fontSize: 26, color: MUTE, opacity: T(f, 40, 60), lineHeight: 1.6 }}>তথ্যসূত্র: ওয়েজ আর্নার্স কল্যাণ বোর্ড, প্রথম আলো, ডেইলি স্টার, বাংলাদেশ ব্যাংক</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const VO = [310, 260, 456, 358, 353, 368, 399, 476, 387, 346, 228, 396, 238];
const SCENES = [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13];
const PAD = 16, LEAD = 8;
const starts: number[] = []; let acc = 0;
for (const v of VO) { starts.push(acc); acc += v + PAD + LEAD; }
export const CF_LEN = acc + 40;
export const CoffinReport: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: INK }}>
      {SCENES.map((S, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={VO[i] + PAD + LEAD + (i === SCENES.length - 1 ? 40 : 0)}>
          <Fade len={VO[i] + PAD + LEAD}><S /></Fade>
          <Sequence from={LEAD}><Audio src={staticFile(`cfvo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
        </Sequence>
      ))}
      <Bug />
      <Grain />
      <Audio src={staticFile("cfmusic.mp3")} volume={(f) => interpolate(f, [0, 30, durationInFrames - 70, durationInFrames], [0, 0.2, 0.2, 0], clamp)} loop />
      <Sfx at={starts[1]} src="sfx/boom.mp3" vol={0.45} />
      {[2, 4, 6, 9].map((i) => <Sfx key={i} at={starts[i]} src="sfx/whoosh.mp3" vol={0.3} />)}
    </AbsoluteFill>
  );
};
