// Colours of Bangladesh (COB) অনুসন্ধান — "বারে কেন তরুণীরা বেশি যায়?" (17 Oct 2026).
// Facts (credited on screen): DNC raids Gulshan Oct 2026 — Raw Canvas + Media Club 109 detained, no permits, released on bond
// (Khaborer Kantha 12 Oct, Daily Priyo Bangladesh, MZamin); Amari + 2 bars 13 Oct, 7 detained (Bangla Tribune); "German Club"
// (reg. 78 Resthouse Society) 244 L seized, no bar licence, key person absconding (bdnews24, Dhaka Tribune 16 Oct); bonded
// warehouses: 4 sealed, 2 approved, 144 cans/12 whisky/6 vodka listed as released (Prothom Alo, TBS, BSS, 2 Oct).
// Rules: Alcohol Control Rules 2022 (Dhaka Tribune/VOA Bangla). Prevalence: WHO SAFER country snapshot (2020 adults 8.0% M / 3.0% F,
// HED 1.9 / 0.4); school survey (n=424) boys 21.9% vs girls 8.4% ever-use. "Sugar daddy" = allegations in a legal notice
// (Dhaka Post, Jagonews24) — shown explicitly as unproven. Science: NIAAA (women & alcohol), NIMH/NIH (PFC maturation ~25),
// Gardner & Steinberg 2005 (peer presence and risk). No real person is named or shown; photos are AI and labelled.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { BN, bn, useSp } from "../news/NewsKit";
import { RED, RED2, INK, MUTE, AMBER, HEAD, T, Grain, Bg, Bug, Source, Card } from "./HoneyTrap";

export const GREEN = "#3ee08f", BLUE = "#3aa0ff";
export const n = (v: number, d = 0) => bn(d ? v.toFixed(d) : Math.round(v).toLocaleString("en-IN"));
export const S = (src: string, at: number, vol = 0.5) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={150}><Audio src={staticFile(src.includes("/") ? `barinv/${src}` : `barinv/sfx/${src}.mp3`)} volume={vol} /></Sequence>
);

// ---------- pieces ----------
export const AiTag: React.FC<{ text?: string }> = ({ text = "প্রতীকী ছবি · এআই দিয়ে তৈরি" }) => (
  <div style={{ position: "absolute", right: 48, top: 44, fontFamily: BN, fontWeight: 700, fontSize: 22, color: AMBER, border: `2px solid ${AMBER}`, padding: "3px 12px", borderRadius: 6, background: "rgba(0,0,0,.45)" }}>{text}</div>
);
export const Ken: React.FC<{ src: string; len: number; dim?: number; blur?: number; from?: number; to?: number; ox?: string }> = ({ src, len, dim = 0.55, blur = 0, from = 1.04, to = 1.16, ox = "50% 50%" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(`barinv/img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, len], [from, to])})`, transformOrigin: ox, filter: blur ? `blur(${blur}px)` : undefined }} />
      <AbsoluteFill style={{ background: `rgba(5,9,11,${dim})` }} />
    </AbsoluteFill>
  );
};
export const Head: React.FC<{ text: React.ReactNode; delay?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, delay = 0, size = 66, color = "white", style }) => {
  const s = useSp(delay, 15);
  return <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, color, lineHeight: 1.15, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, textShadow: "0 6px 30px rgba(0,0,0,.6)", ...style }}>{text}</div>;
};
export const Count: React.FC<{ v: number; at: number; dur?: number; size?: number; color?: string; d?: number; pre?: string; suf?: string }> = ({ v, at, dur = 45, size = 200, color = AMBER, d = 0, pre = "", suf = "" }) => {
  const f = useCurrentFrame();
  return <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{pre}{n(T(f, at, at + dur, 0, v), d)}{suf}</span>;
};
export const Stamp: React.FC<{ text: string; at: number; color?: string; x: number; y: number; rot?: number; size?: number }> = ({ text, at, color = RED2, x, y, rot = -8, size = 60 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: 30, config: { damping: 11, mass: 0.6 } });
  if (f < at) return null;
  return <div style={{ position: "absolute", left: x, top: y, fontFamily: HEAD, fontWeight: 800, fontSize: size, color, border: `6px solid ${color}`, padding: "4px 26px", borderRadius: 12, transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * s})`, opacity: Math.min(1, s * 1.4), background: "rgba(0,0,0,.35)", whiteSpace: "nowrap" }}>{text}</div>;
};
export const Police: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const on = f < len * 0.55;
  const a = on ? (Math.floor(f / 7) % 2 ? 1 : 0) : 0;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at 15% 20%, rgba(255,30,60,${0.38 * a}), transparent 65%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at 85% 20%, rgba(40,120,255,${0.38 * (on ? 1 - a : 0)}), transparent 65%)` }} />
    </AbsoluteFill>
  );
};
export const Type: React.FC<{ text: string; at: number; cps?: number; style?: React.CSSProperties }> = ({ text, at, cps = 1.2, style }) => {
  const f = useCurrentFrame();
  const chars = [...text];
  const k = Math.max(0, Math.min(chars.length, Math.floor((f - at) * cps)));
  return <span style={{ fontFamily: "Montserrat, Hind", fontWeight: 700, ...style }}>{chars.slice(0, k).join("")}<span style={{ opacity: f % 20 < 10 && k < chars.length ? 1 : 0 }}>▌</span></span>;
};
// subtitles: split the VO paragraph into sentence chunks, timed by length
export const Subs: React.FC<{ text: string; len: number }> = ({ text, len }) => {
  const f = useCurrentFrame();
  const parts = text.split(/(?<=[।?!])\s+/).flatMap((p) => {
    const w = p.split(" ");
    if (w.length <= 11) return [p];
    const out: string[] = [];
    for (let i = 0; i < w.length; i += 9) out.push(w.slice(i, i + 9).join(" "));
    return out;
  });
  const tot = parts.reduce((s, p) => s + p.length + 8, 0);
  let acc = 0;
  const cur = parts.find((p) => { const a = acc; acc += ((p.length + 8) / tot) * len; return f >= a && f < acc; }) || "";
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 112, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      {cur && <div key={cur} style={{ maxWidth: 1400, textAlign: "center", fontFamily: BN, fontWeight: 700, fontSize: 36, lineHeight: 1.35, color: "white", background: "rgba(0,0,0,.62)", padding: "8px 26px", borderRadius: 10, borderBottom: `3px solid ${RED}` }}>{cur}</div>}
    </div>
  );
};
export const Person: React.FC<{ color: string; size?: number }> = ({ color, size = 46 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 40 50"><circle cx="20" cy="12" r="9" fill={color} /><path d="M3 50c1-17 8-24 17-24s16 7 17 24z" fill={color} /></svg>
);

export type P = { len: number };

// 1 — cold open: the raid
const S1: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const fill = T(f, 150, 260);
  return (
    <AbsoluteFill>
      <Ken src="night" len={len} dim={0.45} from={1.18} to={1.04} ox="50% 30%" />
      <Police len={len} />
      <div style={{ position: "absolute", left: 100, top: 150 }}>
        <Type text="রাত ১১:০০  ·  গুলশান অ্যাভিনিউ" at={6} style={{ fontSize: 46, color: AMBER, letterSpacing: 0 }} />
      </div>
      <div style={{ position: "absolute", left: 100, top: 300, opacity: T(f, 140, 155) }}>
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 40, color: MUTE }}>দুটি বার থেকে আটক</div>
        <Count v={109} at={150} dur={60} size={260} color="white" />
        <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 80, color: "white" }}> জন</span>
        <div style={{ marginTop: 6, height: 10, width: 700, background: "rgba(255,255,255,.12)", borderRadius: 6 }}><div style={{ height: "100%", width: `${fill * 100}%`, background: RED, borderRadius: 6 }} /></div>
        <div style={{ marginTop: 18, fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white", opacity: T(f, 280, 295) }}>বৈধ পারমিট ছিল <span style={{ color: RED2 }}>কারও কাছেই না</span></div>
      </div>
      <Stamp text="মুচলেকায় মুক্ত" at={len * 0.82} x={1150} y={560} />
      <AiTag />
      <Source text="খবরের কণ্ঠ ১২ অক্টোবর · দৈনিক প্রিয় বাংলাদেশ · মানবজমিন (সংখ্যায় সূত্রভেদে অমিল)" />
      {S("sfx/boom.mp3", 2, 0.5)}{S("tick", 6, 0.35)}{S("hit", 150, 0.55)}{S("hit", len * 0.82, 0.6)}
    </AbsoluteFill>
  );
};

// 2 — title
const S2: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const s = useSp(2, 13);
  const qs = ["কেন বারবার অভিযান?", "বিল দেয় কে?", "বিজ্ঞান কী বলে?"];
  return (
    <AbsoluteFill>
      <Ken src="bar" len={len} dim={0.7} blur={6} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ transform: `scale(${s})`, display: "flex", alignItems: "center", gap: 18 }}>
          <Img src={staticFile("cob/logo-light.png")} style={{ height: 70 }} />
          <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 32, color: "white", background: RED, padding: "4px 18px", borderRadius: 6 }}>অনুসন্ধান</span>
        </div>
        <div style={{ marginTop: 40 }}>
          <Head size={130} delay={30} text={<>বারে কেন <span style={{ color: AMBER }}>তরুণীরা</span></>} />
          <Head size={130} delay={42} text={<>বেশি যায়<span style={{ color: RED2 }}>?</span></>} />
        </div>
        <div style={{ marginTop: 50, display: "flex", gap: 22 }}>
          {qs.map((q, i) => {
            const k = useSp(len * 0.5 + i * 30, 14);
            return <div key={q} style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: "white", border: "2px solid rgba(255,255,255,.25)", background: "rgba(0,0,0,.4)", padding: "8px 26px", borderRadius: 40, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>{q}</div>;
          })}
        </div>
      </AbsoluteFill>
      <AiTag />
      {S("sfx/whoosh.mp3", 28, 0.5)}{S("hit", 42, 0.45)}
      <div style={{ opacity: T(f, 0, 1) }} />
    </AbsoluteFill>
  );
};

// 3 — timeline of October raids
const S3: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const ev = [
    { d: "২ অক্টোবর", t: "শুল্কমুক্ত মদের গুদাম", k: "৪টি সিলগালা", sub: "অনুমোদন ছিল ২টির", c: AMBER },
    { d: "অক্টোবরের মাঝামাঝি", t: "র ক্যানভাস ও মিডিয়া ক্লাব", k: "১০৯ জন আটক", sub: "মুচলেকায় মুক্ত", c: RED2 },
    { d: "১৩ অক্টোবর", t: "পাঁচ তারকা হোটেলসহ ৩ বার", k: "৭ জন আটক", sub: "পারমিট ছাড়া মদ্যপান", c: RED2 },
    { d: "১৫ অক্টোবর রাত", t: "কথিত ‘জার্মান ক্লাব’", k: "২৪৪ লিটার জব্দ", sub: "বারের লাইসেন্স নেই", c: AMBER },
  ];
  const step = len / 4.6;
  const line = T(f, 20, len * 0.85);
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="অক্টোবর ২০২৬: দুই সপ্তাহে চার অভিযান" size={60} /></div>
      <div style={{ position: "absolute", left: 300, right: 300, top: 470, height: 6, background: "rgba(255,255,255,.12)", borderRadius: 4 }}>
        <div style={{ width: `${line * 100}%`, height: "100%", background: `linear-gradient(90deg, ${AMBER}, ${RED})`, borderRadius: 4, boxShadow: `0 0 20px ${RED}88` }} />
      </div>
      {ev.map((e, i) => {
        const at = 30 + i * step;
        const s = spring({ frame: f - at, fps: 30, config: { damping: 14 } });
        const x = 110 + i * 435;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 380, width: 380, opacity: s }}>
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 30, color: MUTE, height: 70, textAlign: "center" }}>{e.d}</div>
            <div style={{ position: "absolute", left: 173, top: 76, width: 34, height: 34, borderRadius: 99, background: e.c, transform: `scale(${s})`, boxShadow: `0 0 0 8px ${e.c}33` }} />
            <div style={{ marginTop: 70, padding: "22px 24px", borderRadius: 16, background: "rgba(14,23,28,.92)", border: "1px solid rgba(255,255,255,.12)", borderTop: `5px solid ${e.c}`, transform: `translateY(${(1 - s) * 50}px)` }}>
              <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 30, color: "white", lineHeight: 1.3 }}>{e.t}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: e.c, marginTop: 8, whiteSpace: "nowrap" }}>{e.k}</div>
              <div style={{ fontFamily: BN, fontSize: 26, color: MUTE }}>{e.sub}</div>
            </div>
          </div>
        );
      })}
      <Source text="প্রথম আলো · টিবিএস · বাসস · খবরের কণ্ঠ · বাংলা ট্রিবিউন · বিডিনিউজ২৪ · ঢাকা ট্রিবিউন" />
      {ev.map((_, i) => S("hit", 30 + i * step, 0.4))}
    </AbsoluteFill>
  );
};

// 4 — the law
const S4: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const rules = [
    { ic: "🔞", k: "বয়স কমপক্ষে ২১", sub: "এর কম বয়সে মদ্যপান নিষিদ্ধ" },
    { ic: "🪪", k: "সরকারি পারমিট বাধ্যতামূলক", sub: "সেবন, বহন, বিক্রি — আলাদা অনুমতি" },
    { ic: "🩺", k: "মুসলিমদের চিকিৎসকের সনদ", sub: "সহযোগী অধ্যাপক পদমর্যাদার" },
    { ic: "🕙", k: "বার খোলা রাত ১০টা পর্যন্ত", sub: "লেট-ক্লোজিং লাইসেন্সে রাত ২টা" },
  ];
  return (
    <AbsoluteFill>
      <Bg tint="rgba(255,176,32,.16)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="আইন কী বলে?" size={70} /><div style={{ fontFamily: BN, fontSize: 32, color: MUTE, marginTop: 6, opacity: T(f, 15, 30) }}>অ্যালকোহল নিয়ন্ত্রণ বিধিমালা, ২০২২ · মাদকদ্রব্য নিয়ন্ত্রণ আইন, ২০১৮</div></div>
      <div style={{ position: "absolute", left: 90, top: 285, width: 1100, transform: "scale(.9)", transformOrigin: "top left", display: "flex", flexDirection: "column", gap: 14 }}>
        {rules.map((r, i) => (
          <Card key={i} delay={len * 0.18 + i * len * 0.17} style={{ display: "flex", alignItems: "center", gap: 24, padding: "12px 26px" }}>
            <span style={{ fontSize: 48 }}>{r.ic}</span>
            <div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 42 }}>{r.k}</div><div style={{ fontSize: 26, color: MUTE }}>{r.sub}</div></div>
          </Card>
        ))}
      </div>
      <div style={{ position: "absolute", right: 150, top: 380, textAlign: "center", opacity: T(f, len * 0.18, len * 0.24) }}>
        <div style={{ width: 380, height: 380, borderRadius: 999, border: `14px solid ${AMBER}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${AMBER}44` }}>
          <Count v={21} at={len * 0.18} dur={40} size={210} />
        </div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: "white", marginTop: 20 }}>ন্যূনতম বয়স</div>
      </div>
      <Source text="অ্যালকোহল নিয়ন্ত্রণ বিধিমালা ২০২২ · ঢাকা ট্রিবিউন · ভয়েস অব আমেরিকা বাংলা" />
      {rules.map((_, i) => S("tick", len * 0.18 + i * len * 0.17, 0.4))}
    </AbsoluteFill>
  );
};

// 5 — the gap: legal bar, illegal customers
const S5: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const N = 60;
  const turn = (i: number) => len * 0.12 + ((i * 37) % N) * (len * 0.3 / N);
  return (
    <AbsoluteFill>
      <Ken src="bar" len={len} dim={0.78} blur={8} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>বার বৈধ, কিন্তু <span style={{ color: RED2 }}>গ্রাহক?</span></>} size={70} /></div>
      <div style={{ position: "absolute", left: 110, top: 300, width: 900, display: "flex", flexWrap: "wrap", gap: 10 }}>
        {Array.from({ length: N }).map((_, i) => {
          const red = f > turn(i);
          const s = spring({ frame: f - turn(i), fps: 30, config: { damping: 12 } });
          return <div key={i} style={{ transform: `scale(${red ? 0.9 + 0.1 * s : 1})` }}><Person color={red ? RED2 : "#4e636d"} size={56} /></div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 110, top: 760, fontFamily: BN, fontWeight: 600, fontSize: 26, color: AMBER, opacity: T(f, 10, 25) }}>প্রতীকী চিত্র · লাল = মদ্যপানের পারমিট নেই</div>
      <div style={{ position: "absolute", right: 110, top: 320, width: 640, display: "flex", flexDirection: "column", gap: 24 }}>
        <Card delay={len * 0.45} style={{ fontSize: 40, fontWeight: 700 }}>অভিযান মানেই <span style={{ color: AMBER }}>আটক করার মতো মানুষ</span></Card>
        <Card delay={len * 0.6} style={{ fontSize: 40, fontWeight: 700 }}>যেকোনো রাতে, যেকোনো বারে</Card>
      </div>
      <Stamp text="শেষটা মুচলেকায়" at={len * 0.8} x={1230} y={700} color={AMBER} rot={-6} />
      <AiTag />
      {S("glitch", len * 0.12, 0.3)}{S("hit", len * 0.8, 0.5)}
    </AbsoluteFill>
  );
};

// 6 — money trail
const S6: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const a = len * 0.05, b = len * 0.38, c = len * 0.72;
  const docS = useSp(a, 14), whS = useSp(b, 14);
  return (
    <AbsoluteFill>
      <Ken src={f < c ? "warehouse" : "cash"} len={len} dim={0.62} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="টাকার পথ" size={72} color={AMBER} /></div>
      {/* doc: German club */}
      <div style={{ position: "absolute", left: 90, top: 300, width: 760, padding: "30px 36px", background: "#efe9dc", color: "#1b1b1b", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,.6)", transform: `rotate(-2deg) translateY(${(1 - docS) * 80}px)`, opacity: docS * T(f, c - 10, c, 1, 0) }}>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 26, color: "#666" }}>কথিত ‘জার্মান ক্লাব’, গুলশান-২</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, marginTop: 14 }}>কাগজে নাম: রেস্টহাউস সোসাইটি</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, marginTop: 6 }}>বারের লাইসেন্স: <span style={{ color: RED }}>নেই</span></div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, marginTop: 6 }}>জব্দ: ২৪৪ লিটার মদ-বিয়ার</div>
      </div>
      {f < c - 10 && <Stamp text="অবৈধ" at={a + 60} x={560} y={300} color={RED} size={54} />}
      {/* warehouse ledger */}
      <div style={{ position: "absolute", right: 90, top: 300, width: 820, opacity: whS * T(f, c - 10, c, 1, 0), transform: `translateX(${(1 - whS) * 80}px)` }}>
        <Card delay={b} style={{ padding: "26px 32px" }}>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 30, color: MUTE }}>বন্ডেড গুদাম, গুলশান</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 10 }}>
            <div><div style={{ fontSize: 26, color: MUTE }}>অনুমোদিত</div><Count v={2} at={b + 10} dur={20} size={110} color={GREEN} /></div>
            <div style={{ fontSize: 60, color: MUTE }}>→</div>
            <div><div style={{ fontSize: 26, color: MUTE }}>পাওয়া গেছে</div><Count v={4} at={b + 30} dur={20} size={110} color={RED2} /></div>
          </div>
          <div style={{ marginTop: 16, padding: "14px 18px", background: "#0a1a12", borderRadius: 10, fontFamily: "Montserrat, Hind", fontSize: 26, color: GREEN, opacity: T(f, b + 60, b + 75) }}>সফটওয়্যার: ✔ ছাড় হয়ে গেছে</div>
          <div style={{ marginTop: 10, fontFamily: BN, fontWeight: 700, fontSize: 30, color: AMBER, opacity: T(f, b + 90, b + 105) }}>অথচ গুদামে: ১৪৪ ক্যান বিয়ার · ১২ বোতল হুইস্কি · ৬ বোতল ভদকা</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", opacity: T(f, c, c + 15) }}>
        <Head text="নগদ লেনদেন" delay={c} size={110} />
        <Head text={<>খাতায় নেই <span style={{ color: RED2 }}>এক টাকাও</span></>} delay={c + 25} size={80} color={AMBER} />
      </div>
      <AiTag />
      <Source text="বিডিনিউজ২৪ · ঢাকা ট্রিবিউন ১৬ অক্টোবর · প্রথম আলো · টিবিএস · বাসস (২ অক্টোবর)" />
      {S("hit", a + 60, 0.5)}{S("tick", b + 10, 0.4)}{S("tick", b + 30, 0.4)}{S("coins", c, 0.45)}
    </AbsoluteFill>
  );
};

// 7 — perception: the headlines
const S7: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const hs = ["গুলশানের বারে অভিযান, শতাধিক নারী আটক", "মধ্যরাতে বারে অভিযান, আটক তরুণ-তরুণী", "অভিজাত বারে অভিযান, বহু তরুণী আটক"];
  const z = interpolate(f, [len * 0.55, len], [1, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Ken src="city" len={len} dim={0.5} from={1.05} to={1.2} ox="45% 40%" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="শিরোনামে যা দেখি" size={66} /></div>
      <div style={{ position: "absolute", left: 90, top: 290, display: "flex", flexDirection: "column", gap: 18 }}>
        {hs.map((h, i) => {
          const s = useSp(len * 0.12 + i * 30, 14);
          return <div key={h} style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: "#111", background: "#f2efe7", padding: "12px 24px", borderLeft: `10px solid ${RED}`, transform: `translateX(${(1 - s) * -200}px) rotate(${i % 2 ? 1 : -1}deg)`, opacity: s, width: "fit-content" }}>{h}</div>;
        })}
        <div style={{ fontFamily: BN, fontSize: 24, color: AMBER, opacity: T(f, 20, 30) }}>শিরোনামের ধরন · একাধিক সংবাদমাধ্যম</div>
      </div>
      {/* camera viewfinder */}
      <div style={{ position: "absolute", left: 1080, top: 300, width: 700, height: 460, opacity: T(f, len * 0.45, len * 0.55), transform: `scale(${z})` }}>
        {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x ? undefined : 0, right: x ? 0 : undefined, top: y ? undefined : 0, bottom: y ? 0 : undefined, width: 70, height: 70, borderLeft: x ? undefined : "6px solid white", borderRight: x ? "6px solid white" : undefined, borderTop: y ? undefined : "6px solid white", borderBottom: y ? "6px solid white" : undefined }} />
        ))}
        <div style={{ position: "absolute", left: 24, top: 18, fontFamily: "Montserrat", fontWeight: 700, fontSize: 28, color: RED2, opacity: f % 30 < 18 ? 1 : 0.2 }}>● REC</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white" }}>ক্যামেরাও ঘোরে তাদের দিকেই</div>
      </div>
      <AiTag />
      {S("sfx/whoosh.mp3", len * 0.12, 0.35)}{S("sfx/whoosh.mp3", len * 0.12 + 30, 0.35)}{S("sfx/whoosh.mp3", len * 0.12 + 60, 0.35)}
    </AbsoluteFill>
  );
};

// 8 — the data twist
export const Bar2: React.FC<{ label: string; m: number; w: number; at: number; max: number; d?: number }> = ({ label, m, w, at, max, d = 1 }) => {
  const f = useCurrentFrame();
  const p = T(f, at, at + 40);
  const row = (k: string, v: number, c: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
      <span style={{ width: 110, fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white" }}>{k}</span>
      <div style={{ flex: 1, height: 36, background: "rgba(255,255,255,.07)", borderRadius: 10 }}><div style={{ width: `${(v / max) * 100 * p}%`, height: "100%", background: c, borderRadius: 10 }} /></div>
      <span style={{ width: 150, fontFamily: HEAD, fontWeight: 800, fontSize: 42, color: c }}>{n(v * p, d)}%</span>
    </div>
  );
  return (
    <div style={{ opacity: T(f, at - 10, at) }}>
      <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 32, color: MUTE }}>{label}</div>
      {row("পুরুষ", m, BLUE)}{row("নারী", w, AMBER)}
    </div>
  );
};
const S8: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const end = len * 0.84;
  return (
    <AbsoluteFill>
      <Bg tint="rgba(58,160,255,.18)" />
      <div style={{ position: "absolute", left: 90, top: 140, opacity: T(f, end - 10, end, 1, 0) }}><Head text="কিন্তু তথ্য কী বলে?" size={66} /></div>
      <div style={{ position: "absolute", left: 90, top: 250, width: 1200, transform: "scale(.82)", transformOrigin: "top left", display: "flex", flexDirection: "column", gap: 18, opacity: T(f, end - 10, end, 1, 0) }}>
        <Bar2 label="প্রাপ্তবয়স্কদের মদ্যপান (WHO, ২০২০)" m={8.0} w={3.0} at={len * 0.1} max={10} />
        <Bar2 label="অতিরিক্ত মদ্যপান (WHO, ২০২০)" m={1.9} w={0.4} at={len * 0.32} max={10} />
        <Bar2 label="স্কুল শিক্ষার্থী · কখনো খেয়েছে (জরিপ, n=৪২৪)" m={21.9} w={8.4} at={len * 0.55} max={25} />
      </div>
      <div style={{ position: "absolute", right: 110, top: 330, textAlign: "center", opacity: T(f, len * 0.6, len * 0.66) * T(f, end - 10, end, 1, 0) }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 170, color: BLUE }}>~২.৬×</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white" }}>ছেলেদের হার মেয়েদের চেয়ে</div>
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: T(f, end, end + 12) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 50, fontFamily: HEAD, fontWeight: 800, fontSize: 96, color: "white" }}>
          <span>বেশি দেখা</span><span style={{ color: RED2, fontSize: 140 }}>≠</span><span style={{ color: AMBER }}>বেশি খাওয়া</span>
        </div>
      </AbsoluteFill>
      <Source text="WHO SAFER কান্ট্রি স্ন্যাপশট: বাংলাদেশ · বাংলাদেশের উচ্চবিদ্যালয় শিক্ষার্থীদের ওপর জরিপ" />
      {S("tick", len * 0.1, 0.4)}{S("tick", len * 0.32, 0.4)}{S("tick", len * 0.55, 0.4)}{S("hit", end, 0.6)}
    </AbsoluteFill>
  );
};

// 9 — why so visible in bars
const S9: React.FC<P> = ({ len }) => {
  const rs = [
    { ic: "🌃", k: "রাতে নিরাপদ আড্ডার জায়গা কম", sub: "বার-লাউঞ্জ হয়ে উঠছে মিলনস্থল", c: BLUE },
    { ic: "📱", k: "নাইটলাইফ = স্ট্যাটাস", sub: "সোশ্যাল মিডিয়ার চাপ", c: "#a46bff" },
    { ic: "💳", k: "বিলটা দিতে হয় না", sub: "অনেক সময় অন্য কেউ দেন", c: AMBER },
  ];
  return (
    <AbsoluteFill>
      <Ken src="city" len={len} dim={0.72} blur={5} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>তাহলে বারে তরুণীদের <span style={{ color: AMBER }}>এত ভিড় কেন?</span></>} size={64} /></div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 340, display: "flex", gap: 30 }}>
        {rs.map((r, i) => (
          <Card key={i} delay={len * 0.2 + i * len * 0.22} style={{ flex: 1, padding: "34px 30px", borderTop: `6px solid ${r.c}`, ...(i === 2 ? { boxShadow: `0 0 60px ${AMBER}55` } : {}) }}>
            <div style={{ fontSize: 80 }}>{r.ic}</div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 46, marginTop: 10, lineHeight: 1.2 }}>{r.k}</div>
            <div style={{ fontSize: 30, color: MUTE, marginTop: 8 }}>{r.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{ position: "absolute", left: 90, bottom: 210, fontFamily: BN, fontSize: 26, color: AMBER }}>সম্ভাব্য কারণ · COB বিশ্লেষণ</div>
      <AiTag />
      {rs.map((_, i) => S("sfx/whoosh.mp3", len * 0.2 + i * len * 0.22, 0.35))}
    </AbsoluteFill>
  );
};

// 10 — the "sugar daddy" allegation, checked
const S10: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const lines = ["নগদ টাকা", "দামি মোবাইল", "বিদেশ ভ্রমণ, ফ্ল্যাট", "অনেক অর্থের বৈধ উৎস নেই"];
  const chk = len * 0.62;
  const verdict = [
    { k: "অভিযোগ উঠেছে", ok: true },
    { k: "বারের সঙ্গে যোগসূত্রের তদন্ত", ok: false },
    { k: "আদালতের রায়", ok: false },
  ];
  return (
    <AbsoluteFill>
      <Ken src="cash" len={len} dim={0.74} blur={3} />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>তথাকথিত <span style={{ color: AMBER }}>‘সুগার ড্যাডি’</span></>} size={70} /></div>
      <div style={{ position: "absolute", left: 90, top: 290, width: 800, padding: "34px 40px", background: "#efe9dc", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,.6)", transform: `rotate(-1.5deg)`, opacity: T(f, 10, 25) }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: "#1b1b1b" }}>আইনি নোটিশে অভিযোগ</div>
        <div style={{ height: 3, background: "#1b1b1b", margin: "12px 0 16px", opacity: 0.6 }} />
        {lines.map((l, i) => {
          const at = len * 0.14 + i * len * 0.07;
          const hl = T(f, at, at + 14);
          return <div key={l} style={{ fontFamily: BN, fontWeight: 700, fontSize: 38, color: "#1b1b1b", marginTop: 8, backgroundImage: `linear-gradient(90deg, ${i === 3 ? "#ff6b7a" : "#ffd25e"} ${hl * 100}%, transparent ${hl * 100}%)`, width: "fit-content", padding: "0 8px" }}>• {l}</div>;
        })}
      </div>
      <div style={{ position: "absolute", right: 110, top: 300, width: 760, display: "flex", flexDirection: "column", gap: 18 }}>
        {verdict.map((v, i) => {
          const s = useSp(chk + i * 25, 14);
          return (
            <div key={v.k} style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white", background: "rgba(14,23,28,.92)", padding: "18px 26px", borderRadius: 14, opacity: s, transform: `translateX(${(1 - s) * 80}px)` }}>
              <span style={{ fontSize: 48, color: v.ok ? GREEN : RED2 }}>{v.ok ? "✔" : "✖"}</span>{v.k}
            </div>
          );
        })}
      </div>
      <Stamp text="প্রমাণিত নয়" at={chk + 100} x={1180} y={680} color={RED2} />
      <AiTag />
      <Source text="ঢাকা পোস্ট · জাগো নিউজ২৪ · ইত্তেফাক (আইনি নোটিশের বক্তব্য)" />
      {lines.map((_, i) => S("tick", len * 0.14 + i * len * 0.07, 0.3))}{S("hit", chk + 100, 0.55)}
    </AbsoluteFill>
  );
};

// 11 — control + women's biology
export const Body: React.FC<{ color: string; fill: number; label: string; bac: number; at: number }> = ({ color, fill, label, bac, at }) => {
  const f = useCurrentFrame();
  const p = T(f, at, at + 50);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 200, height: 380 }}>
        <svg width="200" height="380" viewBox="0 0 40 76" style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><clipPath id={`b${label}`}><circle cx="20" cy="9" r="8" /><path d="M6 76 L8 30 Q20 18 32 30 L34 76z" /></clipPath></defs>
          <g clipPath={`url(#b${label})`}>
            <rect width="40" height="76" fill="#22313a" />
            <rect y={76 - 76 * fill * p} width="40" height={76 * fill * p} fill={color} opacity=".85" />
          </g>
        </svg>
      </div>
      <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white", marginTop: 12 }}>{label}</div>
      <div style={{ fontFamily: BN, fontSize: 26, color: MUTE }}>রক্তে অ্যালকোহল</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, color }}>{bac > 1 ? "বেশি" : "কম"}</div>
    </div>
  );
};
const S11: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const b = len * 0.36;
  const tilt = T(f, 30, 80, 0, -14);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.18)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text={<>বিল যার, <span style={{ color: AMBER }}>নিয়ন্ত্রণ তার</span></>} size={64} /></div>
      {/* scale */}
      <div style={{ position: "absolute", left: 160, top: 330, width: 620, height: 420, opacity: T(f, b - 10, b, 1, 0.25) }}>
        <div style={{ position: "absolute", left: 300, top: 60, width: 20, height: 320, background: "#4e636d", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 10, top: 60, width: 600, height: 14, background: "#9fb0b8", borderRadius: 8, transform: `rotate(${tilt}deg)` }}>
          <div style={{ position: "absolute", left: -10, top: 20, fontSize: 90 }}>💰</div>
          <div style={{ position: "absolute", right: -10, top: 20, fontSize: 90 }}>🍸</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 260, fontFamily: BN, fontWeight: 700, fontSize: 32, color: "white", opacity: T(f, 70, 85) }}>কতটা খাওয়া, কখন ফেরা — সিদ্ধান্তও</div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 280, display: "flex", gap: 70, opacity: T(f, b, b + 15) }}>
        <Body label="পুরুষ" color={BLUE} fill={0.45} bac={0.8} at={b + 20} />
        <Body label="নারী" color={RED2} fill={0.75} bac={1.4} at={b + 20} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 220, fontFamily: BN, fontWeight: 700, fontSize: 32, color: AMBER, opacity: T(f, b, b + 15) }}>একই গ্লাস, একই পরিমাণ</div>
      <div style={{ position: "absolute", left: 160, top: 800, display: "flex", gap: 20, opacity: T(f, len * 0.6, len * 0.66) }}>
        {["শরীরে পানির ভাগ কম", "অ্যালকোহল ভাঙার এনজাইম কম", "লিভার-হৃদযন্ত্রের ক্ষতি দ্রুত"].map((t, i) => (
          <div key={t} style={{ fontFamily: BN, fontWeight: 700, fontSize: 30, color: "white", background: "rgba(224,20,43,.25)", border: `1px solid ${RED2}`, padding: "10px 20px", borderRadius: 30, opacity: T(f, len * 0.6 + i * 25, len * 0.6 + i * 25 + 12) }}>{t}</div>
        ))}
      </div>
      <Source text="NIAAA (যুক্তরাষ্ট্রের জাতীয় অ্যালকোহল অপব্যবহার ও আসক্তি গবেষণা প্রতিষ্ঠান) · প্রতীকী চিত্র" />
      {S("sfx/whoosh.mp3", b, 0.35)}
    </AbsoluteFill>
  );
};

// 12 — the young brain
const S12: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const pfc = T(f, len * 0.08, len * 0.3);
  const dop = T(f, len * 0.3, len * 0.55);
  const peer = len * 0.58, stress = len * 0.78;
  const curve = "M0 220 C 120 210, 200 40, 300 30 S 480 120, 600 170";
  return (
    <AbsoluteFill>
      <Bg tint="rgba(164,107,255,.2)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="তরুণ মস্তিষ্কের রসায়ন" size={64} /></div>
      {/* brain */}
      <svg width="640" height="460" viewBox="0 0 320 230" style={{ position: "absolute", left: 120, top: 280 }}>
        <path d="M60 170 C20 160 10 110 40 85 C35 45 80 20 115 35 C135 10 190 10 205 35 C245 25 290 55 280 100 C305 125 290 175 245 175 C230 200 190 205 170 190 C150 210 100 205 90 185 C75 190 62 182 60 170Z" fill="#1d2a31" stroke="#5c7380" strokeWidth="3" />
        <path d="M40 85 C35 45 80 20 115 35 C100 60 95 90 105 120 C80 125 55 110 40 85Z" fill={`rgba(255,176,32,${0.15 + 0.7 * pfc * (0.75 + 0.25 * Math.sin(f / 6))})`} />
        <circle cx="175" cy="120" r={14 + 6 * dop} fill={`rgba(255,77,94,${0.2 + 0.7 * dop})`} />
        <text x="45" y="225" fontSize="16" fill={AMBER} fontFamily="Hind" fontWeight="700" opacity={pfc}>প্রিফ্রন্টাল কর্টেক্স</text>
        <text x="165" y="225" fontSize="16" fill={RED2} fontFamily="Hind" fontWeight="700" opacity={dop}>পুরস্কার ব্যবস্থা</text>
      </svg>
      <div style={{ position: "absolute", left: 140, top: 760, fontFamily: BN, fontWeight: 700, fontSize: 38, color: "white", opacity: pfc }}>ঝুঁকি বিচারের অংশ পরিণত হয় <span style={{ color: AMBER, fontFamily: HEAD, fontSize: 56 }}>~২৫</span> বছরে</div>
      {/* dopamine curve */}
      <div style={{ position: "absolute", right: 120, top: 290, width: 640, opacity: T(f, len * 0.3, len * 0.36) * T(f, peer - 10, peer, 1, 0.2) }}>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 32, color: RED2, marginBottom: 10 }}>ডোপামিনের সাড়া · বয়সভেদে</div>
        <svg width="640" height="260" viewBox="0 0 600 240">
          <path d={curve} fill="none" stroke={RED2} strokeWidth="8" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - dop)} />
          <line x1="0" y1="236" x2="600" y2="236" stroke="#4e636d" strokeWidth="3" />
          <text x="0" y="232" fontSize="22" fill={MUTE} fontFamily="Hind">শৈশব</text><text x="250" y="232" fontSize="22" fill="white" fontFamily="Hind" fontWeight="700">কৈশোর-তারুণ্য</text><text x="520" y="232" fontSize="22" fill={MUTE} fontFamily="Hind">প্রাপ্তবয়স</text>
        </svg>
      </div>
      <div style={{ position: "absolute", right: 120, top: 640, width: 640, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card delay={peer} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}><span style={{ fontSize: 50 }}>👥</span>বন্ধু পাশে থাকলে ঝুঁকি নেওয়া বাড়ে</Card>
        <Card delay={stress} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}><span style={{ fontSize: 50 }}>😮‍💨</span>চাপ, একাকীত্ব ভুলে থাকার চেষ্টা</Card>
      </div>
      <div style={{ position: "absolute", left: 140, top: 820, fontFamily: BN, fontSize: 24, color: AMBER }}>প্রতীকী চিত্র</div>
      <Source text="NIH/NIMH (মস্তিষ্কের বিকাশ) · গার্ডনার ও স্টেইনবার্গ, ২০০৫ (সমবয়সী প্রভাব ও ঝুঁকি)" />
      {S("tick", len * 0.08, 0.35)}{S("tick", len * 0.3, 0.35)}{S("sfx/whoosh.mp3", peer, 0.3)}{S("sfx/whoosh.mp3", stress, 0.3)}
    </AbsoluteFill>
  );
};

// 13 — the full picture (flow)
const S13: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const nodes = [
    { k: "গুদাম ও সীমান্ত", ic: "📦", c: AMBER },
    { k: "লাইসেন্সহীন বার", ic: "🍸", c: AMBER },
    { k: "নগদ লেনদেন", ic: "💵", c: AMBER },
    { k: "গ্রাহক", ic: "🧍", c: RED2 },
  ];
  const step = len * 0.13;
  const cust = len * 0.55, boss = len * 0.72;
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="পুরো ছবিটা" size={66} /></div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 340, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {nodes.map((nd, i) => {
          const at = 20 + i * step;
          const s = spring({ frame: f - at, fps: 30, config: { damping: 13 } });
          return (
            <React.Fragment key={i}>
              <div style={{ width: 330, textAlign: "center", padding: "28px 16px", borderRadius: 18, background: "rgba(14,23,28,.92)", border: `2px solid ${nd.c}`, opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>
                <div style={{ fontSize: 80 }}>{nd.ic}</div>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: "white" }}>{nd.k}</div>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 6, margin: "0 10px", background: "rgba(255,255,255,.1)" }}><div style={{ width: `${T(f, at + 10, at + step) * 100}%`, height: "100%", background: AMBER }} /></div>}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 90, top: 600, width: 420, textAlign: "center", opacity: T(f, cust, cust + 12) }}>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: RED2 }}>ধরা পড়েন → মুচলেকায় মুক্ত</div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 640, display: "flex", alignItems: "center", gap: 30, opacity: T(f, boss, boss + 15) }}>
        <div style={{ filter: `blur(${T(f, boss, boss + 40, 0, 6)}px)` }}><Person color="#2a3840" size={150} /></div>
        <div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, color: "white" }}>মূল হোতা?</div>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: AMBER }}>থেকে যান আড়ালে · জার্মান ক্লাবের মূল ব্যক্তি পলাতক</div>
        </div>
      </div>
      <Source text="বিডিনিউজ২৪, ঢাকা ট্রিবিউন ১৬ অক্টোবর ২০২৬ · প্রতীকী চিত্র" />
      {nodes.map((_, i) => S("tick", 20 + i * step, 0.35))}{S("glitch", boss, 0.4)}
    </AbsoluteFill>
  );
};

// 14 — solutions
const S14: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const items = ["বন্ডেড গুদামের প্রতিটি বোতল ডিজিটাল ট্র্যাকিংয়ে", "অভিযানের লক্ষ্য সরবরাহকারী, শুধু গ্রাহক নয়", "তরুণদের নিরাপদ বিনোদন ও মানসিক স্বাস্থ্যসেবা", "নিজের সিদ্ধান্ত নিজের হাতে · গ্লাস চোখের আড়াল নয়"];
  return (
    <AbsoluteFill>
      <Bg tint="rgba(62,224,143,.16)" />
      <div style={{ position: "absolute", left: 90, top: 140 }}><Head text="সমাধান কী?" size={70} color={GREEN} /></div>
      <div style={{ position: "absolute", left: 90, top: 300, width: 1500, display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map((t, i) => {
          const at = len * 0.06 + i * len * 0.21;
          const s = useSp(at, 14);
          const tick = spring({ frame: f - at - 18, fps: 30, config: { damping: 10 } });
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 26, opacity: s, transform: `translateX(${(1 - s) * -80}px)` }}>
              <div style={{ width: 70, height: 70, borderRadius: 16, border: `4px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: GREEN }}><span style={{ transform: `scale(${tick})` }}>✔</span></div>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: i === 3 ? AMBER : "white" }}>{t}</div>
            </div>
          );
        })}
      </div>
      {items.map((_, i) => S("tick", len * 0.06 + i * len * 0.21 + 18, 0.4))}
    </AbsoluteFill>
  );
};

// 15 — close
const S15: React.FC<P> = ({ len }) => {
  const f = useCurrentFrame();
  const s = useSp(len * 0.55, 13);
  return (
    <AbsoluteFill>
      <Ken src="night" len={len} dim={0.7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <Head text="মদ আসছে কোথা থেকে?" size={96} delay={len * 0.15} />
        <Head text={<>টাকাটা যাচ্ছে <span style={{ color: AMBER }}>কোথায়?</span></>} size={96} delay={len * 0.25} />
        <div style={{ marginTop: 50, transform: `scale(${s})`, display: "flex", alignItems: "center", gap: 22 }}>
          <Img src={staticFile("cob/logo-round.png")} style={{ height: 150 }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: "white" }}>কালারস অব বাংলাদেশ</div>
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 32, color: "white", background: RED, padding: "4px 18px", borderRadius: 6, display: "inline-block", marginTop: 6 }}>সাবস্ক্রাইব করুন · কমেন্টে মত দিন</div>
          </div>
        </div>
        <div style={{ marginTop: 40, fontFamily: BN, fontSize: 22, color: MUTE, maxWidth: 1600, opacity: T(f, len * 0.6, len * 0.7) }}>সূত্র: প্রথম আলো, টিবিএস, বাসস, বিডিনিউজ২৪, ঢাকা ট্রিবিউন, খবরের কণ্ঠ, বাংলা ট্রিবিউন, মানবজমিন, ঢাকা পোস্ট, জাগো নিউজ২৪, WHO, NIAAA, NIH · ছবি: প্রতীকী, এআই দিয়ে তৈরি</div>
      </AbsoluteFill>
      {S("sfx/boom.mp3", len * 0.15, 0.4)}
    </AbsoluteFill>
  );
};

export { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15 };
