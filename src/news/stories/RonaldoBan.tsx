// Sports story: জাতীয় দল থেকে নিষিদ্ধ রোনালদো (source: Samakal sports desk, 10 Oct 2026). VO = Sadia v4 (public/sportvo).
// Photos: Wikimedia Commons, CC BY / CC BY-SA — credited on screen (public/btl/ronaldo/credits.json).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { BN, bn, clamp, ease, Photo, Sfx, useSp, NewsStory, Segment, storyLen, COB_SPORTS_THEME } from "../NewsKit";

const T = COB_SPORTS_THEME;
const R = (f: string) => `btl/ronaldo/${f}`;
const CR: Record<string, string> = {
  captain: "Argentine_Portugal_Cristiano_Ronaldo.jpg", argue: "tugal_match_at_the_FIFA_World_Cup_2018_1.jpg", headhand: "naldo_with_Al_Nassr_19_September_2023_62.jpg",
  kneel: "naldo_with_Al_Nassr_19_September_2023_52.jpg", run: "_Iran_match_at_the_FIFA_World_Cup_2018_2.jpg", shoot: "naldo_with_Al_Nassr_19_September_2023_37.jpg",
};
const WHO: Record<string, string> = {
  captain: "Ludovic Péron, CC BY-SA 3.0", argue: "Mahdi Zare/Fars, CC BY 4.0", headhand: "Foad Ashtari, CC BY 4.0",
  kneel: "Mohammadreza Abbasi, CC BY 4.0", run: "Mahdi Zare/Fars, CC BY 4.0", shoot: "Mohammadreza Abbasi, CC BY 4.0",
};
const Pic: React.FC<{ k: string; origin?: string; from?: number; to?: number }> = ({ k, ...rest }) => <Photo src={R(CR[k])} credit={`ছবি: ${WHO[k]} · Wikimedia Commons`} {...rest} />;

const Glass: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const s = useSp(delay, 14);
  return <div style={{ padding: "22px 32px", borderRadius: 20, background: "rgba(3,20,10,.86)", border: `2px solid ${T.gold}55`, boxShadow: "0 30px 70px rgba(0,0,0,.55)", fontFamily: BN, color: "white", transform: `translateX(${(1 - s) * 140}px)`, opacity: s, ...style }}>{children}</div>;
};
const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 64, color = "white" }) => <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.15, color }}>{children}</div>;

// 1 — hero + BANNED stamp
const V1: React.FC = () => {
  const st = spring({ frame: useCurrentFrame() - 95, fps: 30, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      <Pic k="captain" origin="45% 30%" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 45%, rgba(0,0,0,.7))" }} />
      <div style={{ position: "absolute", right: 120, top: 330, transform: `rotate(-12deg) scale(${interpolate(st, [0, 1], [3, 1])})`, opacity: st, border: "12px solid #ff2a32", color: "#ff2a32", padding: "10px 40px", borderRadius: 18, fontFamily: BN, fontWeight: 700, fontSize: 150, textShadow: "0 0 30px rgba(255,0,0,.4)" }}>নিষিদ্ধ</div>
      <Sfx at={95} src="btlsfx/whistle.mp3" vol={0.6} />
    </AbsoluteFill>
  );
};

// 2 — FPF statement
const V2: React.FC = () => (
  <AbsoluteFill>
    <Pic k="argue" origin="35% 35%" />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 35%, rgba(2,12,6,.85) 65%)" }} />
    <div style={{ position: "absolute", right: 90, top: 150, width: 820, display: "flex", flexDirection: "column", gap: 20 }}>
      <Glass delay={10}><div style={{ fontSize: 28, color: T.gold, fontWeight: 700 }}>পর্তুগাল ফুটবল ফেডারেশন (এফপিএফ)</div><Big size={52}>“শৃঙ্খলাভঙ্গজনিত কার্যধারা শুরু হয়েছে”</Big></Glass>
      <Glass delay={130} style={{ fontSize: 40, fontWeight: 700 }}>⚖️ তদন্তে শৃঙ্খলা কমিটি</Glass>
      <Glass delay={230} style={{ fontSize: 40, fontWeight: 700 }}>⛔ সিদ্ধান্ত না আসা পর্যন্ত সব ম্যাচে নিষিদ্ধ</Glass>
    </div>
  </AbsoluteFill>
);

// 3 — what happened: timeline
const STEPS: [string, string, string][] = [["no", "নরওয়ে ম্যাচ", "পুরো ৯০ মিনিট বেঞ্চে"], ["🎒", "ম্যাচের এক দিন আগে", "ক্যাম্প ছাড়লেন রোনালদো"], ["dk", "ডেনমার্ক ম্যাচ", "দলে নেই অধিনায়ক"]];
const V3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Pic k="headhand" origin="40% 30%" from={1.1} to={1.2} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(2,12,6,.9) 0%, rgba(2,12,6,.6) 55%, transparent)" }} />
      <div style={{ position: "absolute", left: 110, top: 130, fontFamily: BN, color: "white" }}><Big size={76}>যেভাবে <span style={{ color: T.gold }}>বিতর্কের শুরু</span></Big></div>
      <div style={{ position: "absolute", left: 110, top: 280, display: "flex", flexDirection: "column", gap: 22 }}>
        {STEPS.map(([i, a, b], k) => {
          const s = spring({ frame: f - 20 - k * 85, fps: 30, config: { damping: 13 } });
          return (
            <div key={a} style={{ display: "flex", gap: 24, alignItems: "center", opacity: s, transform: `translateX(${(1 - s) * -160}px)`, fontFamily: BN }}>
              <div style={{ width: 92, height: 92, borderRadius: 22, background: T.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>{/^[a-z]{2}$/.test(i) ? <Img src={staticFile(`pi/flags/${i}.png`)} style={{ width: 64, borderRadius: 6 }} /> : i}</div>
              <div><div style={{ fontSize: 30, color: T.gold, fontWeight: 700 }}>{a}</div><div style={{ fontSize: 50, color: "white", fontWeight: 700 }}>{b}</div></div>
            </div>
          );
        })}
        <Glass delay={290} style={{ marginTop: 10, fontSize: 38, fontWeight: 700, width: 760 }}>কারণ: কোচ হোর্হে জেসুসের সঙ্গে মনোমালিন্য</Glass>
      </div>
    </AbsoluteFill>
  );
};

// 4 — apology + accusation
const V4: React.FC = () => (
  <AbsoluteFill>
    <Pic k="kneel" origin="60% 40%" />
    <div style={{ position: "absolute", left: 90, top: 120, width: 760, display: "flex", flexDirection: "column", gap: 18 }}>
      <Glass delay={10} style={{ fontSize: 42, fontWeight: 700 }}>🙏 ভুল স্বীকার, সমর্থকদের কাছে ক্ষমা</Glass>
      <Glass delay={150} style={{ fontSize: 42, fontWeight: 700 }}>⚠️ কোচের বিরুদ্ধে প্রতিশ্রুতি ভঙ্গের অভিযোগ</Glass>
      <Glass delay={265}><div style={{ fontSize: 28, color: T.gold, fontWeight: 700 }}>রোনালদো বললেন</div><Big size={44}>শাস্তি শেষে আবারও দেশের হয়ে লড়তে প্রস্তুত</Big></Glass>
    </div>
  </AbsoluteFill>
);

// 5 — possible punishment numbers
const V5: React.FC = () => {
  const f = useCurrentFrame();
  const cards: [string, string, string][] = [["নিষেধাজ্ঞা", "১–৬", "মাস"], ["জরিমানা", "€৫০০–১,০০০", ""], ["বয়স", "৪১", "বছর"]];
  return (
    <AbsoluteFill>
      <Pic k="run" origin="60% 40%" />
      <AbsoluteFill style={{ background: "rgba(2,12,6,.62)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: BN }}><Big size={70}>অভিযোগ প্রমাণিত হলে <span style={{ color: T.gold }}>শাস্তি</span></Big></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 40 }}>
        {cards.map(([a, b, c], i) => {
          const s = spring({ frame: f - 25 - i * 30, fps: 30, config: { damping: 12 } });
          return (
            <div key={a} style={{ width: 470, padding: "34px 30px", borderRadius: 26, background: i === 0 ? T.red : "rgba(3,20,10,.9)", border: `3px solid ${T.gold}`, textAlign: "center", fontFamily: BN, color: "white", transform: `scale(${s})`, opacity: s, boxShadow: `0 0 50px ${T.red}66` }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: i === 0 ? "white" : T.gold }}>{a}</div>
              <div style={{ fontSize: b.length > 6 ? 70 : 96, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap" }}>{b}</div>
              <div style={{ fontSize: 36, fontWeight: 700, opacity: 0.85 }}>{c || " "}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 6 — meanwhile: Portugal unbeaten, Ronaldo scores for Al Nassr, 980 career goals
const V6: React.FC = () => {
  const f = useCurrentFrame();
  const goals = Math.round(interpolate(f, [330, 420], [900, 980], { ...clamp, easing: ease }));
  const g = useSp(320, 12);
  return (
    <AbsoluteFill>
      <Pic k="shoot" origin="30% 50%" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 30%, rgba(2,12,6,.88) 62%)" }} />
      <div style={{ position: "absolute", right: 80, top: 120, width: 820, display: "flex", flexDirection: "column", gap: 20 }}>
        <Glass delay={10}>
          <div style={{ fontSize: 28, color: T.gold, fontWeight: 700 }}>নেশন্স লিগ · লিগ ‘এ’, গ্রুপ ৪</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}><Big size={50}><Img src={staticFile("pi/flags/pt.png")} style={{ width: 56, borderRadius: 6, marginRight: 12, verticalAlign: "middle" }} />পর্তুগাল</Big><div style={{ fontSize: 40, fontWeight: 700 }}>৪ ম্যাচ · ৪ জয় · <span style={{ color: T.gold }}>১২ পয়েন্ট</span></div></div>
          <div style={{ fontSize: 32, marginTop: 6 }}>✅ কোয়ার্টার ফাইনাল নিশ্চিত</div>
        </Glass>
        <Glass delay={170}>
          <div style={{ fontSize: 28, color: T.gold, fontWeight: 700 }}>সৌদি প্রো লিগ</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Big size={46}>আল নাসর</Big><div style={{ fontFamily: "Montserrat", fontWeight: 900, fontSize: 70, color: T.gold }}>3–0</div><Big size={46}>আল দিরিয়াহ</Big></div>
          <div style={{ fontSize: 32 }}>⚽ প্রথম গোল রোনালদোর</div>
        </Glass>
        <div style={{ transform: `scale(${g})`, opacity: g, padding: "24px 32px", borderRadius: 22, background: T.red, fontFamily: BN, color: "white", display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontSize: 36, fontWeight: 700 }}>ক্যারিয়ার গোল</span><span style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>{bn(goals)}</span>
        </div>
      </div>
      <Sfx at={170} src="btlsfx/crowd.mp3" vol={0.45} />
      <Sfx at={330} src="btlsfx/swoosh.mp3" vol={0.5} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 12);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${T.wall}, ${T.navy} 65%)`, justifyContent: "center", alignItems: "center", fontFamily: BN, color: "white" }}>
      <Img src={staticFile("cob/logo-light.png")} style={{ width: 720, transform: `scale(${s})` }} />
      <div style={{ marginTop: 16, fontSize: 52, fontWeight: 700, color: T.gold, opacity: interpolate(f, [20, 35], [0, 1], clamp) }}>খেলার আরও খবর পেতে সাথেই থাকুন</div>
      <div style={{ marginTop: 18, fontFamily: "Montserrat", fontWeight: 700, fontSize: 38, opacity: interpolate(f, [35, 50], [0, 1], clamp) }}>coloursofbangladesh.com</div>
      <div style={{ position: "absolute", bottom: 46, fontSize: 24, opacity: 0.7, textAlign: "center" }}>তথ্য: সমকাল (স্পোর্টস ডেস্ক) · ছবি: Wikimedia Commons — Ludovic Péron, Mahdi Zare/Fars, Foad Ashtari, Mohammadreza Abbasi (CC BY / CC BY-SA)</div>
    </AbsoluteFill>
  );
};

const VO_LEN = [338, 415, 432, 442, 331, 575];
const SEGMENTS: Segment[] = [
  { vo: "sportvo/01.mp3", voLen: VO_LEN[0], label: "খেলা", headline: "জাতীয় দল থেকে নিষিদ্ধ রোনালদো", zoom: 0.35, visual: V1, breaking: true },
  { vo: "sportvo/02.mp3", voLen: VO_LEN[1], label: "এফপিএফ", headline: "সিদ্ধান্ত না আসা পর্যন্ত সব ম্যাচে সাময়িক নিষেধাজ্ঞা", zoom: 1, visual: V2 },
  { vo: "sportvo/03.mp3", voLen: VO_LEN[2], label: "বিতর্ক", headline: "ডেনমার্ক ম্যাচের আগে ক্যাম্প ছাড়েন রোনালদো", zoom: 1, visual: V3 },
  { vo: "sportvo/04.mp3", voLen: VO_LEN[3], label: "রোনালদো", headline: "ভুল স্বীকার, কোচের বিরুদ্ধে প্রতিশ্রুতি ভঙ্গের অভিযোগ", zoom: 0.55, visual: V4 },
  { vo: "sportvo/05.mp3", voLen: VO_LEN[4], label: "শাস্তি", headline: "হতে পারে ১–৬ মাসের নিষেধাজ্ঞা ও জরিমানা", zoom: 1, visual: V5 },
  { vo: "sportvo/06.mp3", voLen: VO_LEN[5], label: "খেলা", headline: "রোনালদোকে ছাড়াই কোয়ার্টারে পর্তুগাল, ক্লাবে ফিরেই গোল", zoom: 1, visual: V6 },
];
const TICKER = [
  "জাতীয় দল থেকে সাময়িক নিষিদ্ধ ক্রিশ্চিয়ানো রোনালদো",
  "অনুমতি ছাড়া ক্যাম্প ছাড়ায় শৃঙ্খলা কমিটিতে তদন্ত",
  "টানা চার জয়ে নেশন্স লিগের কোয়ার্টার ফাইনালে পর্তুগাল",
  "আল নাসরের ৩–০ জয়ে গোল রোনালদোর, ক্যারিয়ারে ৯৮০ গোল",
  "কালারস অব বাংলাদেশ — খেলার খবর",
];
export const RONALDO_LEN = storyLen(SEGMENTS);
export const RonaldoBan: React.FC = () => (
  <NewsStory theme={COB_SPORTS_THEME} segments={SEGMENTS} ticker={TICKER} date="১২ অক্টোবর ২০২৬" music="sportmusic.mp3" tagline="খেলার খবর" outro={Outro} />
);
