// "লিবিয়া হয়ে ইউরোপ: মানব পাচারের মরণপথ" — 2-minute sample edit. Times in seconds (S), designed at 1920x1080, rendered ×4/3 to 1440p.
import "./fonts";
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import caps from "./caps.json";
import { bn, bnInt } from "./Geo3D";

const A = (f: string) => staticFile(`libya/ep0/${f}`);
const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
export const EP0_LEN = S(127);
const RED = "#e0142b", GOLD = "#ffcf6b", INK = "#0b1114", SAND = "#ead9b4";
const HEAD = "Anek Bangla", BODY = "Hind Siliguri";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---- VO schedule (start s, file) — lengths measured from the mp3s ----
export const VO: { id: string; at: number; len: number }[] = [
  { id: "voicenote", at: 1.0, len: 10.32 }, { id: "hook", at: 16.8, len: 12.96 }, { id: "village", at: 30.3, len: 14.08 },
  { id: "dubai", at: 44.8, len: 9.36 }, { id: "libya", at: 54.6, len: 14.48 }, { id: "boat", at: 69.6, len: 15.68 },
  { id: "number", at: 86.2, len: 16.08 }, { id: "tease", at: 102.9, len: 10.24 }, { id: "close", at: 113.7, len: 8.96 },
];
const speaking = (t: number) => VO.some((v) => t >= v.at - 0.25 && t <= v.at + v.len + 0.15);

// ---------- small building blocks ----------
const useT = () => useCurrentFrame() / FPS;
const fadeIO = (t: number, a: number, b: number, d = 0.4) => interpolate(t, [a, a + d, b - d, b], [0, 1, 1, 0], clamp);
const Clip: React.FC<{ src: string; from?: number; dur: number; kb?: number; filter?: string; fade?: number }> = ({ src, from = 0, dur, kb = 0, filter, fade = 0.35 }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const o = interpolate(t, [0, fade, dur - fade, dur], [0, 1, 1, 0], clamp);
  const sc = 1 + kb * (t / dur);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <OffthreadVideo src={A(src)} startFrom={S(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc})`, filter }} />
    </AbsoluteFill>
  );
};
const Credit: React.FC<{ text: string; o?: number }> = ({ text, o = 1 }) => (
  <div style={{ position: "absolute", right: 34, top: 30, opacity: 0.8 * o, fontFamily: BODY, fontWeight: 600, fontSize: 21, color: "#fff", textShadow: "0 1px 6px #000", maxWidth: 820, textAlign: "right" }}>{text}</div>
);
const Tag: React.FC<{ text: string; o: number; color?: string; top?: number }> = ({ text, o, color = RED, top = 34 }) => (
  <div style={{ position: "absolute", left: 40, top, opacity: o, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12, background: "rgba(5,8,12,.72)", border: `1.5px solid ${color}`, borderRadius: 8, padding: "8px 18px 10px", fontFamily: BODY, fontWeight: 600, fontSize: 26, color: "#fff" }}>
    <div style={{ width: 10, height: 10, borderRadius: 5, background: color, boxShadow: `0 0 10px ${color}` }} />{text}
  </div>
);
const Source: React.FC<{ text: string; o: number; bottom?: number; left?: number }> = ({ text, o, bottom = 196, left = 64 }) => (
  <div style={{ position: "absolute", left, bottom, opacity: o * 0.92, fontFamily: BODY, fontWeight: 600, fontSize: 23, color: SAND, textShadow: "0 1px 6px #000" }}>সূত্র: {text}</div>
);
const Place: React.FC<{ name: string; sub?: string; o: number }> = ({ name, sub, o }) => (
  <div style={{ position: "absolute", left: 64, top: 70, opacity: o, transform: `translateX(${(1 - o) * -24}px)` }}>
    <div style={{ width: 54, height: 4, background: RED, marginBottom: 12 }} />
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "#fff", lineHeight: 1.1, textShadow: "0 3px 16px rgba(0,0,0,.8)" }}>{name}</div>
    {sub ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: SAND, textShadow: "0 2px 10px #000" }}>{sub}</div> : null}
  </div>
);
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile(`cob/grain${f % 4}.png`)})`, backgroundSize: "512px", opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }} />;
};
const Vignette: React.FC<{ v?: number }> = ({ v = 0.6 }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, transparent 48%, rgba(0,0,0,${v}) 100%)`, pointerEvents: "none" }} />;

// money card: a line item that springs in
const Money: React.FC<{ label: string; amount: string; note?: string; at: number; color?: string; strike?: string }> = ({ label, amount, note, at, color = GOLD, strike }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - S(at), fps, config: { damping: 14, mass: 0.8 } });
  if (f < S(at)) return null;
  return (
    <div style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 30}px)`, background: "rgba(8,12,16,.86)", borderLeft: `6px solid ${color}`, borderRadius: 10, padding: "16px 26px 18px", marginTop: 14, minWidth: 560, boxShadow: "0 12px 40px rgba(0,0,0,.45)" }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: SAND }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        {strike ? <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 40, color: "#8d949b", textDecoration: "line-through", textDecorationColor: RED }}>{strike}</div> : null}
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 66, color, lineHeight: 1.1 }}>{amount}</div>
      </div>
      {note ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 25, color: "#c9cdd1", marginTop: 2 }}>{note}</div> : null}
    </div>
  );
};

// running total for one family (Daily Star, 26 Sep 2026): broker 5.7 + son's ransom 10 + father's ransom 10 + boat 5 = 30.7 lakh
const LEDGER = [{ at: 40.6, v: 5.7 }, { at: 62.0, v: 15.7 }, { at: 75.4, v: 20.7 }];
const Ledger: React.FC<{ until: number }> = ({ until }) => {
  const t = useT();
  if (t < LEDGER[0].at || t > until) return null;
  let v = 0, last = LEDGER[0].at;
  for (const s of LEDGER) if (t >= s.at) { v = s.v; last = s.at; }
  const prev = LEDGER.filter((s) => s.at < last).slice(-1)[0]?.v ?? 0;
  const shown = interpolate(t, [last, last + 0.9], [prev, v], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pulse = interpolate(t, [last, last + 0.25, last + 0.9], [1, 1.08, 1], clamp);
  const o = fadeIO(t, LEDGER[0].at, until, 0.5);
  return (
    <div style={{ position: "absolute", right: 46, top: 86, opacity: o, textAlign: "right", background: "rgba(6,9,12,.78)", padding: "12px 22px 14px", borderRadius: 10, borderTop: `3px solid ${RED}` }}>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 22, color: SAND }}>এই পরিবারের খরচ (রিপোর্ট অনুযায়ী)</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: "#fff", transform: `scale(${pulse})`, transformOrigin: "right center" }}>৳{bn(shown.toFixed(1))} লাখ</div>
    </div>
  );
};

// ---------- captions (script text, timed by whisper) ----------
type Cap = { s: number; e: number; words: { w: string; s: number; e: number }[]; vn?: boolean };
const Captions: React.FC = () => {
  const t = useT();
  const c = (caps as Cap[]).find((x) => t >= x.s - 0.05 && t <= x.e + 0.25);
  if (!c) return null;
  const o = interpolate(t, [c.s - 0.05, c.s + 0.12, c.e + 0.1, c.e + 0.25], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: 1500, textAlign: "center", padding: "8px 26px 12px", borderRadius: 10, background: "rgba(0,0,0,.42)", fontFamily: c.vn ? BODY : BODY, fontWeight: 700, fontSize: 44, lineHeight: 1.35, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>
        {c.vn ? <span style={{ color: SAND }}>“</span> : null}
        {c.words.map((w, i) => {
          const on = t >= w.s && t < w.e + 0.08; const past = t >= w.e;
          return <span key={i} style={{ color: on ? GOLD : past ? "#fff" : "rgba(255,255,255,.62)" }}>{w.w}{i < c.words.length - 1 ? " " : ""}</span>;
        })}
        {c.vn ? <span style={{ color: SAND }}>”</span> : null}
      </div>
    </div>
  );
};

// ---------- scenes ----------
const ColdOpen: React.FC = () => {
  const t = useT(); const { fps } = useVideoConfig(); const f = useCurrentFrame();
  const bubble = spring({ frame: f - S(0.6), fps, config: { damping: 15 } });
  const prog = interpolate(t, [1.0, 11.3], [0, 1], clamp);
  const bars = Array.from({ length: 46 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.sin(i * 0.43 + 1.3)));
  return (
    <AbsoluteFill>
      <Clip src="clips/sea_open.mp4" dur={11.8} fade={0.8} />
      <Vignette v={0.5} />
      <div style={{ position: "absolute", left: "50%", top: 640, transform: `translateX(-50%) scale(${0.9 + 0.1 * bubble})`, opacity: bubble * fadeIO(t, 0, 11.6, 0.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(22,30,36,.82)", borderRadius: 40, padding: "18px 34px 18px 22px", border: "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(6px)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "#2e3a42", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderLeft: "20px solid #fff", borderTop: "13px solid transparent", borderBottom: "13px solid transparent", marginLeft: 6, opacity: prog > 0 && prog < 1 ? 0.35 : 1 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, height: 60 }}>
            {bars.map((b, i) => <div key={i} style={{ width: 7, height: 60 * b * (i / bars.length < prog ? 1 : 0.55), borderRadius: 4, background: i / bars.length < prog ? "#7fd0a8" : "rgba(255,255,255,.35)" }} />)}
          </div>
          <div style={{ fontFamily: "Montserrat", fontWeight: 600, fontSize: 26, color: "#cfd6da", width: 70 }}>{`0:${String(Math.min(10, Math.floor(prog * 10))).padStart(2, "0")}`}</div>
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 24, color: "#9fb0b8", marginTop: 10, textAlign: "center" }}>ভয়েস মেসেজ · রাত ২টা ১৪ মিনিট</div>
      </div>
      <Tag text="পুনর্নির্মাণ: কাল্পনিক ভয়েস মেসেজ — আসল কারো কণ্ঠ নয়" o={fadeIO(t, 0.4, 11.6)} color="#7fd0a8" />
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f - 6, fps, config: { damping: 16 } }), b = spring({ frame: f - 20, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      <Clip src="px/graveyard_title.mp4" dur={5.0} filter="saturate(.55) brightness(.62) contrast(1.08)" fade={0.3} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(4,6,9,.88) 0%, rgba(4,6,9,.45) 55%, transparent 80%)" }} />
      <div style={{ position: "absolute", left: 120, top: 330 }}>
        <Img src={staticFile("cob/logo-light.png")} style={{ height: 46, opacity: a * 0.9, marginBottom: 30 }} />
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 132, color: "#fff", lineHeight: 1.08, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>লিবিয়া হয়ে ইউরোপ</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 84, color: RED, lineHeight: 1.2, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>মানব পাচারের মরণপথ</div>
      </div>
      <Credit text="লাম্পেদুসায় পড়ে থাকা অভিবাসীদের নৌকা · ছবি: European Commission / Wikimedia Commons (CC BY 4.0)" o={fadeIO(t, 0.3, 5)} />
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const phone = spring({ frame: f - S(4.4), fps, config: { damping: 15 } });
  const q1 = spring({ frame: f - S(8.6), fps, config: { damping: 14 } }), q2 = spring({ frame: f - S(9.9), fps, config: { damping: 14 } });
  const dark = interpolate(t, [4.2, 5.0], [0, 0.55], clamp);
  return (
    <AbsoluteFill>
      <Clip src="px/madaripur.mp4" dur={8.6} filter="saturate(.8) brightness(.85)" />
      <AbsoluteFill style={{ background: `rgba(3,5,8,${dark})` }} />
      <Place name="মাদারীপুর" sub="রিপোর্টে বারবার আসা জেলাগুলোর একটি" o={fadeIO(t, 0.5, 4.3)} />
      <Credit text="মাদারীপুরে সূর্যাস্ত · ছবি: S.M.M. Musabbir Uddin / Wikimedia Commons (CC BY-SA 4.0)" o={fadeIO(t, 0.3, 8.4)} />
      {t < 8.7 ? (
        <div style={{ position: "absolute", left: "50%", top: 250, transform: `translateX(-50%) translateY(${(1 - phone) * 40}px)`, opacity: phone * fadeIO(t, 4.4, 8.6, 0.3), width: 420, background: "rgba(14,18,22,.92)", borderRadius: 34, padding: "40px 30px", textAlign: "center", border: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: "#fff" }}>খোকা</div>
          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 26, color: "#9aa5ab", marginTop: 6 }}>কল করা হচ্ছে…</div>
          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 27, color: "#ff8a80", marginTop: 26, opacity: interpolate(t, [5.6, 6.0], [0, 1], clamp) }}>নম্বরটি এই মুহূর্তে বন্ধ আছে</div>
          <div style={{ margin: "34px auto 0", width: 78, height: 78, borderRadius: 39, background: RED, opacity: 0.9 }} />
        </div>
      ) : null}
      {t >= 8.4 ? (
        <AbsoluteFill style={{ background: INK, opacity: interpolate(t, [8.4, 8.8], [0, 1], clamp) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center" }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 120, color: "#fff", opacity: q1, transform: `translateY(${(1 - q1) * 40}px)` }}>কোন পথ?</div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 120, color: GOLD, opacity: q2, transform: `translateY(${(1 - q2) * 40}px)` }}>কত টাকা?</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// globe section: 29.8 → 58.5 (local t)
const Route: React.FC = () => {
  const t = useT();
  const pip = (src: string, a: number, b: number, cap: string, credit: string) => {
    const o = fadeIO(t, a, b, 0.35); if (o <= 0) return null;
    const s = interpolate(t, [a, a + 0.5], [0.92, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return (
      <div style={{ position: "absolute", right: 70, bottom: 230, width: 620, opacity: o, transform: `scale(${s})`, transformOrigin: "right bottom" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", border: "2px solid rgba(255,255,255,.18)", boxShadow: "0 18px 50px rgba(0,0,0,.6)", height: 349 }}>
          <OffthreadVideo src={A(src)} startFrom={0} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, color: "#fff", marginTop: 10, textShadow: "0 2px 8px #000" }}>{cap}</div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 19, color: "#c4c9cc", textShadow: "0 1px 5px #000" }}>{credit}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Clip src="clips/globe.mp4" dur={28.7} fade={0.4} />
      {/* village: promise + first payment */}
      <div style={{ position: "absolute", left: 64, top: 300, opacity: fadeIO(t, 5.6, 14.6, 0.4) }}>
        <Tag text="একটি পরিবারের ঘটনা · নাম প্রকাশ করা হলো না" o={1} color={GOLD} top={-80} />
        <Money label="দালালের প্রতিশ্রুতি" amount="ইতালিতে চাকরি" note={`মাসে ৳${bnInt(180000)} বেতন`} at={5.8} color="#9fd3ff" />
        <Money label="দালালকে প্রথম কিস্তি (ধার করে)" amount={`৳${bnInt(570000)}`} strike={`৳${bnInt(1000000)}`} note="দাবি ছিল ১০ লাখ" at={10.4} />
      </div>
      <Source text="দ্য ডেইলি স্টার, ২৬ সেপ্টেম্বর ২০২৬" o={fadeIO(t, 5.6, 14.6)} />
      {pip("px/dhaka_airport.mp4", 13.2, 16.6, "হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর, ঢাকা", "ছবি: Tarunsamanta / Wikimedia Commons (CC BY-SA 4.0)")}
      {pip("px/dubai.mp4", 16.9, 19.9, "দুবাই আন্তর্জাতিক বিমানবন্দর", "ছবি: EditQ / Wikimedia Commons (CC0)")}
      {/* visa: the semi-legal half of the journey */}
      <div style={{ position: "absolute", left: 64, top: 300, opacity: fadeIO(t, 20.6, 24.8, 0.4) }}>
        <Money label="পূর্ব লিবিয়ায় ঢোকা" amount="টাকা দিলে ভিসা" note="কাজের বা ট্রানজিট ভিসা — তাই শুরুতে বৈধ মনে হয়" at={20.7} color="#9fd3ff" />
      </div>
      <Source text="মিক্সড মাইগ্রেশন সেন্টার রিপোর্ট, মার্চ ২০২৬ (ইনফোমাইগ্রেন্টস)" o={fadeIO(t, 20.6, 24.8)} />
      <Credit text="মানচিত্র: NASA Blue Marble · Natural Earth" o={fadeIO(t, 0.5, 28.4)} />
    </AbsoluteFill>
  );
};

const Room: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Clip src="px/room.mp4" dur={7.6} filter="saturate(.7) brightness(.82)" fade={0.25} />
      <Vignette v={0.7} />
      <Tag text="এআই দিয়ে তৈরি প্রতীকী ছবি — আসল জায়গা নয়" o={fadeIO(t, 0.1, 7.5, 0.25)} color="#c59bff" />
      <Place name="“গেম ঘর”" sub="ত্রিপোলির পথে, আটকে রাখার ঘর" o={fadeIO(t, 0.4, 3.2)} />
      <div style={{ position: "absolute", left: 64, top: 300, opacity: fadeIO(t, 2.8, 7.6, 0.4) }}>
        <Money label="ছেলের মুক্তিপণ — নির্যাতনের ভিডিও পাঠিয়ে" amount={`৳${bnInt(1000000)}`} strike={`৳${bnInt(2000000)}`} note="দাবি ২০ লাখ · জমি বেচে দেওয়া হয় ১০ লাখ" at={3.0} color={RED} />
      </div>
      <Source text="দ্য ডেইলি স্টার, ২৬ সেপ্টেম্বর ২০২৬" o={fadeIO(t, 2.8, 7.6)} />
    </AbsoluteFill>
  );
};

const TripoliNight: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Clip src="px/tripoli_night.mp4" dur={3.6} fade={0.3} />
      <Place name="ত্রিপোলি" sub="রাতের শহর, মহাকাশ স্টেশন থেকে" o={fadeIO(t, 0.3, 3.5)} />
      <div style={{ position: "absolute", left: 64, top: 300, opacity: fadeIO(t, 0.6, 3.6, 0.3), fontFamily: BODY, fontWeight: 600, fontSize: 30, color: "#fff", background: "rgba(6,9,12,.7)", padding: "14px 22px", borderRadius: 10, maxWidth: 620 }}>
        অন্য রিপোর্টে: কেউ এমন ঘরে ছিলেন <b style={{ color: GOLD }}>দেড় মাস</b>, কেউ লিবিয়ায় আটকে ছিলেন <b style={{ color: GOLD }}>১০ মাস</b>
      </div>
      <Source text="ইনফোমাইগ্রেন্টস, ১৯ মার্চ ২০২৬" o={fadeIO(t, 0.6, 3.6)} />
      <Credit text="ছবি: NASA Johnson Space Center (পাবলিক ডোমেইন)" o={fadeIO(t, 0.3, 3.5)} />
    </AbsoluteFill>
  );
};

const Crossing: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Clip src="clips/med.mp4" dur={7.8} fade={0.35} />
      <div style={{ position: "absolute", left: 64, top: 300, opacity: fadeIO(t, 5.6, 7.8, 0.3) }}>
        <Money label="নৌকায় জায়গা — আরেক চক্রকে" amount={`৳${bnInt(500000)}`} at={5.8} />
      </div>
      <Credit text="মানচিত্র: Sentinel-2 cloudless (EOX, CC BY 4.0) · উচ্চতা: AWS Terrain Tiles" o={fadeIO(t, 0.3, 7.8)} />
    </AbsoluteFill>
  );
};

const BoatNight: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Clip src="px/rescue.mp4" from={4.5} dur={3.2} filter="saturate(.7) brightness(.8)" fade={0.3} />
      <Credit text="ভূমধ্যসাগরে উদ্ধারের অপেক্ষায় ভরা নৌকা · ছবি: U.S. Navy / Wikimedia Commons (পাবলিক ডোমেইন)" o={fadeIO(t, 0.2, 3.1)} />
    </AbsoluteFill>
  );
};

// the full ledger: four bars that stack into 30.7 lakh
const Bill: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const rows = [
    { l: "দালালকে প্রথম কিস্তি", v: 5.7, c: GOLD }, { l: "ছেলের মুক্তিপণ", v: 10, c: RED }, { l: "বাবার মুক্তিপণ (পরে বাবাকেও অপহরণ)", v: 10, c: "#ff7a6e" }, { l: "নৌকায় জায়গা", v: 5, c: "#9fd3ff" },
  ];
  const total = 30.7; const W = 1080;
  return (
    <AbsoluteFill>
      <Clip src="px/graveyard_ledger.mp4" dur={6.0} filter="saturate(.5) brightness(.42)" fade={0.35} />
      <div style={{ position: "absolute", left: 120, top: 210, width: W }}>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: SAND, opacity: fadeIO(t, 0.1, 6, 0.3) }}>চুয়াডাঙ্গার একটি পরিবার — মোট যা গেছে</div>
        {rows.map((r, i) => {
          const s = spring({ frame: f - S(0.4 + i * 0.45), fps, config: { damping: 16 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", marginTop: 18, opacity: Math.min(1, s * 1.5) * fadeIO(t, 0, 6, 0.3) }}>
              <div style={{ width: 470, fontFamily: BODY, fontWeight: 600, fontSize: 29, color: "#fff" }}>{r.l}</div>
              <div style={{ height: 46, width: (W - 470 - 170) * (r.v / 10) * s, background: r.c, borderRadius: 6 }} />
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: "#fff", marginLeft: 16 }}>৳{bn(r.v)} লাখ</div>
            </div>
          );
        })}
        {(() => {
          const s = spring({ frame: f - S(2.6), fps, config: { damping: 13 } });
          const v = interpolate(t, [2.6, 3.6], [0, total], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <div style={{ marginTop: 34, borderTop: "2px solid rgba(255,255,255,.3)", paddingTop: 16, opacity: s * fadeIO(t, 0, 6, 0.3), display: "flex", alignItems: "baseline", gap: 24 }}>
              <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36, color: SAND }}>মোট</div>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1 }}>৳{bn(v.toFixed(1))} লাখ</div>
            </div>
          );
        })()}
      </div>
      <Source text="দ্য ডেইলি স্টার, ২৬ সেপ্টেম্বর ২০২৬ (চক্রকে ২৫.৭ লাখ + অন্য চক্রকে নৌকার ৫ লাখ)" o={fadeIO(t, 0.4, 6)} />
      <Credit text="লাম্পেদুসায় পড়ে থাকা নৌকা · ছবি: European Commission / Wikimedia Commons (CC BY 4.0)" o={fadeIO(t, 0.3, 6)} />
    </AbsoluteFill>
  );
};

const KeyNumber: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const v = interpolate(t, [2.4, 6.4], [0, 26964], { ...clamp, easing: Easing.out(Easing.cubic) });
  const a = spring({ frame: f - S(2.2), fps, config: { damping: 15 } });
  const part2 = t >= 9.2;
  const bars = [{ c: "বাংলাদেশ", v: 5757 }, { c: "আলজেরিয়া", v: 2759 }, { c: "সোমালিয়া", v: 2688 }, { c: "সুদান", v: 1753 }];
  return (
    <AbsoluteFill style={{ background: "#05080b" }}>
      {!part2 ? (
        <AbsoluteFill style={{ opacity: fadeIO(t, 0, 9.4, 0.35) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 38, color: SAND, opacity: a }}>২০১৪ থেকে মধ্য-ভূমধ্যসাগরের পথে মারা গেছেন অন্তত</div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 250, color: "#fff", lineHeight: 1.05, opacity: a, letterSpacing: 0 }}>{bnInt(v)}</div>
            <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 56, color: RED, opacity: a }}>জন মানুষ</div>
          </div>
          <Source text="আইওএম মিসিং মাইগ্র্যান্টস প্রজেক্ট (missingmigrants.iom.int), ১৮ নভেম্বর ২০২৬ দেখা" o={a} bottom={200} left={0} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ opacity: fadeIO(t, 9.2, 16.4, 0.35) }}>
          <Clip src="px/rescue.mp4" from={0.5} dur={7.2} filter="saturate(.55) brightness(.38)" fade={0.35} />
          <div style={{ position: "absolute", left: 120, top: 200, width: 1300 }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: "#fff" }}>ইতালিতে সাগরপথে আসা মানুষ, ২০২৬</div>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: SAND, marginBottom: 20 }}>জাতীয়তা অনুযায়ী · ১ জানুয়ারি থেকে ৩০ সেপ্টেম্বর</div>
            {bars.map((b, i) => {
              const s = spring({ frame: f - S(9.6 + i * 0.35), fps, config: { damping: 16 } });
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", marginTop: 16, opacity: Math.min(1, s * 1.5) }}>
                  <div style={{ width: 230, fontFamily: BODY, fontWeight: 700, fontSize: 34, color: i === 0 ? GOLD : "#fff" }}>{b.c}</div>
                  <div style={{ height: 52, width: 760 * (b.v / 5757) * s, background: i === 0 ? RED : "rgba(255,255,255,.35)", borderRadius: 6 }} />
                  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: "#fff", marginLeft: 18 }}>{bnInt(b.v * Math.min(1, s))}</div>
                </div>
              );
            })}
          </div>
          <Source text="ইউএনএইচসিআর অপারেশনাল ডেটা পোর্টাল, ইতালি (ইতালি সরকারের তথ্য, ৩০ সেপ্টেম্বর ২০২৬)" o={fadeIO(t, 9.4, 16.4)} />
          <Credit text="উদ্ধার অভিযান, ভূমধ্যসাগর · ছবি: U.S. Navy / Wikimedia Commons (পাবলিক ডোমেইন)" o={fadeIO(t, 9.4, 16.4)} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const Tease: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const items = [
    { n: "১", q: "কেন যায় মানুষ?", at: 0.2 },
    { n: "২", q: "দালাল কীভাবে ফাঁদ পাতে?", at: 2.0 },
    { n: "৩", q: "লিবিয়ার ক্যাম্পে কী হয়?", at: 4.1, stat: "ব্র্যাকের গবেষণা: লিবিয়া-ফেরতদের ৯৩% ক্যাম্পে আটক ছিলেন" },
    { n: "৪", q: "বৈধ পথ কোনটা?", at: 6.3 },
  ];
  return (
    <AbsoluteFill>
      <Clip src="px/seawatch.mp4" dur={10.8} filter="saturate(.5) brightness(.35)" fade={0.4} />
      <div style={{ position: "absolute", left: 120, top: 150 }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: RED, marginBottom: 10, opacity: fadeIO(t, 0, 10.8) }}>পুরো পর্বে</div>
        {items.map((it, i) => {
          const s = spring({ frame: f - S(it.at), fps, config: { damping: 15 } });
          return (
            <div key={i} style={{ marginTop: 22, opacity: Math.min(1, s * 1.4) * fadeIO(t, 0, 10.8), transform: `translateX(${(1 - s) * -40}px)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: GOLD, width: 60 }}>{it.n}</div>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: "#fff" }}>{it.q}</div>
              </div>
              {it.stat ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 27, color: SAND, marginLeft: 86 }}>{it.stat} <span style={{ color: "#9aa3a8" }}>(সূত্র: ডেইলি স্টার, ২৬ সেপ্টেম্বর ২০২৬)</span></div> : null}
            </div>
          );
        })}
      </div>
      <Credit text="উদ্ধারকারী জাহাজ Sea-Watch 2 · ছবি: Fabian Melber / Sea-Watch.org / Wikimedia Commons (CC BY-SA 4.0)" o={fadeIO(t, 0.3, 10.8)} />
    </AbsoluteFill>
  );
};

const Close: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f - 8, fps, config: { damping: 15 } }), b = spring({ frame: f - S(3.6), fps, config: { damping: 15 } });
  const end = t >= 9.4;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #13222b 0%, #070b0e 70%)" }}>
      {!end ? (
        <AbsoluteFill style={{ opacity: fadeIO(t, 0, 9.6, 0.4) }}>
          <div style={{ position: "absolute", left: 140, top: 170, right: 140 }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: GOLD, opacity: a }}>বিদেশ যাওয়ার আগে</div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "#fff", opacity: a, marginTop: 4 }}>কাজের কাগজ যাচাই করুন বিএমইটিতে</div>
            <div style={{ fontFamily: "Montserrat", fontWeight: 600, fontSize: 32, color: "#9fd3ff", opacity: a, marginTop: 4 }}>bmet.gov.bd</div>
            <div style={{ display: "flex", gap: 60, marginTop: 70, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>
              <div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, color: SAND }}>প্রবাসবন্ধু কল সেন্টার · দেশ থেকে (টোল-ফ্রি)</div>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1.05 }}>১৬১৩৫</div>
              </div>
              <div style={{ borderLeft: "2px solid rgba(255,255,255,.2)", paddingLeft: 60 }}>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, color: SAND }}>বিদেশ থেকে</div>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 76, color: "#fff", lineHeight: 1.5 }}>+৮৮০ ৯৬১০ ১০২০৩০</div>
              </div>
            </div>
          </div>
          <Source text="প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয় / ওয়েজ আর্নার্স কল্যাণ বোর্ড (ডেইলি স্টার বাংলা, বাংলা ট্রিবিউন)" o={b} bottom={150} left={140} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ opacity: interpolate(t, [9.4, 9.9, 13.0, 13.3], [0, 1, 1, 0], clamp), display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <Img src={staticFile("cob/logo-light.png")} style={{ height: 70, marginBottom: 40 }} />
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 86, color: "#fff" }}>লিবিয়া হয়ে ইউরোপ</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: RED, marginTop: 6 }}>পুরো পর্ব আসছে</div>
          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: "#a9b2b7", marginTop: 40 }}>সব তথ্যসূত্র ডেসক্রিপশনে · নিরাপদ অভিবাসনের তথ্য: প্রবাসী ইনফো</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------- audio ----------
const Mix: React.FC = () => {
  const vo = VO.map((v) => <Sequence key={v.id} from={S(v.at)} durationInFrames={S(v.len + 0.5)}><Audio src={A(`vo/${v.id}.mp3`)} volume={v.id === "voicenote" ? 0.9 : 1} /></Sequence>);
  const sfx = (src: string, at: number, vol: number, dur?: number, fi = 0, fo = 0) => (
    <Sequence from={S(at)} durationInFrames={dur ? S(dur) : undefined}>
      <Audio src={A(`sfx/${src}`)} volume={(f) => { const t = f / FPS; return vol * (fi ? Math.min(1, t / fi) : 1) * (fo && dur ? Math.min(1, (dur - t) / fo) : 1); }} />
    </Sequence>
  );
  return (
    <>
      {vo}
      <Sequence from={S(11.6)}>
        <Audio src={A("sfx/score.mp3")} volume={(f) => { const t = f / FPS + 11.6; const base = speaking(t) ? 0.17 : 0.34; return base * Math.min(1, (t - 11.6) / 1.5) * interpolate(t, [124, 127], [1, 0], clamp); }} />
      </Sequence>
      {sfx("sea.mp3", 0, 0.55, 13.0, 1.2, 1.6)}
      {sfx("engine.mp3", 0.2, 0.32, 12.0, 1.5, 1.4)}
      {sfx("wind.mp3", 0, 0.28, 12.6, 1, 1.5)}
      {sfx("boom.mp3", 11.7, 0.9)}
      {sfx("whoosh.mp3", 16.5, 0.5)}
      {sfx("whoosh.mp3", 29.5, 0.5)}
      {sfx("door.mp3", 58.5, 0.8)}
      {sfx("whoosh.mp3", 69.3, 0.45)}
      {sfx("sea.mp3", 69.6, 0.3, 16.6, 1.5, 1.5)}
      {sfx("engine.mp3", 77.2, 0.22, 3.6, 0.5, 0.8)}
      {sfx("boom.mp3", 86.0, 0.85)}
      {sfx("whoosh.mp3", 102.6, 0.4)}
    </>
  );
};

export const LibyaEp0: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={0} durationInFrames={S(11.8)}><ColdOpen /></Sequence>
    <Sequence from={S(11.8)} durationInFrames={S(5.0)}><Title /></Sequence>
    <Sequence from={S(16.8)} durationInFrames={S(13.0)}><Hook /></Sequence>
    <Sequence from={S(29.8)} durationInFrames={S(28.7)}><Route /></Sequence>
    <Sequence from={S(58.5)} durationInFrames={S(7.6)}><Room /></Sequence>
    <Sequence from={S(66.0)} durationInFrames={S(3.6)}><TripoliNight /></Sequence>
    <Sequence from={S(69.6)} durationInFrames={S(7.8)}><Crossing /></Sequence>
    <Sequence from={S(77.4)} durationInFrames={S(3.2)}><BoatNight /></Sequence>
    <Sequence from={S(80.4)} durationInFrames={S(6.0)}><Bill /></Sequence>
    <Sequence from={S(86.0)} durationInFrames={S(16.6)}><KeyNumber /></Sequence>
    <Sequence from={S(102.4)} durationInFrames={S(10.8)}><Tease /></Sequence>
    <Sequence from={S(113.4)} durationInFrames={S(13.6)}><Close /></Sequence>
    <Ledger until={80.3} />
    <Captions />
    <Grain />
    <Mix />
  </AbsoluteFill>
);
