// Colours of Bangladesh — অনুসন্ধান: "প্রেমের ফাঁদ, টার্গেট প্রবাসী" (12 Oct 2026).
// Real cases only from published national reporting (credited on screen): Prothom Alo 8 Oct 2026 (Natore, Lalpur),
// BSS/ITV 6 Jul 2026 (DB, Khilgaon), Ittefaq 6 May 2026 (Narsingdi), Dhaka Post (fake female IDs targeting expatriates).
// "ছন্দ" is an explicitly labelled fictional composite; no real person, photo or app is named or shown.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BN, bn, clamp, ease, useSp, Sfx } from "../news/NewsKit";

export const RED = "#e0142b", RED2 = "#ff4d5e", INK = "#0b1114", CHAR = "#17272f", MUTE = "#9fb0b8", AMBER = "#ffb020";
export const HEAD = "Anek";
if (typeof document !== "undefined") {
  const ff = new FontFace("Anek", `url(${staticFile("fonts/AnekBangla.ttf")})`, { weight: "100 900" });
  ff.load().then(() => document.fonts.add(ff)).catch(() => {});
}
export const T = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { ...clamp, easing: ease });

// ---------- shared pieces ----------
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.65))" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
    </AbsoluteFill>
  );
};
export const Bg: React.FC<{ tint?: string }> = ({ tint = "rgba(224,20,43,.22)" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1100px 700px at ${70 + Math.sin(f / 90) * 6}% 30%, ${tint}, transparent 62%), linear-gradient(160deg, #142229, ${INK} 70%)` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "64px 64px", transform: `translateY(${(f * 0.4) % 64}px)` }} />
    </AbsoluteFill>
  );
};
export const Bug: React.FC = () => (
  <div style={{ position: "absolute", left: 48, top: 40, display: "flex", alignItems: "center", gap: 18 }}>
    <Img src={staticFile("cob/logo-light.png")} style={{ height: 52 }} />
    <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 24, color: "white", background: RED, padding: "4px 14px", borderRadius: 4 }}>অনুসন্ধান</span>
  </div>
);
export const Label: React.FC<{ step?: string; title: string; delay?: number }> = ({ step, title, delay = 4 }) => {
  const s = useSp(delay, 16);
  return (
    <div style={{ position: "absolute", left: 90, top: 150, display: "flex", alignItems: "center", gap: 18, opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
      {step && <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 28, color: INK, background: AMBER, padding: "4px 16px", borderRadius: 6 }}>{step}</span>}
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: "white" }}>{title}</span>
    </div>
  );
};
const Fiction: React.FC = () => (
  <div style={{ position: "absolute", right: 48, top: 44, fontFamily: BN, fontWeight: 700, fontSize: 24, color: AMBER, border: `2px solid ${AMBER}`, padding: "4px 14px", borderRadius: 6, background: "rgba(0,0,0,.4)" }}>কাল্পনিক উদাহরণ</div>
);
export const Source: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", right: 48, bottom: 44, fontFamily: BN, fontWeight: 600, fontSize: 24, color: "rgba(255,255,255,.75)", background: "rgba(0,0,0,.45)", padding: "6px 16px", borderRadius: 6, borderLeft: `4px solid ${RED}` }}>সূত্র: {text}</div>
);

// phone + chat
type Msg = { at: number; me?: boolean; text: string; money?: boolean };
const Phone: React.FC<{ msgs: Msg[]; name?: string; x?: number; y?: number; scale?: number; header?: string }> = ({ msgs, name = "ছন্দ", x = 1180, y = 120, scale = 1, header = "অনলাইন" }) => {
  const f = useCurrentFrame();
  const shown = msgs.filter((m) => f >= m.at);
  const enter = useSp(0, 18);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 460, height: 860, borderRadius: 54, background: "#05080a", border: "10px solid #1e2a30", boxShadow: "0 50px 120px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.06)", overflow: "hidden", transform: `scale(${scale}) translateY(${(1 - enter) * 120}px)`, opacity: enter, transformOrigin: "top left" }}>
      <div style={{ height: 120, background: "#121b20", display: "flex", alignItems: "flex-end", gap: 14, padding: "0 22px 16px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 99, background: "linear-gradient(140deg,#ff8aa0,#7a3a8a)", filter: "blur(2px)" }} />
        <div style={{ fontFamily: BN, color: "white" }}><div style={{ fontWeight: 700, fontSize: 26 }}>{name}</div><div style={{ fontSize: 18, color: "#6fdc8c" }}>{header}</div></div>
      </div>
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, bottom: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, padding: "0 18px" }}>
        {shown.slice(-7).map((m) => {
          const s = spring({ frame: f - m.at, fps: 30, config: { damping: 14 } });
          return (
            <div key={m.at + m.text} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "82%", fontFamily: BN, fontWeight: 600, fontSize: 25, lineHeight: 1.35, color: m.money ? INK : "white", background: m.money ? AMBER : m.me ? "#1f6f4a" : "#26343b", padding: "12px 18px", borderRadius: 20, borderBottomLeftRadius: m.me ? 20 : 4, borderBottomRightRadius: m.me ? 4 : 20, transform: `scale(${s})`, transformOrigin: m.me ? "right bottom" : "left bottom" }}>{m.text}</div>
          );
        })}
      </div>
    </div>
  );
};
const Silhouette: React.FC<{ size?: number; color?: string; q?: boolean }> = ({ size = 260, color = "#2b3a42", q }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="#0e171c" />
    <circle cx="50" cy="38" r="17" fill={color} />
    <path d="M18 92c2-20 16-30 32-30s30 10 32 30z" fill={color} />
    {q && <text x="50" y="47" textAnchor="middle" fontSize="22" fontWeight="700" fill={RED2} fontFamily="Arial">?</text>}
  </svg>
);
export const Money: React.FC<{ to: number; from?: number; at: number; dur?: number; size?: number; color?: string }> = ({ to, from = 0, at, dur = 60, size = 120, color = AMBER }) => {
  const f = useCurrentFrame();
  const v = Math.round(T(f, at, at + dur, from, to));
  return <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, color, fontVariantNumeric: "tabular-nums" }}>৳{bn(v.toLocaleString("en-IN"))}</span>;
};
export const Card: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const s = useSp(delay, 15);
  return <div style={{ padding: "20px 28px", borderRadius: 16, background: "rgba(14,23,28,.92)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.45)", fontFamily: BN, color: "white", opacity: s, transform: `translateY(${(1 - s) * 50}px)`, ...style }}>{children}</div>;
};

// BD map with a pin
type Geo = { w: number; h: number; d: { s: string; p: string; cx: number; cy: number }[] };
export const useGeo = () => {
  const [g, setG] = React.useState<Geo | null>(null);
  React.useEffect(() => { fetch(staticFile("ht/bd-map.json")).then((r) => r.json()).then(setG); }, []);
  return g;
};
export const MapPin: React.FC<{ geo: Geo | null; slug: string; x?: number; y?: number; h?: number }> = ({ geo, slug, x = 120, y = 220, h = 760 }) => {
  const f = useCurrentFrame();
  if (!geo) return null;
  const k = h / geo.h, t = geo.d.find((d) => d.s === slug)!;
  const draw = T(f, 0, 40);
  return (
    <svg style={{ position: "absolute", left: x, top: y }} width={geo.w * k} height={h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
      {geo.d.map((d) => <path key={d.s} d={d.p} fill={d.s === slug ? RED : "rgba(255,255,255,.08)"} stroke="rgba(255,255,255,.25)" strokeWidth={0.8} opacity={d.s === slug ? 1 : draw} />)}
      <circle cx={t.cx} cy={t.cy} r={10 + ((f % 40) / 40) * 30} fill="none" stroke={RED2} strokeWidth={3} opacity={1 - (f % 40) / 40} />
      <circle cx={t.cx} cy={t.cy} r={9} fill="white" stroke={RED} strokeWidth={4} />
    </svg>
  );
};
const CaseHead: React.FC<{ n: string; place: string; delay?: number }> = ({ n, place, delay = 6 }) => {
  const s = useSp(delay, 14);
  return (
    <div style={{ opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 26, letterSpacing: 6, color: RED2 }}>CASE FILE {n}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 76, color: "white", lineHeight: 1.1 }}>{place}</div>
    </div>
  );
};
const Fact: React.FC<{ delay: number; k: string; v: React.ReactNode }> = ({ delay, k, v }) => {
  const s = useSp(delay, 16);
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 18, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.1)", opacity: s, transform: `translateX(${(1 - s) * 40}px)` }}>
      <span style={{ width: 14, height: 14, background: RED, borderRadius: 3, flex: "none", transform: "translateY(-4px)" }} />
      <span style={{ fontFamily: BN, fontSize: 30, color: MUTE, minWidth: 210 }}>{k}</span>
      <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: "white" }}>{v}</span>
    </div>
  );
};

// ---------- scenes ----------
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = T(f, 300, 330);
  const glitch = f > 296 && f < 316 ? Math.sin(f * 7) * 14 : 0;
  return (
    <AbsoluteFill>
      <Bg />
      <Phone x={170} y={110} name="প্রিয়তমা" msgs={[
        { at: 10, text: "তোমাকে ছাড়া থাকতে পারি না" }, { at: 40, me: true, text: "আমিও ❤️" }, { at: 75, text: "চলো বিয়ে করে ফেলি" },
        { at: 120, me: true, text: "ভিডিও কলে আসো একবার" }, { at: 150, text: "সামনের ক্যামেরা নষ্ট 😔" }, { at: 190, text: "জমি কেনার জন্য টাকা লাগবে", money: true },
      ]} />
      <div style={{ position: "absolute", left: 820, top: 300, opacity: 1 - reveal }}>
        <div style={{ fontFamily: BN, fontSize: 40, color: MUTE }}>ইতালি প্রবাসী পাঠিয়েছেন</div>
        <Money at={190} dur={90} to={300000} size={150} />
        <div style={{ fontFamily: BN, fontSize: 36, color: MUTE }}>ছয় মাসের প্রেম · মোবাইলে বিয়ে</div>
      </div>
      <div style={{ position: "absolute", left: 820, top: 250, opacity: reveal, transform: `translateX(${glitch}px)` }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92, color: "white", lineHeight: 1.15 }}>‘স্ত্রী’ আসলে</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 112, color: RED2, lineHeight: 1.15, textShadow: `${glitch}px 0 #00e5ff` }}>বিশ বছরের এক তরুণ</div>
      </div>
      <Source text="প্রথম আলো, ৮ অক্টোবর ২০২৬" />
    </AbsoluteFill>
  );
};
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const a = T(f, 0, 30), line = T(f, 20, 70);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.35)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: HEAD, color: "white", textAlign: "center" }}>
        <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 28, letterSpacing: 12, color: RED2, opacity: a }}>COLOURS OF BANGLADESH · INVESTIGATION</div>
        <div style={{ fontWeight: 800, fontSize: 170, lineHeight: 1.05, marginTop: 20, opacity: a, transform: `scale(${1.15 - a * 0.15})` }}>প্রেমের ফাঁদ</div>
        <div style={{ width: `${line * 900}px`, height: 8, background: RED, margin: "26px 0" }} />
        <div style={{ fontWeight: 700, fontSize: 84, color: AMBER, opacity: T(f, 40, 70) }}>টার্গেট প্রবাসী</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(10, 14);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(255,176,32,.16)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${s})` }}><Silhouette size={340} color="#3a4d57" q /></div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: "white", marginTop: 20, opacity: T(f, 40, 60) }}>ছন্দ</div>
        <div style={{ fontFamily: BN, fontSize: 36, color: MUTE, opacity: T(f, 70, 90), maxWidth: 1100, textAlign: "center" }}>প্রকাশিত মামলায় পুলিশের জানানো কৌশল থেকে সাজানো একটি কাল্পনিক চরিত্র</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", top: 120, transform: `translateX(-50%) rotate(-6deg) scale(${T(f, 100, 115, 1.6, 1)})`, opacity: T(f, 100, 112), fontFamily: BN, fontWeight: 700, fontSize: 52, color: AMBER, border: `5px solid ${AMBER}`, padding: "6px 30px", borderRadius: 10 }}>কাল্পনিক উদাহরণ</div>
    </AbsoluteFill>
  );
};
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const apps = ["ফেসবুক", "টেলিগ্রাম", "ডেটিং অ্যাপ"];
  return (
    <AbsoluteFill>
      <Bg />
      <Label step="ধাপ ১" title="ভুয়া প্রোফাইল" />
      <div style={{ position: "absolute", left: 120, top: 300, width: 520, borderRadius: 26, overflow: "hidden", background: "#121b20", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 40px 90px rgba(0,0,0,.5)", transform: `translateY(${(1 - useSp(10)) * 80}px)` }}>
        <div style={{ height: 420, background: "linear-gradient(150deg,#ff8aa0,#a8447f 45%,#3b2a5f)", filter: "blur(18px)", transform: "scale(1.15)" }} />
        <div style={{ padding: "20px 26px", fontFamily: BN, color: "white" }}>
          <div style={{ fontWeight: 700, fontSize: 38 }}>ছন্দ, ২২ ✨</div>
          <div style={{ fontSize: 24, color: MUTE }}>অন্য কারও ছবি · নতুন আইডি</div>
        </div>
        <div style={{ position: "absolute", left: 26, top: 170, fontFamily: BN, fontWeight: 700, fontSize: 30, color: "white", background: "rgba(0,0,0,.55)", padding: "8px 18px", borderRadius: 8 }}>ছবি: চুরি করা</div>
      </div>
      <div style={{ position: "absolute", left: 760, top: 330, display: "flex", flexDirection: "column", gap: 22 }}>
        {apps.map((a, i) => <Card key={a} delay={40 + i * 18} style={{ fontSize: 44, fontWeight: 700, width: 420 }}>{a}</Card>)}
      </div>
      <svg style={{ position: "absolute", left: 1200, top: 480 }} width={180} height={80}><path d="M0 40 H150 M120 10 L160 40 L120 70" stroke={RED2} strokeWidth={8} fill="none" strokeDasharray={260} strokeDashoffset={260 - T(f, 150, 200) * 260} /></svg>
      <div style={{ position: "absolute", left: 1400, top: 420, opacity: T(f, 190, 215) }}>
        <Card delay={190} style={{ fontSize: 46, fontWeight: 700, background: "#1f6f4a" }}>হোয়াটসঅ্যাপ / ইমো</Card>
        <div style={{ fontFamily: BN, fontSize: 28, color: MUTE, marginTop: 14 }}>আলাপ দ্রুত সরিয়ে নেওয়া হয়</div>
      </div>
      <Fiction />
    </AbsoluteFill>
  );
};
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const steps: [number, number, string][] = [[20, 500, "এমবি"], [110, 5000, "শপিং"], [190, 50000, "অসুখ"], [270, 200000, "জমি কেনা"]];
  return (
    <AbsoluteFill>
      <Bg />
      <Label step="ধাপ ২" title="ছোট দাবি থেকে বড় অঙ্ক" />
      <Phone x={110} y={140} msgs={[
        { at: 10, text: "এমবি শেষ, ৫০০ টাকা দাও না 🥺" }, { at: 60, me: true, text: "পাঠালাম" },
        { at: 100, text: "দেখা করতে আসব, শপিং করতে হবে", money: true }, { at: 180, text: "আম্মু হঠাৎ অসুস্থ…", money: true },
        { at: 260, text: "বাড়ির পাশের জমিটা কিনে ফেলি?", money: true },
      ]} />
      <div style={{ position: "absolute", left: 720, top: 330, right: 100, height: 520, display: "flex", alignItems: "flex-end", gap: 40 }}>
        {steps.map(([at, v, l], i) => {
          const h = T(f, at, at + 30) * (60 + (Math.log10(v) - 2.6) * 140);
          return (
            <div key={l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: AMBER, opacity: T(f, at + 10, at + 30) }}>৳{bn(v.toLocaleString("en-IN"))}</div>
              <div style={{ width: "100%", height: h, background: `linear-gradient(180deg, ${RED2}, ${RED})`, borderRadius: "10px 10px 0 0", boxShadow: "0 0 40px rgba(224,20,43,.35)" }} />
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white" }}>{l}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 720, top: 880, fontFamily: BN, fontWeight: 700, fontSize: 40, color: RED2, opacity: T(f, 330, 350) }}>দেখা আর কখনো হয় না।</div>
      <Fiction />
    </AbsoluteFill>
  );
};
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const rec = Math.floor(f / 15) % 2 === 0;
  const targets = T(f, 220, 300);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.32)" />
      <Label step="ধাপ ৩" title="ভিডিও কলের ফাঁদ" />
      <div style={{ position: "absolute", left: 120, top: 280, width: 900, height: 560, borderRadius: 24, overflow: "hidden", background: "#0c1418", border: "2px solid rgba(255,255,255,.12)" }}>
        <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 2px, transparent 2px 4px), linear-gradient(140deg,#24343c,#0b1114)", filter: "blur(6px)" }} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: BN, fontWeight: 700, fontSize: 40, color: "rgba(255,255,255,.4)" }}>ভিডিও কল চলছে…</AbsoluteFill>
        <div style={{ position: "absolute", left: 24, top: 20, display: "flex", alignItems: "center", gap: 10, fontFamily: "Montserrat", fontWeight: 800, fontSize: 30, color: RED2, opacity: f > 40 ? 1 : 0 }}><span style={{ width: 20, height: 20, borderRadius: 99, background: rec ? RED2 : "transparent" }} />REC</div>
      </div>
      <div style={{ position: "absolute", left: 1080, top: 330, width: 720 }}>
        <Card delay={90} style={{ background: "#3a0d14", border: `2px solid ${RED}` }}>
          <div style={{ fontSize: 30, color: RED2, fontWeight: 700 }}>হুমকির বার্তা</div>
          <div style={{ fontSize: 44, fontWeight: 700, marginTop: 6 }}>“টাকা না দিলে ভিডিও ছড়িয়ে দেব”</div>
        </Card>
        <div style={{ display: "flex", gap: 18, marginTop: 40, opacity: targets }}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ opacity: T(f, 230 + i * 15, 250 + i * 15) }}><Silhouette size={130} color={i === 0 ? "#55666f" : "#3a4d57"} /></div>)}
        </div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: AMBER, marginTop: 14, opacity: targets }}>এরপর… নতুন টার্গেট</div>
      </div>
      <Fiction />
    </AbsoluteFill>
  );
};
const CaseScene: React.FC<{ slug: string; n: string; place: string; facts: [number, string, React.ReactNode][]; source: string; extra?: React.ReactNode }> = ({ slug, n, place, facts, source, extra }) => {
  const geo = useGeo();
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.18)" />
      <MapPin geo={geo} slug={slug} x={110} y={200} h={760} />
      <div style={{ position: "absolute", left: 780, top: 190, right: 110 }}>
        <CaseHead n={n} place={place} />
        <div style={{ marginTop: 26 }}>{facts.map(([d, k, v]) => <Fact key={k} delay={d} k={k} v={v} />)}</div>
        {extra}
      </div>
      <Source text={source} />
    </AbsoluteFill>
  );
};
const S7: React.FC = () => (
  <CaseScene slug="natore" n="০১" place="নাটোর, লালপুর" source="প্রথম আলো, ৮ অক্টোবর ২০২৬" facts={[
    [30, "অভিযুক্ত", "২০ বছরের এক তরুণ"], [70, "কৌশল", "নারীর ছবিতে ফেসবুক আইডি"], [110, "কণ্ঠ", "অ্যাপ দিয়ে নারীকণ্ঠ"],
    [160, "অজুহাত", "“সামনের ক্যামেরা নষ্ট”"], [230, "টাকা", "তিন লাখের বেশি"], [420, "ফলাফল", "তরুণ ও বাবা গ্রেপ্তার, সাইবার সুরক্ষা আইনে মামলা"],
  ]} />
);
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <CaseScene slug="dhaka" n="০২" place="ঢাকা, খিলগাঁও" source="বাসস ও আইটিভি, ৬ জুলাই ২০২৬" facts={[
      [30, "ভুক্তভোগী", "একজন ঋণ কর্মকর্তা"], [90, "কৌশল", "ফ্ল্যাটে ডেকে ভিডিও ধারণ"],
    ]} extra={
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 30 }}>
        <Card delay={170}><div style={{ fontSize: 28, color: MUTE }}>আদায়</div><Money at={175} dur={50} to={110000} size={72} /></Card>
        <Card delay={240}><div style={{ fontSize: 28, color: MUTE }}>আরও দাবি</div><Money at={245} dur={50} to={300000} size={72} color={RED2} /></Card>
        <Card delay={390}><div style={{ fontSize: 28, color: MUTE }}>ডিবির হাতে গ্রেপ্তার</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 72 }}>{bn(Math.round(T(f, 395, 425, 0, 5)))} জন</div></Card>
        <Card delay={450}><div style={{ fontSize: 28, color: MUTE }}>জব্দ মোবাইল</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 72 }}>{bn(Math.round(T(f, 455, 485, 0, 9)))}টি</div></Card>
      </div>
    } />
  );
};
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const chain = ["প্রেমের সম্পর্ক", "নির্জন জায়গায় ডাকা", "আটকে ভিডিও ধারণ", "টাকা আদায়"];
  return (
    <CaseScene slug="narsingdi" n="০৩" place="নরসিংদী" source="ইত্তেফাক, ৬ মে ২০২৬" facts={[]} extra={
      <div style={{ marginTop: 30 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {chain.map((c, i) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 20, opacity: T(f, 30 + i * 55, 50 + i * 55), transform: `translateX(${(1 - T(f, 30 + i * 55, 50 + i * 55)) * 40}px)` }}>
              <span style={{ width: 54, height: 54, borderRadius: 99, background: RED, color: "white", fontFamily: HEAD, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{bn(i + 1)}</span>
              <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: "white" }}>{c}</span>
            </div>
          ))}
        </div>
        <Card delay={280} style={{ marginTop: 34, display: "inline-block" }}><div style={{ fontSize: 28, color: MUTE }}>জেলা গোয়েন্দা পুলিশের হাতে গ্রেপ্তার</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 62 }}>৪ জন <span style={{ fontSize: 36, color: AMBER }}>(৩ জন নারী)</span></div></Card>
      </div>
    } />
  );
};
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const flip = T(f, 90, 130);
  const reasons = ["দূরে, একা থাকেন", "যাচাই করা কঠিন", "লজ্জায় অভিযোগ কম"];
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 140, top: 200, width: 420, height: 560, perspective: 1400 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg)` }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 24, overflow: "hidden", background: "#121b20", border: "1px solid rgba(255,255,255,.15)" }}>
            <div style={{ height: 420, background: "linear-gradient(150deg,#ff8aa0,#a8447f 45%,#3b2a5f)", filter: "blur(16px)" }} />
            <div style={{ padding: 22, fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white" }}>প্রোফাইলে যা দেখছেন</div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 24, background: "#0e171c", border: `2px solid ${RED}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <Silhouette size={300} color="#55666f" q />
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: RED2 }}>পেছনে আসলে কে?</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 700, top: 210, right: 110 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: "white", lineHeight: 1.2, opacity: T(f, 20, 45) }}>ছবির মেয়েটি আর<br /><span style={{ color: RED2 }}>পেছনের মানুষ</span> এক নন</div>
        <Card delay={150} style={{ marginTop: 30, borderLeft: `6px solid ${RED}` }}>
          <div style={{ fontSize: 24, color: MUTE }}>ঢাকা পোস্টের শিরোনাম</div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>“অনলাইনে মেয়ে সেজে প্রবাসীদের অর্থ হাতিয়ে নিত চক্রটি”</div>
        </Card>
        <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
          {reasons.map((r, i) => <Card key={r} delay={330 + i * 25} style={{ flex: 1, fontSize: 32, fontWeight: 700, textAlign: "center", background: "rgba(224,20,43,.18)", border: `1px solid ${RED}` }}>{r}</Card>)}
        </div>
        <div style={{ fontFamily: BN, fontSize: 28, color: MUTE, marginTop: 14, opacity: T(f, 320, 340) }}>কেন প্রবাসীরা টার্গেট</div>
      </div>
    </AbsoluteFill>
  );
};
const FLAGS: [number, string][] = [[50, "ভিডিও কলে মুখ দেখাতে চায় না"], [110, "অল্প দিনেই প্রেম আর বিয়ের কথা"], [175, "এমবি, রিচার্জ, অসুখ বা জমির জন্য টাকা চায়"], [265, "দ্রুত অন্য অ্যাপে সরিয়ে নেয়"], [320, "ভিডিও কলে অশালীন অনুরোধ"]];
const S11: React.FC = () => {
  const f = useCurrentFrame();
  return (
  <AbsoluteFill>
    <Bg tint="rgba(255,176,32,.14)" />
    <Label title="কীভাবে চিনবেন" />
    <div style={{ position: "absolute", left: 140, top: 290, display: "flex", flexDirection: "column", gap: 20 }}>
      {FLAGS.map(([d, t]) => {
        const s = spring({ frame: f - d, fps: 30, config: { damping: 13 } });
        return (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 26, opacity: s, transform: `translateX(${(1 - s) * -80}px)` }}>
            <svg width={64} height={64} viewBox="0 0 24 24"><path d="M5 21V4h11l-1.5 4L16 12H6" fill={RED} stroke={RED2} strokeWidth={1.2} /><path d="M5 3v18" stroke="white" strokeWidth={2} /></svg>
            <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 52, color: "white" }}>{t}</span>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
  );
};
const S12: React.FC = () => {
  const f = useCurrentFrame();
  const items: [number, string, string][] = [[10, "✋", "টাকা দেবেন না, দাবি শুধু বাড়ে"], [100, "📁", "চ্যাট, নম্বর ও লেনদেনের প্রমাণ রাখুন"], [230, "☎", "জরুরি প্রয়োজনে ৯৯৯"], [330, "🛡", "থানা বা পুলিশের সাইবার ইউনিটে অভিযোগ"]];
  return (
    <AbsoluteFill>
      <Bg tint="rgba(40,180,120,.14)" />
      <Label title="ফাঁদে পড়লে কী করবেন" />
      <div style={{ position: "absolute", left: 140, right: 140, top: 300, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {items.map(([d, ic, t]) => <Card key={t} delay={d} style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 42, fontWeight: 700, padding: "30px 32px" }}><span style={{ fontSize: 60 }}>{ic}</span>{t}</Card>)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: AMBER, opacity: T(f, 400, 430) }}>লজ্জা নয়, আইনই আপনার সুরক্ষা</div>
    </AbsoluteFill>
  );
};
const S13: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 12);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.3)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: BN, color: "white" }}>
        <Img src={staticFile("cob/logo-light.png")} style={{ width: 820, transform: `scale(${s})` }} />
        <div style={{ marginTop: 26, fontSize: 50, fontWeight: 700, opacity: T(f, 20, 40) }}>বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন</div>
        <div style={{ marginTop: 40, fontSize: 26, color: MUTE, opacity: T(f, 40, 60), textAlign: "center", lineHeight: 1.6 }}>তথ্যসূত্র: প্রথম আলো, বাসস, আইটিভি, ইত্তেফাক, ঢাকা পোস্ট<br />“ছন্দ” একটি কাল্পনিক চরিত্র; বাস্তব কোনো ব্যক্তির সঙ্গে মিল কাকতালীয়</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- timeline ----------
const VO = [411, 430, 327, 370, 387, 315, 737, 596, 392, 569, 396, 478, 226];
const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13];
const PAD = 14, LEAD = 8;
const starts: number[] = []; let acc = 0;
for (const v of VO) { starts.push(acc); acc += v + PAD + LEAD; }
export const HT_LEN = acc + 30;
const SFX: [number, string, number?][] = [];
// chat pings in the scenes that use the phone, stings at case files
for (const at of [10, 40, 75, 120, 150, 190]) SFX.push([starts[0] + at, "btlsfx/msg.mp3", 0.35]);
SFX.push([starts[0] + 298, "sfx/boom.mp3", 0.6]);
SFX.push([starts[1], "btlsfx/sting.mp3", 0.55]);
for (const at of [10, 60, 100, 180, 260]) SFX.push([starts[4] + at, "btlsfx/msg.mp3", 0.35]);
SFX.push([starts[5] + 90, "btlsfx/alert.mp3", 0.4]);
for (const i of [6, 7, 8]) SFX.push([starts[i], "sfx/whoosh.mp3", 0.45]);
for (const [d] of FLAGS) SFX.push([starts[10] + d, "btlsfx/swoosh.mp3", 0.3]);

export const HoneyTrap: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: INK }}>
      {SCENES.map((S, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={VO[i] + PAD + LEAD + (i === SCENES.length - 1 ? 30 : 0)}>
          <Fade len={VO[i] + PAD + LEAD}><S /></Fade>
          <Sequence from={LEAD}><Audio src={staticFile(`htvo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
        </Sequence>
      ))}
      <Bug />
      <Grain />
      <Audio src={staticFile("htmusic.mp3")} volume={(f) => interpolate(f, [0, 20, durationInFrames - 60, durationInFrames], [0, 0.16, 0.16, 0], clamp)} loop />
      {SFX.map(([at, src, vol], i) => <Sfx key={i} at={at} src={src} vol={vol} />)}
    </AbsoluteFill>
  );
};
export const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, len - 6, len], [0, 1, 1, 0.0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
